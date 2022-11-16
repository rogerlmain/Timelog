import Database from "client/classes/database";
import CompanyStorage from "../storage/company.storage";


const table = "offshore";


export default class OffshoreModel {


	static save_offshore_token (data) {

		data.append ("action", "save_token");
		data.append ("company_id", CompanyStorage.active_company_id ());

		return Database.save_data (table, data);

	}/* save_offshore_token */;


}// OffshoreModel;