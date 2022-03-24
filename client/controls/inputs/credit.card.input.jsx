import React from "react";
import InputControl, { mask_character } from "controls/abstract/input.control";

import NumericInput from "controls/inputs/numeric.input";
import ExplodingPanel from "controls/panels/exploding.panel";

import { isset, is_number } from "classes/common";
import { blank, space } from "classes/types/constants";


const card_types = {
	amex		: "amex",
	visa		: "visa",
	mastercard	: "mastercard",
	discover	: "discover",
	jcb			: "jcb",
	unionpay	: "unionpay"
}// card_types;


const card_names = {
	amex		: "American Express",
	visa		: "Visa",
	mastercard	: "Mastercard",
	discover	: "Discover",
	jcb			: "JCB",
	unionpay	: "UnionPay"
}// card_names;


const number_patterns = {
	amex		: [34, 37],
	visa		: [4],
	mastercard	: Array.range (51, 55).concat (Array.range (2221, 2720)),
	discover	: [6011, 65].concat (Array.range (644, 649), Array.range (622126, 622925)),
	jcb			: Array.range (3528, 3589),
	unionpay	: [62]
}// number_patterns;


const card_masks = {
	amex	: "**** ****** *****",
	other	: "**** **** **** ****"
}// card_masks;


export default class CreditCardInput extends InputControl {


	state = { 
		current_card: null,
		cursor_position: null,
		value: blank
	}// state;


	get_card_type (card_number) {
		for (let card of Object.keys (number_patterns)) {
			for (let prefix of number_patterns [card]) {
				if ((card_number.match (new RegExp (`^${prefix}`)) ?? []).length > 0) return card;
			}// for;
		}// for;
		return null;
	}// get_card_type;


	verify (event) {

		let card_type = this.get_card_type (event.target.value);
		let cursor_location = event.target.selectionStart;

		const get_index = () => {
			let previous_char = event.target.value.charAt (cursor_location - 1);
			return ((previous_char == mask_character) || (previous_char == space)) ? event.target.value.indexOf (mask_character) : cursor_location;
		}/* get_index */;

		event.target.value = this.masked (event.target.value, card_masks [(card_type == card_types.amex) ? card_types.amex : "other"]);
		event.target.selectionStart = event.target.selectionEnd = get_index ();	

		this.setState ({ current_card: card_type });

	}// verify;


	render () { return <div className="flex-row">
		
		<NumericInput {...this.props} type="text" style={{ width: "100%" }} masked={true} onChange={this.verify.bind (this)} />

		<ExplodingPanel id="credit_card_image">
			{isset (this.state.current_card) && <img src={`client/resources/images/logos/${this.state.current_card}.svg`} style={{ 
				width: "auto", 
				height: "27px",  
				marginLeft: "0.5em"
			}} />}
		</ExplodingPanel>

	</div>}

}// CreditCardInput;