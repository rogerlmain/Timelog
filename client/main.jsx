import "regenerator-runtime/runtime.js";
import "classes/types/prototypes";

import "client/resources/styles/main.css";

import * as common from "classes/common";

import React from "react";
import ReactDOM from "react-dom";

import Container from "controls/container";

import BaseControl from "controls/abstract/base.control";
import SelectList from "controls/select.list";
import ExplodingPanel from "controls/panels/exploding.panel";

import AccountStorage from "classes/storage/account.storage";
import CompanyStorage from "classes/storage/company.storage";

import MasterPanel from "client/master";

import SigninPage from "pages/sign.in";
import SignupPage from "pages/sign.up";

import Settings from "pages/settings";

import { globals } from "classes/types/constants";
import { numeric_value } from "classes/common";

import { MainContext } from "classes/types/contexts";


//Special Guest Import
import DeluxeAccountForm from "./forms/deluxe.account.form";



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
		window.onerror = this.error_handler;

		this.state.company_id = common.isset (company_list) ? ((common.not_set (active_company) && (company_list.length == 1)) ? company_list [0].company_id : active_company) : null;

	}// constructor;


	company_header () {

		let companies = CompanyStorage.company_list ();

		if (!this.signed_in ()) return null

		return <div>
			<div className="right-aligned">{AccountStorage.full_name ()}</div>
			<div className="right-aligned">

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
			<div ref={this.reference} style={{ display: "flex", flexDirection: "column" }}>

				<div className="horizontally-spaced-out">

					<div className="page-header">
						<div className="title">RMPC Timelog</div>
						<div className="tagline">Make every second count</div>
					</div>

					{this.company_header ()}

				</div>
				
				<ExplodingPanel id="main_panel">
					{this.main_page ()}
				</ExplodingPanel>

			</div>
		</MainContext.Provider>
 	}// render;

}// Main;


/*********/


document.onreadystatechange = () => {

ReactDOM.render (<Main id="timelog_main_page" />, document.getElementById ("main_page"));

//	Special Guest Render	
//	ReactDOM.render (<DeluxeAccountForm option="granularity" optionPrice={299} />, document.getElementById ("main_page"));

//	Quick Test Render
//	ReactDOM.render (<QuickTest />, document.getElementById ("main_page"));

}// document.ready;