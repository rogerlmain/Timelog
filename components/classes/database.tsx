import * as common from "components/classes/common";
import * as constants from "components/types/constants";


export class Database {


	public static fetch_data (view: string, parameters: any, callback: any) {
		fetch (`${view [0] == "/" ? constants.empty : "/"}${view}`, {
			method: "post",
			body: parameters
		}).then (response => response.text ()).then (data_string => {
			let data = (common.is_empty (data_string) ? null : JSON.parse (data_string));
			callback ((Array.isArray (data) && (data.length == 0)) ? null : data);
		});
	}// fetch_data;


	protected fetch_item (view: string, parameters: any, callback: any) {
		fetch (`/${view}`, {
			method: "post",
			body: parameters
		}).then (response => response.json ()).then (data => {
			if (data.length > 0) callback (data [0]);
		});
	}// fetch_item;


	// TEMPORARY - SET TO protected WHEN ALL ITEMS ARE IN MODELS CLASSES
	public fetch_items (view: any, parameters: any, callback: any = null) {

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

		fetch (`/${view}`, fetch_parameters).then (response => {
			return response.json ()
		}). then (callback);
	}// fetch_items;


	protected save_data (tablename: string, data: FormData, callback: any) {
		fetch (`/${tablename}`, {
			method: "POST",
			body: data,
			credentials: "same-origin"
		}).then (response => response.json ()).then (data => callback);
	}// save_data;


}// database;