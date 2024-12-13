document.addEventListener('DOMContentLoaded', async () => {
    // Fetch data from API endpoint
    async function fetchData() {
        const response = await fetch('/api/air_quality/query_air_quality');
        const data = await response.json();
        return data.query;
    }

    // Format data for Highcharts
    function formatData(rawData, parameter) {
        return rawData.map(entry => ({
            x: new Date(entry.date).getTime(),
            y: entry[parameter]
        })).sort((a, b) => a.x - b.x);
    }

    // Populate dropdown options
    async function populateDropdowns(rawData) {
        const orgSelect = document.getElementById('orgSelect');
        const yearSelect = document.getElementById('yearSelect');

        // Populate monitoring locations
        const uniqueLocations = [...new Set(rawData.map(entry => entry.org_specific_monitoring_id))];
        uniqueLocations.forEach(location => {
            const option = document.createElement('option');
            option.value = location;
            option.textContent = location;
            orgSelect.appendChild(option);
        });

        // Populate years
        const uniqueYears = [...new Set(rawData.map(entry => new Date(entry.date).getFullYear()))];
        uniqueYears.forEach(year => {
            const option = document.createElement('option');
            option.value = year;
            option.textContent = year;
            yearSelect.appendChild(option);
        });
    }

    // Initialize Highcharts
    function initializeChart(data) {
        Highcharts.chart('container', {
            chart: {
                type: 'line'
            },
            title: {
                text: 'Air Quality Monitoring Data'
            },
            xAxis: {
                type: 'datetime',
                title: {
                    text: 'Date'
                }
            },
            yAxis: {
                title: {
                    text: 'Value'
                }
            },
            tooltip: {
                shared: true,
                crosshairs: true,
                xDateFormat: '%Y-%m-%d'
            },
            series: [
                {
                    name: 'CO (ppm)',
                    data: formatData(data, 'CO_ppm')
                },
                {
                    name: 'NO2 (ppm)',
                    data: formatData(data, 'NO2_ppm')
                },
                {
                    name: 'PM10 (ppm)',
                    data: formatData(data, 'PM10_ppm')
                },
                {
                    name: 'PM2.5 (ppm)',
                    data: formatData(data, 'PM2_5_ppm')
                },
                {
                    name: 'SO2 (ppm)',
                    data: formatData(data, 'SO2_ppm')
                }
            ]
        });
    }

    // Handle dropdown change
    async function handleDropdownChange() {
        const rawData = await fetchData();
        const orgSelect = document.getElementById('orgSelect').value;
        const yearSelect = document.getElementById('yearSelect').value;

        const filteredData = rawData.filter(entry =>
            entry.org_specific_monitoring_id === orgSelect &&
            new Date(entry.date).getFullYear().toString() === yearSelect
        );

        initializeChart(filteredData);
    }

    // Fetch data and initialize
    const rawData = await fetchData();
    await populateDropdowns(rawData);
    document.getElementById('orgSelect').addEventListener('change', handleDropdownChange);
    document.getElementById('yearSelect').addEventListener('change', handleDropdownChange);
    initializeChart(rawData); // Default chart
});
