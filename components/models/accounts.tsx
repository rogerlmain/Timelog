import Database from "components/classes/database";

export class AccountsModel {


	public fetch_by_company (company_id: number, callback: any) {
		let parameters = new FormData ();
		parameters.append ("action", "company");
		parameters.append ("company_id", company_id.toString ());
		Database.fetch_data ("accounts", parameters, callback);
	}// fetch_by_company;


	public fetch_by_project (project_id: number, callback: any) {
		let parameters = new FormData ();
		parameters.append ("action", "project");
		parameters.append ("project_id", project_id.toString ());
		Database.fetch_data ("accounts", parameters, callback);
	}// fetch_by_project;


	public fetch_by_task (task_id: number, callback: any) {
		let parameters = new FormData ();
		parameters.append ("action", "task");
		parameters.append ("task_id", task_id.toString ());
		Database.fetch_data ("accounts", parameters, callback);
	}// fetch_by_task;


	public save_account (data: FormData, callback: any) {
		data.append ("action", "save");
		Database.save_data ("accounts", data, callback);
	}// save_account;


}// AccountsModel;


export const accounts_model = new AccountsModel ();