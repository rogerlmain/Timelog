import Database from "classes/database";


export default class CompaniesModel {

	static set_company (data) {
		data.append ("action", "save");
		let result = Database.save_data ("companies", data);
		return result;
	}// set_company;


	static get_companies () {
		return Database.fetch_data ("companies", { action: "list" });
	}// get_companies;
	
}// CompaniesModel;