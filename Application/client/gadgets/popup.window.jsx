import React from "react";

import BaseControl from "client/controls/abstract/base.control";
import SelectButton from "client/controls/buttons/select.button";
import FadePanel from "client/controls/panels/fade.panel";

import { isset, not_set } from "client/classes/common";
import { hidden_zindex, visible_zindex } from "client/classes/types/constants";

import "resources/styles/gadgets/popups.css";


export default class PopupWindow extends BaseControl {


	static defaultProps = { 

		id: null,

		visible: false,
		modal: true,

		beforeOpening: null,
		afterOpening: null,
		beforeClosing: null,
		afterClosing: null,

		parent: null,
		switch: null	// parent state named used to open / close this control

	}// defaultProps;


	constructor (props) {
		super (props);
		if (not_set (this.props.id)) throw "PopupWindow requires an ID";
		if (not_set (this.props.parent) && isset (this.props.switch)) throw "PopupWindow requires a parent if the switch is set";
		if (not_set (this.props.switch) && isset (this.props.parent)) throw "PopupWindow requires a switch if the parent is set";
	}// constructor;


	render () {
		return (
			<FadePanel id={`${this.props.id}_fade_panel`} className="full-screen" visible={this.props.visible} 
			
				style={{ zIndex: this.props.visible ? visible_zindex : hidden_zindex }}

				beforeShowing={() => this.execute (this.props.beforeOpening)}
				beforeHiding={() => this.execute (this.props.beforeClosing)}

				afterShowing={() => this.execute (this.props.afterOpening)}
				afterHiding={() => this.execute (this.props.afterClosing)}>

				<div className="full-screen popup-panel">
					{this.props.modal ? <div className="full-screen fully-centered popup-modal" /> : null}
					<div className="popup-window">

						{this.props.children}

						{isset (this.props.parent) && isset (this.props.switch) && <SelectButton id="close_button" sticky={false} 
							onClick={() => this.props.parent.setState ({ [this.props.switch] : false })}>Close
						</SelectButton>}

					</div>
				</div>

			</FadePanel>
		);
	}// render;

}// PopupWindow;