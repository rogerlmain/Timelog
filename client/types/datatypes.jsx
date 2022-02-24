import * as common from "classes/common";
import { admin_types, space } from "types/constants";


export class AccountData {

	static parse (json_string) {
		if (common.not_set (json_string)) return null;

		let result = new AccountData ();
		let values = JSON.parse (json_string);

		Object.assign (result, values);
		result.admin_type = values.administrator_type;
		if (common.isset (result.teams)) result.teams = JSON.parse (result.teams);
		return result;
	}// parse;

	administrator = () => { return this.admin_type >= admin_types.corporate }

	programmer = () => { return this.admin_type >= admin_types.programmer }
	
}// AccountData;


export class EntryData {

	static parse (json_string) {
		return (common.is_null (json_string)) ? null : JSON.parse (json_string);
	}// parse;

}// EntryData;


