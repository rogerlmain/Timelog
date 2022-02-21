import React, { BaseSyntheticEvent } from "react";

import EyecandyPanel from "controls/panels/eyecandy.panel";
import TaskTree from "pages/gadgets/task.tree";
import ProjectSelectorGadget from "./gadgets/selectors/project.selector.gadget";
import LoggingModel from "models/logging";

import BaseControl, { DefaultProps, DefaultState } from "controls/base.control";

import { LogData } from "types/datatypes";


interface LoggingPageState extends DefaultState {
	project_id: number,
	current_entry: LogData,
	updating: boolean,
}// LoggingPageState;


export default class LoggingPage extends BaseControl<DefaultProps, LoggingPageState> {

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
				
				<div id="log_information_panel" className="two-column-form">

					<ProjectSelectorGadget id="logging_project_selector" parent={this} onProjectChange={(event: BaseSyntheticEvent) => this.setState ({ project_id: event.target.value })} />


					<EyecandyPanel id="login_eyecandy" eyecandyVisible={this.state.updating}
					
						onEyecandy={() => { LoggingModel.fetch_latest (this.state.project_id).then (data => this.setState ({ latest_entry: data })) }}>

						<div className="two-column-grid">

							{this.logged_in () && <button onClick={() => alert ("TO DO: ACTUAL LOGGING")}>Log out</button>}
							{this.logged_out () && <button onClick={() => alert ("TO DO: ACTUAL LOGGING")}>Log in</button>}

						</div>

					</EyecandyPanel>

				</div>

			</div>

		);

	}// render;


}// LoggingPage;
