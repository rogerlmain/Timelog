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

import Account from "classes/storage/account";;
import Companies from "classes/storage/companies";

import MasterPanel from "client/master";

import SigninPage from "pages/sign.in";
import SignupPage from "pages/sign.up";

import Settings from "pages/settings";

import { globals } from "classes/types/constants";

import { MainContext } from "classes/types/contexts.jsx";


//Special Guest Import
import DeluxeAccountForm from "./forms/deluxe.account.form";



class Main extends BaseControl {

	state = { 
		signing_up: false,
		company_id: null
	}/* state */;


	reference = React.createRef ();


	constructor (props) {

		let company_list = Companies.company_list ();
		let active_company = Companies.active_company_id ();

		super (props);
		globals.main = this;
		window.onerror = this.error_handler;

		this.state.company_id = common.isset (company_list) ? ((common.not_set (active_company) && (company_list.length == 1)) ? company_list [0].company_id : active_company) : null;

	}// constructor;


	company_header () {

		let companies = Companies.company_list ();

		if (!this.signed_in ()) return null

		return <div>
			<div className="right-aligned">{Account.full_name ()}</div>
			<div className="right-aligned">

				<Container condition={Companies.company_count () > 1}>
					<SelectList value={Companies.active_company_id ()} data={companies}
					
						textField="company_name" hasHeader={true}
						
						onChange={event => {
							Companies.set_active_company (event.target.value);
							this.setState ({ company_id: event.target.value }, this.forceRefresh);
						}}>
							
					</SelectList>
				</Container>

				<Container condition={Companies.company_count () == 1}>
					<div>{common.nested_value (Companies.active_company (), "company_name")}</div>
				</Container>

				<Container condition={common.is_empty (companies)}>
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
		return (
			<MainContext.Provider value={{ company_id: this.state.company_id, main_page: this }}>
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
 		);
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