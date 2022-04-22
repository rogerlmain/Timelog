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

import Companies from "classes/storage/companies";

import MasterPanel from "client/master";

import SigninPage from "pages/sign.in";
import SignupPage from "pages/sign.up";

import Settings from "pages/settings";

import { globals } from "classes/types/constants";

import { MainContext } from "classes/types/contexts.jsx";


// Special Guest Import
// import Slider from "controls/slider";



class Main extends BaseControl {

	state = { 
		signing_up: false,
		company_id: null
	}/* state */;


	reference = React.createRef ();


	constructor (props) {

		let company_list = Companies.list ();
		let active_company = Companies.active_company_id ();

		super (props);
		globals.main = this;
		window.onerror = this.error_handler;

		this.state.company_id = common.isset (company_list) ? ((common.not_set (active_company) && (company_list.length == 1)) ? company_list [0].company_id : active_company) : null;

	}// constructor;


	company_header () {

		let companies = Companies.list ();

		if (!this.signed_in ()) return null

		return (
			<div>
				<Container condition={(common.isset (companies) && (companies.length > 1))}>
					<SelectList value={Companies.active_company_id ()} data={companies}
					
						idField="company_id" textField="company_name" hasHeader={true}
						
						onChange={event => {
							Companies.set_active_company (event.target.value);
							this.setState ({ company_id: event.target.value }, this.forceRefresh);
						}}>
							
					</SelectList>
				</Container>

				<Container condition={(common.isset (companies) && (companies.length == 1))}>
					<div>{common.not_empty (companies) ? companies [0].company_name : null}</div>
				</Container>

				<Container condition={common.is_empty (companies)}>
					<div>Guest Account</div>
				</Container>
			</div>
		);

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


class QuickTest extends BaseControl {


	input_field = React.createRef ();


	componentDidMount () {
		this.input_field.current.addEventListener ("keydown", event => alert ("listener"));
	}// componentDidMount;


	render () {
		return <input ref={this.input_field} onKeyDown={event => alert ("inline")} />
	}// render;


}// QuickTest;


/*********/


document.onreadystatechange = () => {

ReactDOM.render (<Main id="timelog_main_page" />, document.getElementById ("main_page"));

//	Special Guest Render	
	// ReactDOM.render (<div>
		
	// 	<MainContext.Provider value={{ company_id: 3, main_page: this }}>
	// 		<Settings id="special_guest_import" />
	// 	</MainContext.Provider>
			
	// </div>, document.getElementById ("main_page"));

//	Quick Test Render
//	ReactDOM.render (<QuickTest />, document.getElementById ("main_page"));

}// document.ready;