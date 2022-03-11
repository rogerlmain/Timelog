import React from "react";

import Settings from "classes/storage/settings";
import Options from "classes/storage/options";

import Container from "controls/container";
import ExplodingPanel from "controls/panels/exploding.panel";

import BaseControl from "controls/base.control";
import ToggleSwitch from "controls/toggle.switch";

import OptionsModel from "models/options";

import CreditCardForm from "pages/forms/credit.card.form";

import { isset } from "classes/common";
import { globals, option_types, option_key } from "types/globals";
import { resize_direction } from "controls/panels/resize.panel";

import "resources/styles/pages.css";


export default class SettingsPanel extends BaseControl {


	state = { 
		granularity: 1,
		start_rounding: Date.rounding.off,
		end_rounding: Date.rounding.off,
		cc_form: null
	}// state;


	componentDidMount () {
		this.setState ({ granularity: Options.granularity () });
	}// componentDidMount;


	render () {
		return (
			<div className="one-piece-form">

				<CreditCardForm showing={isset (this.state.cc_form)}

					onCancel={() => this.setState ({ 
						[this.state.cc_form.option]: this.state.cc_form.previous,
						cc_form: null 
					})}

					onSubmit={() => {
						OptionsModel.save_option (option_key (this.state.cc_form.option), this.state.cc_form.value).then (data => {
							Options.set (JSON.stringify (data));
							this.setState ({ cc_form: null });
						});
					}}>

				</CreditCardForm>

				<div className="full-row section-header">User Settings</div>

				<label htmlFor="animation_speed">Animation Speed</label>
				<input type="text" id="animation_speed" defaultValue={Settings.animation_speed ()} style={{ textAlign: "right" }}
					onChange={(event) => {
						globals.set_setting ("animation_speed", parseInt (event.target.value));
						globals.master_panel.forceUpdate ();
					}}>
				</input>

				<div className="full-row section-header">Account Options</div>

				<label htmlFor="granularity_setting">Granularity</label>
				<div style={{ display: "flex", flexDirection: "row", justifyContent: "right" }}>
					<ToggleSwitch id="granularity" speed={Settings.animation_speed ()} value={this.state.granularity} singleStep={true}

						onChange={(data) => { 

							if (data.option > this.state.granularity) this.setState ({ 
								cc_form: { 
									option: option_types.granularity, 
									previous: this.state.granularity,
									value: data.option
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

				<br />

				<div className="double-column">
					<ExplodingPanel id="rounding_options_panel" direction={resize_direction.vertical} stretchOnly={true}>
						<Container condition={ Options.granularity () > 1} className="one-piece-form" inline={true} style={{ justifySelf: "stretch" }}>

							<label htmlFor="start_rounding">Start time rounding</label>
							<div className="middle-right-container">
								<ToggleSwitch id="start_rounding" speed={Settings.animation_speed ()} value={this.state.start_rounding} singleStep={true}

									onChange={(data) => {
										this.setState ({ cc_form: (data.option > this.state.start_rounding) ? {
											option: option_types.start_rounding,
											value: Options.rounding (option_types.start_rounding)
										} : null });
										this.setState ({ start_rounding: data.option });
										return true;
									}}>

									<option value={Date.rounding.down}>Round down</option>
									<option value={Date.rounding.off}>Round off</option>
									<option value={Date.rounding.up}>Round up</option>
 
								</ToggleSwitch>
							</div>

							<label htmlFor="end_rounding">End time rounding</label>
							<div className="middle-right-container">
								<ToggleSwitch id="end_rounding" speed={Settings.animation_speed ()} value={this.state.end_rounding} singleStep={true}

									onChange={(data) => {
										this.setState ({ cc_form: (data.option > this.state.end_rounding) ? {
											option: option_types.end_rounding,
											value: Options.rounding (option_types.end_rounding)
										} : null });
										this.setState ({ end_rounding: data.option });
										return true;
									}}>

									<option value={Date.rounding.down}>Round down</option>
									<option value={Date.rounding.off}>Round off</option>
									<option value={Date.rounding.up}>Round up</option>

								</ToggleSwitch>
							</div>

						</Container>
					</ExplodingPanel>
				</div>

				{/* Date.minute_increments = [5, 6, 10, 12, 15, 20, 30] */}


			</div>
		);
	}// render;


}// SettingsPanel;
