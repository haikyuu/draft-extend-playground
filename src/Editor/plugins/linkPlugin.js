import React from "react";
import { EditorState, Modifier, Entity } from "draft-js";
import { createPlugin, pluginUtils } from "draft-extend";
import { Button } from "antd";
const ENTITY_TYPE = "LINK";

// Button component to add below the editor
const LinkButton = ({ editorState, onChange }) => {
  const addLink = () => {
    const contentState = Modifier.applyEntity(
      editorState.getCurrentContent(),
      editorState.getSelection(),
      Entity.create(ENTITY_TYPE, "MUTABLE", {
        href: "http://draftjs.org",
        target: "_blank"
      })
    );
    onChange(EditorState.push(editorState, contentState, "apply-entity"));
  };
  return <Button onClick={addLink}>Add Draft Link</Button>;
};
// Decorator to render links while editing
const LinkDecorator = {
  strategy: pluginUtils.entityStrategy(ENTITY_TYPE),
  component: props => {
    const entity = Entity.get(props.entityKey);
    const { href, target } = entity.getData();
    return (
      <a href={href} target={target}>
        {props.children}
      </a>
    );
  }
};
// Convert links in input HTML to entities
const htmlToEntity = (nodeName, node) => {
  if (nodeName === "a") {
    return Entity.create(ENTITY_TYPE, "MUTABLE", {
      href: node.getAttribute("href"),
      target: node.getAttribute("target")
    });
  }
};
// Convert entities to HTML for output
const entityToHTML = (entity, originalText) => {
  if (entity.type === ENTITY_TYPE) {
    return `<a href="${entity.data.href}" target="${
      entity.data.target
    }">${originalText}</a>`;
  }
  return originalText;
};

const linkPlugin = createPlugin({
  displayName: "LinkPlugin",
  buttons: LinkButton,
  decorators: LinkDecorator,
  htmlToEntity,
  entityToHTML
});
export default linkPlugin;
