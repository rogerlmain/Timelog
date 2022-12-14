import React from "react";

import Container from "client/controls/container";
import BaseControl from "client/controls/abstract/base.control";
import EyecandyForm from "client/controls/forms/eyecandy.form";

import AccountStorage from "client/classes/storage/account.storage";
import CompanyStorage from "client/classes/storage/company.storage";

import EmailModel from "client/classes/models/email.model";

import { blank } from "client/classes/types/constants";
import { debugging, isset, not_set } from "client/classes/common";


const test = {
	first_name: "The High",
	last_name: "Priest",
	email_address: "high.priest@solipsology.org",
}/* test */;


export default class InviteForm extends BaseControl {


	state = { 
		invitee: null,
		form_data: null,
	}/* state */;


	invite_eyecandy_form = React.createRef ();
	

	/********/


	invite_contributor = data => {

		data.append ("host_id", AccountStorage.account_id ());
		data.append ("host_name", AccountStorage.full_name ());
		data.append ("company_name", CompanyStorage.company_name ());
		data.append ("company_id", CompanyStorage.active_company_id ());

		return EmailModel.send_invite (data);

	}/* invite_contributor */;


	invite_form = () => <Container>
		
		<input type="hidden" id="company_id" value={CompanyStorage.active_company_id ()} />

		<div className="two-piece-form">

			<label htmlFor="invitee_first_name">First name</label>
			<input type="text" id="invitee_first_name" name="invitee_first_name" placeholder="Name" style={{ width: "8em" }} 
				onChange={event => this.setState ({ invitee: event.target.value })} required={true}
				defaultValue={debugging () ? test.first_name : null}>
			</input>

			<label htmlFor="invitee_last_name">Last name</label>
			<input type="text" id="invitee_last_name" name="invitee_last_name" placeholder="Name" style={{ width: "8em" }} 
				onChange={event => this.setState ({ invitee: event.target.value })} required={true}
				defaultValue={debugging () ? test.last_name : null}>
			</input>

			<label htmlFor="email">Email address</label>
			<input type="email" id="invitee_email" name="invitee_email"
				placeholder="Email address" required={true} style={{ gridColumn: "span 3" }}
				defaultValue={debugging () ? test.email_address : null}>
			</input>

		</div>

		<div className="button-panel with-some-headspace">
			<button onClick={event => this.setState ({ form_data: this.invite_eyecandy_form.current.submit (event).toObject () })}>Invite</button>
		</div>

	</Container>


	/********/


	render = () => <EyecandyForm id="invite_form" ref={this.invite_eyecandy_form}

		onEyecandy={this.invite_contributor} 

		eyecandyText={() => `Inviting ${this.state.form_data?.invitee_first_name} ${this.state.form_data?.invitee_last_name} (${this.state.form_data?.invitee_email})`}
		notificationText={() => `${this.state.form_data?.invitee_first_name} ${this.state.form_data?.invitee_last_name} has been invited to join us.`}>

		{this.invite_form ()}

	</EyecandyForm>


}// InviteForm;