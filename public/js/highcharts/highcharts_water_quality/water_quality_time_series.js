// JavaScript Document

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

function renderChart(orgId, jsonData) {
    let filteredData;
    if (orgId === 'all locations') {
        filteredData = jsonData;
    } else {
        filteredData = jsonData.filter(entry => entry.org_specific_monitoring_id === orgId);
    }

    // Sort the data by date in ascending order
    const dateData = filteredData.sort((a, b) => new Date(a.date) - new Date(b.date));

    // Prepare data series for each parameter
    const parameters = ['temperature', 'pH', 'mV_pH', 'ORP_mV', 'EC', 'EC_Abs', 'Resistivity', 'TDS_ppm', 'salinity_psu', 'pressure_psi', 'DO_percentage', 'DO_ppm', 'turbidity_FNU'];
    const seriesData = parameters.map(parameter => ({
        name: parameter,
        data: dateData.map(entry => ({
            x: new Date(entry.date).getTime(),
            y: parseFloat(entry[parameter])
        }))
    }));

    Highcharts.chart('time_series_chart_two', {
        chart: {
            type: 'line'
        },
        title: {
            text: `Water Quality Levels for ${orgId}`
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
                text: 'Water Quality Levels'
            }
        },
        series: seriesData,
        accessibility: {
            enabled: true
        }
    });
}

function populateSelectOptions(uniqueOrgs) {
    const orgSelect = $('#orgSelect');
    orgSelect.append('<option value="all locations">All locations</option>');
    uniqueOrgs.forEach(org => {
        orgSelect.append(`<option value="${org}">${org}</option>`);
    });
}

async function initializeChart() {
    const jsonData = await fetchData();
    if (jsonData) {
        const uniqueOrgs = [...new Set(jsonData.map(entry => entry.org_specific_monitoring_id))];
        populateSelectOptions(uniqueOrgs);
        renderChart('all locations', jsonData);

        $('#orgSelect').on('change', function () {
            const selectedOrg = $(this).val();
            renderChart(selectedOrg, jsonData);
        });
    }
}

initializeChart();
