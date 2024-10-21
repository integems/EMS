// JavaScript Document

// Function to fetch water data
async function fetchWaterData(year, locationId) {
    try {
        const response = await fetch(`/api/water_quality/query_water_data`);
        const data = await response.json();
        console.log(data);
        if (!data.query_water) {
            throw new Error("No water data available");
        }

        // Filter data by year and location
        let filteredData = data.query_water;
        if (year) {
            filteredData = filteredData.filter(item => new Date(item.date).getFullYear() === parseInt(year));
        }
        if (locationId) {
            filteredData = filteredData.filter(item => item.location_id == locationId);
        }

        return filteredData;
    } catch (error) {
        console.error("Error fetching water data:", error);
        return [];
    }
}

// Function to calculate averages
function calculateAverages(data) {
    const monthlyData = {};
    const quarterlyData = {};

    data.forEach(item => {
        const date = new Date(item.date);
        const month = date.getMonth(); // 0-11
        const quarter = Math.floor(month / 3) + 1; // 1-4

        // Calculate monthly averages
        if (!monthlyData[month]) {
            monthlyData[month] = {
                temperature: [],
                pH: [],
                DO_ppm: [],
                turbidity_FNU: []
            };
        }
        monthlyData[month].temperature.push(parseFloat(item.temperature));
        monthlyData[month].pH.push(parseFloat(item.pH));
        monthlyData[month].DO_ppm.push(parseFloat(item.DO_ppm));
        monthlyData[month].turbidity_FNU.push(parseFloat(item.turbidity_FNU));

        // Calculate quarterly averages
        if (!quarterlyData[quarter]) {
            quarterlyData[quarter] = {
                temperature: [],
                pH: [],
                DO_ppm: [],
                turbidity_FNU: []
            };
        }
        quarterlyData[quarter].temperature.push(parseFloat(item.temperature));
        quarterlyData[quarter].pH.push(parseFloat(item.pH));
        quarterlyData[quarter].DO_ppm.push(parseFloat(item.DO_ppm));
        quarterlyData[quarter].turbidity_FNU.push(parseFloat(item.turbidity_FNU));
    });

    // Compute the average for each month and quarter
    const averageMonthlyData = Object.keys(monthlyData).map(month => ({
        month: month,
        temperature: calculateAverage(monthlyData[month].temperature),
        pH: calculateAverage(monthlyData[month].pH),
        DO_ppm: calculateAverage(monthlyData[month].DO_ppm),
        turbidity_FNU: calculateAverage(monthlyData[month].turbidity_FNU)
    }));

    const averageQuarterlyData = Object.keys(quarterlyData).map(quarter => ({
        quarter: quarter,
        temperature: calculateAverage(quarterlyData[quarter].temperature),
        pH: calculateAverage(quarterlyData[quarter].pH),
        DO_ppm: calculateAverage(quarterlyData[quarter].DO_ppm),
        turbidity_FNU: calculateAverage(quarterlyData[quarter].turbidity_FNU)
    }));

    return { averageMonthlyData, averageQuarterlyData };
}

// Helper function to calculate the arithmetic average
function calculateAverage(arr) {
    const sum = arr.reduce((acc, val) => acc + val, 0);
    return parseFloat((sum / arr.length).toFixed(2)) || 0;
}

// Function to render charts
function renderWaterCharts(monthlyData, quarterlyData) {
    const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

    // Example of rendering a Highcharts chart for monthly data
    Highcharts.chart('monthly_chart', {
        chart: { type: 'column' },
        title: { text: 'Monthly Water Quality Averages' },
        xAxis: {
            categories: monthlyData.map(item => monthNames[parseInt(item.month)])
        },
        yAxis: { title: { text: 'Average Values' } },
        series: [
            {
                name: 'Temperature (°C)',
                data: monthlyData.map(item => item.temperature)
            },
            {
                name: 'pH',
                data: monthlyData.map(item => item.pH)
            },
            {
                name: 'Dissolved Oxygen (ppm)',
                data: monthlyData.map(item => item.DO_ppm)
            },
            {
                name: 'Turbidity (FNU)',
                data: monthlyData.map(item => item.turbidity_FNU)
            }
        ]
    });

    // Example of rendering a Highcharts chart for quarterly data
    Highcharts.chart('quarterly_chart', {
        chart: { type: 'column' },
        title: { text: 'Quarterly Water Quality Averages' },
        xAxis: {
            categories: quarterlyData.map(item => `Q${item.quarter}`)
        },
        yAxis: { title: { text: 'Average Values' } },
        series: [
            {
                name: 'Temperature (°C)',
                data: quarterlyData.map(item => item.temperature)
            },
            {
                name: 'pH',
                data: quarterlyData.map(item => item.pH)
            },
            {
                name: 'Dissolved Oxygen (ppm)',
                data: quarterlyData.map(item => item.DO_ppm)
            },
            {
                name: 'Turbidity (FNU)',
                data: quarterlyData.map(item => item.turbidity_FNU)
            }
        ]
    });
}

// Function to filter and update the charts based on user input
async function filterByYear() {
    const year = document.getElementById('select_year').value;
    const locationId = document.getElementById('select_monitoring_location').value;
    console.log(`Selected Year: ${year}, Selected Location ID: ${locationId}`);
    const data = await fetchWaterData(year, locationId);
    const { averageMonthlyData, averageQuarterlyData } = calculateAverages(data);
    renderWaterCharts(averageMonthlyData, averageQuarterlyData);
}

// Initialize charts on page load
document.addEventListener('DOMContentLoaded', () => {
    filterByYear(); // Load data for the default selected year and location
});
