import * as constants from "classes/types/constants";

import React from "react";

import CurrentAccount from "classes/storage/account";

import BaseControl from "controls/abstract/base.control";
import Container from "controls/container";
import NumericInput from "controls/inputs/numeric.input";
import CreditCardInput from "controls/inputs/credit.card.input";

import "client/resources/styles/pages/forms.css";


export default class DeluxeAccountForm extends BaseControl {


	name_checkbox = React.createRef ();


	state = { cc_name: constants.blank }


	render () {
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
							onChange={event => this.name_checkbox.current.checked = event.target.value.matches (CurrentAccount.username ())}>
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
				<CreditCardInput id="cc_number" name="cc_number" required={true} />

				<div className="break" />

				<label htmlFor="cc_expire">Expiration Date</label>
				<div className="horizontally-spaced-out">

					<select id="cc_expire_month" required={true}>
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

					<NumericInput id="cc_year" name="cc_year" required={true} style={{ width: "4rem" }} placeholder="Year" maxLength={4} />

					<div className="one-piece-form">
						<label htmlFor="cc_cvv" style={{ marginLeft: "0.5em" }}>CVV</label>
						<NumericInput id="cc_cvv" name="cc_cvv" required={true} style={{ width: "3rem" }} maxLength={3} />
					</div>

				</div>

			</div>

			<div className="break" />

			<div className="flex-aligned-right">
				<div className="one-piece-form">
					<label htmlFor="reuse_card" style={{ margin: 0 }}>Keep my card on file</label>
					<input type="checkbox" defaultValue={true} onClick={event => this.setState ({ keep_card: event.target.checked })} />
				</div>
			</div>

		</Container>
	}// render;

}// CreditCardForm;


