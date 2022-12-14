import Database from "../database.mjs";


export default class CompanyCardModel extends Database {


	get_company_cards = (company_id) => {
		this.execute_query ("get_company_cards", { company_id: company_id });
	}// get_company_cards;


	save_company_card = (data) => {

		let parameters = {
			company_id: global.integer_value (data.company_id),
			last_few: global.integer_value (data.last_few),
			expiration: global.integer_value (data.expiration),
			card_type: data.card_type,
			square_id: data.square_id,
		}// parameters;

		this.execute_query ("save_company_card", parameters);

	}// save_company_card;



}// CompanyCardModel;

