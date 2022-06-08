import Database from "classes/database";
import CompanyStorage from "client/classes/storage/company.storage";
import DataModel from "client/classes/models/data.model";


export default class LookupsModel extends DataModel {


	static async get_countries () {
		let parameters = new FormData ();
		parameters.set ("action", "get_countries");
		return Database.fetch_data ("lookups", parameters);
	}// get_countries;


	static async get_districts () {
		let parameters = new FormData ();
		parameters.set ("action", "get_districts");
		return Database.fetch_data ("lookups", parameters);
	}// get_countries;


}// LookupsModel;
