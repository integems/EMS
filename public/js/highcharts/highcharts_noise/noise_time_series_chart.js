// JavaScript Document
//Time series chart
async function fetchData() {
    try {
        const response = await fetch('api/noise/noise_data_date_time_copy');
        const jsonData = await response.json();
        return jsonData;
    } catch (error) {
        console.error('Error fetching data:', error);
        return null;
    }
}

function renderChart(orgId, jsonData) {
    let filteredData;
    if (orgId === 'all locations') {
        filteredData = jsonData.date_time;
    } else {
        filteredData = jsonData.date_time.filter(entry => entry.org_specific_monitoring_id === orgId);
    }

    // Sort the data by start_date_time in ascending order
    const dateData = filteredData.sort((a, b) => new Date(a.start_date_time) - new Date(b.start_date_time));

    // Prepare data series for each parameter
    const parameters = ['LAeq', 'LA90', 'LA10', 'LAFMax', 'LAFMin'];
    const seriesData = parameters.map(parameter => ({
        name: parameter,
        data: dateData.map(entry => ({
            x: new Date(entry.start_date_time).getTime(),
            y: entry[parameter]
        }))
    }));


    Highcharts.chart('time_series_chart_two', {
        chart: {
            type: 'line'
        },
        title: {
            text: `Noise Levels for ${orgId}`
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
                text: 'Noise Levels (dB)'
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
        const uniqueOrgs = [...new Set(jsonData.date_time.map(entry => entry.org_specific_monitoring_id))];
        populateSelectOptions(uniqueOrgs);
        renderChart('all locations', jsonData);

        $('#orgSelect').on('change', function () {
            const selectedOrg = $(this).val();
            renderChart(selectedOrg, jsonData);
        });
    }
}

initializeChart();

