import * as React from "react";

import BaseControl, { DefaultProps } from "./base.control";


interface EyecandyProps extends DefaultProps {
	text: String;
	subtext?: String;
	onLoad?: any;
}// EyecandyProps;


export default class Eyecandy extends BaseControl<EyecandyProps> {

	public props: EyecandyProps;

	render () {
		return (
			<div className="eyecandy-cell">

				<img src="resources/images/eyecandy.gif" />

				{/* <div><img src="resources/images/eyecandy.gif" 
				
					onLoad={()=>{

//						this.execute.bind (this) (this.props.onLoad);

					}}
					
					onError={()=> { alert ("error"); }}>

				</img></div> */}

				<div>
					<div>{this.props.text ?? "Processing..."}</div>
					<div>{this.props.subtext ?? "One moment, please"}</div>
				</div>
			</div>
		);
	}// render;

}// ExplodingPanel;