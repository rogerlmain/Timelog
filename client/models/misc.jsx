import Database from "classes/database";
import DataModel from "models/data.model";


export default class MiscModel extends DataModel {


	static fetch_statuses (callback) {
		let parameters = new FormData ();
		parameters.set ("action", "status");
		Database.fetch_data ("misc", parameters).then (callback);
	}// fetch_statuses;


}// MiscModel;