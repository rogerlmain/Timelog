import Database from "client/classes/database";

import DataModel from "client/classes/models/data.model";
import LocalStorage from "client/classes/local.storage";

import AccountStorage from "client/classes/storage/account.storage";


const table = "invitations";


export default class InvitationModel extends DataModel {


	static fetch_all () { 

		let result = Database.fetch_data (table, {
			action: "all",
			email_address: AccountStorage.email_address (),
		});

		return result;
		
	}// fetch_all;


	static respond = (response, invite_id) => {

		let result = Database.fetch_data (table, {
			action:		response,
			invite_id:	invite_id
		}).then (() => LocalStorage.remove_store ("invitation"));

		return result;

	}/* respond */;


}// InvitationModel;