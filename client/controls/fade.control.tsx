import * as React from "react";
import * as common from "client/classes/common";

import { Transition } from "react-transition-group";
import { globals } from "client/types/globals";

import BaseControl, { DefaultProps, DefaultState } from "client/controls/base.control";
import { fade_zindex, hidden_zindex, popup_zindex } from "client/types/constants";


interface fadeControlProps extends DefaultProps {

	visible: boolean;


	vanishing: boolean;			// if true control doesn't occupy DOM space
	reset_on_close: boolean;	// Only valid if vanishing: if true (default) doesn't occupy DOM space after closing
								// Use for reset_on_close=false : resize immediately to fit new content (see eyecandy.panel.tsx)

	onComponentUpdate?: any;

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

	zIndex?: number;

}// fadeControl;


export default class FadeControl extends BaseControl<fadeControl> {


	private id: string = null;

	private dom_control: any = null;
	private dom_resizer: any = null;


	private fade_style = {
		transition: `opacity ${globals.settings.animation_speed}ms ease-in-out`,
		opacity: (this.props.visible ? 1 : 0),
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

			let control = this.dom_resizer.current.children [0];

			if (common.isset (control)) {
				let control_position = control.style.position;

				control.style.position = "absolute";
				computed_style = window.getComputedStyle (control);

				result = {
					display: computed_style.display,
					width: Math.ceil (parseFloat (computed_style.width)),
					height: Math.ceil (parseFloat (computed_style.height))
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

				onEnter={() => { this.resize_transition_style ["entering"] = this.resize_transition_style ["entered"] = this.growth_dimensions () }}>

				{state => {
					return <div id={`${this.id_badge ()}_resize`} ref={this.dom_resizer} style={{
						...this.props.style,
						...this.resize_style,
						...this.resize_transition_style [state]
					}} className={this.props.className}><div className="resize-container">{this.state.contents ?? this.props.children}</div></div>
				}}

			</Transition>
		);
	}// resize_control;


	/********/


	constructor (props: fadeControl) {
		super (props);
		this.dom_control = this.props.dom_control ?? React.createRef ();
		this.dom_resizer = React.createRef ();
	}// constructor;


	public state = {
		contents: null,
		panel_states: {
			fade_panel: false,
			resize_panel: false
		}/* panel_states */
	}// state;


	public transition_start = (event: TransitionEvent) => {

		switch (event.propertyName) {
			case "opacity": {
				if (this.props.visible) {
					if (this.props.vanishing && this.props.reset_on_close) {
						this.dom_resizer.current.style.width = this.dom_resizer.current.style.height = null;
					} else {
						this.dom_control.current.style.zIndex = (this.props.zIndex ?? fade_zindex);
						this.execute_event (this.props.beforeShowing);
					}// if;
					this.execute_event (this.props.beforeFadein);
					return;
				}// if;
				this.execute_event (this.props.beforeHiding);
				this.execute_event (this.props.beforeFadeout);
			} break;
			case "height": {
				if (this.props.visible) {
					this.dom_control.current.style.zIndex = (this.props.zIndex ?? fade_zindex);
					this.execute_event (this.props.beforeShowing);
					this.execute_event (this.props.beforeOpening);
					return;
				}// if;
				this.execute_event (this.props.beforeClosing);
			} break;
		}// switch;

	}//transition_start;


	public transition_end = (event: TransitionEvent) => {

		switch (event.propertyName) {
			case "opacity": {
				if (this.props.visible) {
					this.execute_event (this.props.afterFadein);
					this.execute_event (this.props.afterShowing);
					return;
				}// if;
				this.execute_event (this.props.afterFadeout);
				switch (this.props.vanishing) {
					case true: this.setState ({ panel_states: {...this.state.panel_states, resize_panel: false } }); break;
					default: this.dom_control.current.style.zIndex = hidden_zindex; break;
				}// switch;
				this.execute_event (this.props.afterHiding);
			} break;
			case "height": {
				if (this.props.visible) {
					this.execute_event (this.props.afterOpening);
					this.setState ({ panel_states: {...this.state.panel_states, fade_panel: true } });
					(event.target as HTMLDivElement).style.height = null;
					return;
				}// if;
				this.dom_control.current.style.zIndex = hidden_zindex;
				this.execute_event (this.props.afterClosing);
				this.execute_event (this.props.afterHiding);
			} break;
			case "width": if (this.props.visible) (event.target as HTMLDivElement).style.width = null; break;
		}// switch;

	}// transition_end;


	public componentDidMount () {
		this.id = this.id_badge ();
		this.initialize_resize_panel ();

		this.dom_control.current.addEventListener ("transitionstart", this.transition_start.bind (this));
		this.dom_control.current.addEventListener ("transitionend", this.transition_end.bind (this));
	}// componentDidMount;


	public componentDidUpdate () {
		this.execute_event (this.props.onComponentUpdate);
	}// componentDidUpdate;


	// fade_control
	public render () {

		this.state.panel_states.fade_panel = this.props.visible;
		if (this.props.vanishing) this.state.panel_states.fade_panel = (this.props.visible ? this.state.panel_states.resize_panel : false);

		return (
			<Transition in={this.state.panel_states.fade_panel} timeout={globals.settings.animation_delay}>
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