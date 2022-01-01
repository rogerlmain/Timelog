import React, { CSSProperties } from "react";
import BaseControl, { DefaultProps, DefaultState } from "controls/base.control";

import { globals } from "types/globals";
import { Dimensions } from "types/datatypes";

import * as common from "classes/common";


interface ResizePanelProps extends DefaultProps {

	visible: boolean;
	static?: boolean;		//  (only relevant if visible on mount) do not animate on startup.

	shrinking?: boolean;	// the control is allowed to shrink
	growing?: boolean;		// the control is allowed to grow

	fill?: boolean;			// grows to fill the parent rather than to accommodate the children
	size?: Dimensions;		// exact dimensions for growth - overrides intrinsic and fill options

	stretch?: boolean; 		// determines if the control naturally fills the parent (block vs inline-block)
	speed?: number;			// overrides globals.settings.animation_speed
	
	beforeOpening?: any;
	afterOpening?: any;

	beforeClosing?: any;
	afterClosing?: any;

}// ResizePanelProps;


interface ResizePanelState extends DefaultState {

	width: number;
	height: number;

	growing: boolean;
	shrinking: boolean;

	contents: any;

	transition: string;	

}// ResizePanelState;


export default class ResizePanel extends BaseControl<ResizePanelProps> {

	public static defaultProps: ResizePanelProps = {
		visible: false,
		speed: globals.settings.animation_speed
	}// defaultProps;


	private initialized: boolean = false;
	private updated: boolean = false;

	private visible: boolean = false;	// requested condition
	private open: boolean = false;		// actual condition

	private static: boolean = null;
	private fill: boolean = null;

	private stretch: boolean = false;


	private outer_control: React.RefObject<HTMLDivElement> = React.createRef ();
	private inner_control: React.RefObject<HTMLDivElement> = React.createRef ();

	private inner_size: Dimensions = null;
	private outer_size: Dimensions = null;


	private execute_open_handler () {
		if (this.updated) return this.updated = false;
		this.execute (this.props.afterOpening); 
	}// execute_open_handler;


	private initialize (control: HTMLElement) {
		control.style.width = (this.state.width = 0) + "px";
		control.style.height = (this.state.height = 0) + "px";
	}// initialize;


	private transition_start (event: TransitionEvent) {
		if (!["width", "height"].includes (event.propertyName)) return;
		switch (this.open) {
			case true: this.execute (this.props.beforeOpening); break;
			default: this.execute (this.props.beforeClosing); break;
		}// if;
	}//transition_start;


	private transition_end (event: TransitionEvent) {
		if (!["width", "height"].includes (event.propertyName)) return;
		let opened = (((event.currentTarget as HTMLDivElement).clientWidth > 0) || ((event.currentTarget as HTMLDivElement).clientHeight > 0)) && this.open;
		switch (opened) {
			case true: this.execute_open_handler (); break;
			default: this.execute (this.props.afterClosing); break;
		}// if;
		this.forceUpdate ();
	}// transition_end;


	private update_transition (callback: any = null) {
		if (common.isset (this.state.transition)) return this.execute (callback);
		this.forceUpdate (() => this.setState ({ transition: `width ${this.props.speed}ms ease-in-out, height ${this.props.speed}ms ease-in-out` }, callback));
	}// update_transition;


	private show () {

		let child_size = (dimension: string) => {

			let increased = this.outer_size [dimension] < this.inner_size [dimension];
			let decreased = this.outer_size [dimension] > this.inner_size [dimension];

			if ((increased && this.state.growing) || (decreased && this.state.shrinking)) return this.inner_size [dimension];
			return this.outer_size [dimension];

		}// child_size;


		let calculate_size = (dimension: string) => {
			if (this.props.size && this.props.size [dimension]) return this.props.size [dimension];
			if (this.fill) switch (dimension) {
				case "width": return this.outer_control.current.availableWidth ();
				default: return this.outer_control.current.availableHeight ();
			}// if;
			return child_size (dimension);
		}/* new_size */;


		let new_size: Dimensions = {
			width: calculate_size ("width"),
			height: calculate_size ("height")
		}// new_size;

		let resized = ((new_size.width != this.state.width) || (new_size.height != this.state.height));
				
		this.open = true;

		if (common.not_set (this.outer_size) || common.not_set (this.inner_size)) return;

		if (this.static) {
			this.static = false;
			this.setState (this.inner_size, this.update_transition);
			return;
		}// if;

		this.update_transition (() => { 
			switch (resized) {
				case true: return this.setState (new_size); 
				default:  this.execute_open_handler ();
			}// switch;
		});

	}// show;


	private hide () {
		this.open = false;
		this.setState ({ width: 0, height: 0 });
	}// hide;


	/********/


	public props: ResizePanelProps;
	public state: ResizePanelState;


	public constructor (props: ResizePanelProps) {
		super (props);
		this.state.growing = (props.growing !== false);		// default true
		this.state.shrinking = (props.shrinking !== false);	// default true
		this.fill = (props.fill === true);					// default false
		this.stretch = (props.stretch === true);			// default false
	}// constructor;


	public componentDidMount () {
		this.outer_control.current.addEventListener ("transitionstart", this.transition_start.bind (this));
		this.outer_control.current.addEventListener ("transitionend", this.transition_end.bind (this));

		this.setState ({
			growing: true,
			shrinking: true,

			width: null,
			height: null,
			contents: null, 
			transition: null		
		});
	}// componentDidMount;


	public getSnapshotBeforeUpdate (props: ResizePanelProps, state: ResizePanelState): any {

		this.visible = (this.props.visible !== false);
		this.static = ((this.static !== false) && (this.visible) && (this.props.static === true));

		this.initialized = common.isset (this.state.contents);
		this.updated = (this.initialized && common.isset (state.contents) && (this.state.contents != state.contents));

		return null;

	}// getSnapshotBeforeUpdate;


	public componentDidUpdate () {

		this.inner_size = common.isset (this.inner_control.current) ? {
			width: this.inner_control.current.scrollWidth,
			height: this.inner_control.current.scrollHeight
		} : null;
	
		this.outer_size = common.isset (this.outer_control.current) ? {
			width: this.outer_control.current.offsetWidth,
			height: this.outer_control.current.offsetHeight
		} : null;

		this.setState ({ contents: this.children () });
	
		if (this.visible) {
			if (this.initialized) {
				if (this.open) {
					if (this.updated) this.hide ();
				} else {
					this.show ();
				}// if;
			} else {
				if (!this.open) this.initialize (this.outer_control.current);
			}// if;
		} else {
			if ((this.initialized) && (!this.updated) && (this.open)) this.hide ();
		}// if;

	}// componentDidUpdate;


	public render () {

		return (
			<div id={this.props.id} ref={this.outer_control} 
				style={{
					...this.props.style,
					margin: 0, padding: 0, border: "none",
					display: this.stretch ? "block" : "inline-block",
					overflow: "hidden",
					transition: this.state.transition,					
					width: this.state.width ?? 0,
					height: this.state.height ?? 0
				}}>
					
				<div ref={this.inner_control} 
					style={{ 
						display: this.stretch ? "block" : "inline-block",
						border: "none",
						margin: "none",
						padding: "none"
					}}>
						
					{this.state.contents}

				</div>
			</div>
		);

	}// render;


}// ResizePanel;