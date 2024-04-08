
exports.up = function(knex) {
  return knex.schema
    .table('air_quality_monitoring_data', async function (table) {
      table.renameColumn('date_time', 'date');
    })

};

exports.down = function(knex) {
  return knex.schema
    .table('air_quality_monitoring_data', async function (table) {
      table.renameColumn('date', 'date_time');
    })
};
