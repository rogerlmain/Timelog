import * as React from "react";

import * as common from "components/classes/common";

import { menu_items } from "components/types/constants";

import { globals } from "components/types/globals";

import BaseControl, { defaultInterface } from "components/controls/base.control";
import SelectButton from "components/controls/select.button";
import FadeControl from "components/controls/fade.control";

import HomePanel from "components/panels/home";
import AccountPanel from "components/panels/sign.up";
import ProjectsPanel from "components/panels/projects";
import LoggingPanel from "components/panels/logging";
import TeamPanel from "components/panels/teams";
import SettingsPanel from "components/panels/settings";


class ButtonReference implements React.RefObject<SelectButton> { current: SelectButton }


export default class HomePage extends BaseControl<defaultInterface> {


	private button_list: ButtonReference [] = null;
	private selected_button: SelectButton = null;


	private panel_list = {
		home: <HomePanel />,
		account: <AccountPanel parent={this.props.parent} />,
		projects: <ProjectsPanel />,
		logging: <LoggingPanel />,
		team: <TeamPanel />,
		history: <div>placeholder for history</div>,
		tasks: <div>placeholder for tasks</div>
	}// panel_list;


	private load_panel = (content: any) => this.setState ({ contents: content });


	private add_button_reference = (button: ButtonReference) => {
		if (common.is_null (this.button_list)) this.button_list = [];
		this.button_list.push (button);
	}/* add_button_reference */;


	private select = (selected_button: SelectButton) => {
		for (let button of this.button_list) {
			if (button.current == selected_button) continue;
			button.current.setState ({ selected: false });
		}// for;
		this.selected_button = selected_button;
		this.setState ({ details_panel_visible: false });
	}/* select */;


	private settings_button () {
		return (<SelectButton id="settings_button" ref={this.create_reference} sticky={false} onclick={() => {

			globals.main_page.setState ({
				popup_contents: <SettingsPanel />,
				popup_visible: true
			});

		}}>Settings</SelectButton>)
	}/* settings_button */


	private signout_button () {

		let parent = this.props.parent;

		return (
			<SelectButton id="signout_button" ref={this.create_reference} sticky={false}
				onclick={() => {
					common.delete_cookie ("current_account");
					this.button_list.forEach (button => { button.current.setState ({ selected: false }) });
					this.load_panel (this.panel_list.home);
					this.selected_button = null;
					parent.load_panel (parent.panels.signin_panel);
				}}>Sign out
			</SelectButton>
		);
	}// signout_button;


	/********/


	public state = {

		button_list: null,
		buttons_loaded: false,

		details_panel_visible: true,
		contents: this.panel_list.home

	}// state;


	public componentDidMount () {
		this.setState ({ button_list: menu_items.map ((name: string, value: string) => {
			let reference: ButtonReference = React.createRef ();
			this.add_button_reference (reference);
			return (
				<SelectButton id={value} name={name} key={name} ref={reference}
					beforeClick={() => {
						this.select (reference.current)
					}}
					onClick={() => {
						this.setState ({ contents: this.panel_list.history })
					}}>{value}
				</SelectButton>
			);
		}) }, () => {
			this.setState ({ buttons_loaded: true });
		});
	}// componentDidMount;


	public render () {
		return (
			<div id="home_page_panel" className="full-screen">

				<link rel="stylesheet" href="resources/styles/home.page.css" />

				<FadeControl id="button_panel" ref={this.create_reference} className="home_button_panel" visible={this.state.buttons_loaded}>
					{this.state.button_list}
					{this.settings_button ()}
					{this.signout_button ()}
				</FadeControl>

				<FadeControl id="details_panel" ref={this.create_reference} visible={this.state.details_panel_visible}
					className="full-screen horizontal-centering-container" style={{ marginTop: "2em" }}
					afterHiding={() => {
						this.setState ({ contents: this.panel_list [this.selected_button.props.name] }, () => {
							this.setState ({ details_panel_visible: true });
						});
					}}>
					{this.state.contents}
				</FadeControl>

			</div>
		);
	}// render;

}// HomePage;

