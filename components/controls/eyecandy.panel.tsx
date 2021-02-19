import BaseControl, { defaultInterface } from "./base.control";

import React from "react";
import FadeControl from "./fade.control";
import Eyecandy from "./eyecandy";

import * as constants from "components/types/constants";



interface eyecandyPanelInterface extends defaultInterface {
	eyecandy_text: string;

	beforeShowingEyecandy?: any;
	afterShowingEyecandy?: any;

	beforeHidingEyecandy?: any;
	afterHidingEyecandy?: any;

	beforeShowingContents?: any;
	afterShowingContents?: any;

	beforeHidingContents?: any;
	afterHidingContents?: any;

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
		contents: null,

		beforeShowingEyecandy: null,
		afterShowingEyecandy: null,

		beforeHidingEyecandy: null,
		afterHidingEyecandy: null,

		afterShowingContents: null,

		beforeHidingContents: null,
		afterHidingContents: null
	}// state;


	public constructor (props) {
		super (props);
		this.id = this.id_badge (this.props.id);
	}// constructor;


	public componentDidMount () {
		this.eyecandy_panel = this.reference (`${this.id}_eyecandy`);
		this.contents_panel = this.reference (`${this.id}_contents`);
		this.setState ({ eyecandy_text: (this.props.eyecandy_text ?? "Loading") });
		this.setState ({ contents: this.props.children });
	}// componentDidMount;


	public load_contents (content_loader: any) {
		if (this.state.contents_visible) this.setState ({
			afterShowingEyecandy: () => this.setState ({ contents: content_loader (() => this.setState ({ eyecandy_visible: false })) }),
			contents_visible: false
		})
		else this.setState ({ contents: content_loader (() => this.setState ({ contents_visible: true })) });
	}// load_contents;


	public show () {
		this.load_contents ((callback: any) => {
			this.execute_event (callback);
			return this.props.children;
		});
	}// show;


	public render () {

		return (

			<div id={this.id} className="overlay-container">

				<Eyecandy id={`${this.id}_eyecandy`} className="self-centered"
					visible={this.state.eyecandy_visible && !this.state.contents_visible}
					text={this.state.eyecandy_text} vanishing={this.props.vanishing ?? false}

					beforeShowing={this.state.beforeShowingEyecandy}
					afterShowing={this.state.afterShowingEyecandy}
					beforeHiding={this.state.beforeHidingEyecandy}
					afterHiding={() => {
						this.setState ({ contents_visible: true });
						this.execute_event (this.props.afterHidingEyecandy);
					}}>

				</Eyecandy>

				<FadeControl id={`${this.id}_contents`} className={`self-centered ${this.props.className ?? constants.empty}`.trim ()}
					visible={this.state.contents_visible && !this.state.eyecandy_visible}
					style={this.props.style} vanishing={this.props.vanishing ?? false}

					beforeShowing={this.props.beforeShowingContents}
					afterShowing={this.state.afterShowingContents}
					beforeHiding={this.state.beforeHidingContents}
					afterHiding={() => {
						this.setState ({ eyecandy_visible: true })
						this.execute_event (this.props.afterHidingContents);
					}}>

					{this.state.contents}
				</FadeControl>

			</div>

		);

	}// render;




}// EyecandyPanel;