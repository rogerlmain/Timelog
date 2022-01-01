import React from "react";

import * as common from "classes/common";

import Database from "classes/database";
import BaseControl, { DefaultProps } from "controls/base.control";
import ExplodingPanel from "controls/panels/exploding.panel";
import SelectList from "controls/select.list";
import ProjectsModel from "models/projects";
import SelectButton from "controls/buttons/select.button";
import FadePanel from "controls/panels/fade.panel";


interface projectsPageProps extends DefaultProps {

	id: string;

	onLoad?: Function;
	onClientChange?: Function;
	onProjectChange: Function;

}// projectsPageProps;


interface projectsPageState {

	clients: any;
	projects: any;

	clients_loaded: boolean;
	client_selected: boolean;

	projects_loaded: boolean;
	project_selected: boolean;

}// state;


export default class ProjectSelecterGadget extends BaseControl<projectsPageProps, projectsPageState> {

	private client_list: React.RefObject<SelectList> = React.createRef ();
	private project_list: React.RefObject<SelectList> = React.createRef ();

	private client_selector_id: any = null;
	private project_selector_id: any = null;


	private load_clients () {
		Database.fetch_data ("clients", { action: "list" }).then ((data: any) => {
			this.setState ({ clients: data }, () => {
				this.setState ({ clients_loaded: true });
				this.execute (this.props.onLoad);
			});
		});
	}// load_clients;


	private load_projects (callback: Function = null) {
		ProjectsModel.fetch_by_client (this.client_list.current.state.selected_value, (data: any) => {
			this.setState ({ projects: data }, () => {
				this.setState ({ projects_loaded: true }, callback);
			});
		});
	}// load_projects;


	private client_change_handler () {
		this.setState ({ client_selected: true }, () => this.load_projects (this.props.onClientChange));
	}// client_change_handler;


	private client_selecter () {

		return (
			<div style={{ display: "contents" }}>

				<FadePanel id="fp1" visible={this.state.clients_loaded}>
					<label htmlFor={this.client_selector_id}>Client</label>
				</FadePanel>

				<FadePanel id="fp2" visible={this.state.clients_loaded}>
					<SelectList id={this.client_selector_id} ref={this.client_list}
						data={this.state.clients} id_field="client_id" text_field="name"
						onChange={this.client_change_handler.bind (this)}>
					</SelectList>
				</FadePanel>

				<FadePanel id="fp3" visible={this.state.clients_loaded}>
					<SelectButton id="new_client_button" sticky={false}>New</SelectButton>
				</FadePanel>

				<ExplodingPanel id="edit_client_button_panel" visible={this.state.client_selected}>
					<SelectButton id="edit_client_button" sticky={false}>Edit</SelectButton>
				</ExplodingPanel>

			</div>
		);
	}// client_selecter;


	private project_selecter () {
		return (
			<div style={{ display: "contents" }}>


				<ExplodingPanel id="project_label" visible={this.state.projects_loaded} className="middle-right-container">

					<label htmlFor={this.project_selector_id}>Project</label>

				</ExplodingPanel>

{/*
				<div style={{ display: "block" }}>
					<ExplodingPanel id="project_list" visible={this.state.projects_loaded} fill={true} style={{ display: "block !important" }}
						size={{ height: "var(--single-height)"}} stretch={true}>
						<SelectList id={this.project_selector_id} ref={this.project_list} className="form-item" style={{ width: "100%" }}
							onChange={this.props.onProjectChange}>
							{this.select_options (this.state.projects, "project_id", "project_name")}
						</SelectList>
					</ExplodingPanel>
				</div>

				<div style={{ gridColumn: "3/span 2", display: "block" }}>
					<ExplodingPanel id="new_project_button_panel" visible={this.state.projects_loaded} fill={true}
						size={{ height: "var(--single-height)"}} stretch={true}>
						<SelectButton id="new_project_button" sticky={false} onClick={() => { this.setState ({ project_loaded: true }) }}>New</SelectButton>
					</ExplodingPanel>
				</div>
*/}
			</div>
		);
	}// project_selecter;


	/********/


	public props: projectsPageProps;
	public state: projectsPageState;


	public constructor (props: any) {
		super (props);
		this.client_selector_id = `${this.props.id}_client_selecter`;
		this.project_selector_id = `${this.props.id}_project_selecter`;
	}// constructor;


	public componentDidMount () {
		this.setState ({
			clients_loaded: false,
			client_selected: false,

			projects_loaded: false,
			project_selected: false,

			clients: null,
			projects: null
		});
	}// componentDidMount;


	public getSnapshotBeforeUpdate (old_props: projectsPageProps, old_state: projectsPageState) {
		if (this.is_updated (this.state.clients, old_state.clients) || common.is_null (this.state.clients)) this.load_clients ();
		return true;
	}// componentDidMount;


	public componentDidUpdate () {
		this.setState ({ })
	}// componentDidUpdate;


	public render () {
		return (
			<form id={this.props.id}>

				<div className="project-selecter-form">

					{this.client_selecter ()}
					{this.project_selecter ()}

				</div>

			</form>
		);
	}// render;

}// ProjectSelecterGadget;