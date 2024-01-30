
exports.up = function(knex) {
  return knex.schema
    .table('monitoring_location', async function (table) {
      table.dropColumn('location_type');
    })

};

exports.down = function(knex) {
  return knex.schema
    .table('monitoring_location', async function (table) {
      table.string('location_type', 255);
    })
};
