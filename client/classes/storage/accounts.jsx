import LocalStorage from "classes/local.storage"

import { credential_types } from "client/classes/types/constants";
import { isset } from "classes/common";


const storage_locker = "credentials";


export default class Accounts extends LocalStorage {


	static get (name) { return LocalStorage.get (storage_locker, name) }
	static all () { return LocalStorage.get_all (storage_locker) }


	static set (name, value) {
		let credentials = this.all ();
		credentials [name] = value;
		LocalStorage.set (storage_locker, credentials);
	}// set;

	
	static account_id = () => { return Accounts.get (credential_types.account_id ) }
	static first_name = () => { return Accounts.get (credential_types.first_name) }
	static last_name = () => { return Accounts.get (credential_types.last_name) }
	static username = () => { return Accounts.get (credential_types.username) }
	static square_id = ()  => { return Accounts.get (credential_types.square_id ) }

	static paid_account = () => { return isset (this.square_id ()) }


}// Accounts;