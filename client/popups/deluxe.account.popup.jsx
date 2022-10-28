import React from "react";

import BaseControl from "client/controls/abstract/base.control";
import PopupWindow from "client/gadgets/popup.window";
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


	/********/


	render () {
		return <PopupWindow id="deluxe_account_window" visible={this.props.visible}>
			<DeluxeAccountForm onCancel={this.props.onCancel} onSubmit={this.props.onSubmit} option={this.props.option} value={this.props.value} />
		</PopupWindow>
	}// render;

}// DeluxeAccountPopup;