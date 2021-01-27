import * as React from "react";

import {signing_state} from "components/types/constants";

import BaseControl, { defaultInterface } from "components/controls/base.control";
import FadeControl from "components/controls/fade.control";
import Eyecandy from "components/controls/eyecandy";


export default class SigninPanel extends BaseControl<defaultInterface> {


	private fetching = false;


	/********/


	public state = {
		password_visible: false,
		eyecandy_visible: false,
		report_error: false,
		button_visible: false
	}// state;


	public componentDidMount () {
		setTimeout (() => this.setState ({ button_visible: true }));
	}// componentDidMount;


	public render () {

		var parent = this.props.parent;

		return (
			<div id="signin_panel" ref={this.create_reference} style={{ transition: "opacity 0.5s", position: "relative" }}>
				<div id="error_panel" style={{position: "absolute"}}>
					<FadeControl visible={this.state.report_error} beforeShowing={() => {
							let error_panel = document.getElementById ("error_panel");
							error_panel.style.top = (0 - error_panel.clientHeight) + "px";
							error_panel.style.left = Math.round ((document.getElementById ("signin_panel").clientWidth - error_panel.clientWidth) / 2) + "px";
							this.setState ({ eyecandy_visible: false });
						}}>
						<div className="login-error">
							That's not right. Check your username (email)<br />
							and password and try again.
						</div>
					</FadeControl>
				</div>

				<div style={{marginBottom: '1em'}}>

					<form id="signin_form" encType="multipart/form-data">

						<div className="two-piece-form form-table">
							<label htmlFor="username">Username or email</label>
							<input name="username" type="text" defaultValue="rex@rogerlmain.com" />
							<label htmlFor="password">Password</label>
							<div style={{display: 'flex', flexDirection: 'row'}}>
								<input name="password" type={this.state.password_visible ? "text" : "password"} defaultValue="stranger" style={{ width: "100%" }} />
								<img src={"resources/images/eyeball." + (this.state.password_visible ? "off" : "on") + ".svg"}
									onClick={() => { this.setState ({ password_visible: !this.state.password_visible }); }}>
								</img>
							</div>
						</div>

					</form>

				</div>

				<div className="tagline">
					<div>
						<label style={{ marginRight: "0.5em" }}>New to RMPC Timelog?</label>
						<a onClick={() => { parent.load_panel (parent.panels.signup_panel) }}>Sign up</a>
					</div>

					<div className="overlay-container middle-right-container" style={{ paddingLeft: "1em" }}>

						<Eyecandy id="signin_eyecandy_panel" visible={this.state.eyecandy_visible} text="Signing you in" subtext="One moment, please"
							afterShowing={() => {
								if (this.fetching) return;
								this.fetching = true;
								fetch ("/signin", {
									method: "post",
									body: new FormData (document.getElementById ("signin_form") as HTMLFormElement),
									credentials: "same-origin"
								}).then (() => {
									this.setState ({ eyecandy_visible: false });
									if (this.signed_in ()) {
										parent.active_panel = parent.panels.home_panel;
										parent.setState ({ panel_states: {...parent.state.panel_states, signin_panel: false } });
										this.fetching = false;
										return;
									}// if;
									this.setState ({ report_error: true });
								});
							}}
							afterHiding={() => { this.setState ({ button_visible: true }) }}>
						</Eyecandy>

						<FadeControl id="signin_button_panel" visible={this.state.button_visible} className="middle-right-container"
							afterHiding={() => { this.setState ({ eyecandy_visible: true }) }}>
							<button onClick={() => {
								parent.setState ({ signing_status: signing_state.pending });
								this.setState ({ button_visible: false });
							}}>Sign in</button>
						</FadeControl>

					</div>

				</div>
			</div>
		);
	}// render;

}// SigninPanel;

