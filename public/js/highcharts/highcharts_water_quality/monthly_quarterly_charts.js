// JavaScript Document

// Fetch the data
async function fetchData() {
    try {
        const response = await fetch('api/water_quality/water_data_location');
        const jsonData = await response.json();
        return jsonData.query;
    } catch (error) {
        console.error('Error fetching data:', error);
        return null;
    }
}

// Calculate the average of each parameter for each month
function calculateAverages(data) {
    let monthlyAverages = {};

    data.forEach(entry => {
        let date = new Date(entry.date);
        let month = date.getMonth();

        if (!monthlyAverages[month]) {
            monthlyAverages[month] = {};
        }

        Object.keys(entry).forEach(key => {
            if (!monthlyAverages[month][key]) {
                monthlyAverages[month][key] = { sum: 0, count: 0 };
            }
            monthlyAverages[month][key].sum += parseFloat(entry[key]);
            monthlyAverages[month][key].count++;
        });
    });

    // Finalize the averages
    Object.keys(monthlyAverages).forEach(month => {
        Object.keys(monthlyAverages[month]).forEach(key => {
            monthlyAverages[month][key] = monthlyAverages[month][key].sum / monthlyAverages[month][key].count;
        });
    });

    return monthlyAverages;
}

// Render the chart
function renderChart(orgId, monthlyAverages) {
    // Prepare the data series
    const parameters = ['temperature', 'pH', 'mV_pH', 'ORP_mV', 'EC', 'EC_Abs', 'Resistivity', 'TDS_ppm', 'salinity_psu', 'pressure_psi', 'DO_percentage', 'DO_ppm', 'turbidity_FNU'];
    const seriesData = parameters.map(parameter => ({
        name: parameter,
        data: Object.values(monthlyAverages).map(month => month[parameter])
    }));

    // Render the chart
    Highcharts.chart('monthly_chart', {
        chart: {
            type: 'bar'
        },
        title: {
            text: `Monthly Water Quality Levels for ${orgId}`
        },
        xAxis: {
            categories: Object.keys(monthlyAverages),
            title: {
                text: 'Month'
            }
        },
        yAxis: {
            title: {
                text: 'Water Quality Levels'
            }
        },
        series: seriesData,
        accessibility: {
            enabled: true
        }
    });
}

// Initialize the chart
async function initializeChart() {
    const jsonData = await fetchData();
    if (jsonData) {
        const monthlyAverages = calculateAverages(jsonData);
        renderChart('all locations', monthlyAverages);
    }
}

initializeChart();