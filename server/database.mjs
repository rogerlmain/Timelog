import { getNamespace } from "continuation-local-storage";
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

	request = null;
	resposne = null;

	// Standard response
	send_result_data (data) {
		this.response.send (data);
		this.connection.end ();
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

			this.connection.query (command, this.normalized (parameters), async (error, results) => {
				if (isset (error)) return this.send_result_data (error);
				resolve (results [0]);
			});

		});
	}// data_query;


	// Use for standard data response
	execute_query (procedure, parameters = null) { this.data_query (procedure, parameters).then (data => this.send_result_data (data)) }


	constructor () {

		let session = getNamespace (global.session_namespace);

		this.request = session.get ("request");
		this.response = session.get ("response");
		
		try {
			this.connection = createConnection ((local_testing ? local_database : interserver_database));
			this.connection.connect ((error) => { if (isset (error)) console.log (error) });
		} catch (except) {
			console.log (except);
		}// try;

	}// constructor;


}// Databases;


export default Database;


