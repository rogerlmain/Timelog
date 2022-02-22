import React, { BaseSyntheticEvent } from "react";

import EyecandyPanel from "controls/panels/eyecandy.panel";
import TaskTree from "pages/gadgets/task.tree";
import ProjectSelectorGadget from "./gadgets/selectors/project.selector.gadget";
import LoggingModel from "models/logging";

import BaseControl, { DefaultProps, DefaultState } from "controls/base.control";

import { EntryData, LogData } from "types/datatypes";
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
		LoggingModel.fetch_latest_entry ().then ((data: LogData) => this.setState ({ current_entry: data }));
	}// componentDidMount;


	public render () {
		return (
			<div id="log_panel">

				<link rel="stylesheet" href="resources/styles/controls/treeview.css" />
				<link rel="stylesheet" href="resources/styles/pages/projects.css" />
				<link rel="stylesheet" href="resources/styles/pages/logging.css" />

				{this.logged_in () ? <div>[LOG DETAILS GO HERE]</div> : <ProjectSelectorGadget id="logging_project_selector" parent={this} 
					hasHeader={true} headerSelectable={false}
					onProjectChange={(event: BaseSyntheticEvent) => this.setState ({ project_id: event.target.value })}>
				</ProjectSelectorGadget>}

				<div id="eyecandy_cell" style={{ marginTop: "1em" }}>
					<EyecandyPanel id="login_eyecandy" eyecandyText="Logging you in..." eyecandyVisible={this.state.updating} style={{ marginTop: "1em" }} stretchOnly={true}

						eyecandyStyle={{ justifyContent: "center", gap: "0.5em" }}

						onEyecandy={() => { LoggingModel.log (this.state.project_id).then ((data: EntryData) => this.setState ({ latest_entry: data })) }}>

						<FadePanel id="login_button" visible={this.project_selected ()} style={{ display: "flex" }}>
							<button onClick={() => this.setState ({ updating: true })} style={{ flex: 1 }}>
								
								{this.logged_out () ? "Log in" : "Log out"}
								
							</button>
						</FadePanel>

					</EyecandyPanel>
				</div>

			</div>
		);
	}// render;


}// LoggingPage;
