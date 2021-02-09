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


	get_accounts_by_company: (company_id) => {
		let procedure = "call get_accounts_by_company (?)";
		let parameters = [company_id];
		connection.query (procedure, parameters, data_response_handler);
	}/* get_accounts_by_company */,


	get_accounts_by_project: (project_id) => {
		let procedure = "call get_accounts_by_project (?)";
		let parameters = [project_id];
		connection.query (procedure, parameters, data_response_handler);
	}/* get_accounts_by_project */,


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


	/**** Projects ****/


	// save_project: function (fields) {

	// 	let project_response = null;

	// 	let save_team = (list) => {

	// 		let members = JSON.parse (list);
	// 		members.forEach ((item) => {
	// 			let procedure = "call save_team_account (null, null, ?, ?, ?)";
	// 			let parameters = [fields]; /* ALL WRONG - FIX IT ACCORDING TO DB */
	// 		});

	// 		// let procedure = "call save_team ()";
	// 		// let parameters = [
	// 		// 	fields.project_name, fields.project_description, fields.client_id,
	// 		// 	global.isset (fields.project_id) ? parseInt (fields.project_id) : null
	// 		// ];

	// 		connection.query (procedure, parameters, handler.bind (this));

	// 	}// save_team;


	// 	let project_handler = (error, results, fields) => {
	// 		if (global.is_null (results)) throw "Invalid data response";
	// 		this.project_response = results [0];
	// 		save_team ();
	// 	}// project_handler;


	// 	let procedure = "call save_project (?, ?, ?, ?)";
	// 	let parameters = [
	// 		fields.project_name, fields.project_description, fields.client_id,
	// 		global.isset (fields.project_id) ? parseInt (fields.project_id) : null
	// 	];
	// 	connection.query (procedure, parameters, project_handler.bind (this));
	// }/* save_project */,


	get_project: (project_id) => {
		let procedure = "call get_project (?)";
		let parameters = [project_id];
		connection.query (procedure, parameters, data_response_handler);
	}/* get_project */,


	get_client_projects: (client_id) => {
		let procedure = "call get_client_projects (?)";
		let parameters = [client_id];
		connection.query (procedure, parameters, data_response_handler);
	}/* get_client_projects */,


	/**** Entries ****/


	get_entries: (client_id, project_id) => {
		let procedure = "call get_entries (?, ?)";
		let parameters = [ client_id, project_id ];
		connection.query (procedure, parameters, data_response_handler);
	}/* get_entries */,


	get_current_entry: () => {
		let procedure = "call get_current_entry (?)";
		let current_account = account.current_account ();
		if (global.is_null (current_account )) {
			global.response.send ();
			return;
		}// if;
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


module.exports.model_methods = models;
module.exports.save_project = save_project;


function save_project (fields) {

	let team_members = JSON.parse (fields.selected_team);
	let project_response = null;


	let project_handler = (error, results) => {
		if (global.is_null (results)) throw "Invalid data response: project_handler";
		project_response = { project: JSON.stringify (results [0][0]) };
		save_team ();
	}// project_handler;


	let team_handler = (error, results) => {
		if (global.is_null (results)) throw "Invalid data response: team_handler";
		if (global.is_null (project_response.members)) project_response.members = [];
		project_response.members.push (JSON.stringify (results [0][0]));
		if (project_response.members.length == team_members.length) global.response.send (JSON.stringify (project_response));
	}// team_handler;


	let reset_handler = () => {
		team_members.forEach ((item) => {
			let procedure = "call save_team_account (null, ?, ?, ?)";
			let parameters = [fields.project_id, item.account_id, item.role];
			connection.query (procedure, parameters, team_handler);
		});
	}// reset_handler;


	let save_team = () => {
		let procedure = "call reset_team (null, ?)";
		let parameters = [fields.project_id];
		connection.query (procedure, parameters, reset_handler);
	}// save_team;


	let save_project_details = () => {
		let procedure = "call save_project (?, ?, ?, ?)";
		let parameters = [
			fields.project_name, fields.project_description, fields.client_id,
			global.isset (fields.project_id) ? parseInt (fields.project_id) : null
		];
		connection.query (procedure, parameters, project_handler);
	}// save_project_details;


	save_project_details ();


}// save_project;


