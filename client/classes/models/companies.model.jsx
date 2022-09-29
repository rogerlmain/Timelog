import Database from "client/classes/database";


const table = "companies";


export default class CompaniesModel {

	static save_company (data) {
		data.append ("action", "save");
		let result = Database.save_data (table, data);
		return result;
	}// save_company;


	static get_companies = ()  => Database.fetch_data (table, { action: "list" });
	
	
}// CompaniesModel;