import "./server/globals.mjs";

import express from "express";
import path, { join } from "path";
import multiparty from "multiparty";

import AccountData from "./server/models/accounts.mjs";
import ClientData from "./server/models/clients.mjs";
import EntryData from "./server/models/entries.mjs";
import ProjectData from "./server/models/projects.mjs";
import TaskData from "./server/models/tasks.mjs";
import MiscData from "./server/models/misc.mjs";

global.root_path = join (path.resolve (), "/");


const app = express ();


app.process = async (request, response, handler) => {

	//await new Promise (resolve => setTimeout (resolve, 5000)); // For debugging - used to pause

	let request_data = request.body;
	let formdata = request.headers ["content-type"].startsWith ("multipart/form-data");

	global.request = request;
	global.response = response;
	global.account = new AccountData ().current_account ();

	if (formdata) {
		new multiparty.Form ().parse (request, (error, fields, files) => {
			for (let key of Object.keys (fields)) {
				request_data [key] = (fields [key].length > 1) ? fields [key] : fields [key][0];
			}// for;
			global.request.data = request_data;
			handler (request_data);
		});
		return;
	}// if;

	handler (request_data);
}// process;


app.set ("port", process.env.PORT || 3000);


app.use (express.static (root_path));
app.use (express.urlencoded ({ extended: false }));
app.use (express.json ());


app.post ("/signin", function (request, response) {
	app.process (request, response, (fields) => {
		let account_data = new AccountData ();
		account_data.signin (fields);
	});
});


/********/


app.post ("/accounts", function (request, response) {
	app.process (request, response, (fields) => {
		let account_data = new AccountData ();
		switch (fields.action) {
			case "save": account_data.save_account (); break;
			case "company": account_data.get_accounts_by_company (fields.company_id); break;
			case "project": account_data.get_accounts_by_project (fields.project_id); break;
			case "task": account_data.get_accounts_by_task (fields.task_id); break;
			default: break;
		}// switch;
	});
});


app.post ("/clients", function (request, response) {
	app.process (request, response, (fields) => {
		let client_data = new ClientData ();
		switch (fields.action) {
			case "list": client_data.get_clients (new AccountData ().current_account ().company_id); break;
			case "details": client_data.get_client (fields.client_id); break;
			case "save": client_data.save_client (fields); break;
		}// switch;
	});
});


app.post ("/logging", function (request, response) {
	app.process (request, response, (fields) => {
		let entry_data = new EntryData ();
		switch (fields.action) {
			case "entries": entry_data.get_entries (fields.client_id, fields.project_id); break;
			case "logging": entry_data.save_entry (fields.client_id, fields.project_id, fields.entry_id); break;
			case "log_status": entry_data.get_current_entry (); break;
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


app.post ("/projects", function (request, response) {
	app.process (request, response, (fields) => {
		let project_data = new ProjectData ();
		switch (fields.action) {
			case "list": project_data.get_projects_by_client (fields.client_id); break;
			case "details": project_data.get_project (fields.project_id); break;
			case "save": project_data.save_project (fields); break;
		}// switch;
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


let server = app.listen (app.get ("port"), function () {
    console.log ("listening");
});

//server.keepAliveTimeout = 10000;