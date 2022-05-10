import * as constants from "classes/types/constants";
import * as common from "classes/common";

import LocalStorage from "classes/local.storage";
import ProjectsModel from "models/projects";

import { isset, not_set, nested_value } from "classes/common";

const store_name = constants.stores.projects;


export default class Projects extends LocalStorage {


	static set (values) { super.set_store (store_name, values) }


	static set_project (company_id, project) {

		let values = LocalStorage.get_all (store_name);
		let items = nested_value (values, company_id);
		let value = isset (items) ? items.find (item => item.project_id == project.project_id) : null;

		if (not_set (values)) values = {};
		if (not_set (values [company_id])) values [company_id] = new Array ();

		if (isset (value)) values [company_id].remove (value);
		values [company_id].push (project); 

		Projects.set (values);

	}// set_project;


/*	static remove_project (project_id) {

		let values = LocalStorage.get_all (store_name);

		if (isset (values)) {
			let value = values.find (candidate => candidate.project_id == project_id);
			return LocalStorage.set_store (store_name, values.remove (value));
		}// if;

	}// remove_project;


	/********/


	static get_all (client_id) { 
		return new Promise ((resolve, reject) => {
			let result = LocalStorage.get_all (store_name);
			if (isset (result)) return resolve (result);
			ProjectsModel.fetch_by_client (client_id).then (data => {
				if (common.not_empty (data)) Projects.set (data);
				resolve (data);
			}).catch (reject);
		});
	}// get_all;


	/********/


}// Projects;