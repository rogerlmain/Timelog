import * as constants from "classes/types/constants";
import * as common from "classes/common";

import React from "react";

import PaymentHandler from "classes/payment.handler";
import Account from "classes/storage/account";
import Companies from "client/classes/storage/companies";

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
	}/* state */;


	static defaultProps = {  
		onSubmit: null,
		onCancel: null,
		visible: false
	}/* defaultProps */;


	constructor (props) {
		super (props);
		this.state.visible = props.visible;
	}// constructor;


	/********/


	submit_payment = async event => {

		let customer_data = null;

		let square_id = Account.square_id ();
		let form_data = new FormData (this.deluxe_account_form.current);

		let address_state = this.address_form.current.state;

		form_data.append ("district_name", address_state.districts.extract (address_state.district_id).long_name);
		form_data.append ("country_name", address_state.countries.extract (address_state.country_id).short_name);

		if (common.is_null (square_id)) {
				
			customer_data = await PaymentHandler.save_customer (form_data)

			Companies.set ({
				active_company: customer_data.company_data.company_id,
				list: [{
					company_id: customer_data.company_data.company_id,
					company_name: customer_data.company_data.name,
					address_id: customer_data.address_data.address_id,
					street_address: customer_data.address_data.street_address,
					additional: customer_data.address_data.additional,
					city: customer_data.address_data.city,
					state_id: customer_data.address_data.state_id,
					state_name: document.getElementById ("district").selectedText (),
					country_id: customer_data.address_data.country_id,
					country_name: document.getElementById ("country").selectedText (),
					postcode: customer_data.address_data.postcode
				}]
			});

			Account.set (constants.credential_types.square_id, customer_data.square_data.square_id);

		}// if;

		await PaymentHandler.verify_payment_method (customer_data.square_data.square_id);
		// await PaymentHandler.apply_payment ();

		this.setState ({ processing: false }, this.props.onSubmit);

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
									<button onClick={this.props.onCancel}>Cancel</button>
								</div>
								
							</EyecandyPanel>
						</div>
					</div>

				</div>
			</form>
		</PopupWindow>;
	}// render;

}// DeluxeAccountForm;