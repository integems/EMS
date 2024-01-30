
exports.up = function(knex) {
  return knex.schema
    .createTable('air_quality_monitoring_data', async function (table) {
      table.increments('air_id');
      table.datetime('date_time');
      table.integer('location_id').unsigned();
      table.foreign('location_id').references('location_id').inTable('monitoring_location').onUpdate('CASCADE').onDelete('CASCADE');
      table.decimal('CO(ppm)');
      table.decimal('NO2(ppm)');
      table.decimal('PM10(ppm)');
      table.decimal('PM2_5(ppm)');
      table.decimal('RH(%)');
      table.decimal('SO2(ppm)');
      table.decimal('temp(C)');
    })

};

exports.down = function(knex) {
  return knex.schema
    .dropTable('air_quality_monitoring_data')
};
