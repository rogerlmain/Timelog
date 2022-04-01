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


	static async create_customer () {

		let data = CurrentAccount.all ();

		let response = await this.send_square_request ({
			given_name: data [credential_types.first_name],
			family_name: data [credential_types.last_name],

			company_name: "Roger Main Programming Company",

			address: {
				address_line_1: "6795 West 19th Place",
				address_line_2: "108",
				administrative_district_level_1: "Lakewood",
				locality: "Colorado",
				postal_code: "80214",
				country: "US"
			},

			email_address: data [credential_types.email_address],

			phone_number: "7203225154"
		});

		let user_square_id = response.customer.id;
		return await AccountsModel.save_account (FormData.fromObject ({ square_id: user_square_id }));

	}// create_customer;


	static async verify_payment_method (keep_card) {
	}// verify_payment_method;


	static async apply_payment () {
	}// apply_payment;


}// PaymentHandler;