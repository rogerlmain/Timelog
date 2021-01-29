const mysql = require ("mysql");
const multiparty = require ("multiparty");
const account = require ("./accounts");


const connection = mysql.createConnection ({
	host: "localhost",
	user: "root",
	password: "stranger",
	database: "timelog"
})/* connection */;


const data_response_handler = (error, results, fields) => {
	if (global.is_null (results)) throw "Invalid data response";
	let response_string = JSON.stringify (results [0]);
	global.response.send (response_string);
}// data_response_handler;


const models = {


	/**** Accounts ****/


	save_account: () => {
		new multiparty.Form ().parse (global.request, (form_error, form_fields, files) => {
			let procedure = "call save_account (?, ?, ?, ?, ?, ?, ?)";

			let parameters = [
				form_fields ["first_name"][0],
				form_fields ["last_name"][0],
				form_fields ["username"][0],
				form_fields ["email_address"][0],
				form_fields ["password"][0],
				parseInt (form_fields ["account_type"][0]),
				(account.signed_in (request) ? form_fields ["account_id"][0] : null)
			];

			connection.query (procedure, parameters, (query_error, results, query_fields) => {
				if ((results == null) || (results [0].length != 1)) throw "Invalid data response: models.save_account";
				let response_string = JSON.stringify (results [0]).slice (1, -1);
				global.response.cookie ("current_account", response_string, { encode: String });
				global.response.send ({ account_id: results[0][0].account_id});
			});
		});
	}/* save_account */,


	signin: () => {
		new multiparty.Form ().parse (global.request, (form_error, form_fields, files) => {
			connection.query ("call get_account_by_credentials (?, ?)", [form_fields ["username"], form_fields ["password"]], (query_error, results, query_fields) => {
				if ((results == null) || (results [0].length > 1)) throw "Invalid data response: models.signin";
				try {
					if (results [0].length == 1) {
						let response_string = JSON.stringify (results [0]).slice (1, -1);
						global.response.cookie ("current_account", response_string, { encode: String });
					}// if;
					global.response.send ();
				} catch (except) {
					throw except;
				}// try;
			});
		});
	}/* signin */,


	/**** Clients ****/


	get_clients: (company_id) => {
		let procedure = "call get_clients (?)";
		let parameters = [company_id];
		connection.query (procedure, parameters, data_response_handler);
	}/* get_clients */,


	get_client_projects: (client_id) => {
		let procedure = "call get_client_projects (?)";
		let parameters = [client_id];
		connection.query (procedure, parameters, data_response_handler);
	}/* get_client_projects */,


	/**** Projects ****/


	save_project: (fields) => {
		let procedure = "call save_project (?, ?, ?, ?)";
		let parameters = [
			fields.project_name, fields.project_description, fields.client_id,
			global.isset (fields.project_id) ? parseInt (fields.project_id) : null
		];
		connection.query (procedure, parameters, data_response_handler);
	}/* save_project */,


	/**** Entries ****/


	get_entries: (client_id, project_id) => {
		let procedure = "call get_entries (?, ?)";
		let parameters = [ client_id, project_id ];
		connection.query (procedure, parameters, data_response_handler);
	}/* get_entries */,


	get_current_entry: () => {
		let procedure = "call get_current_entry (?)";
		connection.query (procedure, [account.current_account ().account_id], data_response_handler);
	}/* get_current_entry */,


	save_entry: (client_id, project_id, entry_id) => {
		let procedure = "call save_entry (?, ?, ?, ?)";
		let parameters = [
			account.current_account ().account_id,
			parseInt (client_id),
			parseInt (project_id),
			global.isset (entry_id) ? parseInt (entry_id) : null
		];
		connection.query (procedure, parameters, data_response_handler);
	}/* save_entry */,


	/**** Teams ****/


	get_teams: (account_id) => {
		let procedure = "call get_teams (?)";
		let parameters = [account_id];
		connection.query (procedure, parameters, data_response_handler);
	}/* get_teams */,


	get_members: (team_id) => {
		let procedure = "call get_team_members (?)";
		let parameters = [team_id];
		connection.query (procedure, parameters, data_response_handler);
	}/* get_members */,


}// models;


module.exports = models;