import React from "react";

import { not_set } from "classes/common";


// export class Break extends BaseControl {
// 	static defaultProps = { span: null }
// 	render () { return <div style={{ gridColumn: is_null (this.props.span) ? "1/-1" : `span ${this.props.span}` }}><br /></div> }
// }// Break;



export function Break (props) { return <div style={{ gridColumn: not_set (props.span) ? "1/-1" : `span ${props.span}` }}><br /></div> }