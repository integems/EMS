
exports.up = function(knex) {
  return knex.schema
    .table('users', async function (table) {
      table.string('firstname');
      table.string('lastname');
    })

};

exports.down = function(knex) {
  return knex.schema
    .table('users', async function (table) {
      table.dropColumn('firstname');
      table.dropColumn('lastname');
    })
};
