import React from "react";

import BaseControl from "controls/base.control";
import PopupWindow from "pages/gadgets/popup.window";

import Break from "controls/html/line.break";


export default class PasswordForm extends BaseControl {

	static defaultProps = { showing: false }

	state = { showing: false }


	shouldComponentUpdate (new_props) {
		if (new_props.showing != this.props.showing) this.setState ({ showing: new_props.showing });
		return true;
	}// shouldComponentUpdate;


	render () {

		return <PopupWindow id="password_form" showing={this.state.showing}>

			<div className="two-column-grid">
				<label htmlFor="password">Previous password</label>
				<input type="password" id="password" name="password" />

				<Break span={2} />

				<label htmlFor="password">New password</label>
				<input type="password" id="password" name="password" />

				<label htmlFor="confirm_password">Confirm new password</label>
				<input type="password" id="confirm_password" name="confirm_password" />
			</div>

			<div className="button-bar">
				<button onClick={() => alert ("UPDATE HERE")}>Update</button>
				<button onClick={() => this.setState ({ showing: false })}>Cancel</button>
			</div>

		</PopupWindow>

	}// render;

}// PasswordForm;
