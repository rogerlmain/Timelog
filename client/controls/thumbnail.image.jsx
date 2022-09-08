import React from "react";

import Container from "client/controls/container";
import BaseControl from "client/controls/abstract/base.control";

import SettingsStorage from "client/classes/storage/settings.storage";

import { nested_value, not_set } from "client/classes/common";


const default_width		= "10vw";
const default_height	= "10vw";


export default class ThumbnailImage extends BaseControl {


	image_control = React.createRef ();
	image_border = React.createRef ();


	image_border_style = {
		borderRadius: "999px",
		border: "solid 2px var(--border-color)",
		cursor: "pointer",
		overflow: "hidden",
		boxSizing: "content-box",
	}// image_border_style;
	
	
	state = { 
		image: this.props.src, 
		image_style: { transition: `opacity ${SettingsStorage.animation_speed ()}ms ease-in-out` }
	}// state;


	static defaultProps = {
		src: null,
		onUpload: null,
	}// defaultProps;


	/********/


	set_style = (styles, callback) => this.setState ({ image_style: { ...this.state.image_style, ...styles }}, callback);

	portrait = () => { return this.image_control.current.offsetHeight >= this.image_control.current.offsetWidth }


	update_dimensions = () => {

		if (this.image_control.current.src.indexOf ("data:image/svg") == 0) return;

		switch (this.portrait ()) {
			case true: this.set_style ({ width: `${this.image_border.current.offsetWidth}px`, height: "auto" }, this.update_style); break;
			default: this.set_style ({ height: `${this.image_border.current.offsetHeight}px`, width: "auto" }, this.update_style); break;
		}// switch;

		return false;

	}// update_dimensions;


	update_style = () => { 

		let image = this.image_control.current;
		let border = this.image_border.current;

		let portrait = this.portrait ();

		if (not_set (image) || not_set (border)) return null;

		this.set_style ({			
			top: portrait ? `${Math.round ((border.offsetHeight - (image.offsetHeight * (border.offsetWidth / image.offsetWidth))) / 2)}px` : null,
			left: portrait ? null : `${Math.round ((border.offsetWidth - (image.offsetWidth * (border.offsetHeight / image.offsetHeight))) / 2)}px`,
		}, () => setTimeout (() => {
			this.image_control.current.style.opacity = 1;
			setTimeout (() => this.execute (this.props.onChange, { thumbnail: this.image_control.current.toDataURL () }), SettingsStorage.animation_speed ());
		}));

	}//  update_style;


	/********/


	shouldComponentUpdate (new_props) {

		if (this.props.src != new_props.src) {
			this.image_control.current.style.opacity = 0;
			setTimeout (() => this.setState ({ image: new_props.src }, () => this.update_dimensions ()), SettingsStorage.animation_speed ());
			return false;
		}// if;

		return true;

	}// shouldComponentUpdate;


	render () {

		let image_size = {
			width: nested_value (this.props.style, "width") ?? default_width,
			height: nested_value (this.props.style, "height") ?? default_height,
		}// image_size;

		return <Container>
			<div ref={this.image_border} style={{ ...this.image_border_style, ...image_size }}>
				<img ref={this.image_control} src={this.state.image} style={{ ...this.state.image_style, position: "relative" }} 
					onClick={this.props.onClick}
					onLoad={event => this.update_dimensions ()}>
				</img>
			</div>
		</Container>

	}// render;

}// ThumbnailImage;