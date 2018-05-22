import React from "react";
import { EditorState } from "draft-js";
import { Editor, Toolbar, KeyCommandController } from "draft-extend";
import { convertToHTML, convertFromHTML } from "draft-convert";
import plugins from "./plugins";

const WithPlugin = plugins(Editor);
export const WithPluginToolbar = plugins(Toolbar);
const toHTML = plugins(convertToHTML);
const fromHTML = plugins(convertFromHTML);

const users = [
  {
    value: "user1",
    text: "User 1"
  },
  {
    value: "user2",
    text: "User 2"
  }
];

class AllPluginsExample extends React.Component {
  state = {
    editorState: EditorState.createWithContent(
      fromHTML(
        "<h1>Block style plugin</h1><ul><li>list item 1</li><li>list item 2</li></ul>"
      )
    )
  };
  print = () => {
    const { editorState } = this.state;
    return toHTML(editorState.getCurrentContent());
  };
  onChange = editorState => {
    this.setState({ editorState });
  };
  render() {
    return (
      <div>
        <WithPlugin
          {...this.props}
          editorState={this.state.editorState}
          onChange={this.onChange}
          users={users}
        />
      </div>
    );
  }
}
// const WrappedComponent = KeyCommandController(AllPluginsExample);

export default AllPluginsExample;
