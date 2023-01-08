import React from "react";

import ReportsModel from "client/classes/models/reports.model";

import OptionStorage from "client/classes/storage/options.storage";

import BaseControl from "client/controls/abstract/base.control";
import SelectButton from "client/controls/buttons/select.button";
import DateInput from "client/controls/inputs/date.input";
import ReportGrid from "client/controls/lists/report.grid";
import ProjectSelector from "client/controls/selectors/project.selector";

import FadePanel from "client/controls/panels/fade.panel";
import ExplodingPanel  from "client/controls/panels/exploding.panel";

import Container from "client/controls/container";

import { blank, date_formats } from "client/classes/types/constants";
import { debugging, isset, is_null, not_set } from "client/classes/common";

import { BillingCheckbox } from "client/controls/abstract/input.control";

import "resources/styles/forms.css";
import "resources/styles/pages/reports.css";


const granularity = {
	daily	: 1,
	monthly	: 2,
	yearly	: 3,
	total	: 4
}// granularity;


const reports_panels = {
	client_report	: 1,
	project_report	: 2,
	teamster_report	: 3,
	daily_report	: 4,
}// reports_panels;


export default class ProjectReport extends BaseControl {


	reports_panel = React.createRef ();
	results_panel = React.createRef ();

	selector = React.createRef ();


	state = {

		current_panel: null,

		client_id: null,
		project_id: null,

		entries: null,
		granularity: granularity.daily,

		use_billable: true,
		use_cancelled: false,
		use_dates: false,

		billable: false,

		use_header: true,

		start_date: new Date (),
		end_date: new Date (),

	}// state;


	static defaultProps = { id: "reports_page" }


	constructor (props) {
		super (props);
		if (debugging ()) console.log (`Creating project report page (${this.props.id})`);
	}// constructor;


	format_data = data => {

		let result = null;

		if (not_set (data)) return result;

		data.forEach (item => {

			let start_time = Date.validated (item.start_time);
			let end_time = Date.validated (item.end_time);

			if (not_set (end_time)) return;

			let data_item = {
				...item,
				year: start_time.get_year (),
				month: start_time.get_month_name (),
				day: `${start_time.get_weekday_name ()} ${start_time.get_appended_day ()}`,
				start_time: start_time.format (date_formats.timestamp),
				end_time: end_time.same_day (start_time) ? end_time.format (date_formats.timestamp) : end_time.format (date_formats.report_datetime),
				billed: (item.billed == 1),
			}// data_item;

			if (OptionStorage.can_bill ()) data_item = { ...data_item,
				total_due: item.total_due,
				rate: item.rate,
			}// if;

			if (is_null (result)) result = [];
			result.push (data_item);

		});

		return result;

	}/* format_data */;


	has_billable_items = () => (this.state?.entries?.find (item => (item.billed == 0))?.length ?? 0) > 0;
	

	/********/


	daily_breakdown_header = () => <Container inline={false} className="report-header">

		<div>Start time</div>
		<div>End time</div>
		<div>Notes</div>
		<div>Total time</div>

		{(this.state.billable) && <Container>
			<div>Rate</div>
			<div>Total due</div>
			<div>Billed</div>
		</Container>}

	</Container>


	daily_breakdown_row = data => <Container inline={false} className={`report-entry ${(data.total_time > ((Date.increments.hours / 1000) * 8)) ? "overtime-grid" : blank}`} style={{ cursor: "pointer" }}>
						
		<div className="right-aligned-text">{data.start_time}</div>
		<div className="right-aligned-text">{data.end_time}</div>
		<div className="report-notes">{data.notes}</div>
		<div className="right-aligned-text">{Date.elapsed (data.total_time)}</div>

		{(this.state.billable) && <Container> {/* make data?.rate optional depending on whether 'include unbillable items' (new checkbox option) is set */}

			<div className="right-aligned-text">{data.rate?.toCurrency ()}</div>
			<div className="right-aligned-text">{data.total_due?.toCurrency ()}</div>

			<BillingCheckbox id={data.log_id} onClick={event => {
				if (event.target.checked === false) return this.ask_question (`
					This entry has been marked as billed!
					If you continue, your client may be charged twice.

					Are you sure?
				`);
				return true;
			}} checked={data.billed} />

		</Container>}

	</Container>


	daily_breakdown_footer = data => {

		let total_time = 0;
		let total_earned = 0;
		let total_due = 0;

		if (isset (this.state.entries)) this.state.entries.map (row => {
			total_time += row.total_time;
			total_earned += row.total_due;
			if (!row.billed) total_due += row.total_due;
		});

		return <Container>			

			{(this.state.billable) && <div className="footer">

				<div style={{ textAlign: "left", gridColumn: "1 / 4" }}>Paid</div>
				<div style={{ gridColumn: "4", gridRow: "auto / span 2" }} className="vertically-centered">{Date.elapsed (total_time)}</div>
				<div style={{ gridColumn: "5 / 7" }}>{(total_earned - total_due).toCurrency ()}</div>
				<div />

				<div style={{ textAlign: "left", gridColumn: "1 / 4" }}>Outstanding</div>
				<div style={{ gridColumn: "5 / 7" }}>{total_due.toCurrency ()}</div>
				<div />

			</div>}

			<div className="footer-total">
				<div style={{ textAlign: "left", gridColumn: "1 / -2" }}>Total</div>
				<div>{Date.elapsed (total_time)}</div>

				{(this.state.billable) && <Container>
					<div>{total_earned.toCurrency ()}</div>
					<div><input type="checkbox" onClick={() => alert ("On click should set all checkboxes to 'billed' (i.e. checked)")} /></div>
				</Container>}
			</div>

		</Container>

	}/* daily_breakdown_footer */;


	daily_breakdown () {
		return <div>
			<ReportGrid data={this.format_data (this.state.entries)} ref={this.daily_breakdown_report_grid} categories={["year", "month", "day"]}
				header={this.daily_breakdown_header}
				row={this.daily_breakdown_row}
				footer={this.daily_breakdown_footer}>
			</ReportGrid>
		</div>
	}// daily_breakdown;


//	let use_header = ;


	project_report_options () {
		return <Container>
		
			<div className="horizontally-centered">

				<div className="two-column-table">

					<ProjectSelector id="report_selector" ref={this.selector} useHeader={this.selector.current?.state.project_data?.length == 1} headerSelectable={false}
						onClientChange={client_id => this.setState ({ client_id: client_id }, () => console.log (this.state.project_id))}
						onProjectChange={project_id => this.setState ({ project_id: project_id })}>
					</ProjectSelector>

					<div className="vertically-centered">
						<div className="one-piece-form checkbox-form">

							<input type="checkbox" id="use_billable" onClick={event => this.setState ({ use_billable: event.target.checked }) } disabled={true} /> {/* DISABLED PENDING IMPLEMENTATION */}
							<label htmlFor="use_billable" style={{ textAlign: "left" }}>Billable</label>

							<input type="checkbox" id="use_cancelled" onClick={event => this.setState ({ use_cancelled: event.target.checked }) } disabled={true} /> {/* DISABLED PENDING IMPLEMENTATION */}
							<label htmlFor="use_cancelled">Cancelled entries</label>

						</div>
					</div>

				</div>


				<div className="two-column-table with-headspace">

					<div className="horizontally-aligned">
						<input type="checkbox" id="use_date_range" onClick={event => this.setState ({ use_dates: event.target.checked }) } />
						<label htmlFor="use_date_range">Date range</label>
					</div>
					
					<div className={`one-piece-form ${this.state.use_dates ? null : "disabled" }`}>

						<label htmlFor="date_range_start">Start date</label>
						<DateInput id="date_range_start" disabled={!this.state.use_dates} value={this.state.start_date} onChange={value => this.setState ({ start_date: value })} />

						<label htmlFor="date_range_end">End date</label>
						<DateInput id="date_range_end" disabled={!this.state.use_dates} value={this.state.end_date} onChange={value => this.setState ({ end_date: value })} />

					</div>
				
				</div>
			</div>	

			<FadePanel id="report_button_panel" visible={isset (this.state.project_id)}>
				<div className="button-panel with-headspace">
					<SelectButton onClick={() => this.results_panel.current.animate (() => ReportsModel.get_by_project (this.state.project_id, this.state.use_dates ? {
						start_date: this.state.start_date.format (date_formats.database_date), 
						end_date: this.state.end_date.format (date_formats.database_date),
					} : null).then (data => this.setState ({ 
						entries: data,
						is_billable: this.has_billable_items (data),
					})))}>Generate</SelectButton>
				</div>
			</FadePanel>

		</Container>

	}// project_report_options;


	project_report () {
		return <ExplodingPanel id="report_results_panel" ref={this.results_panel}>
			{isset (this.state.entries) && <Container visible={this.state.granularity < 4}>
				{this.daily_breakdown ()}
			</Container>}
		</ExplodingPanel>
	}// project_report;

	
	/********/


	render = () => <div className="horizontally-centered">
		<div style={{ display: "inline-block" }}>{this.project_report_options ()}</div>
		<div className="with-headspace">{this.project_report ()}</div>
	</div>


}// ProjectReport;