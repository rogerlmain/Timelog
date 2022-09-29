import LocalStorage from "client/classes/local.storage"

import AccountsModel from "../models/accounts.model";

import { credential_fields } from "client/classes/types/constants";
import { not_set } from "client/classes/common";


const store_name = "credentials";


export default class AccountStorage extends LocalStorage {


	static #set_all (credentials) { LocalStorage.set_store (store_name, credentials) }


	/********/

	
	static get (name) { return LocalStorage.get (store_name, name) }
	static get_all () { return LocalStorage.get_all (store_name) }

	static account_id = () => { return AccountStorage.get (credential_fields.account_id) }

	static first_name = () => { return AccountStorage.get (credential_fields.first_name) }
	static last_name = () => { return AccountStorage.get (credential_fields.last_name) }

	static full_name = () => { return `${AccountStorage.first_name ()} ${AccountStorage.last_name ()}` }
	static friendly_name = () => { return AccountStorage.get (credential_fields.friendly_name) }

	static email_address = () => { return AccountStorage.get (credential_fields.email_address) }

	static avatar = () => { return AccountStorage.get (credential_fields.avatar) }


	static save_account = data => new Promise ((resolve, reject) => AccountsModel.save_account (data).then (response => {

		let account = { ...data.toObject (), account_id: response.account_id };

		if (not_set (response?.account_id)) return reject (response);

		this.#set_all (account);
		resolve (account);
		
	}));


}// AccountStorage;