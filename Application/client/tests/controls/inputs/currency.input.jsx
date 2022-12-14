import "regenerator-runtime/runtime.js";
import "classes/types/prototypes";

import "resources/styles/main.css";

import React from "react";
import BaseControl from "client/controls/abstract/base.control";

import CurrencyInput from "client/controls/inputs/currency.input";
import OptionsStorage from "client/classes/storage/options.storage";


export default class Test extends BaseControl {


	state = { use_dates: true }


	/********/


	constructor (props) {
		super (props);
	}// constructor;


	/********/


	render () {
		return <div className="full-screen fully-centered" style={{ border: "solid 1px blue !important" }}>
			<div onLoad={() => alert ("loading...")}>

				<CurrencyInput id={this.props.id ?? "currency_input"} className="rate-field" defaultValue={OptionsStorage.default_rate () ?? 0} />

			</div>
		</div>
	}// render;


}// Test;


