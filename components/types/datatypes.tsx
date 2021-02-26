import * as common from "components/classes/common";
import { admin_types } from "./constants";


export interface SizeRecord {
	width: number;
	height: number;
}// SizeRecord;


/********/


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
	company_id: number;
	admin_type: number;
	teams: any;

	public static parse (json_string: string): account {
		if (common.not_set (json_string)) return null;

		let result: account = new account ();
		let values: any = JSON.parse (json_string);

		Object.assign (result, values);
		result.admin_type = values.administrator_type;
		if (common.isset (result.teams)) result.teams = JSON.parse (result.teams as unknown as string);
		return result;
	}// parse;


	public administrator () { return this.admin_type >= admin_types.corporate }


	public programmer = () => { return this.admin_type >= admin_types.programmer }


}// account;


export class team {
	team_id: number;
	name: string;
}// team;