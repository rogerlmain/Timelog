import React from "react";

import BaseControl from"client/controls/abstract/base.control";
import Container from"client/controls/container";

import ExplodingPanel from"client/controls/panels/exploding.panel";
import EyecandyPanel from"client/controls/panels/eyecandy.panel";
import FadePanel from"client/controls/panels/fade.panel";

import LoggingStorage from"client/classes/storage/logging.storage";
import OptionsStorage from "client/classes/storage/options.storage";
import ProjectStorage from "client/classes/storage/project.storage";

import CalendarClock from "client/pages/gadgets/calendar.clock";
import PopupNotice from "client/pages/gadgets/popup.notice";
import ProjectSelector from "client/controls/selectors/project.selector";

import LoggingModel from "client/classes/models/logging.model";

import { blank, date_formats, date_rounding, granularity_types, space } from "client/classes/types/constants";
import { isset, is_empty, nested_value, not_set, multiline_text, null_value, debugging } from "client/classes/common";

import { Break } from "client/controls/html/components";
import { MasterContext } from "client/classes/types/contexts";

import "resources/styles/pages/logging.css";


const action_types = {
	log		: "log",
	cancel	: "cancel",
}// action_types;


const ranges = {
	start	: "start",
	end		: "end",
}// ranges;


const session_maximum = 8;


export default class LoggingPage extends BaseControl {


	selector = React.createRef ();


	state = {

		current_entry: null,

		action: null,

		project_selected: false,
		editable: false,
		editing: false,
		fixing: false,
		initialized: false,
		updating: false

	}/* state */;


	log_form_panel = React.createRef ();


	static contextType = MasterContext;
	static defaultProps = { id: "logging_page" }


	constructor (props) { 

		super (props);

		this.state.current_entry = { ...LoggingStorage.current_entry (), end_time: this.end_time () }

		let project_id = nested_value (this.state.current_entry, "project_id");
		let client_id = nested_value (this.state.current_entry, "client_id");

		ProjectStorage.billing_rate (project_id, client_id).then (result => this.setState ({ billing_rate: result })).catch (error => {
			console.log (error);
			throw (error);
		});
		
		if (debugging ()) console.log ("logging page created");

	}// constructor;


	/********/


	company_id = () => 	{ return null_value (nested_value (this.state.current_entry, "company_id")) }
	client_id = () => 	{ return null_value (nested_value (this.state.current_entry, "client_id")) }
	project_id = () => 	{ return null_value (nested_value (this.state.current_entry, "project_id")) }
	notes = () => 		{ return null_value (nested_value (this.state.current_entry, "notes")) }

	logged_in = () => { return isset (this.state.current_entry) && isset (this.state.current_entry.start_time) }
	logged_out = () => { return !this.logged_in () }

	project_selected = () => { return ((this.project_id () > 0) || OptionsStorage.single_project () || this.logged_in ()) }


	billable_time = elapsed_time => {

		let hours = Math.floor (elapsed_time / Date.coefficient.hour);
		let minutes = elapsed_time % Date.coefficient.hour;

		return (hours * this.state.billing_rate) + (this.state.billing_rate / 60 * minutes);

	}/* billable_time */;


	// Time limit in hours
	needs_editing = time_limit => { 

		if (this.logged_out ()) return false;

		let same_day = this.state.current_entry.start_time.same_day (this.state.current_entry.end_time);
		let result = (!same_day || (this.elapsed_time () > (time_limit * Date.coefficient.hour)));

		return result;

	}// needs_editing;


	rounded = (date, range) => {

		let rounding_direction = (range == ranges.end) ? date_rounding.down : date_rounding.up;
		
		if (OptionsStorage.can_round (this.company_id ())) rounding_direction = (ranges.start ? OptionsStorage.start_rounding () : OptionsStorage.end_rounding ());

		switch (OptionsStorage.granularity (this.company_id ())) {
			case granularity_types.hourly	: return date.round_hours (rounding_direction);
			case granularity_types.quarterly: return date.round_minutes (15, rounding_direction);
			case granularity_types.minutely	: return date.round_minutes (1, rounding_direction);
			case granularity_types.truetime	: return date;
		}// switch;

	}// rounded;

	
	log_entry = () => {

		let entry = this.state.current_entry;
		let timestamp = isset (entry) ? ((this.state.action == action_types.cancel) ? entry.start_time : entry.end_time) : this.rounded (new Date (), ranges.start);

		LoggingModel.log (this.client_id (), this.project_id (), this.notes (), timestamp).then (entry => {

			if (is_empty (entry)) {
				LoggingStorage.delete ();
			} else {

				let start_time = Date.validated (entry.start_time);

				entry.start_time = start_time;
				entry.end_time = this.end_time ();

				LoggingStorage.set (entry);

			}// if;

			this.setState ({ 
				current_entry: entry,
				updating: false
			});

		});
	}// log_entry;


	end_time = () => { return this.rounded (new Date (), ranges.end) }


	elapsed_time = () => { return Math.max (Math.floor ((this.state.current_entry.end_time.getTime () - this.state.current_entry.start_time.getTime ()) / 1000), 0) }
	invalid_entry = () => { return (this.state.current_entry.end_time.before (this.state.current_entry.start_time)) }
		
		
	link_cell = value => {

		let editable = this.needs_editing (8);

		return <div title={editable && !this.state.editing ? 
			multiline_text (
				"Whoa! Are you a workaholic?",
				"You've been going for more than eight hours straight!",
				space,
				"Click here to change your log times."
			) : null} 
		
			className={editable && !OptionsStorage.can_edit () ? "error-link" : "standard-link"} 

			onClick={(editable || OptionsStorage.can_edit ()) ? () => this.setState ({ 
				editing: true,
				fixing: true
			}) : null}>
				
			{value}

		</div>

	}/* link_cell */;


	overtime_notice = () => {
		return <PopupNotice id="overtime_notice" visible={this.state.editing} style={{ top: "9em" }}>

			<ExplodingPanel id="overtime_notice_panel">

				<Container id="calendar_clock" visible={this.state.fixing}>

					<CalendarClock id="log_calendar_clock"
						start={this.state.current_entry.start_time} end={this.state.current_entry.end_time}
						onChange={data => {
							this.log_form_panel.current.forceResize ();
							this.state.current_entry [`${data.boundary}_time`] = data.date;
							this.forceUpdate ();
						}}>
					</CalendarClock>

					<div className="button-panel">
						<button onClick={() => this.setState ({ editing: false })}>Close</button>
					</div>

				</Container>

				<Container id="overtime_instructions" visible={!this.state.fixing}>
					<div style={{ padding: "0.5em 0" }}>

						Whoa! Are you sure this is right?<br/>
						You have a single session going for more than a day!<br />
						Did you forget to log out?<br />	

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


	entry_details = elapsed_time => {
	
		let start_time = nested_value (this.state.current_entry, "start_time");
		let end_time = nested_value (this.state.current_entry, "end_time");

		if (not_set (start_time) ) return null;

		return <div id={this.props.id} className="two-column-grid">
		
			<div className="log-details one-piece-form">

				<Container visible={isset (this.state.current_entry.client_name)}>
					<label>Client</label>
					<div>{this.state.current_entry.client_name}</div>
				</Container>

				<Container visible={isset (this.state.current_entry.project_name)}>
					<label>Project</label>
					<div>{this.state.current_entry.project_name}</div>
				</Container>

				<Break />

				<label>Start</label>
				{this.link_cell (nested_value (start_time, "format", date_formats.full_datetime))}

				<label>Stop</label>
				{this.link_cell (end_time.format (nested_value (start_time, "same_day", end_time) ? date_formats.timestamp : date_formats.full_datetime))}

				<Break />

				<label>Elapsed</label>
				<div>{elapsed_time == 0 ? "No time elapsed" : Date.elapsed (elapsed_time)}</div>
				
				<Container visible={OptionsStorage.can_bill () && (this.state.billing_rate > 0)}>

					<Break />

					<label>Billable</label>
					<div>${this.billable_time (elapsed_time).toCurrency ()}</div> 

				</Container>

			</div>

			<div>{this.overtime_notice ()}</div>

		</div>

	}/* entry_details */;


	/********/


	componentDidMount () {
		this.setState ({ 
			current_entry: { ...this.state.current_entry, end_time: this.end_time () },
			editing: this.needs_editing (24),
		}, () => setTimeout (this.setState ({ initialized: true })));
	}// componentDidMount;


	componentDidUpdate () {
		let needs_editing = this.needs_editing (24);
		if (this.state.editable != needs_editing) this.setState ({ editable: needs_editing });
	}// componentDidUpdate;


	render () {

		if (not_set (this.context)) return null;

		let logged_in = this.logged_in ();
		let elapsed_time = logged_in ? this.elapsed_time () : null;

		let log_button_panel = {
			columnGap: "0.25em",
			width: "100%",
		}// log_button_panel;

		if (logged_in && (elapsed_time > 0)) log_button_panel = {...log_button_panel,
			display: "grid",
			gridTemplateColumns: "repeat(2, 1fr)",
		}// if;

		return <div id="log_panel">

			<Container visible={logged_in}>{this.entry_details (elapsed_time)}</Container>

			<Container visible={!logged_in}>

				<ProjectSelector id="project_selector" ref={this.selector} parent={this} newButton={true}

					clientId={this.client_id ()} projectId={this.project_id ()}

					hasHeader={true} 
					headerSelectable={false} 

					onClientChange={event => this.setState ({ current_entry: {...this.state.current_entry, client_id: event.target.value } })}
					onProjectChange={event => this.setState ({ current_entry: {...this.state.current_entry, project_id: event.target.value } })}>

				</ProjectSelector>

			</Container>

			<div id="eyecandy_cell" style={{ marginTop: "1em" }}>
				<EyecandyPanel id="log_button_eyecandy"  style={{ marginTop: "1em" }} stretchOnly={true}
				
					text={(elapsed_time == 0) ? "Cancelling entry..." : `Logging you ${logged_in ? "out" : "in"}...`}
					
					eyecandyVisible={this.state.updating}
					eyecandyStyle={{ justifyContent: "center", gap: "0.5em" }}

					onEyecandy={this.log_entry}>

					<FadePanel id="login_button" visible={this.project_selected ()} style={{ display: "flex" }}>

						<div className="flex-column">

							<div className="flex-column with-headspace">
								<div style={{ paddingLeft: "0.75em" }}><label htmlFor="memo" style={{ fontWeight: "bold" }}>Notes</label></div>
								<div className="textarea-container with-some-headspace">
									<textarea id="notes" name="notes"
										placeholder="(optional)" defaultValue={this.notes () ?? blank}
										onBlur={event => this.setState ({ current_entry: {...this.state.current_entry, notes: event.target.value }})}>
									</textarea>
								</div>
							</div>

							<div style={log_button_panel} className="with-some-headspace">
									
								<Container visible={logged_in}>
									<button className="full-width"
										onClick={() => this.setState ({ updating: true, action: action_types.cancel })}>
										Cancel entry
									</button>
								</Container>

								<Container visible={(!logged_in) || (elapsed_time > 0)}>
									<button className="full-width"
										onClick={() => this.setState ({ updating: true, action: action_types.log })} style={{ flex: 1 }} 
										disabled={logged_in && this.invalid_entry ()}>
										{logged_in ? "Log out" : "Log in"}
									</button>
								</Container>

							</div>

						</div>

					</FadePanel>

				</EyecandyPanel>
			</div>
 
		</div>
		
	}// render;


}// LoggingPage;