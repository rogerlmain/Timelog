import "./server/globals.mjs";

import express from "express";

import file_system from "fs";
import https from "https";
import multiparty from "multiparty";

import AccountsModel from "./server/models/accounts.model.mjs";

import AddressModel from "./server/models/address.model.mjs";
import ClientModel from "./server/models/client.model.mjs";
import CompanyAccountsModel from "./server/models/company.accounts.model.mjs";
import CompanyCardModel from "./server/models/company.cards.model.mjs";
import CompaniesModel from "./server/models/companies.model.mjs";
import InvitationModel from "./server/models/invitations.model.mjs";
import LoggingModel from "./server/models/logging.model.mjs";
import LookupsModel from "./server/models/lookups.model.mjs";
import OptionsModel from "./server/models/options.model.mjs";
import PermissionsModel from "./server/models/permissions.model.mjs";
import PricingModel from "./server/models/pricing.model.mjs";
import ProjectsModel from "./server/models/projects.model.mjs";
import ReportsModel from "./server/models/reports.model.mjs";
import SettingsModel from "./server/models/settings.model.mjs";

import MiscData from "./server/models/misc.mjs";
import TaskData from "./server/models/tasks.mjs";

import EmailHandler from "./server/handlers/email.handler.mjs";
import PaymentHandler from "./server/handlers/payment.handler.mjs";

import { createNamespace, getNamespace } from "continuation-local-storage";
import { root_path } from "./server/constants.mjs";


const countries_id = 1;
const districts_id = 2;

const method = { get: "get", post: "post" };


let app = express ();


/********/


global.session_namespace = "timelog_session";

global.request = () => getNamespace (global.session_namespace).get ("request");
global.response = () => getNamespace (global.session_namespace).get ("response");


app.process = async (handler) => {

//	await new Promise (resolve => setTimeout (resolve, 2000)); // For debugging - used to pause

	let request = global.request ();
	let request_data = request.body;
	
	if (request.method.equals (method.get)) return handler (request.query);

	new multiparty.Form ().parse (request, (error, fields, files) => {
		for (let key of Object.keys (fields)) {
			request_data [key] = (fields [key].length > 1) ? fields [key] : fields [key][0];
		}// for;
		handler (request_data);
	});

}// process;


app.set ("port", process.env.PORT || 3000);


app.use (express.static (root_path));
app.use (express.urlencoded ({ extended: false }));
app.use (express.json ());


app.use ((request, response, next) => {

	let session = getNamespace (global.session_namespace);

	session.bindEmitter (request);
	session.bindEmitter (response);

	session.run (function () {
		session.set ("request", request);
		session.set ("response", response);
		next ();
	});

});


/**** Data Lookups ****/


app.post ("/accounts", () => {
	try {
		app.process (fields => {
			let account_data = new AccountsModel ();
			switch (fields.action) {
				case "save"		: account_data.save_account (fields); break;
				case "company"	: account_data.get_accounts_by_company (fields.company_id); break;
				case "project"	: account_data.get_accounts_by_project (fields.project_id); break;
				case "task"		: account_data.get_accounts_by_task (fields.task_id); break;
				default: break;
			}// switch;
		});
	} catch (except) { console.log (except) }
});


app.post ("/addresses", () => {
	try {
		app.process (fields => {
			let address_data = new AddressModel ();
			switch (fields.action) {
				case "save": address_data.save_address (fields); break;
				default: break;
			}// switch;
		});
	} catch (except) { console.log (except) }
});


app.post ("/clients", () => {
	app.process (fields => {
		let client_data = new ClientModel ();
		switch (fields.action) {
			case "list_by_company": client_data.get_clients_by_company (parseInt (fields.company_id)); break;
			case "details": client_data.get_client_by_id (fields.client_id); break;
			case "delete": client_data.delete_client (fields.client_id); break;
			case "save": client_data.save_client (fields); break;
		}// switch;
	});
});


app.post ("/companies", () => {
	app.process (fields => {
		let company_data = new CompaniesModel ();
		switch (fields.action) {
			case "save": company_data.save_company (fields); break;
			case "list": company_data.get_companies_by_account (fields.account_id).then (company_data.send_result_data.bind (company_data)); break;
		}// switch;
	});
});


app.post ("/company_accounts", () => {
	app.process (fields => {
		let company_accounts_data = new CompanyAccountsModel ();
		switch (fields.action) {
			case "save": company_accounts_data.set_company_account (fields.account_id, fields.company_id); break;
		}// switch;
	});
});


app.post ("/company_cards", () => {
	app.process (fields => {
		let company_card_data = new CompanyCardModel ();
		switch (fields.action) {
			case "get": company_card_data.get_company_cards (fields.company_id); break;
			case "save": company_card_data.save_company_card (fields); break;
		}// switch;
	});
});


app.post ("/email", () => {
	app.process (async fields => {
		switch (fields.action) {
			case "invite": new EmailHandler (fields).send_invitation (); break;
		}// switch;
	});
});


app.post ("/invitations", () => {
	app.process (fields => {

		let invite = new InvitationModel ();

		switch (fields.action) {
			case "all": invite.get_invitations_by_email (fields.email_address); break;
			case "accepted": invite.accept_invitation (fields.account_id, fields.invite_id); break;
			case "declined": invite.decline_invitation (fields.account_id, fields.invite_id); break;
		}// switch;

	});
});


app.post ("/logging", () => {
	app.process (async fields => {

		let logging_data = new LoggingModel ();

		switch (fields.action) {
			case "logging": logging_data.save_log_entry (fields); break;
			case "billing": logging_data.save_billing (fields); break;
		}// switch;

	});
});


app.post ("/lookups", () => {
	app.process (async fields => {
		let lookups_data = new LookupsModel ();
		switch (fields.action) {
			case "get_countries": lookups_data.get_lookups_by_category (countries_id); break;
			case "get_districts": lookups_data.get_lookups_by_category (districts_id); break;
		}// switch;
	});
});


app.post ("/misc", () => {
	app.process (fields => {
		let misc_data = new MiscData ();
		switch (fields.action) {
			case "status": misc_data.get_statuses (); break;
		}// switch;
	});
});


app.post ("/options", () => {
	try {
		app.process (async fields => {

			let account_option_data = new OptionsModel ();

			switch (fields.action) {
				case "company": account_option_data.get_options_by_company (fields.company_id, true); break;	
				case "save": account_option_data.save_option (fields); break;
				default: break;
			}// switch;
			
		});
	} catch (except) { console.log (except) }
});


app.post ("/permissions", () => {
	try {
		app.process (fields => {
			let permissions_data = new PermissionsModel ();
			switch (fields.action) {
				case "get": permissions_data.get_permissions (fields.company_id, fields.account_id); break;	
				case "set": permissions_data.set_permissions (fields.company_id, fields.account_id, fields.permissions); break;
			}// switch;
		});
	} catch (except) { console.log (except) }
});


app.get ("/packages", () => {
	response.sendFile (`${root_path}/client/pages/static/packages.html`);
});


app.post ("/pricing", () => {
	app.process (fields => {
		let project_data = new PricingModel ();
		switch (fields.action) {
			case "get": project_data.get_pricing_by_option (fields.option, fields.value); break;
		}// switch;
	});
});


app.post ("/projects", () => {
	app.process (fields => {
		let project_data = new ProjectsModel ();
		switch (fields.action) {
			case "list": project_data.get_projects_by_client (fields.client_id); break;
			case "details": project_data.get_project_by_id (fields.project_id); break;
			case "save": project_data.save_project (fields); break;
		}// switch;
	});
});


app.post ("/reports", () => {
	app.process (fields => {
		let report_data = new ReportsModel ();
		switch (fields.action) {
			case "project": report_data.report_by_project (fields.project_id, fields.start_date, fields.end_date); break;
		}// switch;
	});
});


app.post ("/settings", () => {
	try {
		app.process (fields => {
			let account_setting_data = new SettingsModel ();
			switch (fields.action) {
				case "get": account_setting_data.get_settings (fields.account_id); break;	
				case "save": account_setting_data.save_setting (fields.account_id, fields.setting_id, fields.value); break;
				default: break;
			}// switch;
		});
	} catch (except) { console.log (except) }
});


app.post ("/tasks", () => {
	app.process (fields => {
		let task_data = new TaskData ();
		switch (fields.action) {
			case "assignee": task_data.get_tasks_by_assignee (fields.account_id); break;
			case "project": task_data.get_tasks_by_project (fields.project_id); break;
			case "details": task_data.get_task (fields.task_id); break;
			case "save": task_data.save (fields); break;
		}// switch;
	});
});


/*********/


app.post ("/payment", () => app.process (fields => new PaymentHandler (response).pay (fields.square_string, fields.path)));


app.post ("/signin", () => {
	app.process (fields => new AccountsModel ().signin (fields, response).then (async results => {

		let account = (global.is_null (results) || (results.length < 1)) ? null : results [0];
		let response = global.response ();
		
		if (global.is_null (account)) {
			response.send ({ 
				error: 1,
				error_message: "Unknown account"
			});
			return;
		}// if;

		let result = { credentials: account };

		let companies = await (new CompaniesModel ().get_companies_by_account (account.account_id));
		let settings = await (new SettingsModel ().get_settings ());
		let logging = (await (new LoggingModel ().latest_log_entry (account.account_id)));

		if (companies.length > 0) {
			for (let company of companies) {
				result.options = { [company.company_id]: await (new OptionsModel ().get_options_by_company (company.company_id)) };
				result.companies = { ...result.companies, [company.company_id]: company }
				delete company.company_id;
			}// for;
		}// if;

		if (companies.length == 1) result.companies.active_company = companies [0].company_id;

		for (let setting of settings) {
			if (not_set (result.settings)) result.settings = {};
			result.settings [setting.id] = setting.value;
		}// for;

		if (logging.length > 0) result.logging = logging [0];

		response.send (result);

	}));
});


/*********/


app.get ("/join", () => app.process (fields => {


	const bad_invitation = (data) => {
		if (global.not_set (data)) return true;
		if (invite.value != data.invite_id) return true;
		if (company.value != data.company_id) return true;
		if (host.value != data.host_id) return true;
		if (timestamp != data.date_created) return true;
		return false;
	}/* bad_invitation */;


	const index_data = (start_index = 0) => { 
		let index_length = parseInt (fields.invite [start_index]);
		return {
			length: index_length,
			value: parseInt (fields.invite.substr (start_index + 1, index_length)),
		}// return;
	}/* index_data */;


	const condolences = `
		<br />Oh no!&nbsp;&#128551
		<br />Your invitation must have gotten lost in the matrix!
	`// condolences;


	/*********/


	let index = 0;

	let invite = index_data ();
	let company = index_data (index += (invite.length + 1));
	let host = index_data (index += (company.length + 1));

	let timestamp = parseInt (fields.invite.substr (index += (host.length + 1), fields.invite.length - (index + 2)));


	/*********/


	new InvitationModel ().get_invitation_by_id (invite.value).then (data => {
		if (isset (data)) data = data [0]; 
		if (isset (data) && bad_invitation (data)) return response.send (condolences);
		response.redirect ("/");
		response.end ();
	});

}));


/*********/


// app.post ("/team", () => {
// 	app.process (fields => {
// 		let team_data = new TeamData ();
// 		switch (fields.action) {
// 			case "team_list": team_data.get_teams (app.accounts.current_account ().account_id); break;
// 			case "member_list": team_data.get_members (fields.team_id); break;
// 		}// switch;
// 	});
// });


createNamespace (global.session_namespace);


var options = {
    key: file_system.readFileSync (`${root_path}/server/certificates/timelog.key`),
    cert: file_system.readFileSync (`${root_path}/server/certificates/timelog.crt`),
};

let server = https.createServer (options, app).listen (app.get ("port"), function () {
    console.log (`listening: ${root_path}`);
});

server.keepAliveTimeout = 10000;

