
exports.up = function(knex) {
  return knex.schema
    .createTable('noise_monitoring_data', async function (table) {
      table.increments('noise_id');
      table.string('start_date_time');
      table.string('end_date_time');
      table.string('LAeq');
      table.string('LA90');
      table.string('LA10');
      table.string('LAFMax');
      table.string('LAFMin');
    })

};

exports.down = function(knex) {
  return knex.schema
    .dropTable('noise_monitoring_data')
};
