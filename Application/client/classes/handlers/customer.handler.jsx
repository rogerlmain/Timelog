import * as constants from "client/classes/types/constants";
import * as common from "client/classes/common";

import AddressModel from "client/classes/models/address.model";
import CompanyModel from "client/classes/models/companies.model";
import CompanyAccountsModel from "client/classes/models/company.accounts.model";
import CompanyCardModel from "client/classes/models/company.cards.model";

import AccountStorage from "client/classes/storage/account.storage";
import CompanyStorage from "client/classes/storage/company.storage";


export default class CustomerHandler {


	async save_address (data) {

		let address_data = {
			company_id: data.company_id,
			street_address: data.street_address,
			additional: data.additional_address,
			city: data.city,
			state_id: data.district,
			country_id: data.country,
			postcode: data.zip
		}// address_data;

		return await AddressModel.save_address (FormData.fromObject (address_data));

	}// save_address;


	async save_company (data) {

		let company_data = { primary_contact_id: AccountStorage.account_id () }

		if (common.isset (data.company_id)) company_data.company_id = data.company_id;
		if (common.isset (data.address_id)) company_data.address_id = data.address_id;
		if (common.isset (data.company_name)) company_data.name = data.company_name;
		if (common.isset (data.customer_id)) company_data.square_id = data.customer_id;

		return { ...(await CompanyModel.save_company (FormData.fromObject (company_data))), ...company_data };

	}// save_company;


	async save_company_association (data) {
		await CompanyAccountsModel.save_company_account (FormData.fromObject ({
			account_id: AccountStorage.account_id (),
			company_id: data.company_id
		}));
	}// save_company_association;


	async save_card (company_id, card_data) {
		CompanyCardModel.save_card (FormData.fromObject ({
			company_id: company_id,
			last_few: card_data.last_4,
			expiration: (card_data.exp_year * 100) + card_data.exp_month,
			card_type: card_data.card_brand.toLowerCase (),
			square_id: card_data.id
		}));
	}// save_card;


	async save_customer (data) {

		return new Promise (async (resolve, reject) => {

			let company_data = await this.save_company (data);
			
			data.company_id = company_data.company_id;
			data.primary_contact_id = company_data.primary_contact_id;

			let address_data = await this.save_address (data);
			
			this.save_company_association (company_data);

			// Add the address ID
			this.save_company ({
				company_id: company_data.company_id,
				address_id: address_data.address_id,
			});


			CompanyStorage.add_companies (data);

			
			// CompanyStorage.set ({
			// 	active_company: data.company_id,
			// 	[data.company_id]: {
			// 		company_name: data.company_name,
			// 		address_id: address_data.address_id,
			// 		street_address: data.street_address,
			// 		additional: data.additional_address,
			// 		city: data.city,
			// 		state_id: data.district,
			// 		state_name: data.district_name,
			// 		country_id: data.country,
			// 		country_name: data.country_name,
			// 		postcode: data.zip,
			// 		square_id: data.customer_id,
			// 	}
			// });

			resolve ({
				company_data: company_data,
				address_data: address_data,
			});

			constants.globals.main.setState ({ company_id: company_data.company_id });

		});

	}// save_customer;
	

}// PaymentHandler;