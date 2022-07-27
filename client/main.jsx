import "regenerator-runtime/runtime.js";
import "classes/types/prototypes";

import "resources/styles/main.css";

import React from "react";

import Container from "controls/container";

import BaseControl		from "client/controls/abstract/base.control";
import ExplodingPanel	from "client/controls/panels/exploding.panel";
import SelectList 		from "client/controls/lists/select.list";
import ReportGrid 		from "client/controls/lists/report.grid";

import AccountStorage from "client/classes/storage/account.storage";
import CompanyStorage from "client/classes/storage/company.storage";

import MasterPanel from "client/master";

import SigninPage from "pages/sign.in";
import SignupPage from "pages/sign.up";

import logo from "resources/images/clock.png";


import { createRoot } from "react-dom/client";

import { debugging, tracing, globals, date_formats } from "client/classes/types/constants";
import { isset, is_empty, not_set, nested_value, notify, numeric_value, is_null, warning } from "client/classes/common";

import { MainContext } from "client/classes/types/contexts";

import { BillingCheckbox } from "client/controls/abstract/input.control";


// Guest Imports
import ReportsModel from "./classes/models/reports";
import OptionStorage from "./classes/storage/options.storage";

import "resources/styles/forms.css";
import OptionsStorage from "./classes/storage/options.storage";

// import ReportsModel from "./classes/models/reports";
// import TreeGrid from "client/controls/lists/tree.grid";
// import OptionStorage from "./classes/storage/options.storage";

//Special Guest Import
//import ProjectSelector from "client/controls/selectors/project.selector";


const version = "1.7.3";


class Main extends BaseControl {

	state = { 
		signing_up: false,
		company_id: null,
		current_time: null,
	}/* state */;


	reference = React.createRef ();


	constructor (props) {

		let company_list = CompanyStorage.company_list ();
		let active_company = CompanyStorage.active_company_id ();

		super (props);
		globals.main = this;

		// window.onerror = this.error_handler;

		this.state.company_id = isset (company_list) ? ((not_set (active_company) && (company_list.length == 1)) ? company_list [0].company_id : active_company) : null;
		if ((debugging) || (tracing)) console.log ("creating main page");

	}// constructor;


	/********/


	company_header () {

		let companies = CompanyStorage.company_list ();

		return <div style={{ marginLeft: "2em", fontStyle: "italic" }} className="right-aligned">

			<Container visible={this.signed_in ()}>

				<div className="right-aligned-text">Hello {AccountStorage.full_name ()}!</div>
				
				<div className="right-aligned-text">

					<Container visible={CompanyStorage.company_count () > 1}>
						<SelectList value={CompanyStorage.active_company_id ()} data={companies}
						
							textField="company_name" hasHeader={true}
							
							onChange={event => {
								CompanyStorage.set_active_company (event.target.value);
								this.setState ({ company_id: event.target.value }, this.forceRefresh);
							}}>
								
						</SelectList>
					</Container>

					<Container visible={CompanyStorage.company_count () == 1}>
						<div>{nested_value (CompanyStorage.active_company (), "company_name")}</div>
					</Container>

					<Container visible={is_empty (companies)}>
						<div>Guest Account</div>
					</Container>
					
				</div>

			</Container>

			<Container visible={!this.signed_in ()}>
				<div className="right-aligned-text">Welcome!</div>
			</Container>

			<div className="right-aligned-text with-some-headspace">{this.state.current_time}</div>

		</div>

	}// company_header;


	error_handler (message, url, line) { notify (message, url, line) }


	update_clock () {

		let current_time = new Date ();
		let target_time = new Date (current_time);

		target_time.setSeconds (target_time.getSeconds () + 1);
		target_time.setMilliseconds (0);

		this.setState ({ current_time: current_time.format (OptionsStorage.truetime () ? date_formats.detailed_datetime : date_formats.short_detailed_datetime) });
		setTimeout (this.update_clock.bind (this), target_time.getTime () - current_time.getTime ());

	}// update_clock;


	/********/


	componentDidMount () { this.update_clock () }
	
	
    render () {

		let active_panel = (this.signed_in () ? "master_panel" : (this.state.signing_up ? "signup_panel" : "signin_panel"));

		return <MainContext.Provider value={{ company_id: numeric_value (this.state.company_id), main_page: this }}>
			<div ref={this.reference} className="vertically-spaced-out main-page">

				<div>

					<div className="horizontally-spaced-out page-header">

						<div className="two-column-grid">

							<img src={logo} style={{ height: "3em" }} />

							<div className="program-title">
								<div className="title">RMPC Timelog</div>
								<div className="tagline">Make every second count</div>
							</div>

						</div>

						{this.company_header ()}

					</div>
					
					<div className="full-width horizontally-centered">
						
						<ExplodingPanel id="main_panel">

							<Container id="master_panel_container" visible={active_panel == "master_panel"}>
								<MasterPanel id="master_panel" parent={this} companyId={this.state.company_id} />
							</Container>

							<Container id="signup_panel_container" visible={active_panel == "signup_panel"}>
								<SignupPage parent={this} />
							</Container>

							<Container id="signin_panel_container" visible={active_panel == "signin_panel"}>
								<SigninPage parent={this} />
							</Container>

						</ExplodingPanel>

					</div>

				</div>

				<div className="page-footer">
					<div>&copy; Copyright 2022 - Roger Main Programming Company (RMPC) - All rights reserved</div>
					<div>Version {version}</div>
				</div>

			</div>
		</MainContext.Provider>
 	}// render;

}// Main;


/**** FOR DEBUGGING ONLY *****/


class QuickTest extends BaseControl {


	format_data = data => {

		let result = null;

		if (not_set (data)) return result;

		data.forEach (item => {

			let start_time = Date.validated (item.start_time);
			let end_time = Date.validated (item.end_time);

			let data_item = {
				year: start_time.get_year (),
				month: start_time.get_month_name (),
				day: `${start_time.get_weekday_name ()} ${start_time.get_appended_day ()}`,
				start_time: start_time.format (date_formats.timestamp),
				end_time: end_time.same_day (start_time) ? end_time.format (date_formats.timestamp) : end_time.format (date_formats.report_datetime),
				notes: item.notes,
				total_time: item.total_time,
				log_id: item.log_id,
			}// data_item;

			if (OptionStorage.can_bill ()) data_item = { ...data_item,
				total_due: item.total_due,
				rate: item.rate,
			}// if;

			if (is_null (result)) result = [];
			result.push (data_item);

		});

		this.setState ({ data: result });

	}/* format_data */;


	/********/


	componentDidMount () {
		ReportsModel.fetch_by_project (163).then (data => this.format_data (data));
	}// componentDidMount;


	render () {
		return <div>
			<ReportGrid data={this.state.data} categories={["year", "month", "day"]}

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
							}} />
						</Container>

					</Container>
				}}>
				
			</ReportGrid>
		</div>
	}// render;

}// QuickTest;


/*********/


document.onreadystatechange = () => {

	if (debugging) console.log (`Debug test: ${new Date ().format (date_formats.full_datetime)}`);
	createRoot (document.getElementById ("main_page")).render (<Main id="timelog_main_page" />);

	// Special Guest Render	
	// createRoot (document.getElementById ("main_page")).render (<TestControl />);
	// createRoot (document.getElementById ("main_page")).render (<QuickTest />);
	
}// document.ready;