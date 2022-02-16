import * as common from "client/classes/common";

import { menu_items } from "client/types/constants";

import { globals } from "client/types/globals";

import React from "react";

import BaseControl, { DefaultProps } from "controls/base.control";
import SelectButton from "client/controls/select.button";
import FadeControl from "client/controls/fade.control";

import HomePanel from "client/panels/home";
import AccountPanel from "client/panels/sign.up";
import ProjectsPanel from "client/panels/projects";
import TeamPanel from "client/panels/teams";
import TasksPanel from "client/panels/tasks";
import LoggingPanel from "client/panels/logging";
import SettingsPanel from "client/panels/settings";
import Eyecandy from "./controls/eyecandy";


class ButtonReference implements React.RefObject<SelectButton> { current: SelectButton }


export default class HomePage extends BaseControl<DefaultProps> {


	private button_list: ButtonReference [] = null;
	private selected_button: SelectButton = null;


	private panel_list = {
		home: <HomePanel />,
		account: <AccountPanel parent={this.props.parent} />,
		projects: <ProjectsPanel />,
		team: <TeamPanel />,
		tasks: <TasksPanel />,
		logging: <LoggingPanel />,
		history: <div onLoad={() => { globals.home_page.setState ({ eyecandy_visible: false }) }}>placeholder for history</div>
	}// panel_list;


	private load_panel = (content: any) => {

		this.setState ({ contents: content });

	}// load_panel;


	private add_button_reference = (button: ButtonReference) => {
		if (common.is_null (this.button_list)) this.button_list = [];
		this.button_list.push (button);
	}/* add_button_reference */;


	private select_button = (selected_button: SelectButton) => {
		for (let button of this.button_list) {
			if (button.current == selected_button) continue;
			button.current.setState ({ selected: false });
		}// for;
		this.selected_button = selected_button;
		this.setState ({ content_loaded: false });
	}/* select_button */;


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

		content_loaded: false,

		button_list: null,
		buttons_loaded: false,

		eyecandy_visible: false,
		eyecandy_callback: null,

		contents: this.panel_list.home

	}// state;


	public constructor (props) {
		super (props);
		globals.home_page = this;
	}// constructor;


	public componentDidMount () {
		this.setState ({ button_list: menu_items.map ((name: string, value: string) => {
			let reference: ButtonReference = React.createRef ();
			this.add_button_reference (reference);
			return (
				<SelectButton id={value} name={name} key={name} ref={reference} sticky={true}
					beforeClick={() => { this.select_button (reference.current) }}>
					{value}
				</SelectButton>
			);
		}) }, () => {
			setTimeout (() => this.setState ({ buttons_loaded: true }));
		});
	}// componentDidMount;


	public render () {
		return (
			<div id="home_page_panel" className="full-screen">

				<link rel="stylesheet" href="resources/styles/home.page.css" />

				<div className="home_button_panel">
					{this.state.button_list}
					{this.settings_button ()}
					{this.signout_button ()}
				</div>

				<div className="full-screen horizontal-centering-container overlay-container" style={{ marginTop: "2em" }}>

					<Eyecandy id="home_eyecandy" visible={this.state.eyecandy_visible} text="Loading..." className="top-center-container"
						afterShowing={() => {
							this.setState ({ contents: this.panel_list [this.selected_button.props.name] });
						}}
						afterHiding={() => { this.setState ({ content_loaded: true })}}>
					</Eyecandy>


					<FadeControl id="details_panel" ref={this.create_reference} visible={this.state.content_loaded}
						className="full-screen top-center-container"
						beforeShowing={() => {
							globals.main_page.setState ({ content_loaded: true })
						}}
						afterHiding={() => { this.setState ({ eyecandy_visible: true }) }}>
						{this.state.contents}
					</FadeControl>

				</div>

			</div>
		);
	}// render;

}// HomePage;

