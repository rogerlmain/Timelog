import LocalStorage from "client/classes/local.storage"


export default class Credentials extends LocalStorage {


	static get (name) { return LocalStorage.get ("credentials", name) }


	static set (name, value) {

		// fetch: save and update

	}// set;

	
	static account_id = () => { return Credentials.get ("account_id" ) }
	static company_id = () => { return Credentials.get ("company_id" ) }
	static username = () => { return Credentials.get ("username") }


}// Credentials;