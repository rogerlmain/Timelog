import React from "react";

import * as common from "components/classes/common";

import BaseControl, { defaultInterface } from "components/controls/base.control";
import FadeControl from "components/controls/fade.control";
import { text_highlights } from "components/types/constants";


interface projectsPanelInterface extends defaultInterface {
	onClientChange: any,
	onProjectChange: any
}// projectsPanelInterface;


export default class ProjectSelecter extends BaseControl<any> {


	private load_projects () {
		let parameters = new FormData ();
		parameters.set ("action", "project_list");
		parameters.set ("client_id", this.reference ("client_selecter").value);

		this.fetch_items ("projects", parameters, (data: any) => {
			this.setState ({ projects: data }, () => {
				this.setState ({ client_selected: true });
				this.reference ("project_selecter").disabled = false;
			});
		});
	}// load_projects;


	private client_change_handler (event: any) {

		this.execute_event (this.props.onClientChange);

		this.reference ("project_selecter").disabled = true;

		if (common.is_null (this.state.projects)) {
			this.load_projects ();
			return;
		}// if;

		this.setState ({
			client_selected: false,
			client_changed: () => {
				this.reference ("project_selecter").selectedIndex = 0;
				this.setState ({ projects: null }, () => {
					this.load_projects ();
				});
			}// client_changed;
		});

	}// client_change_handler;


	private client_selecter () {
		return (
			<div style={{ display: "contents" }}>
				<div className="center-right-container">
					<label htmlFor="client_selecter">Client</label>
				</div>
				<select id="client_selecter" ref={this.create_reference} name="client_id" defaultValue="placeholder"

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

				<FadeControl visible={this.state.client_selected} className="center-right-container" vanishing={true}>
					<label htmlFor="project_selecter">Project</label>
				</FadeControl>

				<FadeControl visible={this.state.client_selected} vanishing={true} afterHiding={this.state.client_changed}>

					<select id="project_selecter" ref={this.create_reference} name="project_id" className="form-item"
						defaultValue="placeholder" style={{ margin: 0 }}

						onChange={() => { this.execute_event (this.props.onProjectChange) }}>

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

		client_selected: false

	}// state;


	public componentDidMount () {
		this.fetch_items ("clients", { action: "client_list" }, (data: any) => {
			this.setState ({ clients: data });
			this.forceUpdate ();
		});
	}// componentDidMount;


	public render () {
		return (
			<div id="projects_panel">

				<div id="project_form" className="two-piece-form" style={{ overflow: "hidden" }}>

					{this.client_selecter ()}
					{this.project_selecter ()}

				</div>

			</div>
		);
	}// render;

}// ProjectSelecter