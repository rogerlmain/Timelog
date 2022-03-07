import React from "react";

import BaseControl from "controls/base.control";
import SelectButton from "controls/buttons/select.button";
import FadePanel from "controls/panels/fade.panel";

import { isset, not_set } from "classes/common";
import { hidden_zindex, popup_zindex } from "types/constants";

import "resources/styles/pages/gadgets/popup.window.css";


export default class PopupWindow extends BaseControl {


	static defaultProps = { 

		id: null,

		showing: false,
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
	}// constructor;


	render () {
		return (
			<FadePanel id={`${this.props.id}_fade_panel`} className="full-size" visible={this.props.showing} style={{ zIndex: this.state.zIndex }}

				beforeShowing={() => {
					this.execute (this.props.beforeOpening);
					this.setState ({ zIndex: popup_zindex });
				}}

				afterHiding={() => {
					this.setState ({ zIndex: hidden_zindex });
					this.execute (this.props.afterClosing);
				}}

				afterShowing={() => this.execute (this.props.afterOpening)}

				beforeHiding={() => this.execute (this.props.beforeClosing)}>

				<div className="full-size popup-panel">
					{this.props.modal ? <div className="full-size centering-container popup-modal" /> : null}
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