import React from "react";

import Container from "client/controls/container";
import BaseControl from "client/controls/abstract/base.control";

import ExplodingPanel from "client/controls/panels/exploding.panel";

import PermissionToggle, { butterfly_alignment } from "client/gadgets/toggles/permission.toggle";

import AccountsModel from "client/classes/models/accounts.model";
import PermissionsModel from "client/classes/models/permissions.model";

import CompanyStorage from "client/classes/storage/company.storage";
import AccountStorage from "client/classes/storage/account.storage";

import ActivityLog from "client/classes/activity.log";

import { isset } from "client/classes/common";
import { date_formats } from "client/classes/types/constants";
import { team_permissions } from "client/classes/storage/permissions.storage";


export default class TeamPermissions extends BaseControl {


	team_member_panel = React.createRef ();


	state = {
		team			: null,
		selected_account: null,
	}// state;


	/********/


	get_permissions = event => PermissionsModel.get_permissions (event.target.value).then (value => this.team_member_panel.current.animate (() => this.setState ({
		permissions: value?.[0]?.["permissions"],
		selected_account: event.target.value,
	})));


	/********/


	team_permissions_panel = () => {

		let active_account = this.state?.team?.[this.state.selected_account];

		return isset (active_account) && <Container id="team_permissions_panel" >

			<div className="with-lotsa-headspace">
				<div id="teamster_name" className="section-header">
					{active_account.last_name}, {active_account.first_name}
					<Container visible={isset (active_account.friendly_name)}>&nbsp;({active_account.friendly_name})</Container>
				</div>
				<div className="two-piece-form with-headspace">
					<label>Member since:</label>
					<div>{new Date (active_account.date_created).format (date_formats.full_date)}</div>
				</div>
			</div>

			<div className="butterfly-ballot with-lotsa-headspace">

				<PermissionToggle id="create_client_permission" label="Create clients" align={butterfly_alignment.right}
					type={team_permissions.create_client} permissions={active_account?.permissions}
					account={this.state.selected_account}>
				</PermissionToggle>
				
				<PermissionToggle id="assign_client_permission" label="Assign clients" align={butterfly_alignment.left}
					type={team_permissions.assign_clients} permissions={active_account?.permissions}
					account={this.state.selected_account}>
				</PermissionToggle>
				
				<PermissionToggle id="create_project_permission" label="Create projects" align={butterfly_alignment.right}
					type={team_permissions.create_project} permissions={active_account?.permissions}
					account={this.state.selected_account}>
				</PermissionToggle>
				
				<PermissionToggle id="assign_project_permission" label="Assign projects" align={butterfly_alignment.left}
					type={team_permissions.assign_project} permissions={active_account?.permissions}
					account={this.state.selected_account}>
				</PermissionToggle>
				
				<PermissionToggle id="team_permission" label="Change team permissions" align={butterfly_alignment.right}
					onClick={event => (event.target.value ? ask_question ("You can be shut out! Are you sure") : true)}
					type={team_permissions.team_permission} permissions={active_account?.permissions}
					account={this.state.selected_account}>
				</PermissionToggle>
				
			</div>

		</Container>

	}// team_permissions_panel;


	team_assignations_panel = () => <Container id="team_assignations_panel">

			Team assignments (how to do it?)		
		
	</Container>


	/********/


	componentDidMount () {
		AccountsModel.get_by_company (CompanyStorage.active_company_id ()).then (team => {

			let accounts = team.group ("account_id");

			delete accounts [AccountStorage.account_id ()];
			this.setState ({ team: accounts })

		}).catch (ActivityLog.error);
	}// componentDidMount;


	render = () => <div id={this.props.id} className="horizontally-centered">
{/* 
		<SelectList data={this.state.team} idField="account_id" textField="full_name" 
			header="Select a team member"
			onChange={this.get_permissions}>
		</SelectList>
*/}
		<div className="with-headspace">
			<ExplodingPanel id="team_member_panel" ref={this.team_member_panel}>
				{this.team_permissions_panel ()}
			</ExplodingPanel>
		</div>

	</div>


}// TeamPermissions;


