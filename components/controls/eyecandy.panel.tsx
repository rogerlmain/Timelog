import BaseControl, { defaultInterface } from "./base.control";

import React from "react";
import FadeControl from "./fade.control";
import Eyecandy from "./eyecandy";

import { horizontal_alignment, vertical_alignment } from "components/types/constants";


interface eyecandyPanelInterface extends defaultInterface {
	eyecandy_text: string;

	beforeShowing?: any;
	afterShowing?: any;

	beforeHiding?: any;
	afterHiding?: any;

	beforeShowingEyecandy?: any;
	afterShowingEyecandy?: any;

	beforeHidingEyecandy?: any;
	afterHidingEyecandy?: any;

	beforeShowingContents?: any;
	afterShowingContents?: any;

	beforeHidingContents?: any;
	afterHidingContents?: any;

	align?: vertical_alignment;
	justify?: horizontal_alignment;

	vanishing?: boolean;
}// eyecandyPanelInterface;


export default class EyecandyPanel extends BaseControl<eyecandyPanelInterface> {


	private id = null;
	private eyecandy_panel: Eyecandy = null;
	private contents_panel: FadeControl = null;


	/********/


	public state = {
		eyecandy_visible: false,
		contents_visible: false,

		eyecandy_text: null,

		load_handler: null
	}// state;


	public constructor (props) {
		super (props);
		this.id = this.id_badge (this.props.id);
		this.show = this.show.bind (this);
	}// constructor;


	public componentDidMount () {
		this.eyecandy_panel = this.reference (`${this.id}_eyecandy`);
		this.contents_panel = this.reference (`${this.id}_contents`);
		this.setState ({ eyecandy_text: (this.props.eyecandy_text ?? "Loading") });
	}// componentDidMount;


	public show (callback: any = null) {
		this.setState ({ load_handler: () => callback (() => { this.setState ({ eyecandy_visible: false }) }) }, () => {
			switch (this.state.contents_visible) {
				case true: this.setState ({ contents_visible: false }); break;
				default: this.setState ({ eyecandy_visible: true }); break;
			}// switch;
		});
	}// show;


	public render () {

		return (

			<div id={this.id} className="eyecandy-panel overlay-container">

				<Eyecandy id={`${this.id}_eyecandy`} text={this.state.eyecandy_text}
					visible={this.state.eyecandy_visible && !this.state.contents_visible}
					vanishing={this.props.vanishing ?? false} reset_on_close={false}

					style={{
						display: "inline-flex",
						alignItems: (this.props.align ?? vertical_alignment.middle),
						justifyContent: (this.props.justify ?? horizontal_alignment.center)
					}}

					beforeShowing={() => {
						this.execute_event (this.props.beforeShowingEyecandy);
						this.execute_event (this.props.beforeShowing);
					}}

					afterShowing={() => {
						this.execute_event (this.props.afterShowingEyecandy);
						this.execute_event (this.state.load_handler);
						this.execute_event (this.props.afterShowing);
					}}

					beforeHiding={() => {
						this.execute_event (this.props.beforeHidingEyecandy);
						this.execute_event (this.props.beforeHiding);
					}}

					afterHiding={() => {
						this.execute_event (this.props.afterHidingEyecandy);
						this.execute_event (this.props.afterHiding);
						this.setState ({ contents_visible: true });
					}}>

				</Eyecandy>

				<FadeControl id={`${this.id}_contents`} className={this.props.className}
					visible={this.state.contents_visible && !this.state.eyecandy_visible}
					vanishing={this.props.vanishing ?? false} reset_on_close={false}

					style={{
						...this.props.style,
						justifySelf: (this.props.justify ?? horizontal_alignment.center),
						alignSelf: (this.props.align ?? vertical_alignment.middle)
					}}

					beforeShowing={() => {
						this.execute_event (this.props.beforeShowingContents);
						this.execute_event (this.props.beforeShowing);
					}}

					afterShowing={() => {
						this.execute_event (this.props.afterShowingContents);
						this.execute_event (this.props.afterShowing);
					}}

					beforeHiding={() => {
						this.execute_event (this.props.beforeHidingContents);
						this.execute_event (this.props.beforeHiding);
					}}

					afterHiding={() => {
						this.execute_event (this.props.afterHidingContents);
						this.execute_event (this.props.afterHiding);
						this.setState ({ eyecandy_visible: true });
					}}>

					{this.props.children}
				</FadeControl>

			</div>

		);

	}// render;


}// EyecandyPanel;