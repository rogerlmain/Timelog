import React from "react";

import BaseControl from "client/controls/abstract/base.control";
import Container from "client/controls/container";

import ExplodingPanel from "client/controls/panels/exploding.panel";
import SelectList from "client/controls/lists/select.list";
import EyecandyForm from "client/controls/forms/eyecandy.form";

import OffshoreModel from "client/classes/models/offshore.model";

import { blank } from "client/classes/types/constants";
import { debugging, isset, jsonify } from "client/classes/common";


const rmpc_git_id = "f5de3479196ad4f9150c";
const rmpc_github_token = "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";


const repository_type = {
	git: "GIT",
	jira: "JIRA"
}/* repository_type */;


const repository_name = {
	git: "Application token",
	jira: "JIRA ID"
}/* repository_type */;


export default class RepositoryForm extends BaseControl {


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

			<option value={repository_type.git.toLowerCase ()}>{repository_type.git}</option>
			<option value={repository_type.jira.toLowerCase ()}>{repository_type.jira}</option>

		</SelectList>

		<ExplodingPanel id="repository_panel" ref={this.repository_panel}>
			{isset (this.state.repository) && <EyecandyForm id="repository_form" ref={this.repository_eyecandy_form} 

				onEyecandy={OffshoreModel.save_offshore_token}

				eyecandyText={() => `Connecting to ${repository_name [this.state.repository]}`}
				notificationText={() => `Connected.`}>

				{this.repository_form ()}

			</EyecandyForm>}
		</ExplodingPanel>

	</Container>


}/* RepositoryForm */;