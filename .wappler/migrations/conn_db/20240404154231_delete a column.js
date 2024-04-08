
exports.up = function(knex) {
  return knex.schema
    .table('water_quality_data', async function (table) {
      table.dropColumn('datetime');
    })

};

exports.down = function(knex) {
  return knex.schema
    .table('water_quality_data', async function (table) {
      table.datetime('datetime');
    })
};
