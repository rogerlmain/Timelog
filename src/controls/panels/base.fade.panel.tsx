import React from "react";
import BaseControl, { DefaultProps, DefaultState } from "controls/base.control";

import { globals } from "types/globals";

import * as constants from "types/constants";


export interface BaseFadePanelProps extends DefaultProps {

	visible: boolean;	// Default = false
	static?: boolean;	// If false animates on initial display. Default = false;

	speed?: number;		// overrides globals.settings.animation_speed

	beforeShowing?: Function;
	afterShowing?: Function;

	beforeHiding?: Function;
	afterHiding?: Function;

}// BaseFadePanelProps;


export interface BaseFadePanelState extends DefaultState {}// BaseFadePanelState;


export default class BaseFadePanel<Props, State> extends BaseControl<BaseFadePanelProps, BaseFadePanelState> {


	public static defaultProps: BaseFadePanelProps = {
		visible: false,
		speed: globals.settings.animation_speed
	}// defaultProps;


	/********/


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


	// FOR DEBUGGING
	protected log () {
		if (constants.debugging) console.log (`
			Props Visible: ${this.props.visible}
		`);
	}// log;


	/********/


	public props: BaseFadePanelProps;
	public state: BaseFadePanelState;


	public componentDidMount () {
		this.dom_control.current.addEventListener ("transitionstart", this.transition_start.bind (this));
		this.dom_control.current.addEventListener ("transitionend", this.transition_end.bind (this));
	}// componentDidMount;


	public render () {
		return (
			<div id={this.props.id} ref={this.dom_control} style={{
				...this.props.style,
				opacity: (this.props.visible === true ? 1 : 0),
				transition: `opacity ${this.props.speed}ms ease-in-out`
			}} className={this.props.className}>
				{(() => {
					return this.children ()
				})()}
			</div>
		);
	}// render;

}// BaseFadePanel;
