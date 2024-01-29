
exports.up = function(knex) {
  return knex.schema
    .createTable('location_type', async function (table) {
      table.increments('location_type_id');
      table.string('location_type');
    })

};

exports.down = function(knex) {
  return knex.schema
    .dropTable('location_type')
};
