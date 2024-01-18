
exports.up = function(knex) {
  return knex.schema
    .table('users', async function (table) {
      table.string('reset_code');
      table.datetime('reset_code_valid_date');
    })

};

exports.down = function(knex) {
  return knex.schema
    .table('users', async function (table) {
      table.dropColumn('reset_code');
      table.dropColumn('reset_code_valid_date');
    })
};
