import * as constants from "classes/types/constants";
import * as common from "classes/common";

import React from "react";

import BaseControl from "controls/abstract/base.control";
import EyecandyPanel, { eyecandy_sizes } from "controls/panels/eyecandy.panel";

import PricingModel from "models/pricing";

import PopupWindow from "pages/gadgets/popup.window";

import DeluxeAccountForm from "forms/deluxe.account.form";

import "client/resources/styles/forms/deluxe.account.form.css";


export default class DeluxeAccountPopup extends BaseControl {


	state = {  loading: true }


	static defaultProps = {  

		onSubmit: null,
		onCancel: null,

		option: null,
		value: null,

		price: null,

		visible: false

	}/* defaultProps */;


	constructor (props) {
		super (props);
		this.state.visible = props.visible;
	}// constructor;


	/********/


	load_prices = () => {
		PricingModel.load_price (this.props.option, this.props.value).then (result => {
			this.setState ({ 
				price: common.is_empty (result) ? null : result [0].price,
				loading: false
			});
		});
	}// load_prices;


	/********/


	render () {
		return <PopupWindow id="deluxe_account_window" visible={this.props.visible} afterOpening={this.load_prices} afterClosing={() => this.setState ({ loading: true })}>
			<EyecandyPanel id="payment_eyecandy" text={<div>Loading. <br />One moment, please...</div>} 
				eyecandyVisible={this.state.loading} eyecandySize={eyecandy_sizes.medium}>

				<DeluxeAccountForm onCancel={this.props.onCancel} onSubmit={this.props.onSubmit} option={this.props.option} optionPrice={this.state.price} />

			</EyecandyPanel>
		</PopupWindow>
	}// render;

}// DeluxeAccountPopup;