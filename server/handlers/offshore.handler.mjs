import https from "https";


export default class OffshoreHandler {


	static get_offshore_data = (url, options) => {
		https.get (`${url}`, options, result => {

			let data = blank;
				
			result.on ("data", chunk => data += chunk);
			result.on ("end", () => global.response ().send (data));

		}).on ("error", error => console.log ("Error: " + error.message));
	}/* get_offshore_data */;


	static get_accounts = () => {
//		...
	}


}// OffshoreHandler;
