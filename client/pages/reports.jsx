import React from "react";

import ReportsModel		from "client/classes/models/reports.model";
import OptionStorage	from "client/classes/storage/options.storage";

import BaseControl		from "client/controls/abstract/base.control";
import SelectButton		from "client/controls/buttons/select.button";
import DateInput		from "client/controls/inputs/date.input";
import ReportGrid		from "client/controls/lists/report.grid";
import FadePanel		from "client/controls/panels/fade.panel";
import ProjectSelector	from "client/controls/selectors/project.selector";

import Container	from "client/controls/container";

import { date_formats } from "client/classes/types/constants";
import { debugging, get_keys, isset, is_null, is_object, not_set } from "client/classes/common";

import { BillingCheckbox } from "client/controls/abstract/input.control";

import "resources/styles/forms.css";
import "resources/styles/pages/reports.css";


const granularity = {
	daily	: 1,
	monthly	: 2,
	yearly	: 3,
	total	: 4
}// granularity;


export default class ReportsPage extends BaseControl {


	static defaultProps = { id: "reports_page" }


	state = {

		client_id: null,
		project_id: null,

		entries: null,
		granularity: granularity.daily,

		use_billable: true,
		use_cancelled: false,
		use_dates: false,

		start_date: new Date (),
		end_date: new Date (),

	}// state;


	constructor (props) {
		super (props);
		if (debugging ()) console.log (`Creating reports page (${this.props.id})`);
	}// constructor;


	/********/


	daily_entries () {

		let current_day = null;
		
		return this.state.entries.map (entry => {

			let start_time = new Date (entry.start_time);
			let end_time = new Date (entry.end_time);

			let day_text = start_time.same_day (current_day) ? null : (isset (start_time) ? start_time.format (date_formats.full_date) : null);

			if (entry.total_time == 0) return;
			if (isset (day_text)) current_day = start_time.get_date ();

			return <div className="ghost-box report-entry" key={`result_id#${entry.log_id}`}>
				<div className="entry">{day_text}</div>
				<div className="entry">{entry.notes}</div>
				<div className="entry">{start_time.format (date_formats.timestamp)}</div>
				<div className="entry">{end_time.format (start_time.same_day (end_time) ? date_formats.timestamp : date_formats.full_datetime)}</div>
				<div className="entry">{Date.elapsed (entry.total_time)}</div>
				<Container visible={OptionStorage.can_bill ()}>
					<input type="checkbox" onClick={() => alert (entry.entry_id)
						// "TO DO: update the log entry in the database")
					} />
				</Container>
			</div>

		});
	}// daily_entries;


	monthly_entries () {

		let entry_list = null;

		let current_month = null;
		let current_year = null;

		this.state.entries.map (entry => {

			let start_time = Date.validated (entry.start_time);

			let active_year = start_time.get_year ();
			let active_month = Date.month_name (start_time.get_month ());

			let item = isset (entry_list) ? entry_list.find (element => { return is_object (element) && (element.year == active_year) && (element.month == active_month) }) : null;

			if (not_set (item)) {
				if (is_null (entry_list)) entry_list = [];
				entry_list.push (item = {
					year: active_year,
					month: active_month,
					value: 0
				});
			}// if;
			
			item.value += entry.total_time;

		});


		return (entry_list.map (item => {
			
			let active_year = (item.year != current_year) ? current_year = item.year : null;
			let active_month = (item.month != current_month) ? current_month = item.month : null;

			return <Container>
				<div className="entry" style={{ columnWidth: "min-content" }}>{active_year}</div>
				<div className="entry" style={{ gridColumn: "2 / 4", textAlign: "left" }}>{active_month}</div>
				<div className="entry">{Date.elapsed (item.value)}</div>
			</Container>

		}));

	}// monthly_entries;


	yearly_entries () {

		let entry_list = null;
		
		this.state.entries.map (entry => {

			let start_time = Date.validated (entry.start_time);
			let year = start_time.get_year ();

			if (is_null (entry_list)) entry_list = {}
			if (is_null (entry_list [year])) return entry_list [year] = entry.total_time;
			entry_list [year] += entry.total_time;

		});


		return (get_keys (entry_list).map (year => {
			let value = entry_list [year];
			return <Container>
				<div className="entry" style={{ gridColumn: "1 / 4" }}>{year}</div>
				<div className="entry">{Date.elapsed (value)}</div>
			</Container>
		}));

	}// yearly_entries;


	// ON ICE - REVISE FOR OTHER LINEAR REPORTS
	list_entries () {

		let entries = null;

		if (!this.state.entries) return entries;

		switch (this.state.granularity) {
			case granularity.daily: entries = this.daily_entries (); break;
			case granularity.monthly: entries = this.monthly_entries (); break;
			case granularity.yearly: entries = this.yearly_entries (); break;
		}// switch;

		return <Container>{entries}</Container>

	}// list_entries;


	/********/


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


	daily_breakdown () {
		return <div>
			<ReportGrid data={this.format_data (this.state.entries)} categories={["year", "month", "day"]}

				header={data => {
					return <Container inline={false} className="report-header">
						<div>Start time</div>
						<div>End time</div>
						<div>Notes</div>
						<div>Total time</div>
						<Container visible={OptionStorage.can_bill ()}>{/*  && (data [0].rate > 0)}> */}
							<div>Total due</div>
							<div>Rate</div>
							<div>Billed</div>
						</Container>
					</Container>
				}}

				row={data => {
					return <Container inline={false} className={`report-grid ${(data.total_time > ((Date.increments.hours / 1000) * 8)) ? "overtime-grid" : null}`} style={{ cursor: "pointer" }}>
						
						<div className="right-aligned-text">{data.start_time}</div>
						<div className="right-aligned-text">{data.end_time}</div>
						<div>{data.notes}</div>
						<div className="right-aligned-text">{Date.elapsed (data.total_time)}</div>

						<Container visible={OptionStorage.can_bill ()}>{/*  && (data.rate > 0)}> */}
							<div className="right-aligned-text">{data.total_due}</div>
							<div className="right-aligned-text">{data.rate}</div>
							<BillingCheckbox id={data.log_id} onClick={event => {
								if (event.target.checked === false) return warning (`
									This entry has been marked as billed!
									If you continue, your client may be charged twice.

									Are you sure?
								`);
								return true;
							}} checked={data.billed} />
						</Container>

					</Container>
				}}>
				
			</ReportGrid>
		</div>
	}// daily_breakdown;


	/********/


	show_options () {
		return <Container>
		
			<div className="horizontally-centered">

				<div className="two-column-table">

					<ProjectSelector id="report_selector" hasHeader={true} headerSelectable={false} 
						onClientChange={event => this.setState ({ client_id: event.target.value })}
						onProjectChange={event => this.setState ({ project_id: event.target.value })}>
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
					<SelectButton onClick={() => ReportsModel.fetch_by_project (this.state.project_id, this.state.use_dates ? {
						start_date: this.state.start_date.format (date_formats.database_date), 
						end_date: this.state.end_date.format (date_formats.database_date),
					} : null).then (data => this.setState ({ entries: data }))}>Generate</SelectButton>
				</div>
			</FadePanel>

		</Container>

	}// show_options;



	expand_dates (items) {
		items = Array.arrayify (items);
		if (Array.isArray (items)) items.forEach (item => {

			let item_date = new Date (item.start_time);

			item.year = item_date.get_year ();
			item.month = item_date.get_month_name ();
			item.day = item_date.get_day ();
			item.weekday = item_date.get_weekday_name ();

		});

/* 		
	<div>{start_time.format (date_formats.timestamp)}</div>
	<div>{end_time.format (start_time.same_day (end_time) ? date_formats.timestamp : date_formats.full_datetime)}</div>
	<div className="tree-notes">{entry.notes}</div>
	<div>{Date.elapsed (entry.total_time)}</div>

	<Container visible={can_bill}>

		<div style = {{
			display: "flex",
			color: (billed ? null : "var(--disabled-color)"),
			justifyContent: (billed ? "flex-end" : "center"),
		}}>{billed ? `$${entry.total_due}` : <>&mdash;</>}</div>

		<div style={{ justifyContent: "center" }}>
			<input type="checkbox" disabled={!billed} onClick={() => alert (entry.entry_id)
				// "TO DO: update the log entry in the database")
			} />
		</div>

	</Container>
*/



		return items;
	}/* expand_dates */;




	

	show_results () {

		let has_data = isset (this.state.entries);

		return <div className="horizontally-aligned">
			<FadePanel id="report_results_panel" visible={has_data}>
				
				{/* 
					REINSTATE WHEN LINEAR OPTION BECOMES NECESSARY 

					<div className={`${OptionStorage.can_bill () ? "six-column-grid" : "five-column-grid"} report-grid"`}>
						<hr className="report-rule" />
						<Container visible={this.state.granularity < 4}>{this.list_entries ()}</Container>
						<hr className="report-rule" />
						{this.show_totals ()}
					</div>
				*/}

				<Container visible={this.state.granularity < 4}>
					{this.daily_breakdown ()}
				</Container>

				{this.show_totals ()}

			</FadePanel>
		</div>

	}// show_results;


	show_totals () {

		let total = 0;

		if (isset (this.state.entries)) this.state.entries.map (row => total += row.total_time);

		return <Container>
			<div className="entry" style={{ gridColumn: "1 / 5" }}>Total</div>
			<div className="entry">{Date.elapsed (total)}</div>
		</Container>

	}// show_totals;


	/********/


	render () {
		return <div id={this.props.id} className="horizontally-centered">
			<div style={{ display: "inline-block" }}>{this.show_options ()}</div>
			<br />
			<div>{this.show_results ()}</div>
		</div>
	}// render;

}// ReportsPage;