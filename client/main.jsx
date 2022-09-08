import "regenerator-runtime/runtime.js";
import "classes/types/prototypes";

import "resources/styles/main.css";

import React from "react";

import BaseControl from "client/controls/abstract/base.control";
import MasterPanel from "client/master";

import FadePanelTest from "client/tests/test.fade.panel";
import ResizePanelTest from "client/tests/test.resize.panel";
import ExplodingPanelTest from "client/tests/test.exploding.panel";
import EyecandyPanelTest from "client/tests/test.eyecandy.panel";

import { createRoot } from "react-dom/client";

import { tracing, globals, date_formats } from "client/classes/types/constants";


// Guest Imports

import ActivityLog from "./classes/activity.log";
import Container from "./controls/container";

import { debugging } from "./classes/common";

import "resources/styles/forms.css";


//Special Guest Import
//no guest imports


class Main extends BaseControl {

	state = { 
		current_time: null,
	}/* state */;


	reference = React.createRef ();


	constructor (props) {
		super (props);
		globals.main = this;

		// window.onerror = this.error_handler;

		if ((debugging ()) || (tracing)) console.log ("creating main page");
	}// constructor;


	/********/


	error_handler (message, url, line) { ActivityLog.log_error (`Unhandled error: ${message}`, `\nAt ${url}`, `\nOn line #${line}`) }


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

	if (debugging ()) console.log (`Debug test: ${new Date ().format (date_formats.full_datetime)}`);
	createRoot (document.getElementById ("main_page")).render (<Main id="timelog_main_page" />);

	// Special Guest Render	
	// createRoot (document.getElementById ("main_page")).render (<FadePanelTest />);
	// createRoot (document.getElementById ("main_page")).render (<ResizePanelTest />);
	// createRoot (document.getElementById ("main_page")).render (<ExplodingPanelTest />);
	// createRoot (document.getElementById ("main_page")).render (<EyecandyPanelTest />);
	
	// createRoot (document.getElementById ("main_page")).render (<div className="two-column-table">
	// 	<ExplodingPanelTest />
	// 	<EyecandyPanelTest />
	// </div>);

}// document.ready;