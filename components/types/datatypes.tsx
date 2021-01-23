import * as common from "components/classes/common";


export class entry {

	entry_id: number;
	client_id: number;
	project_id: number;
	start_time: Date;
	end_time: Date;

	public static parse (json_string: string): entry {
		return (common.is_null (json_string)) ? null : JSON.parse (json_string);
	}// parse;

}// entry;


export class account {

	account_id: number;
	first_name: string;
	last_name: string;
	username: string;
	email_address: string;
	account_type: number;
	administrator: boolean;
	teams: any;

	public static parse (json_string: string): account {
		let result: account = JSON.parse (json_string);
		if (common.isset (result) && common.isset (result.teams)) result.teams = JSON.parse (result.teams as unknown as string);
		return result;
	}// parse;

}// account;


export class team {
	team_id: number;
	name: string;
}// team;