import React from "react";
import BaseFadePanel, { BaseFadePanelProps, BaseFadePanelState }  from "controls/panels/base.fade.panel";
import { globals } from "types/globals";

import * as constants from "types/constants";


interface FadePanelProps extends BaseFadePanelProps {
	visible: boolean;
}// FadePanelProps;

interface FadePanelState extends BaseFadePanelState {
	visible: boolean;
	contents?: any;
}// FadePanelState;


export default class FadePanel extends BaseFadePanel<FadePanelProps, FadePanelState> {


	private showing: boolean = false;

	private contents_updated: boolean = false;
	private visibility_updated: boolean = false;


	/********/


	protected override transition_start (event: TransitionEvent) {
		if (event.propertyName != "opacity") return;
		switch (this.state.visible) {
			case true:
				this.execute (this.props.beforeShowing, event);
				this.showing = true;
				break;
			default:  this.execute (this.props.beforeHiding, event);
		}// switch;
	}//transition_start;


	protected transition_end (event: TransitionEvent) {
		if (event.propertyName != "opacity") return;
		switch (this.state.visible) {
			case true:
				this.contents_updated = false;
				this.execute (this.props.afterShowing, event);
				break;
			default:
				this.showing = false;
				this.execute (this.props.afterHiding, event);
		}// switch;
		this.forceUpdate ();
	}// transition_end;


	// FOR DEBUGGING
	protected log () {
		if (constants.debugging) console.log (`
			Showing: ${this.showing}
			State Visible: ${this.state.visible}
			Props Visible: ${this.props.visible}
			Updated: ${this.contents_updated}
			Showing: ${this.showing}
		`);
	}// log;


	/********/


	public props: FadePanelProps;
	public state: FadePanelState;


	public constructor (props: FadePanelProps) {
		super (props);
		if (this.props.static) this.state.visible = this.props.visible;
		this.showing = this.state.visible;
		this.state.contents = this.children ();
	}// constructor;


	public componentDidMount () {

		this.dom_control.current.addEventListener ("transitionstart", this.transition_start.bind (this));
		this.dom_control.current.addEventListener ("transitionend", this.transition_end.bind (this));

		this.setState ({  visible: null });

		this.componentDidUpdate ();

	}// componentDidMount;


	public getSnapshotBeforeUpdate (old_props: FadePanelProps, old_state: FadePanelState) {
		this.visibility_updated = this.visibility_updated || this.is_updated (this.props.visible, old_props.visible);
		this.contents_updated = this.contents_updated || this.changed (this.props.children, old_props.children);
		return false;
	}// getSnapshotBeforeUpdate;


	public componentDidUpdate () {
		if (this.state.visible) {
			if (this.contents_updated) {
				if ((this.props.visible) && (this.showing)) return this.setState ({ visible: false });
			} else {
				if ((!this.props.visible) && (this.showing) && (this.visibility_updated)) return this.setState ({ visible: false });
			}// if;
		} else {
			if (this.contents_updated) {
				if (!this.showing) {
					this.contents_updated = false;
					return this.setState ({ contents: this.children () });
				}// if;
			} else {
				if ((this.props.visible) && (!this.showing)) return this.setState ({ visible: true });
			}// if;
		}// if;
	}// componentDidUpdate;


	public render () {
		return (
			<div id={this.props.id} ref={this.dom_control} style={{
				...this.props.style,
				opacity: (this.state.visible ? 1 : 0),
				transition: `opacity ${this.props.speed}ms ease-in-out`
			}} className={this.props.className}>
				{(() => {
					return this.state.contents
				})()}
			</div>
		);
	}// render;

}// FadePanel;
