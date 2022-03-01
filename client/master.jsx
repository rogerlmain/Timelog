import React from "react";

import SelectButton from "controls/buttons/select.button";

import HomePage from "pages/home";
import ClientsPage from "pages/clients";
import ProjectsPage from "pages/projects";
import LoggingPage from "pages/logging";
import ReportsPage from "pages/reports";

import AccountPanel from "pages/sign.up";
import SettingsPanel from "pages/settings";
import ExplodingPanel from "./controls/panels/exploding.panel";

import BaseControl from "controls/base.control";

import { globals } from "types/globals";
import { delete_cookie, is_null } from "classes/common";


const master_pages = { 
	home: "Home", 
	clients: "Clients", 
	account: "Account", 
	projects: "Projects", 
	logging: "Logging", 
	settings: "Settings",
	reports: "Reports"
}// master_pages;


export default class MasterPanel extends BaseControl {


	/********/


	state = {
		eyecandy_visible: false,
		eyecandy_callback: null,
		page: master_pages.home
	};


	constructor (props) {
		super (props);
		this.state.page = master_pages.home;
	}// componentDidMount;


	button_list () {
		let result = null;
		for (let key in master_pages) {
			let name = `${key}_button`;
			let value = master_pages [key];
			if (is_null (result)) result = [];
			result.push (<SelectButton id={name} name={name} key={name} sticky={false}
				onClick={() => this.setState ({ page: value })}>
				{value}
			</SelectButton>);
		}// for;
		return result;
	}// button_list;


	page_list () {
		switch (this.state.page) {
			case master_pages.clients: return <ClientsPage />;
			case master_pages.account: return <AccountPanel parent={this.props.parent} />;
			case master_pages.projects: return <ProjectsPage />;
			// case master_pages.team: return <TeamPanel />;
			// case master_pages.tasks: return <TasksPanel />;
			case master_pages.logging: return <LoggingPage />;
			case master_pages.settings: return <SettingsPanel />;
			case master_pages.reports: return <ReportsPage />;
			// case master_pages.history: return <div>Placeholder for History</div>;
			default: return <HomePage />;
		}// switch;
	}// page_list;


	signout_button () {
		return (
			<SelectButton sticky={false}
				onClick={() => {
					delete_cookie ("current_account");
					globals.main.forceUpdate ();
				}}>
				Sign out
			</SelectButton>
		);
	}// signout_button;


	render () {
		return (
			<div id="home_page_panel" className="full-screen">

				<link rel="stylesheet" href="resources/styles/home.page.css" />

				<div className="home_button_panel">

					{this.button_list ()}
					{this.signout_button ()}

					<br /><br />
					<SelectButton onClick={() => {
						alert ("setting contents");
						this.setState ({ contents: <div>New Content</div>});
					}}>TEST</SelectButton>

				</div>

				<div className="full-screen horizontal-centering-container" style={{ marginTop: "1em" }}>
					<ExplodingPanel id="details_panel">{this.page_list ()}</ExplodingPanel>
				</div>

			</div>
		);
	}// render;

}// MasterPanel;
