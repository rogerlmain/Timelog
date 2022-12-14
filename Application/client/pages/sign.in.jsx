import React from "react";

import CompanyStorage from "client/classes/storage/company.storage";
import LoggingStorage from "client/classes/storage/logging.storage";

import BaseControl from "client/controls/abstract/base.control";
import ExplodingPanel from "client/controls/panels/exploding.panel";
import EyecandyPanel from "client/controls/panels/eyecandy.panel";

import { debugging, isset, jsonify } from "client/classes/common";

import { MasterContext } from "client/classes/types/contexts";
import { horizontal_alignment, ranges, support_address } from "client/classes/types/constants";


const bad_credentials = <div id="bad_credentials" className="form-error">
	That doesn't sound right.<br />
	Check your email and password and try again.
</div>


const server_error = <div id="server_error" className="form-error">
	There is an error on the server<br />
	Please wait a few minutes and try again.<br />
	<br />
	If the problem persists, please contact {support_address}
</div>


export default class SigninPage extends BaseControl {


	eyecandy_panel = React.createRef ();
	error_panel = React.createRef ();

	
	state = {

		password_visible: false,
		eyecandy_visible: false,

		button_visible: true,

		error_message: null,

	}// state;


	/********/


	static contextType= MasterContext;


	static defaultProps = { 
		id		: "signin_page",
		parent	: null,
	}// defaultProps;


	/********/


	error_message = error => <div id="signin_error_message">{error}</div>

	
	signin_button = () => <button onClick={() => this.error_panel.current.animate (() => this.setState ({ 
		eyecandy_visible: true,
		error_message: null,
	}))}>Sign in</button>;


	sign_in = async eyecandy_panel => {

		let parameters = new FormData (document.getElementById ("signin_form"));

		await new Promise ((resolve, reject) => {

			fetch ("/signin", {
				method: "post",
				body: parameters,
				credentials: "same-origin"
			}).then (response => response.json ()).then (info => {

				let is_login_error = isset (info?.error);
				let is_server_error = isset (info?.errno);

				if (is_login_error || is_server_error) {

					let error = is_server_error ? server_error : bad_credentials;

					this.setState ({ eyecandy_visible: false });
					this.error_panel.current.animate (() => this.setState ({ error_message: this.error_message (error) }));

					if (is_server_error && debugging) {
						console.log (info?.sql);
						console.log (info?.sqlMessage);
					}// if;

					return resolve ();

				}// if;

				LoggingStorage.set ({
					client_id: info?.logging?.client_id,
					project_id: info?.logging?.project_id,
					start: new Date (info?.logging?.start_time),
					end: isset (info?.logging?.end_time) ? new Date (info.logging.end_time) : null,
					notes: info?.logging?.notes,
				});

				if (isset (info.credentials)) localStorage.setItem ("credentials", jsonify (info.credentials));
				if (isset (info.settings)) localStorage.setItem ("settings", jsonify (info.settings));
				if (isset (info.options)) localStorage.setItem ("options", jsonify (info.options));
				
				if (this.signed_in ()) {
					CompanyStorage.add_companies (info.companies.list);
					if (isset (info.companies.active_company)) CompanyStorage.set_active_company (info.companies.active_company);
					this.context.master_page.sign_in ();
				}// if;

				resolve ();

			}).catch (reject);

		});

	}/* sign_in */;


	/********/


	render () {
		return <div id={this.props.id} className="shadow-box">

			<ExplodingPanel id="signin_error" ref={this.error_panel}>{this.state.error_message}</ExplodingPanel>

			<form id="signin_form" encType="multipart/form-data">
				<div className="one-piece-form form-table">

					<label htmlFor="email">Email</label>
					<input id="email" name="email" type="text"

						//defaultValue="betty@riverdale.edu"
						//defaultValue="rex@rogerlmain.com"
						//defaultValue="joe@bloggs.com"
						//defaultValue="dmitry@kgb.gov.ru"
						//defaultValue="rex@rexthestrange.com"
						//defaultValue="tastetestdude@gmail.com"

					/>

					<label htmlFor="password">Password</label>
					<div style={{display: 'flex', flexDirection: 'row'}}>
						<input name="password" type={this.state.password_visible ? "text" : "password"} defaultValue="stranger" style={{ width: "100%" }} />
						<img className="link-control" src={"resources/images/eyeball." + (this.state.password_visible ? "off" : "on") + ".svg"}
							onClick={() => { this.setState ({ password_visible: !this.state.password_visible })}}>
						</img>
					</div>

				</div>
			</form>

			<div className="horizontally-spaced-out with-headspace">

				<div className="aside">
					<label style={{ marginRight: "0.5em" }}>New to Bundion?</label>
					<a onClick={this.props.parent.sign_up}>Sign up</a>
				</div>

				<EyecandyPanel id="signin_eyecandy" text="Signing you in." ref={this.eyecandy_panel} 
				
					stretchOnly={true} hAlign={horizontal_alignment.right}
					eyecandyVisible={this.state.eyecandy_visible} onEyecandy={this.sign_in}>

					{this.signin_button ()}

				</EyecandyPanel>

			</div>

		</div>
	}// render;

}// SigninPage;

