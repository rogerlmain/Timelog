import * as constants from "classes/types/constants";
import * as common from "classes/common";

import FormHandler from "classes/form.handler";

import Account from "classes/storage/account";

import { v4 as uuid } from "uuid";


const transaction_id_field = "transaction_id";

const square_hostname = "connect.squareupsandbox.com";
const square_authorization = "EAAAENzB7zMQb2M5FW6MpbnIMXfvwLdonwGI9XxqtkwT86LvxuWpW4N_SyI67cjJ";

const card_path 	= "v2/cards";
const customer_path	= "v2/customers";
const payment_path	= "v2/payments";


export default class SquareHandler {


	card = null;


	/********/


	send_square_request (path, data) {

		data.idempotency_key = localStorage.getItem (transaction_id_field);

		if (common.is_null (data.idempotency_key)) {
			data.idempotency_key = uuid ();
			localStorage.setItem (transaction_id_field, data.idempotency_key);
		}// if;

		return new Promise ((resolve, reject) => fetch (`https://${square_hostname}/${path}`, {
			method: "post",
			headers: {
				"Content-Type": "application/json",
				"Square-Version": "2022-03-16",
				"Authorization": `Bearer ${square_authorization}`
			}/* headers */,
			body: JSON.stringify (data)
		}).then (response => response.json ()).then (response => {
			localStorage.removeItem (transaction_id_field);
			resolve (response)
		}).catch (error => reject (error)))

	}// send_square_request;


	/********/


	async create_card_form (container) {
		return new Promise ((resolve, reject) => {
			Square.payments (constants.application_id, constants.location_id).card ({ style: {
				"input": { fontSize: "10pt" },
				".input-container": { borderColor: "black", borderRadius: "1em" }
			}}).then (card => {
				this.card = card;
				card.attach (container).then (resolve (card));
			}).catch (reject);
		});
	}// create_card_form;


	async create_token () {

		let token_data = await this.card.tokenize ();
			
		if (token_data.status !== "OK") {
			this.setState ({ processing: false });
			return null;
		}// if;

		let x = token_data;
		return x;

		return token_data;

	}// create_token;


	async create_square_account (form_data) {
		
		let parameters = {
			given_name: Account.first_name (),
			family_name: Account.last_name (),
			company_name: form_data.company_name,
			address: FormHandler.extract_address (form_data),
			email_address: Account.email_address (),
			phone_number: form_data.primary_phone
		}/* parameters */;

		return this.send_square_request (customer_path, parameters);

	}// create_square_account;


	async create_payment (data) {

		let parameters = {
			amount_money: {
			  amount: data.amount,
			  currency: "USD" // for the moment - may change
			}/* amount_money */,
			source_id: common.isset (data.source_id) ? data.source_id : (await this.create_token ()).token,
			customer_id: data.customer_id,
			note: data.note,
		}/* parameters */;

		return this.send_square_request (payment_path, parameters);

	}// create_payment;


	/********/


	async save_card (form_data, square_data) {

		let card_token = (await this.create_token ()).token;

		let card_data = { 
			source_id: card_token,
			card: {
				billing_address: FormHandler.extract_address (form_data),
				customer_id: square_data.customer.id,
				cardholder_name: form_data.cc_name,
			}/* card */
		}/* card_data */;

		return this.send_square_request (card_path, card_data);

	}// save_card;


}// SquareHandler;