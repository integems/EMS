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
      Location Type: ${data.location_type}<br>
      Description: ${data.description}<br>
      Start Date/Time: ${formatDateTime(data.start_date_time)}<br>
      End Date/Time: ${formatDateTime(data.end_date_time)}<br>
      LAeq: ${data.LAeq}<br>
      LA90: ${data.LA90}<br>
      LA10: ${data.LA10}<br>
      LAFMax: ${data.LAFMax}<br>
      LAFMin: ${data.LAFMin}
    `;
    // Check if 'path' data is available and update cardPath
    if (data.path) {
        document.getElementById('cardPath').innerHTML = `Path: ${data.path}`;
        // Display the image
        document.getElementById('cardImage').src = data.path;
    } else {
        document.getElementById('cardPath').innerHTML = 'No photo path available';
    }
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
            Location Type: ${location.location_type}<br>
            Description: ${location.description}<br>
            Start Date/Time: ${formattedStartDate}<br>
            End Date/Time: ${formattedEndDate}<br>
            LAeq: ${location.LAeq}<br>
            LA90: ${location.LA90}<br>
            LA10: ${location.LA10}<br>
            LAFMax: ${location.LAFMax}<br>
            LAFMin: ${location.LAFMin}
          `)
                .on('click', function () {
                    // Update card content when marker is clicked
                    updateCardContent(location);
                });
        });
    })
    .catch(error => console.error('Error fetching data:', error));
