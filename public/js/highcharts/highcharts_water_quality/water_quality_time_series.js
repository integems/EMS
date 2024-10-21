
let waterData = [];

// Fetch water quality data from the API
async function fetchWaterData() {
    try {
        const response = await fetch('/api/water_quality/query_water_data');
        const data = await response.json();
        waterData = data.query_water;
        populateLocationSelect(waterData);
        createCharts(waterData);
    } catch (error) {
        console.error('Error fetching data:', error);
    }
}

// Populate the location dropdown based on 'org_specific_monitoring_id' and 'description'
function populateLocationSelect(data) {
    const orgSelect = document.getElementById('orgSelect');
    const uniqueLocations = [...new Set(data.map(item => `${item.org_specific_monitoring_id} - ${item.description}`))];

    uniqueLocations.forEach(location => {
        const option = document.createElement('option');
        option.value = location;
        option.textContent = location;
        orgSelect.appendChild(option);
    });
}

// Filter data by selected location and recreate the charts
function filterByLocation() {
    const selectedLocation = document.getElementById('orgSelect').value;
    const [orgId] = selectedLocation.split(' - '); // Extract the org_specific_monitoring_id
    const filteredData = waterData.filter(item => item.org_specific_monitoring_id === orgId);
    createCharts(filteredData);
}

// Create the time series charts for temperature, pH, DO, and turbidity
function createCharts(data) {
    if (!data.length) {
        console.warn('No data available for the selected location.');
        return;
    }

    // Sort the data by date to ensure proper date order
    data.sort((a, b) => new Date(a.date) - new Date(b.date));

    // Find the latest date in the data and calculate three months prior to it
    const latestDate = new Date(data[data.length - 1].date);
    const threeMonthsAgo = new Date(latestDate);
    threeMonthsAgo.setMonth(threeMonthsAgo.getMonth() - 3);

    // Filter data to include only the last three months of available data
    const filteredData = data.filter(item => {
        const itemDate = new Date(item.date);
        return itemDate >= threeMonthsAgo && itemDate <= latestDate;
    });

    if (!filteredData.length) {
        console.warn('No data available for the last 3 months of records.');
        return;
    }

    const dates = filteredData.map(item => item.date);
    const temperatures = filteredData.map(item => parseFloat(item.temperature));
    const pHValues = filteredData.map(item => parseFloat(item.pH));
    const doValues = filteredData.map(item => parseFloat(item.DO_ppm));
    const turbidityValues = filteredData.map(item => parseFloat(item.turbidity_FNU));

    // Check for parsed values to ensure correctness
    // console.log('Filtered Dates:', dates);
    // console.log('Temperatures:', temperatures);
    // console.log('pH Values:', pHValues);
    // console.log('DO Values:', doValues);
    // console.log('Turbidity Values:', turbidityValues);

    Highcharts.chart('tempChart', {
        title: { text: 'Temperature Over the Last 3 Months of Data' },
        xAxis: { categories: dates, title: { text: 'Date' } },
        yAxis: { title: { text: 'Temperature (°C)' } },
        series: [{ name: 'Temperature', data: temperatures }],
        chart: { type: 'line' }
    });

    Highcharts.chart('phChart', {
        title: { text: 'pH Over the Last 3 Months of Data' },
        xAxis: { categories: dates, title: { text: 'Date' } },
        yAxis: { title: { text: 'pH Level' } },
        series: [{ name: 'pH', data: pHValues }],
        chart: { type: 'line' }
    });

    Highcharts.chart('doChart', {
        title: { text: 'Dissolved Oxygen (DO) Over the Last 3 Months of Data' },
        xAxis: { categories: dates, title: { text: 'Date' } },
        yAxis: { title: { text: 'DO (ppm)' } },
        series: [{ name: 'Dissolved Oxygen', data: doValues }],
        chart: { type: 'line' }
    });

    Highcharts.chart('turbidityChart', {
        title: { text: 'Turbidity Over the Last 3 Months of Data' },
        xAxis: { categories: dates, title: { text: 'Date' } },
        yAxis: { title: { text: 'Turbidity (FNU)' } },
        series: [{ name: 'Turbidity', data: turbidityValues }],
        chart: { type: 'line' }
    });
}

// Event listener for location selection change
document.getElementById('orgSelect').addEventListener('change', filterByLocation);

// Initial fetch of water data
fetchWaterData();

