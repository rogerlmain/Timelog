import * as React from "react";

import BaseControl from "client/controls/abstract/base.control";

import ExplodingPanel from "client/controls/panels/exploding.panel";
import Container from "client/controls/container";

import SettingsStorage from "client/classes/storage/settings.storage";

import { is_null } from "client/classes/common";
import { default_settings } from "client/classes/types/constants";


export default class SlideshowPanel extends BaseControl {

	state = { index: 0 }


	exploding_panel = React.createRef ();


	static defaultProps = {

		id: null,
		
		index: 0,

		speed: null,

		stretchOnly: false,

		beforeChanging: null,
		afterChanging: null

	}// defaultProps;


	constructor (props) {
		super (props);
		this.validate_ids (props);
	}// constructor;	


	/********/


	forceResize = () => this.exploding_panel.current.forceResize ();


	render_children = () => {

		let result = null;
		let children = this.children (this.props);

		for (let index = 0; index < children.length; index++) {
			let id = `${children [index].props.id}_container`;
			if (is_null (result)) result = [];
			result.push (<Container key={`${id}_key`} id={id} visible={(this.props.index - 1) == index}>{children [index]}</Container>);
		}// for;

		return result;
	
	}// render_children;


	/********/


	render () {
		return <ExplodingPanel id={`${this.props.id}_slideshow_panel`} ref={this.exploding_panel} speed={this.animation_speed ()} stretchOnly={this.props.stretchOnly}
			
			beforeShowing={() => { if (this.props.index == 0) this.execute (this.props.beforeChanging) }}
			beforeHiding={this.props.beforeChanging}
			afterShowing={this.props.afterChanging}>

			{this.render_children ()}

		</ExplodingPanel>
	}// render;

}// SlideshowPanel;