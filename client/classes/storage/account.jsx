import LocalStorage from "classes/local.storage"

import { credential_types } from "client/classes/types/constants";
import { isset } from "classes/common";


const storage_locker = "credentials";


export default class Account extends LocalStorage {


	static get (name) { return LocalStorage.get (storage_locker, name) }
	static get_all () { return LocalStorage.get_all (storage_locker) }

	static set_all (credentials) { LocalStorage.set_store (storage_locker, credentials) }
	
	static account_id = () => { let result = Account.get (credential_types.account_id); return result; }

	static first_name = () => { return Account.get (credential_types.first_name) }
	static last_name = () => { return Account.get (credential_types.last_name) }

	static full_name = () => { return `${Account.first_name ()} ${Account.last_name ()}` }
	static username = () => { return Account.get (credential_types.username) }

	static email_address = () => { return Account.get (credential_types.email_address) }


}// Account;