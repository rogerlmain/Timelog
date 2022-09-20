import React from "react";

import AccountStorage from "client/classes/storage/account.storage";
import CompanyStorage from "client/classes/storage/company.storage";

import CustomerHandler from "client/classes/handlers/customer.handler";
import SquareHandler from "client/classes/handlers/square.handler";

import CompanyCardModel from "client/classes/models/company.cards.model";
import PricingModel from "client/classes/models/pricing.model";

import BaseControl from "client/controls/abstract/base.control";
import ExplodingPanel from "client/controls/panels/exploding.panel";
import EyecandyPanel from "client/controls/panels/eyecandy.panel";

import Container from "client/controls/container";
import SelectList from "client/controls/lists/select.list";

import AddressForm from "forms/address.form"
import CreditCardSubform from "client/forms/subforms/credit.card.subform";

import { MasterContext } from "client/classes/types/contexts";
import { dynamic_input_classname } from "client/controls/inputs/dynamic.input";

import { account_types, credit_card_masks, credit_card_names, credit_card_types } from "client/classes/types/constants";
import { debugging, get_key, isset, is_empty, is_function, is_number, nested_value, not_empty, not_set } from "client/classes/common";
import { option_types } from "client/classes/types/options";

import "resources/styles/forms/deluxe.account.form.css";


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

	credit_card_panel = React.createRef ();


	state = {

		active_card: null,
		package_price: 9999,	// TODO: Read from database

		has_credit: false,
		credit_cards: null,

		square_handler: null,
		square_card: null,

		selected_item: purchase_options.item,

		processing: false,

		new_card: true,
		keep_card: true,

		price: null,

	}/* state */;


	static contextType = MasterContext;


	static defaultProps = {  

		onSubmit: null,
		onCancel: null,

		option: null,
		value: null,

	}/* defaultProps */;


	constructor (props) {
		super (props);
		this.state.square_handler = new SquareHandler ();
	}// constructor;
			
			
	/********/
			

	get_form_data () {

		let form_data = new FormData (this.deluxe_account_form.current).toObject ();
		let address = this.address_form.current?.state;

		if (isset (address)) {
			form_data.district_name = address.districts.extract (address.district_id).long_name;
			form_data.country_name = address.countries.extract (address.country_id).short_name;
		}// form_data;

		return form_data;

	}// get_form_data;


	create_payment = async (data) => {

		let option_name = isset (this.props.option) ? get_key (option_types, this.props.option).titled () : null;

		return this.state.square_handler.create_payment ({
			amount: this.state.selected_item.equals (purchase_options.item) ? this.state.price : JSON.parse (this.package_list.current.value).price,
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

		let card_id = this.credit_card_list.current?.list?.current?.selectedValue;
		let new_card = (!this.state.has_credit) || this.state.new_card;

		if ((isset (card_id) && !new_card)) return card_id;
		
		if (data.keep_card) {
			let card_data = await this.state.square_handler.save_card (data);
			new CustomerHandler ().save_card (nested_value (data, "company_id") ?? nested_value (data, "company", "company_data", "company_id"), card_data.card);
			return card_data.card.id;
		}// if;

		return (await this.state.square_handler.create_token ()).token;

	}// get_card_id;
	

	submit_payment = async event => {

		let form_data = this.get_form_data ();

		if (isset (this.context.company_id)) form_data.company_id = this.context.company_id;
		form_data = { ...form_data, ...await this.get_customer_id (form_data) };
		form_data.card_id = await this.get_card_id (form_data);

		this.create_payment (form_data).then (() => this.execute (this.props.onSubmit));

	}// submit_payment
	

	validate = (event) => {

		let is_valid = true;
		let items = Array.from (this.deluxe_account_form.current.elements);

		if (not_set (items)) return;
		
		for (let element of items.reverse ()) {
			if (is_function (element.validate) && !element.validate (event)) {
				element.reportValidity ();
				is_valid = false;
			}// if;
		}// for;

		return is_valid;

	}// validate;


	/*********/


	componentDidMount () {

		let pattern_elements = this.deluxe_account_form.current.querySelectorAll ("[required], [pattern]");

		if (isset (pattern_elements)) for (let element of pattern_elements) {

			if (element.parentNode.classList.contains (dynamic_input_classname)) continue;

			element.addEventListener ("invalid", event => event.target.validate (event));
			element.addEventListener ("keyup", event => event.target.validate (event));

		}// for;

		if (isset (this.context.company_id)) CompanyCardModel.get_cards (this.context.company_id).then (result => this.setState ({ 
			credit_cards : result,
			has_credit: not_empty (result),
		}));
					
	}// componentDidMount;


	componentDidUpdate () { 		
		if (isset (this.props.option) && isset (this.props.value)) PricingModel.load_price (this.props.option, this.props.value).then (result => {
			this.setState ({ price: is_empty (result) ? "Market Price" : result [0].price });
		});
	}// componentDidUpdate;


	render () {

		let company_id = this.context_item ("company_id");
		
		let new_customer = not_set (company_id);

		return <form ref={this.deluxe_account_form} id="deluxe_account_form" onSubmit={event => event.preventDefault ()}>

			<label className="header">{this.state.has_credit ? greetings.existing_customer : greetings.new_customer}</label>

			<br className="half" />
			
			<div className={new_customer ? "two-column-newspaper" : null}>

				<Container visible={new_customer}>
					<AddressForm ref={this.address_form} />
				</Container>

				<div className="vertically-spaced-out">

					<Container>

						<Container visible={this.state.has_credit}>

							<SelectList ref={this.credit_card_list} data={this.state.credit_cards} idField="square_id" className="full-width" header={true}
								textField={item => { 

									let expiration = `${item.expiration % 100}/${Math.floor (item.expiration / 100)}`;
									let is_amex = credit_card_types.amex.matches (item.card_type);

									let card_mask = credit_card_masks [is_amex ? credit_card_types.amex : credit_card_types.other];
									let card_number = card_mask.substring (0, card_mask.length - item.last_few.toString ().length) + item.last_few.toString ();

									return `${card_number} (${credit_card_names [item.card_type]} - ${expiration})`;

								}}>
							</SelectList>

							<div className="right-justified" style={{ marginTop: "1em" }}>
								<div className="one-piece-form">
									<label htmlFor="new_card_checkbox">Use a different card</label>
									<input type="checkbox" id="new_card_checkbox" value={this.state.new_card} 
										onClick={event => this.credit_card_panel.current.animate (() => this.setState ({ new_card: event.target.checked }))}>
									</input>
								</div>
							</div>

						</Container>

						<br />

						<ExplodingPanel id="credit_card_panel" ref={this.credit_card_panel}>
							<Container visible={this.state.new_card}>
								<CreditCardSubform parent={this} handler={this.state.square_handler} />
							</Container>
						</ExplodingPanel>

						<div className="horizontally-center full-width with-headspace">
							<div className="three-column-grid pricing-table vertically-centered">

								<Container id="item_options" visible={isset (this.state.price)}>
									<input type="radio" id="item_price" name="price_option" value={purchase_options.item} 
										checked={this.state.selected_item == purchase_options.item} 
										onChange={event => { this.setState ({ selected_item: event.target.value}) }}>
									</input>
									<label htmlFor="item_price">Just this item</label>
									<div>${is_number (this.state.price) ? this.state.price.toCurrency () : this.state.price}</div>
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

										<option value={`{ "id": ${account_types.freelance}, "price": 9999 }`}>Freelance package</option>
										<option value={`{ "id": ${account_types.company}, "price": 69999 }`}>Company package</option>
										<option value={`{ "id": ${account_types.corporate}, "price": 179999 }`}>Corporate package</option>
										<option value={`{ "id": ${account_types.enterprise}, "price": 359999 }`}>Enterprise package</option>

									</select>

									<div>{isset (this.state.package_price) ? "$" : null}{isset (this.state.package_price) ? this.state.package_price.toCurrency () : null}</div>

								</Container>

								<a href="packages" target="packages" style={{ gridColumn: 2 }}>Compare packages</a>

							</div>
						</div>

					</Container>
						
					<div className="right-justified">
						<EyecandyPanel id="payment_eyecandy" text="Processing. One moment, please..." 
							eyecandyVisible={this.state.processing} onEyecandy={this.submit_payment}>
							
							<div className="button-panel">
								<button onClick={this.props.onCancel}>Cancel</button>
								<button onClick={event => { if (this.validate (event)) this.setState ({ processing: true }) }}>Submit</button>
							</div>
							
						</EyecandyPanel>
					</div>

					<Container visible={debugging ()}>
						<br /><button onClick={() => this.setState ({ processing: false })}>Reset</button>
					</Container>

				</div>

			</div>
		</form>
	}// render;

}// DeluxeAccountForm;
