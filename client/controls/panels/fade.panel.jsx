import BaseControl from "client/controls/abstract/base.control";
import React from "react";

import SettingsStorage from "client/classes/storage/settings.storage";

import { is_null, not_set } from "classes/common";
import { default_settings } from "client/classes/types/constants";


export default class FadePanel extends BaseControl {


	fade_panel = React.createRef ();


	static defaultProps = {
		id: null,
		animate: true,
		visible: false,
		speed: null,
	}// defaultProps;


	constructor (props) {
		super (props);
		if (is_null (this.props.id)) throw "FadePanel requires an ID";
	}// constructor;


	transition_start = (event) => {
		if (event.propertyName != "opacity") return;
		if (event.currentTarget != event.srcElement) return;
		switch (this.props.visible) {
			case true: this.execute (this.props.beforeShowing, event); break;
			default: this.execute (this.props.beforeHiding, event); break;
		}// switch;
	}/* transition_start */;


	transition_end = (event) => {
		if (event.propertyName != "opacity") return;
		if (event.currentTarget != event.srcElement) return;
		switch (this.props.visible) {
			case true: this.execute (this.props.afterShowing, event); break;
			default: this.execute (this.props.afterHiding, event); break;
		}// switch;
		this.forceUpdate ();
	}/* transition_end */;


	/********/


	componentDidMount () {
		if (not_set (this.fade_panel.current)) return;
		this.fade_panel.current.addEventListener ("transitionstart", this.transition_start);
		this.fade_panel.current.addEventListener ("transitionend", this.transition_end);
	}// componentDidMount;


	componentWillUnmount () {
		if (not_set (this.fade_panel.current)) return;
		this.fade_panel.current.removeEventListener ("transitionstart", this.transition_start);
		this.fade_panel.current.removeEventListener ("transitionend", this.transition_end);
	}// componentWillUnmount;


	render () {
		let style = { ...this.props.style, opacity: (this.props.visible ? 1 : 0)};
		if (this.props.animate) style = { ...style, transition: `opacity ${this.animation_speed ()}ms ease-in-out` }
		return <div id={this.props.id} ref={this.fade_panel} style={style} className={this.props.className}>{this.props.children}</div>
	}// render;

}// FadePanel;