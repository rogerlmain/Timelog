import * as constants from "types/constants";
import * as common from "classes/common";

import { DefaultProps, DefaultState } from "controls/base.control";
import { ProjectData } from "types/datatypes";
import { LeftHand, SmallProgressMeter } from "controls/progress.meter";

import React, { BaseSyntheticEvent } from "react";
import FormControl from "controls/form.control";

import Database from "classes/database";


interface ProjectFormProps extends DefaultProps {

	formData: ProjectData;
	clientId: number;

	onLoad?: any;
	onSave?: any;
	onDelete?: any;

}// ProjectFormProps;


interface ProjectFormState extends DefaultState {
	status: string;
	saved: boolean;
}// ProjectFormState;


const max_code_length: number = 5;


export default class ProjectForm extends FormControl<ProjectFormProps, ProjectFormState> {

	private project_form: React.RefObject<HTMLFormElement> = React.createRef ();


	/********/


	private project_data (field: string) { return common.isset (this.props.formData) ? this.props.formData [field] : null }


	private save_project () {

		if (this.state.saved) return;
		if (!this.validate (this.project_form)) return;

		let form_data = new FormData (this.project_form.current);

		form_data.append ("action", "save");
		form_data.append ("client_id", this.props.clientId.toString ());

		this.setState ({ status: "Saving..." }, () => Database.save_data ("projects", form_data).then ((data: any) => {
			this.execute (this.props.onSave, data).then (() => this.setState ({ status: null }));
		}));
		
	}// save_project;


	private delete_project (event: BaseSyntheticEvent) {

		event.preventDefault ();

		if (!confirm (`Delete ${this.project_data ("name")}.\nAre you sure?`)) return false;

		let form_data = new FormData (this.project_form.current);

		form_data.append ("action", "save");
		form_data.append ("deleted", "true");
		form_data.append ("project_id", this.project_data ("project_id"));

this.setState ({ status: `Deleting ${this.project_data ("name")}...` });

		// this.setState ({ status: `Deleting ${this.project_data ("name")}...` }, () => Database.save_data ("projects", form_data).then (data => {
		// 	this.execute (this.props.onDelete, data).then (() => this.setState ({ status: null }));
		// }));

		return false;

	}// delete;
 

	// private create_project_code () {

	// 	let name = this.project_data ("name");

	// 	if (common.is_null (name)) return;

	// 	let word_array = name.split (constants.space);
	// 	let letter_count = ((word_array.length < 3) ? 2 : ((word_array.length > 5) ? 5 : word_array.length));

	// 	let result: string = null;

	// 	word_array.forEach ((item: string) => {
	// 		if (common.is_null (result)) result = constants.empty;
	// 		result += item.slice (0, letter_count);
	// 	})

	// 	return result.toUpperCase ();

	// }// create_project_code;


	// private set_data (value: Object) { return this.setState ({ project_data: { ...this.state.project_data, ...value }}) }



	/********/


	public static defaultProps: ProjectFormProps = {
		formData: null,
		clientId: null,
		onLoad: null,
		onSave: null,
		onDelete: null
	}// defaultProps;


	public state: ProjectFormState = {
		status: null,
		saved: false
	}// state;


	public shouldComponentUpdate (next_props: Readonly<ProjectFormProps>): boolean {
		this.setState ({ saved: common.same_object (this.props.formData, next_props.formData) });
		return true;
	}// shouldComponentUpdate;


	public render () {

		let project_id = this.project_data ("project_id");
		let editing = common.isset (project_id);

		return (
			<div style={{ display: "contents" }}>

				<form id="project_form" ref={this.project_form}>

					<input type="hidden" id="project_id" name="project_id" value={project_id || constants.blank} />

					<div className="two-column-grid" style={{  ...this.props.style, columnGap: "1em" }}>

						<label htmlFor="project_name">Project Name</label>
						<input type="text" id="project_name" name="project_name" defaultValue={this.project_data ("name") || constants.blank} required={true}
							onBlur={this.save_project.bind (this)}>
						</input>

						<label htmlFor="project_code">Project Code</label>
						<input type="text" id="project_code" name="project_code" defaultValue={this.project_data ("code")} maxLength={max_code_length}
							onBlur={this.save_project.bind (this)} style={{ textAlign: "right" }}>
						</input>

						<label htmlFor="project_description">Description</label>
						<textarea id="project_description" name="project_description" defaultValue={this.project_data ("description")} placeholder="(optional)" 
							onBlur={this.save_project.bind (this)}>
						</textarea>

						{editing && <button className="double-column" onClick={this.delete_project.bind (this)} style={{ marginTop: "1em" }}>Delete</button>}

					</div>

	{/* 			// Reinstate for teams - phase 2
					<TeamSelectorGadget ref={this.references.team_selector} record_id={this.return (this.get_data ("project_id"))}

						onLoad={() => { 
							
							// globals.projects_page.refresh ();
							globals.projects_page.forceUpdate ();
							// globals.projects_page.setState ({ eyecandy_visible: false }, () => {
							// 	alert ("state updated...");
							// });
						
						}}

						parent={this} group={TeamGroup.project}>

					</TeamSelectorGadget>
	*/}

				</form>

				<div className="middle-right-container">
					<SmallProgressMeter visible={common.isset (this.state.status)} alignment={LeftHand}>{this.state.status}</SmallProgressMeter>
				</div>

			</div>

		);
	}// render;

}// ProjectForm;

