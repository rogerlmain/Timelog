import React from "react";

import * as constants from "components/types/constants";
import * as common from "components/classes/common";

import BaseControl from "components/controls/base.control";
import FadeControl from "components/controls/fade.control";
import EyecandyButton from "components/controls/eyecandy.button";
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


	/********/


	public state = {
		client_selected: false,
		project_selected: false,

		eyecandy_visible: false,
		project_loaded: false,

		project_accounts: null,
		available_accounts: null,

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
						onLoad={() => { globals.home_page.setState ({ content_loaded: true })}}>
					</ProjectSelecter>

					<div className="button-panel">
						<div className="button-cell">

							<SelectButton id="new_client_button">New</SelectButton>
							<FadeControl id="edit_client_button_panel" ref={this.create_reference} vanishing={true} visible={this.state.client_selected}>
								<SelectButton id="edit_client_button">Edit</SelectButton>
							</FadeControl>

							<FadeControl id="new_project_button_panel" ref={this.create_reference} visible={this.state.client_selected}>
								<SelectButton id="new_project_button" onclick={() => { this.setState ({ project_loaded: true }) }}>New</SelectButton>
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

					<FadeControl id="project_details_panel" visible={this.state.project_loaded} style={{ width: "100%" }}

						beforeShowing={() => {

						}}>

						<hr />

						<form id="project_form">

							<div className="two-column-panel">

								<div>

									<input type="hidden" id="project_id" name="project_id" defaultValue={this.state.project_id} />
									<div className="two-piece-form">
										<label htmlFor="project_name">Project Name</label>
										<input type="text" id="project_name" name="project_name" defaultValue={this.get_value ("project_data", "name")} />
									</div>

									<textarea id="project_description" name="project_description" placeholder="Description (optional)"
										defaultValue={this.get_value ("project_data", "description")}>
									</textarea>

								</div>


								<div>
									<div className="three-piece-form">
										<label htmlFor="available_members">Team members</label>
										<SelectList id="available_members" ref={this.create_reference}>
											{this.select_options (this.state.available_accounts, "account_id", "username")}
										</SelectList>

										<button id="add_member_button" disabled={true}>Add</button>
									</div>
								</div>

							</div>

						</form>

						<div className="button-bar">

							<EyecandyButton id="save_project_button" ref={this.create_reference} text={`Saving ${this.dom ("project_name", "value")}`}

								onclick={() => {

									let parameters = new FormData (this.dom ("project_form"));
									parameters.append ("client_id", this.dom ("client_selecter").value);
									parameters.append ("action", "save");

									fetch ("/projects", {
										method: "post",
										body: parameters
									}).then (response  => response.json ()).then ((data) => {
										if (data.length != 1) return;
										(document.getElementById ("project_id") as HTMLFormElement).value = data [0].project_id;
										this.reference ("save_project_button").setState ({ eyecandy_visible: false });
									});

								}}>

								{common.isset (this.state.project_id, constants.empty) ? "Save" : "Create"}

							</EyecandyButton>

						</div>
					</FadeControl>

				</div>

			</div>

		);
	}// render;

}// ProjectsPanel;