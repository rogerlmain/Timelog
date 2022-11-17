import OffshoreHandler from "../offshore.handler.mjs";


const github_access_token = "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";

const repo_url = `https://api.github.com/user/repos`;

//const issues_url = `https://api.github.com/repos/${git_username}/Timelog/issues`;


// end temp



export const repository_type = {
	git: "GIT",
	jira: "JIRA"
}/* repository_type */;


export default class GithubHandler extends OffshoreHandler {


	get_projects = (account_id) => {

		const options = {
			headers: {
				"User-Agent": "bundion-timelog",
				"Accept": "application/vnd.github+json",
				Authorization: `token ${github_access_token}`,
			},
			owner: "rexthestrange",
			scope: "repo",
		}/* options */;
	
		return OffshoreModel.get_offshore_data (projects_url, options);

	}/* get_offshore_data */;


}// GithubHandler;