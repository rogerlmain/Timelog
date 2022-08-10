import Database from "classes/database";
import DataModel from "client/classes/models/data.model";


const table = "lookups";


export default class LookupsModel extends DataModel {


	static async get_countries () {
		let parameters = new FormData ();
		parameters.set ("action", "get_countries");
		return Database.fetch_data (table, parameters);
	}// get_countries;


	static async get_districts () {
		let parameters = new FormData ();
		parameters.set ("action", "get_districts");
		return Database.fetch_data (table, parameters);
	}// get_countries;


}// LookupsModel;
