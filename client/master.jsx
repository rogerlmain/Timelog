import * as common from "classes/common";

import React from "react";

import Companies from "classes/storage/companies";
import Options from "classes/storage/options";

import SelectButton from "controls/buttons/select.button";
import ExplodingPanel from "controls/panels/exploding.panel";

import HomePage from "pages/home";
import ClientsPage from "pages/clients";
import ProjectsPage from "pages/projects";
import LoggingPage from "pages/logging";
import ReportsPage from "pages/reports";

import AccountPage from "pages/sign.up";
import SettingsPage from "pages/settings";

import BaseControl from "controls/abstract/base.control";

import { globals } from "classes/types/constants";


const master_pages = { 
	home	: { name: "Home", permission: true }, 
	clients	: { name: "Clients", permission: () => { return Options.client_limit () > 1 } }, 
	projects: { name: "Projects", permission: () => { return Options.project_limit () > 1 } }, 
	logging	: { name: "Logging", permission: true }, 
	reports	: { name: "Reports", permission: true },
	account	: { name: "Account", permission: true }, 
	settings: { name: "Settings", permission: true }
}// master_pages;


export default class MasterPanel extends BaseControl {


	reference = React.createRef ();


	state = {
		eyecandy_visible: false,
		eyecandy_callback: null,
		page: master_pages.home.name
	}/* state */;


	static defaultProps = { 
		id: "master_page",
		parent: null
	}// defaultProps;


	constructor (props) {
		super (props);
		globals.master = this;
		this.state.page = master_pages.home.name;
	}// componentDidMount;


	buttons_disabled () {
		let company_list = Companies.company_list ();
		if (common.is_empty (company_list) || (company_list.length == 1)) return false;
		if (Companies.company_selected ()) return false;
		return true;
	}// buttons_disabled;


	button_list () {
		let result = null;
		for (let key in master_pages) {

			let name = `${key}_button`;
			let value = master_pages [key].name;

			if (!(common.is_function (master_pages [key].permission) ? master_pages [key].permission () : master_pages [key].permission)) continue;
			if (common.is_null (result)) result = [];

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
			case master_pages.clients.name: return <ClientsPage />;
			case master_pages.account.name: return <AccountPage parent={this.props.parent} />;
			case master_pages.projects.name: return <ProjectsPage />;
			case master_pages.logging.name: return <LoggingPage />;
			case master_pages.settings.name: return <SettingsPage />;
			case master_pages.reports.name: return <ReportsPage />;

			// case master_pages.team: return <TeamPanel />;
			// case master_pages.tasks: return <TasksPanel />;
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

	// test nulls
	common.notify (common.matching_objects (null, null), true);
	common.notify (common.matching_objects (null, undefined), true);
	common.notify (common.matching_objects (undefined, undefined), true);

	// test objects
	common.notify (common.matching_objects (null, { first: "one" }), false);
	common.notify (common.matching_objects (undefined, { first: "one" }), false);
	common.notify (common.matching_objects ({ first: "one" }, { first: "one" }), true);
	common.notify (common.matching_objects ({ first: "one" }, { first: "two" }), false);
	common.notify (common.matching_objects ({ first: "one" }, { second: "one" }), false);
	common.notify (common.matching_objects ({ first: "one" }, { second: "two" }), false);

	// test arrays
	common.notify (common.matching_objects (null, ["one"]), false);
	common.notify (common.matching_objects (undefined, ["one"]), false);
	common.notify (common.matching_objects (["one"], ["one"]), true);
	common.notify (common.matching_objects (["one"], ["two"]), false);
	common.notify (common.matching_objects (["one"], { first: "one" }), false);
	common.notify (common.matching_objects (["one"], { first: "two" }), false);
	common.notify (common.matching_objects (["one"], { second: "one" }), false);
	common.notify (common.matching_objects (["one"], { second: "two" }), false);

	// test arrays of objects
	common.notify (common.matching_objects (null, [{ first: "one" }]), false);
	common.notify (common.matching_objects (undefined, [{ first: "one" }]), false);
	common.notify (common.matching_objects ([{ first: "one" }], [{ first: "one" }]), true);
	common.notify (common.matching_objects ([{ first: "one" }], ["two"]), false);
	common.notify (common.matching_objects ([{ first: "one" }], { first: "one" }), false);
	common.notify (common.matching_objects ([{ first: "one" }], { first: "two" }), false);
	common.notify (common.matching_objects ([{ first: "one" }], { second: "one" }), false);
	common.notify (common.matching_objects ([{ first: "one" }], { second: "two" }), false);

	common.notify (common.matching_objects ([{ first: "one" }], [{ first: "one" }]), true);
	common.notify (common.matching_objects ([{ first: "one" }], [{ first: "two" }]), false);
	common.notify (common.matching_objects ([{ first: "one" }], [{ second: "one" }]), false);
	common.notify (common.matching_objects ([{ first: "one" }], [{ second: "two" }]), false);

}} style={{ 
	position: "absolute",
	right: "1em",
	top: "1em"
}}>TEST</SelectButton>


				</div>

				<div className="full-screen horizontally-center" style={{ marginTop: "1em" }}>
					<ExplodingPanel id="details_panel">{this.page_item ()}</ExplodingPanel>
				</div>

			</div>
		);
	}// render;

}// MasterPanel;
