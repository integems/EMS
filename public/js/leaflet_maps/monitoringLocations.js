// JavaScript Document

document.addEventListener('DOMContentLoaded', () => {
    // Fetch the location data from the API
    fetch('/api/location/all_locations')
        .then(response => response.json())
        .then(data => {
            const locations = data.monitoringLocations;
            // Initialize the Leaflet map
            const map = L.map('mapping-container').setView([8.6, -11.15], 10);

            // Add OpenStreetMap tile layer
            L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
                attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            }).addTo(map);

            // Loop through locations and add markers
            locations.forEach(location => {
                // Determine marker color based on org_specific_monitoring_id
                const markerColor = location.org_specific_monitoring_id.includes('WQMP') ? 'blue' : 'gray';

                // Create a custom marker
                const marker = L.circleMarker([location.latitude, location.longitude], {
                    color: markerColor,
                    radius: 8,
                    fillOpacity: 0.8
                });

                // Add a popup with location details
                marker.bindPopup(`
                    <strong>${location.description}</strong><br>
                    Type: ${location.location_type}<br>
                    Monitoring ID: ${location.org_specific_monitoring_id}
                `);

                // Add marker to the map
                marker.addTo(map);
            });
        })
        .catch(error => {
            console.error('Error fetching location data:', error);
        });
});
