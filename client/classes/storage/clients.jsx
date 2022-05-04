import * as constants from "classes/types/constants";
import * as common from "classes/common";

import LocalStorage from "classes/local.storage"
import ClientsModel from "models/clients";

import { isset, not_set } from "classes/common";

const store_name = constants.stores.clients;


export default class Clients extends LocalStorage {


	static set_client (client) {

		let values = LocalStorage.get_all (store_name);

		if (isset (values)) {
			let value = values.find (candidate => candidate.client_id == client.client_id);
			return LocalStorage.set_store (store_name, values.remove (value).concat ([client]));
		}// if;

		LocalStorage.set_store (store_name, [client]);

	}// set_client;


	static set (values) { super.set_store (store_name, values) }


	/********/


	static get_all = (company_id) => { 
		return new Promise ((resolve, reject) => {
			let result = LocalStorage.get_all (store_name);
			if (isset (result)) return resolve (result);
			ClientsModel.fetch_by_company (company_id).then (data => {
				if (common.not_empty (data)) Clients.set (data);
				resolve (data);
			}).catch (reject);
		});
	}// get_all;


}// Clients;