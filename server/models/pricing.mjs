import Database from "../database.mjs";


export default class PricingData extends Database {

	
	get_pricing_by_option (option, value) {

		let procedure = "get_pricing_by_option";
		let parameters = [option, value];

		this.execute_query (procedure, parameters);

	}/* get_pricing_by_id */;


}/* PricingData */;