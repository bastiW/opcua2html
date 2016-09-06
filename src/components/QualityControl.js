import React, { Component } from 'react';
import QualityControlNode from './QualityControlNode';
import './styles/Button.css';
import Select from 'react-select';
import 'react-select/dist/react-select.css';

export default class QualityControl extends Component {

  constructor(props) {
    super(props);
    const { opcData } = this.props;
    this.qcAPI = require('../api')['qualityControlAPI'];

    this.utils = {
      noUndef: (val) => (val) ? val.value : null
    }

    this.state = {
      qcobjects: this.qcAPI
        .map((object) => ({ name: object.name, isOpen: false })),
      options: this.qcAPI
        .filter((option) => opcData.find((node) => node.nodeId === option.ist))
        .map((object) => ({ label: object.name, value: object.name })),
      value: []
    };
  }

  componentWillReceiveProps(nextProps) {
    const { opcData } = nextProps;
    const { qcobjects } = this.state;
    const { noUndef } = this.utils;

    this.setState({
      qcobjects: this.qcAPI
        .map((object, i) => Object.assign(qcobjects[i], {
          ref: noUndef(opcData.find(node => node.nodeId === object.ref)),
          ist: noUndef(opcData.find(node => node.nodeId === object.ist)),
          tol: noUndef(opcData.find(node => node.nodeId === object.tol))
        }))
    });
  }

  render() {
    const { value, qcobjects } = this.state;
    return (
      <section>
        <h3>Quality Control</h3>
			  <div className="section">
				  <h3 className="section-heading">{this.props.label}</h3>
				  <Select multi simpleValue 
            value={this.state.value} 
            placeholder="Select your nodes" 
            options={this.state.options} 
            onChange={this.setQualityNodeState}
          />
			  </div>
          <QualityControlNode
              selected={value}
              data={qcobjects}
              onDelete={this.deleteQualityNode}
              onCollapse={this.collapseNode}
          />
      </section>
    );
  }

  collapseNode = (id, e) => {
    e.stopPropagation();
    this.setState({
      qcobjects: this.state.qcobjects
        .map((object) =>
          (object.name === id) ?
          Object.assign(object, { isOpen: !object.isOpen }) :
          object
        )
    });
  }

  setQualityNodeState = (value) => {
    this.setState({
      value: (value) ? value.split(',') : []
    });
  }

  deleteQualityNode = (id, e) => {
    e.stopPropagation();
    this.setState({
      value: this.state.value.filter(val => val !== id)
    });
  }
}
