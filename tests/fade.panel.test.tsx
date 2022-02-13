import React, { Fragment } from "react";

import BaseControl, { DefaultProps, DefaultState } from "controls/base.control";
import FadePanel from "controls/panels/fade.panel";


interface fadePanelTestProps extends DefaultProps { 
	visible?: boolean;
	static?: boolean;
}// fadePanelTestProps;


interface fadePanelTestState extends DefaultState { 
	visible: boolean;
	selected_item: number;
}// fadePanelTestState;


export default class FadePanelTest extends BaseControl<fadePanelTestProps> {


	private fade_panel: React.RefObject<FadePanel> = React.createRef ();


	/********/


	public state: fadePanelTestState = { 
		visible: false, 
		selected_item: 1
	}// state;

	public props: fadePanelTestProps;
	

	public constructor (props: fadePanelTestProps) {
		super (props);
		this.state.visible = this.props.visible ?? this.state.visible;
	}// constructor;


	public render () {
		return (
			<div className="centering-container v" style={{ border: "solid 1px blue", padding: "2em" }}>

				<div style={{ display: "flex", justifyContent: "center", alignItems: "center" }}>

					<div style={{ border: "solid 1px red", padding: "1em", margin: "1em", display: "inline-block" }}>
						<FadePanel ref={this.fade_panel} visible={this.state.visible} static={this.props.static}>

							<div style={{ display: (this.state.selected_item == 1) ? null : "none", border: "solid 1px green" }}>Initial text</div>

							<div style={{ display: (this.state.selected_item == 2) ? null : "none", border: "solid 1px green" }}>
								New value<br />
								Second line
							</div>

							<div style={{ display: (this.state.selected_item == 3) ? null : "none", border: "solid 1px green" }}>
								Newer bigger value - extra wide<br />
								Second line<br />
								Third line<br />
							</div>

						</FadePanel>
					</div>

				</div>

				<div>
					<button onClick={() => this.setState ({ visible: true })}>Fade In</button>

					&nbsp;

					<button onClick={() => this.setState ({ visible: false })}>Fade Out</button>
				</div>

				<button onClick={() => this.setState ({ selected_item: 2 }) }>Smaller</button>
				<button onClick={() => this.setState ({ selected_item: 3 }) }>Bigger</button>
				<button onClick={() => this.setState ({ selected_item: 1 }) }>Restore</button>

			</div>
		)
	}

}// FadePanelTest;