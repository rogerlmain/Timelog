import Database from "../database.mjs";


export default class CompanyData extends Database {


	get_companies_by_account = async (account_id) => {
		let procedure = "get_companies_by_account";
		let parameters = [account_id];
		return this.data_query (procedure, parameters);
	}// get_companies_by_account;


}// CompanyData;

