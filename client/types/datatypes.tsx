import * as common from "classes/common";
import { admin_types, space } from "types/constants";


/**** Dimensions ****/


export interface Dimensions {
	width?: string | number;
	height?: string | number;
}// Dimensions;


/********/


export interface iData {}


/********/


export class AccountData implements iData {

	account_id: number;
	first_name: string;
	last_name: string;
	username: string;
	email_address: string;
	account_type: number;
	company_id: number;
	admin_type: number;
	teams: any;
	date_created: Date;
	last_updated: Date;

	public static parse (json_string: string): AccountData {
		if (common.not_set (json_string)) return null;

		let result: AccountData = new AccountData ();
		let values: any = JSON.parse (json_string);

		Object.assign (result, values);
		result.admin_type = values.administrator_type;
		if (common.isset (result.teams)) result.teams = JSON.parse (result.teams as unknown as string);
		return result;
	}// parse;

	public administrator = () => { return this.admin_type >= admin_types.corporate }

	public programmer = () => { return this.admin_type >= admin_types.programmer }
	
}// AccountData;


export class EntryData {

	entry_id: number;
	client_id: number;
	project_id: number;
	start_time: Date;
	end_time: Date;
	date_created: Date;
	last_updated: Date;

	public static parse (json_string: string): EntryData {
		return (common.is_null (json_string)) ? null : JSON.parse (json_string);
	}// parse;

}// EntryData;


export class ClientData implements iData {
	client_id: number;
	client_name: string;
	description: string;
}// ClientData;


export class LogData implements iData {
	log_entry_id: number;
	project_id: number;
	client_name: string;
	project_name: string;
	start_time: Date;
	end_time: Date;
}// LogData;


export class ProjectData {
	id: number;
	client_id: number;
	name: string;
	code: string;
	description: string; 
	date_created: Date;
	last_updated: Date;
}// ProjectData;


export interface TaskData {
	id: number;
	name: string;
}// TaskData;


export class TeamData {
	team_id: number;
	name: string;
	date_created: Date;
	last_updated: Date;
}// TeamData;

