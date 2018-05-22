import React from "react";
import {
  EditorState,
  Modifier,
  Entity,
  SelectionState,
  getVisibleSelectionRect
} from "draft-js";
import { Editor, createPlugin, pluginUtils } from "draft-extend";
import { convertToHTML, convertFromHTML } from "draft-convert";
import PropTypes from "prop-types";
const ENTITY_TYPE = "mention";
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

const MentionDecorator = {
  strategy: pluginUtils.entityStrategy(ENTITY_TYPE),
  component: props => {
    return (
      <span
        style={{
          padding: "2px",
          borderRadius: "2px",
          background: "blue",
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
    return `@${entity.data.value}`;
  }
  return originalText;
};
const textToEntity = text => {
  const results = [];
  const pattern = /@([\w\d]+)/gi;
  text.replace(pattern, (match, value, offset) => {
    const user = users.find(u => {
      return u.value === value;
    });
    results.push({
      offset,
      length: match.length,
      entity: Entity.create(ENTITY_TYPE, "IMMUTABLE", { value }),
      result: user.text
    });
  });
  return results;
};
class MentionResults extends React.Component {
  static propTypes = {
    search: PropTypes.string.isRequired,
    offset: PropTypes.number.isRequired,
    length: PropTypes.number.isRequired,
    results: PropTypes.array.isRequired,
    onSelect: PropTypes.func.isRequired,
    addKeyCommandListener: PropTypes.func.isRequired,
    removeKeyCommandListener: PropTypes.func.isRequired
  };
  state = {
    selection: 0
  };
  componentDidMount() {
    this.props.addKeyCommandListener(this.handleKeyCommand);
  }
  componentWillUnmount() {
    this.props.removeKeyCommandListener(this.handleKeyCommand);
  }
  handleKeyCommand = (editorState, command, keyboardEvent) => {
    const { search, offset, length, results, onSelect } = this.props;
    const { selection } = this.state;
    const option = selection < results.length ? results[selection] : null;
    switch (command) {
      case "return":
      case "tab":
        keyboardEvent.preventDefault();
        keyboardEvent.stopPropagation();
        if (option !== null) {
          onSelect(option, { search, offset, length });
          return true;
        }
        return null;
      case "up-arrow":
        keyboardEvent.preventDefault();
        this.arrowUp();
        return true;
      case "down-arrow":
        keyboardEvent.preventDefault();
        this.arrowDown();
        return true;
      default:
        return null;
    }
  };
  arrowUp = () => {
    const { selection } = this.state;
    if (selection > 0) {
      this.setState({
        selection: selection - 1
      });
    }
  };
  arrowDown = () => {
    const { results } = this.props;
    const { selection } = this.state;
    if (results.length > selection + 1) {
      this.setState({
        selection: selection + 1
      });
    }
  };
  selectItem = ({ value, text }) => {
    const { search, offset, length, onSelect } = this.props;
    onSelect({ value, text }, { search, offset, length });
  };
  renderResults = () => {
    const { results } = this.props;
    const { selection } = this.state;
    const itemStyle = {
      listStyleType: "none",
      padding: "4px",
      background: "white",
      cursor: "pointer"
    };
    if (results.length === 0) {
      return (
        <ul
          style={{
            margin: "0",
            padding: "0",
            fontFamily: "sans-serif"
          }}
        >
          <li style={itemStyle} key="empty">
            No matches found
          </li>
        </ul>
      );
    }
    return results.slice(0, 5).map((option, index) => {
      const highlighted = selection === index;
      let style = itemStyle;
      if (highlighted) {
        style = Object.assign({}, itemStyle, {
          background: "blue",
          color: "white"
        });
      }
      const handleClick = () => {
        this.selectItem(option);
      };
      return (
        <li key={option.value} style={style} onClick={handleClick}>
          {option.text}
        </li>
      );
    });
  };
  render() {
    return (
      <ul
        style={{
          margin: "0",
          padding: "0",
          fontFamily: "sans-serif"
        }}
      >
        {this.renderResults()}
      </ul>
    );
  }
}
const TYPING_TRIGGER_REGEX = new RegExp("(\\B@[\\w\\s]{1,10})$");
class MentionOverlay extends React.Component {
  static propTypes = {
    editorState: PropTypes.object.isRequired,
    onChange: PropTypes.func.isRequired,
    addKeyCommandListener: PropTypes.func.isRequired,
    removeKeyCommandListener: PropTypes.func.isRequired
  };
  getCurrentSearch = () => {
    const selection = this.props.editorState.getSelection();
    const contentState = this.props.editorState.getCurrentContent();
    const blockText = contentState
      .getBlockForKey(selection.getStartKey())
      .getText();
    const offset = selection.getStartOffset();
    if (!selection.isCollapsed()) {
      return null;
    }
    const matchArray = blockText.slice(0, offset).match(TYPING_TRIGGER_REGEX);
    if (matchArray === null) {
      return null;
    }
    const beforeCursorText = matchArray[1].slice(1);
    const pastCursorMatch = blockText.slice(offset).match(/^\w+/);
    const pastCursorText = pastCursorMatch !== null ? pastCursorMatch[0] : "";
    return {
      search: beforeCursorText + pastCursorText,
      offset: offset - beforeCursorText.length - 1,
      length: 1 + beforeCursorText.length + pastCursorText.length
    };
  };
  selectOption = (option, { offset, length }) => {
    const { editorState, onChange } = this.props;
    const blockKey = editorState.getSelection().getStartKey();
    const replaceSelection = SelectionState.createEmpty(blockKey).merge({
      anchorOffset: offset,
      focusOffset: offset + length,
      isBackward: false,
      hasFocus: true
    });
    const contentState = Modifier.replaceText(
      editorState.getCurrentContent(),
      replaceSelection,
      option.text,
      null,
      Entity.create(ENTITY_TYPE, "IMMUTABLE", option)
    );
    onChange(EditorState.push(editorState, contentState, "insert-characters"));
  };
  getResults = search => {
    const regex = new RegExp(search.trim(), "i");
    return this.props.users.filter(({ value, text }) => {
      return (
        text.match(regex) !== null || value.toString().match(regex) !== null
      );
    });
  };
  render() {
    const { addKeyCommandListener, removeKeyCommandListener } = this.props;
    const currentSearch = this.getCurrentSearch();
    const shouldBeOpen = currentSearch !== null;
    if (shouldBeOpen) {
      const { top, left, height } = getVisibleSelectionRect(window);
      const results = this.getResults(currentSearch.search);
      const clickOption = option => {
        return this.selectOption(option, currentSearch);
      };
      return (
        <div
          style={{
            position: "absolute",
            top: `${top + height}px`,
            left: `${left}px`,
            boxShadow: "0 4px 11px rgba(0, 0, 0, 0.2)"
          }}
        >
          <MentionResults
            {...currentSearch}
            results={results}
            onSelect={this.selectOption}
            addKeyCommandListener={addKeyCommandListener}
            removeKeyCommandListener={removeKeyCommandListener}
          />
        </div>
      );
    }
    return null;
  }
}
const MentionPlugin = createPlugin({
  decorators: MentionDecorator,
  overlays: MentionOverlay,
  textToEntity,
  entityToHTML
});
const WithPlugin = MentionPlugin(Editor);
const toHTML = MentionPlugin(convertToHTML);
const fromHTML = MentionPlugin(convertFromHTML);
export default class MentionExample extends React.Component {
  state = {
    editorState: EditorState.createWithContent(
      fromHTML(
        "<div>Mention example @user1. Type @ to add a new mention for User 1 or User 2</div>"
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
      <WithPlugin
        editorState={this.state.editorState}
        onChange={this.onChange}
        users={users}
      />
    );
  }
}
