import "regenerator-runtime/runtime.js";

import React from "react";
import ReactDOM from "react-dom";
import BaseControl from "controls/base.control";

import ExplodingPanel from "controls/panels/exploding.panel";

import MasterPanel from "client/master";

import SigninPage from "pages/sign.in";
import SignupPage from "pages/sign.up";

import { globals } from "types/globals";


export class Main extends BaseControl {


	constructor (props) {
		super (props);
		globals.main = this;
	}// constructor;


 	state = { signing_up: false }


    render () {

		return (

			<div style={{ display: "flex", flexDirection: "column" }}>

				<link rel="stylesheet" href="resources/styles/main.css" />

				<div className="page-header">
					<div className="title">RMPC Timelog</div>
					<div className="tagline">Make every second count</div>
				</div>
				
 				<ExplodingPanel id="main_panel">
					{this.signed_in () ? <MasterPanel parent={this} /> : (this.state.signing_up ? <SignupPage parent={this} /> : <SigninPage parent={this} />)}
 				</ExplodingPanel>

			</div>

 		);

 	}// render;

}// Main;


document.onreadystatechange = () => {
	ReactDOM.render (<Main id="timelog_main_page" />, document.getElementById ("main_page"));

// ReactDOM.render (<ResizePanelTest id="resize_panel_test" />, document.getElementById ("resize_panel_test"));
// ReactDOM.render (<FadePanelTest id="fade_panel_test" />, document.getElementById ("fade_panel_test"));
// ReactDOM.render (<ExplodingPanelTest id="exploding_panel_test" />, document.getElementById ("exploding_panel_test"));
// ReactDOM.render (<SlideshowPanelTest id="slideshow_panel_test" />,  document.getElementById ("slideshow_panel_test"));

}// document.ready;