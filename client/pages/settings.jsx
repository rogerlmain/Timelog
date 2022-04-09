import React from "react";

import Settings from "classes/storage/settings";

import Container from "controls/container";
import ExplodingPanel from "controls/panels/exploding.panel";
import BaseControl from "controls/abstract/base.control";
import ToggleSwitch from "controls/toggle.switch";

import DeluxeAccountForm from "pages/forms/deluxe.account.form";

import OptionsModel from "models/options";

import ToggleOption from "pages/gadgets/settings/toggle.option";

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
		client_limit: 0,
		project_limit: 0,
		cc_form: null 
	}/* state */;


	static defaultProps = { id: "settings_page" }


	constructor (props) {
		super (props);
		this.state = { ...this.state,
			granularity: Options.granularity () ?? this.state.granularity,
			start_rounding: Options.rounding (boundaries.start) ?? this.state.start_rounding,
			end_rounding: Options.rounding (boundaries.end) ?? this.state.end_rounding,
			client_limit: Options.client_limit () ?? this.state.client_limit,
			project_limit: Options.project_limit () ?? this.state.project_limit,
		};
	}// constructor;


	set_option (option, value) {
		return new Promise ((resolve, reject) => OptionsModel.save_option (option, value).then (response => {
			Options.set (option, value);
			this.setState ({ [option]: value }, resolve (response));
		}).catch (reject));
	}// set_option;


	deluxe_account_form () {
		return <DeluxeAccountForm visible={isset (this.state.cc_form)}

			onCancel={() => this.setState ({ [this.state.cc_form.option]: this.state.cc_form.previous }, () => this.setState ({ cc_form: null }))} 
			onSubmit={() => this.set_option (this.state.cc_form.option, this.state.cc_form.value).then (() => this.execute (this.state.cc_form.onSubmit).then (() => this.setState ({ cc_form: null })))}>

		</DeluxeAccountForm>
	}// deluxe_account_form;


	rounding_switch (rounding_end) {

		let label = `${rounding_end}_rounding`;
		let id = `${label}_switch`;
		let rounding = Options.rounding (rounding_end) ?? default_options.rounding;

		return <Container contentsOnly={true}>
			<label htmlFor={id}>{rounding_end.charAt (0).toUpperCase () + rounding_end.slice (1)} time rounding</label>
			<div className="right-justified-container">
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


	rounding_switches () {
		return <ExplodingPanel id="rounding_options_panel" direction={resize_direction.vertical} stretchOnly={true}>
			<Container id="rounding_options_container" condition={ Options.granularity () > 1} 
				className="one-piece-form with-headspace" inline={true}>

				{this.rounding_switch (boundaries.start)}
				{this.rounding_switch (boundaries.end)}

			</Container>
		</ExplodingPanel>
	}// rounding_switches;


	client_limit_switch () {
		return <Container contentsOnly={true}>
			<label htmlFor="client_limit_setting">Number of clients</label>
			<div className="right-justified-container">
				<ToggleSwitch id="client_limit" value={this.state.client_limit - 1} singleStep={true}

					onChange={(data) => { 

						let client_limit = Options.client_limit ();

						this.state.client_limit = data.option + 1;

						if (this.state.client_limit > client_limit) {
							this.setState ({ 
								cc_form: { 
									option: option_types.client_limit, 
									previous: client_limit,
									value: this.state.client_limit
								}/* cc_form */
							});
							return true;
						}// if;

						this.set_option (option_types.client_limit, this.state.client_limit);

					}}>

					<option>0</option>
					<option>5</option>
					<option>10</option>
					<option>50</option>
					<option>Unlimited</option>

				</ToggleSwitch>
			</div>
		</Container>
	}// client_limit_switch;


	project_limit_switch () {
		return <Container contentsOnly={true}>
			<label htmlFor="project_limit_setting">Number of projects</label>
			<div className="right-justified-container">
				<ToggleSwitch id="granularity" value={this.state.project_limit - 1} singleStep={true}

					onChange={(data) => { 

						let project_limit = Options.project_limit ();

						this.state.project_limit = data.option + 1;

						if (this.state.project_limit > project_limit) {
							this.setState ({ 
								cc_form: { 
									option: option_types.project_limit, 
									previous: project_limit,
									value: this.state.project_limit
								}/* cc_form */
							});
							return true;
						}// if;

						this.set_option (option_types.project_limit, this.state.project_limit);

					}}>

					<option>0</option>
					<option>5</option>
					<option>10</option>
					<option>50</option>
					<option>Unlimited</option>

				</ToggleSwitch>
			</div>
		</Container>
	}// project_limit_switch;


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
		return <Container>
			<div id={this.props.id} className="one-piece-form">

				{this.deluxe_account_form ()}

				<div className="full-row section-header">User Settings</div>

				<label htmlFor="animation_speed">Animation Speed</label>
				<input type="text" id="animation_speed" defaultValue={Settings.animation_speed ()} style={{ textAlign: "right" }}
					onChange={(event) => {
						globals.set_setting ("animation_speed", parseInt (event.target.value));
						globals.master_panel.forceUpdate ();
					}}>
				</input>

				<div className="full-row section-header">Account Options</div>

			</div>

			<br />

			<div className=" with-headspace two-column-newspaper">
				<div>
					<ToggleOption id="granularity" values={["1 Hr", "15 Mins", "1 Min", "Truetime"]} value={this.state.granularity}
						option={option_types.granularity} parent={this} 
						onPaymentConfirmed={option => this.setState ({
							start_rounding: date_rounding.off,
							end_rounding: date_rounding.off,
							value: option
						})}>
					</ToggleOption>
{/*
					{/* Date.minute_increments = [5, 6, 10, 12, 15, 20, 30] * /}
					{this.rounding_switches ()}
				</div>
				<div>
					<div className="one-piece-form" >
						{this.client_limit_switch ()}
						{this.project_limit_switch ()}
					</div>
*/}
				</div>
			</div>

		</Container>
	}// render;


}// SettingsPage;
