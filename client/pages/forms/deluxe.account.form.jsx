import * as constants from "classes/types/constants";
import * as common from "classes/common";

import React from "react";

import PaymentHandler from "classes/payment.handler";
import CurrentAccount from "classes/storage/account";

import EyecandyPanel from "controls/panels/eyecandy.panel";

import PopupWindow from "pages/gadgets/popup.window";

import AddressForm from "pages/forms/address.form"
import CreditCardForm from "pages/forms/credit.card.form";
import BaseControl from "client/controls/abstract/base.control";

import { dynamic_input_classname } from "client/controls/inputs/dynamic.input";

export default class DeluxeAccountForm extends BaseControl {


	active_form = React.createRef ();


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

return;		

		let square_id = CurrentAccount.square_id ();

		if (common.is_null (square_id)) CurrentAccount.set (constants.credential_types.square_id, await PaymentHandler.create_customer ());

		await PaymentHandler.verify_payment_method (this.state.keep_card);
		await PaymentHandler.apply_payment ();

		this.execute (this.props.onSubmit).then (() => this.setState ({ processing: false }));

	}// submit_payment
	

	validate = (event) => {
		for (let element of this.active_form.current.elements) {
			if (!common.is_function (element.onValidate)) continue;
			if (element.validate (element)) continue;
			event.preventDefault ();
		}// for;
	}// validate;


	/*********/


	shouldComponentUpdate (new_props) {
		if (new_props.visible != this.props.visible) this.setState ({ visible: new_props.visible });
		return true;
	}// shouldComponentUpdate;


	componentDidMount () {
		let pattern_elements = this.active_form.current.querySelectorAll ("[required], [pattern]");
		if (common.isset (pattern_elements)) for (let element of pattern_elements) {

			if (element.parentNode.classList.contains (dynamic_input_classname)) continue;

			element.addEventListener ("invalid", event => event.target.validate (event));
			element.addEventListener ("keyup", event => event.target.validate (event));

		}// for;
	}// componentDidMount;


	render () {
		return <PopupWindow id="deluxe_account_window" visible={this.state.visible}>
			<form ref={this.active_form} id="deluxe_account_form" onSubmit={event => event.preventDefault ()}>

				<label className="header">Tell us a little about yourself</label>

				<br className="half" />
				
				<div className="two-column-newspaper">

					<AddressForm />

					<div className="vertically-spaced-out">
						<div><CreditCardForm /></div>
						<div className="right-justified-container">
							<EyecandyPanel id="payment_eyecandy" eyecandyText="Processing. One moment, please..." 
								eyecandyVisible={this.state.processing} onEyecandy={this.submit_payment.bind (this)}>
								
								<div className="button-panel">

									<button onClick={this.validate}>Submit</button>

									<button onClick={() => this.setState ({ visible: false }, this.props.onCancel)}>Cancel</button>
								</div>
								
							</EyecandyPanel>
						</div>
					</div>

				</div>
			</form>
		</PopupWindow>;
	}// render;

}// DeluxeAccountForm;