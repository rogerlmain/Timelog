import React from "react";

import Companies from "classes/storage/companies";

import SelectButton from "controls/buttons/select.button";

import HomePage from "pages/home";
import ClientsPage from "pages/clients";
import ProjectsPage from "pages/projects";
import LoggingPage from "pages/logging";
import ReportsPage from "pages/reports";

import AccountPage from "pages/sign.up";
import SettingsPage from "pages/settings";
import ExplodingPanel from "./controls/panels/exploding.panel";

import BaseControl from "controls/abstract/base.control";

import { globals } from "classes/types/constants";
import { is_empty, is_null, not_set } from "classes/common";


const master_pages = { 
	home: "Home", 
	clients: "Clients", 
	projects: "Projects", 
	logging: "Logging", 
	reports: "Reports",
	account: "Account", 
	settings: "Settings"
}// master_pages;


export default class MasterPanel extends BaseControl {


	reference = React.createRef ();


	state = {
		eyecandy_visible: false,
		eyecandy_callback: null,
		page: master_pages.home
	}/* state */;


	static defaultProps = { 
		id: "master_page",
		companyId: null,
		parent: null
	}// defaultProps;


	constructor (props) {
		super (props);
		globals.master = this;
		this.state.page = master_pages.home;
	}// componentDidMount;


	buttons_disabled () {
		let company_list = Companies.list ();
		if (is_empty (company_list) || (company_list.length == 1)) return false;
		if (Companies.company_selected ()) return false;
		return true;
	}// buttons_disabled;


	button_list () {
		let result = null;
		for (let key in master_pages) {
			let name = `${key}_button`;
			let value = master_pages [key];
			if (is_null (result)) result = [];

			// TO DO - ADD A "GROUP" OPTION FOR SINGLE STICKY BUTTON OUT OF A BUTTON LIST/GROUP (when needed)
			result.push (<SelectButton id={name} name={name} key={name} sticky={false}
				disabled={this.buttons_disabled ()}
				onClick={() => this.setState ({ page: value })}>

				{value}

			</SelectButton>);
		}// for;
		return result;
	}// button_list;


	page_item () {
		switch (this.state.page) {
			case master_pages.clients: return <ClientsPage />;
			case master_pages.account: return <AccountPage parent={this.props.parent} />;
			case master_pages.projects: return <ProjectsPage />;
			// case master_pages.team: return <TeamPanel />;
			// case master_pages.tasks: return <TasksPanel />;
			case master_pages.logging: return <LoggingPage />;
			case master_pages.settings: return <SettingsPage companyId={this.props.companyId} />;
			case master_pages.reports: return <ReportsPage />;
			// case master_pages.history: return <div>Placeholder for History</div>;
			default: return <HomePage parent={this} />;
		}// switch;
	}// page_item;


	signout_button () {
		return (
			<SelectButton sticky={false}
				onClick={() => {
					localStorage.clear ();
					globals.main.forceUpdate ();
				}}>
				Sign out
			</SelectButton>
		);
	}// signout_button;


	render () {
		return (
			<div ref={this.reference} id={this.props.id} className="full-screen">

				<link rel="stylesheet" href="client/resources/styles/home.page.css" />

				<div className="home_button_panel">

					{this.button_list ()}
					{this.signout_button ()}

					<SelectButton onClick={() => {
					//	alert ("waiting for something to test")

						this.forceRefresh ();


					}} style={{ 
						position: "absolute",
						right: "1em",
						top: "1em"
					}}>TEST</SelectButton>

				</div>

				<div className="full-screen horizontal-centering-container" style={{ marginTop: "1em" }}>
					<ExplodingPanel id="details_panel">{this.page_item ()}</ExplodingPanel>
				</div>

			</div>
		);
	}// render;

}// MasterPanel;
