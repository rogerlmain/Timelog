import React from "react";

import Container from "controls/container";
import BaseControl from "controls/abstract/base.control";

import { notify, not_set, pause } from "client/classes/common";
import SettingsStorage from "client/classes/storage/settings.storage";


export default class ImageUploader extends BaseControl {


	file_control = React.createRef ();
	image_control = React.createRef ();
	image_border = React.createRef ();


	image_border_style = {
		width: this.props.defaultWidth,
		height: this.props.defaultHeight,
		borderRadius: "999px",
		border: "solid 0.2em var(--border-color)",
		cursor: "pointer",
		overflow: "hidden",
		boxSizing: "content-box",
	}// image_border_style;
	
	
	state = { 
		image: this.props.defaultImage, 
		image_style: { 
			width: this.props.defaultWidth, 
			height: this.props.defaultHeight,
			transition: `opacity ${SettingsStorage.animation_speed ()}ms ease-in-out`,
		}// image_style;
	}// state;


	static defaultProps = { 
		defaultImage: null,
		defaultWidth: null,
		defaultHeight: null,
	}// defaultProps;


	/********/


	set_style = (styles, callback) => this.setState ({ image_style: { ...this.state.image_style, ...styles }}, callback);


	clear_style = (handler) => {
		this.set_style ({
			width: null, 
			height: null 
		}, handler);
	}// clear_style;


	update_style = () => { 

		let image = this.image_control.current;
		let border = this.image_border.current;

		let portrait = image.offsetHeight >= image.offsetWidth;
		let landscape = image.offsetWidth >= image.offsetHeight;

		if (not_set (image) || not_set (border)) return null;
		if (image.src.indexOf ("data:image/svg") == 0) return null;

		this.set_style ({ 
			position: "relative",
			width: (landscape ? border.offsetWidth : "auto"),
			height: (portrait ? border.offsetHeight : "auto"),
			top: (landscape ? Math.round ((border.offsetHeight - (image.offsetHeight * (border.offsetWidth / image.offsetWidth))) / 2) : null),
			left: (portrait ? Math.round ((border.offsetWidth - (image.offsetWidth * (border.offsetHeight / image.offsetHeight))) / 2) : null),
			opacity: 1,
		})// style;

	}//  update_style;

	
	change_image = event => {

		let file_reader = new FileReader ();

		file_reader.onloadend = () => this.setState ({ image: file_reader.result });
		this.image_control.current.style.opacity = 0;
		
		setTimeout (() => {
			file_reader.readAsDataURL (this.file_control.current.files [0]);
			this.set_style ({
				width: null, 
				height: null,
			});
		}, SettingsStorage.animation_speed ());

	}// change_image;


	/********/


	render () {
		return <Container>

			<input ref={this.file_control} type="file" style={{ display: "none" }} accept="image/*" onChange={this.change_image} />

			<div ref={this.image_border} style={this.image_border_style}>
				<img ref={this.image_control} src={this.state.image} style={this.state.image_style}
					onClick={event => this.clear_style (event => this.file_control.current.click ())}
					onLoad={event => this.update_style ()}>
				</img>
			</div>

		</Container>
	}// render;

}// ImageUploader;