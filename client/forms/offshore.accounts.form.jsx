import React from "react";

import BaseControl from "client/controls/abstract/base.control";
import Container from "client/controls/container";

import ExplodingPanel from "client/controls/panels/exploding.panel";
import SelectList from "client/controls/lists/select.list";
import EyecandyForm from "client/controls/forms/eyecandy.form";

import OffshoreModel from "client/classes/models/offshore.model";

import { blank } from "client/classes/types/constants";
import { debugging, isset, jsonify } from "client/classes/common";


const rmpc_github_token = "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";
const rmpc_username = "rexthestrange";


const repository_name = {
	git: "Application token",
	jira: "JIRA ID"
}/* repository_type */;


export const repository_type = {
	github	: 1,
	gitlab	: 2,
	jira	: 3,
}/* repository_type */;


export default class OffshoreAccountsForm extends BaseControl {


	state = { 

		connecting: false,
		repository_form_visible: false,

		repository: null,

	}/* state */;


	/********/


	repository_eyecandy_form = React.createRef ();
	repository_panel = React.createRef ();


	/********/


	get_token () {

		let parameters = new FormData (document.getElementById ("repository_form"));

		fetch ("/offshore", {
			method: "post",
			body: parameters,
			credentials: "same-origin"
		}).then (response => response.json ()).then (info => {

			alert (jsonify (info));

		});

	}/* get_token */;


	/********/


	repository_form = () => <Container>

		<div className="one-piece-form">

			<label htmlFor="offshore_username">Account ID</label>
			<input type="text" id="offshore_id" name="offshore_id" defaultValue={debugging () ? rmpc_username : blank} />

			<label htmlFor="offshore_token">{repository_name [this.state.repository]}</label>
			<input type="text" id="offshore_token" name="offshore_token" defaultValue={debugging () ? rmpc_github_token : blank} />

		</div>

		<div className="button-panel with-some-headspace">
			<button id="offshore_button" onClick={event => this.repository_eyecandy_form.current.submit (event)}>Connect</button>
		</div>

	</Container>


	render = () => <Container>

		<SelectList id="repository_type" name="repository_type" header="Select a repository" className="with-legroom"

			onChange={event => this.repository_panel?.current.animate (() => this.setState ({ repository: event.target.value }))}>

			<option value={repository_type.github}>GITHub</option>
			<option value={repository_type.gitlab}>GITLab</option>
			<option value={repository_type.jira}>JIRA</option>

		</SelectList>

		<ExplodingPanel id="repository_panel" ref={this.repository_panel}>
			{isset (this.state.repository) && <EyecandyForm id="repository_form" ref={this.repository_eyecandy_form} 

				onEyecandy={data => {
					data.append ("offshore_type", this.state.repository);
					return OffshoreModel.save_token (data);
				}}

				eyecandyText={() => `Connecting to ${repository_name [this.state.repository]}`}
				notificationText={() => `Connected.`}>

				{this.repository_form ()}

			</EyecandyForm>}
		</ExplodingPanel>

	</Container>


}/* OffshoreAccountsForm */;