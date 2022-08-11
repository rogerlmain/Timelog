import Database from "../database.mjs";


export default class LookupsModel extends Database {


	get_lookups_by_category (category_id) { 
		let parameters = [category_id];
		this.execute_query ("get_lookups_by_category", parameters);
	 }/* get_options_by_company */;


}/* LookupsModel */;
