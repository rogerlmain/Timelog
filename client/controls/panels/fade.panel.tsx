import BaseControl, { DefaultProps, DefaultState } from "controls/base.control";
import React from "react";

import { globals } from "types/globals";

import * as common from "classes/common";


interface FadePanelProps extends DefaultProps {

	id: string;
	parent: iFadeable;

	visible: boolean;	// Default = false
	static?: boolean;	// If false animates on initial display. Default = false;

	speed?: number;		// overrides globals.settings.animation_speed

	beforeShowing?: Function;
	afterShowing?: Function;

	beforeHiding?: Function;
	afterHiding?: Function;

}// FadePanelProps;


interface FadePanelState extends DefaultState {
	visible: boolean;
	timeout: any;
}// FadePanelState;


export interface fadeableState extends DefaultState { visible: boolean }
export interface iFadeable extends BaseControl { state: fadeableState }


export default class FadePanel<Props, State> extends BaseControl<FadePanelProps, FadePanelState> implements iFadeable {


	private loading: boolean = false;


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


	public state: FadePanelState = { 
		visible: false,
		timeout: null
	}// state;


	public static defaultProps: FadePanelProps = {
		id: null,
		parent: null,
		visible: false,
		static: false,
		speed: globals.settings.animation_speed
	}// defaultProps;


	public constructor (props: FadePanelProps) {
		super (props);
		if (common.is_null (this.props.id)) throw "FadePanel requires an ID";
		if (common.is_null (this.props.parent)) throw "FadePanel requires a parent of type iFadeable";
	}// constructor;


	public componentDidMount () {
		if (this.props.visible) {
			this.setState ({ visible: this.props.static });
			if (!this.props.static) {
				this.props.parent.setState ({ visible: false });
				this.loading = true;
			}// if;
		}// if;
		this.dom_control.current.addEventListener ("transitionstart", this.transition_start.bind (this));
		this.dom_control.current.addEventListener ("transitionend", this.transition_end.bind (this));
	}// componentDidMount;


//	public shouldComponentUpdate(nextProps: Readonly<FadePanelProps>, nextState: Readonly<FadePanelState>, nextContext: any): boolean {
		
	public componentDidUpdate (): void {

		if ((this.loading) && (this.props.visible))  {
			if (common.is_null (this.state.timeout)) setTimeout (() => {
				this.loading = false;
				this.props.parent.setState ({ visible: true }, () => this.setState ({ timeout: null }));
			})// if;
			return;// false; // lag required and you can't return a Timeout From void
		}// if;

		this.setState ({ visible: this.props.visible });

//		return true;

	}// componentDidUpdate;


	public render () {

		let style = { ...this.props.style, opacity: (this.state.visible === true ? 1 : 0) }
		
		if (!this.loading) style = { ...style, transition: `opacity ${this.props.speed}ms ease-in-out` }

		return (
			<div id={this.props.id} ref={this.dom_control} style={style} className={this.props.className}>{this.props.children}</div>
		);
	}// render;

}// FadePanel;
