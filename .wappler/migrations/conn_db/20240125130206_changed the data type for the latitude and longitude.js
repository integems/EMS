
exports.up = function(knex) {
  return knex.schema
    .table('monitoring_location', async function (table) {
      table.decimal('latitude').alter();
      table.decimal('longitude').alter();
    })

};

exports.down = function(knex) {
  return knex.schema
    .table('monitoring_location', async function (table) {
      table.string('latitude', 255).alter();
      table.string('longitude', 255).alter();
    })
};
