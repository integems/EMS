
exports.up = function(knex) {
  return knex.schema
    .table('monitoring_location', async function (table) {
      table.renameColumn('town', 'description');
    })

};

exports.down = function(knex) {
  return knex.schema
    .table('monitoring_location', async function (table) {
      table.renameColumn('description', 'town');
    })
};
