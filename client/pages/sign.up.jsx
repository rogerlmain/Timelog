import React from "react";

import AccountStorage from "client/classes/storage/account.storage";

import BaseControl from "client/controls/abstract/base.control";
import Container from "client/controls/container";

import ImageUploader from "client/controls/inputs/image.uploader";

import FadePanel from "client/controls/panels/fade.panel";
import ExplodingPanel from "client/controls/panels/exploding.panel";
import EyecandyPanel from "client/controls/panels/eyecandy.panel";

import PasswordForm from "client/forms/password.form";

import AccountsModel from "client/classes/models/accounts";

import { account_types, globals } from "classes/types/constants";
import { get_keys, isset, is_null, nested_value, notify, not_empty, pause } from "classes/common";

import user_image from "resources/images/guest.user.svg";


const image_uploader_style = { 
	width: "8em", 
	height: "8em", 
}// image_uploader_style;


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


	/********/


	save_account = () => {

		let form_data = new FormData (document.getElementById ("account_form"));

		if (isset (this.state.avatar)) form_data.append ("avatar", this.state.avatar);
		
		AccountsModel.save_account (form_data).then (data => {

			let account_id = nested_value (data, "account_id");
			
			if (this.signed_in ()) this.setState ({ eyecandy_visible: false });
			if (is_null (account_id)) throw "Cannot create account.";

			AccountStorage.set_all ({
				account_id		: account_id,
				first_name		: form_data.get ("first_name"),
				last_name		: form_data.get ("last_name"),
				friendly_name	: form_data.get ("friendly_name"),
				email_address	: form_data.get ("email_address"),
				account_type	: form_data.get ("account_type"),
				avatar			: form_data.get ("avatar"),
			});

			return globals.main.forceUpdate ();
		
		}).catch (error => this.setState ({ 
			error_message: error,
			eyecandy_visible: true 
		}));
		
	}// save_account;


	/********/


	render () {

		return <div id={this.props.id} className={`${this.signed_out () ? "shadow-box" : null} horizontally-centered`} style={{ alignSelf: "center" }}>

			<PasswordForm visible={this.state.changing_password} />


			{/* ADD THE OPTION TO PAY BY CREDIT CARD FOR A PRESET ACCOUNT */}


			<ExplodingPanel id="signup_error">
				<Container id="signup_error_container" visible={not_empty (this.state.error_message)}>
					<div id="signup_error_message" style={{ marginBottom: "1em" }}>{this.state.error_message}</div>
				</Container>
			</ExplodingPanel>


			<Container visible={this.signed_in ()}>
				<ImageUploader id="avatar" 
					onUpload={image => this.setState ({ avatar: image.thumbnail })}
					defaultImage={AccountStorage.avatar () ?? user_image} style={image_uploader_style}>
				</ImageUploader>
			</Container>


			<form id="account_form" ref={this.account_form} encType="multipart/form-data">

				<div className="two-piece-form with-lotsa-headspace">

					<input id="account_id" name="account_id" type="hidden" defaultValue={AccountStorage.account_id ()} />

					<label htmlFor="first_name">First name</label>
					<input type="text" id="first_name" name="first_name" required={true} defaultValue={AccountStorage.first_name ()} />

					<label htmlFor="last_name">Last name</label>
					<input type="text" id="last_name" name="last_name" required={true} defaultValue={AccountStorage.last_name ()} />

					<label htmlFor="friendly_name">Friendly name<div style={{ fontSize: "8pt" }}>(optional)</div></label>
					<input type="text" id="friendly_name" name="friendly_name" defaultValue={AccountStorage.friendly_name ()} />

					<label htmlFor="account_type">Account Type</label>

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
					<input type="text" name="email_address" style={{ gridColumn: "span 3", width: "100%" }} defaultValue={AccountStorage.email_address ()} />

				</div>

			</form>

			<div className="full-width right-justified vertically-centered with-headspace">
				<EyecandyPanel id="signup_panel" eyecandyVisible={this.state.eyecandy_visible} stretchOnly={true}

					text={this.signed_in () ? "Saving your information" : "Creating your account"}
					onEyecandy = {this.save_account}>

					<div className={`${this.signed_in () ? "right-justified" : "horizontally-spaced-out"}`} style={{ columnGap: "0.5em" }}>

						<Container visible={this.signed_in ()}>
							<button onClick={() => this.setState ({ changing_password: true })}>Change password</button>
						</Container>	

						<Container visible={this.signed_out ()}>
							<div className="aside">
								<label style={{ marginRight: "0.5em" }}>Do you already have an RMPC Timelog account?</label>
								<a onClick={() => { this.props.parent.setState ({ signing_up: false }) }}>Sign in</a>
							</div>
						</Container>

						<button onClick={() => { 

							if (this.signed_out () && (this.password_field.current.value != this.confirm_password_field.current.value)) return this.setState ({ error_message: "Password and confirmation do not match." });
							if (!this.account_form.current.validate ()) return this.setState ({ error_message: "Please complete the highlighted fields" });
							
							this.setState ({ 
								error_message: null,
								eyecandy_visible: true 
							});

						}}>{this.signed_out () ? "Sign up" : "Save changes"}</button>

					</div>

				</EyecandyPanel>
			</div>

		</div>

	}// render;


}// SignupPage;z