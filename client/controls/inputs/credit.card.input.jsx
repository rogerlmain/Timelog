import * as common from "classes/common";

import React from "react";
import InputMask from "react-input-mask";

import InputControl from "controls/abstract/input.control";
import ExplodingPanel from "controls/panels/exploding.panel";


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


const card_mask = {
	amex	: "**** ****** *****",
	other	: "**** **** **** ****"
}// card_mask;


const card_validator = {
	amex	: "^([\\d]{4}\\s)([\\d]{6}\\s)([\\d]{5})$",
	other	: "^([\\d]{4}\\s){3}[\\d]{4}$"
}// card_validator;


export const card_type = {
	amex		: "amex",
	visa		: "visa",
	mastercard	: "mastercard",
	discover	: "discover",
	jcb			: "jcb",
	unionpay	: "unionpay",
	other		: "other"
}// card_type;


export default class CreditCardInput extends InputControl {


	state = { 
		current_card: null,
		mask: null 
	}/* state */;


	static defaultProps = {
		id: null,
		parent: null
	}// defaultProps;


	get_card_type (card_number) {
		for (let card of Object.keys (number_patterns)) {
			for (let prefix of number_patterns [card]) {	
				if ((card_number.match (new RegExp (`^${prefix}`)) ?? []).length > 0) return card;
			}// for;
		}// for;
		return null;
	}// get_card_type;


	update_mask (event) {

		let current_card = this.get_card_type (event.target.value);
		let mask_type = (current_card == card_type.amex) ? card_type.amex : card_type.other;

		let mask = (common.isset (current_card) ? card_mask [mask_type] : null); 
		let value_empty = (event.target.value.empty () || Object.values (card_mask).includes (event.target.value))

		this.setState ({ 
			mask: value_empty ? null : mask,
			current_card: current_card
		});

		switch (common.isset (current_card)) {
			case true: event.target.setAttribute ("pattern", card_validator [mask_type]); break;
			default: {
				event.target.removeAttribute ("pattern"); 
				event.target.value = event.target.value.extractNumber ();
				break;
			}// default;
		}// switch;
		
		event.target.validate ();

		this.props.parent.setState ({ card_type: current_card });

		return true;

	}// update_mask;


	render () { 
		return <div className="flex-row">
		
			<InputMask id={this.props.id} name={this.props.id} 

defaultValue="5412 3456 7890 1234"

				mask={this.state.mask} maskChar="*" 
				pattern={card_validator [this.state.current_card]} 
				onChange={this.update_mask.bind (this)} required={true}
				style={{ textAlign: "center", width: "100%" }}>
			</InputMask>

			<ExplodingPanel id="credit_card_image">
				{common.isset (this.state.current_card) && <img src={`client/resources/images/logos/${this.state.current_card}.svg`} style={{ 
					width: "auto", 
					height: "1.4em",  
					marginLeft: "0.5em"
				}} />}
			</ExplodingPanel>

		</div>
	}// render;


}// CreditCardInput;