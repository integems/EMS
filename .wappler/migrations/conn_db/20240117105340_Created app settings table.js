
exports.up = function(knex) {
  return knex.schema
    .createTable('app_settings', async function (table) {
      table.increments('id');
      table.string('field_name');
      table.string('field_value');
    })

};

exports.down = function(knex) {
  return knex.schema
    .dropTable('app_settings')
};
