import BaseControl, { DefaultProps, DefaultState } from "controls/base.control";
import React from "react";

import { globals } from "types/globals";

import * as common from "classes/common";


interface FadePanelProps extends DefaultProps {

	id: string;

	animate: boolean;
	visible: boolean;

	speed?: number;

	beforeShowing?: Function;
	afterShowing?: Function;

	beforeHiding?: Function;
	afterHiding?: Function;

}// FadePanelProps;


/**** Exported Items ****/


export default class FadePanel<Props, State> extends BaseControl<FadePanelProps, DefaultState> {


	protected dom_control: React.RefObject<HTMLDivElement> = React.createRef ();


	protected transition_start (event: TransitionEvent) {
		if (event.propertyName != "opacity") return;
		switch (this.props.visible) {
			case true: this.execute (this.props.beforeShowing, event); break;
			default: this.execute (this.props.beforeHiding, event); break;
		}// switch;
	}//transition_start;


	protected transition_end (event: TransitionEvent) {
		if (event.propertyName != "opacity") return;
		switch (this.props.visible) {
			case true: this.execute (this.props.afterShowing, event); break;
			default: this.execute (this.props.afterHiding, event); break;
		}// switch;
		this.forceUpdate ();
	}// transition_end;


	/********/


	public static defaultProps: FadePanelProps = {
		id: null,
		parent: null,
		animate: false,
		visible: false,
		speed: globals.settings.animation_speed
	}// defaultProps;


	public constructor (props: FadePanelProps) {
		super (props);
		if (common.is_null (this.props.id)) throw "FadePanel requires an ID";
	}// constructor;


	public componentDidMount () {
		this.dom_control.current.addEventListener ("transitionstart", this.transition_start.bind (this));
		this.dom_control.current.addEventListener ("transitionend", this.transition_end.bind (this));
	}// componentDidMount;


	public render () {

		let style = { ...this.props.style, opacity: (this.props.visible ? 1 : 0)};

		if (this.props.animate) style = { ...style, transition: `opacity ${this.props.speed}ms ease-in-out` }

		return (<div id={this.props.id} ref={this.dom_control} style={style} className={this.props.className}>{this.props.children}</div>);

	}// render;

}// FadePanel;