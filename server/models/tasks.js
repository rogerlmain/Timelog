const mysql = require ("mysql");
const multiparty = require ("multiparty");
const accounts = require ("../accounts");


const connection = mysql.createConnection ({
	host: "localhost",
	user: "root",
	password: "stranger",
	database: "timelog"
})/* connection */;


module.exports = function (request, response, account) {


	let data_response_handler = (error, results, fields) => {
		if (global.is_null (results)) throw "Invalid data response";
		response.send (results [0]);
	}// data_response_handler;


	let execute_query = (procedure, parameters, handler = data_response_handler) => {
		connection.query (procedure, parameters, handler);
	}// execute_query;


	return {


		get_tasks: (project_id) => {
			let procedure = "call get_tasks (?)";
			let parameters = [project_id];
			execute_query (procedure, parameters);
		}/* get_tasks */


	}// return;

}// models;





