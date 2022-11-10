import React from "react";

import OptionsStorage from "client/classes/storage/options.storage";
import AccountStorage from "client/classes/storage/account.storage";

import CompanyStorage, { 
	default_name as default_company_name, 
	default_description as default_company_description 
} from "client/classes/storage/company.storage";

import ClientStorage, { 
	default_name as default_client_name, 
	default_description as default_client_description 
} from "client/classes/storage/client.storage";

import ProjectStorage, { 
	default_name as default_project_name, 
	default_description as default_project_description 
} from "client/classes/storage/project.storage";

import CompanyAccountsModel from "client/classes/models/company.accounts.model";

import BaseControl from "client/controls/abstract/base.control";
import Container from "client/controls/container";

import ImageUploader from "client/controls/inputs/image.uploader";

import FadePanel from "client/controls/panels/fade.panel";
import ExplodingPanel from "client/controls/panels/exploding.panel";
import EyecandyPanel from "client/controls/panels/eyecandy.panel";

import PasswordForm from "client/forms/password.form";

import { MasterContext } from "client/classes/types/contexts";
import { account_types, account_type_names, blank, data_errors } from "client/classes/types/constants";
import { debugging, isset, jsonify, not_empty } from "client/classes/common";
import { codify } from "client/forms/project.form";

import user_image from "resources/images/guest.user.svg";
import InvitationStorage from "client/classes/storage/invitation.storage";
import CompaniesModel from "client/classes/models/companies.model";


const image_uploader_style = { 
	width: "8em", 
	height: "8em", 
}// image_uploader_style;


export default class SignupPage extends BaseControl {


	account_creation_error = <div className="with-lotsa-legroom">
		There was a problem creating your account.<br />
		Please try again, later. If the problem persists, email us at:<br />
		<br />
		support(at)rogerlmain.com
	</div>


	company_creation_error = <div className="with-lotsa-legroom">
		Your account was created, however, there was a problem.<br />
		Try <a onClick={this.props.parent.sign_in}>logging in</a> but if you have issues please email us at:<br />
		<br />
		support(at)rogerlmain.com
	</div>


	duplicate_email_error = <div className="with-lotsa-legroom">
		There was a problem creating your account. That<br />
		email address is already registered. <a onClick={this.props.parent.sign_in}>Click here</a> to sign in

		{/* Add option to reset password, here. */}

	</div>


	account_form = React.createRef ();
	password_field = React.createRef ();
	confirm_password_field = React.createRef ();
	error_panel = React.createRef ();

	account = null;


	state = {

		account_type: account_types.deadbeat,

		payment_required: false,
		changing_password: false,
		corporate: false,
		eyecandy_visible: false,
		button_visible: true,

		existing_account: true,

		error_message: null,

		onChange: null,
		
	}// componentDidUpdate;


	/********/


	static defaultProps = { id: "signup_page" }
	static contextType = MasterContext;


	constructor (props) {
		super (props);
		this.state.existing_account = AccountStorage.signed_in ();
	}// constructor;


	/********/


	show_error = error_text => this.error_panel.current.animate (() => this.setState ({ 
		error_message: error_text,
		eyecandy_visible: false,
	}));


	report_error = error => {

		localStorage.clear ();

		if (error?.code?.equals (data_errors.duplicate)) {

			let message = error.sqlMessage;
			let fieldname = message.substring (message.indexOf (".", message.indexOf ("key")) + 1, message.indexOf ("_UNIQUE"));

			if (fieldname.matches ("email_address")) return this.show_error (this.duplicate_email_error);

		}// if;
			
		this.show_error (error);
		if (debugging (false)) console.log (`Error: ${jsonify (error)}`);

	}// report_error;


	process_application = () => {

		if (this.signed_out () && (this.password_field.current.value != this.confirm_password_field.current.value)) return this.show_error ("Password and confirmation do not match.");
		if (!this.account_form.current.validate ()) return this.show_error ("Please complete the highlighted fields");

		if (isset (this.state.error_message)) return this.error_panel.current.animate (() => this.setState ({ eyecandy_visible: true }));

		this.setState ({ eyecandy_visible: true });

	}// process_application;



	save_account = () => {

		const sign_in = () => (company_account_saved) ? this.props.parent.sign_in () : setTimeout (sign_in);

		let form_data = new FormData (document.getElementById ("account_form"));
		let company_account_saved = false;
		let invite_company_id = InvitationStorage.invitation_data ()?.company_id;

		if (isset (this.state.avatar)) form_data.append ("avatar", this.state.avatar);

		AccountStorage.save_account (form_data).then (account => {

			if (this.state.existing_account) return this.setState ({ eyecandy_visible: false }, () => this.context.master_page.setState ({ avatar: this.state.avatar }));

			if (isset (invite_company_id)) return CompanyAccountsModel.save_company_account (FormData.fromObject ({
				account_id: account.account_id,
				company_id: invite_company_id,
			})).then (() => 
{			

	CompanyStorage.load_companies ().then (this.props.parent.sign_in);
			
}			
			);
			
			CompanyStorage.save_company (FormData.fromObject ({
				name: default_company_name,
				description: default_company_description,
				primary_contact_id: account.account_id,
			})).then (company => {

				CompanyStorage.set_active_company (company.company_id);

				CompanyAccountsModel.save_company_account (FormData.fromObject ({
					account_id: account.account_id,
					company_id: company.company_id,
				})).then (() => { company_account_saved = true });

				ClientStorage.save_client (FormData.fromObject ({ 
					client_name: default_client_name,
					client_description: default_client_description,
					company_id: company.company_id,
				})).then (client => {
					ProjectStorage.save_project (FormData.fromObject ({
						client_id: client.client_id,
						project_name: default_project_name,
						project_code: codify (default_project_name),
						project_description: default_project_description,
					})).then (() => OptionsStorage.default_options (parseInt (account.account_type)).then (sign_in));
				});

			}).catch (error => this.report_error (this.company_creation_error));

		}).catch (error => this.report_error (this.account_creation_error));

	}// save_account;


	/********/


	componentDidMount = () => this.context.load_popup (<PasswordForm />);


	render () {

		let signed_in = this.signed_in ();
		let signed_out = this.signed_out ();

		return <div id={this.props.id} className={`${signed_out ? "shadow-box" : null} horizontally-centered`}>

			{/* ADD THE OPTION TO PAY BY CREDIT CARD FOR A PRESET ACCOUNT */}


			<ExplodingPanel id="signup_error" ref={this.error_panel} afterChanging={this.state.onChange}>
				<Container id="signup_error_container" visible={not_empty (this.state.error_message)}>
					<div id="signup_error_message" style={{ marginBottom: "1em" }}>{this.state.error_message}</div>
				</Container>
			</ExplodingPanel>


			<Container visible={signed_in}>
				<ImageUploader id="avatar" 
					onUpload={image => this.setState ({ avatar: image.thumbnail })}
					defaultImage={AccountStorage.avatar () ?? user_image} style={image_uploader_style}>
				</ImageUploader>
			</Container>


			<form id="account_form" ref={this.account_form} encType="multipart/form-data">

				<div className={`two-piece-form ${signed_in ? "with-lotsa-headspace" : blank}`}>

					<input id="account_id" name="account_id" type="hidden" defaultValue={AccountStorage.account_id ()} />

					<label htmlFor="first_name">First name</label>
					<input type="text" id="first_name" name="first_name" required={true} 
						defaultValue={(debugging () && signed_out) ? "High" : AccountStorage.first_name ()}>
					</input>

					<label htmlFor="last_name">Last name</label>
					<input type="text" id="last_name" name="last_name" required={true} 
						defaultValue={(debugging () && signed_out) ? "Priest" : AccountStorage.last_name ()}>
					</input>

					<label htmlFor="friendly_name">Friendly name<div style={{ fontSize: "8pt" }}>(optional)</div></label>
					<input type="text" id="friendly_name" name="friendly_name" defaultValue={AccountStorage.friendly_name ()} />

					<label htmlFor="account_type">Account Type</label>
					<select id="account_type" name="account_type" defaultValue={account_types.deadbeat}

						onChange={(event) => {
							let account_type = parseInt (event.target.value);
							this.setState ({
								account_type: account_type,
								payment_required: account_type > 1,
								corporate: account_type == 3
							});
						}}>

						{account_types.map_keys (key => <option key={key} value={account_types [key]}>{account_type_names [key]}</option>)}

					</select>

{/* Temporary - for the Beta Promotion */}
{/* <input type="hidden" name="account_type" value={account_types.freelance} /> */}

					<Container visible={signed_out}>

						<label htmlFor="password">Password</label>
						<input type="password" id="password" ref={this.password_field} name="password" required={true} defaultValue={debugging () ? "stranger" : null} />

						<label htmlFor="confirm_password">Confirm</label>
						<input type="password" id="confirm_password" ref={this.confirm_password_field} name="confirm_password" required={true} defaultValue={debugging () ? "stranger" : null} />

					</Container>

					<label htmlFor="email_address">Email address</label>
					<input type="text" name="email_address" required={true} style={{ gridColumn: "span 3", width: "100%" }} 
						defaultValue={(debugging () && signed_out) ? "high.priest@solipsology.org" : AccountStorage.email_address ()}>
					</input>

				</div>

			</form>

			<div className="full-width with-headspace">
				<div className={`${signed_in ? "right-justified" : "horizontally-spaced-out"}`} style={{ columnGap: "0.5em" }}>

					{signed_out && <FadePanel id="signin_link_panel" visible={!this.state.eyecandy_visible}>
						<div className="aside">
							<label style={{ marginRight: "0.5em" }}>Do you already have a Bundion account?</label>
							<a onClick={this.props.parent.sign_in}>Sign in</a>
						</div>
					</FadePanel>}

					<EyecandyPanel id="signup_panel" eyecandyVisible={this.state.eyecandy_visible} stretchOnly={false}

						text={signed_in ? "Saving your information" : "Creating your account"}
						onEyecandy = {this.save_account}>
						
						<div className="button-panel">
							{signed_in && <button onClick={() => this.context.show_popup ()}>Change password</button>}
							<button onClick={() => this.process_application ()}>{signed_out ? "Sign up" : "Save changes"}</button>
						</div>

					</EyecandyPanel>
					
				</div>
			</div>

		</div>

	}// render;


}// SignupPage;z