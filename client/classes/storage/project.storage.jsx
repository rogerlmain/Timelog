import * as constants from "classes/types/constants";

import LocalStorage from "classes/local.storage";
import ProjectModel from "client/models/project.model";

import { isset, is_array, is_null, not_empty, not_set, nested_object, nested_value } from "classes/common";

const store_name = constants.stores.projects;


export default class ProjectStorage extends LocalStorage {


	/**** Private Functions ****/


	static #set = values => super.set_store (store_name, values);


	static #set_project = data => {

		data.client_id = data.client_id ?? 0;

		let values = nested_object (LocalStorage.get_all (store_name), data.company_id, data.client_id);
		if (not_set (values [data.company_id][data.client_id])) values [data.company_id][data.client_id] = [];

		let item = values [data.company_id][data.client_id].find (next => next.id == data.project_id);
		if (isset (item)) values [data.company_id][data.client_id].remove (item);

		values [data.company_id][data.client_id].push (ProjectStorage.project_store (data));

		ProjectStorage.#set (values);

	}// set_project;


	/*********/


	static project_store = (data) => {
		let result = is_null (data) ? null : {
			id: data.project_id,
			code: data.project_code,
			name: data.project_name,
			description: data.description,
		}// return;
		return result;
	}/* project_store */;


	static save_project = form_data => {
		return new Promise ((resolve, reject) => {
			ProjectModel.save_project (form_data).then (data => {
				this.#set_project (data);
				resolve (ProjectStorage.project_store (data));
			}).catch (reject);
		});
	}/* save_project */;

/*
	static remove_project (project_id) {

		let values = LocalStorage.get_all (store_name);

		if (isset (values)) {
			let value = values.find (candidate => candidate.project_id == project_id);
			return LocalStorage.set_store (store_name, values.remove (value));
		}// if;

	}// remove_project;
*/


	static get_by_project_id (company_id, project_id) {
		return new Promise ((resolve, reject) => {

			let store = LocalStorage.get_all (store_name);
			let result = nested_value (store, company_id, "find", item => { item.project_id == project_id });

			if (isset (result)) return resolve (result);

			ProjectModel.fetch_by_id (project_id).then (data => {
				this.#set_project (data);
				resolve (ProjectStorage.project_store (data));
			});

		});
	}/* get_by_project_id */;


	static get_projects (company_id, client_id) { 
		return new Promise (async (resolve, reject) => {

			let data = nested_value (LocalStorage.get_all (store_name), company_id, client_id);

			if (not_set (data)) {

				let items = await ProjectModel.fetch (client_id).catch (reject);

				data = null;
				if (is_array (items)) items.forEach (item => {
					if (is_null (data)) data = [];
					data.push (ProjectStorage.project_store (item));
				});

				if (isset (data)) ProjectStorage.#set_project (data);
				
			}// if;

			resolve (data);

		});
	}// get_projects;


}// ProjectStorage;

