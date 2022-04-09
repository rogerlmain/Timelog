import * as constants from "classes/types/constants";
import * as common from "classes/common";

import React from "react";

import PaymentHandler from "classes/payment.handler";
import Account from "classes/storage/account";

import EyecandyPanel from "controls/panels/eyecandy.panel";

import PopupWindow from "pages/gadgets/popup.window";

import AddressForm from "pages/forms/address.form"
import CreditCardForm from "pages/forms/credit.card.form";
import BaseControl from "client/controls/abstract/base.control";

import { dynamic_input_classname } from "client/controls/inputs/dynamic.input";

export default class DeluxeAccountForm extends BaseControl {


	deluxe_account_form = React.createRef ();
	address_form = React.createRef ();


	state = { 
		processing: false,
		active_card: null,
		keep_card: true
	}// state;


	static defaultProps = {  visible: false }


	constructor (props) {
		super (props);
		this.state.visible = props.visible;
	}// constructor;


	submit_payment = async event => {

		let square_id = Account.square_id ();
		let form_data = new FormData (this.deluxe_account_form.current);

		let address_state = this.address_form.current.state;

		form_data.append ("district_name", address_state.districts.extract (address_state.district_id).long_name);
		form_data.append ("country_name", address_state.countries.extract (address_state.country_id).short_name);

		if (common.is_null (square_id)) {
			square_id = await PaymentHandler.create_customer (form_data);
			Account.set (constants.credential_types.square_id, square_id);
		}// if;

		// await PaymentHandler.verify_payment_method (this.state.keep_card);
		// await PaymentHandler.apply_payment ();

		this.setState ({ processing: false });

	}// submit_payment
	

	validate = (event) => {

		let is_valid = true;
		let items = Array.from (this.deluxe_account_form.current.elements);

		if (common.not_set (items)) return;
		
		for (let element of items.reverse ()) {
			if (common.is_function (element.validate) && !element.validate (event)) {
				element.reportValidity ();
				is_valid = false;
			}// if;
		}// for;

		if (is_valid) this.submit_payment (event);

	}// validate;


	/*********/


	shouldComponentUpdate (new_props) {
		if (new_props.visible != this.props.visible) this.setState ({ visible: new_props.visible });
		return true;
	}// shouldComponentUpdate;


	componentDidMount () {
		let pattern_elements = this.deluxe_account_form.current.querySelectorAll ("[required], [pattern]");
		if (common.isset (pattern_elements)) for (let element of pattern_elements) {

			if (element.parentNode.classList.contains (dynamic_input_classname)) continue;

			element.addEventListener ("invalid", event => event.target.validate (event));
			element.addEventListener ("keyup", event => event.target.validate (event));

		}// for;
	}// componentDidMount;


	render () {
		return <PopupWindow id="deluxe_account_window" visible={this.state.visible}>
			<form ref={this.deluxe_account_form} id="deluxe_account_form" onSubmit={event => event.preventDefault ()}>

				<label className="header">Tell us a little about yourself</label>

				<br className="half" />
				
				<div className="two-column-newspaper">

					<AddressForm ref={this.address_form} />

					<div className="vertically-spaced-out">
						<div><CreditCardForm /></div>
						<div className="right-justified-container">
							<EyecandyPanel id="payment_eyecandy" eyecandyText="Processing. One moment, please..." 
								eyecandyVisible={this.state.processing} onEyecandy={this.validate}>
								
								<div className="button-panel">
									<button onClick={() => this.setState ({ processing: true })}>Submit</button>
									<button onClick={() => this.setState ({ visible: false })}>Cancel</button>
								</div>
								
							</EyecandyPanel>
						</div>
					</div>

				</div>
			</form>
		</PopupWindow>;
	}// render;

}// DeluxeAccountForm;