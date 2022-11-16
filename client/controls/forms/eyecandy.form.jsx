import React from "react";
import BaseControl from "client/controls/abstract/base.control";

import EyecandyPanel from "client/controls/panels/eyecandy.panel";
import ContentsPanel from "client/controls/panels/contents.panel";

import { blank } from "client/classes/types/constants";
import { isset } from "client/classes/common";


const notification_delay = 2000;


export default class EyecandyForm extends BaseControl {


	form = React.createRef ();


	static defaultProps = {

		eyecandyText: blank,
		notificationText: blank,

		onEyecandy: null,

	}/* defaultProps */;


	state = { notification: null }


	/********/


	// Used by parent objects - search for current.submit to find users

	submit (event) {

		let form_data = new FormData (this.form.current);

		this.setState ({ data: form_data });
		event.preventDefault ();

		return form_data;

	}// submit;


	/********/


	render = () => <EyecandyPanel id={`${this.props.id}button_panel`} text={this.run (this.props.eyecandyText)} stretchOnly={true}
			
		onEyecandy={() => this.props.onEyecandy (this.state.data).then (response => this.setState ({ 
			notification: this.run (this.props.notificationText),
			data: null,
		}, () => setTimeout (() => this.setState ({ notification: null }), notification_delay)))}

		eyecandyVisible={isset (this.state.data)}>

		<ContentsPanel value={isset (this.state.notification) ? 1 : 2} stretchOnly={true}>
			<div>{this.state.notification}</div>
			<div><form id={`${this.props.id}_invite_form`} ref={this.form}>{this.props.children}</form></div>
		</ContentsPanel>

	</EyecandyPanel>


}// EyecandyForm;