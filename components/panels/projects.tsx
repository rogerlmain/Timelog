import React from "react";

import * as common from "components/classes/common";

import BaseControl from "components/controls/base.control";
import FadeControl from "components/controls/fade.control";
import SelectButton from "components/controls/select.button";

import ProjectSelecter from "components/panels/gadgets/project.selecter";

import { globals } from "components/types/globals";


export default class ProjectsPanel extends BaseControl<any> {


	public state = {
		client_selected: false,
		project_selected: false
	}// state;


	public render () {
		return (

			<div id="project_select_form" className="project_select_form">

				<link rel="stylesheet" href="/resources/styles/panels/projects.css" />

				<ProjectSelecter id="project_selecter" ref={this.create_reference} parent={this}
					onClientChange={() => { this.setState ({ client_selected: true }) }}
					onLoad={() => { globals.home_page.setState ({ content_loaded: true })}}
				/>
				<div className="button-panel">
					<div className="button-cell">

						<SelectButton id="new_client_button">New</SelectButton>
						<FadeControl id="edit_client_button_panel" ref={this.create_reference} vanishing={true} visible={this.state.client_selected}>
							<SelectButton id="edit_client_button">Edit</SelectButton>
						</FadeControl>

						<FadeControl id="new_project_button_panel" ref={this.create_reference} visible={this.state.client_selected}>
							<SelectButton id="new_project_button">New</SelectButton>
						</FadeControl>

					</div>
				</div>
			</div>

		);
	}// render;

}// ProjectsPanel;