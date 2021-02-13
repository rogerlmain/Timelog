import * as React from "react";
import * as ReactDOM from "react-dom";

import "components/types/prototypes";

import { fade_zindex, signing_state } from "components/types/constants";

import { globals } from "components/types/globals";

import BaseControl from "components/controls/base.control";
import FadeControl from "components/controls/fade.control";

import HomePage from "components/home.page";

import SigninPanel from "components/panels/sign.in";
import SignupPanel from "components/panels/sign.up";

import PopupWindow from "components/panels/gadgets/popup.window";


class MainPage extends BaseControl<any> {


	public panels = {
		signin_panel: "signin_panel",
		signup_panel: "signup_panel",
		home_panel: "home_panel"
	}// panels;


	public active_panel = null;


	public constructor (props) {
		super (props);
		this.state.signing_status = this.signed_in () ? signing_state.signed_in : signing_state.signed_out;
		this.load_logging_status ();
		globals.main_page = this;
	}// constructor;


	public state = {

		panel_states: {
			signup_panel: false,
			signin_panel: false,
			home_panel: false
		},

doit: false,

		popup: false,

		signing_status: signing_state.signed_out,

		popup_visible: false,
		popup_contents: null,

		content_loaded: false

	}// state;


	public load_panel (panel: string) {
		this.active_panel = panel;
		this.setState ({ panel_states: { ...this.state.panel_states, ...{
			signin_panel: false,
			signup_panel: false,
			home_panel: false
		}}});
	}// load_panel;


	public componentDidMount () {
		this.setState ({ panel_states: {
			...this.state.panel_states,
			signin_panel: this.signed_out (),
			home_panel: this.signed_in ()
		}});
		let active_control = this.reference (this.signed_in () ? "home_control" : "signin_control");
		active_control.dom_control.current.style.zIndex = fade_zindex;
		this.forceUpdate ();
	}// componentDidMount;


public debug (text: string)	{
	document.getElementById ("debug_output").innerHTML += text + "<br />";
}// debug;


    public render () {
		return (

			<FadeControl visible={this.state.content_loaded} className="full-screen overlay-container">

				<PopupWindow id="popup_window" ref={this.create_reference} open={this.state.popup_visible}>
					{this.state.popup_contents}
				</PopupWindow>

				<div id="main_panel" ref={this.create_reference} className="full-screen">


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

					<div className="full-screen outlined-panel overlay-container">

						<FadeControl id="signin_control" ref={this.create_reference} className="full-screen centering-container"
							visible={this.state.panel_states.signin_panel}
							afterShowing={() => { this.setState ({ content_loaded: true })}}
							afterHiding={() => { this.setState ({ panel_states: {...this.state.panel_states, [this.active_panel]: true } }) }}>
							<SigninPanel id="signin_panel" ref={this.create_reference} parent={this} />
						</FadeControl>

						<FadeControl id="signup_control" ref={this.create_reference} className="full-screen centering-container"
							visible={this.state.panel_states.signup_panel}
							afterShowing={() => { this.setState ({ content_loaded: true })}}
							afterHiding={() => { this.setState ({ panel_states: {...this.state.panel_states, [this.active_panel]: true } }) }}>
							<SignupPanel id="signup_panel" ref={this.create_reference} parent={this} />
						</FadeControl>

						<FadeControl id="home_control" ref={this.create_reference} className="full-screen centering-container"
							visible={this.state.panel_states.home_panel}
							afterHiding={() => { this.setState ({ panel_states: {...this.state.panel_states, [this.active_panel]: true } }) }}>
							<HomePage id="home_page" ref={this.create_reference} parent={this} />
						</FadeControl>

					</div>

				</div>

				<img id="data_indicator" src="resources/images/save.indicator.gif" />

			</FadeControl>

		);
	}// render;

}// MainPage;


document.onreadystatechange = () => {
	ReactDOM.render (<MainPage id="main_page" />, document.getElementById ("main_page"));
}// document.ready;