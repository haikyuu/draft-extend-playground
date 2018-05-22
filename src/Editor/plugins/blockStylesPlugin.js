import React from "react";
import { RichUtils } from "draft-js";
import {
  // Editor,
  // Toolbar,
  // KeyCommandController,
  createPlugin
} from "draft-extend";
import ToolbarButton from "../components/ToolbarButton";
const BLOCK_TYPES = [
  { label: "Plain", style: "unstyled" },
  { label: "H1", style: "header-one" },
  { label: "H2", style: "header-two" },
  { label: "H3", style: "header-three" },
  { label: "H4", style: "header-four" },
  { label: "H5", style: "header-five" },
  { label: "H6", style: "header-six" },
  { label: "Blockquote", style: "blockquote" },
  { label: "UL", style: "unordered-list-item" },
  { label: "OL", style: "ordered-list-item" },
  { label: "Code Block", style: "code-block" }
];
const createBlockStyleButton = ({ label, style }) => {
  return ({ editorState, onChange }) => {
    const toggleStyle = () => {
      onChange(RichUtils.toggleBlockType(editorState, style));
    };
    const currentBlockStyle = editorState
      .getCurrentContent()
      .getBlockForKey(editorState.getSelection().getStartKey())
      .getType();
    const isActive = currentBlockStyle === style;
    return (
      <ToolbarButton active={isActive} label={label} onClick={toggleStyle} />
    );
  };
};
const BlockPlugin = createPlugin({
  buttons: BLOCK_TYPES.map(createBlockStyleButton)
});
export default BlockPlugin;
// const WithPlugin = BlockPlugin(Editor);
// export const WithPluginToolbar = BlockPlugin(Toolbar);
// const toHTML = BlockPlugin(convertToHTML);
// const fromHTML = BlockPlugin(convertFromHTML);
// class BlockStylesExample extends React.Component {
//   state = {
//     editorState: EditorState.createWithContent(
//       fromHTML(
//         "<h1>Block style plugin</h1><ul><li>list item 1</li><li>list item 2</li></ul>"
//       )
//     )
//   };
//   print = () => {
//     const { editorState } = this.state;
//     return toHTML(editorState.getCurrentContent());
//   };
//   onChange = editorState => {
//     this.setState({ editorState });
//   };
//   render() {
//     return (
//       <div>
//         <WithPlugin
//           {...this.props}
//           editorState={this.state.editorState}
//           onChange={this.onChange}
//         />
//         <WithPluginToolbar
//           {...this.props}
//           editorState={this.state.editorState}
//           onChange={this.onChange}
//         />
//       </div>
//     );
//   }
// }
// const WrappedComponent = KeyCommandController(BlockStylesExample);

// export default WrappedComponent;
