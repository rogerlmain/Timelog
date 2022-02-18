import * as React from "react";


import BaseControl, { DefaultProps } from "controls/base.control";
import ExplodingPanel from "controls/panels/exploding.panel";
import EyecandyPanel from "controls/panels/eyecandy.panel";


interface SigninPageState {

	error_message: string;

	password_visible: boolean;
	eyecandy_visible: boolean;
	button_visible: boolean;

}// SigninPageState;


const bad_credentials = <div className="login-error">
	That doesn't sound right. Check your username<br />
	(email) and password and try again.
</div>



export default class SigninPage extends BaseControl<DefaultProps> {



	public state: SigninPageState = { 

		error_message: null,

		password_visible: false,
		eyecandy_visible: false,
		button_visible: true
	
	}// state;


	public render () {

		var parent = this.props.parent;

		return (

			<div style={{ alignSelf: "center", border: "solid 2px green" }}>

				<ExplodingPanel id="login_error">{this.state.error_message}</ExplodingPanel>

				<div style={{marginBottom: '1em'}}>

					<form id="signin_form" encType="multipart/form-data">

						<div className="one-piece-form form-table">
							<label htmlFor="username">Username or email</label>
							<input name="username" type="text" defaultValue="rex@rogerlmain.comm" />
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

						<EyecandyPanel id="signin_eyecandy" eyecandyText="Signing you in." eyecandyVisible={this.state.eyecandy_visible}
						
							afterEyecandy={() => fetch ("/signin", {
								method: "post",
								body: new FormData (document.getElementById ("signin_form") as HTMLFormElement),
								credentials: "same-origin"
							}).then (() => {
								if (this.signed_in ()) return parent.forceUpdate ();
								this.setState ({ 
									eyecandy_visible: false,
									error_message: bad_credentials
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

