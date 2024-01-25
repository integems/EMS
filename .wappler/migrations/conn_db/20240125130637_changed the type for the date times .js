
exports.up = function(knex) {
  return knex.schema
    .table('noise_monitoring_data', async function (table) {
      table.datetime('start_date_time').alter();
      table.datetime('end_date_time').alter();
    })

};

exports.down = function(knex) {
  return knex.schema
    .table('noise_monitoring_data', async function (table) {
      table.string('start_date_time', 255).alter();
      table.string('end_date_time', 255).alter();
    })
};
