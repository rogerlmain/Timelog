import React from "react";

import BaseControl from "client/controls/abstract/base.control";
import Container from "client/controls/container";

import EyecandyPanel from "client/controls/panels/eyecandy.panel";
import AccountsModel from "client/classes/models/accounts.model";
import ExplodingPanel from "client/controls/panels/exploding.panel";

import { Break } from "client/controls/html/components";
import { MainContext } from "client/classes/types/contexts";
import { debugging } from "client/classes/common";
import { blank } from "client/classes/types/constants";


export default class PasswordForm extends BaseControl {


	password_form = React.createRef ();


	state = { changing_password: false }


	/********/


	static defaultProps = { 

		error_message: blank,

		visible: false,

		onChange: null,
		onCancel: null,

	}// defaultProps;


	static contextType = MainContext;


	/********/


	validate = () => {

// 		Write Issue #77, here
//		if (form_data.get ("new_password").equals (form_data.get ("confirm_password"))) return ...

		return true;

	}// validate;


	change_password = event => {

		let form_data = new FormData (this.password_form.current);

		if (!this.validate (this.password_form)) return this.setState ({ changing_password: false });

		AccountsModel.save_password (form_data).then (() => {
			this.execute (this.props.onChange);
			this.setState ({ changing_password: false });
		});

	}// change_password;


	/********/


	render () {
		return <Container>

			<ExplodingPanel id="error_panel" ref={this.error_panel}>
				<div className="form-error">{this.state.error_message}</div>
			</ExplodingPanel>

			<form ref={this.password_form}>
				<div className="two-column-grid">

					<label htmlFor="old_password">Previous password</label>
					<input type={debugging () ? "text" : "password"} id="old_password" name="old_password" required={true} defaultValue={debugging () ? "stranger" : blank} />

					<Break />

					<label htmlFor="new_password">New password</label>
					<input type={debugging () ? "text" : "password"} id="new_password" name="password" required={true} defaultValue={debugging () ? "strange1" : blank} />

					<label htmlFor="confirm_password">Confirm new password</label>
					<input type={debugging () ? "text" : "password"} id="confirm_password" name="confirm_password" required={true} defaultValue={debugging () ? "strange1" : blank} />

				</div>
			</form>

			<div className="button-bar">
				<EyecandyPanel id="password_button_panel" text="Updating..." eyecandyVisible={this.state.changing_password} onEyecandy={this.change_password}>
					<div className="button-panel">
						<button onClick={() => this.setState ({ changing_password: true })}>Update</button>
						<button onClick={() => this.context.main_page.setState ({ popup_visible: false }, () => this.execute (this.props.onCancel))}>Cancel</button>
					</div>
				</EyecandyPanel>
			</div>

		</Container>
	}// render;


}// PasswordForm;