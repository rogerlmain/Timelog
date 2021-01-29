import React from "react";

import * as common from "components/classes/common";

import BaseControl from "components/controls/base.control";
import FadeControl from "components/controls/fade.control";
import EyecandyButton from "components/controls/eyecandy.button";
import SelectButton from "components/controls/select.button";

import ProjectSelecter from "components/panels/gadgets/project.selecter";

import { globals } from "components/types/globals";
import Eyecandy from "components/controls/eyecandy";


export default class ProjectsPanel extends BaseControl<any> {


	private dom (name: string, property: string = null): HTMLFormElement {
		let element = document.getElementById (name) as HTMLFormElement;
		if (common.is_null (property)) return element;
		if (common.is_null (element)) return null;
		return element [property];
	}// dom;


	public state = {
		client_selected: false,
		project_selected: false,

		loading_eyecandy: false,
		project_loaded: false,

		project_data: null
	}// state;


	public render () {
		return (

			<div id="project_page" className="top-center-container">

				<div className="project-select-form">

					<link rel="stylesheet" href="/resources/styles/panels/projects.css" />

					<ProjectSelecter id="project_selecter" ref={this.create_reference} parent={this}
						onClientChange={() => { this.setState ({ client_selected: true }) }}
						onProjectChange={() => { this.setState ({ loading_eyecandy: true }) }}
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

					<Eyecandy visible={this.state.loading_eyecandy} text="Loading" />

					<FadeControl id="project_details_panel" visible={this.state.project_loaded} style={{ width: "100%" }}>

						<hr />

						<form id="project_form">

							<input type="hidden" id="project_id" name="project_id" />
							<div className="two-piece-form">
								<label htmlFor="project_name">Project Name</label>
								<input type="text" id="project_name" name="project_name" />
							</div>

							<textarea id="project_description" name="project_description" placeholder="Description (optional)" />

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

								}}

							>Create / Save</EyecandyButton>

						</div>
					</FadeControl>

				</div>

			</div>

		);
	}// render;

}// ProjectsPanel;