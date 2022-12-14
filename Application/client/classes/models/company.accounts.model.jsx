import Database from "client/classes/database";


const table = "company_accounts";


export default class CompanyAccountsModel {

	static save_company_account (data) {
		data.append ("action", "save");
		return Database.save_data (table, data);
	}// save_company_account;


}// CompanyAccountsModel;