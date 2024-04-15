
exports.up = function(knex) {
  return knex.schema
    .table('monitoring_parameters', async function (table) {
      table.dropColumn('air_quality');
      table.dropColumn('noise');
      table.dropColumn('water_quality');
      table.dropColumn('water_usage');
      table.dropColumn('soils');
      table.dropColumn('bio_diversity');
      table.dropColumn('waste_management');
    })

};

exports.down = function(knex) {
  return knex.schema
    .table('monitoring_parameters', async function (table) {
      table.string('air_quality', 255);
      table.string('noise', 255);
      table.string('water_quality', 255);
      table.string('water_usage', 255);
      table.string('soils', 255);
      table.string('bio_diversity', 255);
      table.string('waste_management', 255);
    })
};
