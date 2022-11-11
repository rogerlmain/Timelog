import Database from "client/classes/database";

import DataModel from "client/classes/models/data.model";
import LocalStorage from "client/classes/local.storage";

import AccountStorage from "client/classes/storage/account.storage";

import { is_null, not_set } from "client/classes/common";


const table = "invitations";


export default class InvitationsModel extends DataModel {


	static response = null;


	static get_all (force = false) {
		
		if (not_set (this.response) || force) this.response = Database.fetch_data (table, {
			action: "all",
			email_address: AccountStorage.email_address (),
		});

		return this.response;

	}// get_all;


	static get_by_id = invitation_id => new Promise ((resolve, reject) => {

		if (is_null (invitation_id)) return resolve (null);

		let parameters = new FormData ();

		parameters.set ("action", "id");
		parameters.set ("id", invitation_id);

		Database.fetch_data (table, parameters).then (result => resolve (result?.[0])).catch (reject);

	})// get_by_id;


	static respond = (response, invite_id) => {

		let result = Database.fetch_data (table, {
			action:		response,
			invite_id:	invite_id
		}).then (() => LocalStorage.remove_store ("invitation"));

		return result;

	}/* respond */;


}// InvitationsModel;