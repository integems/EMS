
exports.up = function(knex) {
  return knex.schema
    .table('air_quality_monitoring_data', async function (table) {
      table.renameColumn('CO(ppm)', 'CO_ppm');
      table.renameColumn('NO2(ppm)', 'NO2_ppm');
      table.renameColumn('PM10(ppm)', 'PM10_ppm');
      table.renameColumn('PM2_5(ppm)', 'PM2_5_ppm');
      table.renameColumn('RH(%)', 'RH_percentage');
      table.renameColumn('SO2(ppm)', 'SO2_ppm');
      table.renameColumn('temp(C)', 'temp_C');
    })

};

exports.down = function(knex) {
  return knex.schema
    .table('air_quality_monitoring_data', async function (table) {
      table.renameColumn('CO_ppm', 'CO(ppm)');
      table.renameColumn('NO2_ppm', 'NO2(ppm)');
      table.renameColumn('PM10_ppm', 'PM10(ppm)');
      table.renameColumn('PM2_5_ppm', 'PM2_5(ppm)');
      table.renameColumn('RH_percentage', 'RH(%)');
      table.renameColumn('SO2_ppm', 'SO2(ppm)');
      table.renameColumn('temp_C', 'temp(C)');
    })
};
