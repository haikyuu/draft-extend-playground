import { compose } from "draft-extend";
import blockStylesPlugin from "./blockStylesPlugin";
import inlineStylesPlugin from "./inlineStylesPlugin";
import linkPlugin from "./linkPlugin";
import mentionPlugin from "./mentionPlugin";
import tokenPlugin from "./tokenPlugin";

export {
  blockStylesPlugin,
  inlineStylesPlugin,
  linkPlugin,
  mentionPlugin,
  tokenPlugin
};

export default compose(
  blockStylesPlugin,
  inlineStylesPlugin,
  linkPlugin,
  mentionPlugin,
  tokenPlugin
);
