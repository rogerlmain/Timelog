import React from "react";

import Container from "client/controls/container";
import BaseControl from "controls/abstract/base.control";

import AccountStorage from "classes/storage/account.storage";

import InvitationModel from "client/classes/models/invitation.model";

import { isset, is_null, not_set } from "classes/common";
import { blank } from "client/classes/types/constants";
import LoggingStorage from "client/classes/storage/logging.storage";


export default class HomePage extends BaseControl {


	state = { invitations: null }


	static defaultProps = { 
		id: "home_page",
		parent: null
	}// defaultProps;


	/********/


	show_invitations = () => {

		let result = null;

		if (not_set (this.state.invitations)) return "You don't have any invitations pending.";

		this.state.invitations.forEach (invite => {
			if (is_null (result)) result = [];
			result.push (<div key={invite.company_id}>
				<a href="about:blank" style={{ fontSize: "11pt" }}
					onClick={event => {
						notify ("To be implemented...", "Stay tuned.");
						event.preventDefault ();
					}}>
					{invite.host_name} at {invite.company_name}
				</a><br />
			</div>);
		});

		if (result.length == 1) return <Container>You have an invitation from<div className="with-some-headspace">{result}</div></Container>;

		return <Container>You have invitations from: <br />{result}</Container>;
		
	}// show_invitations;


	/********/


	componentDidMount () {
		InvitationModel.fetch_all ().then (data => this.setState ({ invitations: Array.arrayify (data) }));
	}/* componentDidMount */;


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

