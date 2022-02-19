import "pages/initialize";

import * as common from "classes/common";

import React from "react";

import SelectButton from "controls/buttons/select.button";

import HomePage from "pages/home";
import ClientsPage from "pages/clients";
import ProjectsPage from "pages/projects";
import LoggingPage from "pages/logging";

import AccountPanel from "pages/sign.up";
import TeamPanel from "pages/teams";
import TasksPanel from "pages/tasks";
import SettingsPanel from "pages/settings";

import FadePanel from "controls/panels/fade.panel";

import BaseControl, { DefaultProps } from "controls/base.control";

import { menu_items } from "types/constants";
import { globals } from "types/globals";
import ExplodingPanel from "./controls/panels/exploding.panel";



class ButtonReference implements React.RefObject<SelectButton> { current: SelectButton }


interface masterState {

	button_list: Array<SelectButton>;
	buttons_loaded: boolean;

	eyecandy_visible: boolean;
	eyecandy_callback: Function;

	contents: any;
	contents_loaded: boolean;

}// state;


export default class MasterPanel extends BaseControl<DefaultProps, masterState> {

	private button_list: ButtonReference [] = null;
	private reflist: Array<React.RefObject<any>> = null; // overrides deprecated basecontrol references


	private panel_list = {
		home: <HomePage ref={this.create_reference ("home")} />,
		clients: <ClientsPage ref={this.create_reference ("clients")} />,
		account: <AccountPanel ref={this.create_reference ("account")} parent={this.props.parent} />,
		projects: <ProjectsPage ref={this.create_reference ("projects")} />,
		team: <TeamPanel ref={this.create_reference ("team")} />,
		tasks: <TasksPanel ref={this.create_reference ("tasks")} />,
		logging: <LoggingPage ref={this.create_reference ("logging")} />,
		history: <div ref={this.create_reference ("history")} onLoad={() => { globals.master_panel.setState ({ eyecandy_visible: false }) }}>placeholder for history</div>
	}// panel_list;


	// Make private when deprecated parent function removed
	protected create_reference (name: string): React.RefObject<any> {
		if (common.is_null (this.reflist)) this.reflist = [];
		if (common.isset (this.reflist [name])) return this.reflist [name];
		let ref = React.createRef ();
		this.reflist [name] = ref;
		return ref;
	}// create_reference;


	private get_button_list () {

		let update_reference = (name: string) => {
			if (common.isset (this.reflist [name].current)) {
				return this.reflist [name].current.forceUpdate ();
			}// if;
			setTimeout (() => update_reference (name));
		}// update_reference;


		return menu_items.map ((name: string, value: string) => {
			let reference: ButtonReference = React.createRef ();
			this.add_button_reference (reference);
			return (
				<SelectButton id={value} name={name} key={name} ref={reference} sticky={true}
					beforeClick={() => { 
						this.state.contents_loaded = false;
						this.select_button (reference.current); 
					}}
					onClick={() => {
						this.setState ({ contents: this.panel_list [name] }, () => {
							this.setState ({ contents_loaded: true }, () => update_reference (name));
						});
					}}>
					{value}
				</SelectButton>
			);
		});

	}// get_button_list;


	private add_button_reference (button: ButtonReference) {
		if (common.is_null (this.button_list)) this.button_list = [];
		this.button_list.push (button);
	}/* add_button_reference */;


	private select_button (selected_button: SelectButton) {
		for (let button of this.button_list) {
			if (button.current == selected_button) continue;
			button.current.setState ({ selected: false });
		}// for;
		this.setState ({ content_loaded: false });
	}/* select_button */;


	private settings_button () {
		return (<SelectButton sticky={false} onClick={() => {
			globals.master_panel.setState ({
				popup_contents: <SettingsPanel />,
				popup_visible: true
			});
		}}>Settings</SelectButton>)
	}/* settings_button */


	private signout_button () {
		return (
			<SelectButton sticky={false}
				onClick={() => {
					common.delete_cookie ("current_account");
					globals.main.forceUpdate ();
				}}>
				Sign out
			</SelectButton>
		);
	}// signout_button;


	/********/


	public state: masterState;


	public componentDidMount () {
		this.setState ({
			buttons_loaded: false,
			contents_loaded: false,
			eyecandy_visible: false,

			eyecandy_callback: null,
			
			button_list: this.get_button_list (),
			contents: this.panel_list.home
		});
		globals.master_panel = this;
	}// componentDidMount;


	public render () {
		return (
			<div id="home_page_panel" className="full-screen">

				<link rel="stylesheet" href="resources/styles/home.page.css" />

				<div className="home_button_panel">
					{this.state.button_list}
					{this.settings_button ()}
					{this.signout_button ()}

<br /><br />
<SelectButton onClick={() => {
	alert ("setting contents");
	this.setState ({ contents: <div>New Content</div>});
}}>TEST</SelectButton>

				</div>

				<div className="full-screen horizontal-centering-container overlay-container" style={{ 
					
						marginTop: "1em",
						border: "solid 1px blue"

					}}>

					{/* <FadePanel id="details_panel" visible={this.state.contents_loaded} className="full-screen">{this.state.contents}</FadePanel> */}

					<ExplodingPanel id="details_panel" className="full-screen">{this.state.contents}</ExplodingPanel>

				</div>

			</div>
		);
	}// render;

}// MasterPanel;

