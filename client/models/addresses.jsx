import Database from "classes/database";
import DataModel from "models/data.model";


export default class AddressesModel extends DataModel {

	static save_address (data) {
		data.append ("action", "save");
		let result = Database.save_data ("addresses", data);
		return result;
	}// save_account;

}// AddressesModel;