import CompanyStorage from "client/classes/storage/company.storage";
import LocalStorage from "client/classes/local.storage";

import ClientModel from "client/classes/models/client.model";

import { stores } from "client/classes/types/constants";
import { isset, not_set, not_empty, nested_value, nulled } from "client/classes/common";


const store_name = stores.clients;


export const default_name = "Default client";
export const default_description = `${default_name} description`;


export default class ClientStorage extends LocalStorage {


	static #set = values => { LocalStorage.set_store (store_name, values) }


	static #set_all = (company_id, client) => {

		let values = LocalStorage.get_all (store_name);
		let items = nested_value (values, company_id);
		let value = isset (items) ? items.find (item => item.client_id == client.client_id) : null;

		if (not_set (values)) values = {};
		if (not_set (values [company_id])) values [company_id] = [];

		if (isset (value)) values [company_id].remove (value);
		values [company_id].push (client); 

		ClientStorage.#set (values);

	}/* set_client */;


	/********/


	static remove_client (client_id) {

		let values = LocalStorage.get_all (store_name);

alert ("fix this!");
puke ();

		if (isset (values)) {
			let value = values.find (candidate => candidate.client_id == client_id);
			return ClientStorage.#set (store_name, values.remove (value));
		}// if;

	}// remove_client;


	static save_client = (client_data) => new Promise ((resolve, reject) => ClientModel.save_client (client_data).then (data => {
		ClientStorage.#set_all (client_data.get ("company_id"), data);
		resolve (data);
	}).catch (reject));


	static get_by_company = (company_id) => { 
		return new Promise ((resolve, reject) => {

			let store = LocalStorage.get_all (store_name);
	
			if (isset (store?.[company_id])) return resolve (store [company_id]);
	
			ClientModel.fetch_by_company (company_id).then (data => {
				if (not_empty (data)) ClientStorage.#set ({ ...LocalStorage.get_all (store_name), [company_id]: data });
				resolve (data);
			}).catch (reject);

		});
	}/* get_by_company */;


	static get_by_id = client_id => {
		return new Promise ((resolve, reject) => {

			let store = LocalStorage.get_all (store_name);

			if (isset (store)) for (let company_id of Object.keys (store)) {
				let client = nested_value (store, company_id, "find", item => { return item.client_id == client_id });
				if (isset (client)) return resolve (client);
			}// for;

			ClientModel.fetch_by_id (client_id).then (client => {
				ClientStorage.#set_all (CompanyStorage.active_company_id (), client);
				resolve (client);
			}).catch (reject);

		});
	}/* get_by_id */;
	

	/********/


	static client_rate = async (client_id, new_rate = null) => {

		let result = null;

		if (isset (new_rate)) {
			client.default_rate = new_rate;
			ClientStorage.#set_all (CompanyStorage.active_company_id (), client);
			return;
		}// if;

		if (isset (client_id)) {
			let client = await ClientStorage.get_by_id (client_id);
			result = nulled (client.billing_rate);
		}// if;

		return result;

	}/* client_rate */


}// ClientStorage;