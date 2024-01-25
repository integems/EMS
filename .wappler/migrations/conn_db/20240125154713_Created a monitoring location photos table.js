
exports.up = function(knex) {
  return knex.schema
    .createTable('monitoring_location_photos', async function (table) {
      table.increments('photo_id');
      table.integer('location_id').unsigned();
      table.foreign('location_id').references('location_id').inTable('monitoring_location').onUpdate('CASCADE').onDelete('CASCADE');
      table.string('path');
    })

};

exports.down = function(knex) {
  return knex.schema
    .dropTable('monitoring_location_photos')
};
