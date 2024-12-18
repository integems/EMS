
exports.up = function(knex) {
  return knex.schema
    .table('users', async function (table) {
      table.string('verify');
    })

};

exports.down = function(knex) {
  return knex.schema
    .table('users', async function (table) {
      table.dropColumn('verify');
    })
};
