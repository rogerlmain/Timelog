import "regenerator-runtime/runtime.js";
import "classes/types/prototypes";

import "resources/styles/main.css";

import React from "react";
import BaseControl from "client/controls/abstract/base.control";

import ExpandingInput from "client/controls/inputs/expanding.input.jsx";
import { notify } from "client/classes/common";


export default class Test extends BaseControl {


	render () {
		return <div className="full-screen fully-centered" style={{ border: "solid 1px blue !important" }}>
			<ExpandingInput value="$0.00" readOnly={false} />
		</div>
	}// render;


}// Test;
