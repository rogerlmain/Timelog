require ("./server/globals.js");

const path = require ("path");
const express = require ("express");
const session = require ("express-session");
const multiparty = require ("multiparty");

const root_path = path.join (__dirname, "/");


var app = express ();


app.initialize = (request, response) => {
	app.accounts = require ("./server/accounts")(request);
	app.models = require ("./server/models")(request, response, app.accounts.current_account ());
}// app.initialize;


app.process = (request, response, handler) => {
	app.initialize (request, response);

	let request_data = request.body;
	let formdata = request.headers ["content-type"].startsWith ("multipart/form-data");

	if (formdata) {
		new multiparty.Form ().parse (request, (error, fields, files) => {
			for (let key of Object.keys (fields)) {
				request_data [key] = (fields [key].length > 1) ? fields [key] : fields [key][0];
			}// for;
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
	app.initialize (request, response);
	app.models.signin ();
});


app.post ("/accounts", function (request, response) {
	app.process (request, response, (fields) => {
		switch (fields.action) {
			case "save": app.models.save_account (); break;
			case "company": app.models.get_accounts_by_company (fields.company_id); break;
			case "project": app.models.get_accounts_by_project (fields.project_id); break;
			default: break;
		}
	})
});


app.post ("/logging", function (request, response) {
	app.process (request, response, (fields) => {
		switch (fields.action) {
			case "entries": app.models.get_entries (fields.client_id, fields.project_id); break;
			case "logging": app.models.save_entry (fields.client_id, fields.project_id, fields.entry_id); break;
			case "log_status": app.models.get_current_entry (); break;
		}// switch;
	})
});


app.post ("/clients", function (request, response) {
	app.process (request, response, (fields) => {
		switch (fields.action) {
			case "list": app.models.get_clients (app.accounts.current_account ().company_id); break;
		}// switch;
	})
});


app.post ("/projects", function (request, response) {
	app.process (request, response, (fields) => {
		switch (fields.action) {
			case "list": app.models.get_projects_by_client (fields.client_id); break;
			case "details": app.models.get_project (fields.project_id); break;
			case "save": app.models.save_project (fields); break;
		}// switch;
	})
});


app.post ("/tasks", function (request, response) {
	app.process (request, response, (fields) => {
		let task_handler = require ("./server/models/tasks")(request, response, app.accounts.current_account ());
		switch (fields.action) {
			case "list": task_handler.get_tasks (fields.project_id); break;
			case "save": task_handler.save (fields); break;
		}// switch;
	})
});


app.post ("/team", function (request, response) {
	app.process (request, response, (fields) => {
		switch (fields.action) {
			case "team_list": app.models.get_teams (app.accounts.current_account ().account_id); break;
			case "member_list": app.models.get_members (fields.team_id); break;
		}// switch;
	})
});


app.listen (app.get ("port"), function () {
    console.log ("listening");
});