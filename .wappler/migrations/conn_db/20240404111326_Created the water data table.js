
exports.up = function(knex) {
  return knex.schema
    .createTable('water_quality_data', async function (table) {
      table.increments('water_id');
      table.datetime('datetime');
      table.integer('location_id').unsigned();
      table.foreign('location_id').references('location_id').inTable('monitoring_location').onUpdate('CASCADE').onDelete('CASCADE');
      table.string('temperature');
      table.string('pH');
      table.string('mV_pH');
      table.string('ORP_mV');
      table.string('EC');
      table.string('EC_Abs');
      table.string('Resistivity');
      table.string('TDS_ppm');
      table.string('salinity_psu');
      table.string('pressure_psi');
      table.string('DO_percentage');
      table.string('DO_ppm');
      table.string('turbidity_FNU');
      table.datetime('date_created');
    })

};

exports.down = function(knex) {
  return knex.schema
    .dropTable('water_quality_data')
};
