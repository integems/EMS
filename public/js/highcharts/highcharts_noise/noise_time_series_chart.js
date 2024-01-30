// JavaScript Document
//Time series chart  - Noise Levels - 30 days - Highcharts
document.addEventListener("DOMContentLoaded", function () {
    // Fetch data from the server
    fetch('http://localhost:3000/api/noise/date/time')
        .then(response => response.json())
        .then(data => {
            // Check if 'date_time' property exists and is an array
            if (!data || !Array.isArray(data.date_time)) {
                console.error('Invalid data format. Expected an array under the "date_time" property.');
                return;
            }

            // Extract relevant data for the chart
            const dateData = data.date_time;

            // Sort the data by start_date_time in ascending order
            dateData.sort((a, b) => new Date(a.start_date_time) - new Date(b.start_date_time));

            // Prepare data series for each parameter
            const parameters = ['LAeq', 'LA90', 'LA10', 'LAFMax', 'LAFMin'];
            const seriesData = parameters.map(parameter => ({
                name: parameter,
                data: dateData.map(entry => ({
                    x: new Date(entry.start_date_time).getTime(),
                    y: entry[parameter]
                }))
            }));

            // Create the Highcharts time series chart
            Highcharts.chart('time_series_chart', {
                chart: {
                    type: 'line'
                },
                title: {
                    text: 'Noise Levels - Past 30 Days'
                },
                xAxis: {
                    type: 'datetime',
                    dateTimeLabelFormats: {
                        day: '%d/%m/%Y %H:%M:%S'
                    },
                    title: {
                        text: 'Date/Time'
                    }
                },
                yAxis: {
                    title: {
                        text: 'Noise Levels'
                    }
                },
                series: seriesData,
                accessibility: {
                    enabled: true
                }
            });
        })
        .catch(error => {
            console.error('Error fetching data:', error);
        });
});
