import ActivityLog from "client/classes/activity.log";
import AccountStorage from "client/classes/storage/account.storage";

import { isset, not_null, not_set } from "client/classes/common";


export default class Database {


	static async fetch_data (name, form_data) {

		let fetch_parameters = null;
		let account_id = AccountStorage.account_id ();

		if (!(form_data instanceof FormData)) {
			if (!(form_data instanceof Object )) throw "Database.fetch_data form_data requires an object or a FormData element";
			form_data = FormData.fromObject (form_data);
		}// if;

		if ((!form_data.has ("account_id")) && not_null (account_id)) form_data.set ("account_id", account_id);
		
		fetch_parameters = {
			method: "post",
			credentials: "same-origin",
			body: form_data
		}// fetch_parameters;

		return new Promise ((resolve, reject) => fetch (`/${name}`, fetch_parameters).then (response => response.text ()).then (text => {
			try {

				/* Keep commented code - used for testing database lag */
				// return setTimeout (() => 
					resolve (JSON.parse (text))
				// , 3000);

			} catch (message) { 
				reject ({ error: message });
			}// try;
		}).catch (error => reject (error)));

	}// fetch_data;


	static fetch_row (name, parameters) {
		return new Promise ((resolve, reject) => {
			Database.fetch_data (name, parameters).then (data => {
				resolve (Array.isArray (data) && (data.length >= 1) ? data [0] : data);
			}).catch (reject);
		});
	}// fetch_row;


	// For semantic clarification - fetch_row saves but doesn't sound like it
	static save_row = Database.fetch_row; 


	static save_data (name, data) {
		return new Promise ((resolve, reject) => {

			const log_error = error => {
				ActivityLog.log_error (error);
				reject (error);
			}// log_error;

			Database.fetch_row (name, data).then (response => {

				if (not_set (response)) throw "save_data: no result returned";
				if (isset (response.errno)) throw (response);
				
				resolve (response);
				
			}).catch (log_error);

		});
	}// save_data;


}// database;