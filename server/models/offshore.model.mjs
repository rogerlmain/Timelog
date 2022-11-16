import https from "https";
import Database from "../database.mjs";


export default class OffshoreModel {


	static save_offshore_token = data => {

		let parameters = {
			company_id: data.company_id,
			offshore_type: data.repository_type,
			offshore_token: data.offshore_token
		}/* parameters */;

		new Database ().execute_query ("save_offshore_token", parameters);

	}/* save_offshore_token */;


	static get_offshore_data = (url, options) => {
		https.get (`${url}`, options, result => {

			let data = blank;
				
			result.on ("data", chunk => data += chunk);

			result.on ("end", () => { 
				let blah = JSON.parse (data);
				global.response ().send (data);
			});

		}).on ("error", error => console.log ("Error: " + error.message));
	}/* get_offshore_data */;
	

}// OffshoreModel;
