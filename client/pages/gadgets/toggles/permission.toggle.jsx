import React from "react";

import BaseControl from "client/controls/abstract/base.control";
import ToggleSwitch from "client/controls/toggle.switch";
import Container from "client/controls/container";

import PermissionObject from "client/classes/types/permission.object";

import PermissionsModel from "client/classes/models/permissions.model";


export const butterfly_alignment = {
	left	: "left",
	right	: "right"
}// butterfly_alignment;


export default class PermissionToggle extends BaseControl {


	static defaultProps = {

		id: null,

		type		: null,
		account		: null,
		permissions	: null,

		align: "left",

		onClick: null,

	}// defaultProps;


	render () {

		let permission_object = new PermissionObject (this.props.permissions);

		return <Container>
			{this.props.align.equals (butterfly_alignment.right) && <label htmlFor={this.props.id}>{this.props.label}</label>}
			<ToggleSwitch id={this.props.id} value={permission_object.get (this.props.type) ? 1 : 0} onClick={this.props.onClick} 

				onChange={value => {
					(value == 1) ? permission_object.set (this.props.type) : permission_object.clear (this.props.type);
					PermissionsModel.set_permissions (this.props.account, permission_object.permissions);
				}}>
				
				<option>Off</option>
				<option>On</option>

			</ToggleSwitch>
			{this.props.align.equals (butterfly_alignment.left) && <label htmlFor={this.props.id}>{this.props.label}</label>}
		</Container>

	}// render;


}// PermissionToggle;