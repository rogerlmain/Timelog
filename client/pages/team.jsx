import React from "react";

import BaseControl from "client/controls/abstract/base.control";
import SelectList from "client/controls/lists/select.list";
import FadePanel from "client/controls/panels/fade.panel";
import Container from "client/controls/container";

import PermissionToggle, { butterfly_alignment } from "client/pages/gadgets/toggles/permission.toggle";

import AccountStorage from "client/classes/storage/account.storage";

import PermissionsModel from "client/classes/models/permissions.model";
import AccountsModel from "client/classes/models/accounts.model";

import CompanyStorage from "client/classes/storage/company.storage";
import ActivityLog from "client/classes/activity.log";

import { isset, is_empty, nested_value } from "client/classes/common";
import { team_permissions } from "client/classes/storage/permissions.storage";
import { date_formats } from "client/classes/types/constants";

import "resources/styles/pages/team.css";
import ExplodingPanel from "client/controls/panels/exploding.panel";



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

		return <div className="horizontally-centered">

			<SelectList data={this.state.team} idField="account_id" textField="full_name" 
				hasHeader={true} headerText="Select a team member"
				onChange={this.get_permissions}>
			</SelectList>

			<ExplodingPanel id="team_panel">
				{isset (active_account) ? <Container>

					<div className="with-lotsa-headspace">
						<div id="teamster_name">
							{active_account.last_name}, {active_account.first_name}
							<Container visible={isset (active_account.friendly_name)}>&nbsp;({active_account.friendly_name})</Container>
						</div>
						<div className="two-piece-form with-headspace">
							<label>Member since:</label>
							<div>{new Date (active_account.date_created).format (date_formats.full_date)}</div>
						</div>
					</div>

					<div className="butterfly-ballot with-lotsa-headspace">

						<PermissionToggle id="client_permission" label="Create clients" align={butterfly_alignment.right}
							type={team_permissions.create_client} permissions={active_account?.permissions}
							account={this.state.selected_account}>
						</PermissionToggle>
						
						<PermissionToggle id="team_permission" label="Change team permissions" align={butterfly_alignment.left}
							onClick={event => (event.target.value ? confirm ("You can be shut out! Are you sure") : true)}
							type={team_permissions.team_permission} permissions={active_account?.permissions}
							account={this.state.selected_account}>
						</PermissionToggle>
						
						<PermissionToggle id="project_permission" label="Create projects" align={butterfly_alignment.right}
							type={team_permissions.create_project} permissions={active_account?.permissions}
							account={this.state.selected_account}>
						</PermissionToggle>
						
					</div>

				</Container> : null}
			</ExplodingPanel>

		</div>
	}// render;

}// HomePage;