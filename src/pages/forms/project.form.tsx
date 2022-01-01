import React, { SyntheticEvent } from "react";

import * as constants from "types/constants";
import * as common from "classes/common";

import Database from "classes/database";
import BaseControl, { DefaultProps, DefaultState } from "controls/base.control";
import TeamSelectorGadget, { TeamGroup } from "pages/gadgets/team.selector.gadget";
import { ProjectData } from "types/datatypes";
import { globals } from "types/globals";


const max_code_length: number = 5;


interface projectFormProps extends DefaultProps {
	onLoad?: Function;
}// projectFormProps;


interface projectFormState extends DefaultState {
	project_data: ProjectData;
}// projectFormState;


interface ProjectFormReferenceList {
	project_form: React.RefObject<HTMLFormElement>;
	project_name: React.RefObject<HTMLInputElement>;
	project_code: React.RefObject<HTMLInputElement>;
	team_selector: React.RefObject<TeamSelectorGadget>;
}// ProjectFormReferenceList;


export default class ProjectForm extends BaseControl<projectFormProps, projectFormState> {

	private references: ProjectFormReferenceList = {
		project_form: React.createRef (),
		project_name: React.createRef (),
		project_code: React.createRef (),
		team_selector: React.createRef ()
	}// references;


	private create_project_code () {

		let name_field: HTMLInputElement = this.references.project_name.current;
		let name_value = (common.isset (name_field) ? name_field.value : null);

		if (common.is_null (name_value)) return;

		let word_array = name_value.split (constants.space);
		let letter_count = ((word_array.length < 3) ? 2 : ((word_array.length > 5) ? 5 : word_array.length));

		let result: string = null;

		word_array.forEach ((item: string) => {
			if (common.is_null (result)) result = constants.empty;
			result += item.slice (0, letter_count);
		})

		return result.toUpperCase ();

	}// create_project_code;


	private get_data (field: string) { return common.isset (this.state.project_data) ? this.state.project_data [field] : null }


	/* TO BE REASSESSED - SHOULD BE PRIVATE ? */
	public save_project (event: SyntheticEvent) {

		let code_field: HTMLInputElement = this.references.project_code.current;
		let code_value: string = (common.isset (code_field) ? code_field.value : null);

		if (common.is_empty (code_value)) this.setState ({ project_data: {...this.state.project_data, code: this.create_project_code () } });

		document.getElementById ("data_indicator").style.opacity = "1";

		let parameters = new FormData (this.dom ("project_form"));
		parameters.append ("client_id", this.dom ("project_selecter_client_selecter").value);
		parameters.append ("selected_team", JSON.stringify (this.references.team_selector.current.state.selected_accounts));
		parameters.append ("action", "save");

		Database.fetch_data ("projects", parameters).then ((data: any) => {
			document.getElementById ("data_indicator").style.opacity = "0";
			if (common.isset (this.get_data ("project_id"))) return;
			if (common.exists (data, "project", "project_id")) this.setState ({ project_id: data.project.project_id });
		});

	}// save_project;
	

	/********/


	public props: projectFormProps;
	public state: projectFormState;


	public componentDidMount () {
		this.setState ({ project_data: null });
	}// state


	public render () {
		return (
			<form id="project_form" ref={this.references.project_form}>
				<div className="two-column-panel" 
				
					style={{ 
						...this.props.style,
						columnGap: "1em"
					}}>

					<div>

						<input type="hidden" id="project_id" name="project_id" value={this.get_data ("project_id") ?? 0} />
						<div className="one-piece-form">

							<label htmlFor="project_name">Project Name</label>
							<input type="text" id="project_name" name="project_name" ref={this.references.project_name}
								defaultValue={this.state_value ("project_data", "name")}
								onBlur={this.save_project.bind (this)}>
							</input>

							<label htmlFor="project_code">Project Code</label>
							<input type="text" id="project_code" name="project_code"
								defaultValue={this.state_value ("project_data", "code")} maxLength={max_code_length}
								onBlur={this.save_project.bind (this)} style={{ textAlign: "right" }}>
							</input>

						</div>

						<textarea id="project_description" name="project_description" placeholder="Description (optional)"
							defaultValue={this.state_value ("project_data", "description")} onBlur={this.save_project.bind (this)}>
						</textarea>

					</div>

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

				</div>
			</form>
		);
	}// render;

}// ProjectForm;

