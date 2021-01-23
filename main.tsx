import * as React from "react";
import * as ReactDOM from "react-dom";

import "components/types/prototypes";

import { signing_state } from "components/types/constants";

import BaseControl from "components/controls/base.control";
import FadeControl from "components/controls/fade.control";

import HomePage from "components/home.page";

import SigninPanel from "components/panels/sign.in";
import SignupPanel from "components/panels/sign.up";

import PopupWindow from "components/panels/gadgets/popup.window";


var main_page = null;


export class MainPage extends BaseControl<any> {


	public panels = {
		signin_panel: "signin_panel",
		signup_panel: "signup_panel",
		home_panel: "home_panel"
	}// panels;


	public active_panel = null;


	public constructor (props) {
		super (props);
		this.state.signing_status = this.signed_in () ? signing_state.signed_in : signing_state.signed_out;
	}// constructor;


	public state = {

		panel_states: {
			signup_panel: false,
			signin_panel: this.signed_out (),
			home_panel: this.signed_in ()
		},

doit: false,

		popup: false,

		signing_status: signing_state.signed_out
	}// state;


	public load_panel (panel: string) {
		this.active_panel = panel;
		this.setState ({ panel_states: { ...this.state.panel_states, ...{
			signin_panel: false,
			signup_panel: false,
			home_panel: false
		}}});
	}// load_panel;


    public render () {

		return (
			<div id="main_panel" ref={this.create_reference} className="full-screen overlay-container">


				{/* DEBUG CODE */}

				<div className="outlined"
					style={{
						position: "absolute",
						left: "2em",
						top: "2em",
						zIndex: 10,
						display: "flex",
						flexDirection: "column",
						alignItems: "stretch"
					}}>

					<button onClick={() => { alert (this.show_states (true)); }}>show states</button>
					<button onClick={() => { this.setState ({ doit: !this.state.doit }) }}>fade test</button>
					<FadeControl id="test_panel" visible={this.state.doit} vanishing={true} style={{ border: "solid 1px blue" }}>
						<div style={{ whiteSpace: "nowrap" }}>
							this is the very very long fade bit
						</div>
					</FadeControl>
				</div>


				{/* LIVE CODE */}


				<PopupWindow open={this.state.popup} style={{ display: "none" }}>
					This is the popup
				</PopupWindow>

				<FadeControl id="signin_control" ref={this.create_reference} className="full-screen centering-container"
					visible={this.state.panel_states.signin_panel} afterHiding={() => {
						this.setState ({ panel_states: {...this.state.panel_states, [this.active_panel]: true } })
					}}>
					<SigninPanel id="signin_panel" ref={this.create_reference} parent={this} />
				</FadeControl>

				<FadeControl id="signup_control" ref={this.create_reference} className="full-screen centering-container"
					visible={this.state.panel_states.signup_panel} afterHiding={() => {
						this.setState ({ panel_states: {...this.state.panel_states, [this.active_panel]: true } })
					}}>
					<SignupPanel id="signup_panel" ref={this.create_reference} parent={this} />
				</FadeControl>

				<FadeControl id="home_control" ref={this.create_reference} className="full-screen centering-container"
					visible={this.state.panel_states.home_panel} afterHiding={() => {
						this.setState ({ panel_states: {...this.state.panel_states, [this.active_panel]: true } })
					}}>
					<HomePage id="home_page" ref={this.create_reference} parent={this} />
				</FadeControl>

			</div>
		);
	}// render;

}// MainPage;


document.onreadystatechange = () => {
	main_page = ReactDOM.render (<MainPage id="main_page" />, document.getElementById ("main_page"));
}// document.ready;