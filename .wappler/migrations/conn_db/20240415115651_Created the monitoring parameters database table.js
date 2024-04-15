
exports.up = function(knex) {
  return knex.schema
    .createTable('monitoring_parameters', async function (table) {
      table.increments('monitoring_parameters_id');
      table.string('air_quality');
      table.string('noise');
      table.string('water_quality');
      table.string('water_usage');
      table.string('soils');
      table.string('bio_diversity');
      table.string('waste_management');
    })

};

exports.down = function(knex) {
  return knex.schema
    .dropTable('monitoring_parameters')
};
