import React from "react";

import BaseControl from"client/controls/abstract/base.control";
import Container from"client/controls/container";

import ExplodingPanel from"client/controls/panels/exploding.panel";
import EyecandyPanel from"client/controls/panels/eyecandy.panel";
import FadePanel from"client/controls/panels/fade.panel";

import LogStorage from"client/classes/storage/log.storage";
import OptionsStorage from "client/classes/storage/options.storage";
import ProjectStorage from "client/classes/storage/project.storage";

import CalendarClock from "client/pages/gadgets/calendar.clock";
import PopupNotice from "client/pages/gadgets/popup.notice";
import ProjectSelectorGadget from "client/controls/selectors/project.selector.gadget";

import LoggingModel from "client/classes/models/logging";

import { blank, date_formats, date_rounding, granularity_types, space } from "client/classes/types/constants";
import { isset, is_null, is_empty, nested_value, not_set, multiline_text } from "client/classes/common";

import { Break } from "client/controls/html/components";
import { MainContext } from "client/classes/types/contexts";

import "client/resources/styles/pages/logging.css";


const ranges = {
	start	: 1,
	end		: 2,
}// ranges;


export default class LoggingPage extends BaseControl {


	state = {

		current_entry: null,

		client_id: null,
		project_id: null,

		editable: false,
		editing: false,
		fixing: false,
		initialized: false,
		updating: false

	}/* state */;


	log_form_panel = React.createRef ();


	static contextType = MainContext;
	static defaultProps = { id: "logging_page" }


	constructor (props) { 
		super (props);
		this.state.current_entry = LogStorage.current_entry ();
		ProjectStorage.billing_rate (this.props.projectId, this.props.clientId).then (result => this.setState ({ billing_rate: result }));
	}// constructor;


	client_selected = () => { return (this.state.client_id > 0) || OptionsStorage.single_client () }
	project_selected = () => { return ((this.state.project_id > 0) || OptionsStorage.single_project ()) && this.client_selected () }

	company_id = () => { return isset (this.state.current_entry) ? this.state.current_entry.company_id : this.context.company_id }
	client_id = () => { return isset (this.state.current_entry) ? this.state.current_entry.client_id : this.state.client_id }
	project_id = () => { return isset (this.state.current_entry) ? this.state.current_entry.project_id : this.state.project_id }


	billable_time = elapsed_time => {

		let hours = Math.floor (elapsed_time / Date.coefficient.hour);
		let minutes = elapsed_time % Date.coefficient.hour;

		return (hours * this.state.billing_rate) + (this.state.billing_rate / 60 * minutes);

	}/* billable_time */;


	needs_editing = (limit = 24) => { 

		if (not_set (this.state.current_entry)) return false;

		let same_day = this.state.current_entry.start_time.same_day (this.end_time ());
		let result = (!same_day || (this.elapsed_time () > (limit * Date.coefficient.hour)));

		return result;

	}// needs_editing;



	rounded = (date, range) => {

		let rounding_direction = (ranges.start ? OptionsStorage.start_rounding () : OptionsStorage.end_rounding ());

		if (!OptionsStorage.can_round (this.company_id ())) switch (range) {
			case ranges.end	: return date.round_hours (date_rounding.down);
			default			: return date.round_hours (date_rounding.up);
		}// switch;

		switch (OptionsStorage.granularity (this.company_id ())) {
			case granularity_types.hourly	: return new Date ().round_hours (rounding_direction);
			case granularity_types.quarterly: return new Date ().round_minutes (15, rounding_direction); break;
			case granularity_types.minutely	: return new Date ().round_minutes (1, rounding_direction); break;
			case granularity_types.truetime	: return new Date (); break;
		}// switch;

	}// rounded;

	
	log_entry = () => {

		let timestamp = this.rounded (new Date (), ranges.start);

		LoggingModel.log (this.client_id (), this.project_id (), timestamp).then (entry => {

			if (is_empty (entry)) {
				LogStorage.delete ();
			} else {
				entry.start_time = Date.validated (entry.start_time);
				LogStorage.set (entry);
			}// if;

			this.setState ({ 
				current_entry: entry,
				updating: false
			});

		});
	}// log_entry;


	end_time = () => {

		if (not_set (nested_value (this.state.current_entry, "end_time"))) {
			this.state.current_entry = {
				...this.state.current_entry,
				end_time: this.rounded (new Date (), ranges.end),
			};
		}// if;

		return this.state.current_entry.end_time;

	}// end_time;


	elapsed_time = () => { return Math.max (Math.floor ((this.end_time ().getTime () - this.state.current_entry.start_time.getTime ()) / 1000), 0) }
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
		
			className={editable ? "error-link" : null} 

			onClick={editable ? () => this.setState ({ 
				editing: true,
				fixing: true
			}) : null}>
				
			{value}

		</div>

	}/* link_cell */;


	overtime_notice = () => {
		return <PopupNotice id="overtime_notice" visible={this.state.editing}>
			<ExplodingPanel id="overtime_notice_panel">

				<Container id="calendar_clock" visible={this.state.fixing}>

					<CalendarClock id="log_calendar_clock"
						start={this.state.current_entry.start_time} end={this.end_time ()}
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
	
		let end_time = this.end_time ();

		return <div id={this.props.id} className="row-container">
		
			<div className="log-details one-piece-form">

				<label>Client</label>
				<div>{this.state.current_entry.client_name ?? "Default"}</div>

				<label>Project</label>
				<div>{this.state.current_entry.project_name ?? "Default"}</div>

				<Break />

				<label>Start</label>
				<div>{this.state.current_entry.start_time.format (date_formats.full_datetime)}</div>

				<label>Stop</label>
				{this.link_cell (end_time.format (this.state.current_entry.start_time.same_day (end_time) ? date_formats.timestamp : date_formats.full_datetime))}

				<label>Elapsed</label>
				{this.link_cell (elapsed_time == 0 ? "No time elapsed" : Date.elapsed (elapsed_time)) }
				
				<Container visible={OptionsStorage.can_bill ()}>

					<Break />

					<label>Billable</label>
					<div>${this.billable_time (elapsed_time)}</div> 

				</Container>

			</div>

			<div style={{ width: 0 }}>{this.overtime_notice ()}</div>

		</div>

	}/* entry_details */;


	/********/


	componentDidMount () {

		let delay = 1000;

		this.setState ({ 
			editing: this.needs_editing (),
			initialized: true,
		});

		switch (OptionsStorage.granularity (this.context.company_id)) {
			case granularity_types.hourly	: delay *= Date.coefficient.hourly; break;
			case granularity_types.quarterly: delay *= Date.coefficient.quarterly; break;
			case granularity_types.minutely	: delay *= Date.coefficient.minutely; break;
		}// switch;

	}// componentDidMount;


	componentDidUpdate () {
		let needs_editing = this.needs_editing ();
		if (this.state.editable == needs_editing) return;
		this.setState ({ editable: needs_editing });
	}// componentDidUpdate;


	render () {

		if (not_set (this.context)) return null;

		let logged_in = isset (this.state.current_entry);
		let elapsed_time = logged_in ? this.elapsed_time () : null;

		return <div id="log_panel">

			<EyecandyPanel id="log_form_eyecandy" ref={this.log_form_panel} text="Loading..." eyecandyVisible={!this.state.initialized} stretchOnly={true}>

				{logged_in ? this.entry_details (elapsed_time) : <div>

					<ProjectSelectorGadget id="logging_project_selector" parent={this}
						clientId={this.state.client_id} projectId={this.state.project_id}
						hasHeader={true} headerSelectable={false} headerText={blank} newOption={true}
						onClientChange={event => this.setState ({ client_id: event.target.value })}
						onProjectChange={event => this.setState ({ project_id: event.target.value })}>
					</ProjectSelectorGadget>
				
				</div>}

			</EyecandyPanel>

			<div id="eyecandy_cell" style={{ marginTop: "1em" }}>
				<EyecandyPanel id="log_button_eyecandy"  style={{ marginTop: "1em" }} stretchOnly={true}
				
					text={`Logging you ${logged_in ? "out" : "in"}...`} 
					eyecandyVisible={this.state.updating}
					eyecandyStyle={{ justifyContent: "center", gap: "0.5em" }}

					onEyecandy={this.log_entry}>

					<FadePanel id="login_button" visible={this.project_selected () || logged_in} style={{ display: "flex" }}>
						<button onClick={() => this.setState ({ updating: true })} style={{ flex: 1 }} disabled={logged_in && this.invalid_entry ()}>
							{logged_in ? (elapsed_time == 0 ? "Cancel log entry" : "Log out") : "Log in"}
						</button>
					</FadePanel>

				</EyecandyPanel>
			</div>

		</div>
		
	}// render;


}// LoggingPage;