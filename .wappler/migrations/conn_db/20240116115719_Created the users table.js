
exports.up = function(knex) {
  return knex.schema
    .createTable('users', async function (table) {
      table.increments('user_id');
      table.string('email');
      table.string('password');
      table.string('role');
      table.string('status');
      table.datetime('last_login');
      table.datetime('date_created').defaultTo(knex.fn.now());
    })

};

exports.down = function(knex) {
  return knex.schema
    .dropTable('users')
};
