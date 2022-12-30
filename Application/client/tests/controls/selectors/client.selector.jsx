import "regenerator-runtime/runtime.js";
import "classes/types/prototypes";

import "resources/styles/main.css";

import React from "react";
import BaseControl from "client/controls/abstract/base.control";
import ClientStorage from "client/classes/storage/client.storage";
import CompanyStorage from "client/classes/storage/company.storage";
import ClientSelector from "client/controls/selectors/client.selector";

import { numeric_value } from "client/classes/common";
import { MasterContext } from "client/classes/types/contexts";


export default class ClientSelectorTest extends BaseControl {


	state = { 
		client_data: null,
		selected_client: null
	}


	/********/


	constructor (props) {
		super (props);
		this.state.company_id = 268;
	}// constructor;


	/********/


	client_list = () => ClientStorage.get_by_company (CompanyStorage.active_company_id ());


	/********/


	render () {
		return <MasterContext.Provider value={{ company_id: numeric_value (this.state.company_id), master_page: this }}>

			<div>

				<div className="one-piece-form">

					<ClientSelector id="client_selector" ref={this.client_selector} parent={this} includeOffshoreAccounts={false}
				
						header={"New client"}
						headerSelectable={true}

						selectedClient={this.state.selected_client}
		
						onChange={client_id => this.setState ({ 
							selected_client: client_id,
							updating: true
						})}

						onLoad={data => this.setState ({ client_list: data })}>

					</ClientSelector>


				</div>

				<br /><br />

				<div className="two-column-grid">
					<button onClick={() => this.setState ({ client_data: this.client_list ()})}>Load clients</button>
					<button onClick={() => this.forceRefresh ()}>Force refresh</button>
				</div>

			</div>

		</MasterContext.Provider>
	}// render;


}// LoadListTest;


