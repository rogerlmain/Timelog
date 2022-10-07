import "regenerator-runtime/runtime.js";
import "classes/types/prototypes";

import "resources/styles/main.css";

import React from "react";
import BaseControl from "client/controls/abstract/base.control";
import ClientStorage from "client/classes/storage/client.storage";
import CompanyStorage from "client/classes/storage/company.storage";
import ProjectSelector from "client/controls/selectors/project.selector";

import { numeric_value } from "client/classes/common";
import { MasterContext } from "client/classes/types/contexts";
import ProjectStorage from "client/classes/storage/project.storage";


export default class ProjectSelectorTest extends BaseControl {


	state = { client_data: null }


	/********/


	constructor (props) {
		super (props);
		this.state.company_id = 478; //268;
		CompanyStorage.set_active_company (this.state.company_id);
	}// constructor;


	/********/


	client_list = () => ClientStorage.get_by_company (CompanyStorage.active_company_id ());


	/********/


	render () {
		return <MasterContext.Provider value={{ company_id: numeric_value (this.state.company_id), master_page: this }}>

			<div className="one-piece-form">
				<ProjectSelector id="client_selector" ref={this.client_selector} parent={this}
					headerText="New client"
					selectedClient={this.state.selected_client}>
				</ProjectSelector>
			</div>

			<br /><br />

			<div className="two-column-grid">
				<button onClick={() => this.setState ({ client_data: this.client_list ()})}>Load clients</button>
				<button onClick={() => this.forceRefresh ()}>Force refresh</button>
			</div>

		</MasterContext.Provider>
	}// render;


}// ProjectSelectorTest;


