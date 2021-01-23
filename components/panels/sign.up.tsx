import * as React from "react";

import * as common from "components/classes/common";

import BaseControl, { defaultInterface } from "components/controls/base.control";
import FadeControl from "components/controls/fade.control";
import Eyecandy from "components/controls/eyecandy";

import CreditCardGadget from "components/panels/gadgets/credit.card.gadget";

import { account_types, signing_state } from "components/types/constants";



export default class SignupPanel extends BaseControl<defaultInterface> {


	private account = null;
	public account_id_field: React.RefObject<any> = React.createRef ();


	private tagline = () => {

		var parent = this.props.parent;

		return (
			<div>
				<label style={{ marginRight: "0.5em" }}>Already an RMPC Timelog member?</label>
				<a onClick={() => { parent.load_panel (parent.panels.signin_panel) }}>Sign in</a>
			</div>
		);
	}// tagline;


	/********/


	public state = {

		account_type: account_types.free,
		payment_required: false,
		corporate: false,

		eyecandy_visible: false,
		button_visible: true

	}// state;


	constructor (props) {
		super (props);
	}// constructor;


	render () {

		let parent = this.props.parent;

		if (common.is_null (this.account)) this.account = this.current_account ();
		let account_id = common.isset (this.account) ? this.account.account_id : null;

		return (

			<div>

				<form id="account_form" encType="multipart/form-data">

					<div className="flex-grid form-table">

						<input id="account_id_field" name="account_id" type="hidden" ref={this.create_reference} defaultValue={account_id} />

						<label htmlFor="first_name">First name</label>
						<input type="text" name="first_name" defaultValue={this.debug_value ()} />
						<label htmlFor="last_name">Last name</label>
						<input type="text" name="last_name" defaultValue={this.debug_value ()} />

						<label>Username (optional)</label>
						<input type="text" name="username" defaultValue={this.debug_value ()} />
						<label>Account Type</label>

						<select id="account_type" name="account_type" ref={this.create_reference} defaultValue={1}
							onChange={(event) => {
								let account_type = parseInt (event.target.value);
								this.setState ({
									account_type: account_type,
									payment_required: account_type > 1,
									corporate: account_type == 3
								});
							}}>
							{Object.entries (account_types).map (item => { return (
								<option value={item [1].value} style={{ textTransform: "capitalize" }}>{item [1].title}</option>
							)} )}
						</select>

						<label htmlFor="password">Password</label>
						<input type="password" name="password" />
						<label htmlFor="confirm_password">Confirm password</label>
						<input type="password" />

						<label htmlFor="email_address">Email address</label>
						<input type="text" name="email_address" defaultValue={this.debug_value ()} style={{ gridColumn: "span 3", width: "100%" }} />

						<div id="outer_control" style={{ gridColumn: "span 4", alignItems: "center" }}>

							<FadeControl id="payment_panel" visible={this.state.payment_required} vanishing={true}>
								<CreditCardGadget corporate={this.state.corporate} />
							</FadeControl>

						</div>

					</div>

				</form>

				<div className="tagline" style={{ gridColumn: "1/5" }}>
					<div>{this.signed_out () ? this.tagline () : null}</div>

					<div className="overlay-container center-right-container">

						<Eyecandy visible={this.state.eyecandy_visible}
							text={this.signed_in () ? "Saving your information" : "Creating your account"}
							subtext="One moment, please"
							afterShowing={() => {
								fetch ("/account", {
									method: "POST",
									body: new FormData (document.getElementById ("account_form") as HTMLFormElement),
									credentials: "same-origin"
								}).then (response => response.json ()).then (data => {
									if (this.signed_in ()) {
										parent.active_panel = parent.panels.home_panel;
										parent.setState ({ panel_states: { ...parent.state.panel_states, signup_panel: false } });
										this.setState ({ eyecandy_visible: false });
									}// if;
								});
							}}
							afterHiding={() => { this.setState ({ button_visible: true }) }}>
						</Eyecandy>

						<FadeControl visible={this.state.button_visible}
							afterHiding={() => { this.setState ({ eyecandy_visible: true }) }}>
							<button onClick={() => {
								parent.setState ({ signing_status: signing_state.pending });
								this.setState ({ button_visible: false });
							}}>{this.signed_out () ? "Sign up" : "Save changes"}</button>
						</FadeControl>

					</div>

				</div>

			</div>

		);
	}// render;


}// SignupPanel;