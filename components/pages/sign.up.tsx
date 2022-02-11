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


	public state: SignupPageState;


	constructor (props: DefaultProps) {
		super (props);
	}// constructor;


	public componentDidMount () {
		this.setState ({
			button_visible: true,
			corporate: false,
			eyecandy_visible: false,
			payment_required: false,
	
			account_type: account_types.free
		});
	}// componentDidUpdate;


	render () {

		let parent = this.props.parent;

		if (common.is_null (this.account)) this.account = this.current_account ();
		let account_id = common.isset (this.account) ? this.account.account_id : null;

		return (

			<div>

				<link rel="stylesheet" href="/resources/styles/pages/accounts.css" />

				<form id="account_form" encType="multipart/form-data">

					<div className="flex-grid form-table">

						<input name="account_id" type="hidden" defaultValue={account_id} />

						<label htmlFor="first_name">First name</label>
						<input type="text" name="first_name" />
						<label htmlFor="last_name">Last name</label>
						<input type="text" name="last_name" />

						<label>Username (optional)</label>
						<input type="text" name="username" />
						<label>Account Type</label>

						<select name="account_type" defaultValue={1}
							onChange={(event) => {
								let account_type = parseInt (event.target.value);
								this.setState ({
									account_type: account_type,
									payment_required: account_type > 1,
									corporate: account_type == 3
								});
							}}>
{/* 
							{Object.entries (account_types).map (item => { return (
								<option key={item [1].title} value={item [1].value} style={{ textTransform: "capitalize" }}>{item [1].title}</option>
							)} )}
*/}							
						</select>

						<label htmlFor="password">Password</label>
						<input type="password" name="password" />
						<label htmlFor="confirm_password">Confirm password</label>
						<input type="password" />

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

				<div className="tagline" style={{ gridColumn: "1/5" }}>
					<div>{this.signed_out () ? this.tagline () : null}</div>

					<div className="overlay-container middle-right-container">

						<EyecandyPanel>
							<button onClick={() => {
								parent.setState ({ signing_status: signing_state.pending });
								this.setState ({ button_visible: false });
							}}>{this.signed_out () ? "Sign up" : "Save changes"}</button>
						</EyecandyPanel>

{/* 
						<Eyecandy visible={this.state.eyecandy_visible}
							text={this.signed_in () ? "Saving your information" : "Creating your account"}
							subtext="One moment, please"
							afterShowing={() => {

								AccountsModel.save_account (new FormData (document.getElementById ("account_form") as HTMLFormElement), (data: any) => {
									if (this.signed_in ()) {
										parent.active_panel = parent.pages.home_panel;
										parent.setState ({ panel_states: { ...parent.state.panel_states, signup_panel: false } });
										this.setState ({ eyecandy_visible: false });
									}// if;
								})

							}}
							afterHiding={() => { this.setState ({ button_visible: true }) }}>
						</Eyecandy>

						<ExplodingPanel id="button_panel" visible={this.state.button_visible} className="middle-right-container"
							afterHiding={() => { this.setState ({ eyecandy_visible: true }) }}>
						</ExplodingPanel>
*/}
					</div>

 				</div>
 
 			</div>

		);
	}// render;


}// SignupPage;