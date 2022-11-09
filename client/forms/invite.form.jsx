import React from "react";
import BaseControl from "client/controls/abstract/base.control";

import EyecandyPanel from "client/controls/panels/eyecandy.panel";
import ContentsPanel from "client/controls/panels/contents.panel";

import AccountStorage from "client/classes/storage/account.storage";
import CompanyStorage from "client/classes/storage/company.storage";

import EmailModel from "client/classes/models/email.model";

import { blank } from "client/classes/types/constants";
import { debugging, isset, not_set } from "client/classes/common";


const notification_delay = 2000;


export default class InviteForm extends BaseControl {


	state = {
		invitee: null,
		invite_data: null,
	}// state;


	invite_reference = React.createRef ();
	

	/********/


	invite_contributor = event => {

		let data = this.state.invite_data;

		data.append ("host_id", AccountStorage.account_id ());
		data.append ("host_name", AccountStorage.full_name ());
		data.append ("company_name", CompanyStorage.company_name ());
		data.append ("company_id", CompanyStorage.active_company_id ());

		return new Promise ((resolve, reject) => EmailModel.send_invite (data).then (data => resolve (Array.get_element (data, 0))).catch (reject));

	}/* invite_contributor */;


	invitee_details = () => {
		if (not_set (this.state.invite_data)) return blank;
		return `Inviting ${this.state.invite_data.get ("invitee_name")} (${this.state.invite_data.get ("invitee_email")})`;
	}// invitee_details;


	invite_form = () => <form id="invite_form" ref={this.invite_reference}>
		<div className="horizontally-aligned with-headspace">

			<label htmlFor="invitation">Invite a contributor</label>

			<div className="three-column-grid" style={{ columnGap: "0.2em" }}>

				<input type="hidden" id="company_id" value={CompanyStorage.active_company_id ()} />
				
				<input type="text" id="invitee_name" name="invitee_name" placeholder="Name" style={{ width: "8em" }} 
					onChange={event => this.setState ({ invitee: event.target.value })} required={true}
					defaultValue={debugging () ? 
//									"Roger"
						"The High Priest"
					: null}>
				</input>

				<input type="email" id="invitee_email" name="invitee_email" placeholder="Email address" required={true}
					defaultValue={debugging () ? 
//									"roger.main@rexthestrange.com" 
						"high.priest@solipsology.org"
					: null}>
				</input>

				<button onClick={event => {
					this.setState ({ invite_data: new FormData (this.invite_reference.current) });
					event.preventDefault ();
				}}>Invite</button>

			</div>

		</div>
	</form>


	/********/


	render = () => <EyecandyPanel id="invite_button_panel" text={this.invitee_details ()}
			
		onEyecandy={() => this.invite_contributor ().then (invitation => this.setState ({ 
			invite_data: null,
			notification: `${invitation.invitee_name} has been invited to join us.`,
		}, () => setTimeout (() => this.setState ({ notification: null }), notification_delay)))}

		eyecandyVisible={isset (this.state.invite_data)}>

		<ContentsPanel value={isset (this.state.notification) ? 1 : 2}>
			<div>{this.state.notification}</div>
			<div>{this.invite_form ()}</div>
		</ContentsPanel>

	</EyecandyPanel>


}// InviteForm;