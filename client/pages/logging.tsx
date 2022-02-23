import React, { BaseSyntheticEvent } from "react";

import EyecandyPanel from "controls/panels/eyecandy.panel";
import ProjectSelectorGadget from "./gadgets/selectors/project.selector.gadget";
import LoggingModel from "models/logging";
import FadePanel from "client/controls/panels/fade.panel";
import TimeTool from "types/timetool";

import BaseControl, { DefaultProps, DefaultState } from "controls/base.control";

import { EntryData, LogData } from "types/datatypes";
import { isset, is_null } from "client/classes/common";


interface LoggingPageState extends DefaultState {
	project_id: number,
	current_entry: LogData,
	updating: boolean,
}// LoggingPageState;


export default class LoggingPage extends BaseControl<DefaultProps, LoggingPageState> {


	private project_selected = () => { return this.state.project_id > 0 }

	public logged_in = () => { return isset (this.state.current_entry) }


	/********/


	public state: LoggingPageState = {
		project_id: 0,
		current_entry: null,
		updating: false
	}// state;


	public componentDidMount () {
		LoggingModel.fetch_latest_entry ().then ((data: LogData) => this.setState ({ current_entry: data }));
	}// componentDidMount;


	private elapsed_time () {
		let start: Date = this.state.current_entry.start_time;
		return new Date ().getTime () - new Date (start).getTime ();
	}// elapsed_time;


	private billable_time () {

		const hour_coef = 3600000;

		let account = this.current_account ();

		let elapsed = this.elapsed_time ();
		let minutes = (elapsed % hour_coef);

		return "TO BE CALCULATED - ENSURE CORRECT LOGIN, FIRST"; //(elapsed - minutes) + Math.round (minutes / account.granularity) * account.granularity;

	}// billable_time;


	private start_time () {
		let start_time: Date = new Date (this.state.current_entry.start_time);
		if (TimeTool.same_day (start_time, new Date ())) return TimeTool.format (start_time, TimeTool.formats.time);
		return TimeTool.format (start_time, TimeTool.formats.compact);
	}// start_time;


	public render () {
		return (
			<div id="log_panel">

				<link rel="stylesheet" href="resources/styles/controls/treeview.css" />
				<link rel="stylesheet" href="resources/styles/pages/projects.css" />
				<link rel="stylesheet" href="resources/styles/pages/logging.css" />

				<EyecandyPanel id="log_panel" eyecandyVisible={is_null (this.state.current_entry)} eyecandyText="Loading...">

					{isset (this.state.current_entry) ? <div className="two-column-grid">

						<div>Client</div>
						<div>: {this.state.current_entry.client_name}</div>

						<div>Project</div>
						<div>: {this.state.current_entry.project_name}</div>

						<div style={{ gridColumn: "1 / -1", height: "0.5em" }}></div>

						<div>Start</div>
						<div>: {this.start_time ()}</div>

						<div>Elapsed</div>
						<div>: {TimeTool.elapsed (this.elapsed_time ())}</div>

						<div style={{ gridColumn: "1 / -1", height: "0.5em" }}></div>

						<div>Billable</div>
						<div>: {this.billable_time ()}</div>

					</div> : <ProjectSelectorGadget id="logging_project_selector" parent={this} 
						hasHeader={true} headerSelectable={false}
						onProjectChange={(event: BaseSyntheticEvent) => this.setState ({ project_id: event.target.value })}>
					</ProjectSelectorGadget>}

					<div id="eyecandy_cell" style={{ marginTop: "1em" }}>
						<EyecandyPanel id="login_eyecandy" eyecandyText="Logging you in..." eyecandyVisible={this.state.updating} style={{ marginTop: "1em" }} stretchOnly={true}
							eyecandyStyle={{ justifyContent: "center", gap: "0.5em" }}
							onEyecandy={() => { LoggingModel.log (this.state.project_id).then ((data: EntryData) => this.setState ({ latest_entry: data })) }}>

							<FadePanel id="login_button" visible={this.project_selected () || this.logged_in ()} style={{ display: "flex" }}>
								<button onClick={() => this.setState ({ updating: true })} style={{ flex: 1 }}>
									{this.logged_in () ? "Log out" : "Log in"}
								</button>
							</FadePanel>

						</EyecandyPanel>
					</div>

				</EyecandyPanel>

			</div>
		);
	}// render;


}// LoggingPage;
