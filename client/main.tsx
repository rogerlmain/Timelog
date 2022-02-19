import "regenerator-runtime/runtime.js";

import { isset } from "classes/common";
import { globals } from "types/globals";

import ReactDOM from "react-dom";

import BaseControl, { DefaultProps, DefaultState } from "controls/base.control";

import MasterPanel from "client/master";

import SigninPage from "pages/sign.in";
import SignupPage from "pages/sign.up";

import FadePanel from "controls/panels/fade.panel";

import React from "react";


import ResizePanelTest from "tests/resize.panel.test";
import FadePanelTest from "tests/fade.panel.test";
import ExplodingPanelTest from "tests/exploding.panel.test";
import SlideshowPanelTest from "tests/slideshow.panel.test";


interface MainProps extends DefaultProps {}


interface MainState extends DefaultState {

	popup: boolean;
	popup_visible: boolean;
	signing_up: boolean;

	popup_contents: any;
	contents: any;

}// mainState;


export class Main extends BaseControl<MainProps, MainState> {

	private panels = {
		master_panel: <MasterPanel parent={this} />,
		signin_page: <SigninPage parent={this} />,
		signup_page: <SignupPage parent={this} />
	}// panels;


	private get_contents () {
		return this.signed_in () ? this.panels.master_panel : (this.state.signing_up ? this.panels.signup_page : this.panels.signin_page);	
	}// get_contents;


 	/********/


 	public state: MainState = {
		popup: false,
		popup_visible: false,
		signing_up: false,

		popup_contents: null,
		contents: null
	 }// state;


	public pages = {
		signin_panel: "signin_panel",
		signup_panel: "signup_panel",
		home_panel: "home_panel"
	}// pages;


	public constructor (props: MainProps) {
		super (props);
		globals.main = this;
	}// constructor;


	public componentDidUpdate (): void {
		let contents = this.get_contents ();
		this.setState ({ contents: contents });
	}// componentDidUpdate;


	public componentDidMount (): void {
		this.componentDidUpdate ();
	}// componentDidMount


    public render () {

		return (

			<div style={{ display: "flex", flexDirection: "column" }}>

				<link rel="stylesheet" href="resources/styles/main.css" />


 				{/* DEBUG CODE */}

 				<div className="gray-outlined"
					style={{
						position: "absolute",
						left: "2em",
						top: "2em",
						zIndex: 25,
						display: "flex",
						flexDirection: "column",
						alignItems: "stretch"
					}}>

 					<button onClick={() => { alert (this.show_states (true)); }}>show states</button>
 					<button onClick={() => { alert (document.getElementById ("available_members_list").clientWidth) }}>Show width</button>
 				</div>


 				{/* LIVE CODE */}

				<div className="page-header">
					<div className="title">RMPC Timelog</div>
					<div className="tagline">Make every second count</div>
				</div>

 				<FadePanel id="main_panel" visible={isset (this.state.contents)} 

 					style={{ 
 						display: "flex", 
 						flexDirection: "row",
 					}}>

 					{this.state.contents}
						
 				</FadePanel>

			</div>

 		);

 	}// render;

}// Main;


document.onreadystatechange = () => {
ReactDOM.render (<Main id="main_page" />, document.getElementById ("main_page"));

ReactDOM.render (<ResizePanelTest id="resize_panel_test" />, document.getElementById ("resize_panel_test"));
ReactDOM.render (<FadePanelTest id="fade_panel_test" />, document.getElementById ("fade_panel_test"));
ReactDOM.render (<ExplodingPanelTest id="exploding_panel_test" />, document.getElementById ("exploding_panel_test"));
ReactDOM.render (<SlideshowPanelTest id="slideshow_panel_test" />,  document.getElementById ("slideshow_panel_test"));

}// document.ready;