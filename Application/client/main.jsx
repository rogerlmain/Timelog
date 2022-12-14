import React from "react";

import BaseControl from "client/controls/abstract/base.control";
import MasterPanel from "client/master";

import ActivityLog from "client/classes/activity.log";

import PopupWindow from "client/gadgets/popup.window";

import { createRoot } from "react-dom/client";

import { tracing, globals, date_formats } from "client/classes/types/constants";
import { debugging, isset } from "client/classes/common";

import { MainContext } from "client/classes/types/contexts";

import "classes/types/prototypes";

import "resources/styles/main.css";
import "resources/styles/forms.css";


// Guest Imports

// import FadePanelTest from "client/tests/controls/panels/fade.panel";
// import ResizePanelTest from "client/tests/controls/panels/resize.panel";
// import ExplodingPanelTest from "client/tests/controls/panels/exploding.panel";
// import EyecandyPanelTest from "client/tests/controls/panels/eyecandy.panel";
// import ContentsPanelTest from "client/tests/controls/panels/contents.panel";

// import LoadListTest from "client/tests/controls/lists/load.list";
// import DropDownListTest from "client/tests/controls/lists/drop.down.list";

// import ClientSelectorTest from "client/tests/controls/selectors/client.selector";
// import ProjectSelectorTest from "client/tests/controls/selectors/project.selector";

// import DateInputTest from "client/tests/controls/inputs/date.input";
// import CurrencyInputTest from "client/tests/controls/inputs/currency.input";
// import ExpandingInputTest from "client/tests/controls/inputs/expanding.input";

// import RateSubformTest from "client/tests/rate.subform";

// import ToggleSwitchTest from "client/tests/controls/toggle.switch";
// import OptionToggleTest from "client/tests/gadgets/toggles/option.toggle";

// import ReportsPage from "client/pages/reports";
// import DeluxeAccountForm from "client/forms/deluxe.account.form";


/**** FOR DEBUGGING ONLY ****/


class QuickTest extends BaseControl {
	render () {
		return <div>Waiting for something to test</div>
	}// render;
}// QuickTest;


/********/


class Main extends BaseControl {

	state = { 

		current_time: null,

		popup_contents: null,
		popup_visible: false,

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


    render () { 

		let context_value = {
			load_popup: popup => new Promise (resolve => this.setState ({ popup_contents: popup }, resolve)),
			show_popup: () => this.setState ({ popup_visible: true }),
			hide_popup: callback => this.setState ({ popup_visible: false }, callback),
		}// context_value;

		return <MainContext.Provider value={context_value}>
			<div className="page-centered">

				{isset (this.state.popup_contents) && <PopupWindow id="popup_panel" visible={this.state.popup_visible}>{this.state.popup_contents}</PopupWindow>}

				<MasterPanel id="master_panel" parent={this} />

				{/* Tests */}

				{/* <ContentsPanelTest /> */}
				{/* <FadePanelTest /> */}
				{/* <ResizePanelTest /> */}
				{/* <ExplodingPanelTest /> */}
				{/* <EyecandyPanelTest /> */}

				{/* <OptionToggleTest /> */}

				{/* <LoadListTest /> */}
				{/* <DropDownListTest /> */}
				
				{/* <ExpandingInputTest /> */}
				{/* <CurrencyInputTest /> */}
				{/* <DateInputTest /> */}
				{/* <ToggleSwitchTest /> */}

				{/* <ClientSelectorTest /> */}
				{/* <ProjectSelectorTest /> */}

				{/* <RateSubformTest /> */}
				{/* <ReportsPageTest /> */}

				{/* <DeluxeAccountForm option={1} optionPrice={199} hasCredit={true} /> */}

				{/* <QuickTest /> */}

			</div>
		</MainContext.Provider>

	}// render;

}// Main;


/*********/


document.onreadystatechange = () => {

	let main_panel = <div id="main_panel" className="horizontally-centered"><Main id="timelog_main_page" /></div>

	if (debugging ()) console.log (`Debug test: ${new Date ().format (date_formats.full_datetime)}`);
	createRoot (document.getElementById ("main_page")).render (main_panel);
	
}// document.ready;