import React from "react";

import Settings from "classes/storage/settings";

import Container from "controls/container";
import ExplodingPanel from "controls/panels/exploding.panel";
import BaseControl from "controls/base.control";
import ToggleSwitch from "controls/toggle.switch";

import CreditCardForm from "pages/forms/credit.card.form";

import OptionsModel from "models/options";

import Options, { log_ends } from "classes/storage/options";

import { isset } from "classes/common";
import { option_types } from "types/globals";
import { resize_direction } from "controls/panels/resize.panel";

import "resources/styles/pages.css";


export default class SettingsPage extends BaseControl {


	static defaultProps = { id: "settings_page" }


	state = { 
		granularity: 1,
		start_rounding: Date.rounding.off,
		end_rounding: Date.rounding.off,
		cc_form: null
	}// state;


	rounding_payment_required (option, end) {
		if (option == this.state [`${end}_rounding`]) return false;
		if (option == Date.rounding.off) return false;
		if (Options.rounding ("start") || Options.rounding ("end")) return false;
		return true;
	}// rounding_payment_required;


	credit_card_form () {
		return <CreditCardForm showing={isset (this.state.cc_form)}

			onCancel={() => {
				this.setState ({ [this.state.cc_form.option]: this.state.cc_form.previous }, () => {
					this.setState ({ cc_form: null });
				});
			}}

			onSubmit={() => {
				OptionsModel.save_option (this.state.cc_form.option, this.state.cc_form.value).then (data => {
					Options.set (JSON.stringify (data));
					this.setState ({ cc_form: null });
				});
			}}>

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
		return <Container contentsOnly={true}>
			<label htmlFor="start_rounding">{end.charAt (0).toUpperCase () + end.slice (1)} time rounding</label>
			<div className="middle-right-container">
				<ToggleSwitch id="start_rounding" speed={Settings.animation_speed ()} value={this.state [`${end}_rounding`]} singleStep={true}

					onChange={(data) => {
						this.setState ({ cc_form: this.rounding_payment_required (data.option, end) ? {
							option: option_types [`${end}_rounding`],
							previous: this.state [`${end}_rounding`],
							value: data.option
						} : null });
						this.setState ({ [`${end}_rounding`]: data.option });
						return true;
					}}>

					<option value={Date.rounding.down}>Round down</option>
					<option value={Date.rounding.off}>Round off</option>
					<option value={Date.rounding.up}>Round up</option>

				</ToggleSwitch>
			</div>
		</Container>
	}// rounding_switch;


	componentDidMount () {
		this.setState ({ granularity: Options.granularity () - 1 });
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

							{this.rounding_switch (log_ends.start)}
							{this.rounding_switch (log_ends.end)}

						</Container>
					</ExplodingPanel>
				</div>

				{/* Date.minute_increments = [5, 6, 10, 12, 15, 20, 30] */}


			</div>
		);
	}// render;


}// SettingsPage;
