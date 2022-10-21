import React from "react";

import ProjectStorage from "client/classes/storage/project.storage";

import FormControl from "client/controls/form.control";

import AlphaCapitalInput from "client/controls/inputs/alpha.capital.input";
import FadePanel from "client/controls/panels/fade.panel";

import RateSubform from "client/forms/subforms/rate.subform";

import { blank, space } from "client/classes/types/constants";
import { nested_value, isset, not_empty  } from "client/classes/common";

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

		let name = this.project_data ("name");

		event.preventDefault ();

		if (!confirm (`Delete ${name}.\nAre you sure?`)) return false;

		this.setState ({ status: `Deleting ${name}...` }, () => ProjectStorage.delete_project (this.project_data ("project_id")).then (success => {
			this.setState ({ status: null }, () => { if (success) this.execute (this.props.onDelete) });
		}));

		return false;

	}// delete;
 

	validate = form => new Promise ((resolve, reject) => {

		let project_field = document.getElementById ("project_name");
		let project_name = project_field.value;
		let valid = true;

		if (not_empty (document.getElementById ("project_id").value)) return resolve (true);
		if (!super.validate (form)) return resolve (false);

		ProjectStorage.get_by_client (this.props.clientId).then (data => {

			Object.keys (data).every (key => {
				
				if (data [key]?.name.equals (project_name)) {

					project_field.setCustomValidity (`There is already a project called ${project_name} for this client.\nProject names must be unique.`);
					project_field.reportValidity ();
					project_field.classList.add ("invalid");

					return valid = false;

				}// if;

				return true;

			});

			if (valid) project_field.classList.remove ("invalid");
			resolve (valid);

		}).catch (reject);

	})/* validate */;


	save_project = event => {

		event.preventDefault ();

		if (this.state.saved) return;

		this.validate (this.project_form).then (valid => {

			if (!valid) return;

			let form_data = new FormData (this.project_form.current);

			form_data.append ("action", "save");
			form_data.append ("client_id", this.props.clientId);
			form_data.append ("company_id", this.context.company_id);

			this.setState ({ 
				status: "Saving...", 
				handler: () => ProjectStorage.save_project (form_data).then (data => {
					this.props.parent.setState ({ 
						project_data: data,
						selected_project: data.project_id,
					}, () => this.execute (this.props.onSave, data).then (() => this.setState ({ status: null })));
				})
			});

		});
		
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

						<input type="expando" id="project_name" name="project_name" defaultValue={this.project_data ("name") || blank} required={true}
							onChange={event => {
								
								this.setState (this.setState ({ code: codify (event.target.value) }));
							}}>
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
										value={this.state.code}>
									</AlphaCapitalInput>

									<RateSubform clientId={this.props.clientId} projectId={project_id} onChange={this.save_project} />

								</div>

							</div>

						</div>

					</div>

					<label htmlFor="project_description">Description</label>
					<textarea id="project_description" name="project_description" placeholder="(optional)"
						defaultValue={this.project_data ("description")} style={{ minWidth: "32.25em" }}>
					</textarea>

					<div style={{ gridColumn: "2/-1" }}>
						<div className="horizontally-spaced-out vertically-centered with-headspace">

							<SmallProgressMeter id="project_progress_meter" visible={isset (this.state.handler) || isset (this.state.status)} 
								handler={this.state.handler}>
								{this.state.status}
							</SmallProgressMeter>

							<div className="button-panel">
								<FadePanel id="delete_button_panel" visible={isset (project_id)}>
									{isset (project_id) && <button onClick={this.delete_project}>Delete</button>}
								</FadePanel>
								<button onClick={this.save_project}>Save</button>
							</div>

						</div>
					</div>

				</div>

			</form>
		</div>

	}// render;

}// ProjectForm;

