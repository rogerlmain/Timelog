import OffshoreHandler from "../offshore.handler.mjs";

import { repository_type } from "../offshore.handler.mjs";


const github_url = `https://api.github.com`;

const gql_endpoint = `graphql`;

const repo_url = `${github_url}/user/repos`;
const projects_url = `${github_url}/repos/{owner}/{repo}/projects?state=all`;
const users_url = `${github_url}/repos/{owner}/{repo}/collaborators`;


export default class GithubHandler {


	github_account = details => true ? {
		method: "POST",
		body: JSON.stringify ({ query: details.query.stripped () }),
		headers: {Authorization: `token ${details.token}`}
	} : null;


	query = (options) => new Promise ((resolve, reject) => {
		fetch ("https://api.github.com/graphql", options).then (response => response.json ()).then (body => resolve (body)).catch (error => {
			console.log (error);
			reject (error);
		});
	})/* query */;


	/********/


	get_repositories = details => new Promise ((resolve, reject) => {

		details.query = `query { user (login: "${details.offshore_id}") {
			id,

projectsV2 (first: 10) { edges { node { id, title } } }

			repositories (first: 10) { edges { node { id, name, owner { login } } } }
		}}`
	
		this.query (this.github_account (details)).then (result => {

			let repositories = null;

			result?.data?.user?.repositories?.edges?.forEach (item => {

				if (item?.node?.owner?.login != details.offshore_id) return;
				if (is_null (repositories)) repositories = new Array ();

				repositories.push ({
					repository_id: item.node.id,
					name: item.node.name,
					type: repository_type.github,
					token_id: details.token_id,
					owner: item.node.owner.login,
				})/* repository */;

			});

			resolve (repositories);
			
		}).catch (reject);

	})/* get_repositories */;


	get_clients = details => new Promise ((resolve, reject) => {

		let projects = null;

		details.query = `query { user (login: "${details.offshore_id}") {
			id,
			projectsV2 (first: 10) { edges { node { id, title } } }
		}}`

		this.query (this.github_account (details)).then (result => {

			if (is_null (projects)) projects = new Array ();

			result?.data?.repository?.projectsV2?.edges?.forEach (project => isset (projects) ?  projects.push ({
				client_id: project?.node?.id,
				name: project?.node?.title,
				type: repository_type.github,
				token_id: repository.token_id,
			}));

			resolve (projects);

		}).catch (reject);

	})/* get_clients */;


	// get_clients = details => new Promise ((resolve, reject) => {
	// 	this.get_repositories (details).then (repositories => {

	// 		let projects = null;
	// 		let repo_count = 0;

	// 		repositories?.forEach (repository => {

	// 			details.query = `query {repository (owner: "${repository.owner}", name: "${repository.name}") {
	// 				id,
	// 				name,
	// 				projectsV2 (first: 10) { edges { node { id, title } } }
	// 			}}`;

	// 			this.query (this.github_account (details)).then (result => {

	// 				if (is_null (projects)) projects = new Array ();

	// 				result?.data?.repository?.projectsV2?.edges?.forEach (project => projects.push ({
	// 					client_id: project?.node?.id,
	// 					name: project?.node?.title,
	// 					type: repository_type.github,
	// 					token_id: repository.token_id,
	// 				}));

	// 				if (++repo_count == repositories.length) resolve (projects);

	// 			}).catch (reject);

	// 		});
		
	// 	});
	// })/* get_clients */;


// 	get_nodes

// query {nodes (ids:["PVT_kwHOA7HDUM4AGiMM", "PVT_kwHOA7HDUM4AIzoO"]) {
//   __typename,
//   id,
//   ... on ProjectV2 {
//     title
//   }
// } } 


	get_tasks_by_name_search = details => this.query_issues ({
		repo: "rexthestrange/Timelog",
		state: "open",
		[`${search_term} in`]: "title",
	});
	
		// let query = `query {search (query:"
		
		// 	repo:rexthestrange/Timelog 
		// 	state:open 
		// 	Deadbeat in:title
			
		// 	", type:ISSUE, first: 100
			
		// 	) {
		// 	edges { 
		// 	  node {
		// 		... on Issue {
		// 		  id,get_latest
		// 		  state,
		// 		  title,
		// 		}
		// 	  }
		// 	}
		// }}`


	get_tasks = details => new Promise ((resolve, reject) => {
		this.get_repositories (details).then (repositories => {

			let tasks = null;
			let repo_count = 0;

			repositories?.forEach (repository => {

				details.query = `query {repository (owner: "${repository.owner}", name: "${repository.name}") {
					id,
					name,
					issues (first: 10) { edges { node {
						id,
						title,
						number,
						projectV2 (number: 1) {
							id,
							title
						}
					} } }
				}}`;

				OffshoreHandler.query (this.github_account (details)).then (result => {

					result?.data?.repository?.issues?.edges?.forEach (issue => {

						if (issue?.node?.projectV2?.id != details.project_id) return;
						if (is_null (tasks)) tasks = new Array ();

						tasks.push ({
							project_id: issue?.node?.id,
							name: issue?.node?.title,
							type: repository_type.github,
						});
						
					});

					if (++repo_count == repositories.length) resolve (tasks);

				}).catch (reject);

			});
		
		});
	})/* get_tasks */;


	get_tasks_by_number = (token, issues) => {

		if (!Array.isArray (issues)) issues = [issues];
	
		return new Promise ((resolve, reject) => this.query (this.github_account ({

			token: token,

			query: `query {search (query:"repo:rexthestrange/Timelog state:open issue: ${issues.join (space)}", type:ISSUE, first: 100) {
				edges { node { ... on Issue {
					id,
					number,
					title,
				}	}	}
			}}`

		})).then (response => {

			let result = null;

			response?.data?.search?.edges?.forEach (next => {
				
				let task = {
					title: next.node.title,
					number: next.node.number,
					project_id: next.node.id
				}/* task */

				isset (result) ? result [next.node.id] = task : result = {[next.node.id]: task};

			});

			resolve (result);
			
		}).catch (reject));

	}/* get_tasks_by_number */;


	get_users = (offshore_account, repo_id) => {

		let url = users_url.replaceAll ({
			"{owner}": offshore_account.offshore_id,
			"{repo}": repo_id,
		});

		return OffshoreHandler.get_offshore_data (url, this.github_account (offshore_account));

	}/* get_users */;


}// GithubHandler;