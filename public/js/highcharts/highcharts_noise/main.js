// JavaScript Document
function initializePage() {
    initializeFilters();
}

// Add this Wappler-specific event listener
document.addEventListener('dmx-app-rendered', function () {
    initializePage();
});

document.addEventListener('DOMContentLoaded', function () {
    initializeFilters();
});

// Add a request tracking variable
let currentRequest = null;
let lastSuccessfulRequest = null;
function initializeFilters() {
    const yearSelect = document.getElementById('select_year');
    const locationSelect = document.getElementById('select_monitoring_location');

    // Restore previous state if exists
    const previousState = dmx.app.pageState?.value;

    fetch('/api/noise/get_noise_year')
        .then(response => response.json())
        .then(data => {
            const noiseData = data?.query;
            const years = new Set();

            noiseData.forEach(record => {
                const year = new Date(record.start_date_time).getFullYear();
                years.add(year);
            });

            yearSelect.innerHTML = '<option value="">Select Year</option>';

            Array.from(years)
                .sort((a, b) => b - a)
                .forEach(year => {
                    const option = document.createElement('option');
                    option.value = year;
                    option.textContent = year;
                    yearSelect.appendChild(option);
                });

            const currentYear = new Date().getFullYear();
            if (years.has(currentYear)) {
                yearSelect.value = currentYear;
            } else {
                yearSelect.value = Array.from(years).sort((a, b) => b - a)[0];
            }

            // Auto-select first location if none is selected
            if (!locationSelect.value && locationSelect.options.length > 0) {
                // Skip the first option if it's a placeholder like "Select Location"
                const firstRealOption = locationSelect.options[0].value === "" ? 1 : 0;
                if (locationSelect.options.length > firstRealOption) {
                    locationSelect.selectedIndex = firstRealOption;
                }
            }

            // Trigger initial data load if both year and location are selected
            if (yearSelect.value && locationSelect.value) {
                filterData();
            }

            // Restore previous selections if they exist
            if (previousState) {
                yearSelect.value = previousState.year || '';
                locationSelect.value = previousState.location || '';

                if (yearSelect.value && locationSelect.value) {
                    filterData();
                }
            } else {
                // Your existing default selection code...
            }
        })
        .catch(error => console.error('Error fetching years:', error));

    // Debounce the filter calls
    const debouncedFilter = debounce(() => {
        if (yearSelect.value && locationSelect.value) {
            clearCharts();
            filterData();
        }
    }, 250); // 250ms delay

    yearSelect.addEventListener('change', debouncedFilter);

    // Handle location changes with consideration for DMX
    locationSelect.addEventListener('change', function (e) {
        // Prevent immediate handling to let DMX complete its operations
        setTimeout(() => {
            if (yearSelect.value && locationSelect.value) {
                clearCharts();
                filterData();
            }
        }, 100);
    });
}

// Debounce helper function
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

function clearCharts() {
    const chartContainers = ['time_series_chart_all', 'quarterly_average', 'monthly_average'];
    chartContainers.forEach(containerId => {
        const container = document.getElementById(containerId);
        if (container) {
            container.innerHTML = `
                <div class="text-center p-3">
                    <div class="spinner-border text-primary" role="status">
                        <span class="visually-hidden">Loading...</span>
                    </div>
                </div>`;
        }
    });
}

function filterData() {
    const selectedYear = document.getElementById('select_year').value;
    const selectedLocation = document.getElementById('select_monitoring_location').value;

    if (!selectedYear || !selectedLocation) {
        displayNoDataMessage('Please select both a year and a location');
        return;
    }

    // Generate a unique request identifier
    const requestId = Date.now();
    currentRequest = requestId;

    renderNoiseChart(selectedYear, selectedLocation, requestId);
}

function renderNoiseChart(selectedYear, selectedLocation, requestId) {
    const url = `api/noise/query_noise_copy`;

    // Cancel any ongoing fetch if it exists
    if (lastSuccessfulRequest && lastSuccessfulRequest.abort) {
        lastSuccessfulRequest.abort();
    }

    fetch(url)
        .then(response => response.json())
        .then(data => {
            // Check if this request is still relevant
            if (currentRequest !== requestId) {
                console.log('Discarding outdated request');
                return;
            }

            let noiseData = data?.query_noise;

            if (!noiseData || noiseData.length === 0) {
                displayNoDataMessage('No data available for the selected location');
                return;
            }

            noiseData = noiseData.filter(record => {
                const recordYear = new Date(record.start_date_time).getFullYear();
                return recordYear === parseInt(selectedYear);
            });

            if (noiseData.length === 0) {
                displayNoDataMessage('No data available for the selected year at this location');
                return;
            }

            const selectedLocationName = noiseData[0]?.org_specific_monitoring_id || "N/A";
            const locationDescription = noiseData[0]?.description || "N/A";
            const months = ['January', 'February', 'March', 'April', 'May', 'June',
                'July', 'August', 'September', 'October', 'November', 'December'];
            const yearLabel = `(${selectedYear})`;

            // Store the successful data for potential reuse
            lastSuccessfulRequest = {
                year: selectedYear,
                location: selectedLocation,
                data: noiseData
            };

            loadMonthlyNoiseChart(noiseData, `${selectedLocationName} ${yearLabel}`, months, locationDescription);
            loadTimeSeriesChart(noiseData, `${selectedLocationName} ${yearLabel}`, months, locationDescription);
            loadQuarterlyNoiseChart(noiseData, `${selectedLocationName} ${yearLabel}`, months, locationDescription);
        })
        .catch(error => {
            if (error.name === 'AbortError') {
                return; // Ignore aborted requests
            }
            console.error('Error fetching data:', error);
            displayErrorMessage();
        });
}

function displayNoDataMessage(message = 'No data available for the selected filters') {
    const chartContainers = ['time_series_chart_all', 'quarterly_average', 'monthly_average'];
    chartContainers.forEach(containerId => {
        const container = document.getElementById(containerId);
        if (container) {
            container.innerHTML = `
                <div class="alert alert-info text-center m-3" role="alert">
                    ${message}
                </div>`;
        }
    });
}

function displayErrorMessage() {
    const chartContainers = ['time_series_chart_all', 'quarterly_average', 'monthly_average'];
    chartContainers.forEach(containerId => {
        const container = document.getElementById(containerId);
        if (container) {
            container.innerHTML = `
                <div class="alert alert-danger text-center m-3" role="alert">
                    Error loading data. Please try again later.
                </div>`;
        }
    });
}

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
        const formattedDate = `${months[date.getMonth()]} ${date.getDate()}`;

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
    // console.log("Q Data: ", noiseData)
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
    const monthlyData = {}; // Object to store monthly data

    // Initialize the monthlyData object for each month
    months.forEach(month => {
        monthlyData[month] = {
            LAeq: [],
            LA10: [],
            LA90: [],
            LAFMax: [],
            LAFMin: []
        };
    });

    // Populate monthly data
    noiseData.forEach(record => {
        const date = new Date(record.start_date_time);
        const monthName = months[date.getMonth()];

        monthlyData[monthName].LAeq.push(record.LAeq);
        monthlyData[monthName].LA10.push(record.LA10);
        monthlyData[monthName].LA90.push(record.LA90);
        monthlyData[monthName].LAFMax.push(record.LAFMax);
        monthlyData[monthName].LAFMin.push(record.LAFMin);
    });

    // Calculate monthly averages
    const monthlyAverages = months.map(month => ({
        month: month,
        LAeq: calculateAverage(monthlyData[month].LAeq),
        LA10: calculateAverage(monthlyData[month].LA10),
        LA90: calculateAverage(monthlyData[month].LA90),
        LAFMax: calculateAverage(monthlyData[month].LAFMax),
        LAFMin: calculateAverage(monthlyData[month].LAFMin)
    }));

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
            data: monthlyAverages.map(item => item.LAFMax),
            color: 'red'
        }, {
            name: 'Min LAFMin',
            data: monthlyAverages.map(item => item.LAFMin),
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


function cleanupPage() {
    // Clear any pending requests
    if (currentRequest && currentRequest.abort) {
        currentRequest.abort();
    }

    // Clear charts
    ['time_series_chart_all', 'quarterly_average', 'monthly_average'].forEach(id => {
        const chart = Highcharts.charts.find(c => c.renderTo.id === id);
        if (chart) {
            chart.destroy();
        }
    });
}

// Add to your event listeners
document.addEventListener('dmx-app-beforeleave', cleanupPage);
