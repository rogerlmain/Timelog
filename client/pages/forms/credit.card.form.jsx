import * as constants from "classes/types/constants";

import React from "react";

import CurrentAccount from "classes/storage/account";

import BaseControl from "controls/abstract/base.control";
import Container from "controls/container";
import CreditCardInput, { card_type } from "controls/inputs/credit.card.input";
import NumericInput from "controls/inputs/numeric.input";

import "client/resources/styles/pages/forms.css";


const expired_message = "Card expired\nWhat are you trying to pull?";


export default class DeluxeAccountForm extends BaseControl {


	name_checkbox = React.createRef ();

	month_field = React.createRef ();
	year_field = React.createRef ();


	state = { 
		cc_name: constants.blank,
		card_type: null
	}/* state */


	/********/


	validate_date = () => {

		let month_field = this.month_field.current;
		let year_field = this.year_field.current.input_field.current;

		let card_date = new Date (year_field.value, month_field.selectedValue ()).add (-1, Date.parts.day);
		let valid = (card_date.getTime () >= new Date ().getTime ());

		month_field.setValidity (valid, expired_message);
		year_field.setValidity (valid, expired_message);

		return valid;

	}// validate_date;


	/********/


	componentDidMount () { 
		this.month_field.current.addValidator (this.validate_date);
		this.year_field.current.input_field.current.addValidator (this.validate_date);
	}// componentDidMount;


	render () {

		let this_year = new Date ().getFullYear ();
		let cvv_length = (this.state.card_type == card_type.amex) ? 4 : 3;

		return <Container>

			<div className="horizontally-spaced-out">
				<img src={"client/resources/images/logos/square.png"} className="square-logo" />
				<div className="credit-card-logos right-justified-container">
					<img src={"client/resources/images/logos/mastercard.svg"} />
					<img src={"client/resources/images/logos/visa.png"} />
					<img src={"client/resources/images/logos/discover.svg"} />
					<img src={"client/resources/images/logos/amex.png"} />
					<img src={"client/resources/images/logos/JCB.svg"} />
					<img src={"client/resources/images/logos/unionpay.svg"} />
				</div>
			</div>

			<br className="double" />

			<div className="one-piece-form payment-form">

				<label htmlFor="cc_name">Name on card</label>
				<div className="horizontally-spaced-out">

					<div key={this.state.cc_name}>
						<input type="text" id="cc_name" name="cc_name" style={{ width: "13em", marginRight: "1em" }} 
							defaultValue={this.state.cc_name || constants.blank} required={true}
							onChange={event => this.name_checkbox.current.checked = event.target.value.equals (CurrentAccount.username ())}
							
defaultValue="Rex Strange">

						</input>
					</div>				

					<div className="one-piece-form">
						<label htmlFor="use_account_name_for_cc" className="mini-title">Just use<br />my name</label>
						<input id="use_account_name_for_cc" name="use_account_name_for_cc" ref={this.name_checkbox}
							type="checkbox" style={{ columnWidth: "min-content" }}
							onChange={event => this.setState ({ cc_name: event.target.checked ? CurrentAccount.username () : constants.blank })}>
						</input>
					</div>

				</div>

				<label htmlFor="cc_number">Card number</label>
				<CreditCardInput id="cc_number" name="cc_number" required={true} parent={this} />

				<div className="break" />

				<label htmlFor="cc_expire">Expiration Date</label>
				<div className="horizontally-spaced-out">

					<select id="cc_expire_month" ref={this.month_field} required={true} onChange={this.validate_date}
defaultValue={5}>
						<option />
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

					<NumericInput id="cc_year" ref={this.year_field} required={true} placeholder="Year" min={this_year} max={this_year + 10} onChange={this.validate_date}
defaultValue={2022} />


					<div className="one-piece-form">
						<label htmlFor="cc_cvv" style={{ marginLeft: "0.5em" }}>CVV</label>
						<NumericInput id="cc_cvv" required={true} length={cvv_length}
defaultValue={123} />
					</div>

				</div>

			</div>

			<div className="break" />

			<div className="flex-aligned-right">
				<div className="one-piece-form">
					<label htmlFor="reuse_card" style={{ margin: 0 }}>Keep my card on file</label>
					<input id="keep_card" name="keep_card" type="checkbox" defaultValue={true} onClick={event => this.setState ({ keep_card: event.target.checked })} />
				</div>
			</div>

		</Container>
	}// render;

}// CreditCardForm;


