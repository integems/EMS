// JavaScript Document
document.addEventListener("DOMContentLoaded", function () {
    // Fetch data from the server action
    fetch('http://localhost:3000/api/noise/average_LAeq_location')
        .then(response => response.json())
        .then(data => {
            // Check if 'noise' property exists and is an array
            if (!data || !Array.isArray(data.noise)) {
                console.error('Invalid data format. Expected an array under the "noise" property.');
                return;
            }

            // Extract relevant data for the chart
            const noiseData = data.noise;
            const categories = noiseData.map(entry => entry.description);
            const values = noiseData.map(entry => entry.avgLAeq);

            // Create the Highcharts chart
            Highcharts.chart('noise_chart', {
                chart: {
                    type: 'bar'
                },
                title: {
                    text: 'Average Noise Levels (LAeq) by Location'
                },
                xAxis: {
                    categories: categories,
                    title: {
                        text: 'Location'
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
