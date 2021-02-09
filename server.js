require ("./globals.js");

const path = require ("path");
const express = require ("express");
const multiparty = require ("multiparty");
const accounts = require ("./accounts");
const models = require ("./models");

const root_path = path.join (__dirname, "/");


var app = express ();


app.initialize = (request, response) => {
	global.request = request;
	global.response = response;
	global.current_account = accounts.current_account ();
	if (global.isset (global.current_account) && global.isset (global.current_account.companies)) {
		let companies = global.current_account.companies = JSON.parse (global.current_account.companies);

		companies.id_string = function () {

			let result = null;

			for (let key of Object.keys (this)) {
				if (isNaN (parseInt (key))) continue;
				if (global.is_null (result)) {
					result = key;
					continue;
				}// if;
			 	result += `,${key}`;
			}// for;

			return result;

		}// id_string;

	}// if;
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
	models.model_methods.signin ();
});


app.post ("/accounts", function (request, response) {
//	app.initialize (request, response);
	app.process (request, response, (fields) => {
		switch (fields.action) {
			case "save": models.model_methods.save_account (); break;
			case "company": models.model_methods.get_accounts_by_company (fields.company_id); break;
			case "project": models.model_methods.get_accounts_by_project (fields.project_id); break;
			default: break;
		}
	})
});


app.post ("/logging", function (request, response) {
	app.process (request, response, (fields) => {
		switch (fields.action) {
			case "entries": models.model_methods.get_entries (fields.client_id, fields.project_id); break;
			case "logging": models.model_methods.save_entry (fields.client_id, fields.project_id, fields.entry_id); break;
			case "log_status": models.model_methods.get_current_entry (); break;
		}// switch;
	})
});


app.post ("/clients", function (request, response) {
	app.process (request, response, (fields) => {
		switch (fields.action) {
			case "client_list": models.model_methods.get_clients (global.current_account.company_id); break;
		}// switch;
	})
});


app.post ("/projects", function (request, response) {
	app.process (request, response, (fields) => {
		switch (fields.action) {
			case "list": models.model_methods.get_client_projects (fields.client_id); break;
			case "details": models.model_methods.get_project (fields.project_id); break;
			case "save": models.save_project (fields);
		}// switch;
	})
});


app.post ("/team", function (request, response) {
	app.process (request, response, (fields) => {
		switch (fields.action) {
			case "team_list": models.model_methods.get_teams (global.current_account.account_id); break;
			case "member_list": models.model_methods.get_members (fields.team_id); break;
		}// switch;
	})
});


app.listen (app.get ("port"), function () {
    console.log ("listening");
});