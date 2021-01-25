import * as React from "react";
import * as common from "components/classes/common";

import { Transition } from "react-transition-group";
import { globals } from "components/types/globals";

import BaseControl, { defaultInterface } from "components/controls/base.control";
import { fade_zindex, hidden_zindex, popup_zindex } from "components/types/constants";


interface fadeControl extends defaultInterface {

	visible: boolean;

	// if true control doesn't occupy DOM space
	vanishing: boolean;

	beforeFadein?: any;
	afterFadein?: any;

	beforeFadeout?: any;
	afterFadeout?: any;

	beforeOpening?: any;
	afterOpening?: any;

	beforeClosing?: any;
	afterClosing?: any;

	beforeShowing?: any;
	afterShowing?: any;

	beforeHiding?: any;
	afterHiding?: any;

	ref?:any;
	style?: any;

	className?: string;

}// fadeControl;


export default class FadeControl extends BaseControl<fadeControl> {


	private id: string = null;

	private dom_control: any = null;
	private dom_resize: any = null;


	private fade_style = {
		transition: `opacity ${globals.settings.animation_speed}ms ease-in-out`,
		opacity: 0,
		zIndex: (this.props.visible ? fade_zindex : hidden_zindex)
	}// fade_style;


	private resize_style = {
		transition: `all ${globals.settings.animation_speed}ms ease-in-out`,
		transitionProperty: "width, height",
		overflow: "hidden"
	}// resize_style;


	private fade_transition_style = {
		entering: { opacity: 1 },
		entered:  { opacity: 1 },
		exiting:  { opacity: 0 },
		exited:  { opacity: 0 },
	}// fade_transition_style;


	private resize_transition_style = {}


	private growth_dimensions () {

		let computed_style = null;
		let result = null;

		try {

			let control = this.dom_resize.current.children [0];

			if (common.isset (control)) {
				let control_position = control.style.position;

				control.style.position = "absolute";
				computed_style = window.getComputedStyle (control);

				result = {
					display: computed_style.display,
					width: Math.round (parseFloat (computed_style.width)),
					height: Math.round (parseFloat (computed_style.height))
				};

				control.style.position = control_position;
			}// if;

		} catch (except) {}

		return result;

	}// growth_dimensions;


	private initialize_resize_panel () {
		this.resize_transition_style ["exiting"] = this.resize_transition_style ["exited"] = { width: 0, height: 0 };
		this.forceUpdate ();
	}// initialize_resize_panel;


	private resize_control () {

		if (this.props.visible) this.state.panel_states.resize_panel = true;

		return (
			<Transition in={this.state.panel_states.resize_panel} timeout={globals.settings.animation_delay}

				// Before Opening
				onEnter={() => {
					this.resize_transition_style ["entering"] = this.resize_transition_style ["entered"] = this.growth_dimensions ();
					this.execute_event (this.props.beforeShowing);
					this.execute_event (this.props.beforeOpening);
				}}

				// After Opening
				onEntered={() => {
					this.execute_event (this.props.afterOpening);
					this.setState ({ panel_states: {...this.state.panel_states, fade_panel: true } });
				}}

				// Before Closing
				onExit={() => {
					this.execute_event (this.props.beforeClosing);
				}}

				// After Closing
				onExited={() => {
					this.execute_event (this.props.afterClosing);
					this.execute_event (this.props.afterHiding);
				}}>

				{state => {
					return <div id={`${this.id_badge ()}_resize`} ref={this.dom_resize} style={{
						...this.props.style,
						...this.resize_style,
						...this.resize_transition_style [state]
					}} className={this.props.className}>{this.state.contents ?? this.props.children}</div>
				}}

			</Transition>
		);
	}// resize_control;


	/********/


	constructor (props: fadeControl) {
		super (props);
		this.dom_control = this.props.dom_control ?? React.createRef ();
		this.dom_resize = React.createRef ();
	}// constructor;


	public state = {
		contents: null,
		panel_states: {
			fade_panel: false,
			resize_panel: false
		}/* panel_states */
	}// state;


	public componentDidMount () {
		this.id = this.id_badge ();
		this.initialize_resize_panel ();
	}// componentDidMount;


	// fade_control
	public render () {

		this.state.panel_states.fade_panel = this.props.visible;
		if (this.props.vanishing) this.state.panel_states.fade_panel = (this.props.visible ? this.state.panel_states.resize_panel : false);

		return (

			<Transition in={this.state.panel_states.fade_panel} timeout={globals.settings.animation_delay}

				// Before Showing
				onEnter={() => {
					this.dom_control.current.style.zIndex = popup_zindex;
					if (!this.props.vanishing) this.execute_event (this.props.beforeShowing);
					this.execute_event (this.props.beforeFadein);
				}}

				// After Showing
				onEntered={() => {
					this.execute_event (this.props.afterFadein);
					this.execute_event (this.props.afterShowing);
				}}

				// Before Hiding
				onExiting={() => {
					this.execute_event (this.props.beforeHiding);
					this.execute_event (this.props.beforeFadeout);
				}}

				// After Hiding
				onExited={() => {
					this.execute_event (this.props.afterFadeout);
					if (!this.props.vanishing) this.execute_event (this.props.afterHiding);
					if (this.props.vanishing) this.setState ({ panel_states: {...this.state.panel_states, resize_panel: false } });
					this.dom_control.current.style.zIndex = hidden_zindex;
				}}>

				{state => {
					return <div id={this.id} ref={this.dom_control} style={{
						...this.props.style,
						...this.fade_style,
						...this.fade_transition_style [state]
					}} className={this.props.className}>{this.props.vanishing ? this.resize_control () : this.props.children}</div>
 				}}

 			</Transition>
		);
	}// fade_control.render;


}// FadeControl;