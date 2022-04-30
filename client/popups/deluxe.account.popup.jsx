import * as constants from "classes/types/constants";
import * as common from "classes/common";

import React from "react";

import BaseControl from "controls/abstract/base.control";
import EyecandyPanel, { eyecandy_sizes } from "controls/panels/eyecandy.panel";

import CompanyCardModel from "models/company.cards";
import PricingModel from "models/pricing";

import PopupWindow from "pages/gadgets/popup.window";

import DeluxeAccountForm from "forms/deluxe.account.form";

import { MainContext } from "client/classes/types/contexts";

import "client/resources/styles/forms/deluxe.account.form.css";


export default class DeluxeAccountPopup extends BaseControl {


	state = {  

		price: null,
		company_cards: null,

		loading: true,

	}/* state */;
	

	static contextType = MainContext;

	static defaultProps = {  

		onSubmit: null,
		onCancel: null,

		option: null,
		value: null,

		visible: false

	}/* defaultProps */;


	constructor (props) {
		super (props);
		this.state.visible = props.visible;
	}// constructor;


	/********/


	load_details = () => {

		const load_price = result => this.setState ({ price: common.is_empty (result) ? "Market Price" : result [0].price }, update_load_status);
		const update_load_status = () => this.setState ({ loading: (common.is_null (this.state.price) || common.is_null (this.state.company_cards)) });

		CompanyCardModel.get_cards (this.context.company_id).then (result => this.setState ({ company_cards : result }, update_load_status));
		PricingModel.load_price (this.props.option, this.props.value).then (load_price);

	}// load_details;


	/********/


	render () {
		return <PopupWindow id="deluxe_account_window" visible={this.props.visible} afterOpening={this.load_details} afterClosing={() => this.setState ({ loading: true })}>
			<EyecandyPanel id="payment_eyecandy" text={<div>Loading. <br />One moment, please...</div>} 
				eyecandyVisible={this.state.loading} eyecandySize={eyecandy_sizes.medium}>

				<DeluxeAccountForm onCancel={this.props.onCancel} onSubmit={this.props.onSubmit} 
					option={this.props.option} optionPrice={this.state.price} 
					creditCards={this.state.company_cards}>
				</DeluxeAccountForm>

			</EyecandyPanel>
		</PopupWindow>
	}// render;

}// DeluxeAccountPopup;