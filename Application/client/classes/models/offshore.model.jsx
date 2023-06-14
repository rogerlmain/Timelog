import Database from "client/classes/database";
import CompanyStorage from "client/classes/storage/company.storage";

import github_glyph from "resources/images/logos/repositories/github.icon.png";
import gitlab_glyph from "resources/images/logos/repositories/gitlab.icon.png";
import jira_glyph from "resources/images/logos/repositories/jira.icon.png";
import bundion_glyph from "resources/images/logos/repositories/bundion.icon.png";

import { repository_type } from "client/forms/offshore.accounts.form";


const table = "offshore";


export default class OffshoreModel {


	static save_account (repository, token_id, user_id) {

		let data = new FormData ();

		data.append ("action", "save_account");
		data.append ("repository", repository);
		data.append ("token_id", token_id);
		data.append ("offshore_account", user_id);

		return Database.save_data (table, data);

	}// save_account;


	static save_token (data) {

		data.append ("action", "save_token");
		data.append ("company_id", CompanyStorage.active_company_id ());

		return Database.save_data (table, data);

	}/* save_token */;


	static get_tokens = () => Database.fetch_data (table, { 
		action: "get_tokens",
		company_id: CompanyStorage.active_company_id (),
	})/* get_tokens */;


	static get_clients = () => Database.fetch_data (table, {
		action: "get_clients",		
		company_id: CompanyStorage.active_company_id (),
	})/* get_clients */;


	// Equivalent to Bundion projects
	static get_latest_projects = (type, client_id) => Database.fetch_data (table, {
		action: "get_latest_projects",
		company_id: CompanyStorage.active_company_id (),
		type: type,
		client_id: client_id,
	})/* get_tasks */;


	static get_projects_by_number = issue => new Promise ((resolve, reject) => {
		Database.fetch_data (table, { 
			action: "get_projects_by_number",
			...issue,
		}).then (result => resolve ({ 
			client_id: issue.client_id,
			...result, 
		})).catch (reject);
	})/* get_projects_by_number */;


	static get_tasks_by_search = issue => Database.fetch_data (table, {
		action: "get_task_by_search",
		...issue,
		// search_text: search_text,
		// type: type
	})/* get_tasks_by_search */;


	static get_users = (token, repo) => Database.fetch_data (table, {
		action: "get_users",
		token: token, 
		repo: repo,
	})/* get_users */;


	/**** Helper Functions */


	static glyph_image = repo => {
		switch (repo.type) {
			case repository_type.github: return github_glyph;
			case repository_type.gitlab: return gitlab_glyph;
			case repository_type.jira: return jira_glyph;

			/* other repos here */

			default: return bundion_glyph;
		}// switch;
	}/* glyph_image */;


}// OffshoreModel;