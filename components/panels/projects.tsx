import React from "react";

import BaseControl from "components/controls/base.control";
import ProjectSelecter from "components/panels/gadgets/project.selecter";
import FadeControl from "components/controls/fade.control";
import SelectButton from "components/controls/select.button";


export default class ProjectsPanel extends BaseControl<any> {


	public state = { project_selected: false }

	public render () {
		return (

			<div id="project_select_form">

				<link rel="stylesheet" href="/resources/styles/panels/projects.css" />

				<ProjectSelecter id="project_selecter" ref={this.create_reference} parent={this} />
				<div className="button-panel">
					<SelectButton id="new_button">New</SelectButton>
					<FadeControl id="edit_button_panel" ref={this.create_reference} vanishing={false} visible={this.state.project_selected}>
						<SelectButton id="edit_button">Edit</SelectButton>
					</FadeControl>
				</div>
			</div>

		);
	}// render;

}// ProjectsPanel;