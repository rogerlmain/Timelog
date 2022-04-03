import React from "react";
import InputMask from "react-input-mask";
import InputControl from "controls/abstract/input.control";


const pattern_group = {
	north_america	: [32, 189],
	australia		: [10]
}// number_patterns;


const pattern_mask = {
	north_america	: "+1 (999) 999-9999",
	australia		: "+62 (99)-9999-9999"
}// pattern_masks;


export default class PhoneNumberInput extends InputControl {

	state = { mask: pattern_mask.north_america }


	static defaultProps = { country_id: null }


	group_name (country_id) {
		for (let key in pattern_group) {
			if (pattern_group [key].includes (country_id)) return key;
		}// for;
		return null;
	}// group_name;


	/********/


	componentDidMount () {
		this.setState ({ mask: pattern_mask.north_america })
	}// componentDidMount;


	shouldComponentUpdate (new_props) {
		let country_id = parseInt (new_props.country_id);
		if (country_id != this.props.country_id) {
			this.setState ({ mask: pattern_mask [this.group_name (country_id)] });
			return false;
		}// if;
		return true;
	}// shouldComponentUpdate;


	render () { 
		return <InputMask mask={this.state.mask} maskChar="*" alwaysShowMask={true} style={{ textAlign: "center" }} />
	}// render;

}// PhoneNumberInput;