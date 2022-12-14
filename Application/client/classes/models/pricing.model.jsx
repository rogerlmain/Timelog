import Database from "client/classes/database";
import DataModel from "client/classes/models/data.model";


const table = "pricing";


export default class PricingModel extends DataModel {


	static load_price (option, value) {
		let parameters = new FormData ();
		parameters.set ("action", "get");
		parameters.set ("option", option);
		parameters.set ("value", value);
		return Database.fetch_data (table, parameters);
	}// load_price;


}// PricingModel;
