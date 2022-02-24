import "regenerator-runtime/runtime.js";

import React from "react";
import ReactDOM from "react-dom";
import BaseControl from "controls/base.control";

import ExplodingPanel from "controls/panels/exploding.panel";

import MasterPanel from "client/master";

import SigninPage from "pages/sign.in";
import SignupPage from "pages/sign.up";


export class Main extends BaseControl {

 	state = {
		popup: false,
		popup_visible: false,
		signing_up: false,

		popup_contents: null
	 }// state;


    render () {

		return (

			<div style={{ display: "flex", flexDirection: "column" }}>

				<link rel="stylesheet" href="resources/styles/main.css" />

{/*
 			// 	{/* DEBUG CODE * /}

 			// 	<div className="gray-outlined"
			// 		style={{
			// 			position: "absolute",
			// 			left: "2em",
			// 			top: "2em",
			// 			zIndex: 25,
			// 			display: "flex",
			// 			flexDirection: "column",
			// 			alignItems: "stretch"
			// 		}}>

 			// 		<button onClick={() => { alert (this.show_states (true)); }}>show states</button>
 			// 		<button onClick={() => { alert (document.getElementById ("available_members_list").clientWidth) }}>Show width</button>
 			// 	</div>


 				{/* LIVE CODE */}

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