import React from "react";

import Container from "client/controls/container";
import BaseControl from "controls/abstract/base.control";

import LoggingStorage from "client/classes/storage/logging.storage";

import InvitationModel from "client/classes/models/invitation.model";

import { is_null, not_set } from "classes/common";
import { MasterContext } from "client/classes/types/contexts";
import CompanyModel from "client/classes/models/company.model";
import CompanyStorage from "client/classes/storage/company.storage";


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


	/********/


	respond = (invite, response) => {
		InvitationModel.respond (response, invite.invite_id).then (() => {

			if (response == invite_responses.accepted) {
				return this.context.master_page.update_company_list ().then (() => {
					if (confirm (`Do you want to log into ${invite.company_name}, now?`)) this.context.master_page.select_company (invite.company_id);
					this.update_invitations (() => alert (`Invitation accepted`))
				});
			}// if;

			this.update_invitations (() => alert (`Invitation ${response}`));

		});
	}// respond;


	update_invitations = (callback) => InvitationModel.fetch_all ().then (data => this.setState ({ invitations: Array.arrayify (data) }, callback));


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
					<button className="minibutton" onClick={() => this.respond (invite, invite_responses.declined)}>Decline</button>
					<button className="minibutton" onClick={() => this.respond (invite, invite_responses.accepted)}>Accept</button>
				</div>

			</Container>);
		});

		return <div className="vertically-center-justified two-column-table with-some-headspace">{result}</div>
		
	}// show_invitations;


	/********/


	componentDidMount () { this.update_invitations () }


	componentDidUpdate = this.componentDidMount;


	render () {

		let use_default = (is_null (LoggingStorage.project_name ()) && is_null (LoggingStorage.client_name ()));

		return <div id={this.props.id} className="fully-centered">
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


				{/* End */}

			</div>
		</div>
	}// render;
}// HomePage;

