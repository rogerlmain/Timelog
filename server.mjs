import "./server/globals.mjs";

import express from "express";
import multiparty from "multiparty";
import https from "https";
import file_system from "fs";

import AccountData from "./server/models/accounts.mjs";
import AccountSettingsData from "./server/models/settings.mjs";
import AccountOptionsData from "./server/models/options.mjs";
import AddressData from "./server/models/addresses.mjs";
import ClientData from "./server/models/clients.mjs";
import CompanyData from "./server/models/companies.mjs";
import LoggingData from "./server/models/logging.mjs";
import LookupsData from "./server/models/lookups.mjs";
import ProjectData from "./server/models/projects.mjs";
import ReportData from "./server/models/reports.mjs";
import TaskData from "./server/models/tasks.mjs";
import MiscData from "./server/models/misc.mjs";

import { fileURLToPath } from "url";
import { dirname } from "path";


const root_path = dirname (fileURLToPath (import.meta.url));
const app = express ();


const countries_id = 1;
const districts_id = 2;


app.process = async (request, response, handler) => {

	//await new Promise (resolve => setTimeout (resolve, 5000)); // For debugging - used to pause

	let request_data = request.body;

	global.request = request;
	global.response = response;

	new multiparty.Form ().parse (request, (error, fields, files) => {
		for (let key of Object.keys (fields)) {
			request_data [key] = (fields [key].length > 1) ? fields [key] : fields [key][0];
		}// for;
		global.account_id = parseInt (request_data.account_id);
		handler (request_data);
	});

}// process;


app.set ("port", process.env.PORT || 3000);


app.use (express.static (root_path));
app.use (express.urlencoded ({ extended: false }));
app.use (express.json ());


/********/


app.post ("/accounts", function (request, response) {
	try {
		app.process (request, response, (fields) => {
			let account_data = new AccountData ();
			switch (fields.action) {
				case "save": account_data.save_account (fields); break;
				case "company": account_data.get_accounts_by_company (fields.company_id); break;
				case "project": account_data.get_accounts_by_project (fields.project_id); break;
				case "task": account_data.get_accounts_by_task (fields.task_id); break;
				default: break;
			}// switch;
		});
	} catch (except) { console.log (except) }
});


app.post ("/addresses", function (request, response) {
	try {
		app.process (request, response, (fields) => {
			let address_data = new AddressData ();
			switch (fields.action) {
				case "save": address_data.save_address (fields); break;
				default: break;
			}// switch;
		});
	} catch (except) { console.log (except) }
});


app.post ("/clients", function (request, response) {
	app.process (request, response, (fields) => {
		let client_data = new ClientData ();
		switch (fields.action) {
			case "list_by_company": client_data.get_clients_by_company (parseInt (fields.company_id)); break;
			case "details": client_data.get_client_by_id (fields.client_id); break;
			case "save": client_data.save_client (fields); break;
		}// switch;
	});
});


app.post ("/companies", function (request, response) {
	app.process (request, response, (fields) => {
		let company_data = new CompanyData ();
		switch (fields.action) {
			case "save": company_data.save_company (fields); break;
		}// switch;
	});
});


app.post ("/logging", function (request, response) {
	app.process (request, response, async fields => {
		let logging_data = new LoggingData ();
		switch (fields.action) {
			case "logging": logging_data.save_log_entry (fields); break;
		}// switch;
	});
});


app.post ("/lookups", function (request, response) {
	app.process (request, response, async fields => {
		let lookups_data = new LookupsData ();
		switch (fields.action) {
			case "get_countries": lookups_data.get_lookups_by_category (countries_id); break;
			case "get_districts": lookups_data.get_lookups_by_category (districts_id); break;
		}// switch;
	});
});


app.post ("/misc", function (request, response) {
	app.process (request, response, (fields) => {
		let misc_data = new MiscData ();
		switch (fields.action) {
			case "status": misc_data.get_statuses (); break;
		}// switch;
	});
});


app.post ("/options", function (request, response) {
	try {
		app.process (request, response, (fields) => {
			let account_option_data = new AccountOptionsData ();
			switch (fields.action) {
				case "get": account_option_data.get_options (); break;	
				case "save": account_option_data.save_option (fields); break;
				default: break;
			}// switch;
		});
	} catch (except) { console.log (except) }
});


app.post ("/projects", function (request, response) {
	app.process (request, response, (fields) => {
		let project_data = new ProjectData ();
		switch (fields.action) {
			case "list": project_data.get_projects_by_client (fields.client_id); break;
			case "details": project_data.get_project_by_id (fields.project_id); break;
			case "save": project_data.save_project (fields); break;
		}// switch;
	});
});


app.post ("/reports", function (request, response) {
	app.process (request, response, (fields) => {
		let report_data = new ReportData ();
		switch (fields.action) {
			case "by_project": report_data.report_by_project (fields.project_id); break;
		}// switch;
	});
});


app.post ("/settings", function (request, response) {
	try {
		app.process (request, response, (fields) => {
			let account_setting_data = new AccountSettingsData ();
			switch (fields.action) {
				case "get": account_setting_data.get_settings (); break;	
				case "save": account_setting_data.save_setting (fields.setting_id, fields.value); break;
				default: break;
			}// switch;
		});
	} catch (except) { console.log (except) }
});


app.post ("/signin", function (request, response) {
	app.process (request, response, fields => {
		let account_data = new AccountData ();
		account_data.signin (fields, response);
	});
});


app.post ("/tasks", function (request, response) {
	app.process (request, response, (fields) => {
		let task_data = new TaskData ();
		switch (fields.action) {
			case "assignee": task_data.get_tasks_by_assignee (fields.account_id); break;
			case "project": task_data.get_tasks_by_project (fields.project_id); break;
			case "details": task_data.get_task (fields.task_id); break;
			case "save": task_data.save (fields); break;
		}// switch;
	});
});


// app.post ("/team", function (request, response) {
// 	app.process (request, response, (fields) => {
// 		let team_data = new TeamData ();
// 		switch (fields.action) {
// 			case "team_list": team_data.get_teams (app.accounts.current_account ().account_id); break;
// 			case "member_list": team_data.get_members (fields.team_id); break;
// 		}// switch;
// 	});
// });


var options = {
    key: file_system.readFileSync (`${root_path}/server/certificates/timelog.key`),
    cert: file_system.readFileSync (`${root_path}/server/certificates/timelog.crt`),
};

let server = https.createServer (options, app).listen (app.get ("port"), function () {
    console.log (`listening: ${root_path}`);
});

//server.keepAliveTimeout = 10000;