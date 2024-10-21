
exports.up = function(knex) {
  return knex.schema
    .table('air_quality_monitoring_data', async function (table) {
      table.decimal('CO_ppm').alter();
      table.decimal('NO2_ppm').alter();
      table.decimal('PM10_ppm').alter();
      table.decimal('PM2_5_ppm').alter();
      table.decimal('RH_percentage').alter();
      table.decimal('SO2_ppm').alter();
      table.decimal('temp_C').alter();
    })

};

exports.down = function(knex) {
  return knex.schema
    .table('air_quality_monitoring_data', async function (table) {
      table.float('CO_ppm').alter();
      table.float('NO2_ppm').alter();
      table.float('PM10_ppm').alter();
      table.float('PM2_5_ppm').alter();
      table.float('RH_percentage').alter();
      table.float('SO2_ppm').alter();
      table.float('temp_C').alter();
    })
};
