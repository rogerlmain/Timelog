import LocalStorage from "client/classes/local.storage"

import AccountsModel from "client/classes/models/accounts.model";

import { credential_fields } from "client/classes/types/constants";
import { isset, not_set } from "client/classes/common";


const store_name = "credentials";


export default class AccountStorage extends LocalStorage {


	static #get (name) { return LocalStorage.get (store_name, name) }


	/********/


	static get_store = () => LocalStorage.get_store (store_name);
	static set_store = credentials => LocalStorage.set_store (store_name, credentials);


	/********/


	static signed_in = () => { return isset (AccountStorage.get_store ()) }

	
	static account_id = () => { return AccountStorage.#get (credential_fields.account_id) }

	static first_name = () => { return AccountStorage.#get (credential_fields.first_name) }
	static last_name = () => { return AccountStorage.#get (credential_fields.last_name) }

	static full_name = () => { return `${AccountStorage.first_name ()} ${AccountStorage.last_name ()}` }
	static friendly_name = () => { return AccountStorage.#get (credential_fields.friendly_name) }

	static email_address = () => { return AccountStorage.#get (credential_fields.email_address) }

	static avatar = () => { return AccountStorage.#get (credential_fields.avatar) }


	static save_account = form_data => new Promise ((resolve, reject) => AccountsModel.save_account (form_data).then (response => {

		let account = { ...form_data.toObject (), account_id: response.account_id };

		if (not_set (response?.account_id)) return reject (response);

		this.set_store (account);
		resolve (account);
		
	}));


}// AccountStorage;