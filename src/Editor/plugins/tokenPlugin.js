import { EditorState, Modifier, Entity } from "draft-js";
import { createPlugin, pluginUtils } from "draft-extend";
import React from "react";
import ToolbarButton from "../components/ToolbarButton";
const ENTITY_TYPE = "token";
const { entityStrategy } = pluginUtils;
const TokenDecorator = {
  strategy: entityStrategy(ENTITY_TYPE),
  component: props => {
    return (
      <span
        style={{
          padding: "2px",
          borderRadius: "2px",
          background: "#de6262",
          color: "white"
        }}
      >
        {props.children}
      </span>
    );
  }
};
const entityToHTML = (entity, originalText) => {
  if (entity.type === ENTITY_TYPE) {
    return `{{ ${entity.data.value} }}`;
  }
  return originalText;
};
const textToEntity = text => {
  const results = [];
  const pattern = /\{\{\s?(\w+)\s?\}\}/gi;
  text.replace(pattern, (match, value, offset) => {
    results.push({
      offset,
      length: match.length,
      entity: Entity.create(ENTITY_TYPE, "IMMUTABLE", { value }),
      result: value
    });
  });
  return results;
};
const TokenButton = ({ editorState, onChange }) => {
  const insertToken = () => {
    const contentState = Modifier.insertText(
      editorState.getCurrentContent(),
      editorState.getSelection(),
      "Token Label",
      null,
      Entity.create(ENTITY_TYPE, "IMMUTABLE", {
        value: "token"
      })
    );
    onChange(EditorState.push(editorState, contentState, "insert-characters"));
  };
  return <ToolbarButton label="Insert token" onClick={insertToken} />;
};
const tokenPlugin = createPlugin({
  decorators: TokenDecorator,
  buttons: TokenButton,
  textToEntity,
  entityToHTML
});

export default tokenPlugin;
