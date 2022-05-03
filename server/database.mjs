import { createConnection } from "mysql";


class Database {

	connection = null;

	request = null;
	resposne = null;


	parse_integer (value) {
		let parsed_value = parseInt (value);
		return isNaN (parsed_value) ? null : parsed_value;
	}// parse_integer;


	normalized (parameters) {
		let result = null;
		for (let next of parameters) {
			if (is_null (result)) result = [];
			result.push (not_set (next) ? (is_boolean (next) ? next : null) : (isNaN (next) ? next : parseInt (next)));
		}// for;
		return result;
	}// normalized;


	// Standard response
	send_result_data (data) {
		this.response.send (data);
		this.connection.end ();
	}// send_result_data;


	// Use if special handling required before send 
	data_query (procedure, parameters = null) {
		return new Promise ((resolve, reject) => {
			if (global.isset (parameters) && !Array.isArray (parameters)) parameters = Object.values (parameters);			
			let command = `call ${procedure} (${new Array (global.is_null (parameters) ? 0 : parameters.length).fill ("?").join (", ")})`;
			this.connection.query (command, this.normalized (parameters), async (error, results) => {
				if (isset (error)) return reject (error);
				resolve (results [0]);
			});
		});
	}// data_query;


	// Use for standard data response
	execute_query (procedure, parameters= null) {
		this.data_query (procedure, parameters).then (data => this.send_result_data (data));
	}// execute_query;


	constructor (request, response) {

		this.request = request;
		this.response = response;

		try {
			this.connection = createConnection ({
				host: "localhost",
				user: "root",
				password: "stranger",
				database: "timelog"
			})/* connection */;
			this.connection.connect ((error) => { if (isset (error)) console.log (error) });
		} catch (except) {
			console.log (except);
		}// try;

	}// constructor;

}// Databases;


export default Database;


