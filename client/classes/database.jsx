import { isset, is_empty } from "classes/common";


export default class Database {


	static async fetch_data (name, parameters) {

		let form_data = (parameters instanceof FormData);

		let fetch_parameters = {
			method: "post",
			credentials: "same-origin",
			body: form_data ? parameters : JSON.stringify (parameters)
		}// fetch_parameters;

		if (!form_data) fetch_parameters ["headers"] = {
			"Accept": "application/json",
			"Content-Type": "application/json"
		}// if;

		return fetch (`/${name}`, fetch_parameters).then (async response => {
			let result = null;
			let text = await response.text ();
			if (is_empty (text)) return null;
			result = JSON.parse (text);
			return result;
		}).catch (error => {
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