
exports.up = function(knex) {
  return knex.schema
    .table('monitoring_location', async function (table) {
      table.datetime('date_created');
    })

};

exports.down = function(knex) {
  return knex.schema
    .table('monitoring_location', async function (table) {
      table.dropColumn('date_created');
    })
};
