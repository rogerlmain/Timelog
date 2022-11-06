import React from "react";
import BaseControl from "client/controls/abstract/base.control";

import { location_id } from "client/classes/types/constants";


const application_id = "sandbox-sq0idb-i9_IjjiYVUfBsBoNCFh9LA";
const access_token = "EAAAENzB7zMQb2M5FW6MpbnIMXfvwLdonwGI9XxqtkwT86LvxuWpW4N_SyI67cjJ";


export default class SquareTest extends BaseControl {


	render () {
		return <div id="square_thing">
			

			<button onClick={async () => {
				const payments = Square.payments (application_id, location_id);
				const card = await payments.card ();
				
				await card.attach ("#square_form");

			}}>Pay up, sucker!</button>

			<br />

			<div id="square_form" />


		</div>
	}// render;


}// SquareTest;