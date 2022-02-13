import BaseControl, { DefaultProps, DefaultState } from "controls/base.control";
import React from "react";

import { globals } from "types/globals";

import * as common from "classes/common";


export interface FadePanelProps extends DefaultProps {

	id: string;

	visible: boolean;	// Default = false
	static?: boolean;	// If false animates on initial display. Default = false;

	speed?: number;		// overrides globals.settings.animation_speed

	beforeShowing?: Function;
	afterShowing?: Function;

	beforeHiding?: Function;
	afterHiding?: Function;

}// FadePanelProps;


export interface FadePanelState extends DefaultState {}// FadePanelState;


export default class FadePanel<Props, State> extends BaseControl<FadePanelProps, FadePanelState> {


	public static defaultProps: FadePanelProps = {
		id: null,
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


	/********/


	public props: FadePanelProps;
	public state: FadePanelState;


	public componentDidMount () {
		this.dom_control.current.addEventListener ("transitionstart", this.transition_start.bind (this));
		this.dom_control.current.addEventListener ("transitionend", this.transition_end.bind (this));
	}// componentDidMount;


	public render () {

		if (common.is_null (this.props.id)) throw "FadePanel requires an ID";

		return (
			<div id={this.props.id} ref={this.dom_control} style={{
				...this.props.style,
				opacity: (this.props.visible === true ? 1 : 0),
				transition: `opacity ${this.props.speed}ms ease-in-out`
			}} className={this.props.className}>
				{(() => {
					return this.props.children
				})()}
			</div>
		);
	}// render;

}// FadePanel;
