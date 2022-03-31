import React from "react";

import BaseControl from "controls/abstract/base.control";
import Container from "controls/container";
import CreditCardInput from "controls/inputs/credit.card.input";
import ExplodingPanel from "controls/panels/exploding.panel";


export default class DeluxeAccountForm extends BaseControl {

	render () {
		return <Container>

			<div className="one-piece-form payment-form">

				<label htmlFor="cc_name">Name on card</label>
				<input type="text" name="cc_name" />

				<label htmlFor="cc_number">Card number</label>
				<CreditCardInput name="cc_number" />

				<break />

				<label htmlFor="cc_expire">Expiration Date</label>
				<div className="select-list subpanel">
					<select>
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
					<input type="text" placeholder="Year" />
				</div>

				<label htmlFor="cc_cvv">CVV</label>
				<div className="cc-details subpanel">
					<input type="text" name="cc_cvv" />
					<ExplodingPanel id="license_panel">
						<Container id="licence_form">
							<label htmlFor="licence_count">Licences</label>
							<input type="text" name="licence_count" placeholder="1" />
						</Container>
					</ExplodingPanel>
				</div>

			</div>

			<break />

			<div className="flex-aligned-right" style={{ marginTop: "1em" }}>
				<div className="one-piece-form">
					<label htmlFor="reuse_card" style={{ margin: 0 }}>Keep card on file</label>
					<input type="checkbox" defaultValue={true} onClick={event => this.setState ({ keep_card: event.target.checked })} />
				</div>
			</div>

		</Container>
	}// render;

}// CreditCardForm;


