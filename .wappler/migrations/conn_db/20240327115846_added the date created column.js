
exports.up = function(knex) {
  return knex.schema
    .table('air_quality_monitoring_data', async function (table) {
      table.datetime('date_created');
    })

};

exports.down = function(knex) {
  return knex.schema
    .table('air_quality_monitoring_data', async function (table) {
      table.dropColumn('date_created');
    })
};
