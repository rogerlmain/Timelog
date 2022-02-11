import * as React from "react";


declare global {
	namespace JSX {
		interface IntrinsicElements {
			break: any
		}// IntrinsicElements;
	}// JSX;
}// global;



declare module "react" {

	/* 	
		Kept as an example:
	
		interface HTMLAttributes<T> extends AriaAttributes, DOMAttributes<T> {
			additional_attribute?: Function;
		}// HTMLAttributes;
	*/

	interface BaseSyntheticEvent {
		targetValue?: any
	}// BaseSyntheticEvent;

}// react;
