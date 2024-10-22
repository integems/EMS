// JavaScript Document

// // Fetch water quality data from the API
// async function fetchWaterQualityData() {
//     try {
//         const response = await fetch('/api/water_quality/query_water_data');
//         const data = await response.json();
//         return data.query_water;
//     } catch (error) {
//         console.error("Error fetching data:", error);
//         return [];
//     }
// }

// // Calculate average for each parameter per location
// function calculateAverages(data) {
//     const averages = {};
//     const parameters = ['temperature', 'pH', 'ORP_mV', 'EC', 'Resistivity', 'TDS_ppm', 'salinity_psu', 'pressure_psi', 'DO_percentage', 'turbidity_FNU'];

//     data.forEach(record => {
//         const location = record.org_specific_monitoring_id;
//         if (!averages[location]) {
//             averages[location] = {
//                 count: 0
//             };
//             parameters.forEach(param => {
//                 averages[location][param] = 0;
//             });
//         }

//         parameters.forEach(param => {
//             averages[location][param] += parseFloat(record[param]) || 0;
//         });
//         averages[location].count += 1;
//     });

//     // Calculate the average for each parameter
//     Object.keys(averages).forEach(location => {
//         parameters.forEach(param => {
//             averages[location][param] = averages[location][param] / averages[location].count;
//         });
//     });

//     return averages;
// }

// // Render bar charts for each parameter
// function renderBarCharts(averages) {
//     const parameters = ['temperature', 'pH', 'ORP_mV', 'EC', 'Resistivity', 'TDS_ppm', 'salinity_psu', 'pressure_psi', 'DO_percentage', 'turbidity_FNU'];
//     const parameterNames = {
//         temperature: 'Temperature (°C)',
//         pH: 'pH',
//         ORP_mV: 'ORP (mV)',
//         EC: 'Electrical Conductivity (µS/cm)',
//         Resistivity: 'Resistivity (Ohm·cm)',
//         TDS_ppm: 'Total Dissolved Solids (ppm)',
//         salinity_psu: 'Salinity (PSU)',
//         pressure_psi: 'Pressure (psi)',
//         DO_percentage: 'Dissolved Oxygen (%)',
//         turbidity_FNU: 'Turbidity (FNU)'
//     };

//     const locations = Object.keys(averages);

//     parameters.forEach((param, index) => {
//         const seriesData = locations.map(location => ({
//             name: location,
//             y: averages[location][param]
//         }));

//         Highcharts.chart(`chart_${param}`, {
//             chart: {
//                 type: 'column'
//             },
//             title: {
//                 text: parameterNames[param]
//             },
//             xAxis: {
//                 type: 'category',
//                 title: {
//                     text: 'Monitoring Locations'
//                 }
//             },
//             yAxis: {
//                 title: {
//                     text: parameterNames[param]
//                 }
//             },
//             series: [{
//                 name: parameterNames[param],
//                 data: seriesData,
//                 colorByPoint: true
//             }],
//             tooltip: {
//                 pointFormat: '{series.name}: <b>{point.y:.2f}</b>'
//             }
//         });
//     });
// }

// // Main function to fetch data, process it, and render charts
// async function main() {
//     const data = await fetchWaterQualityData();
//     const averages = calculateAverages(data);
//     renderBarCharts(averages);
// }

// document.addEventListener('DOMContentLoaded', main);



//--------------------------------------------------------------------------------------

// // Fetch water quality data from the API
// async function fetchWaterQualityData() {
//     try {
//         const response = await fetch('/api/water_quality/query_water_data'); // Adjust the API endpoint if needed.
//         const data = await response.json();

//         // Check if the API returned valid data
//         if (!data || !data.query_water) {
//             console.error("Invalid data format:", data);
//             return [];
//         }

//         // Extract and return the relevant data
//         return data.query_water; // Assuming the data is in the 'query' array.
//     } catch (error) {
//         console.error('Error fetching data:', error);
//         return [];
//     }
// }

// // Calculate averages based on the selected year and month
// function calculateAverages(data, selectedYear, selectedMonth) {
//     // Filter the data based on the selected year and month
//     const filteredData = data.filter(item => {
//         const date = new Date(item.date); // Parse the date field from the data
//         const year = date.getFullYear();
//         const month = String(date.getMonth() + 1).padStart(2, '0'); // JavaScript months are 0-indexed, so we add 1

//         // Filter by selected year and month if they are provided
//         const isYearMatch = selectedYear ? year === parseInt(selectedYear) : true;
//         const isMonthMatch = selectedMonth ? month === selectedMonth : true;

//         return isYearMatch && isMonthMatch;
//     });

//     // Calculate averages for the filtered data
//     const averages = {
//         temperature: calculateParameterAverage(filteredData, 'temp_C'),
//         pH: calculateParameterAverage(filteredData, 'ph'),
//         ORP_mV: calculateParameterAverage(filteredData, 'orp_mV'),
//         EC: calculateParameterAverage(filteredData, 'ec_uS'),
//         Resistivity: calculateParameterAverage(filteredData, 'resistivity_ohm_cm'),
//         TDS_ppm: calculateParameterAverage(filteredData, 'tds_ppm'),
//         salinity_psu: calculateParameterAverage(filteredData, 'salinity_psu'),
//         pressure_psi: calculateParameterAverage(filteredData, 'pressure_psi'),
//         DO_percentage: calculateParameterAverage(filteredData, 'do_percent'),
//         turbidity_FNU: calculateParameterAverage(filteredData, 'turbidity_fnu')
//     };

//     return averages;
// }

// // Calculate the average for a specific parameter
// function calculateParameterAverage(data, parameter) {
//     if (!data.length) return 0;

//     const sum = data.reduce((acc, item) => acc + (item[parameter] || 0), 0);
//     return sum / data.length;
// }

// // Variables to store selected year and month
// let selectedYear = '';
// let selectedMonth = '';

// // Filter by selected year
// function filterByYear() {
//     selectedYear = document.getElementById('select_year').value;
//     handleFilterChange();
// }

// // Filter by selected month
// function filterByMonth() {
//     selectedMonth = document.querySelector('.form-control').value;
//     handleFilterChange();
// }

// // Handle changes in filtering
// function handleFilterChange() {
//     fetchWaterQualityData().then(data => {
//         const averages = calculateAverages(data, selectedYear, selectedMonth);
//         renderBarCharts(averages);
//     });
// }

// // Render bar charts with the averages
// function renderBarCharts(averages) {
//     // Assuming you have a function to render each chart
//     renderBarChart('chart_temperature', averages.temperature, 'Temperature (°C)');
//     renderBarChart('chart_pH', averages.pH, 'pH');
//     renderBarChart('chart_ORP_mV', averages.ORP_mV, 'ORP (mV)');
//     renderBarChart('chart_EC', averages.EC, 'EC (µS/cm)');
//     renderBarChart('chart_Resistivity', averages.Resistivity, 'Resistivity (Ω·cm)');
//     renderBarChart('chart_TDS_ppm', averages.TDS_ppm, 'TDS (ppm)');
//     renderBarChart('chart_salinity_psu', averages.salinity_psu, 'Salinity (PSU)');
//     renderBarChart('chart_pressure_psi', averages.pressure_psi, 'Pressure (psi)');
//     renderBarChart('chart_DO_percentage', averages.DO_percentage, 'DO (%)');
//     renderBarChart('chart_turbidity_FNU', averages.turbidity_FNU, 'Turbidity (FNU)');
// }

// // Function to render a bar chart
// function renderBarChart(chartId, averageValue, label) {
//     // You can use any charting library here (e.g., Chart.js, Highcharts, etc.)
//     // Example using Highcharts:
//     Highcharts.chart(chartId, {
//         chart: {
//             type: 'column'
//         },
//         title: {
//             text: label
//         },
//         xAxis: {
//             categories: [label],
//             title: {
//                 text: null
//             }
//         },
//         yAxis: {
//             min: 0,
//             title: {
//                 text: 'Average Value'
//             }
//         },
//         series: [{
//             name: label,
//             data: [averageValue]
//         }]
//     });
// }

// // Initialize the data fetch and render when the page loads
// window.onload = function () {
//     fetchWaterQualityData().then(data => {
//         const averages = calculateAverages(data, selectedYear, selectedMonth);
//         renderBarCharts(averages);
//     });
// };

//--------------------------------------------------------------------------------------------------------------

// // JavaScript Document

// // Function to show a loading indicator
// function showLoading() {
//     const loader = document.getElementById('loading');
//     if (loader) loader.style.display = 'block';
// }

// // Function to hide the loading indicator
// function hideLoading() {
//     const loader = document.getElementById('loading');
//     if (loader) loader.style.display = 'none';
// }

// // Function to show an error message on the UI
// function showError(message) {
//     const errorContainer = document.getElementById('error-message');
//     if (errorContainer) {
//         errorContainer.textContent = message;
//         errorContainer.style.display = 'block';
//     }
// }

// // Function to hide the error message
// function hideError() {
//     const errorContainer = document.getElementById('error-message');
//     if (errorContainer) errorContainer.style.display = 'none';
// }

// // Fetch water quality data from the API
// async function fetchWaterQualityData() {
//     showLoading();
//     hideError();
//     try {
//         const response = await fetch('/api/water_quality/query_water_data');
//         if (!response.ok) {
//             throw new Error(`API request failed with status: ${response.status}`);
//         }
//         const data = await response.json();
//         hideLoading();
//         return data.query_water || [];
//     } catch (error) {
//         console.error("Error fetching data:", error);
//         showError("Failed to load water quality data. Please try again later.");
//         hideLoading();
//         return [];
//     }
// }

// // Calculate average for each parameter per location
// function calculateAverages(data) {
//     const averages = {};
//     const parameters = ['temperature', 'pH', 'ORP_mV', 'EC', 'Resistivity', 'TDS_ppm', 'salinity_psu', 'pressure_psi', 'DO_percentage', 'turbidity_FNU'];

//     data.forEach(record => {
//         const location = record.org_specific_monitoring_id;

//         if (!averages[location]) {
//             averages[location] = {
//                 count: 0
//             };
//             parameters.forEach(param => {
//                 averages[location][param] = 0;
//             });
//         }

//         parameters.forEach(param => {
//             // Ensure the data is numeric before adding it
//             const value = parseFloat(record[param]);
//             if (!isNaN(value)) {
//                 averages[location][param] += value;
//             }
//         });

//         averages[location].count += 1;
//     });

//     // Calculate the average for each parameter
//     Object.keys(averages).forEach(location => {
//         parameters.forEach(param => {
//             averages[location][param] = averages[location][param] / averages[location].count || 0;
//         });
//     });

//     return averages;
// }

// // Render bar charts for each parameter
// function renderBarCharts(averages) {
//     const parameters = ['temperature', 'pH', 'ORP_mV', 'EC', 'Resistivity', 'TDS_ppm', 'salinity_psu', 'pressure_psi', 'DO_percentage', 'turbidity_FNU'];
//     const parameterNames = {
//         temperature: 'Temperature (°C)',
//         pH: 'pH',
//         ORP_mV: 'ORP (mV)',
//         EC: 'Electrical Conductivity (µS/cm)',
//         Resistivity: 'Resistivity (Ohm·cm)',
//         TDS_ppm: 'Total Dissolved Solids (ppm)',
//         salinity_psu: 'Salinity (PSU)',
//         pressure_psi: 'Pressure (psi)',
//         DO_percentage: 'Dissolved Oxygen (%)',
//         turbidity_FNU: 'Turbidity (FNU)'
//     };

//     const locations = Object.keys(averages);

//     parameters.forEach(param => {
//         const seriesData = locations.map(location => ({
//             name: location,
//             y: averages[location][param]
//         }));

//         Highcharts.chart(`chart_${param}`, {
//             chart: {
//                 type: 'column'
//             },
//             title: {
//                 text: parameterNames[param]
//             },
//             xAxis: {
//                 type: 'category',
//                 title: {
//                     text: 'Monitoring Locations'
//                 }
//             },
//             yAxis: {
//                 title: {
//                     text: parameterNames[param]
//                 }
//             },
//             series: [{
//                 name: parameterNames[param],
//                 data: seriesData,
//                 colorByPoint: true
//             }],
//             tooltip: {
//                 pointFormat: '{series.name}: <b>{point.y:.2f}</b>'
//             }
//         });
//     });
// }

// // Main function to fetch data, process it, and render charts
// async function main() {
//     showLoading();
//     const data = await fetchWaterQualityData();
//     if (data.length > 0) {
//         const averages = calculateAverages(data);
//         renderBarCharts(averages);
//     }
//     hideLoading();
// }

// // Event listener for page load
// document.addEventListener('DOMContentLoaded', main);

//--------------------------------------------------------------------------------------------

//with filtering

// Function to show a loading indicator
function showLoading() {
    const loader = document.getElementById('loading');
    if (loader) loader.style.display = 'block';
}

// Function to hide the loading indicator
function hideLoading() {
    const loader = document.getElementById('loading');
    if (loader) loader.style.display = 'none';
}

// Function to show an error message on the UI
function showError(message) {
    const errorContainer = document.getElementById('error-message');
    if (errorContainer) {
        errorContainer.textContent = message;
        errorContainer.style.display = 'block';
    }
}

// Function to hide the error message
function hideError() {
    const errorContainer = document.getElementById('error-message');
    if (errorContainer) errorContainer.style.display = 'none';
}

// Fetch water quality data from the API
async function fetchWaterQualityData() {
    showLoading();
    hideError();
    try {
        const response = await fetch('/api/water_quality/query_water_data');
        if (!response.ok) {
            throw new Error(`API request failed with status: ${response.status}`);
        }
        const data = await response.json();
        hideLoading();
        return data.query_water || [];
    } catch (error) {
        console.error("Error fetching data:", error);
        showError("Failed to load water quality data. Please try again later.");
        hideLoading();
        return [];
    }
}

// Populate year and month filters based on the data
function populateFilters(data) {
    const yearSelect = document.getElementById('filterByYear');
    const monthSelect = document.getElementById('filterByMonth');

    // Extract unique years from the data
    const years = Array.from(new Set(data.map(record => new Date(record.date).getFullYear())));

    // Populate year options
    yearSelect.innerHTML = '<option value="">All Years</option>';
    years.forEach(year => {
        const option = document.createElement('option');
        option.value = year;
        option.textContent = year;
        yearSelect.appendChild(option);
    });

    // Populate month options (all 12 months)
    monthSelect.innerHTML = '<option value="">All Months</option>';
    for (let month = 1; month <= 12; month++) {
        const option = document.createElement('option');
        option.value = month;
        option.textContent = new Date(0, month - 1).toLocaleString('default', { month: 'long' });
        monthSelect.appendChild(option);
    }
}

// Filter data based on selected year and month
function filterDataByYearAndMonth(data) {
    const yearSelect = document.getElementById('filterByYear');
    const monthSelect = document.getElementById('filterByMonth');
    const selectedYear = yearSelect.value;
    const selectedMonth = monthSelect.value;

    return data.filter(record => {
        const recordDate = new Date(record.date);
        const recordYear = recordDate.getFullYear();
        const recordMonth = recordDate.getMonth() + 1; // getMonth() returns 0-based index

        return (
            (!selectedYear || recordYear === parseInt(selectedYear)) &&
            (!selectedMonth || recordMonth === parseInt(selectedMonth))
        );
    });
}

// Calculate average for each parameter per location
function calculateAverages(data) {
    const averages = {};
    const parameters = ['temperature', 'pH', 'ORP_mV', 'EC', 'Resistivity', 'TDS_ppm', 'salinity_psu', 'pressure_psi', 'DO_percentage', 'turbidity_FNU'];

    data.forEach(record => {
        const location = record.org_specific_monitoring_id;

        if (!averages[location]) {
            averages[location] = {
                count: 0
            };
            parameters.forEach(param => {
                averages[location][param] = 0;
            });
        }

        parameters.forEach(param => {
            const value = parseFloat(record[param]);
            if (!isNaN(value)) {
                averages[location][param] += value;
            }
        });

        averages[location].count += 1;
    });

    Object.keys(averages).forEach(location => {
        parameters.forEach(param => {
            averages[location][param] = averages[location][param] / averages[location].count || 0;
        });
    });

    return averages;
}

// Render bar charts for each parameter
function renderBarCharts(averages) {
    const parameters = ['temperature', 'pH', 'ORP_mV', 'EC', 'Resistivity', 'TDS_ppm', 'salinity_psu', 'pressure_psi', 'DO_percentage', 'turbidity_FNU'];
    const parameterNames = {
        temperature: 'Temperature (°C)',
        pH: 'pH',
        ORP_mV: 'ORP (mV)',
        EC: 'Electrical Conductivity (µS/cm)',
        Resistivity: 'Resistivity (Ohm·cm)',
        TDS_ppm: 'Total Dissolved Solids (ppm)',
        salinity_psu: 'Salinity (PSU)',
        pressure_psi: 'Pressure (psi)',
        DO_percentage: 'Dissolved Oxygen (%)',
        turbidity_FNU: 'Turbidity (FNU)'
    };

    const locations = Object.keys(averages);

    parameters.forEach(param => {
        const seriesData = locations.map(location => ({
            name: location,
            y: averages[location][param]
        }));

        Highcharts.chart(`chart_${param}`, {
            chart: {
                type: 'column'
            },
            title: {
                text: parameterNames[param]
            },
            xAxis: {
                type: 'category',
                title: {
                    text: 'Monitoring Locations'
                }
            },
            yAxis: {
                title: {
                    text: parameterNames[param]
                }
            },
            series: [{
                name: parameterNames[param],
                data: seriesData,
                colorByPoint: true
            }],
            tooltip: {
                pointFormat: '{series.name}: <b>{point.y:.2f}</b>'
            }
        });
    });
}

// Main function to fetch data, process it, and render charts
async function main() {
    showLoading();
    const data = await fetchWaterQualityData();
    if (data.length > 0) {
        populateFilters(data);

        // Render initial charts with unfiltered data
        const averages = calculateAverages(data);
        renderBarCharts(averages);

        // Add event listeners for filters
        document.getElementById('filterByYear').addEventListener('change', () => updateCharts(data));
        document.getElementById('filterByMonth').addEventListener('change', () => updateCharts(data));
    }
    hideLoading();
}

// Function to update charts based on filters
function updateCharts(data) {
    const filteredData = filterDataByYearAndMonth(data);
    const averages = calculateAverages(filteredData);
    renderBarCharts(averages);
}

// Event listener for page load
document.addEventListener('DOMContentLoaded', main);
