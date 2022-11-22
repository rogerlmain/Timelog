import OffshoreHandler from "../offshore.handler.mjs";


const git_api = "https://api.github.com";

const repo_url = `${git_api}/user/repos`;
//const issues_url = `https://api.github.com/repos/${git_username}/Timelog/issues`;

const users_url = `${git_api}/repos/{owner}/{repo}/collaborators`;


export const repository_type = {
	git	: 1,
	jira: 2,
}/* repository_type */;


export default class GithubHandler {


	github_account = details => { return {
		headers: {
			"User-Agent": "bundion-timelog",
			"Accept": "application/vnd.github+json",
			Authorization: `token ${details.token}`,
		},
		owner: details.offshore_id,
		scope: "repo",
	}}/* github_account */;


	get_projects = account_id => OffshoreHandler.get_offshore_data (projects_url, this.github_account ());
	get_repositories = offshore_account => OffshoreHandler.get_offshore_data (repo_url, this.github_account (offshore_account));


	get_users = (offshore_account, repo_id) => {

		let url = users_url.replace ("{owner}", offshore_account.offshore_id).replace ("{repo}", repo_id);

		return OffshoreHandler.get_offshore_data (url, this.github_account (offshore_account));

	}/* get_users */;


}// GithubHandler;