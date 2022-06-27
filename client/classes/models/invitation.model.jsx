import Database from "classes/database";
import DataModel from "client/classes/models/data.model";

import AccountStorage from "client/classes/storage/account.storage";

import * as common from "classes/common";


export default class InvitationModel extends DataModel {


	static fetch_all () {
		let parameters = new FormData ();
		parameters.set ("action", "all");
		parameters.set ("email_address", AccountStorage.email_address ());
		return Database.fetch_data ("invitations", parameters);
	}// fetch_all;


}// InvitationModel;