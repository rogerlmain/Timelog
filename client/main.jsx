import "regenerator-runtime/runtime.js";
import "classes/types/prototypes";

import "client/resources/styles/main.css";

import React from "react";
import ReactDOM from "react-dom";

import Container from "controls/container";

import BaseControl from "client/controls/abstract/base.control";
import ExplodingPanel from "client/controls/panels/exploding.panel";
import SelectList from "client/controls/select.list";

import AccountStorage from "client/classes/storage/account.storage";
import CompanyStorage from "client/classes/storage/company.storage";

import MasterPanel from "client/master";

import SigninPage from "pages/sign.in";
import SignupPage from "pages/sign.up";

import { date_formats, globals } from "client/classes/types/constants";
import { isset, is_empty, not_set, nested_value, notify, numeric_value } from "client/classes/common";

import { MainContext } from "client/classes/types/contexts";


//Special Guest Import
import TimePicker from "client/controls/time.picker";


const version = "1.2.3";


class Main extends BaseControl {

	state = { 
		signing_up: false,
		company_id: null
	}/* state */;


	reference = React.createRef ();


	constructor (props) {

		let company_list = CompanyStorage.company_list ();
		let active_company = CompanyStorage.active_company_id ();

		super (props);
		globals.main = this;

		// window.onerror = this.error_handler;

		this.state.company_id = isset (company_list) ? ((not_set (active_company) && (company_list.length == 1)) ? company_list [0].company_id : active_company) : null;

	}// constructor;


	company_header () {

		let companies = CompanyStorage.company_list ();

		if (!this.signed_in ()) return null

		return <div>

			<div className="right-aligned">Hello {AccountStorage.full_name ()}!</div>
			
			<div className="right-aligned" style={{ marginTop: "0.5em" }}>

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

		</div>

	}// company_header;


	error_handler (message, url, line) { notify (message, url, line) }


    render () {

		let active_panel = (this.signed_in () ? "master_panel" : (this.state.signing_up ? "signup_panel" : "signin_panel"));

		return <MainContext.Provider value={{ company_id: numeric_value (this.state.company_id), main_page: this }}>
			<div ref={this.reference} className="vertically-spaced-out main-page">

				<div className="vertically-centered horizontally-spaced-out page-header">

					<div className="program-title">
						<div className="title">RMPC Timelog</div>
						<div className="tagline">Make every second count</div>
					</div>

					{this.company_header ()}

				</div>
				
				<div className="full-screen">
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

				<div className="page-footer">
					<div>&copy; Copyright 2022 - Roger Main Programming Company (RMPC) - All rights reserved</div>
					<div>Version {version}</div>
				</div>

			</div>
		</MainContext.Provider>
 	}// render;

}// Main;


class QuickTest extends BaseControl {

	state = { current_time: new Date () }

	render () { 
		return <div>

			<div>{this.state.current_time.format (date_formats.full_datetime)}</div>

			<br /><br />

			<TimePicker id="time_picker" defaultValue={this.state.current_time}
				onChange={value => this.setState ({ current_time: value })}>
			</TimePicker>
		</div>
	}// render;

}// QuickTest;


/*********/


document.onreadystatechange = () => {

//	ReactDOM.render (<Main id="timelog_main_page" />, document.getElementById ("main_page"));

//	Special Guest Render	
	ReactDOM.render (<QuickTest />, document.getElementById ("main_page"));

}// document.ready;