import * as constants from "classes/types/constants";
import * as common from "classes/common";

import React from "react";

import Settings from "classes/storage/settings";
import Options from "classes/storage/options";

import BaseControl from "controls/abstract/base.control";
import Container from "controls/container";
import ExplodingPanel from "controls/panels/exploding.panel";
import Slider from "controls/slider";

import DeluxeAccountForm from "pages/forms/deluxe.account.form";

import SettingsModel from "models/settings";
import OptionsModel from "models/options";

import ToggleOption from "pages/gadgets/settings/toggle.option";

import { MainContext } from "classes/types/contexts";
import { resize_direction } from "controls/panels/resize.panel";

import "client/resources/styles/pages.css";


export default class SettingsPage extends BaseControl {


	state = { 
		company_id: null,
		granularity: 1,
		start_rounding: constants.date_rounding.off,
		end_rounding: constants.date_rounding.off,
		client_limit: 1,
		project_limit: 1,
		cc_form: null 
	}/* state */;


	static contextType = MainContext;
	static defaultProps = { id: "settings_page" }


	/********/


	set_option (option, value) {
		return new Promise ((resolve, reject) => OptionsModel.save_option (option, value).then (response => {
			Options.set (option, value);
			this.setState ({ [option]: value }, resolve (response));
		}).catch (reject));
	}// set_option;


	deluxe_account_form () {
		return <DeluxeAccountForm visible={common.isset (this.state.cc_form)}
			onCancel={() => this.execute (this.state.cc_form.onCancel).then (() => this.setState ({ cc_form: null }))} 
			onSubmit={() => this.execute (this.state.cc_form.onSubmit).then (() => this.setState ({ cc_form: null }))}>
		</DeluxeAccountForm>
	}// deluxe_account_form;


	rounding_switches () {
		return <ExplodingPanel id="rounding_options_panel" direction={resize_direction.vertical} stretchOnly={true}>
			<Container id="rounding_options_container" condition={ this.state.granularity > 1} 
				className="one-piece-form with-headspace" inline={true} contentsOnly={false}>

				<ToggleOption id="start_time_rounding" title="Start time rounding"
					values={["Round down", "Round off", "Round up"]} value={this.state.start_rounding + 2}
					option={constants.option_types.start_rounding} parent={this} billable={false}
					onChange={selected_value => this.set_option (constants.option_types.start_rounding, selected_value - 1)}>
				</ToggleOption>					

				<ToggleOption id="end_time_rounding" title="End time rounding"
					values={["Round down", "Round off", "Round up"]} value={this.state.end_rounding + 2}
					option={constants.option_types.end_rounding} parent={this} billable={false}
					onChange={selected_value => this.set_option (constants.option_types.end_rounding, selected_value - 2)}>
				</ToggleOption>					

			</Container>
		</ExplodingPanel>
	}// rounding_switches;


	update_state () {

		let options = Options.get_options (this.state.company_id);
		
		let option_value = option => { 
			if (common.isset (options) && common.isset (options [option])) return parseInt (options [option]);
			return constants.default_options [common.get_key (constants.option_types, option)];
		}// option_value;

		this.setState ({
			granularity: option_value (constants.option_types.granularity),
			start_rounding: option_value (constants.option_types.start_rounding),
			end_rounding:  option_value (constants.option_types.end_rounding),
			client_limit:  option_value (constants.option_types.client_limit),
			project_limit: option_value (constants.option_types.project_limit)
		});

	}// update_state;


	/********/


	componentDidMount () {
		if (this.state.company_id != this.context.company_id) return this.setState ({ company_id: this.context.company_id }, this.update_state);
	}// componentDidMount;

	
	componentDidUpdate () { this.componentDidMount () };

	
	render () {

		return <Container>

			{this.deluxe_account_form ()}

<div style={{ border: "solid 1px blue" }}>
	{common.isset (this.context) ? (common.isset (this.context.company_id) ? this.context.company_id : "none") : "none"}<br />
	{this.state.granularity}
</div>

			<div id={this.props.id}>

				<div className="full-row section-header">User Settings</div>

				<div className="one-piece-form">
					<label>Animation Speed</label>
					<Slider id="animation_speed" min={0} max={5000} width={"100%"} value={Settings.animation_speed ()} onChange={value => {
						SettingsModel.save_setting (constants.setting_types.animation_speed, value);
						Settings.animation_speed (value);
						this.forceUpdate ();
					}} showValue={true} />
				</div>

				<div className="full-row section-header">Account Options</div>

			</div>

			<br />

			<div className=" with-headspace two-column-newspaper">

				<div className="right-justified-column">

					<div className="one-piece-form" style={{ display: "inline-grid" }}>

						<ToggleOption id="granularity" title="Granularity" values={["1 Hr", "15 Mins", "1 Min", "Truetime"]} value={this.state.granularity}
							option={constants.option_types.granularity} parent={this} 
							onPaymentConfirmed={selected_option => {
								this.set_option (constants.option_types.granularity, selected_option).then (() => this.setState ({
									start_rounding: constants.date_rounding.off,
									end_rounding: constants.date_rounding.off,
									value: selected_option
								}, this.context.main_page.forceRefresh));
							}}>
						</ToggleOption>

					</div>

					{/* Date.minute_increments = [5, 6, 10, 12, 15, 20, 30] */}

					{this.rounding_switches ()}

				</div>

				<div>
					<div className="one-piece-form" >

						<ToggleOption id="client_limit" title="Number of clients" values={["1", "5", "10", "50", "Unlimited"]} value={this.state.client_limit}
							option={constants.option_types.client_limit} parent={this} 
							onPaymentConfirmed={selected_option => {
								this.set_option (constants.option_types.client_limit, selected_option).then (() => this.setState ({ client_limit: selected_option }, this.context.main_page.forceRefresh));
							}}>
						</ToggleOption>

						<ToggleOption id="project_limit" title="Number of projects" values={["1", "5", "10", "50", "Unlimited"]} value={this.state.project_limit}
							option={constants.option_types.project_limit} parent={this} 
							onPaymentConfirmed={selected_option => {
								this.set_option (constants.option_types.project_limit, selected_option).then (() => this.setState ({ project_limit: selected_option }, this.context.main_page.forceRefresh));
							}}>
						</ToggleOption>

					</div>
				</div>

			</div>

		</Container>

	}// render;


}// SettingsPage;
