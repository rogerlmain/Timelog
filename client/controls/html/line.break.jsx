import React from "react";
import BaseControl from "controls/base.control";

import { is_null } from "classes/common";


export default class Break extends BaseControl {
	static defaultProps = { span: null }
	render () { return <div style={{ gridColumn: is_null (this.props.span) ? "1/-1" : `span ${this.props.span}` }}><br /></div> }
}// Break;