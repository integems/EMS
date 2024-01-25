
exports.up = function(knex) {
  return knex.schema
    .table('noise_monitoring_data', async function (table) {
      table.integer('location_id').unsigned();
      table.foreign('location_id').references('location_id').inTable('monitoring_location').onUpdate('CASCADE').onDelete('CASCADE');
    })

};

exports.down = function(knex) {
  return knex.schema
    .table('noise_monitoring_data', async function (table) {
      table.dropForeign('location_id');
      table.dropColumn('location_id');
    })
};
