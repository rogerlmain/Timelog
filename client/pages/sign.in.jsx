import * as common from "classes/common";

import React from "react";

import CurrentAccount from "classes/storage/account";
import Companies from "classes/storage/companies";

import BaseControl from "controls/abstract/base.control";
import ExplodingPanel from "controls/panels/exploding.panel";
import EyecandyPanel from "controls/panels/eyecandy.panel";

import { globals } from "client/classes/types/constants";
import { MainContext } from "classes/types/contexts";


const bad_credentials = <div id="bad_credentials" className="login-error">
	That doesn't sound right. Check your username<br />
	(email) and password and try again.
</div>


export default class SigninPage extends BaseControl {


	state = { 

		error_message: null,

		password_visible: false,
		eyecandy_visible: false,
		button_visible: true
	
	}// state;


	static contextType= MainContext;
	static defaultProps = { id: "signin_page" }


	sign_in () {
		fetch ("/signin", {
			method: "post",
			body: new FormData (document.getElementById ("signin_form")),
			credentials: "same-origin"
		}).then (response => response.json ()).then (info => {

			if (common.isset (info.logging)) info.logging.start_time = Date.fromGMT (info.logging.start_time);

			for (let key of Object.keys (info)) {
				localStorage.setItem (key, JSON.stringify (info [key]));
			}// for;

			if (this.signed_in ()) {

				if (CurrentAccount.paid_account () && (Companies.list ().length == 1)) Companies.set_active_company (Companies.list () [0].company_id);
				this.context.main_page.setState ({ company_id: Companies.active_company_id () });
				return globals.main.forceUpdate ();

			}// if;

			this.setState ({ 
				eyecandy_visible: false,
				error_message: bad_credentials
			});

		});
	}// sign_in;


	render () {

		var parent = this.props.parent;

		return (

			<div id={this.props.id} className="shadow-box" style={{ alignSelf: "center" }}>

				<ExplodingPanel id="signin_error">
					<div id="signin_error_message">{this.state.error_message}</div>
				</ExplodingPanel>

				<form id="signin_form" encType="multipart/form-data">
					<div className="one-piece-form form-table">

						<label htmlFor="username">Username or email</label>
						<input name="username" type="text"

//defaultValue="rex@rogerlmain.com"
//defaultValue="joe@bloggs.com"
defaultValue="dmitry@kgb.gov.ru"
//defaultValue="rex@rexthestrange.com"

						/>


						<label htmlFor="password">Password</label>
						<div style={{display: 'flex', flexDirection: 'row'}}>
							<input name="password" type={this.state.password_visible ? "text" : "password"} defaultValue="stranger" style={{ width: "100%" }} />
							<img className="link-control" src={"client/resources/images/eyeball." + (this.state.password_visible ? "off" : "on") + ".svg"}
								onClick={() => { this.setState ({ password_visible: !this.state.password_visible }); }}>
							</img>
						</div>

					</div>
				</form>

				<div className="horizontally-spaced-out button-bar">

					<div className="aside">
						<label style={{ marginRight: "0.5em" }}>New to RMPC Timelog?</label>
						<a onClick={() => parent.setState ({ signing_up: true })}>Sign up</a>
					</div>

					<EyecandyPanel id="signin_eyecandy" text="Signing you in." eyecandyVisible={this.state.eyecandy_visible} onEyecandy={this.sign_in.bind (this)}>
						<button onClick={() => this.setState ({ 
							error_message: null,
							eyecandy_visible: true 
						})}>Sign in</button>
					</EyecandyPanel>

				</div>

			</div>
		);
	}// render;

}// SigninPage;

