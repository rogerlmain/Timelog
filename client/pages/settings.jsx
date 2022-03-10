import React from "react";

import Settings from "classes/storage/settings";
import Options from "classes/storage/options";

import BaseControl from "controls/base.control";
import ToggleSwitch from "controls/toggle.switch";
import Container from "controls/container";

import OptionsModel from "models/options";

import CreditCardForm from "pages/forms/credit.card.form";

import ExplodingPanel from "controls/panels/exploding.panel";

import { option_types, globals } from "types/globals";
import { resize_direction } from "controls/panels/resize.panel";

import "resources/styles/pages.css";


export default class SettingsPanel extends BaseControl {


	state = { 
		granularity: 1,
		start_rounding: 2,
		end_rounding: 2,
		cc_form_showing: false 
	}// state;


	componentDidMount () {
		this.setState ({ granularity: Options.granularity () });
	}// componentDidMount;


	render () {
		return (
			<div className="one-piece-form">

				<CreditCardForm showing={this.state.cc_form_showing} 
					onCancel={() => this.setState ({ granularity: Options.granularity () })}
					onSubmit={() => OptionsModel.save_option (option_types.granularity, this.state.granularity).then (data => {
						Options.set (JSON.stringify (data));
						this.setState ({ cc_form_showing: false });
					})}>
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
							this.setState ({ cc_form_showing: (data.option > this.state.granularity) });
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
						<Container condition={ Options.granularity () > 1 /*this.state.granularity > 1*/} className="one-piece-form" inline={true} style={{ justifySelf: "stretch" }}>

							<label htmlFor="start_rounding">Start time rounding</label>
							<div className="middle-right-container">
								<ToggleSwitch id="start_rounding" speed={Settings.animation_speed ()} value={this.state.start_rounding} singleStep={true}

									onChange={(data) => { 
										this.setState ({ cc_form_showing: (data.option > this.state.start_rounding) });
										this.setState ({ start_rounding: data.option });
										return true;
									}}>

									<option>Round down</option>
									<option>Round off</option>
									<option>Round up</option>

								</ToggleSwitch>
							</div>

							<label htmlFor="end_rounding">End time rounding</label>
							<div className="middle-right-container">
								<ToggleSwitch id="end_rounding" speed={Settings.animation_speed ()} value={this.state.end_rounding} singleStep={true}

									onChange={(data) => { 
										this.setState ({ cc_form_showing: (data.option > this.state.end_rounding) });
										this.setState ({ end_rounding: data.option });
										return true;
									}}>

									<option>Round down</option>
									<option>Round off</option>
									<option>Round up</option>

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
