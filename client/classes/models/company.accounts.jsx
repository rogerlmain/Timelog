import Database from "classes/database";


export default class CompanyAccountsModel {

	static save_company_account (data) {
		data.append ("action", "save");
		return Database.save_data ("company_accounts", data);
	}// save_company;
	
}// CompanyAccountsModel;