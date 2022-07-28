import "regenerator-runtime/runtime.js";
import "classes/types/prototypes";

import "resources/styles/main.css";

import React from "react";

import BaseControl from "client/controls/abstract/base.control";
import CompanyStorage from "client/classes/storage/company.storage";
import MasterPanel from "client/master";

import { createRoot } from "react-dom/client";

import { debugging, tracing, globals, date_formats } from "client/classes/types/constants";
import { isset, not_set, notify } from "client/classes/common";


// Guest Imports

import "resources/styles/forms.css";


// import ReportsModel from "./classes/models/reports";
// import TreeGrid from "client/controls/lists/tree.grid";
// import OptionStorage from "./classes/storage/options.storage";

//Special Guest Import
//import ProjectSelector from "client/controls/selectors/project.selector";


class Main extends BaseControl {

	state = { 
		signing_up: false,
		current_time: null,
	}/* state */;


	reference = React.createRef ();


	constructor (props) {
		super (props);
		globals.main = this;

		// window.onerror = this.error_handler;

		if ((debugging) || (tracing)) console.log ("creating main page");
	}// constructor;


	/********/


	error_handler (message, url, line) { notify (message, url, line) }


	/********/


    render () { return <MasterPanel id="master_panel" parent={this} /> }

}// Main;


/**** FOR DEBUGGING ONLY *****/


class QuickTest extends BaseControl {

	render () {
		return <div>Waiting for something to test</div>
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