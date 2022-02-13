import React from "react";

import * as common from "client/classes/common";

import Database from "client/classes/database";
import BaseControl, { DefaultProps } from "client/controls/base.control";
import FadeControl from "client/controls/fade.control";


interface projectsPanelInterface extends DefaultProps {
	onLoad: any,
	onClientChange: any,
	onProjectChange: any
}// projectsPanelInterface;


export default class ProjectSelectorGadget extends BaseControl<projectsPanelInterface> {


	private id = null;

	private client_selector_id = null;
	private project_selector_id = null;


	private load_clients () {
		Database.fetch_rows ("clients", { action: "list" }, (data: any) => {
			this.setState ({ clients: data }, () => {
				this.setState ({ clients_loaded: true });
				this.execute_event (this.props.onLoad);
			});
		});
	}// load_clients;


	private load_projects () {
		let parameters = new FormData ();
		parameters.set ("action", "list");
		parameters.set ("client_id", this.reference (this.client_selector_id).value);

		// TEMPORARY - TRANSPLANT TO projects MODEL CLASS
		Database.fetch_rows ("projects", parameters, (data: any) => {
			this.setState ({ projects: data }, () => {
				this.setState ({ client_selected: true });
				this.reference (this.project_selector_id).disabled = false;
			});
		});

	}// load_projects;


	private client_change_handler () {

		this.execute_event (this.props.onClientChange);

		this.reference (this.project_selector_id).disabled = true;

		if (common.is_null (this.state.projects)) {
			this.load_projects ();
			return;
		}// if;

		this.setState ({
			client_selected: false,
			client_changed: () => {
				this.reference (this.project_selector_id).selectedIndex = 0;
				this.setState ({ projects: null }, () => {
					this.load_projects ();
				});
			}// client_changed;
		});

	}// client_change_handler;


	private client_selector () {

		return (
			<div style={{ display: "contents" }}>
				<div className="middle-right-container">
					<label htmlFor={this.client_selector_id}>Client</label>
				</div>
				<select id={this.client_selector_id} ref={this.create_reference} name="client_id" defaultValue="placeholder"

					onChange={this.client_change_handler.bind (this)}>

					<option value="placeholder" key="placeholder" disabled={true} />

					{this.select_options (this.state.clients, "client_id", "name")}

				</select>
			</div>
		);
	}// client_selector;


	private project_selector () {
		return (
			<div id="project_list" style={{ display: "contents" }}>

				<FadeControl visible={this.state.client_selected} className="middle-right-container" vanishing={true}>
					<label htmlFor={this.project_selector_id}>Project</label>
				</FadeControl>

				<FadeControl visible={this.state.client_selected} vanishing={true} afterHiding={this.state.client_changed}>

					<select id={this.project_selector_id} ref={this.create_reference} name="project_id" className="form-item"
						defaultValue="placeholder" style={{ margin: 0 }}

						onChange={(event) => {
							let selected_project = this.state.projects.find ((item: any) => { return item.project_id == parseInt (event.target.value) });
							this.execute_event (this.props.onProjectChange, event);
							this.setState ({ current_project: selected_project });
						}}>

						<option key="placeholder" value="placeholder" disabled={true} />
						{this.select_options (this.state.projects, "project_id", "project_name")}

					</select>

				</FadeControl>

			</div>
		);
	}// project_selector;


	/********/


	public state = {

		clients: null,
		projects: null,

		client_changed: null,

		clients_loaded: false,
		client_selected: false,

		projects_loaded: false,
		project_selected: false,

		current_project: null

	}// state;


	public componentDidMount () {
		this.load_clients ();
	}// componentDidMount;


	public render () {
		return (
			<form id={this.id}>

				<div className="two-piece-form" style={{ overflow: "hidden", alignItems: "flex-start" }}>

					{this.client_selector ()}
					{this.project_selector ()}

				</div>

			</form>
		);
	}// render;


	public constructor (props: any) {
		super (props);
		this.id = this.id_badge (props.id);
		this.client_selector_id = `${this.id}_client_selector`;
		this.project_selector_id = `${this.id}_project_selector`;
	}// constructor;


}// ProjectSelectorGadget;