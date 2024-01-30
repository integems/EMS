
exports.up = function (knex) {
  return knex.schema
    .table('monitoring_location', async function (table) {
      await table.dropColumn('location_type');
      table.integer('location_type').unsigned();
      table.foreign('location_type').references('location_type_id').inTable('location_type').onUpdate('CASCADE').onDelete('CASCADE');
    })

};

exports.down = function (knex) {
  return knex.schema
    .table('monitoring_location', async function (table) {
      await table.dropForeign('location_type');
      table.dropColumn('location_type');
      table.string('location_type', 255);
    })
};
