

// // Define the custom grey icon
// let greyIcon = L.icon({
//     iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-grey.png',
//     iconSize: [25, 41],
//     iconAnchor: [12, 41],
//     popupAnchor: [1, -34]
// });

// // Initialize the map
// let map = L.map("location_map").setView([8.6439, -10.9714], 11);

// // Set up the OpenStreetMap layer
// L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
//     maxZoom: 19,
//     attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>',
// }).addTo(map);

// // Function to format date/time
// function formatDateTime(dateTimeString) {
//     let options = {
//         day: '2-digit',
//         month: '2-digit',
//         year: 'numeric',
//     };
//     return new Date(dateTimeString).toLocaleDateString('en-GB', options);
// }

// // Fetch data from the API
// fetch('/api/noise/monitoring_locations')
//     .then(response => response.json())
//     .then(data => {
//         console.log('Fetched data:', data);

//         // Group data by location_id and keep only the most recent entry per location
//         const uniqueLocations = data.locations.reduce((acc, location) => {
//             const locationId = location.location_id;

//             if (!acc[locationId] || new Date(location.start_date_time) > new Date(acc[locationId].start_date_time)) {
//                 acc[locationId] = location;
//             }

//             return acc;
//         }, {});

//         console.log('Unique locations:', uniqueLocations);

//         // Loop through unique locations and add markers with popups
//         Object.values(uniqueLocations).forEach(location => {
//             console.log('Adding marker at:', location.latitude, location.longitude);

//             // Add marker to the map
//             L.marker([location.latitude, location.longitude], { icon: greyIcon })
//                 .addTo(map)
//                 .bindPopup(`
//                             <b>${location.org_specific_monitoring_id}</b>
//                             <b>${location.description}</b><br>
//                             <b>Location Type:</b> ${location.location_type}<br>
//                             <b>Start Date:</b> ${formatDateTime(location.start_date_time)}<br>
//                             <b>End Date:</b> ${formatDateTime(location.end_date_time)}<br>
//                             <b>LAeq:</b> ${location.LAeq.toFixed(2)}<br>
//                             <b>LA90:</b> ${location.LA90.toFixed(2)}<br>
//                             <b>LA10:</b> ${location.LA10.toFixed(2)}<br>
//                             <b>LAFMax:</b> ${location.LAFMax.toFixed(2)}<br>
//                             <b>LAFMin:</b> ${location.LAFMin.toFixed(2)}<br>
//                         `);
//         });
//     })
//     .catch(error => console.error('Error fetching data:', error));





// Initialize the map
let map = L.map("location_map").setView([8.6439, -10.9714], 11);

// Set up the OpenStreetMap layer
L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
    maxZoom: 19,
    attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>',
}).addTo(map);

// Array of icon URLs with different colors
let iconColors = [
    'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png',
    'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-blue.png',
    'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-green.png',
    // Add more colors as needed
];

// Function to format date/time
function formatDateTime(dateTimeString) {
    let options = {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
    };
    return new Date(dateTimeString).toLocaleDateString('en-GB', options);
}

// Fetch data from the API
fetch('/api/noise/monitoring_locations')
    .then(response => response.json())
    .then(data => {
        console.log('Fetched data:', data);

        // Group data by location_id and keep only the most recent entry per location
        const uniqueLocations = data.locations.reduce((acc, location, index) => {
            const locationId = location.location_id;

            if (!acc[locationId] || new Date(location.start_date_time) > new Date(acc[locationId].start_date_time)) {
                acc[locationId] = { ...location, index }; // Store the index for color selection
            }

            return acc;
        }, {});

        console.log('Unique locations:', uniqueLocations);

        // Loop through unique locations and add markers with popups
        Object.values(uniqueLocations).forEach(location => {
            console.log('Adding marker at:', location.latitude, location.longitude);

            // Select icon color based on the index
            let iconUrl = iconColors[location.index % iconColors.length];

            // Define the custom icon
            let customIcon = L.icon({
                iconUrl: iconUrl,
                iconSize: [25, 41],
                iconAnchor: [12, 41],
                popupAnchor: [1, -34]
            });

            // Add marker to the map
            L.marker([location.latitude, location.longitude], { icon: customIcon })
                .addTo(map)
                .bindPopup(`
                            <b>${location.org_specific_monitoring_id}</b>
                            <b>${location.description}</b><br>
                            <b>Location Type:</b> ${location.location_type}<br>
                            <b>Start Date:</b> ${formatDateTime(location.start_date_time)}<br>
                            <b>End Date:</b> ${formatDateTime(location.end_date_time)}<br>
                            <b>LAeq:</b> ${location.LAeq.toFixed(2)}<br>
                            <b>LA90:</b> ${location.LA90.toFixed(2)}<br>
                            <b>LA10:</b> ${location.LA10.toFixed(2)}<br>
                            <b>LAFMax:</b> ${location.LAFMax.toFixed(2)}<br>
                            <b>LAFMin:</b> ${location.LAFMin.toFixed(2)}<br>
                        `);
        });
    })
    .catch(error => console.error('Error fetching data:', error));


