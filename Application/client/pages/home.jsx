import React from "react";

import Container from "client/controls/container";
import BaseControl from "client/controls/abstract/base.control";

import ClientStorage from "client/classes/storage/client.storage";
import CompanyStorage from "client/classes/storage/company.storage";
import ProjectStorage from "client/classes/storage/project.storage";
import LoggingStorage from "client/classes/storage/logging.storage";

import InvitationsModel from "client/classes/models/invitations.model";

import { isset, is_null, not_array, not_set } from "client/classes/common";
import { MasterContext } from "client/classes/types/contexts";


const invite_responses = {
	accepted: "accepted",
	declined: "declined",
}// responses;


export default class HomePage extends BaseControl {


	state = { 
		invitations: null,
		client_name: null,
		project_name: null,
	}/* state */;


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


	componentDidMount () {
		new Promise (async () => {

			let active_client_id = LoggingStorage.client_id ();
			let clients = await ClientStorage.get_by_company (CompanyStorage.active_company_id ());

			if (isset (active_client_id)) {

				let projects = await ProjectStorage.get_by_client (active_client_id);

				let active_client_name = clients?.[active_client_id]?.name;
				let active_project_name = projects?.[LoggingStorage.project_id ()]?.name;

				this.setState ({ 
					client_name: (not_set (active_client_name) || active_client_name?.equals ("default")) ? null : active_client_name,
					project_name: (not_set (active_project_name) || active_project_name?.equals ("default")) ? null : active_project_name,
				});

			}// if;
		
		});
	}/* componentDidMount */;


	render () {

		let use_default = (is_null (this.state.client_name) && is_null (this.state.project_name));

		return <div id={this.props.id} className="full-size horizontally-centered">
			<div className="two-column-table with-headspace" style={{ columnGap: "2em", alignItems: "flex-start" }}>

				{/* Invitations */}

				<div>
					<div className="section-header">Invitations</div>
					<div>{this.show_invitations ()}</div>
				</div>


				{/* Current Status */}

				<div>

					<div className="section-header">Logging Status</div>

					{LoggingStorage.logged_in () ? <div>
						You are currently logged {use_default ? "in" : "into "} {this.state.project_name?.equals ("default") ? "the default project" : this.state.project_name}<br />
						for {this.state.client_name}
					</div> : <div>You are not logged in to any projects.</div>}

				</div>

			</div>
		</div>
	}// render;
}// HomePage;

