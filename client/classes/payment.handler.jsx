import AccountsModel from "models/accounts";
import AddressesModel from "models/addresses";
import CompaniesModel from "models/companies";

import Account from "classes/storage/account";
import Companies from "classes/storage/companies";

import { is_null } from "classes/common";
import { v4 as uuid } from "uuid";
import { credential_types } from "client/classes/types/constants";

const transaction_id_field = "transaction_id";


export default class PaymentHandler {


	state = { output: null }


	static send_square_request (data) {

		const hostname = "connect.squareupsandbox.com";
		const hostpath = "v2/customers";

		data.idempotency_key = localStorage.getItem (transaction_id_field);

		if (is_null (data.idempotency_key)) {
			data.idempotency_key = uuid ();
			localStorage.setItem (transaction_id_field, data.idempotency_key);
		}// if;

		return new Promise ((resolve, reject) => fetch (`https://${hostname}/${hostpath}`, {
			method: "post",
			headers: {
				"Content-Type": "application/json",
				"Square-Version": "2022-03-16",
				"Authorization": "Bearer EAAAENzB7zMQb2M5FW6MpbnIMXfvwLdonwGI9XxqtkwT86LvxuWpW4N_SyI67cjJ"
			}/* headers */,
			body: JSON.stringify (data)
		}).then (response => response.json ()).then (response => resolve (response)).catch (error => reject (error)))

	}// send_square_request;


	static async create_customer (data) {

		let account_data = Account.all ();
		let form_data = data.toObject ();

//		let response = await this.send_square_request ({
//			given_name: account_data [credential_types.first_name],
//			family_name: account_data [credential_types.last_name],
//			company_name: form_data.company_name,
//			address: {
//				address_line_1: form_data.street_address,
//				address_line_2: form_data.additional_address,
//				administrative_district_level_1: form_data.city,
//				locality: form_data.district_name,
//				postal_code: form_data.zip,
//				country: form_data.country_name
//			}/* address */,
//			email_address: form_data [credential_types.email_address],
//			phone_number: form_data.primary_phone
//		});

let response = { customer: { id: "4RR7K1JTH4YX96B9K5DFR36ZMW" }}

		let address_id = (await AddressesModel.save_address (FormData.fromObject ({
			company_id: Companies.active_company (),
			street_address: form_data.street_address,
			additional: form_data.additional_address,
			city: form_data.city,
			state_id: form_data.district,
			country_id: form_data.country,
			postcode: form_data.zip
		}))).address_id;

		CompaniesModel.save_company (FormData.fromObject ({
			name: form_data.company_name,
			address_id: address_id,
			primary_contact_id: Account.account_id (),
			square_id: response.customer.id
		}));

		localStorage.removeItem (transaction_id_field);

		return response.customer.id;

	}// create_customer;


	static async verify_payment_method (keep_card) {
		if (true) {		// TODO: TEST FOR EXISTING CUSTOMER

		}
	}// verify_payment_method;


	static async apply_payment () {
	}// apply_payment;


}// PaymentHandler;