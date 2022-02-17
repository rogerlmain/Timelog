import React, { SyntheticEvent, useCallback } from "react";

import * as constants from "client/types/constants";
import * as common from "client/classes/common";

import Database from "client/classes/database";
import BaseControl from "controls/base.control";
import FadeControl from "client/controls/fade.control";
import SelectButton from "client/controls/select.button";

import Eyecandy from "client/controls/eyecandy";

import ProjectSelectorGadget from "client/panels/gadgets/project.selector.gadget";
import TeamSelectorGadget, { TeamGroup } from "client/panels/gadgets/team.selector.gadget";

import { globals } from "client/types/globals";
import { projects_model } from "client/models/projects";



const max_code_length: number = 5;


export default class ProjectsPanel extends BaseControl<any> {


	private fetch_project () {

		this.dom ("project_selector")

		projects_model.fetch_by_id (this.state.project_id, (data) => {

			this.setState ({
				eyecandy_visible: false,
				project_data: data
			}, () => {
				this.reference ("team_panel").setState ({ record_id: this.state.project_id });
			});
		});
	}// fetch_project;


	private create_project_code () {

		let name_field: HTMLInputElement = this.reference ("project_name");
		let name_value = (common.isset (name_field) ? name_field.value : null);

		if (common.is_null (name_value)) return;

		let word_array = name_value.split (constants.space);
		let letter_count = ((word_array.length < 3) ? 2 : ((word_array.length > 5) ? 5 : word_array.length));

		let result: string = null;

		word_array.forEach ((item: string) => {
			if (common.is_null (result)) result = constants.empty;
			result += item.slice (0, letter_count);
		})

		return result.toUpperCase ();

	}// create_project_code;


	private save_project (event: SyntheticEvent) {

		let code_field: HTMLInputElement = this.reference ("project_code");
		let code_value: string = (common.isset (code_field) ? code_field.value : null);

		if (common.is_empty (code_value)) this.setState ({ project_data: {...this.state.project_data, code: this.create_project_code () } });

		document.getElementById ("data_indicator").style.opacity = "1";

		let parameters = new FormData (this.dom ("project_form"));
		parameters.append ("client_id", this.dom ("project_selector_client_selector").value);
		parameters.append ("selected_team", JSON.stringify (this.reference ("team_panel").state.selected_accounts));
		parameters.append ("action", "save");

		Database.fetch_data ("projects", parameters, (data: any) => {
			document.getElementById ("data_indicator").style.opacity = "0";
			if (common.isset (this.state.project_id)) return;
			if (common.exists (data, "project", "project_id")) this.setState ({ project_id: data.project.project_id });
		});

	}// save_project;


	private reset_form (callback) {
		if (this.state.project_loaded) return this.setState ({ project_loaded: false }, () => {
			this.reference ("team_panel").reset ();
			callback ();
		});
		callback ();
	}// reset_form;


	/********/


	public state = {
		client_selected: false,

		eyecandy_visible: false,

		project_loaded: false,
		project_accounts: null,

		project_data: null,
		project_id: null
	}// state;


	public render () {
		return (

			<div id="project_page" className="top-center-container">

				<div className="project-select-form">

					<link rel="stylesheet" href="/resources/styles/panels/projects.css" />

					<ProjectSelectorGadget id="project_selector" ref={this.create_reference} parent={this}

						onClientChange={() => { this.reset_form (() => { this.setState ({ client_selected: true }) }) }}

						onProjectChange={(event: any) => { this.reset_form (() => { this.setState ({
							eyecandy_visible: true,
							project_id: parseInt (event.target.value)
						}) }) }}

						onLoad={() => { globals.home_page.setState ({ eyecandy_visible: false }) }}>
					</ProjectSelectorGadget>

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

							<div className="two-column-grid" style={{ columnGap: "1em" }}>

								<div>

									<input type="hidden" id="project_id" name="project_id" value={this.state.project_id ?? 0} />
									<div className="two-piece-form">

										<label htmlFor="project_name">Project Name</label>
										<input type="text" id="project_name" name="project_name" ref={this.create_reference}
											defaultValue={this.state_object_field ("project_data", "name")}
											onBlur={this.save_project.bind (this)}>
										</input>

										<label htmlFor="project_code">Project Code</label>
										<input type="text" id="project_code" name="project_code" ref={this.create_reference}
											defaultValue={this.state_object_field ("project_data", "code")} maxLength={max_code_length}
											onBlur={this.save_project.bind (this)} style={{ textAlign: "right" }}>
										</input>

									</div>

									<textarea id="project_description" name="project_description" placeholder="Description (optional)"
										defaultValue={this.state_object_field ("project_data", "description")} onBlur={this.save_project.bind (this)}>
									</textarea>

								</div>

								<TeamSelectorGadget id="team_panel" ref={this.create_reference} onchange={this.save_project.bind (this)} parent={this} group={TeamGroup.project} />

							</div>

						</form>

					</FadeControl>

				</div>

			</div>

		);
	}// render;


	public constructor (props) {
		super (props);
		globals.projects_page = this;
	}// constructor;


}// ProjectsPanel;