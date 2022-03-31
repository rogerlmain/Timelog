import React from "react";

import PaymentHandler from "classes/payment.handler";
import Accounts from "classes/storage/accounts";

import BaseControl from "controls/abstract/base.control";
import EyecandyPanel from "controls/panels/eyecandy.panel";

import PopupWindow from "pages/gadgets/popup.window";
import AddressForm from "pages/forms/address.form"
import CreditCardForm from "pages/forms/credit.card.form";

import { is_null } from "classes/common";
import { credential_types } from "client/classes/types/constants";


export default class DeluxeAccountForm extends BaseControl {


	state = { 
		processing: false,
		active_card: null,
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
		let square_id = Accounts.square_id ();
		if (is_null (square_id)) Accounts.set (credential_types.square_id, await PaymentHandler.create_customer ());
		await PaymentHandler.verify_payment_method (this.state.keep_card);
		await PaymentHandler.apply_payment ();
		this.execute (this.props.onSubmit).then (() => this.setState ({ processing: false }));
	}// submit_payment


	shouldComponentUpdate (new_props) {
		if (new_props.visible != this.props.visible) this.setState ({ visible: new_props.visible });
		return true;
	}// shouldComponentUpdate;


	render () {

		return (<PopupWindow id="deluxe_account_form" visible={this.state.visible}>

			<div className="two-column-newspaper">
				<div><AddressForm /></div>
				<div><CreditCardForm /></div>
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

}// DeluxeAccountForm;