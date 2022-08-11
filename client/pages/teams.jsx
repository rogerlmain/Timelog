import React from "react";

import BaseControl from "client/controls/abstract/base.control";
import SelectList from "client/controls/lists/select.list";
import FadePanel from "client/controls/panels/fade.panel";
import Container from "client/controls/container";

import PermissionToggle from "client/pages/gadgets/toggles/permission.toggle";

import AccountsModel from "client/classes/models/accounts.model";
import CompanyStorage from "client/classes/storage/company.storage";
import ActivityLog from "client/classes/activity.log";

import { isset, nested_value } from "client/classes/common";
import { team_permissions } from "client/classes/storage/permissions.storage";


export default class TeamsPage extends BaseControl {


	state = {
		team			: null,
		selected_account: null,
	}// state;


	componentDidMount () {
		AccountsModel.fetch_by_company (CompanyStorage.active_company_id ()).then (team => this.setState ({ team: team.group ("account_id") })).catch (ActivityLog.error);
	}// constructor;


	render () {

		let active_account = nested_value (this.state, "team", this.state.selected_account);

		return <Container>

			<SelectList data={this.state.team} idField="account_id" textField="full_name" 
				hasHeader={true} headerText="Select a team member"
				onChange={event => this.setState ({ selected_account: event.target.value })}>
			</SelectList>

			{isset (active_account) ? <FadePanel id="team_panel" visible={isset (active_account)}>

				<div className="horizontally-centered with-lotsa-headspace">
					{active_account.last_name}, {active_account.first_name}
					<Container visible={isset (active_account.friendly_name)}>&nbsp;({active_account.friendly_name})</Container>
				</div>

				<div className="two-column-table with-lotsa-headspace">
					<PermissionToggle id="client_permission" label="Create clients" value={team_permissions.create_client} />
				</div>

			</FadePanel> : null}

		</Container>
	}// render;

}// HomePage;