import BaseControl from "client/controls/abstract/base.control";
import React from "react";

import Settings from "classes/storage/settings";

import * as common from "classes/common";


export default class FadePanel extends BaseControl {


	dom_control = React.createRef ();


	static defaultProps = {
		id: null,
		animate: true,
		visible: false,
		speed: Settings.animation_speed ()
	}// defaultProps;


	constructor (props) {
		super (props);
		if (common.is_null (this.props.id)) throw "FadePanel requires an ID";
	}// constructor;


	transition_start (event) {
		if (event.propertyName != "opacity") return;
		switch (this.props.visible) {
			case true: this.execute (this.props.beforeShowing, event); break;
			default: this.execute (this.props.beforeHiding, event); break;
		}// switch;
	}//transition_start;


	transition_end (event) {
		if (event.propertyName != "opacity") return;
		switch (this.props.visible) {
			case true: this.execute (this.props.afterShowing, event); break;
			default: this.execute (this.props.afterHiding, event); break;
		}// switch;
		this.forceUpdate ();
	}// transition_end;


	componentDidMount () {
		this.dom_control.current.addEventListener ("transitionstart", this.transition_start.bind (this));
		this.dom_control.current.addEventListener ("transitionend", this.transition_end.bind (this));
	}// componentDidMount;


	render () {
		let style = { ...this.props.style, opacity: (this.props.visible ? 1 : 0)};
		if (this.props.animate) style = { ...style, transition: `opacity ${this.props.speed}ms ease-in-out` }
		return (<div id={this.props.id} ref={this.dom_control} style={style} className={this.props.className}>{this.props.children}</div>);
	}// render;

}// FadePanel;