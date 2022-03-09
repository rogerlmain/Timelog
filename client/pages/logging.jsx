import React from "react";

import BaseControl from "controls/base.control";

import Break from "controls/html/line.break";
import Container from "controls/container";

import EyecandyPanel from "controls/panels/eyecandy.panel";
import FadePanel from "controls/panels/fade.panel";

import Logging from "classes/storage/logging";
import Options from "classes/storage/options";

import { not_empty } from "classes/common";

import ProjectSelectorGadget from "pages/gadgets/selectors/project.selector.gadget";
import PopupNotice from "pages/gadgets/popup.notice";

import LoggingModel from "models/logging";


import "resources/styles/pages/logging.css";


export default class LoggingPage extends BaseControl {


	state = {
		project_id: 0,
		initialized: false,
		updating: false
	}// state;


	constructor (props) {
		super (props);
		this.state.project_id = 0;
	}// constructor;


	project_selected = () => { return this.state.project_id > 0 }

	
	set_logging = (data) => {

		let project_id = (not_empty (data) ? data.project_id : 0);
		let entry = (not_empty (data) ? data : null);

		Logging.set ("logging", entry);

		this.setState ({ 
			project_id: project_id,
			updating: false
		});

	}/* set_logging */;


	end_time (start_time) {
		switch (Options.granularity ()) {
			case 1: return new Date ().round_hours (Date.rounding_direction.down).format (start_time.same_day (new Date ()) ? Date.formats.timestamp : Date.formats.full_datetime);
		}// switch;
	}// end_time;


	elapsed_time (start_time) {
		switch (Options.granularity ()) {
			case 1: return Math.floor ((new Date ().round_hours (Date.rounding_direction.down).getTime () - new Date (start_time).getTime ()) / 1000);
			case 2: return Math.floor ((new Date ().round_minutes (Date.rounding_direction.down, 15).getTime () - new Date (start_time).getTime ()) / 1000);
			case 3: return 0; // Level 3 Granularity - any number of minutes
			case 4: return 0; // Level 4 Granularity - truetime: down to the second
		}// switch;
	}// elapsed_time;


	billable_time (elapsed_time) {

//		let minutes = (elapsed % hour_coef);

		return "$1234.56";//"TO BE CALCULATED - ENSURE CORRECT LOGIN, FIRST"; //(elapsed - minutes) + Math.round (minutes / account.granularity) * account.granularity;

	}// billable_time;


	log_details () {

		let entry = Logging.get_all ();

		let start_time = Date.validated (entry.start_time);
		let end_time = this.end_time (start_time);
		let elapsed_time = this.elapsed_time (entry.start_time);

		let overtime = !start_time.same_day (end_time);

		let color = `var(--${(elapsed_time > (8 * Date.hour_coef) ? "warning-color" : "default-color")})`;

		return <div className="row-container">
		
			<div class="log-details two-column-grid">

				<label>Client</label>
				<div>{entry.client_name}</div>

				<label>Project</label>
				<div>{entry.project_name}</div>

				<Break />

				<label>Start</label>
				<div>{start_time.format (Date.formats.full_datetime)}</div>

				<label>Stop</label>
				<div style={{ color: color }}>{end_time}</div>

				<label>Elapsed</label>
				<div style={{ color: color }}>{elapsed_time == 0 ? "No time elapsed" : Date.elapsed (elapsed_time) }</div>
				
				<Break />

				<label>Billable</label>
				<div>{this.billable_time (elapsed_time)}</div> 

			</div>

			<div>
				<PopupNotice id="overtime_notice" visible={overtime}>
					Whoa! Are you sure this is right?<br/>
					You have a single session going for more than a day!<br />
					<br />
					<div className="button-panel">
						<button onClick={() => alert ("Close this window")}>Yep, that's right</button>
						<button onClick={() => alert ("Show a calendar and time selector\nor offer to use the max (8 hrs)")}>Oops. Fix it.</button>
					</div>
				</PopupNotice>
			</div>

		</div>

	}// log_details;


	componentDidMount = () => this.setState ({ initialized: true });


	render () {

		let logged_in = Logging.logged_in ();

		return (
			<div id="log_panel">

				<EyecandyPanel id="log_form_eyecandy" eyecandyText="Loading..." eyecandyVisible={!this.state.initialized}>


					{logged_in ? this.log_details () : <div>

						<ProjectSelectorGadget id="logging_project_selector" parent={this} 
							hasHeader={true} headerSelectable={false}
							onProjectChange={event => this.setState ({ project_id: event.target.value })}>
						</ProjectSelectorGadget>
					
					</div>}

				</EyecandyPanel>

				<div id="eyecandy_cell" style={{ marginTop: "1em" }}>
					<EyecandyPanel id="log_button_eyecandy"  style={{ marginTop: "1em" }} stretchOnly={true}
					
						eyecandyText={`Logging you ${logged_in ? "out" : "in"}...`} 
						eyecandyVisible={this.state.updating}
						eyecandyStyle={{ justifyContent: "center", gap: "0.5em" }}

						onEyecandy={() => { LoggingModel.log (this.state.project_id).then (this.set_logging)}}>

						<FadePanel id="login_button" visible={this.project_selected () || logged_in} style={{ display: "flex" }}>
							<button onClick={() => this.setState ({ updating: true })} style={{ flex: 1 }}>
								{logged_in ? "Log out" : "Log in"}
							</button>
						</FadePanel>

					</EyecandyPanel>
				</div>

			</div>
		);
	}// render;


}// LoggingPage;
