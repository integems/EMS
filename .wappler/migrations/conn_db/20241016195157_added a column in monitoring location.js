
exports.up = function(knex) {
  return knex.schema
    .table('monitoring_location', async function (table) {
      table.integer('water_type_id').unsigned();
      table.foreign('water_type_id').references('water_type_id').inTable('water_type').onUpdate('CASCADE').onDelete('CASCADE');
    })

};

exports.down = function(knex) {
  return knex.schema
    .table('monitoring_location', async function (table) {
      table.dropForeign('water_type_id');
      table.dropColumn('water_type_id');
    })
};
