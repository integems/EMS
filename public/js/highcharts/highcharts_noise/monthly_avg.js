// JavaScript Document

function calculateAverage(dataArray) {
    const linearValues = dataArray.map(value => Math.pow(10, value / 10));
    const sumLinearValues = linearValues.reduce((acc, value) => acc + value, 0);
    const N = dataArray.length;
    return parseFloat((10 * Math.log10(sumLinearValues / N)).toFixed(2));
}

function findExtremeValues(dataArray, type) {
    if (dataArray.length === 0) {
        return null;
    }

    let extremeValue = dataArray[0][type]; // Initialize with the first value

    for (let i = 1; i < dataArray.length; i++) { // Start loop from second element
        const currentValue = dataArray[i][type];
        if (type === 'LAFMax' && currentValue > extremeValue) {
            extremeValue = currentValue;
        } else if (type === 'LAFMin' && currentValue < extremeValue) {
            extremeValue = currentValue;
        }
    }

    return extremeValue;
}






// Fetch data from the API endpoint and plot the chart
fetch('api/noise/query_noise')
    .then(response => response.json())
    .then(data => {
        const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];


        const monthlyData = {};
        data.query_noise.forEach(record => {
            const monthIndex = new Date(record.start_date_time).getMonth();
            const monthName = months[monthIndex];


            if (!monthlyData[monthName]) {
                monthlyData[monthName] = {
                    LAeq: [],
                    LA10: [],
                    LA90: [],
                    LAFMax: [],
                    LAFMin: []
                };
            }


            monthlyData[monthName].LAeq.push(record.LAeq);
            monthlyData[monthName].LA10.push(record.LA10);
            monthlyData[monthName].LA90.push(record.LA90);
            monthlyData[monthName].LAFMax.push(record.LAFMax);
            monthlyData[monthName].LAFMin.push(record.LAFMin);
        });


        // Calculate monthly averages and extreme values
        const monthlyAverages = [];
        const maxLAFMax = [];
        const minLAFMin = [];
        months.forEach(monthName => {
            if (monthlyData[monthName]) {
                const LAeqAvg = calculateAverage(monthlyData[monthName].LAeq);
                const LA10Avg = calculateAverage(monthlyData[monthName].LA10);
                const LA90Avg = calculateAverage(monthlyData[monthName].LA90);

                // Convert arrays of numbers to arrays of objects with the correct property
                const LAFMaxObjects = monthlyData[monthName].LAFMax.map(value => ({ LAFMax: value }));
                const LAFMinObjects = monthlyData[monthName].LAFMin.map(value => ({ LAFMin: value }));

                // Find extreme values using the updated arrays of objects
                const LAFMaxMax = findExtremeValues(LAFMaxObjects, 'LAFMax');
                const LAFMinMax = findExtremeValues(LAFMinObjects, 'LAFMin');

                monthlyAverages.push({
                    month: monthName,
                    LAeq: LAeqAvg,
                    LA10: LA10Avg,
                    LA90: LA90Avg
                });
                maxLAFMax.push({ month: monthName, value: LAFMaxMax });
                minLAFMin.push({ month: monthName, value: LAFMinMax });
            }
            // console.log(maxLAFMax);
            // console.log(minLAFMin);
        });




        // Plot the data using Highcharts
        Highcharts.chart('monthly_average', {
            chart: {
                type: 'column'
            },
            title: {
                text: 'Monthly Noise Averages'
            },
            xAxis: {
                categories: monthlyAverages.map(item => item.month)
            },
            yAxis: {
                title: {
                    text: 'Noise Levels (dB)'
                }
            },
            series: [{
                name: 'LAeq',
                data: monthlyAverages.map(item => item.LAeq)
            }, {
                name: 'LA10',
                data: monthlyAverages.map(item => item.LA10)
            }, {
                name: 'LA90',
                data: monthlyAverages.map(item => item.LA90)
            }, {
                name: 'Max LAFMax',
                data: maxLAFMax.map(item => [item.month, item.value]),
                color: 'red'
            }, {
                name: 'Min LAFMin',
                data: minLAFMin.map(item => [item.month, item.value]),
                color: 'green'
            }]
        });
    })
    .catch(error => console.error('Error fetching data:', error));