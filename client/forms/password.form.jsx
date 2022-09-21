import React from "react";

import BaseControl from "client/controls/abstract/base.control";
import PopupWindow from "pages/gadgets/popup.window";

import { Break } from "client/controls/html/components";
import EyecandyPanel from "client/controls/panels/eyecandy.panel";
import AccountsModel from "client/classes/models/accounts.model";
import { exists } from "client/classes/common";


export default class PasswordForm extends BaseControl {


	password_form = React.createRef ();


	state = { 
		changing_password: false,
		visible: false,
	}// state;


	/********/


	static defaultProps = { 
		visible: false,
		onChange: null,
	}// defaultProps;


	/********/


	change_password = event => {

		if (!this.validate (this.password_form)) return this.setState ({ changing_password: false });

		let form_data = new FormData (this.password_form.current);

return;

		this.setState ({ changing_password: true }, () => AccountsModel.save_account (form_data).then (result => this.execute (this.props.onChange)));
	}// change_password;


	/********/


	shouldComponentUpdate (new_props) {
		if (new_props.visible != this.props.visible) this.setState ({ visible: new_props.visible });
		return true;
	}// shouldComponentUpdate;


	render () {
		return <PopupWindow id="password_form_window" visible={this.state.visible}>

			<form ref={this.password_form}>
				<div className="two-column-grid">

					<label htmlFor="old_password">Previous password</label>
					<input type="password" id="old_password" name="old_password" required={true} />

					<Break span={2} />

					<label htmlFor="new_password">New password</label>
					<input type="password" id="new_password" name="password" required={true} />

					<label htmlFor="confirm_new_password">Confirm new password</label>
					<input type="password" id="confirm_new_password" name="confirm_new_password" required={true} />

				</div>
			</form>

			<div className="button-bar">
				<EyecandyPanel id="password_button_panel" text="Updating..."
				
					eyecandyVisible={this.state.changing_password} onEyecandy={this.change_password}>
						
					<button onClick={() => this.setState ({ changing_password: true })}>Update</button>
					<button onClick={() => this.setState ({ visible: false })}>Cancel</button>

				</EyecandyPanel>
			</div>

		</PopupWindow>
	}// render;


}// PasswordForm;
