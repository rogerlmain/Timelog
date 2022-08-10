import Database from "classes/database";

import DataModel from "client/classes/models/data.model";
import LocalStorage from "client/classes/local.storage";

import AccountStorage from "client/classes/storage/account.storage";


const table = "invitations";


export default class InvitationModel extends DataModel {


	static respond = (response, invite_id) => {
		return Database.fetch_data (table, {
			action:		response,
			invite_id:	invite_id
		}).then (() => LocalStorage.remove_store ("invitation"));
	}/* respond */;


	static fetch_all () { 
		return Database.fetch_data (table, {
			action: "all",
			email_address: AccountStorage.email_address (),
		});
	}// fetch_all;


}// InvitationModel;