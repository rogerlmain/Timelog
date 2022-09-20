import * as constants from "client/classes/types/constants";

import FormHandler from "client/classes/handlers/form.handler";

import AccountStorage from "client/classes/storage/account.storage";

import { isset, is_null } from "client/classes/common";
import { v4 as uuid } from "uuid";


const transaction_id_field = "transaction_id";


const square_transactions = {
	card	: "card",
	customer: "customer",
	payment	: "payment",
}// square_transactions;


export default class SquareHandler {


	form = null;


	/********/


	send_square_request (path, data) {

		let square_data = new FormData ();

		data.idempotency_key = localStorage.getItem (transaction_id_field);
		if (is_null (square_data.idempotency_key)) {
			data.idempotency_key = uuid ();
			localStorage.setItem (transaction_id_field, data.idempotency_key);
		}// if;
	
		square_data.append ("square_string", JSON.stringify (data));
		square_data.append ("path", path);

		return new Promise ((resolve, reject) => fetch ("/payment", {
			method: "post",
			body: square_data,
			credentials: "same-origin"
		}).then (response => response.json ()).then (response => {
			localStorage.removeItem (transaction_id_field);
			resolve (response);
		}).catch (error => reject (error)));

	}// send_square_request;


	/********/


	async create_card_form (container) {
		return new Promise ((resolve, reject) => {

			const attach_form = form => {
				this.form = form;
				form.attach (container).then (resolve ());
			}/* attach_form */

			Square.payments (constants.application_id, constants.location_id).card ({ style: {
				"input": { fontSize: "10pt" },
				".input-container": { borderColor: "black", borderRadius: "1em" }
			}}).then (form => attach_form (form)).catch (reject);

		});
	}// create_card_form;


	async create_token () {

		let token_data = await this.form.tokenize ();
			
		if (token_data.status !== "OK") {
			this.setState ({ processing: false });
			return null;
		}// if;

		return token_data;

	}// create_token;


	async create_square_account (form_data) {
		
		let parameters = {
			given_name: AccountStorage.first_name (),
			family_name: AccountStorage.last_name (),
			company_name: form_data.company_name,
			address: FormHandler.extract_address (form_data),
			email_address: AccountStorage.email_address (),
			phone_number: form_data.primary_phone
		}/* parameters */;

		return this.send_square_request (square_transactions.customer, parameters);

	}// create_square_account;


	async create_payment (data) {

		let parameters = {
			amount_money: {
			  amount: data.amount,
			  currency: "USD" // for the moment - may change
			}/* amount_money */,
			source_id: isset (data.source_id) ? data.source_id : (await this.create_token ()).token,
			customer_id: data.customer_id,
			note: data.note,
		}/* parameters */;

		return this.send_square_request (square_transactions.payment, parameters);

	}// create_payment;


	/********/


	async save_card (data) {

		let card_token = (await this.create_token ()).token;

		let card_data = { 
			source_id: card_token,
			card: {
				billing_address: FormHandler.extract_address (data),
				customer_id: data.customer_id,
				cardholder_name: data.cc_name,
			}/* card */
		}/* card_data */;

		return this.send_square_request (square_transactions.card, card_data);

	}// save_card;


}// SquareHandler;