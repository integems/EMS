// JavaScript Document

let greyIcon = L.icon({
    iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-grey.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34]
});

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

// Function to update card content with the most recent data
function updateCardContent(data) {
    const mostRecentEntry = data[data.length - 1];

    document.getElementById('cardTitle').textContent = mostRecentEntry.org_specific_monitoring_id;
    document.getElementById('cardContent').innerHTML = `
      <b>Location Type:</b> ${mostRecentEntry.location_type}<br>
      <b>Description:</b> ${mostRecentEntry.description}<br>
      <b>Start Date:</b> ${formatDateTime(mostRecentEntry.start_date_time)}<br>
      <b>End Date:</b> ${formatDateTime(mostRecentEntry.end_date_time)}<br>
      <b>LAeq:</b> ${mostRecentEntry.LAeq.toFixed(2)}<br>
      <b>LA90:</b> ${mostRecentEntry.LA90.toFixed(2)}<br>
      <b>LA10:</b> ${mostRecentEntry.LA10.toFixed(2)}<br>
      <b>LAFMax:</b> ${mostRecentEntry.LAFMax.toFixed(2)}<br>
      <b>LAFMin:</b> ${mostRecentEntry.LAFMin.toFixed(2)}<br>
    `;
}

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
            let marker = L.marker([locationGroup[0].latitude, locationGroup[0].longitude], { icon: greyIcon })
                .addTo(map)
                .bindPopup(`
            <b>${locationGroup[0].org_specific_monitoring_id}</b><br>
            <b>Location Type:</b> ${locationGroup[0].location_type}<br>
            <b>Description:</b> ${locationGroup[0].description}<br>
            <b>Start Date:</b> ${formatDateTime(locationGroup[0].start_date_time)}<br>
            <b>End Date:</b> ${formatDateTime(locationGroup[0].end_date_time)}<br>
            <b>LAeq:</b> ${locationGroup[0].LAeq.toFixed(2)}<br>
            <b>LA90:</b> ${locationGroup[0].LA90.toFixed(2)}<br>
            <b>LA10:</b> ${locationGroup[0].LA10.toFixed(2)}<br>
            <b>LAFMax:</b> ${locationGroup[0].LAFMax.toFixed(2)}<br>
            <b>LAFMin:</b> ${locationGroup[0].LAFMin.toFixed(2)}<br>
          `)
                .on('click', function () {
                    updateCardContent(locationGroup);
                });
        });
    })
    .catch(error => console.error('Error fetching data:', error));
