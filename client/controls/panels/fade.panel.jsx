import BaseControl from "client/controls/abstract/base.control";
import React from "react";

import { is_null, not_set } from "classes/common";


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


	constructor (props) {
		super (props);
		if (is_null (this.props.id)) throw "FadePanel requires an ID";
	}// constructor;


	transition_start = event => {
		if (event.propertyName != "opacity") return;
		if (event.currentTarget != event.srcElement) return;
		this.execute (this.props.beforeTransition);
		switch (this.props.visible) {
			case true: this.execute (this.props.beforeShowing, event); break;
			default: this.execute (this.props.beforeHiding, event); break;
		}// switch;
	}/* transition_start */;


	transition_end = event => {

		if (event.propertyName != "opacity") return;
		if (event.currentTarget != event.srcElement) return;

		switch (this.props.visible) {
			case true: this.execute (this.props.afterShowing, event); break;
			default: this.execute (this.props.afterHiding, event); break;
		}// switch;
		this.execute (this.props.afterTransition);

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

		let style = { ...this.props.style, opacity: (this.props.visible ? 1 : 0) }

		if (!this.props.visible) style.visibility = "hidden";

		if (this.props.animate) style = { ...style, transition: `opacity ${this.animation_speed ()}ms ease-in-out` }
		return <div id={this.props.id} ref={this.fade_panel} className={this.props.className} style={style}>

			{this.props.children}
		
		</div>

	}// render;

}// FadePanel;