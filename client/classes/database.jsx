import ActivityLog from "client/classes/activity.log";
import AccountStorage from "client/classes/storage/account.storage";

import { is_empty, isset, not_null, is_function } from "classes/common";


export default class Database {


	static async fetch_data (name, form_data, callback = null) {

		let fetch_parameters = null;
		let account_id = AccountStorage.account_id ();

		if (!(form_data instanceof FormData)) {
			if (!(form_data instanceof Object )) throw "Database.fetch_data form_data requires an object or a FormData element";
			form_data = new FormData ().appendAll (form_data);
		}// if;

		if (not_null (account_id)) form_data.set ("account_id", account_id);
		
		fetch_parameters = {
			method: "post",
			credentials: "same-origin",
			body: form_data
		}// fetch_parameters;

		return fetch (`/${name}`, fetch_parameters).then (response => response.json ());

	}// fetch_data;


	static fetch_row (name, parameters) {
		return new Promise ((resolve, reject) => {
			Database.fetch_data (name, parameters).then (data => {
				resolve (Array.isArray (data) && (data.length >= 1) ? data [0] : data);
			}).catch (reject);
		});
	}// fetch_row;


	static save_data (name, data) {
		return new Promise ((resolve, reject) => {
			Database.fetch_row (name, data).then (response => {
				if (isset (response)) return resolve (response);
				throw "save_data: no result returned";
			}).catch (error => {
				ActivityLog.log_error (error);	
				reject (error);
			});
		});
	}// save_data;


}// database;