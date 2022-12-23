import CompanyStorage from "client/classes/storage/company.storage";
import LocalStorage from "client/classes/local.storage";

import ClientModel from "client/classes/models/client.model";
import OffshoreModel from "../models/offshore.model";

import { stores } from "client/classes/types/constants";
import { isset, not_set, nulled, live, is_null } from "client/classes/common";


const store_name = stores.clients;


export const default_name = "Default client";
export const default_description = `${default_name} description`;


export default class ClientStorage extends LocalStorage {


	static #get = () => LocalStorage.get_store (store_name);
	static #set = values => LocalStorage.set_store (store_name, values);


	static #set_client_by_id = (client_id, data) => {

		let clients = this.#get ();
		let company_id = CompanyStorage.active_company_id ();

		if (not_set (clients)) clients = {};
		if (not_set (clients [company_id])) clients [company_id] = {};

		clients [company_id][client_id] = data;

		ClientStorage.#set (clients);

	}/* #set_client_by_id */;


	static #set_client = client => {

		let client_id = client.client_id ?? client.id;

		if (live ()) {
			delete client.company_id;
			delete client.client_id;
			delete client.id;
		}// if;

		ClientStorage.#set_client_by_id (client_id, client);
		return client;

	}/* #set_client */;


	/********/


	static remove_client (client_id) {

		let values = this.#get ();

alert ("fix this!");
puke ();

		if (isset (values)) {
			let value = values.find (candidate => candidate.client_id == client_id);
			return ClientStorage.#set (store_name, values.remove (value));
		}// if;

	}// remove_client;


	static save_client = client_data => new Promise ((resolve, reject) => ClientModel.save_client (client_data).then (data => {
		ClientStorage.#set_client (data);
		resolve (data);
	}).catch (reject));


	static get_by_company = (company_id, include_offshore_accounts = true) => {
		return new Promise ((resolve, reject) => {

			let store = this.#get ();
			let result = null;

			const add_client = client => {
				this.#set_client (client);
				if (is_null (result)) result = new Array ();
				result.push (client);
			}/* add_client */;

	
			const selected_set = items => {

				if (!include_offshore_accounts) Object.keys (items)?.forEach (key => {
					if (isset (items [key]?.type)) delete items [key];
				});

				return items;

			}/* selected_set */;


			if (isset (store?.[company_id])) return resolve (selected_set (store [company_id]));
	
			ClientModel.get_by_company (company_id).then (data => {

				data.forEach (item => add_client (item));

				if (include_offshore_accounts) return OffshoreModel.get_repositories ().then (repositories => {
					repositories?.forEach (repository => add_client (repository));
					resolve (selected_set (result));
				});

				resolve (this.#get ())

			}).catch (reject);

		});
	}/* get_by_company */;


	static get_by_id = client_id => {
		return new Promise ((resolve, reject) => {

			if (not_set (client_id)) return resolve (null);

			let store = this.#get ();
			let client = store?.[CompanyStorage.active_company_id ()][client_id];

			if (isset (client)) return resolve (client);

			ClientModel.get_by_id (client_id).then (client => {
				ClientStorage.#set_client (client);
				resolve (client);
			}).catch (reject);

		});
	}/* get_by_id */;
	

	/********/


	static client_rate = async (client_id, new_rate = null) => {

		let result = null;

		if (isset (new_rate)) {
			client.default_rate = new_rate;
			ClientStorage.#set (CompanyStorage.active_company_id (), client);
			return;
		}// if;

		if (isset (client_id)) {
			let client = await ClientStorage.get_by_id (client_id);
			result = nulled (client.billing_rate);
		}// if;

		return result;

	}/* client_rate */


}// ClientStorage;