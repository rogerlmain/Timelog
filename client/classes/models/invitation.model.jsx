import Database from "classes/database";
import DataModel from "client/classes/models/data.model";

import AccountStorage from "client/classes/storage/account.storage";

import * as common from "classes/common";


export default class InvitationModel extends DataModel {


	static fetch_all () { 
		return Database.fetch_data ("invitations", {
			action: "all",
			email_address: AccountStorage.email_address (),
		})
	}// fetch_all;


}// InvitationModel;