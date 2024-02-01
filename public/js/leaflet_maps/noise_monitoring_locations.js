// JavaScript Document
//Leaflet Map for Noise Monitoring Locations
var map = L.map("location_map").setView([8.4344, -12.3433], 7);

L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
    maxZoom: 19,
    attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>',
}).addTo(map);

// Function to format date/time
function formatDateTime(dateTimeString) {
    var options = {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit'
    };
    return new Date(dateTimeString).toLocaleDateString('en-GB', options);
}

// Function to update card content
function updateCardContent(data) {
    document.getElementById('cardTitle').textContent = data.org_specific_monitoring_id;
    document.getElementById('cardContent').innerHTML = `
      <b>Location Type:</b> ${data.location_type}<br>
      <b>Description:</b> ${data.description}<br>
      <b>Start Date/Time:</b> ${formatDateTime(data.start_date_time)}<br>
      <b>End Date/Time:</b> ${formatDateTime(data.end_date_time)}<br>
      <b>LAeq:</b> ${data.LAeq}<br>
      <b>LA90:</b> ${data.LA90}<br>
      <b>LA10:</b> ${data.LA10}<br>
      <b>LAFMax:</b> ${data.LAFMax}<br>
      <b>LAFMin:</b> ${data.LAFMin}
    `;
}

// Fetch monitoring locations from the API endpoint
fetch('http://localhost:3000/api/noise/monitoring_locations')
    .then(response => response.json())
    .then(data => {
        // Loop through locations and add markers with popups
        data.locations.forEach(location => {
            var formattedStartDate = formatDateTime(location.start_date_time);
            var formattedEndDate = formatDateTime(location.end_date_time);

            var marker = L.marker([location.latitude, location.longitude])
                .addTo(map)
                .bindPopup(`
            <b>${location.org_specific_monitoring_id}</b><br>
            <b>Location Type:</b> ${location.location_type}<br>
            <b>Description:</b> ${location.description}<br>
            <b>Start Date/Time:</b> ${formattedStartDate}<br>
            <b>End Date/Time:</b> ${formattedEndDate}<br>
            <b>LAeq:</b> ${location.LAeq}<br>
            <b>LA90:</b> ${location.LA90}<br>
            <b>LA10:</b> ${location.LA10}<br>
            <b>LAFMax:</b> ${location.LAFMax}<br>
            <b>LAFMin:</b> ${location.LAFMin}
          `)
                .on('click', function () {
                    // Update card content when marker is clicked
                    updateCardContent(location);
                });
        });
    })
    .catch(error => console.error('Error fetching data:', error));
