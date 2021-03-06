import React from "react";
import { RichUtils } from "draft-js";
import { createPlugin } from "draft-extend";
import ToolbarButton from "../components/ToolbarButton";

const INLINE_STYLES = [
  { label: "Bold", style: "BOLD" },
  { label: "Italic", style: "ITALIC" },
  { label: "Underline", style: "UNDERLINE" },
  { label: "Code", style: "CODE" },
  { label: "Strikethrough", style: "STRIKETHROUGH" }
];
const styleToHTML = style => {
  if (style === "STRIKETHROUGH") {
    return <s />;
  }
  if (style === "CODE") {
    return <div style={{ fontFamily: "monospace" }} />;
  }
};
const createInlineStyle = ({ label, style }) => {
  return ({ editorState, onChange }) => {
    const toggleStyle = () => {
      onChange(RichUtils.toggleInlineStyle(editorState, style));
    };
    const currentInlineStyle = editorState.getCurrentInlineStyle();
    const isActive = currentInlineStyle.has(style);
    return (
      <ToolbarButton active={isActive} label={label} onClick={toggleStyle} />
    );
  };
};
const inlinePlugin = createPlugin({
  buttons: INLINE_STYLES.map(createInlineStyle),
  styleToHTML
});
export default inlinePlugin;
// const WithPlugin = InlinePlugin(Editor);
// const toHTML = InlinePlugin(convertToHTML);
// const fromHTML = InlinePlugin(convertFromHTML);
// export default class InlineStylesExample extends React.Component {
//   state = {
//     editorState: EditorState.createWithContent(
//       fromHTML("<div><strong>Inline</strong> styles <em>example</em></div>")
//     )
//   };
//   onChange = editorState => {
//     console.log(toHTML(editorState.getCurrentContent()));
//     this.setState({ editorState });
//   };
//   render() {
//     return (
//       <WithPlugin
//         editorState={this.state.editorState}
//         onChange={this.onChange}
//         keyCommandListeners={[RichUtils.handleKeyCommand]}
//       />
//     );
//   }
// }
