import React from "react";
import BaseControl from "controls/abstract/base.control";

import LoggingModel from "client/classes/models/logging.model";

import { is_function } from "client/classes/common";


export const CheckboxCell = props => { 
	return <div className="fully-centered full-size">
		<input type="checkbox" style={{ 
			margin: 0,
			cursor: "pointer",
		}} onClick={props.onClick} />
	</div> 
}// CheckboxCell;


export const BillingCheckbox = props => { return <CheckboxCell onClick={event => {
	if (is_function (props.onClick) && (!props.onClick (event))) return false;
	LoggingModel.bill (props.id, event.target.checked);
}} />}


export default class InputControl extends BaseControl {

	input_field = React.createRef ();	

}// InputControl;

