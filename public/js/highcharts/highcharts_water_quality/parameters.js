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

// State to store the full dataset
// State to store the full dataset
let globalData = [];

// Function to show loading state
const showLoading = () => {
    const loader = document.getElementById('loading');
    if (loader) loader.style.display = 'block';
};

// Function to hide loading state
const hideLoading = () => {
    const loader = document.getElementById('loading');
    if (loader) loader.style.display = 'none';
};

// Function to fetch data from API
const fetchWaterQualityData = async () => {
    try {
        const response = await fetch('/api/water_quality/query_water_data');
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        return data.query_water || [];
    } catch (error) {
        console.error('Error fetching water quality data:', error);
        return [];
    }
};

// Function to populate year select options
const populateYearSelect = (data) => {
    const yearSelect = document.getElementById('filterByYear');
    const years = [...new Set(data.map(item => new Date(item.date).getFullYear()))];
    years.sort((a, b) => b - a); // Sort years descending

    yearSelect.innerHTML = '<option value="">All Years</option>';
    years.forEach(year => {
        const option = document.createElement('option');
        option.value = year;
        option.textContent = year;
        yearSelect.appendChild(option);
    });
};

// Function to populate month select options
const populateMonthSelect = () => {
    const monthSelect = document.getElementById('filterByMonth');
    const months = [
        "January", "February", "March", "April", "May", "June",
        "July", "August", "September", "October", "November", "December"
    ];

    monthSelect.innerHTML = '<option value="">All Months</option>';
    months.forEach((month, index) => {
        const option = document.createElement('option');
        option.value = index + 1;
        option.textContent = month;
        monthSelect.appendChild(option);
    });
};

// Function to get month name from number
const getMonthName = (monthNumber) => {
    const months = [
        "January", "February", "March", "April", "May", "June",
        "July", "August", "September", "October", "November", "December"
    ];
    return months[monthNumber - 1];
};

// Function to filter data based on selected year and month
const filterData = (data) => {
    const selectedYear = document.getElementById('filterByYear').value;
    const selectedMonth = document.getElementById('filterByMonth').value;

    return data.filter(item => {
        const itemDate = new Date(item.date);
        const yearMatch = !selectedYear || itemDate.getFullYear() === parseInt(selectedYear);
        const monthMatch = !selectedMonth || (itemDate.getMonth() + 1) === parseInt(selectedMonth);
        return yearMatch && monthMatch;
    });
};

// Function to calculate averages per location
const calculateAverages = (data) => {
    const locationAverages = {};
    const parameters = [
        'temperature', 'pH', 'ORP_mV', 'EC', 'Resistivity',
        'TDS_ppm', 'salinity_psu', 'pressure_psi', 'DO_percentage', 'turbidity_FNU'
    ];

    data.forEach(record => {
        const location = record.org_specific_monitoring_id;
        if (!locationAverages[location]) {
            locationAverages[location] = {
                count: 0,
                description: record.description
            };
            parameters.forEach(param => {
                locationAverages[location][param] = 0;
            });
        }

        parameters.forEach(param => {
            const value = parseFloat(record[param]);
            if (!isNaN(value)) {
                locationAverages[location][param] += value;
            }
        });
        locationAverages[location].count++;
    });

    // Calculate final averages
    Object.keys(locationAverages).forEach(location => {
        parameters.forEach(param => {
            locationAverages[location][param] /= locationAverages[location].count;
        });
    });

    return locationAverages;
};

// Function to get date range text
const getDateRangeText = (data) => {
    if (!data.length) return 'No data available';

    const dates = data.map(item => new Date(item.date));
    const minDate = new Date(Math.min(...dates));
    const maxDate = new Date(Math.max(...dates));

    if (minDate.getTime() === maxDate.getTime()) {
        return minDate.toLocaleDateString();
    }

    return `${minDate.toLocaleDateString()} to ${maxDate.toLocaleDateString()}`;
};

// Function to update status message
const updateStatus = (filteredData, averages) => {
    const statusElement = document.getElementById('chartStatus');
    const selectedYear = document.getElementById('filterByYear').value;
    const selectedMonth = document.getElementById('filterByMonth').value;

    const totalLocations = Object.keys(averages).length;
    const totalReadings = filteredData.length;
    const dateRange = getDateRangeText(filteredData);

    let statusText = `Showing data for `;

    // Add time period description
    if (selectedYear && selectedMonth) {
        statusText += `${getMonthName(parseInt(selectedMonth))} ${selectedYear}`;
    } else if (selectedYear) {
        statusText += `the year ${selectedYear}`;
    } else if (selectedMonth) {
        statusText += `${getMonthName(parseInt(selectedMonth))} across all years`;
    } else {
        statusText += `all available dates`;
    }

    // Add data summary
    statusText += `<br><strong>Summary:</strong> `;
    statusText += `${totalReadings} readings from ${totalLocations} locations`;

    if (totalReadings > 0) {
        statusText += `<br><strong>Date range:</strong> ${dateRange}`;
    }

    // Add locations if there aren't too many
    if (totalLocations <= 5) {
        const locationsList = Object.entries(averages)
            .map(([id, values]) => `${id} (${values.description})`)
            .join(', ');
        statusText += `<br><strong>Locations:</strong> ${locationsList}`;
    }

    statusElement.innerHTML = statusText;
};

// Function to render charts
const renderCharts = (averages) => {
    const parameters = {
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

    Object.entries(parameters).forEach(([param, label]) => {
        const chartData = Object.entries(averages).map(([location, values]) => ({
            name: `${location} - ${values.description}`,
            y: values[param]
        }));

        Highcharts.chart(`chart_${param}`, {
            chart: {
                type: 'column'
            },
            title: {
                text: label,
                style: {
                    fontSize: '16px'
                }
            },
            xAxis: {
                type: 'category',
                labels: {
                    rotation: -45,
                    style: {
                        fontSize: '12px'
                    }
                }
            },
            yAxis: {
                title: {
                    text: label
                }
            },
            tooltip: {
                headerFormat: '<span style="font-size:10px">{point.key}</span><table>',
                pointFormat: '<tr><td style="padding:0"><b>{point.y:.2f}</b></td></tr>',
                footerFormat: '</table>',
                shared: true,
                useHTML: true
            },
            plotOptions: {
                column: {
                    pointPadding: 0.2,
                    borderWidth: 0
                }
            },
            series: [{
                name: label,
                data: chartData,
                colorByPoint: true
            }]
        });
    });
};

// Function to update charts based on filters
const updateCharts = () => {
    const filteredData = filterData(globalData);
    const averages = calculateAverages(filteredData);
    updateStatus(filteredData, averages);
    renderCharts(averages);
};

// Main initialization function
const initializeCharts = async () => {
    showLoading();

    // Fetch data
    globalData = await fetchWaterQualityData();

    if (globalData.length > 0) {
        // Populate filters
        populateYearSelect(globalData);
        populateMonthSelect();

        // Add event listeners
        document.getElementById('filterByYear').addEventListener('change', updateCharts);
        document.getElementById('filterByMonth').addEventListener('change', updateCharts);

        // Initial render
        updateCharts();
    } else {
        console.error('No data received from API');
        document.getElementById('chartStatus').innerHTML =
            '<strong>Error:</strong> No data available. Please check your connection and try again.';
    }

    hideLoading();
};

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', initializeCharts);
