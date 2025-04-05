const { pool } = require("../../config/database");


exports.selectRestaurants = async function(connection, category) {

  const selectAllRestaurantsQuery = `SELECT title, address, category, videoUrl From Restaurants where status = 'A';`;
  const selectCategorizedRestaurantsQuery = `SELECT title, address, category, videoUrl From Restaurants where status = 'A' and category = ?;`
  const Params = [category];

  const Query = category ? selectCategorizedRestaurantsQuery : selectAllRestaurantsQuery;

  const rows = await connection.query(Query, Params);

  return rows;



}
exports.exampleDao = async function (connection) {
  const Query = `SELECT * FROM Students;`;
  const Params = [];

  const rows = await connection.query(Query, Params);

  return rows;
};
