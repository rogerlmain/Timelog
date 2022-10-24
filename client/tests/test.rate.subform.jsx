import "classes/types/prototypes";
import "resources/styles/main.css";

import React from "react";

import BaseControl from "client/controls/abstract/base.control";
import RateSubform from "client/forms/subforms/rate.subform";


export default class Test extends BaseControl {


	render () { 
		return <div className="outlined one-piece-form">
			<RateSubform id="rsf1" />
			<RateSubform id="rsf2" clientId={138} />
			<RateSubform id="rsf3" clientId={138} projectId={165} />
		</div>
	}// render;


}// TreeTest;