import Database from "classes/database";
import DataModel from "models/data.model";


export class StatusItem {
	status_id: number;
	description: string;
}// StatusItem;


export class StatusList extends Array<StatusItem> {};


export default class MiscModel extends DataModel {


	public static fetch_statuses (callback: any) {
		let parameters = new FormData ();
		parameters.append ("action", "status");
		Database.fetch_data ("misc", parameters).then (callback);
	}// fetch_statuses;


}// MiscModel;