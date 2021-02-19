import React, { SyntheticEvent } from "react";

import * as common from "components/classes/common";

import BaseControl, { defaultInterface } from "components/controls/base.control";

import SelectList from "components/controls/select.list";
import SelectButton from "components/controls/select.button";
import FadeControl from "components/controls/fade.control";

import { accounts_model } from "components/models/accounts";
import { globals } from "components/types/globals";


interface teamSelectorGadgetInterface extends defaultInterface {
	onchange?: any;
	parent: any;
}// teamSelectorGadgetInterface;


class MemberEntries extends BaseControl<any> {


	private change_handler (item: any) {
		try {
			let active_list: SelectList = this.reference (`role_${item.account_id}`);
			let selected_accounts = this.props.parent.state.selected_accounts.filter ((account: any) => { return account.account_id != item.account_id });
			selected_accounts.push (item);
			item.role_id = active_list.state.selected_value;
			this.props.parent.setState ({ selected_accounts: selected_accounts }, globals.projects_page.save_project);
		} catch {}
	}// change_handler;


	public render () {

		let result = null;
		let project_panel = this.props.parent;

		if (Array.isArray (this.props.parent.state.selected_accounts)) this.props.parent.state.selected_accounts.forEach (((item: any) => {

			let list_id = `role_${item.account_id}`;

			let select_list = <SelectList id={list_id} ref={this.create_reference}
				selected_value={item.role_id} onchange={(event: SyntheticEvent) => { this.change_handler (item) }}>

				<option key={`acct_${item.account_id}_1`} value="1">Team lead</option>
				<option key={`acct_${item.account_id}_2`} value="2">Programmer</option>
				<option key={`acct_${item.account_id}_3`} value="3">Designer</option>
				<option key={`acct_${item.account_id}_4`} value="4">QA</option>

			</SelectList>


			let next_item = <div key={item.account_id} className="member_list_entry">
				<div className="member_name">{item.username}</div>
				<div className="member_options">

					{select_list}
					<SelectButton className="xbutton" onclick={(() => {
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


export default class TeamSelecterGadget extends BaseControl<teamSelectorGadgetInterface> {


	private find_account (arr: Array<any>, account_id: any) {
		return arr.find ((item: any) => {
			if (item ["account_id"] == parseInt (account_id)) return true;
		});
	}// find_item;


	private select_member () {
		let member_list = this.reference ("available_members");

		let selected_value = member_list.state.selected_value;
		let selected_account = this.find_account (this.state.available_accounts, selected_value);

		let acs = this.state.available_accounts;
		acs.remove (selected_account);

		this.setState ({
			available_accounts: acs,
			selected_accounts: [...(this.state.selected_accounts ?? []), selected_account]
		});

		member_list.reset ();
		this.execute_event (this.props.onchange);
	}// select_member;


	private remove_member (account_id: number) {
		let sac = this.state.selected_accounts;

		let active_account = this.find_account (sac, account_id);
		sac.remove (active_account);

		this.setState ({
			available_accounts: [...(this.state.available_accounts ?? []), active_account],
			selected_accounts: ((Array.isArray (sac) && common.not_empty (sac)) ? sac : null)
		});
		this.execute_event (this.props.onchange);
	}// remove_member;


	/********/


	public initial_state = {
		project_id: null,

		available_accounts: null,
		selected_accounts: null,

		project_selected: false
	}// state;


	public state = {...this.initial_state};


	public reset () {
		this.setState (this.initial_state);
	}// reset;


	public componentDidUpdate () {

		if (common.isset (this.state.available_accounts) || common.is_null (this.state.project_id)) return;

		accounts_model.fetch_by_company (this.current_account ().company_id, (company_members: any) => {

			accounts_model.fetch_by_project (this.state.project_id, (project_members: any) => {

				let candidates = (common.is_empty (project_members) ? company_members : company_members.filter ((member: any) => {
					let result = true;
					project_members.forEach ((employee: any) => {
						if (employee.account_id == member.account_id) {
							result = false;
							return false;
						}// if;
					});
					return result;
				}));

				this.setState ({
					selected_accounts: project_members,
					available_accounts: candidates
				});

			});

		});
	}// componentDidUpdate;


	public render () {

		return (
			<div>
				<div id="member_list_panel" className="three-piece-form form-panel">
					<label htmlFor="available_members">Candidates</label>
					<SelectList id="available_members" ref={this.create_reference} required={true}
						onchange={(event: any) => {
							this.setState ({ project_selected: common.isset (event.list.state.selected_value) })
						}}>
						{this.select_options (this.state.available_accounts, "account_id", "username")}
					</SelectList>
					<SelectButton id="add_member_button" onclick={this.select_member.bind (this)}
						disabled={!this.state.project_selected}>
						Add
					</SelectButton>
				</div>

				<FadeControl id="members_list" visible={common.not_empty (this.state.selected_accounts)}>
					<label>Project Members</label>
					<div id="member_list_entries" ref={this.create_reference}><MemberEntries parent={this} /></div>
				</FadeControl>

			</div>
		);

	}// render;

}// TeamSelecterGadget;
