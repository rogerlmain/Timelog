import * as constants from "classes/types/constants";
import * as common from "classes/common";

import React from "react";

import CustomerHandler from "classes/customer.handler";

import Account from "classes/storage/account";
import Companies from "classes/storage/companies";

import BaseControl from "controls/abstract/base.control";
import EyecandyPanel from "controls/panels/eyecandy.panel";

import Container from "controls/container";
import SelectList from "controls/select.list";

import AddressForm from "forms/address.form"
import CreditCardForm from "forms/credit.card.form";

import { MainContext } from "classes/types/contexts";
import { dynamic_input_classname } from "controls/inputs/dynamic.input";

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


	state = {

		active_card: null,
		package_price: null,

		square_handler: null,
		square_card: null,

		selected_item: purchase_options.item,

		processing: false,
		keep_card: true

	}/* state */;


	static contextType = MainContext;


	static defaultProps = {  

		onSubmit: null,
		onCancel: null,

		option: null,
		optionPrice: null,

		creditCards: null,

		visible: false

	}/* defaultProps */;


	constructor (props) {
		super (props);
		this.state.visible = props.visible;
	}// constructor;


	/********/


	async update_local_data (data) {
		Companies.set ({
			active_company: data.company_data.company_id,
			[data.company_data.company_id]: [{
				company_name: data.company_data.name,
				address_id: data.address_data.address_id,
				street_address: data.address_data.street_address,
				additional: data.address_data.additional,
				city: data.address_data.city,
				state_id: data.address_data.state_id,
				state_name: data.form_data.state_name,
				country_id: data.address_data.country_id,
				country_name: data.form_data.full_country_name,
				postcode: data.address_data.postcode,
				square_id: data.square_data.customer.id,
			}]
		});
	}// update_local_data;


	async create_payment (credit_card, square_id) {

		let option_name = common.isset (this.props.option) ? common.get_key (constants.option_types, this.props.option).titled () : null;

		return await this.state.square_handler.create_payment ({
			amount: this.state.selected_item.equals (purchase_options.item) ? this.props.optionPrice : JSON.parse (this.package_list.current.value).price,
			source_id: common.isset (credit_card) ? credit_card.card.id : null,
			customer_id: square_id,
			note: `${Account.full_name ()}: ${option_name} (${this.props.option})`
		});

	}// create_payment;


	/********/


	get_form_data () {

		let form_data = new FormData (this.deluxe_account_form.current).toObject ();

		let address = common.nested_value (this.address_form.current, "state");

		if (common.isset (address)) {
			form_data.district_name = address.districts.extract (address.district_id).long_name;
			form_data.country_name = address.countries.extract (address.country_id).short_name;
		}// form_data;

		return form_data;

	}// get_form_data;


	/********/


	submit_payment = async event => {

		let data = { form_data: {
			...this.get_form_data (),
			full_country_name: common.nested_value (document.getElementById ("country"), "selectedText"),
		}}/* data */;
		
		let square_id = Companies.square_id ();
		
		data.keep_card = common.boolean_value (data.form_data.keep_card);

		if (common.is_null (square_id)) {
			data.square_data = await this.state.square_handler.create_square_account (data.form_data);
			data.credit_card = (data.keep_card) ? await this.state.square_handler.save_card (data.form_data, data.square_data) : null;
		}// if;

		data.payment_data = await this.create_payment (data.credit_card, common.isset (square_id) ? square_id : data.square_data);

		data = { ...data, ...await new CustomerHandler ().save_customer (data) };

		this.update_local_data (data);
		this.execute (this.props.onSubmit);

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

		if (common.isset (pattern_elements)) for (let element of pattern_elements) {

			if (element.parentNode.classList.contains (dynamic_input_classname)) continue;

			element.addEventListener ("invalid", event => event.target.validate (event));
			element.addEventListener ("keyup", event => event.target.validate (event));

		}// for;

	}// componentDidMount;


	render () {

		let company_id = this.context_item ("company_id");
		
		let new_customer = common.not_set (company_id);
		let has_credit = common.isset (this.props.creditCards);

		return <form ref={this.deluxe_account_form} id="deluxe_account_form" onSubmit={event => event.preventDefault ()}>

			<label className="header">{has_credit ? greetings.existing_customer : greetings.new_customer}</label>

			<br className="half" />
			
			<div className={new_customer ? "two-column-newspaper" : null}>

				<Container condition={new_customer}>
					<AddressForm ref={this.address_form} />
				</Container>

				<div className="vertically-spaced-out">

					<Container contentsOnly={false} inline={true}>

						<Container condition={has_credit}>

<div style={{ border: "solid 1px red" }}>

		<div>CC SELECT OPTIONS</div>

							<SelectList data={this.props.creditCards} idField="square_id" 
								textField={item => { 

									let expiration = `${item.expiration % 100}/${Math.floor (item.expiration / 100)}`;
									let is_amex = constants.credit_card_types.amex.matches (item.card_type);

									let card_mask = constants.credit_card_masks [is_amex ? constants.credit_card_types.amex : constants.credit_card_types.other];
									let card_number = card_mask.substring (0, card_mask.length - item.last_few.toString ().length) + item.last_few.toString ();

									return `${card_number} (${constants.credit_card_names [item.card_type]} - ${expiration})`;

								}}>
							</SelectList>

</div>

						</Container>
{/* 
						<CreditCardForm parent={this} />

						<div className="horizontally_centered full-width">
							<div className="three-column-grid pricing-table vertically-centered">


								{common.isset (this.props.optionPrice) ? 
									<Container>
										<input type="radio" id="item_price" name="price_option" value={purchase_options.item} 
											checked={this.state.selected_item == purchase_options.item} 
											onChange={event => { this.setState ({ selected_item: event.target.value}) }}>
										</input>
										<div>Just this item</div>
										<div>${common.isset (this.props.optionPrice) ? this.props.optionPrice.toCurrency () : null}</div>
									</Container>
								: null}

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

								<div>{common.isset (this.state.package_price) ? "$" : null}{common.isset (this.state.package_price) ? this.state.package_price.toCurrency () : null}</div>

							</div>
						</div>

						<div className="right-justify" style={{ marginBottom: "1em" }}><a href="packages" target="packages">Compare packages</a></div>
*/}
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


<button onClick={() => this.setState ({ processing: false })}>Reset</button>

				</div>

			</div>
		</form>
	}// render;

}// DeluxeAccountForm;


// let option_name = common.isset (this.state.cc_form) ? common.get_key (constants.option_types, form_value ("option")) : null;

