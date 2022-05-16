import React from "react";

import BaseControl from "controls/abstract/base.control";
import PopupWindow from "pages/gadgets/popup.window";

import { Break } from "controls/html/components";


export default class PasswordForm extends BaseControl {

	static defaultProps = { visible: false }

	state = { visible: false }


	shouldComponentUpdate (new_props) {
		if (new_props.visible != this.props.visible) this.setState ({ visible: new_props.visible });
		return true;
	}// shouldComponentUpdate;


	render () {

		return <PopupWindow id="password_form" visible={this.state.visible}>

			<div className="two-column-grid">
				<label htmlFor="old_password">Previous password</label>
				<input type="password" id="old_password" name="old_password" />

				<Break span={2} />

				<label htmlFor="new_password">New password</label>
				<input type="password" id="new_password" name="password" />

				<label htmlFor="confirm_new_password">Confirm new password</label>
				<input type="password" id="confirm_new_password" name="confirm_new_password" />
			</div>

			<div className="button-bar">
				<button onClick={() => alert ("UPDATE HERE")}>Update</button>
				<button onClick={() => this.setState ({ visible: false })}>Cancel</button>
			</div>

		</PopupWindow>

	}// render;

}// PasswordForm;
