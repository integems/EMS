// Air Quality JS

// document.addEventListener('DOMContentLoaded', () => {
//     const monthlyChartContainer = document.getElementById('monthly_column_chart');
//     const quarterlyChartContainer = document.getElementById('quarterly_column_chart');
//     const timeSeriesChartContainer = document.getElementById('time_series_chart_all');
//     const yearSelect = document.getElementById('select_year');
//     const orgSelect = document.getElementById('select_monitoring_location');

//     // Helper function to get month names
//     function getMonthName(monthIndex) {
//         const monthNames = [
//             'January', 'February', 'March', 'April', 'May', 'June',
//             'July', 'August', 'September', 'October', 'November', 'December'
//         ];
//         return monthNames[monthIndex];
//     }

//     // Fetch air quality data
//     function fetchAirQualityData() {
//         return fetch('/api/air_quality/query_air_quality')
//             .then(response => {
//                 if (!response.ok) {
//                     throw new Error(`HTTP error! status: ${response.status}`);
//                 }
//                 return response.json();
//             })
//             .then(result => result.query || [])
//             .catch(error => {
//                 console.error('Error fetching air quality data:', error);
//                 return [];
//             });
//     }

//     // Aggregate data by month or quarter
//     function aggregateData(data, interval) {
//         const grouped = data.reduce((acc, item) => {
//             const date = new Date(item.date);
//             const year = date.getFullYear();
//             const month = date.getMonth(); // 0 = January
//             const quarter = Math.floor(month / 3) + 1;

//             let key;
//             if (interval === 'monthly') {
//                 key = `${year}-${getMonthName(month)}`; // e.g., "2023-January"
//             } else if (interval === 'quarterly') {
//                 key = `${year}-Q${quarter}`; // e.g., "2023-Q1"
//             }

//             if (!acc[key]) {
//                 acc[key] = {
//                     key,
//                     count: 0,
//                     CO_ppm: 0,
//                     NO2_ppm: 0,
//                     PM10_ppm: 0,
//                     PM2_5_ppm: 0,
//                     RH_percentage: 0,
//                     SO2_ppm: 0,
//                     temp_C: 0,
//                 };
//             }

//             acc[key].count += 1;
//             acc[key].CO_ppm += item.CO_ppm;
//             acc[key].NO2_ppm += item.NO2_ppm;
//             acc[key].PM10_ppm += item.PM10_ppm;
//             acc[key].PM2_5_ppm += item.PM2_5_ppm;
//             acc[key].RH_percentage += item.RH_percentage;
//             acc[key].SO2_ppm += item.SO2_ppm;
//             acc[key].temp_C += item.temp_C;

//             return acc;
//         }, {});

//         return Object.values(grouped).map(group => ({
//             key: group.key,
//             CO_ppm: group.CO_ppm / group.count,
//             NO2_ppm: group.NO2_ppm / group.count,
//             PM10_ppm: group.PM10_ppm / group.count,
//             PM2_5_ppm: group.PM2_5_ppm / group.count,
//             RH_percentage: group.RH_percentage / group.count,
//             SO2_ppm: group.SO2_ppm / group.count,
//             temp_C: group.temp_C / group.count,
//         }));
//     }

//     // Render column charts
//     function renderColumnChart(container, title, data, interval) {
//         const categories = data.map(item => item.key);
//         const series = [
//             { name: 'CO (ppm)', data: data.map(item => item.CO_ppm) },
//             { name: 'NO2 (ppm)', data: data.map(item => item.NO2_ppm) },
//             { name: 'PM10 (ppm)', data: data.map(item => item.PM10_ppm) },
//             { name: 'PM2.5 (ppm)', data: data.map(item => item.PM2_5_ppm) },
//             { name: 'Relative Humidity (%)', data: data.map(item => item.RH_percentage) },
//             { name: 'SO2 (ppm)', data: data.map(item => item.SO2_ppm) },
//             { name: 'Temperature (°C)', data: data.map(item => item.temp_C) },
//         ];

//         Highcharts.chart(container, {
//             chart: {
//                 type: 'column',
//             },
//             title: {
//                 text: title,
//             },
//             xAxis: {
//                 categories,
//                 title: {
//                     text: interval === 'monthly' ? 'Months' : 'Quarters',
//                 },
//             },
//             yAxis: {
//                 min: 0,
//                 title: {
//                     text: 'Values',
//                 },
//             },
//             tooltip: {
//                 shared: true,
//                 crosshairs: true,
//                 valueDecimals: 2,
//             },
//             series,
//         });
//     }

//     // Render time series chart
//     function renderTimeSeriesChart(data) {
//         const series = [
//             { name: 'CO (ppm)', data: data.map(item => [new Date(item.date).getTime(), item.CO_ppm]) },
//             { name: 'NO2 (ppm)', data: data.map(item => [new Date(item.date).getTime(), item.NO2_ppm]) },
//             { name: 'PM10 (ppm)', data: data.map(item => [new Date(item.date).getTime(), item.PM10_ppm]) },
//             { name: 'PM2.5 (ppm)', data: data.map(item => [new Date(item.date).getTime(), item.PM2_5_ppm]) },
//             { name: 'Relative Humidity (%)', data: data.map(item => [new Date(item.date).getTime(), item.RH_percentage]) },
//             { name: 'SO2 (ppm)', data: data.map(item => [new Date(item.date).getTime(), item.SO2_ppm]) },
//             { name: 'Temperature (°C)', data: data.map(item => [new Date(item.date).getTime(), item.temp_C]) },
//         ];

//         Highcharts.chart(timeSeriesChartContainer, {
//             chart: {
//                 type: 'line',
//                 zoomType: 'x',
//             },
//             title: {
//                 text: 'Time Series Data',
//             },
//             xAxis: {
//                 type: 'datetime',
//                 title: {
//                     text: 'Date',
//                 },
//             },
//             yAxis: {
//                 title: {
//                     text: 'Values',
//                 },
//             },
//             tooltip: {
//                 shared: true,
//                 crosshairs: true,
//                 valueDecimals: 2,
//             },
//             series,
//         });
//     }

//     // Initialize charts
//     async function initializeCharts() {
//         try {
//             const airQualityData = await fetchAirQualityData();

//             // Add event listeners for year and location filters
//             function updateCharts() {
//                 const selectedYear = yearSelect.value;
//                 const selectedLocation = orgSelect.value;

//                 const filteredData = airQualityData.filter(item => {
//                     const itemYear = new Date(item.date).getFullYear();
//                     return (!selectedYear || itemYear === parseInt(selectedYear)) &&
//                         (!selectedLocation || item.location_id === parseInt(selectedLocation));
//                 });

//                 const monthlyData = aggregateData(filteredData, 'monthly');
//                 const quarterlyData = aggregateData(filteredData, 'quarterly');

//                 renderColumnChart(monthlyChartContainer, 'Monthly Data', monthlyData, 'monthly');
//                 renderColumnChart(quarterlyChartContainer, 'Quarterly Data', quarterlyData, 'quarterly');
//                 renderTimeSeriesChart(filteredData);
//             }

//             yearSelect.addEventListener('change', updateCharts);
//             orgSelect.addEventListener('change', updateCharts);

//             // Initial render
//             updateCharts();
//         } catch (error) {
//             console.error('Error initializing charts:', error);
//         }
//     }

//     initializeCharts();
// });


//-----------------------v 2.0-----------------------------------------------------------------------------------------------

document.addEventListener('DOMContentLoaded', () => {
    const monthlyChartContainer = document.getElementById('monthly_column_chart');
    const quarterlyChartContainer = document.getElementById('quarterly_column_chart');
    const timeSeriesChartContainer = document.getElementById('time_series_chart_all');
    const yearSelect = document.getElementById('select_year');
    const orgSelect = document.getElementById('select_monitoring_location');

    // Helper function to get month names
    function getMonthName(monthIndex) {
        const monthNames = [
            'January', 'February', 'March', 'April', 'May', 'June',
            'July', 'August', 'September', 'October', 'November', 'December'
        ];
        return monthNames[monthIndex];
    }

    // Fetch air quality data
    function fetchAirQualityData() {
        return fetch('/api/air_quality/query_air_quality')
            .then(response => {
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                return response.json();
            })
            .then(result => result.query || [])
            .catch(error => {
                console.error('Error fetching air quality data:', error);
                return [];
            });
    }

    // Populate year dropdown with unique years
    function populateYearDropdown(data) {
        const years = [...new Set(data.map(item => new Date(item.date).getFullYear()))].sort();
        yearSelect.innerHTML = '<option value="">All Years</option>'; // Default option for all years

        years.forEach(year => {
            const option = document.createElement('option');
            option.value = year;
            option.textContent = year;
            yearSelect.appendChild(option);
        });

        // Set the default to the most recent year
        if (years.length > 0) {
            yearSelect.value = years[years.length - 1];  // Set the default to the latest year
        }
    }

    // Aggregate data by month or quarter
    function aggregateData(data, interval) {
        const grouped = data.reduce((acc, item) => {
            const date = new Date(item.date);
            const year = date.getFullYear();
            const month = date.getMonth();
            const quarter = Math.floor(month / 3) + 1;

            let key;
            if (interval === 'monthly') {
                key = `${year}-${getMonthName(month)}`;
            } else if (interval === 'quarterly') {
                key = `${year}-Q${quarter}`;
            }

            if (!acc[key]) {
                acc[key] = {
                    key,
                    count: 0,
                    CO_ppm: 0,
                    NO2_ppm: 0,
                    PM10_ppm: 0,
                    PM2_5_ppm: 0,
                    RH_percentage: 0,
                    SO2_ppm: 0,
                    temp_C: 0,
                };
            }

            acc[key].count += 1;
            acc[key].CO_ppm += item.CO_ppm;
            acc[key].NO2_ppm += item.NO2_ppm;
            acc[key].PM10_ppm += item.PM10_ppm;
            acc[key].PM2_5_ppm += item.PM2_5_ppm;
            acc[key].RH_percentage += item.RH_percentage;
            acc[key].SO2_ppm += item.SO2_ppm;
            acc[key].temp_C += item.temp_C;

            return acc;
        }, {});

        return Object.values(grouped).map(group => ({
            key: group.key,
            CO_ppm: group.CO_ppm / group.count,
            NO2_ppm: group.NO2_ppm / group.count,
            PM10_ppm: group.PM10_ppm / group.count,
            PM2_5_ppm: group.PM2_5_ppm / group.count,
            RH_percentage: group.RH_percentage / group.count,
            SO2_ppm: group.SO2_ppm / group.count,
            temp_C: group.temp_C / group.count,
        }));
    }

    // Render column charts with dynamic titles
    function renderColumnChart(container, baseTitle, data, interval, selectedYear, selectedLocationName) {
        const categories = data.map(item => item.key);
        const series = [
            { name: 'CO (ppm)', data: data.map(item => item.CO_ppm) },
            { name: 'NO2 (ppm)', data: data.map(item => item.NO2_ppm) },
            { name: 'PM10 (ppm)', data: data.map(item => item.PM10_ppm) },
            { name: 'PM2.5 (ppm)', data: data.map(item => item.PM2_5_ppm) },
            { name: 'Relative Humidity (%)', data: data.map(item => item.RH_percentage) },
            { name: 'SO2 (ppm)', data: data.map(item => item.SO2_ppm) },
            { name: 'Temperature (°C)', data: data.map(item => item.temp_C) },
        ];

        const locationTitle = selectedLocationName ? ` - ${selectedLocationName}` : '';
        const yearTitle = selectedYear ? ` (${selectedYear})` : ' (All Years)';
        const dynamicTitle = `${baseTitle}${locationTitle}${yearTitle}`;

        Highcharts.chart(container, {
            chart: {
                type: 'column',
            },
            title: {
                text: dynamicTitle,
            },
            xAxis: {
                categories,
                title: {
                    text: interval === 'monthly' ? 'Months' : 'Quarters',
                },
            },
            yAxis: {
                min: 0,
                title: {
                    text: 'Values',
                },
            },
            tooltip: {
                shared: true,
                crosshairs: true,
                valueDecimals: 2,
            },
            series,
        });
    }

    // Render time series chart with dynamic title
    function renderTimeSeriesChart(data, selectedYear, selectedLocationName) {
        const series = [
            { name: 'CO (ppm)', data: data.map(item => [new Date(item.date).getTime(), item.CO_ppm]) },
            { name: 'NO2 (ppm)', data: data.map(item => [new Date(item.date).getTime(), item.NO2_ppm]) },
            { name: 'PM10 (ppm)', data: data.map(item => [new Date(item.date).getTime(), item.PM10_ppm]) },
            { name: 'PM2.5 (ppm)', data: data.map(item => [new Date(item.date).getTime(), item.PM2_5_ppm]) },
            { name: 'Relative Humidity (%)', data: data.map(item => [new Date(item.date).getTime(), item.RH_percentage]) },
            { name: 'SO2 (ppm)', data: data.map(item => [new Date(item.date).getTime(), item.SO2_ppm]) },
            { name: 'Temperature (°C)', data: data.map(item => [new Date(item.date).getTime(), item.temp_C]) },
        ];

        const locationTitle = selectedLocationName ? ` - ${selectedLocationName}` : '';
        const yearTitle = selectedYear ? ` (${selectedYear})` : ' (All Years)';
        const dynamicTitle = `Time Series Data${locationTitle}${yearTitle}`;

        Highcharts.chart(timeSeriesChartContainer, {
            chart: {
                type: 'line',
                zoomType: 'x',
            },
            title: {
                text: dynamicTitle,
            },
            xAxis: {
                type: 'datetime',
                title: {
                    text: 'Date',
                },
            },
            yAxis: {
                title: {
                    text: 'Values',
                },
            },
            tooltip: {
                shared: true,
                crosshairs: true,
                valueDecimals: 2,
            },
            series,
        });
    }

    // Initialize charts
    async function initializeCharts() {
        try {
            const airQualityData = await fetchAirQualityData();

            // Populate the year dropdown and set the default to the most recent year
            populateYearDropdown(airQualityData);

            // Get the location names map (map location_id to name)
            const locationNames = new Map();
            airQualityData.forEach(item => {
                locationNames.set(item.location_id, `${item.org_specific_monitoring_id} - ${item.description}`);
            });

            // Add event listeners for year and location filters
            function updateCharts() {
                const selectedYear = yearSelect.value;
                const selectedLocation = orgSelect.value;

                // Get the selected location name
                const selectedLocationName = selectedLocation ? locationNames.get(parseInt(selectedLocation)) : '';

                const filteredData = airQualityData.filter(item => {
                    const itemYear = new Date(item.date).getFullYear();
                    return (!selectedYear || itemYear === parseInt(selectedYear)) &&
                        (!selectedLocation || item.location_id === parseInt(selectedLocation));
                });

                const monthlyData = aggregateData(filteredData, 'monthly');
                const quarterlyData = aggregateData(filteredData, 'quarterly');

                renderColumnChart(monthlyChartContainer, 'Monthly Data', monthlyData, 'monthly', selectedYear, selectedLocationName);
                renderColumnChart(quarterlyChartContainer, 'Quarterly Data', quarterlyData, 'quarterly', selectedYear, selectedLocationName);
                renderTimeSeriesChart(filteredData, selectedYear, selectedLocationName);
            }

            yearSelect.addEventListener('change', updateCharts);
            orgSelect.addEventListener('change', updateCharts);

            // Initial render
            updateCharts();
        } catch (error) {
            console.error('Error initializing charts:', error);
        }
    }

    initializeCharts();
});

