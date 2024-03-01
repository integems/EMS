
exports.up = function(knex) {
  return knex.schema
    .table('noise_monitoring_data', async function (table) {
      table.datetime('date_created').defaultTo(knex.fn.now());
    })

};

exports.down = function(knex) {
  return knex.schema
    .table('noise_monitoring_data', async function (table) {
      table.dropColumn('date_created');
    })
};
