import { createConnection } from "mysql";


const local_testing = true;


const local_database = {
	host: "localhost",
	user: "root",
	password: "stranger",
	database: "timelog"
}/* local_database */


const interserver_database = {
	host: "208.73.201.47",
	user: "remote",
	password: "stranger",
	database: "timelog"
}/* interserver_database */


class Database {

	connection = null;


	// Standard response
	send_result_data (data) {

		let current_response = response ();

		if (current_response.sent === true) return current_response.end (); // already sent - used on login for multiple errors;

		current_response.send (data);
		current_response.end ();
		current_response.sent = true;

	}// send_result_data;


	parse_integer (value) {
		let parsed_value = parseInt (value);
		return isNaN (parsed_value) ? null : parsed_value;
	}// parse_integer;


	normalized (parameters) {
		let result = null;
		for (let next of parameters) {
			if (is_null (result)) result = [];
			result.push (isset (next) || is_boolean (next) ? (is_number (next) ? parseInt (next) : next) : null);
		}// for;
		return result;
	}// normalized;


	// Use if special handling required before send 
	data_query (procedure, parameters = null) {
		return new Promise ((resolve, reject) => {

			if (global.isset (parameters) && !Array.isArray (parameters)) parameters = Object.values (parameters);			

			let command = `call ${procedure} (${new Array (global.is_null (parameters) ? 0 : parameters.length).fill ("?").join (", ")})`;

			try {
				this.connection.query (command, this.normalized (parameters), async (error, results) => {

					if (isset (error)) return this.send_result_data (error);

					this.connection.end ();
					resolve (results [0]);

				});
			} catch (except) { reject (except) };

		});
	}// data_query;


	// Use for standard data response
	execute_query (procedure, parameters = null) { this.data_query (procedure, parameters).then (data => this.send_result_data (data)) }


	constructor () {
		try {
			this.connection = createConnection ((local_testing ? local_database : interserver_database));
			this.connection.connect ((error) => { if (isset (error)) console.log (error) });
		} catch (except) {
			console.log (except);
		}// try;
	}// constructor;


}// Databases;


export default Database;


