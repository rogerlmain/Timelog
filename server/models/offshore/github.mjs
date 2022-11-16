import OffshoreModel from "../offshore.model.mjs";


export const repository_type = {
	git: "GIT",
	jira: "JIRA"
}/* repository_type */;


export default class GithubModel extends OffshoreModel {


	get_projects = (account_id) => {

		// Get account details here - for the moment use:

		const git_username = "rexthestrange";

		const github_access_token = "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";

		const repo_url = `https://api.github.com/user/repos`;

//		const repo_url2 = `https://api.github.com/users/${git_username}/repos`;

		const projects_url = `https://api.github.com/repos/${git_username}/Timelog/issues`;
		
		// end temp


		const options = {
			headers: {
				"User-Agent": "bundion-timelog",
				"Accept": "application/vnd.github+json",
				"Authorization": `bearer ${github_access_token}`,
//				Authorization: `token ${github_access_token}`,
			},
			owner: "rexthestrange",
			scope: "repo",
		}/* options */;
	


		return OffshoreModel.get_offshore_data (projects_url, options);
//		return OffshoreModel.get_offshore_data (repo_url, options);



	}/* get_offshore_data */;


}// GithubModel;