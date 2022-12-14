import React from "react";

import Container from "client/controls/container";
import BaseControl from "client/controls/abstract/base.control";
import ThumbnailImage from "client/controls/thumbnail.image";

import SettingsStorage from "client/classes/storage/settings.storage";


export default class ImageUploader extends BaseControl {


	file_control = React.createRef ();


	state = { 
		image: this.props.defaultImage, 
		image_style: { transition: `opacity ${SettingsStorage.animation_speed ()}ms ease-in-out` }
	}// state;


	static defaultProps = {
		defaultImage: null,
		onUpload: null,
	}// defaultProps;


	/********/


	change_image = event => {

		let file_reader = new FileReader ();

		file_reader.onloadend = () => this.setState ({ image: file_reader.result });
		file_reader.readAsDataURL (this.file_control.current.files [0]);

	}// change_image;


	/********/


	render () {
		return <Container>
			<input ref={this.file_control} type="file" style={{ display: "none" }} accept="image/*" onChange={this.change_image} />
			<ThumbnailImage src={this.state.image} onClick={event => this.file_control.current.click ()} onChange={this.props.onUpload} style={this.props.style} />
		</Container>
	}// render;

}// ImageUploader;