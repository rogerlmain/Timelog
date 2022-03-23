import LocalStorage from "classes/local.storage"

import { credential_types } from "types/globals";


const storage_locker = "credentials";


export default class Credentials extends LocalStorage {


	static get (name) { return LocalStorage.get (storage_locker, name) }
	static all () { return LocalStorage.get_all (storage_locker) }


	static set (name, value) {

		// fetch: save and update

	}// set;

	
	static account_id = () => { return Credentials.get (credential_types.account_id ) }
	static first_name = () => { return Credentials.get (credential_types.first_name) }
	static last_name = () => { return Credentials.get (credential_types.last_name) }
	static username = () => { return Credentials.get (credential_types.username) }
	static company_id = () => { return Credentials.get (credential_types.company_id ) }
	static square_id = ()  => { return Credentials.get (credential_types.square_id ) }


}// Credentials;