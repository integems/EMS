
exports.up = function(knex) {
  return knex.schema
    .table('monitoring_location', async function (table) {
      table.integer('monitoring_parameter_id').unsigned();
      table.foreign('monitoring_parameter_id').references('monitoring_parameters_id').inTable('monitoring_parameters').onUpdate('CASCADE').onDelete('CASCADE');
    })

};

exports.down = function(knex) {
  return knex.schema
    .table('monitoring_location', async function (table) {
      table.dropForeign('monitoring_parameter_id');
      table.dropColumn('monitoring_parameter_id');
    })
};
