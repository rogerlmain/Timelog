import * as constants from "classes/types/constants";
import * as common from "classes/common";

import LocalStorage from "classes/local.storage";
import ProjectModel from "client/models/project.model";

import { isset, not_set, nested_object, nested_value } from "classes/common";

const store_name = constants.stores.projects;


export default class ProjectStorage extends LocalStorage {


	static #set = values => super.set_store (store_name, values);


	static #set_project = data => {

		data.client_id = data.client_id ?? 0;

		let values = nested_object (LocalStorage.get_all (store_name), data.company_id, data.client_id);
		if (not_set (values [data.company_id][data.client_id])) values [data.company_id][data.client_id] = [];

		let item = values [data.company_id][data.client_id].find (next => next.project_id == data.project_id);
		if (isset (item)) values [company_id][client_id].remove (item);

		values [data.company_id][data.client_id].push (data);

		ProjectStorage.#set (values);

	}// set_project;


	/*********/	
		

	static save_project = form_data => {
		return new Promise ((resolve, reject) => {
			ProjectModel.save_project (form_data).then (data => {
				this.#set_project (data);
				resolve (data);
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

			ProjectModel.fetch_by_id (this.state.selected_project).then (data => {

				if (not_empty (data)) {
					if (not_set (store [company_id])) store [company_id] = [];
					store [company_id].push (data);
					LocalStorage.set (store_name, store);
				}// if;
				
				resolve (data);
			
			});

		});
	}/* get_by_project_id */;


	static get_projects (company_id, client_id) { 
		return new Promise (async (resolve, reject) => {

			let data = nested_value (LocalStorage.get_all (store_name), company_id, client_id);

			if (not_set (data)) {
				data = await ProjectModel.fetch (client_id).catch (reject);
				if (common.not_empty (data)) ProjectStorage.#set_project ({
					company_id: company_id,
					client_id: client_id,
					...data [0]
				});
			}// if;

			resolve (data);

		});
	}// get_projects;


	/********/


}// ProjectStorage;