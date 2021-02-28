import DataModel from "../models.mjs";


class TeamData extends DataModel {

	get_teams (account_id) {
		let procedure = "call get_teams (?)";
		let parameters = [account_id];
		execute_query (procedure, parameters);
	}// get_teams;


	get_members (team_id) {
		let procedure = "call get_team_members (?)";
		let parameters = [team_id];
		execute_query (procedure, parameters);
	}// get_members;

}// TeamData;


export default TeamData;