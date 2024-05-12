// JavaScript Document
//Time series chart
// async function fetchData() {
//     try {
//         const locationID = document.getElementById("select_monitoring_location").value;
//         const url = `api/noise/query_noise?location=${locationID}`
//         const response = await fetch(url);
//         const jsonData = await response.json();
//         // console.log(jsonData);
//         return jsonData;
//     } catch (error) {
//         console.error('Error fetching data:', error);
//         return null;
//     }
// }

// function renderChart(orgId, jsonData) {

//     console.log("jsonData: ", jsonData)
//     let filteredData = jsonData?.query_noise;

//     if (!filteredData || filteredData.length === 0) {
//         console.error('No data available for rendering chart');
//         return;
//     }

//     // Sort the data by start_date_time in ascending order
//     const dateData = filteredData.sort((a, b) => new Date(a.start_date_time) - new Date(b.start_date_time));

//     // Prepare data series for each parameter
//     const parameters = ['LAeq', 'LA90', 'LA10', 'LAFMax', 'LAFMin'];
//     const seriesData = parameters.map(parameter => ({
//         name: parameter,
//         data: dateData.map(entry => ({
//             x: new Date(entry.start_date_time).getTime(),
//             y: entry[parameter]
//         }))
//     }));


//     Highcharts.chart('time_series_chart_all', {
//         chart: {
//             type: 'line'
//         },
//         title: {
//             text: `Noise Levels for ${orgId}`
//         },
//         xAxis: {
//             type: 'datetime',
//             labels: {
//                 formatter: function () {
//                     return Highcharts.dateFormat('%b', this.value);
//                 }
//             },
//             title: {
//                 text: 'Month'
//             }
//         },
//         yAxis: {
//             title: {
//                 text: 'Noise Levels (dB)'
//             }
//         },
//         series: seriesData,
//         accessibility: {
//             enabled: true
//         }
//     });
// }


// function populateSelectOptions(uniqueOrgs) {
//     const orgSelect = $('#orgSelect');
//     orgSelect.append('<option value="all locations">All locations</option>');
//     uniqueOrgs.forEach(org => {
//         orgSelect.append(`<option value="${org}">${org}</option>`);
//     });
// }

// async function initializeChart() {
//     const jsonData = await fetchData();
//     if (jsonData) {
//         const uniqueOrgs = [...new Set(jsonData.query_noise.map(entry => entry.org_specific_monitoring_id))];
//         populateSelectOptions(uniqueOrgs);
//         renderChart('default location', jsonData);

//         $('#orgSelect').on('change', function () {
//             const selectedOrg = $(this).val();
//             renderChart(selectedOrg, jsonData);
//             renderNoiseChart()
//         });
//     }
// }

// initializeChart();


// Fetch data from the API endpoint and plot the chart
fetch('api/noise/query_noise')
    .then(response => response.json())
    .then(data => {
        const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

        // Sort the data by start_date_time
        data.query_noise.sort((a, b) => new Date(a.start_date_time) - new Date(b.start_date_time));

        // Prepare the data for the time series chart
        const timeSeriesData = {
            categories: [],
            LAeq: [],
            LA10: [],
            LA90: [],
            LAFMax: [],
            LAFMin: []
        };

        data.query_noise.forEach(record => {
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
        Highcharts.chart('time_series_chart_two', {
            chart: {
                type: 'line'
            },
            title: {
                text: 'Noise Levels Over Time by Location'
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
    })
    .catch(error => console.error('Error fetching data:', error));