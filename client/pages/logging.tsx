import React, { BaseSyntheticEvent } from "react";

import EyecandyPanel from "controls/panels/eyecandy.panel";
import TaskTree from "pages/gadgets/task.tree";
import ProjectSelectorGadget from "./gadgets/selectors/project.selector.gadget";
import LoggingModel from "models/logging";

import BaseControl, { DefaultProps, DefaultState } from "controls/base.control";

import { LogData } from "types/datatypes";
import FadePanel from "client/controls/panels/fade.panel";


interface LoggingPageState extends DefaultState {
	project_id: number,
	current_entry: LogData,
	updating: boolean,
}// LoggingPageState;


export default class LoggingPage extends BaseControl<DefaultProps, LoggingPageState> {


	private project_selected = () => { return this.state.project_id > 0 }


	/********/


	public state: LoggingPageState = {
		project_id: 0,
		current_entry: null,
		updating: false
	}// state;


	public componentDidMount () {
		if (this.state.project_id) LoggingModel.fetch_current_entry ();
	}// componentDidMount;


	public render () {
		return (
			<div id="log_panel">

				<link rel="stylesheet" href="resources/styles/controls/treeview.css" />
				<link rel="stylesheet" href="resources/styles/pages/projects.css" />
				<link rel="stylesheet" href="resources/styles/pages/logging.css" />

				<ProjectSelectorGadget id="logging_project_selector" parent={this} 
					hasHeader={true} headerSelectable={false}
					onProjectChange={(event: BaseSyntheticEvent) => this.setState ({ project_id: event.target.value })}>
				</ProjectSelectorGadget>

				<div id="eyecandy_cell" style={{ marginTop: "1em", border: "solid 1px red" }}>
					<EyecandyPanel id="login_eyecandy" eyecandyVisible={this.state.updating} style={{ marginTop: "1em" }} shrink={false}
						onEyecandy={() => { LoggingModel.fetch_current_entry ().then (data => this.setState ({ latest_entry: data })) }}>
						{this.logged_out () && <FadePanel id="login_button" visible={this.project_selected ()}>
							<button onClick={() => alert ("TO DO: ACTUAL LOGGING")} style={{ 
								width: "100%"
							}}>Log in</button>
						</FadePanel>}
					</EyecandyPanel>
				</div>

			</div>
		);
	}// render;


}// LoggingPage;
