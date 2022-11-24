import Database from "client/classes/database";
import CompanyStorage from "client/classes/storage/company.storage";

import git_glyph from "resources/images/logos/repositories/git.png";
import jira_glyph from "resources/images/logos/repositories/jira.png";
import bundion_glyph from "resources/images/logos/repositories/bundion.png";

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


	static get_repositories = () => Database.fetch_data (table, {
		action: "get_repositories",
		company_id: CompanyStorage.active_company_id (),
	})/* get_repositories */;


	static get_users = (token, repo) => Database.fetch_data (table, { 
		action: "get_users",
		token: token, 
		repo: repo,
	})/* get_users */;


	/**** Helper Functions */


	static glyph_image = repo => {
		switch (repo.type) {
			case repository_type.git: return git_glyph;
			case repository_type.jira: return jira_glyph;

			/* other repos here */

			default: return bundion_glyph;
		}// switch;
	}/* glyph_image */;


}// OffshoreModel;