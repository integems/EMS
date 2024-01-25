
exports.up = function(knex) {
  return knex.schema
    .table('noise_monitoring_data', async function (table) {
      table.decimal('LAeq').alter();
      table.decimal('LA90').alter();
      table.decimal('LA10').alter();
      table.decimal('LAFMax').alter();
      table.decimal('LAFMin').alter();
    })

};

exports.down = function(knex) {
  return knex.schema
    .table('noise_monitoring_data', async function (table) {
      table.string('LAeq', 255).alter();
      table.string('LA90', 255).alter();
      table.string('LA10', 255).alter();
      table.string('LAFMax', 255).alter();
      table.string('LAFMin', 255).alter();
    })
};
