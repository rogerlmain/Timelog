import https from "https";
import OffshoreModel from "../models/offshore.model.mjs";
import GithubHandler, { repository_type } from "./offshore/github.handler.mjs";


export default class OffshoreHandler {


	static get_offshore_data = (url, options) => new Promise ((resolve, reject) => https.get (`${url}`, options, result => {

		let data = blank;
			
		result.on ("data", chunk => data += chunk);
		result.on ("end", () => resolve (data));

	}).on ("error", error => reject (error)));


	static get_repositories = data => {
		OffshoreModel.get_tokens (data).then (tokens => {

			let result = null;

			tokens.forEach (item => {
				switch (item.type) {
					case repository_type.git: new GithubHandler ().get_repositories (item).then (repositories => {

						let repos = JSON.parse (repositories);

						if (Array.isArray (repos)) repos.forEach (repo => {
							if (result == null) result = [];
							result.push ({
								id: repo.id,
								type: item.type,
								token: item.token_id,
								name: repo.name,
							});
						});

						global.response ().send (JSON.stringify (result));

					}); break;
				}/* switch */;
			});
			
		});
	}/* get_offshore_respositories */


	static get_users = (token_id, repo_code) => {
		OffshoreModel.get_token (token_id).then (token => {

			if (token.length > 0) token = token [0];

			switch (token.type) {
				case repository_type.git: new GithubHandler ().get_users (token, repo_code).then (result => global.response ().send (JSON.stringify (result))); break;
				case repository_type.jira: break;
			}// switch;

		});
	}// get_users;


}// OffshoreHandler;
