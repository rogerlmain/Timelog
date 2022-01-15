import React from "react";
import BaseControl, { DefaultProps, DefaultState } from "controls/base.control";

import { globals } from "types/globals";
import { Dimensions } from "types/datatypes";

import * as common from "classes/common";


interface ResizePanelProps extends DefaultProps {

	id: string;

	resizing?: boolean;

	stretch?: boolean; 		// determines if the control naturally fills the parent (block vs inline-block)
	speed?: number;			// overrides globals.settings.animation_speed

	innerStyle?: any;
	outerStyle?: any;

	beforeResizing?: any;
	afterResizing?: any;

}// ResizePanelProps;


interface ResizePanelState extends DefaultState {
	width: number;
	height: number;
}// ResizePanelState;


export default class ResizePanel extends BaseControl<ResizePanelProps> {

	public static defaultProps: ResizePanelProps = {
		id: null,
		stretch: false,
		speed: globals.settings.animation_speed,
		innerStyle: {}
	}// defaultProps;

	private outer_control: React.RefObject<HTMLDivElement> = React.createRef ();
	private inner_control: React.RefObject<HTMLDivElement> = React.createRef ();

	private inner_size: Dimensions = null;
	private outer_size: Dimensions = null;

	private initializing: boolean;


	private load_sizes () {

		this.inner_size = common.isset (this.inner_control.current) ? {
			width: this.inner_control.current.offsetWidth,
			height: this.inner_control.current.offsetHeight
		} : null;
	
		this.outer_size = common.isset (this.outer_control.current) ? {
			width: this.outer_control.current.offsetWidth,
			height: this.outer_control.current.offsetHeight
		} : null;

	}// load_sizes;


	private transition_start (event: TransitionEvent) {
		if (!["width", "height"].includes (event.propertyName)) return;
		this.execute (this.props.beforeResizing ? this.props.beforeResizing.bind (this) : null);
	}//transition_start;


	private transition_end (event: TransitionEvent) {
		if (!["width", "height"].includes (event.propertyName)) return;
		this.execute (this.props.afterResizing ? this.props.afterResizing.bind (this) : null);
	}// transition_end;

	/********/


	public props: ResizePanelProps;
	public state: ResizePanelState;


	public componentDidMount () {

		if (this.props.beforeResizing) this.outer_control.current.addEventListener ("transitionstart", this.transition_start.bind (this));
		if (this.props.afterResizing) this.outer_control.current.addEventListener ("transitionend", this.transition_end.bind (this));

		this.initializing = true;

	}// componentDidMount;


	public componentDidUpdate () {

		this.load_sizes ();

		if (!(this.props.resizing || this.initializing)) return;
		if ((this.inner_size.width == this.outer_size.width) && (this.inner_size.height == this.outer_size.height)) return;

		this.initializing = false;
		this.setState ({ ...this.inner_size });

	}// componentDidUpdate;


	public render () {

		let speed = this.props.speed ?? globals.settings.animation_speed;

		if (common.is_null (this.props.id)) throw "Resize panel requires an ID";

		return (
			<div id={`${this.props.id}_outer_control`} ref={this.outer_control} 
				style={{
					margin: 0, padding: 0, border: "none",
					display: this.props.stretch ? "block" : "inline-block",
					transition: `width ${speed}ms ease-in-out, height ${speed}ms ease-in-out`,
					overflow: "hidden",
					width: this.state.width,
					height: this.state.height,
					...this.props.outerStyle
				}}>
					
				<div id={`${this.props.id}_inner_control`} ref={this.inner_control} style={{ 
					display: this.props.stretch ? "block" : "inline-block",
					border: "none",
					margin: "none",
					padding: "none",
					boxSizing: "content-box",
					...this.props.innerStyle
				}}>{this.props.children}</div>

			</div>
		);

	}// render;


}// ResizePanel;