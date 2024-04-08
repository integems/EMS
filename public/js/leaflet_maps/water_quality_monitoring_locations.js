// JavaScript Document
let blueIcon = L.icon({
    iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-blue.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34]
});

let map = L.map("location_map").setView([8.4344, -12.3433], 7);

L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
    maxZoom: 19,
    attribution: '© <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>',
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
      <b>${mostRecentEntry.org_specific_monitoring_id}</b><br>
      <b>Description:</b> ${mostRecentEntry.description}<br>
      <b>Date:</b> ${formatDateTime(mostRecentEntry.date)}<br>
      <b>Temperature [°C]:</b> ${mostRecentEntry.temperature}<br>
      <b>pH:</b> ${mostRecentEntry.pH}<br>
      <b>mV[pH]:</b> ${mostRecentEntry.mV_pH}<br>
      <b>ORP[mV]:</b> ${mostRecentEntry.ORP_mV}<br>
      <b>EC [μs/cm]:</b> ${mostRecentEntry.EC}<br>
      <b>EC Abs [μs/cm].:</b> ${mostRecentEntry.EC_Abs}<br>
      <b>Resistivity [Ohm-cm]:</b> ${mostRecentEntry.Resistivity}<br>
      <b>TDS:</b> ${mostRecentEntry.TDS_ppm}<br>
      <b>Salinity[psu]:</b> ${mostRecentEntry.salinity_psu}<br>
      <b>Pressure[psi]:</b> ${mostRecentEntry.pressure_psi}<br>
      <b>D.O.[%]:</b> ${mostRecentEntry.DO_percentage}<br>
      <b>D.O.[ppm]:</b> ${mostRecentEntry.DO_ppm}<br>
      <b>Turbidity [FNU]:</b> ${mostRecentEntry.turbidity_FNU}<br>
    `;
}

fetch('/api/water_quality/water_data_location')
    .then(response => response.json())
    .then(data => {
        const groupedData = {};
        data.query.forEach(location => {
            const locationId = location.location_id;
            const date = location.date;
            const key = `${locationId}_${date}`;

            if (!groupedData[key]) {
                groupedData[key] = [];
            }
            groupedData[key].push(location);
        });

        // Loop through grouped data and add markers with popups
        Object.values(groupedData).forEach(locationGroup => {
            let marker = L.marker([locationGroup[0].latitude, locationGroup[0].longitude], { icon: blueIcon })
                .addTo(map)
                .bindPopup(`
            <b>${locationGroup[0].org_specific_monitoring_id}</b><br>
            <b>Description:</b> ${locationGroup[0].description}<br>
            <b>Date:</b> ${formatDateTime(locationGroup[0].date)}<br>
            <b>Temperature [°C]:</b> ${locationGroup[0].temperature}<br>
            <b>pH:</b> ${locationGroup[0].pH}<br>
            <b>mV[pH]:</b> ${locationGroup[0].mV_pH}<br>
            <b>ORP[mV]:</b> ${locationGroup[0].ORP_mV}<br>
            <b>EC [μs/cm]:</b> ${locationGroup[0].EC}<br>
            <b>EC Abs [μs/cm].:</b> ${locationGroup[0].EC_Abs}<br>
            <b>Resistivity [Ohm-cm]:</b> ${locationGroup[0].Resistivity}<br>
            <b>TDS:</b> ${locationGroup[0].TDS_ppm}<br>
            <b>Salinity[psu]:</b> ${locationGroup[0].salinity_psu}<br>
            <b>Pressure[psi]:</b> ${locationGroup[0].pressure_psi}<br>
            <b>D.O.[%]:</b> ${locationGroup[0].DO_percentage}<br>
            <b>D.O.[ppm]:</b> ${locationGroup[0].DO_ppm}<br>
            <b>Turbidity [FNU]:</b> ${locationGroup[0].turbidity_FNU}<br>
          `)
                .on('click', function () {
                    updateCardContent(locationGroup);
                });
        });
    })
    .catch(error => console.error('Error fetching data:', error));

