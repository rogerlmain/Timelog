import React, { SyntheticEvent } from "react";

import * as constants from "components/types/constants";
import * as common from "components/classes/common";

import BaseControl from "components/controls/base.control";
import FadeControl from "components/controls/fade.control";
import SelectButton from "components/controls/select.button";
import SelectList from "components/controls/select.list";

import Eyecandy from "components/controls/eyecandy";

import ProjectSelecter from "components/panels/gadgets/project.selecter";

import { globals } from "components/types/globals";
import { accounts } from "components/models/accounts";
import { projects } from "components/models/projects";


export default class ProjectsPanel extends BaseControl<any> {


	private fetch_project () {

		this.dom ("project_selecter")

		projects.fetch_by_id (this.state.project_id, (data) => {

			this.setState ({
				eyecandy_visible: false,
				project_data: data
			}, () => {

				accounts.fetch_by_company (this.current_account ().company_id, (company_members: any) => {

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
						}, () => {
							this.forceUpdate ()
						});
					});

				});

			});
		});
	}// fetch_project;


	private get_value (state: string, field: string): any {
		return this.getState (state, field) ?? constants.empty;
	}// get_value;


	private find_account (arr: Array<any>, account_id: any) {
		return arr.find ((item: any) => {
			if (item ["account_id"] == parseInt (account_id)) return true;
		});
	}// find_item;


	private save_project (event: SyntheticEvent) {

		let parameters = new FormData (this.dom ("project_form"));
		parameters.append ("client_id", this.dom ("project_selecter_client_selecter").value);
		parameters.append ("selected_team", JSON.stringify (this.state.selected_accounts));
		parameters.append ("action", "save");

		fetch ("/projects", {
			method: "post",
			body: parameters
		}).then (response  => response.json ()).then ((data) => {
			if ((data.length != 1) || (common.isset (this.state.project_id))) return;
			let project = JSON.parse (data.project);
			(document.getElementById ("project_id") as HTMLFormElement).value = project.project_id;
			this.reference ("save_project_button").setState ({ eyecandy_visible: false });
		});

	}// save_project;


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
			if (Array.isArray (props.parent.state.selected_accounts)) props.parent.state.selected_accounts.forEach ((item: any) => {

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
						<SelectButton className="xbutton" onclick={() => {
							let x = select_list;
							/*.selected_value ()*/
						}}>X</SelectButton>
					</div>
				</div>
				if (common.is_null (result)) result = [];
				result.push (next_item);
			})
			return result;
		}// MemberEntries;
	}// Components;


	/********/


	public state = {
		client_selected: false,
		project_selected: false,
		account_selected: false,

		eyecandy_visible: false,

		project_loaded: false,

		project_accounts: null,
		available_accounts: null,
		selected_accounts: null,

		project_data: null,
		project_id: null
	}// state;


	public render () {
		return (

			<div id="project_page" className="top-center-container">

				<div className="project-select-form">

					<link rel="stylesheet" href="/resources/styles/panels/projects.css" />

					<ProjectSelecter id="project_selecter" ref={this.create_reference} parent={this}
						onClientChange={() => { this.setState ({ client_selected: true }) }}
						onProjectChange={(event) => {
							this.setState ({
								eyecandy_visible: true,
								project_id: parseInt (event.target.value)
							 })
						}}
						onLoad={() => { globals.home_page.setState ({ eyecandy_visible: false }) }}>
					</ProjectSelecter>

					<div className="button-panel form-panel">
						<div className="button-cell">

							<SelectButton id="new_client_button" sticky={false}>New</SelectButton>
							<FadeControl id="edit_client_button_panel" ref={this.create_reference} vanishing={true} visible={this.state.client_selected}>
								<SelectButton id="edit_client_button" sticky={false}>Edit</SelectButton>
							</FadeControl>

							<FadeControl id="new_project_button_panel" ref={this.create_reference} visible={this.state.client_selected}>
								<SelectButton id="new_project_button" sticky={false} onclick={() => { this.setState ({ project_loaded: true }) }}>New</SelectButton>
							</FadeControl>

						</div>
					</div>

				</div>

				<div className="overlay-container centering-cell">

					<Eyecandy visible={this.state.eyecandy_visible} text="Loading"
						afterShowing={this.fetch_project.bind (this)}
						afterHiding={() => { this.setState ({ project_loaded: true }, () => {
							let select_list = this.reference ("available_members");
							if (common.isset (select_list)) select_list.forceUpdate ();
						}) }}>
					</Eyecandy>

					<FadeControl id="project_details_panel" visible={this.state.project_loaded} style={{ width: "100%" }}>

						<hr />

						<form id="project_form">

							<div className="two-column-panel">

								<div>

									<input type="hidden" id="project_id" name="project_id" defaultValue={this.state.project_id} />
									<div className="two-piece-form">
										<label htmlFor="project_name">Project Name</label>
										<input type="text" id="project_name" name="project_name" defaultValue={this.get_value ("project_data", "name")} onBlur={this.save_project.bind (this)} />
									</div>

									<textarea id="project_description" name="project_description" placeholder="Description (optional)"
										defaultValue={this.get_value ("project_data", "description")} onBlur={this.save_project.bind (this)}>
									</textarea>

								</div>


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

							</div>

						</form>

					</FadeControl>

				</div>

			</div>

		);
	}// render;

}// ProjectsPanel;