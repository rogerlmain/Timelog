import https from "https";
import fetch from "node-fetch";
import LoggingModel from "../models/logging.model.mjs";
import OffshoreModel from "../models/offshore.model.mjs";
import GithubHandler from "./offshore/github.handler.mjs";


export const repository_type = {
	github	: 1,
	gitlab	: 2,
	jira	: 3,
}/* repository_type */;


export default class OffshoreHandler {


	static get_offshore_data = (url, options) => new Promise ((resolve, reject) => https.get (`${url}`, options, result => {

		let data = blank;
			
		result.on ("data", chunk => data += chunk);
		result.on ("end", () => resolve (data));

	}).on ("error", error => reject (error)));


	static get_clients = company_id => new Promise ((resolve, reject) => OffshoreModel.get_tokens (company_id).then (async tokens => {
		try {
			for (let item of tokens) {
				switch (item.type) {
					case repository_type.github: return new GithubHandler ().get_clients (item).then (resolve).catch (reject); break;
					case repository_type.gitlab: break;
					case repository_type.jira: break;
				}// switch;
			}// for;
		} catch (except) { reject (except) }
	}))/* get_clients */;


	static get_latest_projects = details => new Promise ((resolve, reject) => OffshoreModel.get_tokens (details.company_id).then (async tokens => {
		try {
			OffshoreModel.get_latest_projects (details.client_id).then (async data => {

				let issues = null;

				data?.forEach (project => isset (issues) ? issues.push (project.project_id) : (issues = [project.project_id]));

				switch (data?.[0]?.type) {
					case repository_type.github: resolve (await new GithubHandler ().get_projects_by_number (data?.[0]?.token, issues)); break; 
					case repository_type.gitlab: break;
					case repository_type.jira: break;
				}// switch;

			})/* get_latest_projects */;
		} catch (except) { reject (except) }
	}))/* get_latest_projects */;


	static get_projects_by_number = details => new Promise ((resolve, reject) => {

		if (not_set (details.token_id)) resolve (null);

		OffshoreModel.get_token (details.token_id).then (token_data => {

			let token = token_data?.[0]?.token;

			switch (parseInt (details.type)) {
				case repository_type.github: return new GithubHandler ().get_projects_by_number (token, details.task_number).then (resolve).catch (reject); break;
				case repository_type.gitlab: break;
				case repository_type.jira: break;
				default: resolve (null); break;
			}// switch;

		});
		
	})/* get_projects_by_number */;


	static get_users = (token_id, repo_code) => {
		OffshoreModel.get_token (token_id).then (token => {

			if (token.length > 0) token = token [0];

			switch (token.type) {
				case repository_type.github: new GithubHandler ().get_users (token, repo_code).then (result => global.response ().send (JSON.stringify (result))); break;
				case repository_type.gitlab: break;
				case repository_type.jira: break;
			}// switch;

		});
	}/* get_users */;


}// OffshoreHandler;