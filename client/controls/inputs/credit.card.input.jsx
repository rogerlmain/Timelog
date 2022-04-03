import React from "react";
import InputMask from "react-input-mask";

import InputControl from "controls/abstract/input.control";
import ExplodingPanel from "controls/panels/exploding.panel";

import { isset } from "classes/common";


const card_type = {
	amex		: "amex",
	visa		: "visa",
	mastercard	: "mastercard",
	discover	: "discover",
	jcb			: "jcb",
	unionpay	: "unionpay",
	other		: "other"
}// card_type;


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


export default class CreditCardInput extends InputControl {


	input_field = React.createRef ();


	state = { mask: null }


	get_card_type (card_number) {
		for (let card of Object.keys (number_patterns)) {
			for (let prefix of number_patterns [card]) {	
				if ((card_number.match (new RegExp (`^${prefix}`)) ?? []).length > 0) return card;
			}// for;
		}// for;
		return null;
	}// get_card_type;


	update_mask (event) {

		let type = this.get_card_type (event.target.value);

		this.setState ({ 
			mask: (type == card_type.amex) ? card_mask.amex : card_mask.other,
			current_card: type
		});

	}// update_mask;


	render () { 
		return <div className="flex-row">
		
			<InputMask mask={this.state.mask} maskChar="*" onChange={this.update_mask.bind (this)} 
				style={{ 
					textAlign: "center",
					width: "100%"
				}}>
			</InputMask>

			<ExplodingPanel id="credit_card_image">
				{isset (this.state.current_card) && <img src={`client/resources/images/logos/${this.state.current_card}.svg`} style={{ 
					width: "auto", 
					height: "1.4em",  
					marginLeft: "0.5em"
				}} />}
			</ExplodingPanel>

		</div>
	}// render;


}// CreditCardInput;