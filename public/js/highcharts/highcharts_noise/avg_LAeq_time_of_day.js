// JavaScript Document
document.addEventListener("DOMContentLoaded", function () {
    // Fetch data from the server action
    fetch('http://localhost:3000/api/noise/average_LAeq_timeofday')
        .then(response => response.json())
        .then(data => {
            // Check if 'time_of_day' property exists and is an array
            if (!data || !Array.isArray(data.time_of_day)) {
                console.error('Invalid data format. Expected an array under the "time_of_day" property.');
                return;
            }

            // Extract relevant data for the chart
            const timeOfDayData = data.time_of_day;
            const categories = timeOfDayData.map(entry => entry.time_of_day);
            const values = timeOfDayData.map(entry => entry['avg(LAeq)']);

            // Create the Highcharts chart for time of day
            Highcharts.chart('time_of_day_chart', {
                chart: {
                    type: 'column' // Using column chart for time of day
                },
                title: {
                    text: 'Average Noise Levels (LAeq) by Time of Day'
                },
                xAxis: {
                    categories: categories,
                    title: {
                        text: 'Time of Day'
                    }
                },
                yAxis: {
                    title: {
                        text: 'Average LAeq'
                    }
                },
                series: [{
                    name: 'LAeq',
                    data: values
                }]

            });
        })
        .catch(error => {
            console.error('Error fetching data:', error);
        });
});
