import * as constants from "classes/types/constants";
import * as common from "classes/common";

import AccountsModel from "models/accounts";
import AddressesModel from "models/addresses";
import CompaniesModel from "models/companies";
import CompanyAccountsModel from "models/company.accounts";

import Account from "classes/storage/account";
import Companies from "classes/storage/companies";

import { v4 as uuid } from "uuid";
import { add } from "date-fns";

const transaction_id_field = "transaction_id";

const square_hostname = "connect.squareupsandbox.com";

const customer_path	= "v2/customers";
const card_path 	= "v2/cards";



export default class PaymentHandler {


	state = { output: null }


	static extract_address (data) {
		return {
			address_line_1: form_data.street_address,
			address_line_2: form_data.additional_address,
			administrative_district_level_1: form_data.city,
			locality: form_data.district_name,
			postal_code: form_data.zip,
			country: form_data.country_name
		};
	}// extract_address;


	static send_square_request (path, data) {

		data.idempotency_key = localStorage.getItem (transaction_id_field);

		if (common.is_null (data.idempotency_key)) {
			data.idempotency_key = uuid ();
			localStorage.setItem (transaction_id_field, data.idempotency_key);
		}// if;

		return new Promise ((resolve, reject) => fetch (`https://${square_host}/${path}`, {
			method: "post",
			headers: {
				"Content-Type": "application/json",
				"Square-Version": "2022-03-16",
				"Authorization": "Bearer EAAAENzB7zMQb2M5FW6MpbnIMXfvwLdonwGI9XxqtkwT86LvxuWpW4N_SyI67cjJ"
			}/* headers */,
			body: JSON.stringify (data)
		}).then (response => response.json ()).then (response => resolve (response)).catch (error => reject (error)))

	}// send_square_request;


	static async save_square_account (data) {
//		return this.send_square_request (customer_path, {
//			given_name: account_data [constants.credential_types.first_name],
//			family_name: account_data [constants.credential_types.last_name],
//			company_name: form_data.company_name,
//			address: this.extract_address (data),
//			email_address: form_data [constants.credential_types.email_address],
//			phone_number: form_data.primary_phone
//		});

return new Promise ((resolve, reject) => resolve ({ customer: { id: "4RR7K1JTH4YX96B9K5DFR36ZMW" }}));

	}// save_square_account;


	static async save_address (data) {
		let address_data = {
			company_id: data.company_id,
			street_address: data.street_address,
			additional: data.additional_address,
			city: data.city,
			state_id: data.district,
			country_id: data.country,
			postcode: data.zip
		}// address_data;
		return { ...(await AddressesModel.save_address (FormData.fromObject (address_data))), ...address_data };
	}// save_address;


	static async save_card (data) {
		return new Promise ((resolve, reject) => {
			this.send_square_request (card_path, {
				"card": {
					"billing_address": this.extract_address (data),
					"source_id": "some number",
					"customer_id": "VDKXEEKPJN48QDG3BGGFAK05P8",
					"reference_id": "user-id-1"
				}
			});
			resolve (true);
		});
	}// save_card;


	static async save_company (data) {

		let company_data = {
			name: data.company_name,
			primary_contact_id: Account.account_id (),
			square_id: data.square_id
		}// company_data;

		if (common.isset (data.company_id)) company_data.company_id = data.company_id;
		if (common.isset (data.address_id)) company_data.address_id = data.address_id;

		return { ...(await CompaniesModel.save_company (FormData.fromObject (company_data))), ...company_data };

	}// save_company;


	static async save_company_association (data) {
		await CompanyAccountsModel.save_company_account (FormData.fromObject ({
			account_id: Account.account_id (),
			company_id: data.company_id
		}));
	}// save_company_association;


	static save_customer (data) {

		return new Promise (async (resolve, reject) => {

			let form_data = data.toObject ();
			let result = {}

			try {

				result.square_data = await this.save_square_account (form_data);
				result.company_data = await this.save_company ({ ...form_data, square_id: result.square_data.customer.id });
				result.address_data = await this.save_address ({ ...form_data, company_id: result.company_data.company_id});

				result.company_data = await this.save_company ({ // add the address ID
					...form_data, 
					company_id: result.company_data.company_id,
					address_id: result.address_data.address_id 
				});

				await this.save_company_association (result.company_data);

				localStorage.removeItem (transaction_id_field);

			} catch (except) { reject (except) }

			resolve (result);

		});

	}// save_customer;


	static async verify_payment_method (keep_card) {
		if (true) {		// TODO: TEST FOR EXISTING CUSTOMER

		}
	}// verify_payment_method;


	static async apply_payment () {
	}// apply_payment;


}// PaymentHandler;