import * as constants from "classes/types/constants";
import * as common from "classes/common";

import FormHandler from "classes/form.handler";

import AccountsModel from "models/accounts";
import AddressesModel from "models/addresses";
import CompaniesModel from "models/companies";
import CompanyAccountsModel from "models/company.accounts";
import CompanyCardModel from "models/company.cards";

import Account from "classes/storage/account";
import Companies from "classes/storage/companies";

import { v4 as uuid } from "uuid";


const transaction_id_field = "transaction_id";

const square_hostname = "connect.squareupsandbox.com";
const square_authorization = "EAAAENzB7zMQb2M5FW6MpbnIMXfvwLdonwGI9XxqtkwT86LvxuWpW4N_SyI67cjJ";

const customer_path	= "v2/customers";
const card_path 	= "v2/cards";
const payment_path	= "v2/payments";



export default class CustomerHandler {


	async save_address (data) {

		let address_data = {
			company_id: data.company_data.company_id,
			street_address: data.form_data.street_address,
			additional: data.form_data.additional_address,
			city: data.form_data.city,
			state_id: data.form_data.district,
			country_id: data.form_data.country,
			postcode: data.form_data.zip
		}// address_data;

		return { ...(await AddressesModel.save_address (FormData.fromObject (address_data))), ...address_data };

	}// save_address;


	async save_company (data) {

		let company_data = { primary_contact_id: Account.account_id () }

		if (common.isset (data.company_id)) company_data.company_id = data.company_id;
		if (common.isset (data.address_id)) company_data.address_id = data.address_id;
		if (common.isset (data.company_name)) company_data.name = data.company_name;
		if (common.isset (data.square_id)) company_data.square_id = data.square_id;

		return { ...(await CompaniesModel.save_company (FormData.fromObject (company_data))), ...company_data };

	}// save_company;


	async save_company_association (data) {
		await CompanyAccountsModel.save_company_account (FormData.fromObject ({
			account_id: Account.account_id (),
			company_id: data.company_id
		}));
	}// save_company_association;


	async save_card (data) {
		CompanyCardModel.save_card (FormData.fromObject ({
			company_id: data.company_data.company_id,
			last_few: data.credit_card.card.last_4,
			expiration: (parseInt (data.credit_card.card.exp_year) * 100) + parseInt (data.credit_card.card.exp_month),
			card_type: data.credit_card.card.card_brand.toLowerCase (),
			square_id: data.credit_card.card.id
		}));
	}// save_card;


	async save_customer (transaction_data) {

		return new Promise (async (resolve, reject) => {

			this.save_company ({ ...transaction_data.form_data, square_id: transaction_data.square_data.customer.id }).then (company_data => {

				transaction_data.company_data = company_data;

				if (transaction_data.keep_card) this.save_card (transaction_data);
				this.save_company_association (company_data);

				this.save_address (transaction_data).then (address_data => {

					this.save_company ({ // add the address ID
						company_id: company_data.company_id,
						address_id: address_data.address_id,
					});

					resolve ({
						company_data: company_data,
						address_data: address_data,
					});

				});

			});

		});

	}// save_customer;
	

}// PaymentHandler;