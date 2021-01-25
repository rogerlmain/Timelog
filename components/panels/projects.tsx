import React from "react";

import BaseControl, { defaultInterface } from "components/controls/base.control";
import ProjectSelecter from "components/panels/gadgets/project.selecter";
import FadeControl from "components/controls/fade.control";
import SelectButton from "components/controls/select.button";


export default class ProjectsPanel extends BaseControl<any> {


	public state = {
		client_selected: false,
		project_selected: false
	}// state;


	public render () {
		return (

			<div id="project_select_form" className="project_select_form">

				<link rel="stylesheet" href="/resources/styles/panels/projects.css" />

				<ProjectSelecter id="project_selecter" ref={this.create_reference} parent={this} onClientChange={() => {
					this.setState ({ client_selected: true });
				}} />
				<div className="button-panel">
					<div className="button-cell">
						<SelectButton id="new_button">New</SelectButton>
						<FadeControl id="edit_button_panel" ref={this.create_reference} vanishing={true} visible={this.state.client_selected}>
							<SelectButton id="edit_button">Edit</SelectButton>
						</FadeControl>
					</div>
				</div>
			</div>

		);
	}// render;

}// ProjectsPanel;