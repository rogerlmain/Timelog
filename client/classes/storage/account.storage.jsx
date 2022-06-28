import LocalStorage from "classes/local.storage"

import { credential_fields } from "client/classes/types/constants";


const storage_locker = "credentials";


export default class AccountStorage extends LocalStorage {


	static get (name) { return LocalStorage.get (storage_locker, name) }
	static get_all () { return LocalStorage.get_all (storage_locker) }

	static set_all (credentials) { LocalStorage.set_store (storage_locker, credentials) }
	
	static account_id = () => { return AccountStorage.get (credential_fields.account_id) }

	static first_name = () => { return AccountStorage.get (credential_fields.first_name) }
	static last_name = () => { return AccountStorage.get (credential_fields.last_name) }

	static full_name = () => { return `${AccountStorage.first_name ()} ${AccountStorage.last_name ()}` }
	static friendly_name = () => { return AccountStorage.get (credential_fields.friendly_name) }

	static email_address = () => { return AccountStorage.get (credential_fields.email_address) }


}// AccountStorage;