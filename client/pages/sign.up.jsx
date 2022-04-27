import React from "react";

import Container from "client/controls/container";
import CurrentAccount from "client/classes/storage/account";
import BaseControl from "client/controls/abstract/base.control";
import AccountsModel from "models/accounts";

import ExplodingPanel from "controls/panels/exploding.panel";
import EyecandyPanel from "controls/panels/eyecandy.panel";

import PasswordForm from "client/forms/password.form";

import { account_types } from "client/classes/types/constants";


export default class SignupPage extends BaseControl {


	static defaultProps = { id: "signup_page" }


	account = null;


	state = {

		account_type: account_types.free,
		payment_required: false,
		changing_password: false,
		corporate: false,

		eyecandy_visible: false,
		button_visible: true,

		error_message: null
		
	}// componentDidUpdate;


	render () {

		let parent = this.props.parent;
		let creds = CurrentAccount.all ();

		let credentials = name => { return (this.signed_in () && creds [name]) }

		return (

			<div id={this.props.id} className={this.signed_out () ? "shadow-box" : null} style={{ alignSelf: "center" }}>

				<PasswordForm visible={this.state.changing_password} />

{/* PUT THIS IN A POPUP WINDOW LIKE THE PASSWORD FORM
						<div id="outer_control" style={{ gridColumn: "span 4", alignItems: "center" }}>

							<ExplodingPanel id="payment_panel" visible={this.state.payment_required}>
								<CreditCardGadget corporate={this.state.corporate} />
							</ExplodingPanel>

						</div>
*/}


				<ExplodingPanel id="signup_error">
					<div id="signup_error_message">{this.state.error_message}</div>
				</ExplodingPanel>

				<form id="account_form" encType="multipart/form-data">

					<div className="two-piece-form">

						<input name="account_id" type="hidden" defaultValue={credentials ("account_id")} />

						<label htmlFor="first_name">First name</label>
						<input type="text" id="first_name" name="first_name" required={true} defaultValue={credentials ("first_name")} />
						<label htmlFor="last_name">Last name</label>
						<input type="text" id="last_name" name="last_name" defaultValue={credentials ("last_name")} />

						<label htmlFor="username">Username (optional)</label>
						<input type="text" id="username" name="username" defaultValue={credentials ("username")} />

						<label htmlFor="account_type">Account Type</label>

						<select id="account_type" name="account_type" defaultValue={credentials ("account_type")}
							onChange={(event) => {
								let account_type = parseInt (event.target.value);
								this.setState ({
									account_type: account_type,
									payment_required: account_type > 1,
									corporate: account_type == 3
								});
							}}>

							{Object.keys (account_types).map (key => { return (
								<option key={key} value={account_types [key]} style={{ textTransform: "capitalize" }}>{key.titled ()}</option>
							)} )}

						</select>

						<Container condition={this.signed_out ()}>

							<label htmlFor="password">Password</label>
							<input type="password" id="password" name="password" />

							<label htmlFor="confirm_password">Confirm password</label>
							<input type="password" id="confirm_password" name="confirm_password" />

						</Container>

						<label htmlFor="email_address">Email address</label>
						<input type="text" name="email_address" style={{ gridColumn: "span 3", width: "100%" }} defaultValue={credentials ("email_address")} />

					</div>

				</form>

				<div className={`${this.signed_out () ? "horizontally-spaced-out" : "right-justify"} button-bar`}>

					<Container condition={this.signed_out ()}>
						<div className="aside">
							<label style={{ marginRight: "0.5em" }}>Already an RMPC Timelog member?</label>
							<a onClick={() => { this.props.parent.setState ({ signing_up: false }) }}>Sign in</a>
						</div>
					</Container>
					
					<EyecandyPanel id="signup_panel" eyecandyVisible={this.state.eyecandy_visible}
					
						text={this.signed_in () ? "Saving your information" : "Creating your account"}

						afterEyecandy = {() => AccountsModel.save_account (new FormData (document.getElementById ("account_form"))).then (data => {
							if (this.signed_in ()) {
								parent.active_panel = parent.pages.home_panel;
								parent.setState ({ panel_states: { ...parent.state.panel_states, signup_panel: false } });
								this.setState ({ eyecandy_visible: false });
							}// if;
							throw "Cannot create account.";
						}).catch (error => this.setState ({ 
							error_message: error,
							eyecandy_visible: true 
						}))}>

						<Container condition={this.signed_in ()}>
							<button onClick={() => this.setState ({ changing_password: true })}>Change password</button>
						</Container>	

						<button onClick={() => this.setState ({ 
							error_message: null,
							eyecandy_visible: true 
						})}>{this.signed_out () ? "Sign up" : "Save changes"}</button>

					</EyecandyPanel>

				</div>

 			</div>

		);
	}// render;


}// SignupPage;