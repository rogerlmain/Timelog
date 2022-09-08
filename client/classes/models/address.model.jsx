import Database from "client/classes/database";
import DataModel from "client/classes/models/data.model";


const table = "addresses";


export default class AddressModel extends DataModel {

	static save_address (data) {
		data.append ("action", "save");
		let result = Database.save_data (table, data);
		return result;
	}// save_account;

}// AddressModel;