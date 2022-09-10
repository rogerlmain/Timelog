import BaseControl from "client/controls/abstract/base.control";
import React from "react";

import { is_null, not_set } from "client/classes/common";


export default class FadePanel extends BaseControl {


	fade_panel = React.createRef ();

	
	static defaultProps = {

		id: null,

		animate: true,
		visible: false,

		style: null,
		className: null,

		beforeTransition: null,
		afterTransition: null,

		beforeShowing: null,
		beforeHiding: null,

		afterShowing: null,
		afterHiding: null,

	}// defaultProps;


	transition_start = event => {

		if (event.propertyName != "opacity") return;
		if (event.target !== this.fade_panel) return;

		this.execute (this.props.beforeTransition);

		switch (this.props.visible) {
			case true: this.execute (this.props.beforeShowing, event); break;
			default: this.execute (this.props.beforeHiding, event); break;
		}// switch;

	}/* transition_start */;


	transition_end = event => {

		if (event.propertyName != "opacity") return;
		if (event.target !== this.fade_panel.current) return;

		switch (this.props.visible) {
			case true: this.execute (this.props.afterShowing, event); break;
			default: this.execute (this.props.afterHiding, event); break;
		}// switch;
		this.execute (this.props.afterTransition);

		this.forceUpdate ();

	}/* transition_end */;


	/********/


	componentDidMount () {
		this.fade_panel.current.addEventListener ("transitionstart", this.transition_start);
		this.fade_panel.current.addEventListener ("transitionend", this.transition_end);
	}// componentDidMount;


	componentWillUnmount () {
		this.fade_panel.current.removeEventListener ("transitionstart", this.transition_start);
		this.fade_panel.current.removeEventListener ("transitionend", this.transition_end);
	}// componentWillUnmount;


	render () {

		let style = { ...this.props.style, opacity: (this.props.visible ? 1 : 0) }
		let control_id = `${this.props.id ?? `fade_panel_${Date.now ()}`}_control`;

		if (this.props.animate) style = { ...style, transition: `opacity ${this.animation_speed ()}ms ease-in-out` }
		return <div id={control_id} key={control_id} ref={this.fade_panel} className={this.props.className} style={style}>{this.props.children}</div>

	}// render;

}// FadePanel;