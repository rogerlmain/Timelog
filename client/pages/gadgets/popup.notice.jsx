import React from "react";

import BaseControl from "client/controls/abstract/base.control";
import SelectButton from "client/controls/buttons/select.button";
import FadePanel from "client/controls/panels/fade.panel";

import { isset, not_set } from "client/classes/common";
import { hidden_zindex, visible_zindex } from "client/classes/types/constants";

import "resources/styles/pages/gadgets/popups.css";


export default class PopupNotice extends BaseControl {


	static defaultProps = { 

		id: null,

		visible: false,

		beforeOpening: null,
		afterOpening: null,
		beforeClosing: null,
		afterClosing: null,

		parent: null,
		style: null,
		switch: null	// parent state named used to open / close this control

	}// defaultProps;


	state = { zIndex: hidden_zindex }


	constructor (props) {
		super (props);
		if (not_set (this.props.id)) throw "PopupNotice requires an ID";
		if (not_set (this.props.parent) && isset (this.props.switch)) throw "PopupNotice requires a parent if the switch is set";
		if (not_set (this.props.switch) && isset (this.props.parent)) throw "PopupNotice requires a switch if the parent is set";
	}// constructor;


	render () {
		return (
			<FadePanel id={`${this.props.id}_fade_panel`} visible={this.props.visible} className="popup-notice" style={{ ...this.props.style, zIndex: 1 }}

				beforeShowing={() => {
					this.execute (this.props.beforeOpening);
					this.setState ({ zIndex: visible_zindex });
				}}

				afterHiding={() => {
					this.setState ({ zIndex: hidden_zindex });
					this.execute (this.props.afterClosing);
				}}

				afterShowing={() => this.execute (this.props.afterOpening)}

				beforeHiding={() => this.execute (this.props.beforeClosing)}>


					{this.props.children}

					{isset (this.props.parent) && isset (this.props.switch) && <SelectButton id="close_button" sticky={false} 
						onClick={() => this.props.parent.setState ({ [this.props.switch] : false })}>Close
					</SelectButton>}


			</FadePanel>
		);
	}// render;

}// PopupWindow;