import Database from "classes/database";


export default class CompaniesModel {

	static save_company (data) {
		data.append ("action", "save");
		return Database.save_data ("Companies", data);
	}// save_company;
	
}// CompaniesModel;