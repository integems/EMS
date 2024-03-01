// JavaScript Document
//Time series chart
document.addEventListener("DOMContentLoaded", function () {
    // Fetch data from the server
    fetch('api/noise/data_by_date')
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
                    text: 'Noise Levels'
                },
                xAxis: {
                    type: 'datetime',
                    dateTimeLabelFormats: {
                        day: '%d/%m/%Y'
                    },
                    title: {
                        text: 'Date/Time'
                    }
                },
                yAxis: {
                    title: {
                        text: 'Noise Levels (dB)'
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

