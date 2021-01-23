import React from "react";

import BaseControl from "components/controls/base.control";
import FadeControl from "components/controls/fade.control";


export default class ProjectSelecter extends BaseControl<any> {

	private client_selecter () {
		return (
			<div style={{ display: "contents" }}>
				<div className="center-right-container">
					<label htmlFor="client_selecter">Client</label>
				</div>
				<select id="client_selecter" name="client_id" defaultValue="placeholder"

					onChange={(event) => {

						let parameters = new FormData ();
						parameters.set ("action", "project_list");
						parameters.set ("client_id", event.target.value);

						this.fetch_items ("projects", parameters, (data: any) => {
							this.setState ({ projects: data }, () => {
								this.setState ({ client_selected: true })
							});
						});

					}}>

					<option value="placeholder" key="placeholder" disabled={true} />
					{this.select_options (this.state.clients, "client_id", "name")}

				</select>
			</div>
		);
	}// client_selecter;


	private project_selecter () {
		return (
			<div id="project_list" style={{ display: "contents" }}>

				<FadeControl visible={this.state.client_selected} className="center-right-container">
					<label htmlFor="project_selecter">Project</label>
				</FadeControl>

				<FadeControl visible={this.state.client_selected} vanishing={true}>

					<select id="project_selecter" name="project_id" className="form-item" defaultValue="placeholder" style={{ margin: 0 }}

						onChange={() => {

							this.setState ({ project_selected: true })

						}}>

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

		client_selected: false,
		project_selected: false,

		project_list_resized: false

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