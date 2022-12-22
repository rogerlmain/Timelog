import OffshoreHandler from "../offshore.handler.mjs";


const github_url = `https://api.github.com`;

const gql_endpoint = `graphql`;

const repo_url = `${github_url}/user/repos`;
const projects_url = `${github_url}/repos/{owner}/{repo}/projects?state=all`;
const users_url = `${github_url}/repos/{owner}/{repo}/collaborators`;


export const repository_type = {
	github	: 1,
	gitlab	: 2,
	jira	: 3,
}/* repository_type */;


export default class GithubHandler {


	github_account = details => true ? {
		method: "POST",
		body: JSON.stringify ({ query: details.query.stripped () }),
		headers: {Authorization: `token ${details.token}`}
	} : null;


	get_projects = (details, repository) => {

		details.query = `query {repository (owner: "${details.offshore_id}", name: "${repository}") {
			name,
			description,
			projectsV2 (last: 10) { edges { node { id, title } } }
		}}`;

		OffshoreHandler.query (this.github_account (details)).then (result => {

			let projects = null;

			result?.data?.repository?.projectsV2?.edges?.forEach (project => {

				let response = {
					project_id: project.node.id,
					name: project.node.title,
					type: repository_type.github,
					token_id: details.token_id,
				}/* response */;

				if (is_null (projects)) projects = new Array ();
				projects.push (response);

			});

			global.response ().send (JSON.stringify (projects));

		}).catch (error => global.response ().send (JSON.stringify (error)));

	}/* get_projects */;

	
	get_repositories = details => new Promise ((resolve, reject) => {

		details.query = `query { user (login: "rexthestrange") {
			id,
			repositories (first: 10) { edges { node { id, name } } }
		}}`
	
		OffshoreHandler.query (this.github_account (details)).then (result => {

			let repositories = null;

			result?.data?.user?.repositories?.edges?.forEach (item => {

				let repository = {
					client_id: item.node.id,
					name: item.node.name,
					type: repository_type.github,
					token_id: details.token_id
				}/* repository */;

				if (is_null (repositories)) repositories = new Array ();
				repositories.push (repository);

			});

			resolve (repositories);
			
		}).catch (reject);

	})/* get_repositories */;


	get_users = (offshore_account, repo_id) => {

		let url = users_url.replaceAll ({
			"{owner}": offshore_account.offshore_id,
			"{repo}": repo_id,
		});

		return OffshoreHandler.get_offshore_data (url, this.github_account (offshore_account));

	}/* get_users */;


}// GithubHandler;