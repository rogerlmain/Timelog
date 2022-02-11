import * as React from "react";

import {signing_state} from "types/constants";

import SlideshowPanel from "controls/panels/slideshow.panel";

import BaseControl, { DefaultProps } from "controls/base.control";
import ExplodingPanel from "controls/panels/exploding.panel";
import EyecandyPanel from "controls/panels/eyecandy.panel";


interface SigninPageState {
	password_visible: boolean;
	eyecandy_visible: boolean;
	report_error: boolean;
	button_visible: boolean;

slideshow_index: number;

}// SigninPageState;


export default class SigninPage extends BaseControl<DefaultProps> {


	private signin_page: React.RefObject<EyecandyPanel> = React.createRef ();
	private exploding_panel: React.RefObject<ExplodingPanel> = React.createRef ();


	public state: SigninPageState = { 
		report_error: false,
		password_visible: false,
		eyecandy_visible: false,
		button_visible: true
	
,slideshow_index: 1

	}// state;


	public render () {

		var parent = this.props.parent;

		return (

			<div style={{ alignSelf: "center", border: "solid 2px green" }}>

				<ExplodingPanel id="login_error" ref={this.exploding_panel}>
					<div className="login-error">
						That doesn't sound right. Check your username<br />
						(email) and password and try again.
					</div>
				</ExplodingPanel>

				<div style={{marginBottom: '1em'}}>

					<form id="signin_form" encType="multipart/form-data">

						<div className="one-piece-form form-table">
							<label htmlFor="username">Username or email</label>
							<input name="username" type="text" defaultValue="rex@rogerlmain.com" />
							<label htmlFor="password">Password</label>
							<div style={{display: 'flex', flexDirection: 'row'}}>
								<input name="password" type={this.state.password_visible ? "text" : "password"} defaultValue="stranger" style={{ width: "100%" }} />
								<img className="link-control" src={"resources/images/eyeball." + (this.state.password_visible ? "off" : "on") + ".svg"}
									onClick={() => { this.setState ({ password_visible: !this.state.password_visible }); }}>
								</img>
							</div>
						</div>

					</form>

				</div>

				<div className="tagline">
					<div>
						<label style={{ marginRight: "0.5em" }}>New to RMPC Timelog?</label>
						<a onClick={() => parent.setState ({ signing_up: true })}>Sign up</a>
					</div>

					<div className="overlay-container middle-right-container" style={{ paddingLeft: "1em" }}>

						<EyecandyPanel id="signin_eyecandy" ref={this.signin_page} eyecandyText="Signing you in."
						
							afterEyecandy={() => fetch ("/signin", {
								method: "post",
								body: new FormData (document.getElementById ("signin_form") as HTMLFormElement),
								credentials: "same-origin"
							}).then (() => {
								if (this.signed_in ()) return parent.forceUpdate ();
								this.setState ({ 
									eyecandy_visible: false,
									report_error: true 
								});
							})}>

							<div className="middle-right-container">
								<button onClick={() => this.setState ({ eyecandy_visible: true })}>Sign in</button>
							</div>
						</EyecandyPanel>


					</div>

				</div>

			</div>

		);
	}// render;

}// SigninPage;

