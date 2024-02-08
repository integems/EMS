// JavaScript Document

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
        <b>Description:</b> ${data.description}<br>
        <b>Location Type:</b> ${data.location_type}<br>
        <b>Date/Time:</b> ${formatDateTime(data.date_time)}<br>
      
        <b>NO2(ppm):</b> ${data['NO2(ppm)']}<br>
        <b>CO(ppm):</b> ${data['CO(ppm)']}<br>
        <b>PM10(ppm):</b> ${data['PM10(ppm)']}<br>
        <b>PM2.5(ppm):</b> ${data['PM2_5(ppm)']}<br>
        <b>RH(%):</b> ${data['RH(%)']}<br>
        <b>SO2(ppm):</b> ${data['SO2(ppm)']}<br>
        <b>Temp(C):</b> ${data['temp(C)']}<br>
      `;
}

// Fetch air quality monitoring locations from the API endpoint
fetch('/api/air_quality/air_monitoring_locations')
    .then(response => response.json())
    .then(data => {
        // Loop through locations and add markers with popups
        data.query_locations.forEach(location => {
            var formattedStartDate = formatDateTime(location.date_time);

            var marker = L.marker([location.latitude, location.longitude])
                .addTo(map)
                .bindPopup(`
                    <b>${location.org_specific_monitoring_id}</b><br>
                    <b>Description:</b> ${location.description}<br>
                    <b>Location Type:</b> ${location.location_type}<br>
                    <b>Date/Time:</b> ${formattedStartDate}<br>
                    <b>NO2(ppm):</b> ${location['NO2(ppm)']}<br>
                    <b>CO(ppm):</b> ${location['CO(ppm)']}<br>
                    <b>PM10(ppm):</b> ${location['PM10(ppm)']}<br>
                    <b>PM2.5(ppm):</b> ${location['PM2_5(ppm)']}<br>
                    <b>RH(%):</b> ${location['RH(%)']}<br>
                    <b>SO2(ppm):</b> ${location['SO2(ppm)']}<br>
                    <b>Temp(C):</b> ${location['temp(C)']}<br>
                `)
                .on('click', function () {
                    // Update card content when marker is clicked
                    updateCardContent(location);
                });
        });
    })
    .catch(error => console.error('Error fetching data:', error));
