
exports.up = function(knex) {
  return knex.schema
    .createTable('water_type', async function (table) {
      table.increments('water_type_id');
      table.string('water_type');
    })

};

exports.down = function(knex) {
  return knex.schema
    .dropTable('water_type')
};
