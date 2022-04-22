import * as constants from "classes/types/constants";
import * as common from "classes/common";

import React from "react";

import PaymentHandler from "classes/payment.handler";
import Account from "classes/storage/account";
import Companies from "classes/storage/companies";

import BaseControl from "controls/abstract/base.control";
import Container from "controls/container";
import EyecandyPanel from "controls/panels/eyecandy.panel";

import CompanyCardModel from "models/company.cards";

import PopupWindow from "pages/gadgets/popup.window";

import AddressForm from "forms/address.form"
import CreditCardForm from "forms/credit.card.form";

import { dynamic_input_classname } from "controls/inputs/dynamic.input";
import { MainContext } from "classes/types/contexts";

import "client/resources/styles/forms/deluxe.account.form.css";


const greetings = {
	new_customer		: "Tell us a little about yourself",
	existing_customer	: "Should we use the same card?"
}// greetings;


export default class DeluxeAccountForm extends BaseControl {


	deluxe_account_form = React.createRef ();
	address_form = React.createRef ();


	state = { 
		processing: false,
		active_card: null,
		keep_card: true
	}/* state */;


	static contextType = MainContext;


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


	async create_payment (form_data) {

		// make actual square payment here

		return true;
	}


	submit_payment = async event => {

		let customer_data = null;

		let square_id = Account.square_id ();
		let form_data = new FormData (this.deluxe_account_form.current);

		let address_state = this.address_form.current.state;
		let cc_number = form_data.get ("cc_number");

		let save_card = common.boolean_value (form_data.get ("keep_card"));

		form_data.append ("district_name", address_state.districts.extract (address_state.district_id).long_name);
		form_data.append ("country_name", address_state.countries.extract (address_state.country_id).short_name);

		if (common.is_null (square_id)) {
				
			customer_data = this.create_customer_data (form_data);
			payment_data = this.create_payment (form_data);

			if (save_card) card_data = await PaymentHandler.save_card (form_data);


			// Account.set (constants.credential_types.square_id, customer_data.square_data.square_id);

			if (save_card) CompanyCardModel.save_card ({
				company_id: customer_data.company_data.company_id,
				last_few: common.integer_value (cc_number.substring (cc_number.lastIndexOf (constants.space) + 1)),
				expiration: (common.integer_value (form_data.get ("cc_year")) * 100) + common.integer_value (form_data.get ("cc_month")),
				card_type: form_data.get ("cc_type")
			});
	
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

		return is_valid;

	}// validate;


	/*********/


	async create_customer_data (form_data) {

		let customer_data = await PaymentHandler.save_customer (form_data);

		// Companies.set ({
		// 	active_company: customer_data.company_data.company_id,
		// 	list: [{
		// 		company_id: customer_data.company_data.company_id,
		// 		company_name: customer_data.company_data.name,
		// 		address_id: customer_data.address_data.address_id,
		// 		street_address: customer_data.address_data.street_address,
		// 		additional: customer_data.address_data.additional,
		// 		city: customer_data.address_data.city,
		// 		state_id: customer_data.address_data.state_id,
		// 		state_name: document.getElementById ("district").selectedText (),
		// 		country_id: customer_data.address_data.country_id,
		// 		country_name: document.getElementById ("country").selectedText (),
		// 		postcode: customer_data.address_data.postcode
		// 	}]
		// });

		return customer_data;

	}// create_customer_data;


	pricing_option (product, price, selected = false) {
		return <Container>
			<div><input type="radio" id={`${product}_price`} name="price_option" value={product} defaultChecked={selected} /></div>
			<div>{product.equals ("item") ? "Just this item" : `${product.titled ()} package`}</div>
			<div>${price}</div>
		</Container>
	}// pricing_option


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

		let company_id = this.context_item ("company_id");
		let new_customer = common.not_set (company_id);

		return <PopupWindow id="deluxe_account_window" visible={this.state.visible}>
			<form ref={this.deluxe_account_form} id="deluxe_account_form" onSubmit={event => event.preventDefault ()}>

				<label className="header">{new_customer ? greetings.new_customer : greetings.existing_customer}</label>

				<br className="half" />
				
				<div className={new_customer ? "two-column-newspaper" : null}>

					<Container condition={new_customer}>
						<AddressForm ref={this.address_form} />
					</Container>

					<div className="vertically-spaced-out">

						<Container condition={!new_customer}>
							<select>
								<option>Pick a card (any card)</option>
							</select>
						</Container>

						<Container condition={new_customer} contentsOnly={false} inline={true}>
							<CreditCardForm />
							<div className="horizontally_centered full-width">
								<div className="three-column-grid pricing-table">
									{this.pricing_option ("item", "2.99", true)}
									{this.pricing_option ("freelance", "99.99")}
									{this.pricing_option ("company", "699.99")}
									{this.pricing_option ("corporate", "1,799.99")}
									{this.pricing_option ("enterprise", "3,599.99")}
								</div>
							</div>
							<div className="right-justify" style={{ marginBottom: "1em" }}><a href="packages" target="packages">Compare packages</a></div>
						</Container>
							
						<div className="right-justify">
							<EyecandyPanel id="payment_eyecandy" eyecandyText="Processing. One moment, please..." 
								eyecandyVisible={this.state.processing} onEyecandy={this.submit_payment}>
								
								<div className="button-panel">
									<button onClick={event => { if (this.validate (event)) this.setState ({ processing: true }) }}>Submit</button>
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