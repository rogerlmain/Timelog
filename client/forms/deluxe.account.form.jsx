import * as constants from "classes/types/constants";
import * as common from "classes/common";

import React from "react";

import CustomerHandler from "classes/customer.handler";

import AccountStorage from "classes/storage/account.storage";
import CompanyStorage from "client/classes/storage/company.storage";

import BaseControl from "controls/abstract/base.control";
import ExplodingPanel from "controls/panels/exploding.panel";
import EyecandyPanel from "controls/panels/eyecandy.panel";

import Container from "controls/container";
import SelectList from "controls/select.list";

import AddressForm from "forms/address.form"
import CreditCardForm from "forms/credit.card.form";

import { MainContext } from "classes/types/contexts";
import { dynamic_input_classname } from "controls/inputs/dynamic.input";

import { isset, is_number, nested_value } from "classes/common";

import "client/resources/styles/forms/deluxe.account.form.css";


const greetings = {
	new_customer		: "Tell us a little about yourself",
	existing_customer	: "Should we use the same card?"
}// greetings;


const purchase_options = {
	item: "item",
	package: "package"
}// purchase_options;


export default class DeluxeAccountForm extends BaseControl {


	deluxe_account_form = React.createRef ();
	address_form = React.createRef ();

	package_list = React.createRef ();
	credit_card_list = React.createRef ();


	state = {

		active_card: null,
		package_price: 9999,	// TODO: Read from database

		square_handler: null,
		square_card: null,

		selected_item: purchase_options.item,

		processing: false,

		new_card: false,
		keep_card: true,

	}/* state */;


	static contextType = MainContext;


	static defaultProps = {  

		onSubmit: null,
		onCancel: null,

		option: null,
		optionPrice: null,
		creditCards: null,

		hasCredit: false,
		visible: false

	}/* defaultProps */;


	constructor (props) {
		super (props);
		this.state = {
			...this.state,
			visible: props.visible,
		};
	}// constructor;


	/********/


	get_form_data () {

		let form_data = new FormData (this.deluxe_account_form.current).toObject ();

		let address = common.nested_value (this.address_form.current, "state");

		if (isset (address)) {
			form_data.district_name = address.districts.extract (address.district_id).long_name;
			form_data.country_name = address.countries.extract (address.country_id).short_name;
		}// form_data;

		return form_data;

	}// get_form_data;


	/********/


	create_payment = async (data) => {

		let option_name = isset (this.props.option) ? common.get_key (constants.option_types, this.props.option).titled () : null;

		return await this.state.square_handler.create_payment ({
			amount: this.state.selected_item.equals (purchase_options.item) ? this.props.optionPrice : JSON.parse (this.package_list.current.value).price,
			customer_id: data.customer_id,
			source_id: data.card_id ?? data.token,
			note: `${AccountStorage.full_name ()}: ${option_name} (${this.props.option})`
		});

	}// create_payment;


	get_customer_id = async (data) => {

		let customer_id = CompanyStorage.square_id ();
		
		if (isset (customer_id)) return { customer_id: customer_id }; 
		
		let square_data = await this.state.square_handler.create_square_account (data);
		let company_data = CompanyStorage.get (this.context.company_id) ?? await new CustomerHandler ().save_customer ({...data, customer_id: square_data.customer.id });

		return {
			customer_id: square_data.customer.id,
			company: company_data
		};

	}// get_customer_id;


	get_card_id = async (data) => {

		let card_id = common.nested_value (this.credit_card_list.current, "list", "current", "selectedValue");
		let new_card = (!this.props.hasCredit) || this.state.new_card;

		if ((isset (card_id) && !new_card)) return card_id;
		
		if (data.keep_card) {
			let card_data = await this.state.square_handler.save_card (data);
			new CustomerHandler ().save_card (nested_value (data, "company_id") ?? nested_value (data, "company", "company_data", "company_id"), card_data.card);
			return card_data.card.id;
		}// if;

		return (await this.state.square_handler.create_token ()).token;

	}// get_card_id;
	

	submit_payment = async (event) => {

		let form_data = this.get_form_data ();

		if (isset (this.context.company_id)) form_data.company_id = this.context.company_id;
		form_data = { ...form_data, ...await this.get_customer_id (form_data) };
		form_data.card_id = await this.get_card_id (form_data);

		await this.execute (this.props.onSubmit, await this.create_payment (form_data));

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


	shouldComponentUpdate (new_props) {
		if (new_props.visible != this.props.visible) this.setState ({ visible: new_props.visible });
		return true;
	}// shouldComponentUpdate;


	componentDidMount () {

		let pattern_elements = this.deluxe_account_form.current.querySelectorAll ("[required], [pattern]");

		if (isset (pattern_elements)) for (let element of pattern_elements) {

			if (element.parentNode.classList.contains (dynamic_input_classname)) continue;

			element.addEventListener ("invalid", event => event.target.validate (event));
			element.addEventListener ("keyup", event => event.target.validate (event));

		}// for;

		this.setState ({ new_card: !this.props.hasCredit });

	}// componentDidMount;


	render () {

		let company_id = this.context_item ("company_id");
		
		let new_customer = common.not_set (company_id);

		return <form ref={this.deluxe_account_form} id="deluxe_account_form" onSubmit={event => event.preventDefault ()}>

			<label className="header">{this.props.hasCredit ? greetings.existing_customer : greetings.new_customer}</label>

			<br className="half" />
			
			<div className={new_customer ? "two-column-newspaper" : null}>

				<Container visible={new_customer}>
					<AddressForm ref={this.address_form} />
				</Container>

				<div className="vertically-spaced-out">

					<Container contentsOnly={false} inline={true}>

						<Container visible={this.props.hasCredit} inline={true}>

							<SelectList ref={this.credit_card_list} data={this.props.creditCards} idField="square_id" className="full-width" header={true}
								textField={item => { 

									let expiration = `${item.expiration % 100}/${Math.floor (item.expiration / 100)}`;
									let is_amex = constants.credit_card_types.amex.matches (item.card_type);

									let card_mask = constants.credit_card_masks [is_amex ? constants.credit_card_types.amex : constants.credit_card_types.other];
									let card_number = card_mask.substring (0, card_mask.length - item.last_few.toString ().length) + item.last_few.toString ();

									return `${card_number} (${constants.credit_card_names [item.card_type]} - ${expiration})`;

								}}>
							</SelectList>

							<br />

							<div className="right-justify" style={{ marginTop: "1em" }}>
								<div className="one-piece-form">
									<label htmlFor="new_card_checkbox">Use a different card</label>
									<input type="checkbox" id="new_card_checkbox" onClick={event => this.setState ({ new_card: event.target.checked })} />
								</div>
							</div>

							<br />

						</Container>

						<ExplodingPanel id="credit_card_form_panel">
							<div id="credit_card_panel" style={{ display: this.state.new_card ? "initial" : "none" }}>
								<CreditCardForm parent={this} />
							</div>
						</ExplodingPanel>


						<div className="horizontally-center full-width">
							<div className="three-column-grid pricing-table vertically-centered">

								<Container id="item_options" visible={isset (this.props.optionPrice)}>
									<input type="radio" id="item_price" name="price_option" value={purchase_options.item} 
										checked={this.state.selected_item == purchase_options.item} 
										onChange={event => { this.setState ({ selected_item: event.target.value}) }}>
									</input>
									<label htmlFor="item_price">Just this item</label>
									<div>${is_number (this.props.optionPrice) ? this.props.optionPrice.toCurrency () : this.props.optionPrice}</div>
								</Container>

								<Container id="package_options">

									<input type="radio" id="package_option" name="price_option" value={purchase_options.package} 
										checked={this.state.selected_item == purchase_options.package} 
										onChange={event => { this.setState ({ selected_item: event.target.value}) }}>
									</input>

									<select id="package_list" name="package_selection" ref={this.package_list} 

										onChange={event => this.setState ({ 
											package_price: JSON.parse (event.target.value).price,
											selected_item: purchase_options.package
										})}>

										<option value={`{ "id": ${constants.account_types.freelance}, "price": 9999 }`}>Freelance package</option>
										<option value={`{ "id": ${constants.account_types.company}, "price": 69999 }`}>Company package</option>
										<option value={`{ "id": ${constants.account_types.corporate}, "price": 179999 }`}>Corporate package</option>
										<option value={`{ "id": ${constants.account_types.enterprise}, "price": 359999 }`}>Enterprise package</option>

									</select>

									<div>{isset (this.state.package_price) ? "$" : null}{isset (this.state.package_price) ? this.state.package_price.toCurrency () : null}</div>

								</Container>

								<a href="packages" target="packages" style={{ gridColumn: 2 }}>Compare packages</a>

							</div>
						</div>

					</Container>
						
					<div className="right-justify">
						<EyecandyPanel id="payment_eyecandy" text="Processing. One moment, please..." 
							eyecandyVisible={this.state.processing} onEyecandy={this.submit_payment}>
							
							<div className="button-panel">
								<button onClick={this.props.onCancel}>Cancel</button>
								<button onClick={event => { if (this.validate (event)) this.setState ({ processing: true }) }}>Submit</button>
							</div>
							
						</EyecandyPanel>
					</div>

<br />
<button onClick={() => this.setState ({ processing: false })}>Reset</button>

				</div>

			</div>
		</form>
	}// render;

}// DeluxeAccountForm;
