import React from "react";

import BaseControl from "client/controls/abstract/base.control";
import ToggleSwitch from "client/controls/toggle.switch";
import Container from "client/controls/container";

import PermissionsStorage from "client/classes/storage/permissions.storage";


export default class PermissionToggle extends BaseControl {


	static defaultProps = {
		id	: null,
		type: null,
	}// defaultProps;


	render () {
		return <Container>
			<label htmlFor={this.props.id}>{this.props.label}</label>
			<ToggleSwitch id={this.props.id} value={this.state.value} onChange={value => PermissionsStorage.set_permission (this.props.type, value)}>
				<option>Off</option>
				<option>On</option>
			</ToggleSwitch>
		</Container>
	}// render;


}// PermissionToggle;