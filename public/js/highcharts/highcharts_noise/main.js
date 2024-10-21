// JavaScript Document
function filterByYear() {
    const selectedYear = document.getElementById('select_year').value;
    renderNoiseChart(selectedYear);
}

function renderNoiseChart() {
    const location_id = document.getElementById('select_monitoring_location').value;
    const url = `api/noise/query_noise?location=${location_id}`;
    const selectedYear = document.getElementById('select_year').value;

    // Fetch data from the API endpoint and plot the chart
    fetch(url)
        .then(response => response.json())
        .then(data => {

            let noiseData = data?.query_noise;

            // Filter data based on the selected year
            if (selectedYear) {
                noiseData = noiseData.filter(record => {
                    const recordYear = new Date(record.start_date_time).getFullYear();
                    return recordYear === parseInt(selectedYear);
                });
            }


            const selectedLocationName = noiseData[0]?.org_specific_monitoring_id || "N/A";
            const locationDescription = noiseData[0]?.description || "N/A";

            const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
            // render monthly chart
            loadMonthlyNoiseChart(noiseData, selectedLocationName, months, locationDescription);

            // render for time series chart        
            loadTimeSeriesChart(noiseData, selectedLocationName, months, locationDescription);

            // render chart for quarterly
            loadQuarterlyNoiseChart(noiseData, selectedLocationName, months, locationDescription);

        })
        .catch(error => console.error('Error fetching data:', error));
};



function loadTimeSeriesChart(noiseData, selectedLocationName, months, locationDescription) {
    // Sort the data by start_date_time
    noiseData.sort((a, b) => new Date(a.start_date_time) - new Date(b.start_date_time));

    // Prepare the data for the time series chart
    const timeSeriesData = {
        categories: [],
        LAeq: [],
        LA10: [],
        LA90: [],
        LAFMax: [],
        LAFMin: []
    };

    noiseData.forEach(record => {
        const date = new Date(record.start_date_time);
        const formattedDate = `${months[date.getMonth()]} ${date.getDate()}, ${date.getFullYear()}`;

        timeSeriesData.categories.push(formattedDate);
        timeSeriesData.LAeq.push(record.LAeq);
        timeSeriesData.LA10.push(record.LA10);
        timeSeriesData.LA90.push(record.LA90);
        timeSeriesData.LAFMax.push(record.LAFMax);
        timeSeriesData.LAFMin.push(record.LAFMin);
    });

    // Plot the data using Highcharts
    Highcharts.chart('time_series_chart_all', {
        chart: {
            type: 'line'
        },
        credits: false,
        title: {
            text: `Noise Levels Over Time for ${selectedLocationName} (${locationDescription})`
        },
        xAxis: {
            categories: timeSeriesData.categories
        },
        yAxis: {
            title: {
                text: 'Noise Levels (dB)'
            }
        },
        series: [{
            name: 'LAeq',
            data: timeSeriesData.LAeq
        }, {
            name: 'LA10',
            data: timeSeriesData.LA10
        }, {
            name: 'LA90',
            data: timeSeriesData.LA90
        }, {
            name: 'LAFMax',
            data: timeSeriesData.LAFMax
        }, {
            name: 'LAFMin',
            data: timeSeriesData.LAFMin
        }]
    });
}


function loadQuarterlyNoiseChart(noiseData, selectedLocationName, months, locationDescription) {
    console.log("Q Data: ", noiseData)
    const quarterlyData = {}; // Object to store quarterly data
    noiseData.forEach(record => {
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
    const quarterlymaxLAFMax = [];
    const quarterlyminLAFMin = [];
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
            quarterlymaxLAFMax.push({ quarter: quarterName, value: LAFMaxMax });
            quarterlyminLAFMin.push({ quarter: quarterName, value: LAFMinMax });
        }
    }

    // Plot the data using Highcharts
    Highcharts.chart('quarterly_average', {
        chart: {
            type: 'column'
        },
        credits: false,
        title: {
            text: `Quarterly Noise Averages for ${selectedLocationName} (${locationDescription})`
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
            data: quarterlymaxLAFMax.map(item => [item.quarter, item.value]),
            color: 'red'
        }, {
            name: 'Min LAFMin',
            data: quarterlyminLAFMin.map(item => [item.quarter, item.value]),
            color: 'green'
        }]
    });
}


function loadMonthlyNoiseChart(noiseData, selectedLocationName, months, locationDescription) {
    const monthlyData = {};
    noiseData.forEach(record => {
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
        credits: false,
        title: {
            text: `Monthly Noise Averages for ${selectedLocationName} (${locationDescription})`
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
}


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


function populateSelectOptions(uniqueOrgs) {
    const orgSelect = $('#orgSelect');
    orgSelect.append('<option value="all locations">All locations</option>');
    uniqueOrgs.forEach(org => {
        orgSelect.append(`<option value="${org}">${org}</option>`);
    });
}
