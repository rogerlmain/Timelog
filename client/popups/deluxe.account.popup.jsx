import * as common from "classes/common";

import React from "react";

import BaseControl from "controls/abstract/base.control";
import EyecandyPanel, { eyecandy_sizes } from "controls/panels/eyecandy.panel";

import CompanyCardModel from "client/classes/models/company.cards.model";
import PricingModel from "client/classes/models/pricing.model";

import PopupWindow from "pages/gadgets/popup.window";

import DeluxeAccountForm from "forms/deluxe.account.form";

import { MasterContext } from "client/classes/types/contexts";

import "resources/styles/forms/deluxe.account.form.css";


export default class DeluxeAccountPopup extends BaseControl {


	state = {  

		price: null,
		credit_cards: null,

		loading: true,
		credit_cards_loading: true,

		has_credit: false,

	}/* state */;
	

	static contextType = MasterContext;

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
		const update_load_status = () => this.setState ({ loading: (common.is_null (this.state.price) || this.state.credit_cards_loading) });

		switch (common.isset (this.context.company_id)) {
			case true: CompanyCardModel.get_cards (this.context.company_id).then (result => this.setState ({ 
				credit_cards : result,
				credit_cards_loading: false,
			}, () => {
				this.setState ({ has_credit: common.not_empty (result) });
				update_load_status ();
			})); break;
			default: this.setState ({ credit_cards_loading: false });
		}// switch;
		
		PricingModel.load_price (this.props.option, this.props.value).then (load_price);

	}// load_details;


	/********/


	render () {
		return <PopupWindow id="deluxe_account_window" visible={this.props.visible} afterOpening={this.load_details} afterClosing={() => this.setState ({ loading: true })}>
			<EyecandyPanel id="payment_eyecandy" text={<div>Loading. <br />One moment, please...</div>} 
				eyecandyVisible={this.state.loading} eyecandySize={eyecandy_sizes.medium}>
					<DeluxeAccountForm onCancel={this.props.onCancel} onSubmit={this.props.onSubmit} 
						option={this.props.option} optionPrice={this.state.price} hasCredit={this.state.has_credit}
						creditCards={this.state.credit_cards}>
					</DeluxeAccountForm>
			</EyecandyPanel>
		</PopupWindow>
	}// render;

}// DeluxeAccountPopup;