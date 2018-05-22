import React from "react";
import { Button } from "antd";

export default class ToolbarButton extends React.Component {
  static defaultProps = {
    active: false,
    label: "",
    onClick: function() {}
  };
  render() {
    var toolbarButtonStyle = {};

    if (this.props.active) {
      toolbarButtonStyle.backgroundColor = "#000";
      toolbarButtonStyle.color = "#fff";
    }
    return (
      <Button style={toolbarButtonStyle} onClick={this.props.onClick}>
        {this.props.label}
      </Button>
    );
  }
}
