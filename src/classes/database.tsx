import * as common from "classes/common";


export default class Database {


	public static async fetch_data (name: string, parameters: any): Promise<Object> {

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

		return fetch (`/${name}`, fetch_parameters).then (response => {
			return response.json ()
		});

	}// fetch_data;


	public static fetch_row (name: string, parameters: any): Promise<Object> {
		return new Promise ((resolve, reject) => {
			Database.fetch_data (name, parameters).then ((data: any) => {
				resolve (Array.isArray (data) && (data.length >= 1) ? data [0] : data);
			}).catch (reject);
		});
	}// fetch_row;


	public static save_data (name: string, data: FormData): Promise<number> {
		return new Promise ((resolve, reject) => {
			Database.fetch_row (name, data).then (row => {
				let result = ((Array.isArray (row) && (row.length > 0)) ? row [0] : null);
				if (common.isset (result)) return resolve (result);
				reject ("save_data: no result returned");
			}).catch (reject);
		});
	}// save_data;


}// database;