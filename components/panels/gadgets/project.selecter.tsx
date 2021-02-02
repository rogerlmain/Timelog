import React from "react";

import * as common from "components/classes/common";

import BaseControl, { defaultInterface } from "components/controls/base.control";
import FadeControl from "components/controls/fade.control";
import { globals } from "components/types/globals";
import { Database } from "components/classes/database";


interface projectsPanelInterface extends defaultInterface {
	onLoad: any,
	onClientChange: any,
	onProjectChange: any
}// projectsPanelInterface;


export default class ProjectSelecter extends BaseControl<projectsPanelInterface> {


	private id = null;

	private client_selecter_id = null;
	private project_selecter_id = null;


	private load_clients () {

		// TEMPORARY - TRANSPLANT TO projects MODEL CLASS
		new Database ().fetch_items ("clients", { action: "client_list" }, (data: any) => {
			this.setState ({ clients: data });
		});

	}// load_clients;


	private load_projects () {
		let parameters = new FormData ();
		parameters.set ("action", "list");
		parameters.set ("client_id", this.reference (this.client_selecter_id).value);

		// TEMPORARY - TRANSPLANT TO projects MODEL CLASS
		new Database ().fetch_items ("projects", parameters, (data: any) => {
			this.setState ({ projects: data }, () => {
				this.setState ({ client_selected: true });
				this.reference (this.project_selecter_id).disabled = false;
			});
		});

	}// load_projects;


	private client_change_handler () {

		this.execute_event (this.props.onClientChange);

		this.reference (this.project_selecter_id).disabled = true;

		if (common.is_null (this.state.projects)) {
			this.load_projects ();
			return;
		}// if;

		this.setState ({
			client_selected: false,
			client_changed: () => {
				this.reference (this.project_selecter_id).selectedIndex = 0;
				this.setState ({ projects: null }, () => {
					this.load_projects ();
				});
			}// client_changed;
		});

	}// client_change_handler;


	private client_selecter () {

		return (
			<div style={{ display: "contents" }}>
				<div className="middle-right-container">
					<label htmlFor={this.client_selecter_id}>Client</label>
				</div>
				<select id={this.client_selecter_id} ref={this.create_reference} name="client_id" defaultValue="placeholder"

					onChange={this.client_change_handler.bind (this)}>

					<option value="placeholder" key="placeholder" disabled={true} />

					{this.select_options (this.state.clients, "client_id", "name")}

				</select>
			</div>
		);
	}// client_selecter;


	private project_selecter () {
		return (
			<div id="project_list" style={{ display: "contents" }}>

				<FadeControl visible={this.state.client_selected} className="middle-right-container" vanishing={true}>
					<label htmlFor={this.project_selecter_id}>Project</label>
				</FadeControl>

				<FadeControl visible={this.state.client_selected} vanishing={true} afterHiding={this.state.client_changed}>

					<select id={this.project_selecter_id} ref={this.create_reference} name="project_id" className="form-item"
						defaultValue="placeholder" style={{ margin: 0 }}

						onChange={(event) => { this.execute_event (this.props.onProjectChange, event) }}>

						<option key="placeholder" value="placeholder" disabled={true} />
						{this.select_options (this.state.projects, "project_id", "project_name")}

					</select>

				</FadeControl>

			</div>
		);
	}// project_selecter;


	/********/


	public state = {

		clients: null,
		projects: null,

		client_changed: null,

		clients_loaded: false,
		client_selected: false,

		projects_loaded: false,
		project_selected: false,

	}// state;


	public componentDidMount () {
		this.load_clients ();
	}// componentDidMount;


	public render () {
		return (
			<form id={this.id}>

				<div className="two-piece-form" style={{ overflow: "hidden" }}>

					{this.client_selecter ()}
					{this.project_selecter ()}

				</div>

			</form>
		);
	}// render;


	public constructor (props: any) {
		super (props);
		this.id = this.id_badge (props.id);
		this.client_selecter_id = `${this.id}_client_selecter`;
		this.project_selecter_id = `${this.id}_project_selecter`;
	}// constructor;


}// ProjectSelecter