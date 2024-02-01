// JavaScript Document

document.addEventListener("DOMContentLoaded", function () {
    // Fetch data from the server
    fetch('http://localhost:3000/api/air_quality/date_time')
        .then(response => response.json())
        .then(data => {
            // Check if 'date_time' property exists and is an array
            if (!data || !Array.isArray(data.date_time)) {
                console.error('Invalid data format. Expected an array under the "date_time" property.');
                return;
            }

            // Extract relevant data for the chart
            const airQualityData = data.date_time;

            // Sort the data by date_time in ascending order
            airQualityData.sort((a, b) => new Date(a.date_time) - new Date(b.date_time));

            // Prepare data series for each parameter
            const parameters = ['CO(ppm)', 'NO2(ppm)', 'PM10(ppm)', 'PM2_5(ppm)', 'RH(%)', 'SO2(ppm)', 'temp(C)'];
            const seriesData = parameters.map((parameter, index) => ({
                name: parameter,
                data: airQualityData.map(entry => ({
                    x: new Date(entry.date_time).getTime(),
                    y: entry[parameter]
                })),
                color: Highcharts.getOptions().colors[index]
            }));

            // Create the Highcharts line chart
            Highcharts.chart('air_quality_line_chart', {
                chart: {
                    type: 'line'
                },
                title: {
                    text: 'Air Quality Time Series Line Chart'
                },
                xAxis: {
                    type: 'datetime',
                    dateTimeLabelFormats: {
                        day: '%Y-%m-%d'
                    },
                    title: {
                        text: 'Date'
                    }
                },
                yAxis: {
                    title: {
                        text: 'Air Quality Values'
                    }
                },
                series: seriesData,
                // Include accessibility module
                accessibility: {
                    enabled: true
                }
            });
        })
        .catch(error => {
            console.error('Error fetching data:', error);
        });
});