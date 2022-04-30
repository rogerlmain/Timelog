import Database from "classes/database";


const handler = "company_cards";


export default class CompanyCardModel {


	static get_cards (company_id) {
		let data = FormData.fromObject ({
			action: "get",
			company_id: company_id
		});
		return Database.fetch_data (handler, data);
	}// get_cards;


	static save_card (data) {
		data.append ("action", "save");
		return Database.save_data (handler, data);
	}// save_company;

	
}// CompanyCardModel;