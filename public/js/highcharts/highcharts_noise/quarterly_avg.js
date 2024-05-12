// JavaScript Document

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

        const quarterlyData = {}; // Object to store quarterly data
        data.query_noise.forEach(record => {
            const quarter = Math.floor(new Date(record.start_date_time).getMonth() / 3) + 1;
            const quarterName = 'Q' + quarter;

            // Initialize data for the quarter if not already present
            if (!quarterlyData[quarterName]) {
                quarterlyData[quarterName] = {
                    LAeq: [],
                    LA10: [],
                    LA90: [],
                    LAFMax: [],
                    LAFMin: []
                };
            }

            // Push values for each parameter
            quarterlyData[quarterName].LAeq.push(record.LAeq);
            quarterlyData[quarterName].LA10.push(record.LA10);
            quarterlyData[quarterName].LA90.push(record.LA90);
            quarterlyData[quarterName].LAFMax.push(record.LAFMax);
            quarterlyData[quarterName].LAFMin.push(record.LAFMin);
        });

        // Calculate quarterly averages and extreme values
        const quarterlyAverages = [];
        const maxLAFMax = [];
        const minLAFMin = [];
        for (const quarterName in quarterlyData) {
            if (quarterlyData.hasOwnProperty(quarterName)) {
                const LAeqAvg = calculateAverage(quarterlyData[quarterName].LAeq);
                const LA10Avg = calculateAverage(quarterlyData[quarterName].LA10);
                const LA90Avg = calculateAverage(quarterlyData[quarterName].LA90);

                // Convert arrays of numbers to arrays of objects with the correct property
                const LAFMaxObjects = quarterlyData[quarterName].LAFMax.map(value => ({ LAFMax: value }));
                const LAFMinObjects = quarterlyData[quarterName].LAFMin.map(value => ({ LAFMin: value }));

                // Find extreme values using the updated arrays of objects
                const LAFMaxMax = findExtremeValues(LAFMaxObjects, 'LAFMax');
                const LAFMinMax = findExtremeValues(LAFMinObjects, 'LAFMin');

                quarterlyAverages.push({
                    quarter: quarterName,
                    LAeq: LAeqAvg,
                    LA10: LA10Avg,
                    LA90: LA90Avg
                });
                maxLAFMax.push({ quarter: quarterName, value: LAFMaxMax });
                minLAFMin.push({ quarter: quarterName, value: LAFMinMax });
            }
        }

        // Plot the data using Highcharts
        Highcharts.chart('quarterly_average', {
            chart: {
                type: 'column'
            },
            title: {
                text: 'Quarterly Noise Averages by Location'
            },
            xAxis: {
                categories: quarterlyAverages.map(item => item.quarter)
            },
            yAxis: {
                title: {
                    text: 'Noise Levels (dB)'
                }
            },
            series: [{
                name: 'LAeq',
                data: quarterlyAverages.map(item => item.LAeq)
            }, {
                name: 'LA10',
                data: quarterlyAverages.map(item => item.LA10)
            }, {
                name: 'LA90',
                data: quarterlyAverages.map(item => item.LA90)
            }, {
                name: 'Max LAFMax',
                data: maxLAFMax.map(item => [item.quarter, item.value]),
                color: 'red'
            }, {
                name: 'Min LAFMin',
                data: minLAFMin.map(item => [item.quarter, item.value]),
                color: 'green'
            }]
        });
    })
    .catch(error => console.error('Error fetching data:', error));
