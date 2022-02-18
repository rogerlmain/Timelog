import * as React from "react";

import * as common from "classes/common";

import BaseControl, { DefaultProps, DefaultState } from "controls/base.control";
import ExplodingPanel from "controls/panels/exploding.panel";
import Eyecandy from "controls/eyecandy";

import CreditCardGadget from "pages/gadgets/credit.card.gadget";
import AccountsModel from "models/accounts";

import { account_types, account_type_object, signing_state } from "types/constants";
import EyecandyPanel from "controls/panels/eyecandy.panel";


interface SignupPageState extends DefaultState {

	account_type: account_type_object;
	payment_required: boolean;
	corporate: boolean;

	eyecandy_visible: boolean;
	button_visible: boolean;

	error_message: string;

}// SignupPageState;


export default class SignupPage extends BaseControl<DefaultProps, SignupPageState> {


	private account: any = null;
	public account_id_field: React.RefObject<any> = React.createRef ();


	private tagline = () => {

		var parent = this.props.parent;

		return (
			<div>
				<label style={{ marginRight: "0.5em" }}>Already an RMPC Timelog member?</label>
				<a onClick={() => { parent.setState ({ signing_up: false }) }}>Sign in</a>
			</div>
		);
	}// tagline;


	/********/


	public state: SignupPageState = {

		account_type: account_types.free,
		payment_required: false,
		corporate: false,

		eyecandy_visible: false,
		button_visible: true,

		error_message: null
		
	}// componentDidUpdate;


	render () {

		let parent = this.props.parent;

		if (common.is_null (this.account)) this.account = this.current_account ();
		let account_id = common.isset (this.account) ? this.account.account_id : undefined;

		return (

			<div className="shadow-box" style={{ alignSelf: "center" }}>

				<link rel="stylesheet" href="/resources/styles/pages/accounts.css" />

				<ExplodingPanel id="signup_error">{this.state.error_message}</ExplodingPanel>

				<form id="account_form" encType="multipart/form-data">

					<div className="flex-grid form-table">

						<input name="account_id" type="hidden" defaultValue={account_id} />

						<label htmlFor="first_name">First name</label>
						<input type="text" id="first_name" name="first_name" required={true} />
						<label htmlFor="last_name">Last name</label>
						<input type="text" id="last_name" name="last_name" />

						<label htmlFor="username">Username (optional)</label>
						<input type="text" id="username" name="username" />
						<label htmlFor="account_type">Account Type</label>

						<select id="account_type" name="account_type" defaultValue={1}
							onChange={(event) => {
								let account_type = parseInt (event.target.value);
								this.setState ({
									account_type: account_type,
									payment_required: account_type > 1,
									corporate: account_type == 3
								});
							}}>

							{Object.entries (account_types).map (item => { return (
								<option key={item [1].title} value={item [1].value} style={{ textTransform: "capitalize" }}>{item [1].title}</option>
							)} )}

						</select>

						<label htmlFor="password">Password</label>
						<input type="password" id="password" name="password" />
						<label htmlFor="confirm_password">Confirm password</label>
						<input type="password" id="confirm_password" name="confirm_password" />

						<label htmlFor="email_address">Email address</label>
						<input type="text" name="email_address" style={{ gridColumn: "span 3", width: "100%" }} />

{/* 
						<div id="outer_control" style={{ gridColumn: "span 4", alignItems: "center" }}>

							<ExplodingPanel id="payment_panel" visible={this.state.payment_required}>
								<CreditCardGadget corporate={this.state.corporate} />
							</ExplodingPanel>

						</div>
*/}
					</div>

				</form>

				<br />

				<div className="tagline" style={{ gridColumn: "1/5" }}>
					<div>{this.signed_out () ? this.tagline () : null}</div>

					<div className="overlay-container middle-right-container">

						<EyecandyPanel id="signup_panel" eyecandyVisible={this.state.eyecandy_visible}
						
							eyecandyText={this.signed_in () ? "Saving your information" : "Creating your account"}

							afterEyecandy = {() => AccountsModel.save_account (new FormData (document.getElementById ("account_form") as HTMLFormElement)).then ((data: any) => {
								if (this.signed_in ()) {
									parent.active_panel = parent.pages.home_panel;
									parent.setState ({ panel_states: { ...parent.state.panel_states, signup_panel: false } });
									this.setState ({ eyecandy_visible: false });
								}// if;
								throw "Cannot create account.";
							}).catch ((error: Error) => this.setState ({ 
								error_message: error,
								eyecandy_visible: true 
							}))}>

							<div className="middle-right-container">
								<button onClick={() => this.setState ({ 
									error_message: null,
									eyecandy_visible: true 
								})}>{this.signed_out () ? "Sign up" : "Save changes"}</button>
							</div>
							
						</EyecandyPanel>

					</div>

 				</div>
 
 			</div>

		);
	}// render;


}// SignupPage;