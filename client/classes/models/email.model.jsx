import Database from "classes/database";
import DataModel from "client/classes/models/data.model";

import AccountStorage from "client/classes/storage/account.storage";

import * as common from "classes/common";


export default class EmailModel extends DataModel {


	static send_invite (data) { 
		data.append ("action", "invite");
		return Database.fetch_data ("email", data);
	}// send_invite;


}// EmailModel;