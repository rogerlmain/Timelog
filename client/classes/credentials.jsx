import LocalStorage from "classes/local.storage"


const storage_locker = "credentials";


export default class Credentials extends LocalStorage {


	static get (name) { return LocalStorage.get (storage_locker, name) }
	static all () { return LocalStorage.get_all (storage_locker) }


	static set (name, value) {

		// fetch: save and update

	}// set;

	
	static account_id = () => { return Credentials.get ("account_id" ) }
	static company_id = () => { return Credentials.get ("company_id" ) }
	static first_name = () => { return Credentials.get ("first_name") }
	static last_name = () => { return Credentials.get ("last_name") }
	static username = () => { return Credentials.get ("username") }


}// Credentials;