import "regenerator-runtime/runtime.js";
import "classes/types/prototypes";

import "resources/styles/main.css";
import "resources/styles/forms.css";

import React from "react";

import BaseControl from "client/controls/abstract/base.control";
import MasterPanel from "client/master";

import { createRoot } from "react-dom/client";

import { tracing, globals, date_formats } from "client/classes/types/constants";
import { debugging } from "client/classes/common";


// Guest Imports

import FadePanelTest from "client/tests/controls/panels/fade.panel";
import ResizePanelTest from "client/tests/controls/panels/resize.panel";
import ExplodingPanelTest from "client/tests/controls/panels/exploding.panel";
import EyecandyPanelTest from "client/tests/controls/panels/eyecandy.panel";

import LoadListTest from "client/tests/controls/lists/load.list";
import ClientSelectorTest from "client/tests/controls/selectors/client.selector";
import ProjectSelectorTest from "client/tests/controls/selectors/project.selector";
import DateInputTest from "client/tests/controls/inputs/date.input";

import ActivityLog from "client/classes/activity.log";
import ReportsPage from "client/pages/reports";
import DeluxeAccountForm from "./forms/deluxe.account.form";


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

	createRoot (document.getElementById ("main_page")).render (<div id="main_panel" className="horizontally-centered">
		
		<Main id="timelog_main_page" />


		{/* Tests */}

		{/* <FadePanelTest /> */}
		{/* <ResizePanelTest /> */}
		{/* <ExplodingPanelTest /> */}
		{/* <EyecandyPanelTest /> */}
		{/* <LoadListTest /> */}
		{/* <ClientSelectorTest /> */}
		{/* <DateInputTest /> */}

		{/* <ClientSelectorTest /> */}
		{/* <ProjectSelectorTest /> */}

		{/* <ReportsPage /> */}

		{/* <DeluxeAccountForm option={1} optionPrice={199} hasCredit={true} /> */}

	</div>);

}// document.ready;