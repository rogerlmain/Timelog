import * as constants from "client/classes/types/constants";
import * as common from "classes/common";

import React from "react";
import FormControl from "controls/form.control";
import Container from "client/controls/container";

import Database from "classes/database";

import { LeftHand, SmallProgressMeter } from "controls/progress.meter";


const max_code_length = 5;


export default class ProjectForm extends FormControl {

	project_form = React.createRef ();


	/********/


	project_data (field) { return common.isset (this.props.formData) ? this.props.formData [field] : constants.blank }


	save_project () {

		if (this.state.saved) return;
		if (!this.validate (this.project_form)) return;

		let form_data = new FormData (this.project_form.current);

		form_data.append ("action", "save");
		form_data.append ("client_id", this.props.clientId.toString ());

		this.setState ({ status: "Saving..." }, () => Database.save_data ("projects", form_data).then (data => {
			this.execute (this.props.onSave, data).then (() => this.setState ({ status: null }));
		}));
		
	}// save_project;


	delete_project (event) {

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


	static defaultProps = {
		formData: null,
		clientId: null,
		onLoad: null,
		onSave: null,
		onDelete: null
	}// defaultProps;


	state = {
		status: null,
		saved: false
	}// state;


	shouldComponentUpdate (next_props) {
		this.setState ({ saved: common.matching_objects (this.props.formData, next_props.formData) });
		return true;
	}// shouldComponentUpdate;


	render () {

		let project_id = this.project_data ("project_id");
		let editing = common.isset (project_id);

		return (
			<Container>
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

{/* 				// Reinstate for teams - phase 2
					<TeamSelectorGadget ref={this.references.team_selector} record_id={this.return_value (this.get_data ("project_id"))}

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

				<div className="right-justify">
					<SmallProgressMeter visible={common.isset (this.state.status)} alignment={LeftHand}>{this.state.status}</SmallProgressMeter>
				</div>

			</Container>

		);
	}// render;

}// ProjectForm;

