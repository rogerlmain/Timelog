import React from "react";

import BaseControl from "client/controls/abstract/base.control";
import SelectList from "client/controls/lists/select.list";
import FadePanel from "client/controls/panels/fade.panel";
import Container from "client/controls/container";

import PermissionToggle from "client/pages/gadgets/toggles/permission.toggle";

import AccountStorage from "client/classes/storage/account.storage";

import PermissionsModel from "client/classes/models/permissions.model";
import AccountsModel from "client/classes/models/accounts.model";

import CompanyStorage from "client/classes/storage/company.storage";
import ActivityLog from "client/classes/activity.log";

import { isset, nested_value } from "client/classes/common";
import { team_permissions } from "client/classes/storage/permissions.storage";


export default class TeamsPage extends BaseControl {


	state = {
		team			: null,
		selected_account: null,
		permissions		: null,
	}// state;


	/********/


	get_permissions = event => PermissionsModel.get_permissions (event.target.value).then (value => this.setState ({
		permissions: nested_value (value, 0, "permissions"),
		selected_account: event.target.value,
	}));


	/********/


	componentDidMount () {
		AccountsModel.fetch_by_company (CompanyStorage.active_company_id ()).then (team => {
			let accounts = team.group ("account_id");
			delete accounts [AccountStorage.account_id ()];
			this.setState ({ team: accounts })
		}).catch (ActivityLog.error);
	}// constructor;


	render () {

		let active_account = nested_value (this.state?.team, this.state.selected_account);

		return <Container>

			<SelectList data={this.state.team} idField="account_id" textField="full_name" 
				hasHeader={true} headerText="Select a team member"
				onChange={this.get_permissions}>
			</SelectList>

			{isset (active_account) ? <FadePanel id="team_panel" visible={isset (active_account)}>

				<div className="horizontally-centered with-lotsa-headspace">
					{active_account.last_name}, {active_account.first_name}
					<Container visible={isset (active_account.friendly_name)}>&nbsp;({active_account.friendly_name})</Container>
				</div>

				<div className="two-column-table with-lotsa-headspace">

					<PermissionToggle id="client_permission" label="Create clients" 
						type={team_permissions.create_client} permissions={active_account?.permissions}
						account={this.state.selected_account}>
					</PermissionToggle>
					
					<PermissionToggle id="client_permission" label="Change team permissions" 
onClick={event => (event.target.value ? confirm ("You can be shut out! Are you sure") : false)}
						type={team_permissions.team_permission} permissions={active_account?.permissions}
						account={this.state.selected_account}>
					</PermissionToggle>
					
				</div>

			</FadePanel> : null}

		</Container>
	}// render;

}// HomePage;