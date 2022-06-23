import React from "react";

import BaseControl from "controls/abstract/base.control";
import SelectButton from "controls/buttons/select.button";
import FadePanel from "controls/panels/fade.panel";

import { isset, notify, not_set, pause } from "classes/common";
import { hidden_zindex, visible_zindex } from "client/classes/types/constants";

import "client/resources/styles/pages/gadgets/popups.css";


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


	state = { zIndex: hidden_zindex }


	constructor (props) {
		super (props);
		if (not_set (this.props.id)) throw "PopupWindow requires an ID";
		if (not_set (this.props.parent) && isset (this.props.switch)) throw "PopupWindow requires a parent if the switch is set";
		if (not_set (this.props.switch) && isset (this.props.parent)) throw "PopupWindow requires a switch if the parent is set";
		this.state.zIndex = props.visible ? visible_zindex : hidden_zindex;
	}// constructor;


	render () {
		return (
			<FadePanel id={`${this.props.id}_fade_panel`} className="full-size" visible={this.props.visible} style={{ zIndex: this.state.zIndex }}

				beforeShowing={() => this.execute (this.props.beforeOpening)}
				afterShowing={() => this.execute (this.props.afterOpening)}

				beforeHiding={() => this.execute (this.props.beforeClosing)}
 				afterHiding={() => this.execute (this.props.afterClosing)}>

				<div className="full-size popup-panel">
					{this.props.modal ? <div className="full-size fully-centered popup-modal" /> : null}
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