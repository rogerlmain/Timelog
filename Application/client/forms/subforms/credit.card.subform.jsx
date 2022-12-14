import * as constants from "client/classes/types/constants";

import React from "react";

import AccountStorage from "client/classes/storage/account.storage";

import BaseControl from "client/controls/abstract/base.control";
import Container from "client/controls/container";
import ExplodingPanel from "client/controls/panels/exploding.panel";
import EyecandyPanel from "client/controls/panels/eyecandy.panel";

import "resources/styles/pages/forms.css";


const expired_message = "Card expired\nWhat are you trying to pull?";


export default class CreditCardSubform extends BaseControl {


	name_checkbox = React.createRef ();

	month_field = React.createRef ();
	year_field = React.createRef ();


	state = { 
		cc_name: constants.blank,
		form_loaded: false,
	}// state;


	static defaultProps = { 
		handler: null,
		onLoad: null,
	}// defaultProps;


	/********/


	validate_date = () => {

		let month_field = this.month_field.current;
		let year_field = this.year_field.current.input_field.current;

		let card_date = new Date (year_field.value, month_field.selectedValue ()).add (Date.parts.days, -1);
		let valid = (card_date.getTime () >= new Date ().getTime ());

		month_field.setValidity (valid, expired_message);
		year_field.setValidity (valid, expired_message);

		return valid;

	}// validate_date;


	/********/


	componentDidMount () { this.props.handler.create_card_form ("#square_form").then (this.execute (this.props.onLoad)) }


	render () {
		return <div>

			<div className="horizontally-spaced-out">
				<img src={"resources/images/logos/square.png"} className="square-logo" />
				<div className="credit-card-logos right-justified">
					<img src={"resources/images/logos/mastercard.svg"} />
					<img src={"resources/images/logos/visa.png"} />
					<img src={"resources/images/logos/discover.svg"} />
					<img src={"resources/images/logos/amex.png"} />
					<img src={"resources/images/logos/jcb.svg"} />
					<img src={"resources/images/logos/unionpay.svg"} />
				</div>
			</div>

			<br className="double" />

			<div className="one-piece-form payment-form">

				<label htmlFor="cc_name">Name on card</label>
				<div className="horizontally-spaced-out">

					<div key={this.state.cc_name}>
						<input type="text" id="cc_name" name="cc_name" style={{ width: "13em", marginRight: "1em" }} 
							defaultValue={this.state.cc_name || constants.blank} required={true}
							onChange={event => this.name_checkbox.current.checked = event.target.value.equals (AccountStorage.friendly_name ())}
							
defaultValue="Rex Strange">

						</input>
					</div>				

					<div className="one-piece-form">
						<label htmlFor="use_account_name_for_cc" className="mini-title">Just use<br />my name</label>
						<input id="use_account_name_for_cc" name="use_account_name_for_cc" ref={this.name_checkbox}
							type="checkbox" style={{ columnWidth: "min-content" }}
							onChange={event => this.setState ({ cc_name: event.target.checked ? AccountStorage.friendly_name () : constants.blank })}>
						</input>
					</div>

				</div>

			</div>

			<br />

			<div id="square_form" style={{ width: "356px", height: "120px" }} />

			<div className="right-justified-column">
				<div className="two-column-grid">
					<label htmlFor="reuse_card" style={{ margin: 0, marginRight: "0.25em" }}>Keep my card on file</label>
					<div className="vertically-centered"><input type="checkbox" id="keep_card" name="keep_card" defaultChecked={true} /></div>
				</div>
			</div>

		</div>
	}// render;

}// CreditCardSubform;


