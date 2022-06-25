import React from "react";

import AccountStorage from "client/classes/storage/account.storage";

import Container from "controls/container";
import BaseControl from "controls/abstract/base.control";

import FadePanel from "controls/panels/fade.panel";
import ExplodingPanel from "controls/panels/exploding.panel";
import EyecandyPanel from "controls/panels/eyecandy.panel";

import PasswordForm from "forms/password.form";

import AccountsModel from "client/classes/models/accounts";

import { account_types, globals } from "classes/types/constants";
import { get_keys, is_null, nested_value, not_empty } from "classes/common";


export default class SignupPage extends BaseControl {


	static defaultProps = { id: "signup_page" }


	account_form = React.createRef ();
	password_field = React.createRef ();
	confirm_password_field = React.createRef ();

	account = null;

	state = {

		account_type: account_types.deadbeat,

		payment_required: false,
		changing_password: false,
		corporate: false,
		eyecandy_visible: false,
		button_visible: true,

		error_message: null,
		
	}// componentDidUpdate;


	render () {

		let parent = this.props.parent;

		return <div id={this.props.id} className={this.signed_out () ? "shadow-box" : null} style={{ alignSelf: "center" }}>

			<PasswordForm visible={this.state.changing_password} />


			{/* ADD THE OPTION TO PAY BY CREDIT CARD FOR A PRESET ACCOUNT */}


			<ExplodingPanel id="signup_error">
				<Container id="signup_error_container" visible={not_empty (this.state.error_message)}>
					<div id="signup_error_message" style={{ marginBottom: "1em" }}>{this.state.error_message}</div>
				</Container>
			</ExplodingPanel>

			<form id="account_form" ref={this.account_form} encType="multipart/form-data">

				<div className="two-piece-form">

					<input id="account_id" name="account_id" type="hidden" />

					<label htmlFor="first_name">First name</label>
					<input type="text" id="first_name" name="first_name" required={true} 
					
defaultValue={"Test"} />

					<label htmlFor="last_name">Last name</label>
					<input type="text" id="last_name" name="last_name" required={true}
					
defaultValue={"Dude"} />

					<label htmlFor="friendly_name">Friendly name<div style={{ fontSize: "8pt" }}>(optional)</div></label>
					<input type="text" id="friendly_name" name="friendly_name" 
					
defaultValue={"tastetestdude"} />

					<label htmlFor="account_type">AccountStorage Type</label>

					<select id="account_type" name="account_type" 
					
defaultValue={account_types.deadbeat}

						onChange={(event) => {
							let account_type = parseInt (event.target.value);
							this.setState ({
								account_type: account_type,
								payment_required: account_type > 1,
								corporate: account_type == 3
							});
						}}>

						{get_keys (account_types).map (key => { return (
							<option key={key} value={account_types [key]} style={{ textTransform: "capitalize" }}>{key.titled ()}</option>
						)} )}

					</select>

					<Container visible={this.signed_out ()}>

						<label htmlFor="password">Password</label>
						<input type="password" id="password" ref={this.password_field} name="password" required={true} 
						
defaultValue="stranger" />

						<label htmlFor="confirm_password">Confirm</label>
						<input type="password" id="confirm_password" ref={this.confirm_password_field} name="confirm_password" required={true} 
						
defaultValue="stranger" />

					</Container>

					<label htmlFor="email_address">Email address</label>
					<input type="text" name="email_address" style={{ gridColumn: "span 3", width: "100%" }} 
					
defaultValue={"tastetestdude@gmail.com"} />

				</div>

			</form>

			<div className={`${this.signed_out () ? "horizontally-spaced-out" : "right-justify"} button-bar`}>

				<FadePanel id="signup_panel" visible={!this.state.eyecandy_visible}>

					<Container visible={this.signed_out ()}>
						<div className="aside">
							<label style={{ marginRight: "0.5em" }}>Do you already have an RMPC Timelog account?</label>
							<a onClick={() => { this.props.parent.setState ({ signing_up: false }) }}>Sign in</a>
						</div>
					</Container>

					<Container visible={this.signed_in ()}>
						<button onClick={() => this.setState ({ changing_password: true })}>Change password</button>
					</Container>	

				</FadePanel>

				<EyecandyPanel id="signup_panel" eyecandyVisible={this.state.eyecandy_visible}
					text={this.signed_in () ? "Saving your information" : "Creating your account"}
					onEyecandy = {() => {

						let form_data = new FormData (document.getElementById ("account_form"));
						
						AccountsModel.save_account (form_data).then (data => {

							let account_id = nested_value (data, "account_id");
							
							if (this.signed_in ()) {
								parent.active_panel = parent.pages.home_panel;
								parent.setState ({ panel_states: { ...parent.state.panel_states, signup_panel: false } });
								this.setState ({ eyecandy_visible: false });
							}// if;
							
							if (is_null (account_id)) throw "Cannot create account.";

							AccountStorage.set_all ({
								account_id		: account_id,
								first_name		: form_data.get ("first_name"),
								last_name		: form_data.get ("last_name"),
								friendly_name	: form_data.get ("friendly_name"),
								email_address	: form_data.get ("email_address"),
								account_type	: form_data.get ("account_type"),
							});

							return globals.main.forceUpdate ();
						
						}).catch (error => this.setState ({ 
							error_message: error,
							eyecandy_visible: true 
						}));
						
					}}>

					<button onClick={() => { 

						if (this.password_field.current.value != this.confirm_password_field.current.value) return this.setState ({ error_message: "Password and confirmation do not match." });
						if (!this.account_form.current.validate ()) return this.setState ({ error_message: "Please complete the highlighted fields" });
						
						this.setState ({ 
							error_message: null,
							eyecandy_visible: true 
						});

					}}>{this.signed_out () ? "Sign up" : "Save changes"}</button>

				</EyecandyPanel>

			</div>

		</div>

	}// render;


}// SignupPage;z