import React from "react";

import Container from "client/controls/container";
import BaseControl from "client/controls/abstract/base.control";

import LoggingStorage from "client/classes/storage/logging.storage";

import InvitationStorage from "client/classes/storage/invitation.storage";
import InvitationsModel from "client/classes/models/invitations.model";

import { isset, is_null, not_array, not_set } from "client/classes/common";
import { MasterContext } from "client/classes/types/contexts";
import AccountStorage from "client/classes/storage/account.storage";
import LocalStorage from "client/classes/local.storage";


const invite_responses = {
	accepted: "accepted",
	declined: "declined",
}// responses;


export default class HomePage extends BaseControl {


	state = { invitations: null }


	static defaultProps = { 
		id: "home_page",
		parent: null
	}// defaultProps;


	static contextType = MasterContext;


	constructor (props) {
		super (props);
		this.update_invitations ();
	}// constructor;


	/********/


	update_invitations = (callback) => InvitationsModel.get_all ().then (data => this.setState ({ invitations: (not_array (data) || data.empty ()) ? null : data }, callback));


	respond_to_invitation = (invite, response) => {
		InvitationsModel.respond (response, invite.invite_id).then (() => {

			if (response == invite_responses.accepted) {
				return this.context.master_page.update_company_list ().then (() => {
					if (ask_question (`Do you want to log into ${invite.company_name}, now?`)) this.context.master_page.select_company (invite.company_id);
					this.update_invitations (() => this.show_message (`Invitation accepted`))
				});
			}// if;

			this.update_invitations (() => this.show_message (`Invitation ${response}`));

		});
	}// respond_to_invitation;


	show_invitations = () => {

		let result = null;

		if (not_set (this.state.invitations)) return "You don't have any invitations pending.";

		this.state.invitations.forEach (invite => {
			if (is_null (result)) result = [];
			result.push (<Container key={invite.company_id}>

				<div key={`text_${invite.company_id}`}>
					<div>{invite.host_name} from</div>
					<div>{invite.company_name}</div>
				</div>

				<div key={`button_${invite.company_id}`} className="button-bar">
					<button className="minibutton" onClick={() => this.respond_to_invitation (invite, invite_responses.declined)}>Decline</button>
					<button className="minibutton" onClick={() => this.respond_to_invitation (invite, invite_responses.accepted)}>Accept</button>
				</div>

			</Container>);
		});

		return <div className="vertically-center-justified two-column-table with-some-headspace">{result}</div>
		
	}// show_invitations;


	/********/


	render () {

		let use_default = (is_null (LoggingStorage.project_name ()) && is_null (LoggingStorage.client_name ()));

		return <div id={this.props.id} className="full-size horizontally-centered">
			<div className="two-column-table with-headspace" style={{ columnGap: "2em" }}>

				{/* Invitations */}

				<div>
					<div className="section-header">Invitations</div>
					<div>{this.show_invitations ()}</div>
				</div>


				{/* Current Status */}

				<div>

					<div className="section-header">Logging Status</div>

					<Container visible={LoggingStorage.logged_in ()}>
						You are currently logged&nbsp;
						<Container visible={use_default}>in</Container>
						<Container visible={!use_default}>
							into<br />
							{LoggingStorage.project_name () ?? "the default project"} for {LoggingStorage.client_name ()}
						</Container>
					</Container>

					<Container visible={LoggingStorage.logged_out ()}>
						You are not logged in to any projects.
					</Container>

				</div>

			</div>
		</div>
	}// render;
}// HomePage;

