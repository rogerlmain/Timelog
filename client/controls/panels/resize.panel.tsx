import React from "react";
import BaseControl, { DefaultProps, DefaultState } from "controls/base.control";

import { globals } from "types/globals";

import * as common from "classes/common";


interface ResizePanelProps extends DefaultProps {

	id: string;
	parent: iResizable;

	resize?: resize_state;
	speed?: number;			// overrides globals.settings.animation_speed

	stretchOnly?: boolean;	// prevents the control from shrinking

	beforeResizing?: any;
	afterResizing?: any;

}// ResizePanelProps;


interface ResizePanelState extends DefaultState {
	width: number;
	height: number;
}// ResizePanelState;


/**** Exported Items ****/


export enum resize_state { false, true, animate }

export interface iResizableState extends DefaultState { resize: resize_state }
export interface iResizable extends BaseControl { state: iResizableState }

export default class ResizePanel extends BaseControl<ResizePanelProps> {


	private outer_control: React.RefObject<HTMLDivElement> = React.createRef ();
	private inner_control: React.RefObject<HTMLDivElement> = React.createRef ();


	private get_size = (control: React.RefObject<HTMLDivElement>) => {
		return common.isset (control.current) ? {
			width: control.current.scrollWidth,
			height: control.current.scrollHeight
		} : null;
	}/* inner_size */;


	private end_resizing () {
		this.props.parent.setState ({ resize: resize_state.false });
		this.setState ({ width: null, height: null });
	}// end_resizing;

	
	private transition_start (event: TransitionEvent) {

		let size = this.get_size (this.inner_control);

		if (!["width", "height"].includes (event.propertyName)) return;

		if ((size.width < size.height) && event.propertyName.matches ("width")) return;
		if ((size.width >= size.height) && event.propertyName.matches ("height")) return;

		this.execute (this.props.beforeResizing ? this.props.beforeResizing.bind (this) : null);

	}//transition_start;


	private transition_end (event: TransitionEvent) {

		let size = this.get_size (this.inner_control);

		if (!["width", "height"].includes (event.propertyName)) return;

		if ((size.width < size.height) && event.propertyName.matches ("width")) return;
		if ((size.width >= size.height) && event.propertyName.matches ("height")) return;

		this.execute (this.props.afterResizing ? this.props.afterResizing.bind (this) : null);

		this.end_resizing ();

	}// transition_end;

	
	/********/


	public props: ResizePanelProps;


	public state: ResizePanelState = {
		width: null,
		height: null
	}// state;

	
	public static defaultProps: ResizePanelProps = {
		id: null,
		parent: null,
		resize: resize_state.false,
		speed: globals.settings.animation_speed,
		stretchOnly: false
	}// defaultProps;


	public constructor (props: ResizePanelProps) {
		super (props);
		if (common.is_null (this.props.id)) throw "ResizePanel requires an ID";
		if (common.is_null (props.parent)) throw "ResizePanel requires a parent of type iResizable";
	}// constructor;


	public componentDidMount () {
		if (this.props.beforeResizing) this.outer_control.current.addEventListener ("transitionstart", this.transition_start.bind (this));
		this.outer_control.current.addEventListener ("transitionend", this.transition_end.bind (this));
	}// componentDidMount;


	public shouldComponentUpdate (next_props: Readonly<ResizePanelProps>, next_state: Readonly<ResizePanelState>): boolean {

		let outer_size = this.state_size ();
		let inner_size = this.get_size (this.inner_control);

		let updated = !this.same_element (this.props.children, next_props.children);

		if (updated) {
			this.setState (this.get_size (this.outer_control));
			return false;
		}// if;
	
		if ((next_props.resize) && (!common.matching_objects (inner_size, outer_size))) {

			if (this.props.stretchOnly) {

				let new_size = {
					width: (inner_size.width > outer_size.width) ? inner_size.width : outer_size.width,
					height: (inner_size.height > outer_size.height) ? inner_size.height : outer_size.height
				}// new_size;

				if ((new_size.width == outer_size.width) && (new_size.height == outer_size.height)) {
					this.props.parent.setState ({ resize: resize_state.false }, () => this.execute (this.props.afterResizing));
					return false;
				}// if;

			}// if;

			this.setState (inner_size);
			return false;

		}// if;

		return true;

	}// shouldComponentUpdate;


	public componentDidUpdate () {
		if (this.props.resize == resize_state.true) this.end_resizing ();
	}// componentDidUpdate;


	public render () {

		let outer_style: Object = {
			margin: 0, padding: 0,
			overflow: "hidden"
		}// style;

		let inner_style: Object = {
			margin: "none",
			padding: "none",
			display: this.props.stretchOnly ? "block" : "inline-block"
		}// inner_style;

		if (this.props.resize == resize_state.animate) {
			let speed = this.props.speed ?? globals.settings.animation_speed;
			outer_style = { ...outer_style, transition: `width ${speed}ms ease-in-out, height ${speed}ms ease-in-out` };
		}// if;


		if (this.props.stretchOnly) {
			outer_style = { ...outer_style, display: "flex" },
			inner_style = { ...inner_style, flex: "1"}
		}


		if (common.isset (this.state.width)) outer_style = { ...outer_style, width: this.state.width  };
		if (common.isset (this.state.height)) outer_style = { ...outer_style, height: this.state.height };

		return (
			<div id={`${this.props.id}_outer_control`} ref={this.outer_control} style={outer_style}>
				<div id={`${this.props.id}_inner_control`} ref={this.inner_control} style={inner_style}>
					{this.props.children}
				</div>
			</div>
		);

	}// render;


}// ResizePanel;