import { createConnection } from "mysql";


class Database {

	connection = null;


	data_response_handler = (error, results, fields) => {
		if (global.is_null (results) || response.response_sent) return;
		response.send (results [0]);
		response.response_sent = true;
		this.connection.end ();
	}// data_response_handler;


	parse_integer (value) {
		let parsed_value = parseInt (value);
		return isNaN (parsed_value) ? null : parsed_value;
	}// parse_integer;
	
	
	execute_query (procedure, parameters = null, handler = this.data_response_handler) {
		if (global.isset (parameters) && !Array.isArray (parameters)) parameters = Object.values (parameters);
		let command = `call ${procedure} (${new Array (global.is_null (parameters) ? 0 : parameters.length).fill ("?").join (", ")})`;
		this.connection.query (command, parameters, handler);
	}// execute_query;


	constructor () {
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
		}
	}// constructor;

}// Databases;


export default Database;


