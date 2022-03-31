import Database from "classes/database";
import Companies from "classes/storage/companies";
import DataModel from "models/data.model";


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
