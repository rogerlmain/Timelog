import { createConnection } from "mysql";
//import multiparty from "multiparty";


const connection = createConnection ({
	host: "localhost",
	user: "root",
	password: "stranger",
	database: "timelog"
})/* connection */;


class DataModel {

	data_response_handler (error, results, fields) {
		if (global.is_null (results)) throw "Invalid data response";
		response.send (results [0]);
	}// data_response_handler;


	execute_query (procedure, parameters, handler = this.data_response_handler) {
		connection.query (procedure, parameters, handler);
	}// execute_query;

}// DataModels;


export default DataModel;

