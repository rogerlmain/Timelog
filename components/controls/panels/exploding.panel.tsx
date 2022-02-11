import * as React from "react";
import * as common from "classes/common";

import BaseControl, { DefaultProps, DefaultState } from "controls/base.control";
import BaseFadePanel from "controls/panels/base.fade.panel";
import ResizePanel from "controls/panels/resize.panel";

import { globals } from "types/globals";


import ReactDOMServer from "react-dom/server";


interface ExplodingPanelProps extends DefaultProps {

	id: string;

	static?: boolean;

	speed?: number;

	beforeShowing?: Function;
	beforeHiding?: Function;

	afterShowing?: Function;
	afterHiding?: Function;

}// ExplodingPanelProps;


interface ExplodingPanelState extends DefaultState {

	resizing: boolean;

	fade_visible: boolean;

	children: any;

}// ExplodingPanelState;


export default class ExplodingPanel extends BaseControl<ExplodingPanelProps, ExplodingPanelState> {


	private initializing: boolean = false;


	/********/


	public static defaultProps: ExplodingPanelProps = {

		id: null,

		static: true,

		speed: globals.settings.animation_speed,

		beforeShowing: null,
		beforeHiding: null,

		afterShowing: null,
		afterHiding: null

	}// ExplodingPanelProps;


	public state: ExplodingPanelState = {
		resizing: false,
		fade_visible: true,
		children: null
	}// state;


	public componentDidMount (): void {
		this.setState ({ children: this.props.children });
		this.initializing = true;
	}// componentDidMount;


	public componentDidUpdate (): void {
		if (!this.initializing && !this.compare_elements (this.state.children, this.props.children)) this.setState ({ fade_visible: false });
		this.initializing = false;
	}// componentDidUpdate;


	public render () {

		if (common.is_null (this.props.id)) throw "Exploding panel requires an ID";

		return (
			<ResizePanel id={`${this.props.id}_exploding_panel`} speed={Math.floor (this.props.speed / 2)} resizing={this.state.resizing} outerStyle={{ border: "solid 1px red" }}

				afterResizing={() => this.setState ({ 
					resizing: false,
					fade_visible: true
				})}>

				<BaseFadePanel id={`${this.props.id}_exploding_panel`} visible={this.state.fade_visible} speed={Math.floor (this.props.speed / 2)} static={this.props.static} 

					beforeHiding={() => this.execute.bind (this) (this.props.beforeHiding)}
					afterHiding={() => this.setState ({ children: this.props.children }, () => this.setState ({ resizing: true }, () => this.execute.bind (this) (this.props.afterHiding)))}

					beforeShowing={() => this.execute.bind (this) (this.props.beforeShowing)}
					afterShowing={() => this.execute.bind (this) (this.props.afterShowing)}>

					{this.state.children}

				</BaseFadePanel>

			</ResizePanel>
		);
	}// render;


}// ExplodingPanel;