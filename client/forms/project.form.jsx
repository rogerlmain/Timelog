import React from "react";

import ProjectStorage from "client/classes/storage/project.storage";

import FormControl from "client/controls/form.control";
import Container from "client/controls/container";

import AlphaCapitalInput from "client/controls/inputs/alpha.capital.input";
import FadePanel from "client/controls/panels/fade.panel";

import RateSubform from "client/forms/subforms/rate.subform";

import { blank, space, horizontal_alignment } from "client/classes/types/constants";
import { nested_value, isset  } from "client/classes/common";

import { SmallProgressMeter } from "client/controls/progress.meter";
import { MasterContext } from "client/classes/types/contexts";


import "resources/styles/forms.css"


const max_code_length = 5;


export function codify (string) {
	let codewords = string.toUpperCase ().replace (/[AEIOU]/g, blank).trim ().split (space);
	codewords.forEach (word => codewords [codewords.indexOf (word)] = word.substr (0, Math.ceil (max_code_length / codewords.length)));
	return codewords.join (blank).substr (0, 5);
}// codify;


export default class ProjectForm extends FormControl {


	project_form = React.createRef ();


	state = {
		code: null,
		status: null,
	}// state;


	static contextType = MasterContext;


	static defaultProps = {

		formData: null,
		clientId: null,
		parent: null,

		onLoad: null,
		onSave: null,
		onDelete: null

	}// defaultProps;


	/********/


	project_data = field => { return isset (this.props.formData) ? this.props.formData [field] : null }


	delete_project = event => {

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
 

	// update_code = event => {	
	// 	let codewords = event.target.value.toUpperCase ().replace (/[AEIOU]/g, blank).trim ().split (space);
	// 	codewords.forEach (word => codewords [codewords.indexOf (word)] = word.substr (0, Math.ceil (max_code_length / codewords.length)));
	// 	this.setState ({ code: codewords.join (blank).substr (0, 5) });
	// }// update_code;


	save_project = () => {

		if (this.state.saved) return;
		if (!this.validate (this.project_form)) return;

		let form_data = new FormData (this.project_form.current);

		form_data.append ("action", "save");
		form_data.append ("client_id", this.props.clientId);
		form_data.append ("company_id", this.context.company_id);

		this.setState ({ status: "Saving..." }, () => ProjectStorage.save_project (form_data).then (data => {

			this.props.parent.setState ({ 
				project_data: data,
				selected_project: data.id,
			}, () => {
				this.execute (this.props.onSave).then (() => this.setState ({ status: null }));
			});

		}));
		
	}/* save_project */;


	/********/

	
	componentDidMount () { this.setState ({ code: nested_value (this, "props", "formData", "code") }) }


	render () {

		let project_id = this.project_data ("project_id");

		return <div>
			<form id="project_form" ref={this.project_form}>

				<input type="hidden" id="project_id" name="project_id" value={project_id || blank} />

				<div className="one-piece-form" style={{ rowGap: "0.5em" }}>

					<label htmlFor="project_name">Project Name</label>
					<div style={{ display: "grid", gridTemplateColumns: "1fr min-content" }}>

						<input type="text" id="project_name" name="project_name" defaultValue={this.project_data ("name") || blank} required={true}
							onChange={event => this.setState (this.setState ({ code: codify (event.target.value) }))}
							onBlur={this.save_project}>
						</input>

						<div style={{ marginLeft: "0.5em" }}>

							<div className="two-column-grid">

								<div className="two-piece-form">
									<label htmlFor="project_code">Code</label>
									<AlphaCapitalInput type="text" id="project_code" name="project_code" maxLength={max_code_length}
										style={{ 
											backgroundColor: "var(--disabled-field)",
											textAlign: "center",
											width: `${max_code_length}em`,
										}}
										value={this.state.code} 
										onBlur={this.save_project}>
									</AlphaCapitalInput>

									<RateSubform clientId={this.props.clientId} projectId={project_id} onChange={this.save_project} />

								</div>

							</div>

						</div>

					</div>

					<label htmlFor="project_description">Description</label>
					<textarea id="project_description" name="project_description" placeholder="(optional)"
						defaultValue={this.project_data ("description")} 
						onBlur={this.save_project} style={{ minWidth: "32.25em" }}>
					</textarea>

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

			<div className="horizontally-spaced-out vertically-centered" style={{ marginTop: "1em" }}>

				<SmallProgressMeter id="project_progress_meter" visible={isset (this.state.status)} 
					alignment={horizontal_alignment.right}>
					{this.state.status}
				</SmallProgressMeter>

				<FadePanel id="delete_button_panel" visible={isset (project_id)}>
					<button className="right-aligned" onClick={this.delete_project}>Delete</button>
				</FadePanel>

			</div>

		</div>

	}// render;

}// ProjectForm;

