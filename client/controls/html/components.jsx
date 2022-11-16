import React from "react";

import { not_set } from "client/classes/common";

export function Break (props) { return <div style={{ gridColumn: not_set (props.span) ? "1/-1" : `span ${props.span}` }}><br /></div> }