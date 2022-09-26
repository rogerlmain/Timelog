import Database from "client/classes/database";

import DataModel from "client/classes/models/data.model";
import LocalStorage from "client/classes/local.storage";

import AccountStorage from "client/classes/storage/account.storage";

import { not_set } from "client/classes/common";


const table = "invitations";


export default class InvitationModel extends DataModel {


	static response = null;


	static fetch_all (force = false) {
		
		if (not_set (this.response) || force) this.response = Database.fetch_data (table, {
			action: "all",
			email_address: AccountStorage.email_address (),
		});

		return this.response;

	}// fetch_all;


	static respond = (response, invite_id) => {

		let result = Database.fetch_data (table, {
			action:		response,
			invite_id:	invite_id
		}).then (() => LocalStorage.remove_store ("invitation"));

		return result;

	}/* respond */;


}// InvitationModel;