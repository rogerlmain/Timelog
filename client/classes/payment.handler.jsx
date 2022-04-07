import AccountsModel from "models/accounts";
import CurrentAccount from "classes/storage/account";

import { is_null, json_string } from "classes/common";
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

		let account_data = CurrentAccount.all ();
		let form_data = data.toObject ();

		let response = await this.send_square_request ({
			given_name: account_data [credential_types.first_name],
			family_name: account_data [credential_types.last_name],

			company_name: form_data.company_name,

			address: {
				address_line_1: form_data.street_address,
				address_line_2: form_data.additional_address,
				administrative_district_level_1: form_data.city,
				locality: form_data.district_name,
				postal_code: form_data.zip,
				country: form_data.country_name
			},

			email_address: form_data [credential_types.email_address],

			phone_number: form_data.primary_phone
		});

		AccountsModel.save_account (form_data);
		let user_square_id = response.customer.id;
//		return await AccountsModel.save_account (FormData.fromObject ({ square_id: user_square_id }));

return true;		

	}// create_customer;


	static async verify_payment_method (keep_card) {
		if (true) {		// TODO: TEST FOR EXISTING CUSTOMER

		}
	}// verify_payment_method;


	static async apply_payment () {
	}// apply_payment;


}// PaymentHandler;