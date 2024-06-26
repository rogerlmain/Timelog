import React from "react";

import BaseControl from "client/controls/abstract/base.control";
import ExplodingPanel from "client/controls/panels/exploding.panel";


export default class ContentsPanel extends BaseControl {


	exploding_panel = React.createRef ();


	state = { index: 1 }
	id = null;


	/********/


	static defaultProps = { index: 1 }


	constructor (props) {

		super (props);
		
		this.id = `${this.props.id ?? this.create_key ()}_contents_panel`;
		this.state.index = this.props.index;

	}// constructor;


	/********/


	animate = new_index => this.exploding_panel.current.animate (() => this.setState ({ index: new_index }));


	/********/


	componentDidUpdate (props) {
		if (props.index != this.props.index) this.animate (this.props.index);
	}// componentDidUpdate;
	

	render = () => <ExplodingPanel {...this.props} ref={this.exploding_panel} id={this.id}>
		{this.props.children [this.state.index - 1]}
	</ExplodingPanel>


}// ContentsPanel;