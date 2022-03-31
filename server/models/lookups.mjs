import Database from "../database.mjs";


export default class LookupsData extends Database {


	get_lookups_by_category (category_id) { 
		let parameters = [category_id];
		this.data_query ("get_lookups_by_category", parameters).then (data => {
			global.response.send (data);
			this.connection.end ();
		});
	 }/* get_options_by_company */;


}/* OptionsData */;
