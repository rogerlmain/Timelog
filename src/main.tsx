import * as React from "react";
import * as ReactDOM from "react-dom";

import { globals } from "types/globals";

import BaseControl, { DefaultProps, DefaultState } from "controls/base.control";

import MasterPanel from "master";

import SigninPage from "pages/sign.in";
import SignupPage from "pages/sign.up";

import ExplodingPanel from "controls/panels/exploding.panel";

import FadePanel from "controls/panels/fade.panel";

import { isset } from "classes/common";


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
		this.setState ({ contents: this.get_contents () });
	}// componentDidUpdate;


	public componentDidMount (): void {
		this.componentDidUpdate ();
	}// componentDidMount


    public render () {

		return (

			<div style={{ display: "flex" }}>

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

 				<FadePanel id="main_panel" static={true} visible={isset (this.state.contents)} 

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
//	ReactDOM.render (<Main id="main_page" />, document.getElementById ("main_page"));
	ReactDOM.render (<Main />, document.getElementById ("main_page"));
}// document.ready;