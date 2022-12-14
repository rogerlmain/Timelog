import Database from "client/classes/database";
import DataModel from "client/classes/models/data.model";


const table = "email";


export default class EmailModel extends DataModel {


	static send_invite (data) { 
		data.append ("action", "invite");
		return Database.fetch_data (table, data);
	}// send_invite;


}// EmailModel;