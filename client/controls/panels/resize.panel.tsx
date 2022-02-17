import React from "react";
import BaseControl, { DefaultProps, DefaultState } from "controls/base.control";

import { globals } from "types/globals";

import * as common from "classes/common";


interface ResizePanelProps extends DefaultProps {

	id: string;
	parent: iResizable;

	resize?: resize_state;
	speed?: number;			// overrides globals.settings.animation_speed

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


	private get_size = (control) => {
		return common.isset (control.current) ? {
			width: control.current.scrollWidth,
			height: control.current.scrollHeight
		} : null;
	}/* inner_size */;

	
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

		this.props.parent.setState ({ resize: resize_state.false });

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
		speed: globals.settings.animation_speed
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

		if ((next_props.resize) && (!common.matching_objects (inner_size, outer_size))) {
			this.setState (inner_size);
			return false;
		}// if;

		if (common.not_set (next_state.width) || common.not_set (next_state.height)) {
			this.setState (this.get_size (this.outer_control));
			return false;
		}// if;

		return true;

	}// shouldComponentUpdate;


	public componentDidUpdate () {
		if (this.props.resize == resize_state.true) this.props.parent.setState ({ resize: resize_state.false });
	}// componentDidUpdate;


	public render () {

		let style: any = {
			margin: 0, padding: 0,
			overflow: "hidden"
		}// style;

		if (this.props.resize == resize_state.animate) {
			let speed = this.props.speed ?? globals.settings.animation_speed;
			style = { ...style, transition: `width ${speed}ms ease-in-out, height ${speed}ms ease-in-out` };
		}// if;

		if (common.isset (this.state.width)) style = { ...style, width: this.state.width  };
		if (common.isset (this.state.height)) style = { ...style, height: this.state.height };

		return (
			<div id={`${this.props.id}_outer_control`} ref={this.outer_control} style={style}>
				<div id={`${this.props.id}_inner_control`} ref={this.inner_control} style={{ 
					margin: "none",
					padding: "none",
					display: "inline-block"
				}}>{this.props.children}</div>
			</div>
		);

	}// render;


}// ResizePanel;