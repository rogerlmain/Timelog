import React from "react";

import Settings from "classes/storage/settings";

import Container from "controls/container";
import ExplodingPanel from "controls/panels/exploding.panel";
import BaseControl from "controls/abstract/base.control";
import ToggleSwitch from "controls/toggle.switch";

import CreditCardForm from "pages/forms/credit.card.form";

import OptionsModel from "models/options";

import Options, { log_entry_boundaries } from "classes/storage/options";

import { isset } from "classes/common";
import { option_types, date_rounding } from "client/classes/types/constants";
import { resize_direction } from "controls/panels/resize.panel";

import "client/resources/styles/pages.css";


export default class SettingsPage extends BaseControl {


	static defaultProps = { id: "settings_page" }


	state = { 
		granularity: 1,
		start_rounding: date_rounding.off,
		end_rounding: date_rounding.off,
		cc_form: null
	}// state;


	rounding_payment_required (option, end) {
		if (option == this.state [`${end}_rounding`]) return false;
		if (option == date_rounding.off) return false;
		if (Options.rounding (log_entry_boundaries.start) || Options.rounding (log_entry_boundaries.end)) return false;
		return true;
	}// rounding_payment_required;


	set_option (option, value) {
		return new Promise ((resolve, reject) => {
			OptionsModel.save_option (option, value).then (data => {
				Options.set (JSON.stringify (data));
				resolve ();
			}).catch (reject);
		});
	}// set_option;


	credit_card_form () {
		return <CreditCardForm visible={isset (this.state.cc_form)}

			onCancel={() => {
				this.setState ({ [this.state.cc_form.option]: this.state.cc_form.previous }, () => {
					this.setState ({ cc_form: null });
				});
			}}

			onSubmit={() => this.set_option (this.state.cc_form.option, this.state.cc_form.value).then (() => this.setState ({ cc_form: null }))}>

		</CreditCardForm>
	}// credit_card_form;


	granularity_switch () {
		return <Container contentsOnly={true}>
			<label htmlFor="granularity_setting">Granularity</label>
			<div style={{ display: "flex", flexDirection: "row", justifyContent: "right" }}>
				<ToggleSwitch id="granularity" speed={Settings.animation_speed ()} value={this.state.granularity} singleStep={true}

					onChange={(data) => { 

						let selected_option = data.option + 1;

						if (data.option > this.state.granularity) this.setState ({ 
							cc_form: { 
								option: option_types.granularity, 
								previous: this.state.granularity,
								value: selected_option
							}/* cc_form */
						});
						
						this.setState ({ granularity: data.option });
						
						return true;

					}}>

					<option>1 Hr</option>
					<option>15 Mins</option>
					<option>1 Min</option>
					<option>Truetime</option>

				</ToggleSwitch>
			</div>
		</Container>
	}// granularity_switch;


	rounding_switch (end) {

		let boundary_rounding = `${end}_rounding`;

		return <Container contentsOnly={true}>
			<label htmlFor="start_rounding">{end.charAt (0).toUpperCase () + end.slice (1)} time rounding</label>
			<div className="middle-right-container">
				<ToggleSwitch id="start_rounding" speed={Settings.animation_speed ()} value={this.state [boundary_rounding]} singleStep={true}

					onChange={(data) => {

						if (data.option == this.state [boundary_rounding]) return;

						if (this.rounding_payment_required (data.option, end)) {
							this.setState ({ cc_form: {
								option: option_types [boundary_rounding],
								previous: this.state [boundary_rounding],
								value: data.option
							}}) 
						} else {
							this.set_option (boundary_rounding, data.option);
						}// if;

						this.setState ({ [boundary_rounding]: data.option });

					}}>

					<option value={date_rounding.down}>Round down</option>
					<option value={date_rounding.off}>Round off</option>
					<option value={date_rounding.up}>Round up</option>

				</ToggleSwitch>
			</div>
		</Container>
	}// rounding_switch;


	componentDidMount () {
		
		let start_rounding = Options.rounding (log_entry_boundaries.start);
		let end_rounding = Options.rounding (log_entry_boundaries.end);

		let values = { granularity: Options.granularity () - 1 }

		if (isset (start_rounding)) values = { ...values, start_rounding: start_rounding }
		if (isset (end_rounding)) values = { ...values, end_rounding: end_rounding }

		this.setState (values);

	}// componentDidMount;


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

							{this.rounding_switch (log_entry_boundaries.start)}
							{this.rounding_switch (log_entry_boundaries.end)}

						</Container>
					</ExplodingPanel>
				</div>

				{/* Date.minute_increments = [5, 6, 10, 12, 15, 20, 30] */}


			</div>
		);
	}// render;


}// SettingsPage;
