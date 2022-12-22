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


	/********/


	render = () => <FadePanel id={`${this.props.id}_fade_panel`} className="full-screen" visible={this.props.visible}

		beforeShowing={event => {
			event.target.style.zIndex = visible_zindex;
			this.execute (this.props.beforeOpening)
		}}

		afterHiding={event => {		
			this.execute (this.props.afterClosing);
			event.target.style.zIndex = hidden_zindex;
		}}

		afterShowing={() => this.execute (this.props.afterOpening)}
		beforeHiding={() => this.execute (this.props.beforeClosing)}>

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


}// PopupWindow;