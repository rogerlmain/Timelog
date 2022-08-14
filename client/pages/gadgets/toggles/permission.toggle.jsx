import React from "react";

import BaseControl from "client/controls/abstract/base.control";
import ToggleSwitch from "client/controls/toggle.switch";
import Container from "client/controls/container";

import PermissionsModel from "client/classes/models/permissions.model";


export default class PermissionToggle extends BaseControl {


	static defaultProps = {
		id		: null,
		type	: null,
		value	: null,
		account	: null,
	}// defaultProps;


	render () {
		return <Container>
			<label htmlFor={this.props.id}>{this.props.label}</label>
			<ToggleSwitch id={this.props.id} value={this.props.value} onChange={value => PermissionsModel.set_permissions (this.props.type, value)}>
				<option>Off</option>
				<option>On</option>
			</ToggleSwitch>
		</Container>
	}// render;


}// PermissionToggle;