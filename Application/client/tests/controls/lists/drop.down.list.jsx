import React from "react";
import BaseControl from "client/controls/abstract/base.control";

import DropDownList from "client/controls/lists/drop.down.list";

import "resources/styles/main.css";
import "resources/styles/controls.css";


export default class LoadListTest extends BaseControl {


	render = () => <div style={{ width: "100%", height: "100%", display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center" }}>

		<div id="output">Idle</div>

		<br /><br />
<div style={{ border: "solid 2px red" }}>
		<DropDownList speed={200} 
		
			beforeOpening={() => document.getElementById ("output").innerText = "before opening"}
			afterOpening={() =>  document.getElementById ("output").innerText = "after opening"}
			beforeClosing={() => document.getElementById ("output").innerText = "before closing"}
			afterClosing={() =>  document.getElementById ("output").innerText = "after closing"}>

			<div value="1">One</div>
			<div value="2">Two</div>
			<div value="3">Three</div>

		</DropDownList>
</div>
	</div>


}// LoadListTest;


