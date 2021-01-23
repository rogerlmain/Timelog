import React from "react";


export default class ReferenceList {


	constructor (...references: any) {
		for (let reference of references) {
			this [reference] = React.createRef ();
		}// for;
	}// constructor;


}// ReferenceList;