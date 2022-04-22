import Database from "classes/database";


export default class CompanyCardModel {

	static save_card (data) {
		data.append ("action", "save");
		return Database.save_data ("company_cards", data);
	}// save_company;
	
}// CompanyCardModel;