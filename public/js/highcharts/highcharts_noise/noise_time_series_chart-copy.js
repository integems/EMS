// $(document).ready(function () {
//     function populateSelectOptions(uniqueOrgs) {
//         const orgSelect = $('#orgSelect');
//         orgSelect.append('<option value="all">All locations</option>');
//         uniqueOrgs.forEach(org => {
//             orgSelect.append(`<option value="${org}">${org}</option>`);
//         });

//         // Add event listener to filter data on change
//         orgSelect.on('change', function () {
//             const selectedOrg = $(this).val();
//             filterDataAndPlotChart(selectedOrg);
//         });
//     }

//     let allData = [];

//     // Fetch data from the API endpoint and plot the chart
//     fetch('api/noise/query_noise')
//         .then(response => response.json())
//         .then(data => {
//             allData = data.query_noise;
//             const uniqueOrgs = [...new Set(allData.map(record => record.org_specific_monitoring_id))];
//             populateSelectOptions(uniqueOrgs);

//             // Initially plot the chart with all data
//             plotChart(allData);
//         })
//         .catch(error => console.error('Error fetching data:', error));

//     function filterDataAndPlotChart(selectedOrg) {
//         const filteredData = selectedOrg === 'all' ? allData : allData.filter(record => record.org_specific_monitoring_id === selectedOrg);
//         plotChart(filteredData);
//     }

//     function plotChart(data) {
//         const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

//         // Sort the data by start_date_time
//         data.sort((a, b) => new Date(a.start_date_time) - new Date(b.start_date_time));

//         // Prepare the data for the time series chart
//         const timeSeriesData = {
//             categories: [],
//             LAeq: [],
//             LA10: [],
//             LA90: [],
//             LAFMax: [],
//             LAFMin: []
//         };

//         data.forEach(record => {
//             const date = new Date(record.start_date_time);
//             const formattedDate = `${months[date.getMonth()]} ${date.getDate()}, ${date.getFullYear()}`;

//             timeSeriesData.categories.push(formattedDate);
//             timeSeriesData.LAeq.push(record.LAeq);
//             timeSeriesData.LA10.push(record.LA10);
//             timeSeriesData.LA90.push(record.LA90);
//             timeSeriesData.LAFMax.push(record.LAFMax);
//             timeSeriesData.LAFMin.push(record.LAFMin);
//         });

//         // Plot the data using Highcharts
//         Highcharts.chart('time_series_chart_two', {
//             chart: {
//                 type: 'line'
//             },
//             title: {
//                 text: 'Noise Levels per Location'
//             },
//             xAxis: {
//                 categories: timeSeriesData.categories
//             },
//             yAxis: {
//                 title: {
//                     text: 'Noise Levels (dB)'
//                 }
//             },
//             series: [{
//                 name: 'LAeq',
//                 data: timeSeriesData.LAeq
//             }, {
//                 name: 'LA10',
//                 data: timeSeriesData.LA10
//             }, {
//                 name: 'LA90',
//                 data: timeSeriesData.LA90
//             }, {
//                 name: 'LAFMax',
//                 data: timeSeriesData.LAFMax
//             }, {
//                 name: 'LAFMin',
//                 data: timeSeriesData.LAFMin
//             }]
//         });
//     }
// });


// ----------------Vresion 2--------------------------------------------


// (async () => {
//     // Fetching the data from the API
//     const response = await fetch("api/noise/query_noise");
//     const result = await response.json();

//     // Extracting and transforming the data
//     const data = result.query_noise.map((item) => ({
//         x: new Date(item.start_date_time).getTime(),
//         y: item.LAeq,
//     }));

//     // Creating the chart
//     Highcharts.chart("container", {
//         chart: {
//             zooming: {
//                 type: "x",
//             },
//         },
//         title: {
//             text: "Noise Level Over Time",
//             align: "left",
//         },
//         subtitle: {
//             text:
//                 document.ontouchstart === undefined
//                     ? "Click and drag in the plot area to zoom in"
//                     : "Pinch the chart to zoom in",
//             align: "left",
//         },
//         xAxis: {
//             type: "datetime",
//         },
//         yAxis: {
//             title: {
//                 text: "LAeq (dB)",
//             },
//         },
//         legend: {
//             enabled: false,
//         },
//         plotOptions: {
//             area: {
//                 fillColor: {
//                     linearGradient: {
//                         x1: 0,
//                         y1: 0,
//                         x2: 0,
//                         y2: 1,
//                     },
//                     stops: [
//                         [0, Highcharts.getOptions().colors[0]],
//                         [
//                             1,
//                             Highcharts.color(Highcharts.getOptions().colors[0])
//                                 .setOpacity(0)
//                                 .get("rgba"),
//                         ],
//                     ],
//                 },
//                 marker: {
//                     radius: 2,
//                 },
//                 lineWidth: 1,
//                 states: {
//                     hover: {
//                         lineWidth: 1,
//                     },
//                 },
//                 threshold: null,
//             },
//         },

//         series: [
//             {
//                 type: "area",
//                 name: "LAeq",
//                 data: data,
//             },
//         ],
//     });
// })();



// -----------Version 3--------------------------------------

// (async () => {

//     const response = await fetch('api/noise/query_noise');
//     const result = await response.json();

//     // Extracting and transforming the data for each parameter
//     const seriesData = {
//         LAeq: [],
//         LA90: [],
//         LA10: [],
//         LAFMax: [],
//         LAFMin: []
//     };

//     result.query_noise.forEach(item => {
//         const timestamp = new Date(item.start_date_time).getTime();
//         seriesData.LAeq.push([timestamp, item.LAeq]);
//         seriesData.LA90.push([timestamp, item.LA90]);
//         seriesData.LA10.push([timestamp, item.LA10]);
//         seriesData.LAFMax.push([timestamp, item.LAFMax]);
//         seriesData.LAFMin.push([timestamp, item.LAFMin]);
//     });

//     // Creating the chart
//     Highcharts.chart('container', {
//         chart: {
//             zooming: {
//                 type: 'x'
//             }
//         },
//         title: {
//             text: 'Noise Level Trends',
//             align: 'center'
//         },
//         subtitle: {
//             text: document.ontouchstart === undefined ?
//                 'Click and drag in the plot area to zoom in' :
//                 'Pinch the chart to zoom in',
//             align: 'left'
//         },
//         xAxis: {
//             type: 'datetime'
//         },
//         yAxis: {
//             title: {
//                 text: 'Noise Levels (dB)'
//             }
//         },
//         legend: {
//             enabled: true
//         },
//         plotOptions: {
//             line: {
//                 marker: {
//                     radius: 2
//                 },
//                 lineWidth: 2,
//                 states: {
//                     hover: {
//                         lineWidth: 1
//                     }
//                 },
//                 threshold: null
//             }
//         },
//         series: [
//             {
//                 type: 'line',
//                 name: 'LAeq',
//                 data: seriesData.LAeq,
//                 color: Highcharts.getOptions().colors[0]
//             },
//             {
//                 type: 'line',
//                 name: 'LA90',
//                 data: seriesData.LA90,
//                 color: Highcharts.getOptions().colors[1]
//             },
//             {
//                 type: 'line',
//                 name: 'LA10',
//                 data: seriesData.LA10,
//                 color: Highcharts.getOptions().colors[2]
//             },
//             {
//                 type: 'line',
//                 name: 'LAFMax',
//                 data: seriesData.LAFMax,
//                 color: Highcharts.getOptions().colors[3]
//             },
//             {
//                 type: 'line',
//                 name: 'LAFMin',
//                 data: seriesData.LAFMin,
//                 color: Highcharts.getOptions().colors[4]
//             }
//         ]
//     });
// })();


//--------------version 4------------------------------------
// (async () => {
//     const response = await fetch('api/noise/query_noise');
//     const result = await response.json();

//     // Extract unique locations for the select dropdown
//     const locations = new Map();
//     result.query_noise.forEach(item => {
//         locations.set(item.location_id, item.description);
//     });

//     const orgSelect = document.getElementById('orgSelect');
//     orgSelect.innerHTML = '<option value="all">All Locations</option>';
//     locations.forEach((description, locationId) => {
//         const option = document.createElement('option');
//         option.value = locationId;
//         option.text = description;
//         orgSelect.appendChild(option);
//     });

//     const seriesData = {
//         LAeq: [],
//         LA90: [],
//         LA10: [],
//         LAFMax: [],
//         LAFMin: []
//     };

//     function processData(locationId) {
//         const filteredData = locationId === 'all'
//             ? result.query_noise
//             : result.query_noise.filter(item => item.location_id == locationId);

//         const data = {
//             LAeq: [],
//             LA90: [],
//             LA10: [],
//             LAFMax: [],
//             LAFMin: []
//         };

//         filteredData.forEach(item => {
//             const timestamp = Date.parse(item.start_date_time);
//             data.LAeq.push([timestamp, item.LAeq]);
//             data.LA90.push([timestamp, item.LA90]);
//             data.LA10.push([timestamp, item.LA10]);
//             data.LAFMax.push([timestamp, item.LAFMax]);
//             data.LAFMin.push([timestamp, item.LAFMin]);
//         });

//         // Sort each data series by timestamp
//         Object.keys(data).forEach(key => {
//             data[key].sort((a, b) => a[0] - b[0]);
//         });

//         return data;
//     }

//     function createChart(data) {
//         Highcharts.chart('container', {
//             chart: {
//                 zooming: {
//                     type: 'x'
//                 }
//             },
//             title: {
//                 text: 'Noise Level Trends',
//                 align: 'center'
//             },
//             subtitle: {
//                 text: document.ontouchstart === undefined ?
//                     'Click and drag in the plot area to zoom in' :
//                     'Pinch the chart to zoom in',
//                 align: 'left'
//             },
//             xAxis: {
//                 type: 'datetime'
//             },
//             yAxis: {
//                 title: {
//                     text: 'Noise Levels (dB)'
//                 }
//             },
//             legend: {
//                 enabled: true
//             },
//             plotOptions: {
//                 line: {
//                     marker: {
//                         radius: 2
//                     },
//                     lineWidth: 2,
//                     states: {
//                         hover: {
//                             lineWidth: 1
//                         }
//                     },
//                     threshold: null
//                 }
//             },
//             series: [
//                 {
//                     type: 'line',
//                     name: 'LAeq',
//                     data: data.LAeq,
//                     color: Highcharts.getOptions().colors[0]
//                 },
//                 {
//                     type: 'line',
//                     name: 'LA90',
//                     data: data.LA90,
//                     color: Highcharts.getOptions().colors[1]
//                 },
//                 {
//                     type: 'line',
//                     name: 'LA10',
//                     data: data.LA10,
//                     color: Highcharts.getOptions().colors[2]
//                 },
//                 {
//                     type: 'line',
//                     name: 'LAFMax',
//                     data: data.LAFMax,
//                     color: Highcharts.getOptions().colors[3]
//                 },
//                 {
//                     type: 'line',
//                     name: 'LAFMin',
//                     data: data.LAFMin,
//                     color: Highcharts.getOptions().colors[4]
//                 }
//             ]
//         });
//     }

//     orgSelect.addEventListener('change', (event) => {
//         const selectedLocationId = event.target.value;
//         const data = processData(selectedLocationId);
//         createChart(data);
//     });

//     // Initial chart with all data
//     const initialData = processData('all');
//     createChart(initialData);
// })();

//------------------Version 5--------------------------------------------------------------------------
(async () => {
    const response = await fetch('/api/noise/query_noise_copy');
    const result = await response.json();

    // Extract unique locations for the select dropdown
    const locations = new Map();
    result.query_noise.forEach(item => {
        locations.set(item.location_id, item.description);
    });

    const orgSelect = document.getElementById('orgSelect');
    orgSelect.innerHTML = '<option value="all">All Locations</option>';
    locations.forEach((description, locationId) => {
        const option = document.createElement('option');
        option.value = locationId;
        option.text = description;
        orgSelect.appendChild(option);
    });

    // Extract unique years for the select dropdown
    const years = new Set();
    result.query_noise.forEach(item => {
        const timestamp = Date.parse(item.start_date_time);
        if (!isNaN(timestamp)) {
            const year = new Date(timestamp).getFullYear();
            if (year > 1970) {
                years.add(year);
            }
        }
    });

    const yearSelect = document.getElementById('yearSelect');
    const currentYear = new Date().getFullYear();
    yearSelect.innerHTML = '<option value="all">All Years</option>';
    years.forEach(year => {
        const option = document.createElement('option');
        option.value = year;
        option.text = year;
        yearSelect.appendChild(option);
    });

    // Set current year as default selected option
    yearSelect.value = currentYear;

    const seriesData = {
        LAeq: [],
        LA90: [],
        LA10: [],
        LAFMax: [],
        LAFMin: []
    };

    function processData(locationId, year) {
        const filteredData = result.query_noise.filter(item => {
            const timestamp = Date.parse(item.start_date_time);
            if (isNaN(timestamp)) {
                return false;
            }
            const itemYear = new Date(timestamp).getFullYear();
            const locationMatch = locationId === 'all' || item.location_id == locationId;
            const yearMatch = year === 'all' || itemYear == year;
            return locationMatch && yearMatch;
        });

        const data = {
            LAeq: [],
            LA90: [],
            LA10: [],
            LAFMax: [],
            LAFMin: []
        };

        filteredData.forEach(item => {
            const timestamp = Date.parse(item.start_date_time);
            data.LAeq.push([timestamp, item.LAeq]);
            data.LA90.push([timestamp, item.LA90]);
            data.LA10.push([timestamp, item.LA10]);
            data.LAFMax.push([timestamp, item.LAFMax]);
            data.LAFMin.push([timestamp, item.LAFMin]);
        });

        // Sort each data series by timestamp
        Object.keys(data).forEach(key => {
            data[key].sort((a, b) => a[0] - b[0]);
        });

        return data;
    }

    function createChart(data, locationName) {
        Highcharts.chart('container', {
            chart: {
                zooming: {
                    type: 'x'
                }
            },
            title: {
                text: `Noise Level Trends - ${locationName}`,
                align: 'center'
            },
            subtitle: {
                text: document.ontouchstart === undefined ?
                    'Click and drag in the plot area to zoom in' :
                    'Pinch the chart to zoom in',
                align: 'left'
            },
            xAxis: {
                type: 'datetime'
            },
            yAxis: {
                title: {
                    text: 'Noise Levels (dB)'
                }
            },
            legend: {
                enabled: true
            },
            plotOptions: {
                line: {
                    marker: {
                        radius: 2
                    },
                    lineWidth: 2,
                    states: {
                        hover: {
                            lineWidth: 1
                        }
                    },
                    threshold: null
                }
            },
            series: [
                {
                    type: 'line',
                    name: 'LAeq',
                    data: data.LAeq,
                    color: Highcharts.getOptions().colors[0]
                },
                {
                    type: 'line',
                    name: 'LA90',
                    data: data.LA90,
                    color: Highcharts.getOptions().colors[1]
                },
                {
                    type: 'line',
                    name: 'LA10',
                    data: data.LA10,
                    color: Highcharts.getOptions().colors[2]
                },
                {
                    type: 'line',
                    name: 'LAFMax',
                    data: data.LAFMax,
                    color: Highcharts.getOptions().colors[3]
                },
                {
                    type: 'line',
                    name: 'LAFMin',
                    data: data.LAFMin,
                    color: Highcharts.getOptions().colors[4]
                }
            ]
        });
    }

    orgSelect.addEventListener('change', () => {
        const selectedLocationId = orgSelect.value;
        const selectedYear = yearSelect.value;
        const locationName = selectedLocationId === 'all' ? 'All Locations' : locations.get(parseInt(selectedLocationId));
        const data = processData(selectedLocationId, selectedYear);
        createChart(data, locationName);
    });

    yearSelect.addEventListener('change', () => {
        const selectedLocationId = orgSelect.value;
        const selectedYear = yearSelect.value;
        const locationName = selectedLocationId === 'all' ? 'All Locations' : locations.get(parseInt(selectedLocationId));
        const data = processData(selectedLocationId, selectedYear);
        createChart(data, locationName);
    });

    // Initial chart with data from the current year
    const initialLocationName = 'All Locations';
    const initialData = processData('all', currentYear);
    createChart(initialData, initialLocationName);
})();
