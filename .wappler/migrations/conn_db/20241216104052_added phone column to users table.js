
exports.up = function(knex) {
  return knex.schema
    .table('users', async function (table) {
      table.text('phone');
    })

};

exports.down = function(knex) {
  return knex.schema
    .table('users', async function (table) {
      table.dropColumn('phone');
    })
};
