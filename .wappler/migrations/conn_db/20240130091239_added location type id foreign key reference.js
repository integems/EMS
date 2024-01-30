
exports.up = function(knex) {
  return knex.schema
    .table('monitoring_location', async function (table) {
      table.integer('location_type_id').unsigned();
      table.foreign('location_type_id').references('location_type_id').inTable('location_type').onUpdate('CASCADE').onDelete('CASCADE');
    })

};

exports.down = function(knex) {
  return knex.schema
    .table('monitoring_location', async function (table) {
      table.dropForeign('location_type_id');
      table.dropColumn('location_type_id');
    })
};
