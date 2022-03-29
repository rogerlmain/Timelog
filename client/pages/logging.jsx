import React from "react";

import BaseControl from "controls/abstract/base.control";
import Container from "controls/container";

import Break from "controls/html/line.break";

import ExplodingPanel from "controls/panels/exploding.panel";
import EyecandyPanel from "controls/panels/eyecandy.panel";
import FadePanel from "controls/panels/fade.panel";

import Logging from "classes/storage/logging";
import Options from "classes/storage/options";

import CalendarClock from "pages/gadgets/calendar.clock";
import PopupNotice from "pages/gadgets/popup.notice";
import ProjectSelectorGadget from "pages/gadgets/selectors/project.selector.gadget";

import LoggingModel from "models/logging";

import { date_formats, date_rounding } from "classes/types/constants";
import { isset, is_null, not_empty } from "classes/common";

import "client/resources/styles/pages/logging.css";


export default class LoggingPage extends BaseControl {


	state = {
		project_id: 0,
		editable: false,
		editing: false,
		fixing: false,
		initialized: false,
		current_entry: null,
		updating: false
	}/* state */;


	static defaultProps = { 
		id: "logging_page",
		companyId: null
	}/* defaultProps */;


	constructor (props) {

		super (props);

		this.state.current_entry = Logging.get_all ();

		if (isset (this.state.current_entry)) {
			this.state.current_entry.start_time = Date.validated (this.state.current_entry.start_time);
			this.state.current_entry.end_time = this.end_time ();
			this.state.project_id = this.state.current_entry.project_id;
			this.state.editable = this.needs_editing (this.state.current_entry);
		}// if;

		if (this.state.editable) this.state.editing = true;

	}// constructor;


	project_selected = () => { return this.state.project_id > 0 }


	needs_editing (entry = null) { 
		if (is_null (entry)) entry = this.state.current_entry;
		if (is_null (entry)) return false

		let same_day = entry.start_time.same_day (entry.end_time);
		let elapsed_time = this.elapsed_time (entry);
		
		let result = (!same_day || (elapsed_time > (8 * Date.hour_coef)));
		return result;
	}// needs_editing;

	
	set_logging = (data) => {

		let project_id = (not_empty (data) ? data.project_id : 0);
		let entry = (not_empty (data) ? data : null);

		Logging.set ("logging", entry);

		this.setState ({ 
			project_id: project_id,
			updating: false
		});

	}/* set_logging */;


	end_time () {

		let date = (isset (this.state.current_entry) ? this.state.current_entry.end_time : null) ?? new Date ();

		switch (Options.granularity (this.state.current_entry.company_id)) {
			case 1: return date.round_hours (date_rounding.down);
			case 2: return date.round_minutes (15);
		}// switch;

		return date;

	}// end_time;


	elapsed_time (entry = null) {

		let end_time = this.end_time ();
		
		entry = entry ?? this.state.current_entry;

		switch (Options.granularity (this.state.current_entry.granularity)) {
			case 1: return Math.floor ((end_time.round_hours (date_rounding.down).getTime () - entry.start_time.getTime ()) / 1000);
			case 2: return Math.floor ((end_time.round_minutes (15, date_rounding.down).getTime () - entry.start_time.getTime ()) / 1000);
			case 3: return 0; // Level 3 Granularity - any number of minutes
			case 4: return 0; // Level 4 Granularity - truetime: down to the second
		}// switch;

	}// elapsed_time;


	billable_time (elapsed_time) {

//		let minutes = (elapsed % hour_coef);

		return "$1234.56";//"TO BE CALCULATED - ENSURE CORRECT LOGIN, FIRST"; //(elapsed - minutes) + Math.round (minutes / account.granularity) * account.granularity;

	}// billable_time;


	invalid_entry () {

		let entry = this.state.current_entry;
		let now = new Date ();

		if (is_null (entry.end_time)) return false;

		if (entry.end_time.before (entry.start_time)) return true;
		if (entry.start_time.after (now) || entry.end_time.after (now)) {
			// notify ("Projected end times are not", "available in this version."); // TODO: Create a setting for this
			return true;
		}// if;
		
		return false;
		
	}// invalid_entry;
		
		
	componentDidMount () {
		this.setState ({ initialized: true });
	}// componentDidMount;


	componentDidUpdate () {
		let needs_editing = this.needs_editing ();
		if (this.state.editable == needs_editing) return;
		this.setState ({ editable: needs_editing });
	}// componentDidUpdate;


	link_cell (value) {
		return <div className={this.state.editable ? "error-link" : null} onClick={this.state.editable ? () => this.setState ({ 
			editing: true,
			fixing: true
		}) : null}>{value}</div>
	}// link_cell;


	render () {

		let entry = this.state.current_entry;
		let logged_in = isset (entry);
		let elapsed_time = logged_in ? this.elapsed_time () : null;

		const overtime_notice = () => {
			return <PopupNotice id="overtime_notice" visible={this.state.editing}>
				<ExplodingPanel id="overtime_notice">
	
					<Container id="calendar_clock" condition={this.state.fixing}>
						<CalendarClock id="log_calendar_clock"
							start={entry.start_time} end={entry.end_time}
							onChange={data => this.setState ({ current_entry: { 
								...this.state.current_entry,
								[`${data.boundary}_time`]: data.date
							}})}>
						</CalendarClock>

						<div className="button-panel">
							<button onClick={() => this.setState ({ editing: false })}>Close</button>
						</div>

					</Container>
	
					<Container id="overtime_instructions" condition={!this.state.fixing}>
	
						<div style={{ padding: "0.5em 0" }}>

							Whoa! Are you sure this is right?<br/>
							You have a single session going for more than a day!<br />

							<br />
	
							<div className="button-panel">
								<button onClick={() => this.setState ({ editing: false })}>Yep, that's right</button>
								<button onClick={() => this.setState ({ fixing: true })}>Oops. Fix it.</button>
							</div>

						</div>
					</Container>
	
				</ExplodingPanel>
			</PopupNotice>
		}/* overtime_notice */;
	
	
		const entry_details = () => {
	
			let elapsed_time = logged_in ? this.elapsed_time () : null;
	
			return <div id={this.props.id} className="row-container">
			
				<div className="log-details two-column-grid">
	
					<label>Client</label>
					<div>{entry.client_name}</div>
	
					<label>Project</label>
					<div>{entry.project_name}</div>
	
					<Break />
	
					<label>Start</label>
					<div>{entry.start_time.format (date_formats.full_datetime)}</div>
	
					<label>Stop</label>
					{this.link_cell (entry.end_time.format (entry.start_time.same_day (entry.end_time) ? date_formats.timestamp : date_formats.full_datetime))}
	
					<label>Elapsed</label>
					{this.link_cell (elapsed_time == 0 ? "No time elapsed" : Date.elapsed (elapsed_time)) }
					
					<Break />
	
					<label>Billable</label>
					<div>{this.billable_time (elapsed_time)}</div> 
	
				</div>
	
				<div>{overtime_notice ()}</div>
	
			</div>
	
		}/* entry_details */;
	
	
		return (
			<div id="log_panel">

				<EyecandyPanel id="log_form_eyecandy" eyecandyText="Loading..." eyecandyVisible={!this.state.initialized}>

					{logged_in ? entry_details () : <div>

						<ProjectSelectorGadget id="logging_project_selector" companyId={this.props.companyId} parent={this} 
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
							<button onClick={() => this.setState ({ updating: true })} style={{ flex: 1 }} disabled={logged_in && this.invalid_entry ()}>
								{logged_in ? (elapsed_time == 0 ? "Cancel log entry" : "Log out") : "Log in"}
							</button>
						</FadePanel>

					</EyecandyPanel>
				</div>

			</div>
		);
		
	}// render;


}// LoggingPage;