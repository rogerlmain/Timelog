import React, { BaseSyntheticEvent, SyntheticEvent } from "react";

import * as constants from "types/constants";
import * as common from "classes/common";

import Database from "classes/database";
import FormControl from "controls/form.control";
import TeamSelectorGadget, { TeamGroup } from "pages/gadgets/team.selector.gadget";

import { DefaultProps, DefaultState } from "controls/base.control";
import { ProjectData } from "types/datatypes";
import { LeftHand, SmallProgressMeter } from "controls/progress.meter";


const max_code_length: number = 5;


interface ProjectFormProps extends DefaultProps {
	projectData: ProjectData;
	onLoad?: any;
	onSave?: any;
}// ProjectFormProps;


interface ProjectFormState extends DefaultState {
	project_data: ProjectData;
	saving: boolean;
	saved: boolean;
}// ProjectFormState;


export default class ProjectForm extends FormControl<ProjectFormProps, ProjectFormState> {


	private project_form: React.RefObject<HTMLFormElement> = React.createRef ();


	private create_project_code () {

		let name = this.project_data ("name");

		if (common.is_null (name)) return;

		let word_array = name.split (constants.space);
		let letter_count = ((word_array.length < 3) ? 2 : ((word_array.length > 5) ? 5 : word_array.length));

		let result: string = null;

		word_array.forEach ((item: string) => {
			if (common.is_null (result)) result = constants.empty;
			result += item.slice (0, letter_count);
		})

		return result.toUpperCase ();

	}// create_project_code;


	private project_data (field: string) { return common.isset (this.state.project_data) ? this.state.project_data [field] : (common.isset (this.props.projectData) ? this.props.projectData [field] : constants.blank) }
	private set_data (value: Object) { return this.setState ({ project_data: { ...this.state.project_data, ...value }}) }


	private save_project (event: SyntheticEvent) {

		if (this.state.saved) return;
		if (!this.validate (this.project_form)) return;
		if (common.is_empty (this.project_data ("code"))) this.setState ({ project_data: {...this.props.projectData, code: this.create_project_code () } });

		let form_data = new FormData (this.project_form.current);

		form_data.append ("action", "save");
		form_data.append ("client_id", this.project_data ("client_id"));

		this.setState ({ saving: true }, () => Database.fetch_data ("projects", form_data).then ((data: any) => {
			this.setState ({ 
				project_data: data,
				saving: false 
			}, (data: any) => this.props.onSave (data));
		}));
		
	}// save_project;


	/********/


	public static defaultProps: ProjectFormProps = {
		projectData: null,
		onLoad: null,
		onSave: null
	}// defaultProps;


	public state: ProjectFormState = {
		project_data: null,
		saving: false,
		saved: false
	}// state;


	public componentDidMount () {
		this.setState ({ project_data: this.props.projectData });
	}// componentDidMount;


	public componentDidUpdate (): boolean {
		this.setState ({ saved: common.same_object (this.props.projectData, this.state.project_data) });
		return true;
	}// shouldComponentUpdate;


	public render () {
		return (
			<form id="project_form" ref={this.project_form}>

				<input type="hidden" id="project_id" name="project_id" value={this.project_data ("project_id") ?? 0} />

				<div className="two-column-grid" style={{  ...this.props.style, columnGap: "1em" }}>

					<label htmlFor="project_name">Project Name</label>

					<input type="text" id="project_name" name="project_name" defaultValue={this.project_data ("name")}
						onChange={(event: BaseSyntheticEvent) => this.set_data ({ name: event.target.value })}
						onBlur={this.save_project.bind (this)}>
					</input>

					<label htmlFor="project_code">Project Code</label>

					<input type="text" id="project_code" name="project_code" defaultValue={this.project_data ("code")} maxLength={max_code_length}
						onChange={(event: BaseSyntheticEvent) => this.set_data ({ code: event.target.value })}
						onBlur={this.save_project.bind (this)} style={{ textAlign: "right" }}>
					</input>

					<label htmlFor="project_description">Description</label>

					<textarea id="project_description" name="project_description" placeholder="(optional)" 
						defaultValue={this.project_data ("description")} onBlur={this.save_project.bind (this)}
						onChange={(event: BaseSyntheticEvent) => this.set_data ({ description: event.target.value })}>
					</textarea>

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

				<div className="middle-right-container">
					<SmallProgressMeter visible={this.state.saving} alignment={LeftHand}>Saving...</SmallProgressMeter>
				</div>

			</form>
		);
	}// render;

}// ProjectForm;

