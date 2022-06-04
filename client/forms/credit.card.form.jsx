import * as constants from "classes/types/constants";

import React from "react";

import AccountStorage from "classes/storage/account.storage";
import SquareHandler from "classes/square.handler";

import BaseControl from "controls/abstract/base.control";
import Container from "controls/container";

import "client/resources/styles/pages/forms.css";


const expired_message = "Card expired\nWhat are you trying to pull?";


export default class CreditCardForm extends BaseControl {


	name_checkbox = React.createRef ();

	month_field = React.createRef ();
	year_field = React.createRef ();


	state = { 
		cc_name: constants.blank,
		parent: null
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
		this.props.parent.state.square_handler.create_card_form ("#square_form").then (card => this.props.parent.setState ({ square_card: card }));
	}// componentDidMount;


	render () {
		return <Container>

			<div className="horizontally-spaced-out">
				<img src={"client/resources/images/logos/square.png"} className="square-logo" />
				<div className="credit-card-logos right-justify">
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
							onChange={event => this.name_checkbox.current.checked = event.target.value.equals (AccountStorage.username ())}
							
defaultValue="Rex Strange">

						</input>
					</div>				

					<div className="one-piece-form">
						<label htmlFor="use_account_name_for_cc" className="mini-title">Just use<br />my name</label>
						<input id="use_account_name_for_cc" name="use_account_name_for_cc" ref={this.name_checkbox}
							type="checkbox" style={{ columnWidth: "min-content" }}
							onChange={event => this.setState ({ cc_name: event.target.checked ? AccountStorage.username () : constants.blank })}>
						</input>
					</div>

				</div>

			</div>

			<div><br /></div>

			<div id="square_form" />

			<div className="right-justified-column keep-card-checkbox">
				<div className="two-column-grid">
					<label htmlFor="reuse_card" style={{ margin: 0, marginRight: "0.25em" }}>Keep my card on file</label>
					<div className="vertically-centered"><input type="checkbox" id="keep_card" name="keep_card" defaultChecked={true} /></div>
				</div>
			</div>

		</Container>
	}// render;

}// CreditCardForm;


