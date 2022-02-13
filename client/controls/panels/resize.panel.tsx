import React from "react";
import BaseControl, { DefaultProps, DefaultState } from "controls/base.control";

import { globals } from "types/globals";
import { Dimensions } from "types/datatypes";

import * as common from "classes/common";


interface ResizePanelProps extends DefaultProps {

	id: string;

	resize?: boolean;

	stretch?: boolean; 		// determines if the control naturally fills the parent (block vs inline-block)
	speed?: number;			// overrides globals.settings.animation_speed

	beforeResizing?: any;
	afterResizing?: any;

}// ResizePanelProps;


interface ResizePanelState extends DefaultState {
	width: number;
	height: number;
	resizing: boolean;
}// ResizePanelState;


export default class ResizePanel extends BaseControl<ResizePanelProps> {


	private outer_control: React.RefObject<HTMLDivElement> = React.createRef ();
	private inner_control: React.RefObject<HTMLDivElement> = React.createRef ();


	private inner_size = () => {
		return common.isset (this.inner_control.current) ? {
			width: this.inner_control.current.offsetWidth,
			height: this.inner_control.current.offsetHeight
		} : null;
	}/* inner_size */;

	
	private outer_size = () => {
		return common.isset (this.outer_control.current) ? {
			width: this.outer_control.current.offsetWidth,
			height: this.outer_control.current.offsetHeight
		} : null;
	}/* outer_size */;


	private sizes = () => {
		return {
			inner_size: this.inner_size (),
			outer_size: this.outer_size ()
		}
	}/* sizes */;


	private transition_start (event: TransitionEvent) {

		let size = this.inner_size ();

		if (!["width", "height"].includes (event.propertyName)) return;

		if ((size.width < size.height) && event.propertyName.matches ("width")) return;
		if ((size.width >= size.height) && event.propertyName.matches ("height")) return;

		this.execute (this.props.beforeResizing ? this.props.beforeResizing.bind (this) : null);
	}//transition_start;


	private transition_end (event: TransitionEvent) {

		let size = this.inner_size ();

		if (!["width", "height"].includes (event.propertyName)) return;

		if ((size.width < size.height) && event.propertyName.matches ("width")) return;
		if ((size.width >= size.height) && event.propertyName.matches ("height")) return;

		this.execute (this.props.afterResizing ? this.props.afterResizing.bind (this) : null);
		this.forceUpdate ();

	}// transition_end;

	
	/********/


	public props: ResizePanelProps;


	public state: ResizePanelState = {
		width: null,
		height: null,
		resizing: false
	}// state;

	
	public static defaultProps: ResizePanelProps = {
		id: null,
		stretch: false,
		speed: globals.settings.animation_speed
	}// defaultProps;


	public componentDidMount () {
		if (this.props.beforeResizing) this.outer_control.current.addEventListener ("transitionstart", this.transition_start.bind (this));
		if (this.props.afterResizing) this.outer_control.current.addEventListener ("transitionend", this.transition_end.bind (this));
	}// componentDidMount;


	public componentDidUpdate () {

		let sizes = this.sizes ();

		const handle_resizing = () => {
			if ((sizes.inner_size.width == sizes.outer_size.width) && (sizes.inner_size.height == sizes.outer_size.height)) {
				if (this.state.resizing) this.setState ({ resizing: false });
				return;
			}// if;
			
			if ((this.props.resize) && (!this.state.resizing)) this.setState ({ resizing: true, ...sizes.inner_size });
	
		}/* handle_resizing */;

		if (common.not_set (this.state.width) || common.not_set (this.state.height)) return this.setState (sizes.inner_size, handle_resizing);
		handle_resizing ();

	}// componentDidUpdate;


	public render () {

		let speed = globals.settings.animation_speed; //this.props.speed ?? globals.settings.animation_speed;

		if (common.is_null (this.props.id)) throw "Resize panel requires an ID";

		return (
			<div id={`${this.props.id}_outer_control`} ref={this.outer_control} 
				style={{
					margin: 0, padding: 0, border: "none",
					display: this.props.stretch ? "block" : "inline-block",
					transition: `width ${speed}ms ease-in-out, height ${speed}ms ease-in-out`,
					overflow: "hidden",
					width: this.state.width,
					height: this.state.height
				}}>
					
				<div id={`${this.props.id}_inner_control`} ref={this.inner_control} style={{ 
					display: this.props.stretch ? "block" : "inline-block",
					border: "none",
					margin: "none",
					padding: "none",
					boxSizing: "content-box"
				}}>{this.props.children}</div>

			</div>
		);

	}// render;


}// ResizePanel;