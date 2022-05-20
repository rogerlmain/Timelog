import LocalStorage from "classes/local.storage"

import { credential_types } from "client/classes/types/constants";


const storage_locker = "credentials";


export default class AccountStorage extends LocalStorage {


	static get (name) { return LocalStorage.get (storage_locker, name) }
	static get_all () { return LocalStorage.get_all (storage_locker) }

	static set_all (credentials) { LocalStorage.set_store (storage_locker, credentials) }
	
	static account_id = () => { let result = AccountStorage.get (credential_types.account_id); return result; }

	static first_name = () => { return AccountStorage.get (credential_types.first_name) }
	static last_name = () => { return AccountStorage.get (credential_types.last_name) }

	static full_name = () => { return `${AccountStorage.first_name ()} ${AccountStorage.last_name ()}` }
	static username = () => { return AccountStorage.get (credential_types.username) }

	static email_address = () => { return AccountStorage.get (credential_types.email_address) }


}// AccountStorage;