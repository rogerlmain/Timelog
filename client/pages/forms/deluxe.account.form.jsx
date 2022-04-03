import * as constants from "classes/types/constants";
import * as common from "classes/common";

import React from "react";

import PaymentHandler from "classes/payment.handler";
import CurrentAccount from "classes/storage/account";

import EyecandyPanel from "controls/panels/eyecandy.panel";

import PopupWindow from "pages/gadgets/popup.window";

import BaseForm from "pages/forms/base.form";
import AddressForm from "pages/forms/address.form"
import CreditCardForm from "pages/forms/credit.card.form";
import BaseControl from "client/controls/abstract/base.control";



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


	/*********/


	shouldComponentUpdate (new_props) {
		if (new_props.visible != this.props.visible) this.setState ({ visible: new_props.visible });
		return true;
	}// shouldComponentUpdate;


	componentDidMount () {
		for (let element of this.active_form.current.elements) {
			element.addEventListener ("invalid", event => event.target.addClass ("invalid"));
			element.addEventListener ("change", event => event.target.removeClass ("invalid"));
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
									<button>Submit</button>
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