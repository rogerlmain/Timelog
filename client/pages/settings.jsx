import React from "react";

import Settings from "classes/storage/settings";

import Container from "controls/container";
import ExplodingPanel from "controls/panels/exploding.panel";
import BaseControl from "controls/abstract/base.control";
import ToggleSwitch from "controls/toggle.switch";

import CreditCardForm from "pages/forms/credit.card.form";

import OptionsModel from "models/options";

import Options, { boundaries } from "classes/storage/options";

import { isset } from "classes/common";
import { option_types, date_rounding, default_options, globals } from "classes/types/constants";
import { resize_direction } from "controls/panels/resize.panel";

import "client/resources/styles/pages.css";


export default class SettingsPage extends BaseControl {


	state = { 
		granularity: 0,
		start_rounding: date_rounding.off,
		end_rounding: date_rounding.off,
		cc_form: null 
	}/* state */;


	static defaultProps = { id: "settings_page" }


	constructor (props) {
		super (props);
		this.state = {
			granularity: Options.granularity () ?? this.state.granularity,
			start_rounding: Options.rounding (boundaries.start) ?? this.state.start_rounding,
			end_rounding: Options.rounding (boundaries.end) ?? this.state.end_rounding
		};
	}// constructor;


	set_option (option, value) {
		return new Promise ((resolve, reject) => OptionsModel.save_option (option, value).then (response => {
			Options.set (option, value);
			this.setState ({ [option]: value }, resolve (response));
		}).catch (reject));
	}// set_option;


	credit_card_form () {
		return <CreditCardForm visible={isset (this.state.cc_form)}

			onCancel={() => this.setState ({ [this.state.cc_form.option]: this.state.cc_form.previous }, () => this.setState ({ cc_form: null }))} 
			onSubmit={() => this.set_option (this.state.cc_form.option, this.state.cc_form.value).then (() => this.execute (this.state.cc_form.onSubmit).then (() => this.setState ({ cc_form: null })))}>

		</CreditCardForm>
	}// credit_card_form;


	granularity_switch () {
		return <Container contentsOnly={true}>
			<label htmlFor="granularity_setting">Granularity</label>
			<div style={{ display: "flex", flexDirection: "row", justifyContent: "right" }}>
				<ToggleSwitch id="granularity" speed={Settings.animation_speed ()} value={this.state.granularity - 1} singleStep={true}

					onChange={(data) => { 

						let granularity = Options.granularity ();

						this.state.granularity = data.option + 1;

						if (this.state.granularity > granularity) {
							this.setState ({ 
								cc_form: { 
									option: option_types.granularity, 
									previous: granularity,
									value: this.state.granularity,
									onSubmit: () => this.setState ({
										start_rounding: date_rounding.off,
										end_rounding: date_rounding.off
									})
								}/* cc_form */
							});
							return true;
						}// if;

						this.set_option (option_types.granularity, this.state.granularity);

					}}>

					<option>1 Hr</option>
					<option>15 Mins</option>
					<option>1 Min</option>
					<option>Truetime</option>

				</ToggleSwitch>
			</div>
		</Container>
	}// granularity_switch;


	rounding_switch (rounding_end) {

		let label = `${rounding_end}_rounding`;
		let id = `${label}_switch`;
		let rounding = Options.rounding (rounding_end) ?? default_options.rounding;

		return <Container contentsOnly={true}>
			<label htmlFor={id}>{rounding_end.charAt (0).toUpperCase () + rounding_end.slice (1)} time rounding</label>
			<div className="middle-right-container">
				<ToggleSwitch id={id} speed={Settings.animation_speed ()} value={this.state [label]} singleStep={true}

					onChange={(data) => {

						this.state [label] = data.option;

						if (this.state [label] == rounding) return;

						if (!Options.subscribed (option_types.rounding)) {
							this.setState ({ 
								cc_form: {
									option: option_types [label],
									previous: rounding,
									value: this.state [label]
								}
							}) 
						} else {
							this.set_option (label, this.state [label]);
						}// if;

					}}>

					<option value={date_rounding.down}>Round down</option>
					<option value={date_rounding.off}>Round off</option>
					<option value={date_rounding.up}>Round up</option>

				</ToggleSwitch>
			</div>
		</Container>
	}// rounding_switch;


	shouldComponentUpdate (new_props) {
		if (new_props.companyId != this.props.companyId) {
			this.setState ({
				granularity: Options.granularity () ?? default_options.granularity,
				start_rounding: Options.rounding (boundaries.start) ?? default_options.rounding,
				end_rounding: Options.rounding (boundaries.end) ?? default_options.rounding
			});
			return false;
		}// if;
		return true;
	}// shouldComponentUpdate;


	render () {
		return (
			<div id={this.props.id} className="one-piece-form">

				{this.credit_card_form ()}

				<div className="full-row section-header">User Settings</div>

				<label htmlFor="animation_speed">Animation Speed</label>
				<input type="text" id="animation_speed" defaultValue={Settings.animation_speed ()} style={{ textAlign: "right" }}
					onChange={(event) => {
						globals.set_setting ("animation_speed", parseInt (event.target.value));
						globals.master_panel.forceUpdate ();
					}}>
				</input>

				<div className="full-row section-header">Account Options</div>

				{this.granularity_switch ()}

				<br />

				<div className="double-column">
					<ExplodingPanel id="rounding_options_panel" direction={resize_direction.vertical} stretchOnly={true}>
						<Container id="rounding_options_container" condition={ Options.granularity () > 1} className="one-piece-form" inline={true} style={{ justifySelf: "stretch" }}>
							{this.rounding_switch (boundaries.start)}
							{this.rounding_switch (boundaries.end)}
						</Container>
					</ExplodingPanel>
				</div>

				{/* Date.minute_increments = [5, 6, 10, 12, 15, 20, 30] */}


			</div>
		);
	}// render;


}// SettingsPage;
