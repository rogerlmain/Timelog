import LocalStorage from "classes/local.storage"
import ClientModel from "models/client.model";

import { stores } from "classes/types/constants";
import { isset, not_set, not_empty, nested_value } from "classes/common";


const store_name = stores.clients;


export default class ClientStorage extends LocalStorage {


	static set (values) { LocalStorage.set_store (store_name, values) }


	static set_client (company_id, client) {

		let values = LocalStorage.get_all (store_name);
		let items = nested_value (values, company_id);
		let value = isset (items) ? items.find (item => item.client_id == client.client_id) : null;

		if (not_set (values)) values = {};
		if (not_set (values [company_id])) values [company_id] = new Array ();

		if (isset (value)) values [company_id].remove (value);
		values [company_id].push (client); 

		ClientStorage.set (values);

	}// set_client;


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

		return new Promise ((resolve, reject) => {

			let store = LocalStorage.get_all (store_name);
			let result = nested_value (store, company_id);

			if (isset (result)) return resolve (result);

			ClientModel.fetch_by_company (company_id).then (data => {
				if (not_empty (data)) ClientStorage.set ({ ...LocalStorage.get_all (store_name), [company_id]: data });
				resolve (data);
			}).catch (reject);

		});

	}// get_all;


}// ClientStorage;