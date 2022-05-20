import * as constants from "classes/types/constants";
import * as common from "classes/common";

import LocalStorage from "classes/local.storage";
import ProjectModel from "client/models/project.model";

import { isset, not_set, nested_value } from "classes/common";

const store_name = constants.stores.projects;


export default class ProjectStorage extends LocalStorage {


	static set (values) { super.set_store (store_name, values) }


	static set_project (company_id, client_id, project) {

		client_id = client_id ?? 0;

		let values = LocalStorage.get_all (store_name);
		let items = nested_value (values, company_id, client_id ?? 0);
		let value = isset (items) ? items.find (item => item.project_id == project.project_id) : null;

		if (not_set (values)) values = {};
		if (not_set (values [company_id])) values [company_id] = new Array ();
		if (not_set (values [company_id][client_id])) values [company_id][client_id] = new Array ();

		if (isset (value)) values [company_id][client_id].remove (value);
		values [company_id][client_id].merge (project); 

		ProjectStorage.set (values);

	}// set_project;


/*	static remove_project (project_id) {

		let values = LocalStorage.get_all (store_name);

		if (isset (values)) {
			let value = values.find (candidate => candidate.project_id == project_id);
			return LocalStorage.set_store (store_name, values.remove (value));
		}// if;

	}// remove_project;


	/********/


	static get_projects (company_id, client_id) { 
		return new Promise (async (resolve, reject) => {

			let data = nested_value (LocalStorage.get_all (store_name), company_id, client_id);

			if (not_set (data)) {
				data = await ProjectModel.fetch (client_id).catch (reject);
				if (common.not_empty (data)) ProjectStorage.set_project (company_id, client_id, data);
			}// if;

			resolve (data);

		});
	}// get_projects;


	/********/


}// ProjectStorage;