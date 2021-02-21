import * as common from "components/classes/common";
import * as constants from "components/types/constants";


export default class Database {


	public static fetch_rows (name: string, parameters: any, callback: any) {

		let form_data = (parameters instanceof FormData);

		let fetch_parameters: RequestInit = {
			method: "post",
			credentials: "same-origin",
			body: form_data ? parameters : JSON.stringify (parameters)
		}// fetch_parameters;

		if (!form_data) fetch_parameters ["headers"] = {
			"Accept": "application/json",
			"Content-Type": "application/json"
		}// if;

		fetch (`/${name}`, fetch_parameters).then (response => {
			return response.json ()
		}). then (callback);

	}// fetch_rows;


	public static fetch_row (name: string, parameters: any, callback: any) {
		Database.fetch_rows (name, parameters, (data: any) => {
			callback (Array.isArray (data) && (data.length >= 1) ? data [0] : data);
		});
	}// fetch_row;


	// TODO: REFACTOR TO USE fetch_rows
	public static fetch_data (name: string, parameters: any, callback: any) {
		fetch (`${name [0] == "/" ? constants.empty : "/"}${name}`, {
			method: "post",
			body: parameters
		}).then (response => response.text ()).then (data_string => {
			let data = (common.is_empty (data_string) ? null : JSON.parse (data_string));
			callback ((Array.isArray (data) && (data.length == 0)) ? null : data);
		});
	}// fetch_data;


	public static save_data (name: string, parameters: FormData, callback: any) {
		Database.fetch_row (name, parameters, callback);
	}// save_data;


}// database;