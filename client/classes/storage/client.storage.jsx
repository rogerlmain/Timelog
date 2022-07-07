import CompanyStorage from "classes/storage/company.storage";
import LocalStorage from "classes/local.storage";

import ClientModel from "client/classes/models/client.model";

import { stores } from "classes/types/constants";
import { isset, not_set, not_empty, nested_value, nulled } from "classes/common";


const store_name = stores.clients;


export default class ClientStorage extends LocalStorage {


	static #set = values => { LocalStorage.set_store (store_name, values) }


	static #set_client = (company_id, client) => {

		let values = LocalStorage.get_all (store_name);
		let items = nested_value (values, company_id);
		let value = isset (items) ? items.find (item => item.client_id == client.client_id) : null;

		if (not_set (values)) values = {};
		if (not_set (values [company_id])) values [company_id] = new Array ();

		if (isset (value)) values [company_id].remove (value);
		values [company_id].push (client); 

		ClientStorage.#set (values);

	}/* set_client */;


	/********/


	static save_client = (company_id, form_data) => {
		return new Promise ((resolve, reject) => {
			ClientModel.save_client (form_data).then (data => {
				this.#set_client (company_id, data);
				resolve (data);
			}).catch (reject);
		});
	}/* save_client */;


	static remove_client (client_id) {

		let values = LocalStorage.get_all (store_name);

alert ("fix this!");
puke ();

		if (isset (values)) {
			let value = values.find (candidate => candidate.client_id == client_id);
			return LocalStorage.set_store (store_name, values.remove (value));
		}// if;

	}// remove_client;


	/********/


	static get_by_company = (company_id) => { 

		let store = LocalStorage.get_all (store_name);
		let result = nested_value (store, company_id);

		if (isset (result)) return result;

		return new Promise ((resolve, reject) => {
			ClientModel.fetch_by_company (company_id).then (data => {
				if (not_empty (data)) ClientStorage.#set ({ ...LocalStorage.get_all (store_name), [company_id]: data });
				resolve (data);
			}).catch (reject);
		});
		
	}/* get_by_company */;


	static get_by_id = client_id => {
		return new Promise ((resolve, reject) => {

			let store = LocalStorage.get_all (store_name);

			for (let company_id of Object.keys (store)) {
				let client = nested_value (store, company_id, "find", item => { return item.client_id == client_id });
				if (isset (client)) return resolve (client);
			}// for;

			ClientModel.fetch_by_id (client_id).then (client => {

				if (not_empty (client)) {
					if (not_set (store [company_id])) store [company_id] = [];
					store [company_id].push (client);
					LocalStorage.set (store_name, store);
				}// if;
				
				resolve (client);
			
			});

		});
	}/* get_by_id */;
	

	/********/


	static default_rate = async (client_id, new_rate = null) => {

		let result = null;

		if (isset (new_rate)) {
			client.default_rate = new_rate;
			ClientStorage.#set_client (CompanyStorage.active_company_id (), client);
			return;
		}// if;

		if (isset (client_id)) {
			let client = await ClientStorage.get_by_id (client_id);
			result = nulled (client.billing_rate);
		}// if;

		return result;

	}/* default_rate */


}// ClientStorage;