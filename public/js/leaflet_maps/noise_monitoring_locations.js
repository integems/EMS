// JavaScript Document
// Leaflet Map for Noise Monitoring Locations
let map = L.map("location_map").setView([8.4344, -12.3433], 7);

L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
    maxZoom: 19,
    attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>',
}).addTo(map);

// Function to format date/time
function formatDateTime(dateTimeString) {
    let options = {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
    };
    return new Date(dateTimeString).toLocaleDateString('en-GB', options);
}

// Function to calculate average values
function calculateAverage(dataArray) {
    const linearValues = dataArray.map(value => Math.pow(10, value / 10));
    const sumLinearValues = linearValues.reduce((acc, value) => acc + value, 0);
    const N = dataArray.length;
    return 10 * Math.log10(sumLinearValues / N);
}

// Function to find the highest LAFMax and lowest LAFMin values
function findExtremeValues(dataArray, type) {
    if (dataArray.length === 0) {
        return null;
    }

    let extremeValue = dataArray[0][type];

    for (let i = 1; i < dataArray.length; i++) {
        const currentValue = dataArray[i][type];
        if (type === 'LAFMax' && currentValue > extremeValue) {
            extremeValue = currentValue;
        } else if (type === 'LAFMin' && currentValue < extremeValue) {
            extremeValue = currentValue;
        }
    }

    return extremeValue;
}

// Function to update card content with average values
function updateCardContent(data) {
    const averageLAeq = calculateAverage(data.map(entry => entry.LAeq));
    const averageLA90 = calculateAverage(data.map(entry => entry.LA90));
    const averageLA10 = calculateAverage(data.map(entry => entry.LA10));
    // const averageLAFMax = calculateAverage(data.map(entry => entry.LAFMax));
    // const averageLAFMin = calculateAverage(data.map(entry => entry.LAFMin));
    const highestLAFMax = findExtremeValues(data, 'LAFMax');
    const lowestLAFMin = findExtremeValues(data, 'LAFMin');

    document.getElementById('cardTitle').textContent = data[0].org_specific_monitoring_id;
    document.getElementById('cardContent').innerHTML = `
      <b>Location Type:</b> ${data[0].location_type}<br>
      <b>Description:</b> ${data[0].description}<br>
      <b>Start Date:</b> ${formatDateTime(data[0].start_date_time)}<br>
      <b>End Date:</b> ${formatDateTime(data[0].end_date_time)}<br>
      <b>Average LAeq:</b> ${averageLAeq.toFixed(2)}<br>
      <b>Average LA90:</b> ${averageLA90.toFixed(2)}<br>
      <b>Average LA10:</b> ${averageLA10.toFixed(2)}<br>
      <b>Highest LAFMax:</b> ${highestLAFMax.toFixed(2)}<br>
      <b>Lowest LAFMin:</b> ${lowestLAFMin.toFixed(2)}
    `;
}

//Fetch monitoring locations from the API endpoint
// fetch('/api/noise/monitoring_locations')
//     .then(response => response.json())
//     .then(data => {
//         // Group locations by location_id
//         const groupedData = {};
//         data.locations.forEach(location => {
//             const locationId = location.location_id;
//             if (!groupedData[locationId]) {
//                 groupedData[locationId] = [];
//             }
//             groupedData[locationId].push(location);
//         });

//         // Loop through grouped data and add markers with popups
//         Object.values(groupedData).forEach(locationGroup => {
//             let marker = L.marker([locationGroup[0].latitude, locationGroup[0].longitude])
//                 .addTo(map)
//                 .bindPopup(`
//             <b>${locationGroup[0].org_specific_monitoring_id}</b><br>
//             <b>Location Type:</b> ${locationGroup[0].location_type}<br>
//             <b>Description:</b> ${locationGroup[0].description}<br>
//             <b>Start Date:</b> ${formatDateTime(locationGroup[0].start_date_time)}<br>
//             <b>End Date:</b> ${formatDateTime(locationGroup[0].end_date_time)}<br>
//             <b>Average LAeq:</b> ${calculateAverage(locationGroup.map(entry => entry.LAeq)).toFixed(2)}<br>
//             <b>Average LA90:</b> ${calculateAverage(locationGroup.map(entry => entry.LA90)).toFixed(2)}<br>
//             <b>Average LA10:</b> ${calculateAverage(locationGroup.map(entry => entry.LA10)).toFixed(2)}<br>
//             <b>Highest LAFMax:</b> ${findExtremeValues(locationGroup, 'LAFMax').toFixed(2)}<br>
//             <b>Lowest LAFMin:</b> ${findExtremeValues(locationGroup, 'LAFMin').toFixed(2)}
//           `)
//                 .on('click', function () {
//                     // Update card content when marker is clicked
//                     updateCardContent(locationGroup);
//                 });
//         });
//     })
//     .catch(error => console.error('Error fetching data:', error));

//-------------------------------------------------------------------------------------------------------------------------------

fetch('/api/noise/monitoring_locations')
    .then(response => response.json())
    .then(data => {
        const groupedData = {};
        data.locations.forEach(location => {
            const locationId = location.location_id;
            const startDate = location.start_date_time.split('T')[0];
            const key = `${locationId}_${startDate}`;

            if (!groupedData[key]) {
                groupedData[key] = [];
            }
            groupedData[key].push(location);
        });

        // Loop through grouped data and add markers with popups
        Object.values(groupedData).forEach(locationGroup => {
            let marker = L.marker([locationGroup[0].latitude, locationGroup[0].longitude])
                .addTo(map)
                .bindPopup(`
            <b>${locationGroup[0].org_specific_monitoring_id}</b><br>
            <b>Location Type:</b> ${locationGroup[0].location_type}<br>
            <b>Description:</b> ${locationGroup[0].description}<br>
            <b>Start Date:</b> ${formatDateTime(locationGroup[0].start_date_time)}<br>
            <b>End Date:</b> ${formatDateTime(locationGroup[0].end_date_time)}<br>
            <b>Average LAeq:</b> ${calculateAverage(locationGroup.map(entry => entry.LAeq)).toFixed(2)}<br>
            <b>Average LA90:</b> ${calculateAverage(locationGroup.map(entry => entry.LA90)).toFixed(2)}<br>
            <b>Average LA10:</b> ${calculateAverage(locationGroup.map(entry => entry.LA10)).toFixed(2)}<br>
            <b>Highest LAFMax:</b> ${findExtremeValues(locationGroup, 'LAFMax').toFixed(2)}<br>
            <b>Lowest LAFMin:</b> ${findExtremeValues(locationGroup, 'LAFMin').toFixed(2)}
          `)
                .on('click', function () {
                    updateCardContent(locationGroup);
                });
        });
    })
    .catch(error => console.error('Error fetching data:', error));