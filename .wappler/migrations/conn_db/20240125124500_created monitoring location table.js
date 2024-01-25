
exports.up = function(knex) {
  return knex.schema
    .createTable('monitoring_location', async function (table) {
      table.increments('location_id');
      table.string('latitude');
      table.string('longitude');
      table.string('org_specific_monitoring_id');
      table.string('location_type');
      table.string('town');
    })

};

exports.down = function(knex) {
  return knex.schema
    .dropTable('monitoring_location')
};
