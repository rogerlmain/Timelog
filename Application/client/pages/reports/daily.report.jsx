import React from "react";

import Container from "client/controls/container";
import BaseControl from "client/controls/abstract/base.control";
import SelectButton from "client/controls/buttons/select.button";
import DateInput from "client/controls/inputs/date.input";
import FadePanel from "client/controls/panels/fade.panel";
import ExplodingPanel from "client/controls/panels/exploding.panel";

import ReportsModel from "client/classes/models/reports.model";

import AccountStorage from "client/classes/storage/account.storage";
import OptionsStorage from "client/classes/storage/options.storage";


import { blank, date_formats, granularity_types, ranges } from "client/classes/types/constants";
import { isset, is_null, not_set } from "client/classes/common";


export default class DailyReport extends BaseControl {


	results_panel = React.createRef ();


	state = { 
		account: null,
		report_date: null,
		report_data: null,
	}/* state */


	constructor (props) {
		super (props);
		this.state.report_date = new Date ().date_part ();
	}/* constructor */


	/********/


	format_timespan (total_time) {

		let total = Date.timespan (total_time);
		let hours = total.hours + (total.days * 24);

		return `${hours}:${total.mins.padded (2)}${(OptionsStorage.granularity () == granularity_types.truetime) ? `:${total.secs.padded (2)}` : blank}`;
		
	}/* format */;


	daily_total () {

		let total = 0;

		this.state.report_data.forEach (item => total += item.total_time);
		return this.format_timespan (total)

	}/* daily_total */


	report_items () {
		
		if (is_null (this.state.report_data)) return null;

		let result = new Array (<div className="report-title" key="title">
			<div key={1}>Client</div>
			<div key={2}>Project</div>
			<div key={3}>Total time</div>
		</div>);

		this.state.report_data.forEach (item => result.push (<div className="report-row" key={`${item.log_id}`}>
			<div>{item.client_name}</div>
			<div>{item.project_name}</div>
			<div style={{ textAlign: "right" }}>{this.format_timespan (item.total_time)}</div>
		</div>));

		if (this.state.report_data.length > 1) result.push (<div className="report-footer" key="footer">
			<div style={{ gridColumn: "span 2", height: "100%" }} />
			<div>{this.daily_total ()}</div>
		</div>);

		return result;
		
	}/* report_items */


	update_report () {
		ReportsModel.get_daily_report (AccountStorage.account_id (), this.state.report_date.format (date_formats.database_date)).then (data => {

			let result = null;

			if (not_set (data)) return;

			data.forEach (row => {

				let report_end = this.state.report_date.add (Date.parts.days, 1);
				let result_item = result?.find (item => item.project_id == row.project_id);

				let new_item = result_item ?? {
					client_id	: row.client_id,
					project_id	: row.project_id,
					client_name	: row.client_name,
					project_name: row.project_name,
				};

				let start_time = new Date (row.start_time).rounded (ranges.start);
				let end_time = new Date (row.end_time).rounded (ranges.end);

				if (start_time < this.state.report_date) start_time = this.state.report_date;
				if (end_time > report_end) end_time = report_end;

				new_item.total_time = (result_item?.total_time ?? 0) + end_time.getTime () - start_time.getTime ();

				if (not_set (result_item)) {
					if (is_null (result)) result = new Array ();
					result.push (new_item);
				}// if;


			});
			
			this.setState ({ report_data: result });
			
		});
	}/* update_report */

	daily_report_options () {
		return <Container>

			<div className="left-aligned">
				<div className="two-column-grid">

					<label>Account</label>
					<div>{this.state.account?.full_name ?? AccountStorage.full_name ()}</div>

					<label>Date</label>
					<DateInput id="report_date" value={this.state.report_date} onChange={value => this.setState ({ report_date: value })} />

				</div>
			</div>
			
			<div className="simple-report three-column-grid with-lotsa-headspace">{this.report_items ()}</div>

			<FadePanel id="report_button_panel" visible={isset (this.state.report_date)}>
				<div className="button-panel with-headspace">
					<SelectButton onClick={() => this.results_panel.current.animate (() => this.update_report ())}>Generate</SelectButton>
				</div>
			</FadePanel>

		</Container>

	}

	daily_report = () => <ExplodingPanel id="report_results_panel" ref={this.results_panel}>
		{isset (this.state.entries) && <Container visible={this.state.granularity < 4}>
			{this.daily_breakdown ()}
		</Container>}
	</ExplodingPanel>

	


	/********/


	render = () => <div className="horizontally-centered">
		<div style={{ display: "inline-block" }}>{this.daily_report_options ()}</div>
		<div className="with-headspace">{this.daily_report ()}</div>
	</div>

}/* DailyReport */