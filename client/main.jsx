import "regenerator-runtime/runtime.js";
import "classes/types/prototypes";

import "client/resources/styles/main.css";

import React from "react";
import ReactDOM from "react-dom";

import SelectList from "controls/select.list";
import Container from "controls/container";

import BaseControl from "controls/abstract/base.control";
import ExplodingPanel from "controls/panels/exploding.panel";

import Companies from "classes/storage/companies";

import MasterPanel from "client/master";

import SigninPage from "pages/sign.in";
import SignupPage from "pages/sign.up";

import { globals } from "classes/types/constants";
import { isset, is_empty, not_empty, notify } from "classes/common";

import { MainContext } from "classes/types/contexts.jsx";


// Special Guest Import
import ToggleSwitch from "controls/toggle.switch";



class Main extends BaseControl {

	state = { 
		signing_up: false,
		company_id: null
	}/* state */;


	reference = React.createRef ();


	constructor (props) {
		super (props);
		globals.main = this;
		window.onerror = this.error_handler;
		this.state.company_id = Companies.active_company_id ();
	}// constructor;


	company_header () {

		let companies = Companies.list ();

		if (!this.signed_in ()) return null

		return (
			<div>
				<Container condition={(isset (companies) && (companies.length > 1))}>
					<SelectList value={Companies.active_company_id ()} data={companies}
					
						idField="company_id" textField="company_name" hasHeader={true}
						
						onChange={event => {
							Companies.set ("active_company", event.target.value);
							this.setState ({ company_id: event.target.value });
						}}>
							
					</SelectList>
				</Container>

				<Container condition={(isset (companies) && (companies.length == 1))}>
					<div>{not_empty (companies) ? companies [0].company_name : null}</div>
				</Container>

				<Container condition={is_empty (companies)}>
					<div>Guest Account</div>
				</Container>
			</div>
		);

	}// company_header;


error_handler (message, url, line) { notify (message, url, line) }


	main_page () {

		if (this.signed_in ()) return <MasterPanel id="master_panel" parent={this} companyId={this.state.company_id} />
		if (this.state.signing_up) return <SignupPage parent={this} />

		return <SigninPage parent={this} />
		
	}// main_page;


    render () {
		return (
			<MainContext.Provider value={{ company_id: this.state.company_id }}>
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

//	ReactDOM.render (<Main id="timelog_main_page" />, document.getElementById ("main_page"));

//	Special Guest Render	
	ReactDOM.render (<ToggleSwitch value={1} singleStep={true} id="special_guest_import">
		<option>One</option>
		<option>Two</option>
		<option>Three</option>
		<option>Four</option>
		<option>Fve</option>
		<option>Six</option>
		<option>Seven</option>
		<option>Eight</option>
		<option>Nine</option>
	</ToggleSwitch>, document.getElementById ("main_page"));

//	Quick Test Render
//	ReactDOM.render (<QuickTest />, document.getElementById ("main_page"));

}// document.ready;