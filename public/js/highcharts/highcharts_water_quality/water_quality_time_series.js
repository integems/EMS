
// let waterData = [];

// // Fetch water quality data from the API
// async function fetchWaterData() {
//     try {
//         const response = await fetch('/api/water_quality/query_water_data');
//         const data = await response.json();
//         waterData = data.query_water;
//         populateLocationSelect(waterData);
//         createCharts(waterData);
//     } catch (error) {
//         console.error('Error fetching data:', error);
//     }
// }

// // Populate the location dropdown based on 'org_specific_monitoring_id' and 'description'
// function populateLocationSelect(data) {
//     const orgSelect = document.getElementById('orgSelect');
//     const uniqueLocations = [...new Set(data.map(item => `${item.org_specific_monitoring_id} - ${item.description}`))];

//     uniqueLocations.forEach(location => {
//         const option = document.createElement('option');
//         option.value = location;
//         option.textContent = location;
//         orgSelect.appendChild(option);
//     });
// }

// // Filter data by selected location and recreate the charts
// function filterByLocation() {
//     const selectedLocation = document.getElementById('orgSelect').value;
//     const [orgId] = selectedLocation.split(' - '); // Extract the org_specific_monitoring_id
//     const filteredData = waterData.filter(item => item.org_specific_monitoring_id === orgId);
//     createCharts(filteredData);
// }

// // Create the time series charts for temperature, pH, DO, and turbidity
// function createCharts(data) {
//     if (!data.length) {
//         console.warn('No data available for the selected location.');
//         return;
//     }

//     // Sort the data by date to ensure proper date order
//     data.sort((a, b) => new Date(a.date) - new Date(b.date));

//     // Find the latest date in the data and calculate three months prior to it
//     const latestDate = new Date(data[data.length - 1].date);
//     const threeMonthsAgo = new Date(latestDate);
//     threeMonthsAgo.setMonth(threeMonthsAgo.getMonth() - 3);

//     // Filter data to include only the last three months of available data
//     const filteredData = data.filter(item => {
//         const itemDate = new Date(item.date);
//         return itemDate >= threeMonthsAgo && itemDate <= latestDate;
//     });

//     if (!filteredData.length) {
//         console.warn('No data available for the last 3 months of records.');
//         return;
//     }

//     const dates = filteredData.map(item => item.date);
//     const temperatures = filteredData.map(item => parseFloat(item.temperature));
//     const pHValues = filteredData.map(item => parseFloat(item.pH));
//     const doValues = filteredData.map(item => parseFloat(item.DO_ppm));
//     const turbidityValues = filteredData.map(item => parseFloat(item.turbidity_FNU));

//     // Check for parsed values to ensure correctness
//     // console.log('Filtered Dates:', dates);
//     // console.log('Temperatures:', temperatures);
//     // console.log('pH Values:', pHValues);
//     // console.log('DO Values:', doValues);
//     // console.log('Turbidity Values:', turbidityValues);

//     Highcharts.chart('tempChart', {
//         title: { text: 'Temperature Over Last Quarter' },
//         xAxis: { categories: dates, title: { text: 'Date' } },
//         yAxis: { title: { text: 'Temperature (°C)' } },
//         series: [{ name: 'Temperature', data: temperatures }],
//         chart: { type: 'line' }
//     });

//     Highcharts.chart('phChart', {
//         title: { text: 'pH Over Last Quarter' },
//         xAxis: { categories: dates, title: { text: 'Date' } },
//         yAxis: { title: { text: 'pH Level' } },
//         series: [{ name: 'pH', data: pHValues }],
//         chart: { type: 'line' }
//     });

//     Highcharts.chart('doChart', {
//         title: { text: 'Dissolved Oxygen (DO) Over Last Quarter' },
//         xAxis: { categories: dates, title: { text: 'Date' } },
//         yAxis: { title: { text: 'DO (ppm)' } },
//         series: [{ name: 'Dissolved Oxygen', data: doValues }],
//         chart: { type: 'line' }
//     });

//     Highcharts.chart('turbidityChart', {
//         title: { text: 'Turbidity Over Last Quarter' },
//         xAxis: { categories: dates, title: { text: 'Date' } },
//         yAxis: { title: { text: 'Turbidity (FNU)' } },
//         series: [{ name: 'Turbidity', data: turbidityValues }],
//         chart: { type: 'line' }
//     });
// }

// // Event listener for location selection change
// document.getElementById('orgSelect').addEventListener('change', filterByLocation);

// // Initial fetch of water data
// fetchWaterData();

//--------------------------------------------------------------------------------------------------
// let waterData = [];

// // Fetch water quality data from the API
// async function fetchWaterData() {
//     try {
//         const response = await fetch('/api/water_quality/query_water_data');
//         const data = await response.json();
//         waterData = data.query_water;
//         populateLocationSelect(waterData);
//         populateYearSelect(waterData);
//         const latestYear = Math.max(...waterData.map(item => new Date(item.date).getFullYear()));
//         document.getElementById('selectYear').value = latestYear;
//         filterByLocationAndYear();
//     } catch (error) {
//         console.error('Error fetching data:', error);
//     }
// }

// // Populate the location dropdown based on 'org_specific_monitoring_id' and 'description'
// function populateLocationSelect(data) {
//     const orgSelect = document.getElementById('orgSelect');
//     const uniqueLocations = [...new Set(data.map(item => `${item.org_specific_monitoring_id} - ${item.description}`))];

//     uniqueLocations.forEach(location => {
//         const option = document.createElement('option');
//         option.value = location;
//         option.textContent = location;
//         orgSelect.appendChild(option);
//     });
// }

// // Populate the year dropdown based on the data
// function populateYearSelect(data) {
//     const yearSelect = document.getElementById('selectYear');
//     const uniqueYears = [...new Set(data.map(item => new Date(item.date).getFullYear()))];
//     uniqueYears.sort((a, b) => b - a); // Sort in descending order

//     uniqueYears.forEach(year => {
//         const option = document.createElement('option');
//         option.value = year;
//         option.textContent = year;
//         yearSelect.appendChild(option);
//     });
// }

// // Filter data by selected location and year, then recreate the charts
// function filterByLocationAndYear() {
//     const selectedLocation = document.getElementById('orgSelect').value;
//     const selectedYear = document.getElementById('selectYear').value;
//     const [orgId] = selectedLocation.split(' - '); // Extract the org_specific_monitoring_id

//     const filteredData = waterData.filter(item => {
//         const itemDate = new Date(item.date);
//         return item.org_specific_monitoring_id === orgId && itemDate.getFullYear() === parseInt(selectedYear);
//     });

//     createCharts(filteredData);
// }

// // Create the time series charts for temperature, pH, DO, and turbidity
// function createCharts(data) {
//     if (!data.length) {
//         console.warn('No data available for the selected location and year.');
//         return;
//     }

//     // Sort the data by date to ensure proper date order
//     data.sort((a, b) => new Date(a.date) - new Date(b.date));

//     const dates = data.map(item => {
//         const itemDate = new Date(item.date);
//         return `${itemDate.toLocaleString('default', { month: 'short' })} ${itemDate.getDate()}`;
//     });
//     const temperatures = data.map(item => parseFloat(item.temperature));
//     const pHValues = data.map(item => parseFloat(item.pH));
//     const doValues = data.map(item => parseFloat(item.DO_ppm));
//     const turbidityValues = data.map(item => parseFloat(item.turbidity_FNU));

//     Highcharts.chart('tempChart', {
//         title: { text: 'Temperature' },
//         xAxis: { categories: dates, title: { text: 'Date' } },
//         yAxis: { title: { text: 'Temperature (°C) over last quarter' } },
//         series: [{ name: 'Temperature', data: temperatures }],
//         chart: { type: 'line' }
//     });

//     Highcharts.chart('phChart', {
//         title: { text: 'pH over last quarter' },
//         xAxis: { categories: dates, title: { text: 'Date' } },
//         yAxis: { title: { text: 'pH Level' } },
//         series: [{ name: 'pH', data: pHValues }],
//         chart: { type: 'line' }
//     });

//     Highcharts.chart('doChart', {
//         title: { text: 'Dissolved Oxygen (DO) over last quarter' },
//         xAxis: { categories: dates, title: { text: 'Date' } },
//         yAxis: { title: { text: 'DO (ppm)' } },
//         series: [{ name: 'Dissolved Oxygen', data: doValues }],
//         chart: { type: 'line' }
//     });

//     Highcharts.chart('turbidityChart', {
//         title: { text: 'Turbidity over last quarter' },
//         xAxis: { categories: dates, title: { text: 'Date' } },
//         yAxis: { title: { text: 'Turbidity (FNU)' } },
//         series: [{ name: 'Turbidity', data: turbidityValues }],
//         chart: { type: 'line' }
//     });
// }

// // Event listeners for location and year selection changes
// document.getElementById('orgSelect').addEventListener('change', filterByLocationAndYear);
// document.getElementById('selectYear').addEventListener('change', filterByLocationAndYear);

// // Initial fetch of water data
// fetchWaterData();


//------------------------------------------316018--------------------------------------------------------------------------

// let waterData = [];

// // Fetch water quality data from the API
// async function fetchWaterData() {
//     try {
//         const response = await fetch('/api/water_quality/query_water_data');
//         const data = await response.json();
//         waterData = data.query_water;
//         populateLocationSelect(waterData);
//         populateYearSelect(waterData);
//         const latestYear = Math.max(...waterData.map(item => new Date(item.date).getFullYear()));
//         document.getElementById('selectYear').value = latestYear;

//         // Set current quarter based on current date
//         const currentDate = new Date();
//         const currentQuarter = Math.ceil((currentDate.getMonth() + 1) / 3);
//         document.getElementById('selectQuarter').value = currentQuarter;

//         filterByLocationAndYear();
//     } catch (error) {
//         console.error('Error fetching data:', error);
//     }
// }

// // Populate the location dropdown
// function populateLocationSelect(data) {
//     const orgSelect = document.getElementById('orgSelect');
//     const uniqueLocations = [...new Set(data.map(item => `${item.org_specific_monitoring_id} - ${item.description}`))];

//     uniqueLocations.forEach(location => {
//         const option = document.createElement('option');
//         option.value = location;
//         option.textContent = location;
//         orgSelect.appendChild(option);
//     });
// }

// // Populate the year dropdown
// function populateYearSelect(data) {
//     const yearSelect = document.getElementById('selectYear');
//     const uniqueYears = [...new Set(data.map(item => new Date(item.date).getFullYear()))];
//     uniqueYears.sort((a, b) => b - a);

//     uniqueYears.forEach(year => {
//         const option = document.createElement('option');
//         option.value = year;
//         option.textContent = year;
//         yearSelect.appendChild(option);
//     });
// }

// // Get the date range for a specific quarter
// function getQuarterDateRange(year, quarter) {
//     const startMonth = (quarter - 1) * 3;
//     const endMonth = startMonth + 2;
//     return {
//         start: new Date(year, startMonth, 1),
//         end: new Date(year, endMonth + 1, 0) // Last day of the end month
//     };
// }

// // Update quarter options based on available data
// function updateQuarterOptions() {
//     const selectedYear = parseInt(document.getElementById('selectYear').value);
//     const selectedLocation = document.getElementById('orgSelect').value;
//     const [orgId] = selectedLocation.split(' - ');

//     // Filter data for the selected year and location
//     const yearData = waterData.filter(item => {
//         const itemDate = new Date(item.date);
//         return itemDate.getFullYear() === selectedYear &&
//             item.org_specific_monitoring_id === orgId;
//     });

//     // Enable/disable quarters based on data availability
//     const quarterSelect = document.getElementById('selectQuarter');
//     Array.from(quarterSelect.options).forEach((option, index) => {
//         const quarter = index + 1;
//         const { start, end } = getQuarterDateRange(selectedYear, quarter);
//         const hasData = yearData.some(item => {
//             const itemDate = new Date(item.date);
//             return itemDate >= start && itemDate <= end;
//         });
//         option.disabled = !hasData;
//     });

//     // Select the first available quarter
//     const firstAvailableQuarter = Array.from(quarterSelect.options)
//         .find(option => !option.disabled);
//     if (firstAvailableQuarter) {
//         quarterSelect.value = firstAvailableQuarter.value;
//     }

//     filterByLocationAndYear();
// }

// // Filter data by selected location, year, and quarter
// function filterByLocationAndYear() {
//     const selectedLocation = document.getElementById('orgSelect').value;
//     const selectedYear = parseInt(document.getElementById('selectYear').value);
//     const selectedQuarter = parseInt(document.getElementById('selectQuarter').value);
//     const [orgId] = selectedLocation.split(' - ');

//     const { start, end } = getQuarterDateRange(selectedYear, selectedQuarter);

//     const filteredData = waterData.filter(item => {
//         const itemDate = new Date(item.date);
//         return item.org_specific_monitoring_id === orgId &&
//             itemDate >= start &&
//             itemDate <= end;
//     });

//     createCharts(filteredData);
// }

// // Create the time series charts
// function createCharts(data) {
//     if (!data.length) {
//         console.warn('No data available for the selected location, year, and quarter.');
//         return;
//     }

//     data.sort((a, b) => new Date(a.date) - new Date(b.date));

//     const dates = data.map(item => {
//         const itemDate = new Date(item.date);
//         return `${itemDate.toLocaleString('default', { month: 'short' })} ${itemDate.getDate()}`;
//     });
//     const temperatures = data.map(item => parseFloat(item.temperature));
//     const pHValues = data.map(item => parseFloat(item.pH));
//     const doValues = data.map(item => parseFloat(item.DO_ppm));
//     const turbidityValues = data.map(item => parseFloat(item.turbidity_FNU));

//     // Create temperature chart
//     Highcharts.chart('tempChart', {
//         title: { text: 'Temperature' },
//         xAxis: { categories: dates, title: { text: 'Date' } },
//         yAxis: { title: { text: 'Temperature (°C)' } },
//         series: [{ name: 'Temperature', data: temperatures }],
//         chart: { type: 'line' }
//     });

//     // Create pH chart
//     Highcharts.chart('phChart', {
//         title: { text: 'pH' },
//         xAxis: { categories: dates, title: { text: 'Date' } },
//         yAxis: { title: { text: 'pH Level' } },
//         series: [{ name: 'pH', data: pHValues }],
//         chart: { type: 'line' }
//     });

//     // Create DO chart
//     Highcharts.chart('doChart', {
//         title: { text: 'Dissolved Oxygen (DO)' },
//         xAxis: { categories: dates, title: { text: 'Date' } },
//         yAxis: { title: { text: 'DO (ppm)' } },
//         series: [{ name: 'Dissolved Oxygen', data: doValues }],
//         chart: { type: 'line' }
//     });

//     // Create turbidity chart
//     Highcharts.chart('turbidityChart', {
//         title: { text: 'Turbidity' },
//         xAxis: { categories: dates, title: { text: 'Date' } },
//         yAxis: { title: { text: 'Turbidity (FNU)' } },
//         series: [{ name: 'Turbidity', data: turbidityValues }],
//         chart: { type: 'line' }
//     });
// }

// // Event listeners
// document.getElementById('orgSelect').addEventListener('change', updateQuarterOptions);
// document.getElementById('selectYear').addEventListener('change', updateQuarterOptions);
// document.getElementById('selectQuarter').addEventListener('change', filterByLocationAndYear);

// // Initial fetch of water data
// fetchWaterData();


//-----------------------------------------2000-------------------------------------------------------------------
let waterData = [];

// Fetch water quality data from the API
async function fetchWaterData() {
    try {
        const response = await fetch('/api/water_quality/query_water_data');
        const data = await response.json();
        waterData = data.query_water;
        populateLocationSelect(waterData);
        populateYearSelect(waterData);
        const latestYear = Math.max(...waterData.map(item => new Date(item.date).getFullYear()));
        document.getElementById('selectYear').value = latestYear;

        // Set current quarter based on current date
        const currentDate = new Date();
        const currentQuarter = Math.ceil((currentDate.getMonth() + 1) / 3);
        document.getElementById('selectQuarter').value = currentQuarter;

        filterByLocationAndYear();
    } catch (error) {
        console.error('Error fetching data:', error);
    }
}

// Populate the location dropdown
function populateLocationSelect(data) {
    const orgSelect = document.getElementById('orgSelect');
    orgSelect.innerHTML = ''; // Clear existing options
    const uniqueLocations = [...new Set(data.map(item => `${item.org_specific_monitoring_id} - ${item.description}`))];

    uniqueLocations.forEach(location => {
        const option = document.createElement('option');
        option.value = location;
        option.textContent = location;
        orgSelect.appendChild(option);
    });
}

// Populate the year dropdown
function populateYearSelect(data) {
    const yearSelect = document.getElementById('selectYear');
    yearSelect.innerHTML = ''; // Clear existing options
    const uniqueYears = [...new Set(data.map(item => new Date(item.date).getFullYear()))];
    uniqueYears.sort((a, b) => b - a);

    uniqueYears.forEach(year => {
        const option = document.createElement('option');
        option.value = year;
        option.textContent = year;
        yearSelect.appendChild(option);
    });
}

// Get the date range for a specific quarter
function getQuarterDateRange(year, quarter) {
    const startMonth = (quarter - 1) * 3;
    const endMonth = startMonth + 2;
    return {
        start: new Date(year, startMonth, 1),
        end: new Date(year, endMonth + 1, 0) // Last day of the end month
    };
}

// Update quarter options based on available data
function updateQuarterOptions() {
    const selectedYear = parseInt(document.getElementById('selectYear').value);
    const selectedLocation = document.getElementById('orgSelect').value;
    const [orgId] = selectedLocation.split(' - ');

    // Filter data for the selected year and location
    const yearData = waterData.filter(item => {
        const itemDate = new Date(item.date);
        return itemDate.getFullYear() === selectedYear &&
            item.org_specific_monitoring_id === orgId;
    });

    // Enable/disable quarters based on data availability
    const quarterSelect = document.getElementById('selectQuarter');
    Array.from(quarterSelect.options).forEach((option, index) => {
        const quarter = index + 1;
        const { start, end } = getQuarterDateRange(selectedYear, quarter);
        const hasData = yearData.some(item => {
            const itemDate = new Date(item.date);
            return itemDate >= start && itemDate <= end;
        });
        option.disabled = !hasData;
    });

    // Select the first available quarter
    const firstAvailableQuarter = Array.from(quarterSelect.options)
        .find(option => !option.disabled);
    if (firstAvailableQuarter) {
        quarterSelect.value = firstAvailableQuarter.value;
    }

    filterByLocationAndYear();
}

// Filter data by selected location, year, and quarter
function filterByLocationAndYear() {
    const selectedLocation = document.getElementById('orgSelect').value;
    const selectedYear = parseInt(document.getElementById('selectYear').value);
    const selectedQuarter = parseInt(document.getElementById('selectQuarter').value);
    const [orgId] = selectedLocation.split(' - ');

    const { start, end } = getQuarterDateRange(selectedYear, selectedQuarter);

    const filteredData = waterData.filter(item => {
        const itemDate = new Date(item.date);
        return item.org_specific_monitoring_id === orgId &&
            itemDate >= start &&
            itemDate <= end;
    });

    createCharts(filteredData, selectedLocation, selectedYear, selectedQuarter);
}

// Create the time series charts
function createCharts(data, location, year, quarter) {
    // Ensure chart containers exist
    const chartContainers = ['tempChart', 'phChart', 'doChart', 'turbidityChart'];
    chartContainers.forEach(containerId => {
        let container = document.getElementById(containerId);
        if (!container) {
            console.error(`Chart container ${containerId} not found`);
            return;
        }
        container.innerHTML = ''; // Clear existing content
    });

    if (!data.length) {
        const message = document.createElement('div');
        message.className = 'no-data-message';
        message.textContent = `No data available for the selected location (${location}), year (${year}), and quarter (${quarter}).`;

        // Find a container to place the message (preferably the first chart container)
        const firstChartContainer = document.getElementById('tempChart');
        if (firstChartContainer) {
            firstChartContainer.appendChild(message);
        }
        return;
    }

    data.sort((a, b) => new Date(a.date) - new Date(b.date));

    const dates = data.map(item => {
        const itemDate = new Date(item.date);
        return `${itemDate.toLocaleString('default', { month: 'short' })} ${itemDate.getDate()}`;
    });
    const temperatures = data.map(item => parseFloat(item.temperature));
    const pHValues = data.map(item => parseFloat(item.pH));
    const doValues = data.map(item => parseFloat(item.DO_ppm));
    const turbidityValues = data.map(item => parseFloat(item.turbidity_FNU));

    // Create temperature chart
    Highcharts.chart('tempChart', {
        title: { text: 'Temperature' },
        xAxis: { categories: dates, title: { text: 'Date' } },
        yAxis: { title: { text: 'Temperature (°C)' } },
        series: [{ name: 'Temperature', data: temperatures }],
        chart: { type: 'line' }
    });

    // Create pH chart
    Highcharts.chart('phChart', {
        title: { text: 'pH' },
        xAxis: { categories: dates, title: { text: 'Date' } },
        yAxis: { title: { text: 'pH Level' } },
        series: [{ name: 'pH', data: pHValues }],
        chart: { type: 'line' }
    });

    // Create DO chart
    Highcharts.chart('doChart', {
        title: { text: 'Dissolved Oxygen (DO)' },
        xAxis: { categories: dates, title: { text: 'Date' } },
        yAxis: { title: { text: 'DO (ppm)' } },
        series: [{ name: 'Dissolved Oxygen', data: doValues }],
        chart: { type: 'line' }
    });

    // Create turbidity chart
    Highcharts.chart('turbidityChart', {
        title: { text: 'Turbidity' },
        xAxis: { categories: dates, title: { text: 'Date' } },
        yAxis: { title: { text: 'Turbidity (FNU)' } },
        series: [{ name: 'Turbidity', data: turbidityValues }],
        chart: { type: 'line' }
    });
}

// Event listeners
document.getElementById('orgSelect').addEventListener('change', updateQuarterOptions);
document.getElementById('selectYear').addEventListener('change', updateQuarterOptions);
document.getElementById('selectQuarter').addEventListener('change', filterByLocationAndYear);

// Initial fetch of water data
document.addEventListener('DOMContentLoaded', fetchWaterData);
