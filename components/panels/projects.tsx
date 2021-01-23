import React from "react";

import BaseControl from "components/controls/base.control";
import ProjectSelecter from "components/panels/gadgets/project.selecter";
import FadeControl from "components/controls/fade.control";
import SelectButton from "components/controls/select.button";


export default class ProjectsPanel extends BaseControl<any> {

	public render () {
		return (

			<div id="project_select_form">
				<ProjectSelecter id="project_selecter" ref={this.create_reference} />
				<FadeControl id="edit_button_panel" ref={this.create_reference} vanishing={true} visible={this.get_state ("project_selector", "project_selected")}>
					<SelectButton id="edit_button">Edit</SelectButton>
				</FadeControl>
			</div>

		);
	}// render;

}// ProjectsPanel;