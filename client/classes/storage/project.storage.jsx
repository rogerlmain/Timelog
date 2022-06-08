import * as constants from "classes/types/constants";

import LocalStorage from "classes/local.storage";
import CompanyStorage from "./company.storage";

import ProjectModel from "client/classes/models/project.model";

import { isset, is_null, not_set, nested_object, nested_value, null_value, not_array, is_array } from "classes/common";


const store_name = constants.stores.projects;


export default class ProjectStorage extends LocalStorage {


	/**** Private Methods ****/


	static #set = values => super.set_store (store_name, values);


	static #set_project = data => {

		let company_id = CompanyStorage.active_company_id ();

		// POSSIBLY REDUNDANT - DEFAULT SHOULD MATCH TO NULL SO THIS MAY NOT BE NECESSARY
		data.client_id = data.client_id ?? 0;

		let values = nested_object (LocalStorage.get_all (store_name), company_id, data.client_id);
		if (not_set (values [company_id][data.client_id])) values [company_id][data.client_id] = [];

		let item = values [company_id][data.client_id].find (next => next.id == data.id);
		if (isset (item)) values [company_id][data.client_id].remove (item);

		values [company_id][data.client_id].push (data);

		this.#set (values);

	}// set_project;


	/**** Public Methods *****/


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


	static get_by_id (project_id) {
		return new Promise ((resolve, reject) => {

			let store = LocalStorage.get_all (store_name);
			let result = nested_value (store, CompanyStorage.active_company_id (), "find", item => { item.project_id == project_id });

			if (isset (result)) return resolve (result);

			ProjectModel.get_project_by_id (project_id).then (data => {
				this.#set_project (data);
				resolve (data);
			}).catch (reject);

		});
	}/* get_by_id */;


	static get_company_projects () {
		let store = LocalStorage.get_all (store_name);
		return (isset (store) ? store [CompanyStorage.active_company_id ()] : null);
	}// get_company_projects;


	static get_projects_by_client (client_id) { 
		return new Promise (async (resolve, reject) => {

			let data = nested_value (LocalStorage.get_all (store_name), CompanyStorage.active_company_id (), client_id);

			if (not_set (data)) {

				let items = await ProjectModel.get_projects_by_client (client_id).catch (reject);

				if (not_array (items)) items = [items];
				items.forEach (item => { if (isset (item)) this.#set_project (item) });
				
			}// if;

			resolve (data);

		});
	}// get_projects_by_client;


	/********/


	static default_rate = async (project_id, new_rate = null) => {

		let result = null;

		if (isset (new_rate)) { 
			// SAVE NEW RATE
		}// if;

		if (isset (project_id)) {
			let project = await this.get_by_id (project_id);
			result = null_value (project.billing_rate);
		}// if;

		return result;

	}/* default_rate */


}// ProjectStorage;

