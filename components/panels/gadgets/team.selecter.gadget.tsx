import React from "react";

import * as common from "components/classes/common";

import BaseControl, { defaultInterface } from "components/controls/base.control";

import SelectList from "components/controls/select.list";
import SelectButton from "components/controls/select.button";
import FadeControl from "components/controls/fade.control";

import { accounts } from "components/models/accounts";


export default class TeamSelecterGadget extends BaseControl<defaultInterface> {


	public componentDidUpdate () {
		accounts.fetch_by_company (this.current_account ().company_id, (company_members: any) => {

			if (common.is_null (this.state.project_id)) return;

			accounts.fetch_by_project (this.state.project_id, (project_members: any) => {
				this.setState ({
					project_accounts: project_members,
					available_accounts: company_members.filter ((member: any) => {
						let result = true;
						project_members.forEach ((employee: any) => {
							if (employee.account_id == member.account_id) {
								result = false;
								return false;
							}// if;
						});
						return result;
					})
				});
			});

		});
	}// componentDidUpdate;


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
			selected_accounts: [...(this.state.selected_accounts ?? []), selected_account],
			account_selected: true
		});

		member_list.reset ();
	}// select_member;


	private remove_member (account_id: number) {
		let sac = this.state.selected_accounts;

		let active_account = this.find_account (sac, account_id);
		sac.remove (active_account);

		this.setState ({
			available_accounts: [...(this.state.available_accounts ?? []), active_account],
			selected_accounts: sac
		});
	}// remove_member;


	private Components = {
		MemberEntries: function (props: any) {

			let result = null;
			let project_panel = props.parent;

			if (Array.isArray (props.parent.state.selected_accounts)) props.parent.state.selected_accounts.forEach (((item: any) => {

				let select_list = <SelectList onchange={() => { alert ("changed") }}>
					<option key="1" value="1">Team lead</option>
					<option key="2" value="2">Programmer</option>
					<option key="3" value="3">Designer</option>
					<option key="4" value="4">QA</option>
				</SelectList>

				let next_item = <div className="member_list_entry">
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
		}// MemberEntries;
	}// Components;


	/********/


	public state = {
		project_id: null,

		available_accounts: null,
		selected_accounts: null,

		project_selected: false,
		account_selected: false,
	}// state;


	public render () {

		return (
			<div>
				<div id="member_list_panel" className="three-piece-form form-panel">
					<label htmlFor="available_members">Team members</label>
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

				<FadeControl id="members_list" visible={this.state.account_selected}>
					<label>Project Members</label>
					<div id="member_list_entries" ref={this.create_reference}><this.Components.MemberEntries parent={this} /></div>
				</FadeControl>

			</div>
		);

	}// render;

}// TeamSelecterGadget;
