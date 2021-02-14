const mysql = require ("mysql");
const multiparty = require ("multiparty");
const accounts = require ("./accounts");


const connection = mysql.createConnection ({
	host: "localhost",
	user: "root",
	password: "stranger",
	database: "timelog"
})/* connection */;


module.exports = function (request, response, account) {


	let data_response_handler = (error, results, fields) => {
		if (global.is_null (results)) throw "Invalid data response";
		let response_string = JSON.stringify (results [0]);
		response.send (response_string);
	}// data_response_handler;


	let execute_query = (procedure, parameters, handler = data_response_handler) => {
		connection.query (procedure, parameters, handler);
	}// execute_query;


	return {


		/**** Accounts ****/


		get_accounts_by_company: (company_id) => {
			let procedure = "call get_accounts_by_company (?)";
			let parameters = [company_id];
			execute_query (procedure, parameters);
		}/* get_accounts_by_company */,


		get_accounts_by_project: (project_id) => {
			let procedure = "call get_accounts_by_project (?)";
			let parameters = [project_id];
			execute_query (procedure, parameters);
		}/* get_accounts_by_project */,


		save_account: () => {
			new multiparty.Form ().parse (request, (form_error, form_fields, files) => {
				let procedure = "call save_account (?, ?, ?, ?, ?, ?, ?)";

				let parameters = [
					form_fields ["first_name"][0],
					form_fields ["last_name"][0],
					form_fields ["username"][0],
					form_fields ["email_address"][0],
					form_fields ["password"][0],
					parseInt (form_fields ["account_type"][0]),
					(accounts.signed_in (request) ? form_fields ["account_id"][0] : null)
				];

				execute_query (procedure, parameters, (query_error, results, query_fields) => {
					if ((results == null) || (results [0].length != 1)) throw "Invalid data response: models.save_account";
					let response_string = JSON.stringify (results [0]).slice (1, -1);
					response.cookie ("current_account", response_string, { encode: String });
					response.send ({ account_id: results[0][0].account_id});
				});
			});
		}/* save_account */,


		signin: () => {
			new multiparty.Form ().parse (request, (form_error, form_fields, files) => {
				execute_query ("call get_account_by_credentials (?, ?)", [form_fields ["username"], form_fields ["password"]], (query_error, results, query_fields) => {
					if ((results == null) || (results [0].length > 1)) throw "Invalid data response: models.signin";
					if (results [0].length == 1) {
						let response_string = JSON.stringify (results [0]).slice (1, -1);
						response.cookie ("current_account", response_string, { encode: String });
					}// if;
					response.send ();
				});
			});
		}/* signin */,


		/**** Clients ****/


		get_clients: (company_id) => {
			let procedure = "call get_clients (?)";
			let parameters = [company_id];
			execute_query (procedure, parameters);
		}/* get_clients */,


		/**** Projects ****/


		save_project: (fields) => {

			let project_members = JSON.parse (fields.selected_team);
			let project_response = null;


			let project_handler = (error, results) => {
				if (global.is_null (results)) throw "Invalid data response: project_handler";
				project_response = { project: JSON.stringify (results [0][0]) };
				save_team ();
			}// project_handler;


			let team_handler = (error, results) => {
				if (global.is_null (results)) throw "Invalid data response: team_handler";
				if (global.is_null (project_response.members)) project_response.members = [];
				project_response.members.push (results [0][0]);
				if (project_response.members.length < project_members.length) return;
				response.send (JSON.stringify (project_response));
			}// team_handler;


			let save_project_member = (error) => {
				project_members.forEach ((item) => {
					let procedure = "call save_project_member (?, ?, null, ?)";
					let parameters = [fields.project_id, item.account_id, item.role];
					execute_query (procedure, parameters, team_handler);
				});
			}// save_project_member;


			let save_team = () => {
				let procedure = "call reset_project_members (?)";
				let parameters = [fields.project_id];
				execute_query (procedure, parameters, save_project_member);
			}// save_team;


			let save_project_details = () => {
				let procedure = "call save_project (?, ?, ?, ?)";
				let parameters = [
					fields.project_name, fields.project_description, fields.client_id,
					global.isset (fields.project_id) ? parseInt (fields.project_id) : null
				];
				execute_query (procedure, parameters, project_handler);
			}// save_project_details;


			save_project_details ();


		}/* save_project */,


		get_project: (project_id) => {
			let procedure = "call get_project (?)";
			let parameters = [project_id];
			execute_query (procedure, parameters);
		}/* get_project */,


		get_client_projects: (client_id) => {
			let procedure = "call get_client_projects (?)";
			let parameters = [client_id];
			execute_query (procedure, parameters);
		}/* get_client_projects */,


		/**** Entries ****/


		get_entries: (client_id, project_id) => {
			let procedure = "call get_entries (?, ?)";
			let parameters = [ client_id, project_id ];
			execute_query (procedure, parameters);
		}/* get_entries */,


		get_current_entry: () => {
			let procedure = "call get_current_entry (?)";
			if (global.is_null (account)) {
				response.send ();
				return;
			}// if;
			execute_query (procedure, [account.account_id]);
		}/* get_current_entry */,


		save_entry: (client_id, project_id, entry_id) => {
			let procedure = "call save_entry (?, ?, ?, ?)";
			let parameters = [
				account.account_id,
				parseInt (client_id),
				parseInt (project_id),
				global.isset (entry_id) ? parseInt (entry_id) : null
			];
			execute_query (procedure, parameters);
		}/* save_entry */,


		/**** Teams ****/


		get_teams: (account_id) => {
			let procedure = "call get_teams (?)";
			let parameters = [account_id];
			execute_query (procedure, parameters);
		}/* get_teams */,


		get_members: (team_id) => {
			let procedure = "call get_team_members (?)";
			let parameters = [team_id];
			execute_query (procedure, parameters);
		}/* get_members */,


	}// return;

}// models;





