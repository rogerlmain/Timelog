import React from "react";

import * as common from "classes/common";

import BaseControl, { DefaultProps, DefaultState } from "controls/base.control";
import ResizePanel, { iResizable, resize_state } from "controls/panels/resize.panel";
import FadePanel from "controls/panels/fade.panel";

import { globals } from "types/globals";
import { renderToString } from "react-dom/server";


interface ExplodingPanelProps extends DefaultProps {

	id: string;

	speed?: number;

	stretchOnly?: boolean;

	beforeShowing?: Function;
	beforeHiding?: Function;

	afterShowing?: Function;
	afterHiding?: Function;

}// ExplodingPanelProps;


interface ExplodingPanelState extends DefaultState {

	children: any;

	resize: resize_state;

	animate: boolean;
	visible: boolean;	

}// ExplodingPanelState;


export default class ExplodingPanel extends BaseControl<ExplodingPanelProps, ExplodingPanelState> implements iResizable {


	private transitioning: boolean = false;


	private load_contents = (new_children: any) => {

		const run_animation = (): any => {
			if (this.state.children != new_children) return setTimeout (run_animation);
			this.forceUpdate (() => this.setState ({ resize: resize_state.animate }));
		}// run_animation;

		this.transitioning = false;

		this.setState ({ children: new_children }, run_animation);

	}// load_contents;


	/********/


	public static defaultProps: ExplodingPanelProps = {

		id: null,

		speed: globals.settings.animation_speed,

		stretchOnly: false,

		beforeShowing: null,
		beforeHiding: null,

		afterShowing: null,
		afterHiding: null

	}// ExplodingPanelProps;


	public state: ExplodingPanelState = {

		children: null,

		resize: resize_state.false,

		animate: false,
		visible: false

	}// state;


	public constructor (props: ExplodingPanelProps) {
		super (props);
		this.state.children = this.props.children;
		this.state.visible = common.not_empty (renderToString (this.props.children));
	}// constructor;


	public componentDidMount = () => this.setState ({ animate: true });


	public shouldComponentUpdate (next_props: Readonly<ExplodingPanelProps>, next_state: Readonly<ExplodingPanelState>, next_context: any): boolean {

		let updated = !this.same_element (next_state.children, next_props.children);

		if (this.transitioning) return common.is_null (setTimeout (() => this.forceUpdate ()));

		if (updated) switch (this.state.visible) {
			case true: this.transitioning = true; this.setState ({ visible: false }); return false;
			default: this.load_contents (next_props.children); break; 
		}// if / switch;

 		return true; 

  	}// shouldComponentUpdate;


	public render () {

		let target_speed = Math.floor (this.props.speed / 2);

		if (common.is_null (this.props.id)) throw "Exploding panel requires an ID";

		return (

			<FadePanel id={`${this.props.id}_exploding_panel_fade_panel`} speed={target_speed} animate={this.state.animate} visible={this.state.visible}

				beforeHiding={this.props.beforeHiding}

				afterShowing={() => {
					this.transitioning = false;
					this.execute (this.props.afterShowing)
				}}// afterShowing;

				afterHiding={() => {
					this.load_contents (this.props.children);
					this.execute (this.props.afterHiding);
				}}>


				<ResizePanel id={`${this.props.id}_exploding_panel_resize_panel`} 
					speed={target_speed} resize={this.state.resize} parent={this} stretchOnly={this.props.stretchOnly}

					beforeResizing={() => this.execute (this.props.beforeShowing)}
					afterResizing={() => this.setState ({ visible: common.isset (this.state.children) })}>

					{this.state.children}

				</ResizePanel>
				
			</FadePanel>

		);
	}// render;


}// ExplodingPanel