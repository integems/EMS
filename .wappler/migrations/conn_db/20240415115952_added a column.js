
exports.up = function(knex) {
  return knex.schema
    .table('monitoring_parameters', async function (table) {
      table.string('monitoring_parameters');
    })

};

exports.down = function(knex) {
  return knex.schema
    .table('monitoring_parameters', async function (table) {
      table.dropColumn('monitoring_parameters');
    })
};
