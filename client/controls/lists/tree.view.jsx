import React from "react";

import BaseControl from "client/controls/abstract/base.control";
import Container from "client/controls/container";

import { isset, is_function, is_null } from "client/classes/common";
import SettingsStorage from "client/classes/storage/settings.storage";


const branch_style = {
	display: "flex",
	flexDirection: "column",
	justifyContent: "flex-end",
	overflow: "hidden",
	boxSizing: "content-box",
	gridColumn: 2,
}// branch_style;


const leaf_style = { boxSizing: "content-box" }


const glyph_style = { 
	transition: `transform 250ms ease-in-out`,
	cursor: "pointer",
}// glyph_style;


/********/


class TreeBranch extends BaseControl {


	static defaultProps = { 

		data: null,
		fields: null,
		value: null,

		header: null,
		row: null,
		footer: null,

	}// defaultProps;


	state = { open: false }


	tree_branch = React.createRef ();


	/********/


	subset = (field, value) => {

		let result = null;

		if (isset (this.props.data)) this.props.data.forEach (item => {
			if (item [field] == value) {
				if (is_null (result)) result = [];
				result.push (item);
			}// if;
		});

		return result;

	}// subset;


	tree_list = (data) => {

		let result = null;

		if (isset (data)) data.forEach (item => {
			if (is_null (result)) result = [];
			if (is_function (this.props.row)) return result.push (<Container key={this.create_key ()}>{this.props.row (item)}</Container>);
			return result.push (<Container key={this.create_key ()}>{JSON.stringify (item)}</Container>);
		});

		if (isset (this.props.footer)) result.push (is_function (this.props.footer) ? <Container key={this.create_key ()}>
			{this.props.footer (data)}
		</Container> : this.props.footer);

		return result;

	}// tree_list;


	/********/


	componentDidMount () {

		let node = this.tree_branch.current;

		if (isset (node)) node.addEventListener ("transitionend", event => {
			if (event.propertyName != "height") return;
			if (node.clientHeight == node.children [0].offsetHeight) node.thaw ();
		});

	}// componentDidMount;


	render () {
		
		let dataset = this.subset (this.props.fields [0], this.props.value);

		return <div>
			<div className="two-column-grid">

				<div className="arrow-glyph"

					onClick={() => {

						if (this.state.open) this.tree_branch.current.freeze ();
						setTimeout (() => this.setState ({ open: !this.state.open }));
					}}>
						
					<div className="tree-glyph" style={{ ...glyph_style, transform: `rotate(${this.state.open ? "90deg" : 0})` }} />

				</div>

				<div>{is_function (this.props.header) ? this.props.header (dataset, this.props.fields [0]) : (isset (this.props.value) ? this.props.value : null)}</div>

				<div ref={this.tree_branch} 
				
					style={{ ...branch_style, 
						transition: this.transition_style ("height"),
						height: (this.state.open && isset (this.tree_branch.current)) ? `${this.tree_branch.current.children [0].offsetHeight}px` : "0px" 
					}}>

					<div style={leaf_style}>

						<Container visible={this.props.fields.length  > 1}>
							<TreeView data={dataset} fields={this.props.fields.slice (1)} row={this.props.row} header={this.props.header} footer={this.props.footer} />
						</Container>

						<Container visible={this.props.fields.length == 1}>
<div className="outlined">
							{this.tree_list (dataset)}
</div>
						</Container>

					</div>
				</div>

			</div>
		</div>

	}// render;


}// TreeBranch;


/********/


export default class TreeView extends BaseControl {


	static defaultProps = { 

		data: null,
		fields: null,

		row: null,
		header: null,
		footer: null,

	}// defaultProps;


	field_values = () => {

		let values = null;

		if (isset (this.props.data)) this.props.data.forEach (item => {

			let field_value = item [this.props.fields [0]];

			if (isset (field_value)) {
				if (is_null (values)) values = new Set ();
				values.add (field_value);
			}// if;

		});

		return isset (values) ? Array.from (values) : null;

	}// field_values;


	/********/


	render () { 

		let rows = null;
		let values = this.field_values ();

		if (isset (values)) values.forEach (value => {
			if (is_null (rows)) rows = [];
			rows.push (<TreeBranch key={this.create_key ()} value={value} 
				data={this.props.data} fields={this.props.fields} 
				row={this.props.row} header={this.props.header} footer={this.props.footer}>
			</TreeBranch>);
		});
		
		return rows;
	
	}// render;


}// TreeView;
