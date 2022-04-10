import Database from "classes/database";


export default class CompaniesModel {

	static save_company (data) {
		data.append ("action", "save");
		let result = Database.save_data ("companies", data);
		return result;
	}// save_company;
	
}// CompaniesModel;