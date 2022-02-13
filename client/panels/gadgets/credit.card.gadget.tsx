import React from "react";
import BaseControl, { DefaultProps } from "client/controls/base.control";
import FadeControl from "client/controls/fade.control";


interface creditCardGadgetInterface extends DefaultProps {
	corporate: any
}// creditCardGadgetInterface;


export default class CreditCardGadget extends BaseControl<creditCardGadgetInterface> {

	render () {

		return (

			<div className="flex-grid payment-form" style={{ margin: "1.5em 0" }}>

				<label htmlFor="cc_name">Name on card</label>
				<input type="text" name="cc_name" />

				<label htmlFor="cc_number">Card number</label>
				<input type="text" name="cc_number" />

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
					<FadeControl id="license_panel" visible={this.props.corporate}>
						<label htmlFor="licence_count">Licences</label>
						<input type="text" name="licence_count" placeholder="1" />
					</FadeControl>
				</div>

			</div>

		);
	}// render;

}// CreditCardGadget;