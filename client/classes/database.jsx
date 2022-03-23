import Credentials from "client/classes/storage/credentials";
import { isset, is_empty } from "classes/common";


export default class Database {


	static async fetch_data (name, parameters) {

		let fetch_parameters = null;

		if (!(parameters instanceof FormData)) throw "Invalid data passed to Database.fetch_data";

		parameters.set ("account_id", Credentials.account_id ());
		
		fetch_parameters = {
			method: "post",
			credentials: "same-origin",
			body: parameters
		}// fetch_parameters;

		return fetch (`/${name}`, fetch_parameters).then (response => response.json ()).then (response => { return response }).catch (error => {
			alert (error);
			return null;
 		});

	}// fetch_data;


	static fetch_row (name, parameters) {
		return new Promise ((resolve, reject) => {
			Database.fetch_data (name, parameters).then ((data) => {
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
				alert (error);	
				reject (error);
			});
		});
	}// save_data;


}// database;