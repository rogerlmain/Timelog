import * as constants from "client/classes/types/constants";
import * as common from "classes/common";

import React from "react";

import Database from "classes/database";

import Projects from "classes/storage/projects";

import FormControl from "controls/form.control";
import Container from "controls/container";

import AlphaCapitalInput from "controls/inputs/alpha.capital.input";
import FadePanel from "controls/panels/fade.panel";

import { nested_value } from "classes/common";
import { SmallProgressMeter } from "controls/progress.meter";
import { MainContext } from "classes/types/contexts";


const max_code_length = 5;


export default class ProjectForm extends FormControl {


	project_form = React.createRef ();


	state = {
		code: null,
		status: null,
	}// state;


	static contextType = MainContext;


	static defaultProps = {

		formData: null,
		clientId: null,
		parent: null,

		onLoad: null,
		onSave: null,
		onDelete: null

	}// defaultProps;


	/********/


	project_data = field => { return common.isset (this.props.formData) ? this.props.formData [field] : null }


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
 

	update_code = event => this.setState ({ code: event.target.value.toUpperCase ().replace (/[AEIOU\s]/g, constants.blank).substr (0, max_code_length) });


	save_project = () => {

		if (this.state.saved) return;
		if (!this.validate (this.project_form)) return;

		let form_data = new FormData (this.project_form.current);

		form_data.append ("action", "save");
		form_data.append ("client_id", this.props.clientId.toString ());

		this.setState ({ status: "Saving..." }, () => Database.save_data ("projects", form_data).then (data => {
			this.execute (this.props.onSave, data).then (() => {
				
				Projects.set_project (this.context.company_id, data);
				
				this.props.parent.setState ({ 
					client_data: data,
					selected_client: data.client_id
				}, () => {
					this.props.parent.update_project_list ();
					this.setState ({ status: null });
				});
				
			});
		}));
		
	}/* save_project */;


	/********/

	
	componentDidMount () { this.setState ({ code: nested_value (this, "props", "formData", "code") }) }


	render () {

		let project_id = this.project_data ("project_id");

		return <Container>
			<form id="project_form" ref={this.project_form}>

				<input type="hidden" id="project_id" name="project_id" value={project_id || constants.blank} />

				<div className="two-column-grid" style={{  ...this.props.style, columnGap: "1em" }}>

					<label htmlFor="project_name">Project Name</label>
					<div className="two-column-grid" 

						style={{ 
							gridTemplateColumns: "1fr min-content",
							gridGap: "0.25em" 
						}}>

						<input type="text" id="project_name" name="project_name" defaultValue={this.project_data ("name") || constants.blank} required={true}
							onChange={this.update_code}
							onBlur={this.save_project}>
						</input>

						<AlphaCapitalInput type="text" id="project_code" name="project_code" maxLength={max_code_length}
							style={{ 
								backgroundColor: "var(--disabled-field)",
								textAlign: "center",
								width: `${max_code_length}em`,
							}}
							value={this.state.code} 
							onBlur={this.save_project}>
						</AlphaCapitalInput>

					</div>

					<label htmlFor="project_description">Description</label>
					<textarea id="project_description" name="project_description" placeholder="(optional)"
						defaultValue={this.project_data ("description")} 
						onBlur={this.save_project}>
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

			<div className="horizontally-spaced-out vertically-center" style={{ marginTop: "1em" }}>

				<SmallProgressMeter id="project_progress_meter" visible={common.isset (this.state.status)} 
					alignment={constants.horizontal_alignment.right}>
					{this.state.status}
				</SmallProgressMeter>

				<FadePanel id="delete_button_panel" visible={common.isset (project_id)}>
					<button className="double-column" onClick={this.delete_project}>Delete</button>
				</FadePanel>

			</div>

		</Container>

	}// render;

}// ProjectForm;

