import { createConnection } from "mysql";


class Database {

	connection = null;


	cookie_string = (value) => JSON.stringify (value).slice (1, -1);
	

	parse_integer (value) {
		let parsed_value = parseInt (value);
		return isNaN (parsed_value) ? null : parsed_value;
	}// parse_integer;
	
	
	execute_query (procedure, parameters = null) {
		return new Promise ((resolve, reject) => {
			if (global.isset (parameters) && !Array.isArray (parameters)) parameters = Object.values (parameters);
			let command = `call ${procedure} (${new Array (global.is_null (parameters) ? 0 : parameters.length).fill ("?").join (", ")})`;
			this.connection.query (command, parameters, async (error, results, fields) => {
				if (response.response_sent) return;
				if (isset (error)) return reject (error);
				await Promise.resolve (resolve (results [0]));
				response.send (not_empty (results [0]) ? results [0] : null);
				response.response_sent = true;
			});
			this.connection.end ();
		});
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


