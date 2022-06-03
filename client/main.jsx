import "regenerator-runtime/runtime.js";
import "classes/types/prototypes";

import "client/resources/styles/main.css";

import * as common from "classes/common";

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

import Settings from "pages/settings";

import { globals } from "client/classes/types/constants";
import { numeric_value } from "client/classes/common";

import { MainContext } from "client/classes/types/contexts";


//Special Guest Import
import SettingsPage from "pages/settings";



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

		this.state.company_id = common.isset (company_list) ? ((common.not_set (active_company) && (company_list.length == 1)) ? company_list [0].company_id : active_company) : null;

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
					<div>{common.nested_value (CompanyStorage.active_company (), "company_name")}</div>
				</Container>

				<Container visible={common.is_empty (companies)}>
					<div>Guest Account</div>
				</Container>
				
			</div>

		</div>

	}// company_header;


	error_handler (message, url, line) { common.notify (message, url, line) }


	main_page () {

		if (this.signed_in ()) return <MasterPanel id="master_panel" parent={this} companyId={this.state.company_id} />
		if (this.state.signing_up) return <SignupPage parent={this} />

		return <SigninPage parent={this} />
		
	}// main_page;


    render () {
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
						{this.main_page ()}
					</ExplodingPanel>
				</div>

				<div className="horizontally-spaced-out page-footer">
					<div className="two-column-grid">
						<div>&copy; Copyright 2022 - Roger L. Main dba RMPC</div>
						<div>Version 1.2</div>
					</div>
				</div>

			</div>
		</MainContext.Provider>
 	}// render;

}// Main;


class QuickTest extends BaseControl {
	render () { return null }
}// QuickTest;


/*********/


document.onreadystatechange = () => {

	ReactDOM.render (<Main id="timelog_main_page" />, document.getElementById ("main_page"));

//	Special Guest Render	
	// ReactDOM.render (<MainContext.Provider value={{ company_id: 132, main_page: this }}>
	// 	<SettingsPage />
	// </MainContext.Provider>, document.getElementById ("main_page"));

}// document.ready;