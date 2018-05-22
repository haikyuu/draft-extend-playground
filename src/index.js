import React from "react";
import { render } from "react-dom";
import "draft-js/dist/Draft.css";
import "draft-extend/dist/draft-extend.css";
import "antd/dist/antd.css";
import "tachyons/css/tachyons.min.css";
import { Tabs, Divider, Button } from "antd";
import "./index.css";
import All from "./Editor/All";

const TabPane = Tabs.TabPane;

class App extends React.Component {
  state = {
    html: "",
    activeTab: "All"
  };
  _onConvertClick = () => {
    const { activeTab } = this.state;
    const html = this[activeTab].print();
    this.setState({ html });
  };
  render() {
    const { html } = this.state;
    return (
      <div>
        <Tabs
          defaultActiveKey="All"
          onChange={key => this.setState({ activeTab: key })}
        >
          <TabPane tab="All" key="All">
            <All
              ref={instance => {
                this.All = instance;
              }}
            />
          </TabPane>
        </Tabs>
        <Divider />
        <div className="flex justify-center">
          <Button type="primary" onClick={this._onConvertClick}>
            Convert to HTML
          </Button>
        </div>
        <h3>HTML Code</h3>
        <div className="bg-near-white min-h4 mv2 pa1">{html}</div>
        <h3>Output</h3>
        <div
          className="ba b--red min-h4 mt2 pa1"
          dangerouslySetInnerHTML={{ __html: html }}
        />
      </div>
    );
  }
}
render(<App />, document.getElementById("root"));
