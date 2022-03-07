import React from "react";
import BaseControl from "client/controls/base.control";
import ExplodingPanel from "controls/panels/exploding.panel";
import PopupWindow from "pages/gadgets/popup.window";

export default class CreditCardForm extends BaseControl {


	static defaultProps = { 
		showing: false,
		onSubmit: null,
		onCancel: null
	}// defaultProps;


	shouldComponentUpdate (new_props) {
		if (new_props.showing != this.props.showing) this.setState ({ showing: new_props.showing });
		return true;
	}// shouldComponentUpdate;


	render () {

		return (<PopupWindow id="credit_card_form" showing={this.state.showing}>

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
					<ExplodingPanel id="license_panel">
						<label htmlFor="licence_count">Licences</label>
						<input type="text" name="licence_count" placeholder="1" />
					</ExplodingPanel>
				</div>

			</div>

			<div className="button-bar">
				<button onClick={this.props.onSubmit}>Submit</button>
				<button onClick={() => this.setState ({ showing: false }, this.props.onCancel)}>Cancel</button>
			</div>

		</PopupWindow>);
	}// render;

}// CreditCardForm;