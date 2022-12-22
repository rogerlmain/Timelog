import https from "https";
import fetch from "node-fetch";
import OffshoreModel from "../models/offshore.model.mjs";
import GithubHandler, { repository_type } from "./offshore/github.handler.mjs";


export default class OffshoreHandler {


	static get_offshore_data = (url, options) => new Promise ((resolve, reject) => https.get (`${url}`, options, result => {

		let data = blank;
			
		result.on ("data", chunk => data += chunk);
		result.on ("end", () => resolve (data));

	}).on ("error", error => reject (error)));


	static get_repositories = data => new Promise ((resolve, reject) => OffshoreModel.get_tokens (data).then (async tokens => {

		try {

			let result = null;

			for (let item of tokens) {
				switch (item.type) {
					case repository_type.github: result = Array.concat (result, await new GithubHandler ().get_repositories (item)); break;
					case repository_type.gitlab: break;
					case repository_type.jira: break;
				}/* switch */;
			}/* for */;

			resolve (result);

		} catch (except) { reject (except) }

	}))/* get_respositories */;


	static get_projects = (token_id, repo_code) => {
		OffshoreModel.get_token (token_id).then (token => {

			if (token.length > 0) token = token [0];

			switch (token.type) {
				case repository_type.github: new GithubHandler ().get_projects (token, repo_code); break;
				case repository_type.gitlab: break;
				case repository_type.jira: break;
			}// switch;

		});
	}/* get_users */;


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


	static query = (options) => new Promise ((resolve, reject) => {
		fetch ("https://api.github.com/graphql", options).then (response => response.json ()).then (body => resolve (body)).catch (error => {
			console.log (error);
			reject (error);
		});
	})/* query */;


}// OffshoreHandler;