import React, { SyntheticEvent } from "react";

import * as common from "client/classes/common";
import { AccountData } from "types/datatypes";

import BaseControl, { DefaultProps, DefaultState } from "client/controls/base.control";

import ModularSelectList from "client/controls/modular.select.list";
import SelectButton from "client/controls/buttons/select.button";

import ExplodingPanel from "client/controls/panels/exploding.panel";

import AccountsModel from "models/accounts";

import { globals } from "types/globals";


interface TeamSelectorGadgetProps extends DefaultProps {

	onChange?: Function;
	onLoad?: Function;
	
	record_id: number;
	group: TeamGroup;
	parent: any;

}// TeamSelectorGadgetProps;


interface TeamSelectorGadgetState extends DefaultState {
	organization_id: number;
	record_id: number;

	available_accounts: any; // AccountData [];
	selected_accounts: any; // AccountData [];

	project_selected: boolean;

somevalue?: string;	

}// TeamSelectorGadgetState;


class MemberEntries extends BaseControl<any> {

	private change_handler (item: any) {
		try {
//			let active_list: ModularSelectList = this.references (`role_${item.account_id}`);
			let selected_accounts = this.props.parent.state.selected_accounts.filter ((account: any) => { return account.account_id != item.account_id });
			selected_accounts.push (item);
//			item.role_id = active_list.state.selected_value;

// TO BE REINSTATED - NEEDED TO SAVE THE PROJECT WHEN THE TEAM MEMBERS CHANGE			
//			this.props.parent.setState ({ selected_accounts: selected_accounts }, globals.projects_page.save_project);

		} catch {}
	}// change_handler;


	public render (): any {

		let result: any = null;
		let project_panel = this.props.parent;

		if (Array.isArray (this.props.parent.state.selected_accounts)) this.props.parent.state.selected_accounts.forEach (((item: any) => {

			let list_id = `role_${item.account_id}`;

			let select_list = <ModularSelectList id={list_id} selected_value={item.role_id} 
				onChange={(event: SyntheticEvent) => { this.change_handler (item) }}>

				<option key={`acct_${item.account_id}_1`} value="1">Team lead</option>
				<option key={`acct_${item.account_id}_2`} value="2">Programmer</option>
				<option key={`acct_${item.account_id}_3`} value="3">Designer</option>
				<option key={`acct_${item.account_id}_4`} value="4">QA</option>

			</ModularSelectList>


			let next_item = <div key={item.account_id} className="member_list_entry">
				<div className="member_name">{item.username}</div>
				<div className="member_options">

					{select_list}
					<SelectButton className="xbutton" onClick={(() => {
						project_panel.remove_member (item.account_id)
					})}>X</SelectButton>

				</div>
			</div>
			if (common.is_null (result)) result = [];
			result.push (next_item);
		}))
		return result;

	}// render;

}// MemberEntries;


/********/


export enum TeamGroup {
	project = 1,
	task	= 2,
	team	= 3
}// TeamGroup


export default class TeamSelectorGadget extends BaseControl<TeamSelectorGadgetProps, TeamSelectorGadgetState> {


	private available_members: React.RefObject<ModularSelectList> = React.createRef<ModularSelectList> ();


	private find_account (arr: Array<any>, account_id: any) {
		return arr.find ((item: any) => {
			if (item ["account_id"] == parseInt (account_id)) return true;
		});
	}// find_item;


	private select_member () {
		let member_list = this.available_members;

		let selectedValue = member_list.current.state.selected_value;
		let selected_account = this.find_account (this.state.available_accounts, selectedValue);

		let acs = this.state.available_accounts;
		acs.remove (selected_account);

		this.setState ({
			available_accounts: acs,
			selected_accounts: [...(this.state.selected_accounts ?? []), selected_account]
		});

		member_list.current.reset ();
		this.execute (this.props.onChange);
	}// select_member;


	private remove_member (account_id: number) {
		let sac = this.state.selected_accounts;

		let active_account = this.find_account (sac, account_id);
		sac.remove (active_account);

		this.setState ({
			available_accounts: [...(this.state.available_accounts ?? []), active_account],
			selected_accounts: ((Array.isArray (sac) && common.not_empty (sac)) ? sac : null)
		});
		this.execute (this.props.onChange);
	}// remove_member;


	/********/


	public initial_state: TeamSelectorGadgetState = {
		organization_id: null,
		record_id: null,

		available_accounts: null,
		selected_accounts: null,

		project_selected: false

,somevalue: null

	}// state;


	public props: TeamSelectorGadgetProps;
	
	public state: TeamSelectorGadgetState;	


	public reset () {
		this.setState (this.initial_state);
	}// reset;


	public componentDidMount () {
		this.reset ();
	}// componentDidMount;


	public getSnapshotBeforeUpdate (): any {
		switch (common.isset (this.state.available_accounts)) {
			case true: this.execute (this.props.onLoad); break;
			default: this.setState ({ record_id: this.props.record_id });
		}// switch;
		return null;
	}// getSnapshotBeforeUpdate;


	public componentDidUpdate () {

		let pool_method = null;
		let group_method: any = null;
		let organization_id = null;

		if (common.is_null (this.state.record_id) || common.isset (this.state.available_accounts)) return;

		switch (this.props.group) {
			case TeamGroup.project:
				pool_method = AccountsModel.fetch_by_company;
				group_method = AccountsModel.fetch_by_project;
				organization_id = this.current_account ().company_id;
				break;
			case TeamGroup.task:
				pool_method = AccountsModel.fetch_by_project;
				group_method = AccountsModel.fetch_by_task;
				organization_id = this.state.organization_id;
				break;
			case TeamGroup.team: /* CONSTRUCTION ZONE - PART OF RTI(13) */
		}// switch;

		pool_method (organization_id, (pool: any) => {

			group_method (this.state.record_id, (group: any) => {

				let candidates = (common.is_empty (group) ? pool : pool.filter ((member: any) => {
					let result = true;
					group.forEach ((employee: any) => {
						if (employee.account_id == member.account_id) {
							result = false;
							return false;
						}// if;
					});
					return result;
				}));

				this.setState ({
					selected_accounts: group,
					available_accounts: candidates
				});

			});

		});
	}// componentDidUpdate;


	public render () {

		return (
			<div>
				<div id="member_list_panel" className="three-column-form form-panel" title={this.state.somevalue}>
					<label htmlFor="available_members">Candidates</label>
					<ModularSelectList id="available_members"
						onChange={(event: any) => {
							this.setState ({ project_selected: common.isset (event.list.state.selectedValue) })
						}}>
						{(() => {
							this.select_options (this.state.available_accounts, "account_id", "username");
						})()}
					</ModularSelectList>
					<SelectButton id="add_member_button" onClick={this.select_member.bind (this)}
						disabled={!this.state.project_selected}>
						Add
					</SelectButton>
				</div>

				<ExplodingPanel id="members_list">
					<label>Project Members</label>
					<div id="member_list_entries"><MemberEntries parent={this} /></div>
				</ExplodingPanel>

			</div>
		);

	}// render;

}// TeamSelectorGadget;
