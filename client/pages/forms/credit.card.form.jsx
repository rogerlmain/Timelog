import React from "react";

import PaymentHandler from "classes/payment.handler";

import BaseControl from "controls/base.control";
import Container from "controls/container";

import ExplodingPanel from "controls/panels/exploding.panel";
import EyecandyPanel from "controls/panels/eyecandy.panel";

import PopupWindow from "pages/gadgets/popup.window";

import Credentials from "client/classes/storage/credentials";

import { credential_types } from "client/types/globals";
import { is_null } from "classes/common";



const card_pattern = {
	amex:		/^(?:3[47][0-9]{13})$/,
	visa:		/^(?:4[0-9]{12}(?:[0-9]{3})?)$/,
	Mastercard:	/^(?:5[1-5][0-9]{14})$/,
	Discover:	/^(?:6(?:011|5[0-9][0-9])[0-9]{12})$/,
	JCB:		/^(?:(?:2131|1800|35\d{3})\d{11})$/
	/* else: UnionPay */
}// card_pattern;


const card_names = {
	amex:		"American Express",
	visa:		"Visa",
	mastercard: "Mastercard",
	discover:	"Discover",
	jcb:		"JCB",
	unionpay:	"UnionPay"
}// card_names;


export default class CreditCardForm extends BaseControl {


	state = { 
		processing: false,
		keep_card: true
	}// state;


	static defaultProps = { 
		visible: false,
		onSubmit: null,
		onCancel: null
	}// defaultProps;


	constructor (props) {
		super (props);
		this.state.visible = props.visible;
	}// constructor;


	async submit_payment () {
		let square_id = Credentials.square_id ();
		if (is_null (square_id)) Credentials.set (credential_types.square_id, await PaymentHandler.create_customer ());
		await PaymentHandler.verify_payment_method (this.state.keep_card);
		await PaymentHandler.apply_payment ();
		this.execute (this.props.onSubmit).then (() => this.setState ({ processing: false }));
	}// submit_payment


	shouldComponentUpdate (new_props) {
		if (new_props.visible != this.props.visible) this.setState ({ visible: new_props.visible });
		return true;
	}// shouldComponentUpdate;


	render () {

		return (<PopupWindow id="credit_card_form" visible={this.state.visible}>

			<div className="one-piece-form payment-form" style={{ margin: "1.5em 0" }}>

				<label htmlFor="cc_name">Name on card</label>
				<input type="text" name="cc_name" />

				<label htmlFor="cc_number">Card number</label>
				<input type="text" name="cc_number" />

				<label htmlFor="cc_expire">Expiration Date</label>
				<div className="select-list subpanel">
					<select>
						<option value="1">January</option>
						<option value="2">February</option>
						<option value="3">March</option>
						<option value="4">April</option>
						<option value="5">May</option>
						<option value="6">June</option>
						<option value="7">July</option>
						<option value="8">August</option>
						<option value="9">September</option>
						<option value="10">October</option>
						<option value="11">November</option>
						<option value="12">December</option>
					</select>
					<input type="text" placeholder="Year" />
				</div>

				<label htmlFor="cc_cvv">CVV</label>
				<div className="cc-details subpanel">
					<input type="text" name="cc_cvv" />
					<ExplodingPanel id="license_panel">
						<Container id="licence_form">
							<label htmlFor="licence_count">Licences</label>
							<input type="text" name="licence_count" placeholder="1" />
						</Container>
					</ExplodingPanel>
				</div>

				<label htmlFor="reuse_card">Keep card on file</label>
				<input type="checkbox" defaultValue={true} onClick={event => this.setState ({ keep_card: event.target.checked })} />

			</div>

			<EyecandyPanel id="payment_eyecandy" eyecandyText="Processing. One moment, please..." 
				eyecandyVisible={this.state.processing} onEyecandy={this.submit_payment.bind (this)}>

				<div className="button-bar">
					<button onClick={() => this.setState ({ processing: true })}>Submit</button>
					<button onClick={() => this.setState ({ visible: false }, this.props.onCancel)}>Cancel</button>
				</div>

			</EyecandyPanel>

		</PopupWindow>);
	}// render;

}// CreditCardForm;