"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = undefined;

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = require("react");

var _react2 = _interopRequireDefault(_react);

var _reactTextareaAutosize = require("react-textarea-autosize");

var _reactTextareaAutosize2 = _interopRequireDefault(_reactTextareaAutosize);

var _reactPopover = require("react-popover");

var _reactPopover2 = _interopRequireDefault(_reactPopover);

var _VideoPopover = require("./VideoPopover.js");

var _VideoPopover2 = _interopRequireDefault(_VideoPopover);

var _megadraft = require("megadraft");

var _aphrodite = require("aphrodite");

var _PulseLoader = require("halogen/PulseLoader");

var _PulseLoader2 = _interopRequireDefault(_PulseLoader);

var _draftJs = require("draft-js");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; } /*
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                * Copyright (c) 2017, Itai Reuveni <itaireuveni@gmail.com>
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                *
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                * License: MIT
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                */

var BlockContent = _megadraft.MegadraftPlugin.BlockContent,
    BlockData = _megadraft.MegadraftPlugin.BlockData,
    BlockInput = _megadraft.MegadraftPlugin.BlockInput,
    CommonBlock = _megadraft.MegadraftPlugin.CommonBlock;

var Block = function (_Component) {
  _inherits(Block, _Component);

  function Block(props) {
    _classCallCheck(this, Block);

    var _this = _possibleConstructorReturn(this, (Block.__proto__ || Object.getPrototypeOf(Block)).call(this, props));

    _this.handleClickOut = function (e) {
      // mousedown event that removes the border from the video
      if (_this.video && !_this.video.contains(e.target)) {
        _this.setState({
          focus: false
        });
      }
    };

    _this.uploadFile = function (file) {
      _this.props.blockProps.plugin.uploadFile(file).then(function (result) {
        var videoURL = _this.props.blockProps.plugin.uploadCallback(result);
        var data = {
          videoSrc: videoURL,
          load: false,
          file: null,
          type: _this.props.data.type
        };

        _this.props.container.updateData(data);
      });
    };

    _this._handleCaptionChange = _this._handleCaptionChange.bind(_this);
    _this._clearPlaceholder = _this._clearPlaceholder.bind(_this);
    _this._putPlaceholder = _this._putPlaceholder.bind(_this);
    _this.changeWidth = _this.changeWidth.bind(_this);

    _this.state = {
      placeholder: "Type caption here (optional)",
      open: false,
      width: '75%',
      focus: false
    };

    _this.actions = [{ "key": "delete", "icon": _megadraft.MegadraftIcons.DeleteIcon, "action": _this.props.container.remove }];
    return _this;
  }

  _createClass(Block, [{
    key: "_handleCaptionChange",
    value: function _handleCaptionChange(event) {
      this.props.container.updateData({ caption: event.target.value });
    }
  }, {
    key: "_clearPlaceholder",
    value: function _clearPlaceholder(event) {
      this.setState({ placeholder: "" });
    }
  }, {
    key: "_putPlaceholder",
    value: function _putPlaceholder(event) {
      this.setState({ placeholder: "Type caption here (optional)" });
    }
  }, {
    key: "handleClick",
    value: function handleClick(e) {
      this.setState({
        open: !this.state.open,
        focus: !this.state.focus
      });
    }
  }, {
    key: "handleClose",
    value: function handleClose(e) {
      this.setState({ open: false });
    }
  }, {
    key: "changeWidth",
    value: function changeWidth(width) {
      this.setState({ width: width });
    }

    /***
     * Upload a file with the passed in upload file function
     * @params file -- file object
     */

  }, {
    key: "componentDidMount",
    value: function componentDidMount() {
      var readOnly = this.props.blockProps.getInitialReadOnly();
      // Only add the mousedown event if we're readonly.
      if (readOnly) {
        document.addEventListener('mousedown', this.handleClickOut);
      }

      if (!this.props.data.videoSrc) {
        this.uploadFile(this.props.data.file);
      }
    }
  }, {
    key: "componentDidUpdate",
    value: function componentDidUpdate(prevProps, prevState) {

      if (this.video && !this.state.videoClicked && !this.props.blockProps.getInitialReadOnly()) {
        this.video.click();
        this.textArea.focus();
        this.setState({
          videoClicked: true
        });
      }
    }
  }, {
    key: "componentWillUnmount",
    value: function componentWillUnmount() {
      document.removeEventListener('mousedown', this.handleClickOut);
    }
  }, {
    key: "render",
    value: function render() {
      var _this2 = this;

      // TODO: what do we render if we don't have an video?
      var readOnly = this.props.blockProps.getInitialReadOnly();
      var loadOptions = _extends({
        color: "#26A65B",
        size: "16px",
        margin: "4px"
      }, this.props.blockProps.plugin.loadOptions);
      return _react2.default.createElement(
        "div",
        { className: (0, _aphrodite.css)(styles.inputWrapper) },
        _react2.default.createElement(
          "div",
          { className: "block" },
          _react2.default.createElement(
            "div",
            { className: (0, _aphrodite.css)(styles.videoDiv) },
            this.props.data.videoSrc ? _react2.default.createElement(
              _reactPopover2.default,
              {
                className: (0, _aphrodite.css)(styles.popover),
                body: _react2.default.createElement(_VideoPopover2.default, { changeWidth: this.changeWidth, width: this.state.width }),
                preferPlace: "above",
                place: "column",
                onOuterAction: this.handleClick.bind(this),
                isOpen: this.state.open },
              _react2.default.createElement("video", {
                src: this.props.data.videoSrc,
                ref: function ref(video) {
                  return _this2.video = video;
                },
                controls: true,
                className: (0, _aphrodite.css)(styles.video, this.state.focus && styles.focus),
                style: { width: this.state.width },
                onClick: readOnly ? null : this.handleClick.bind(this)
              })
            ) : _react2.default.createElement(_PulseLoader2.default, loadOptions)
          ),
          readOnly && this.props.data.caption || !readOnly ? _react2.default.createElement(_reactTextareaAutosize2.default, {
            id: "caption",
            inputRef: function inputRef(ref) {
              return _this2.textArea = ref;
            },
            rows: 1,
            disabled: readOnly,
            placeholder: this.state.placeholder,
            className: (0, _aphrodite.css)(styles.input),
            onChange: this._handleCaptionChange,
            value: this.props.data.caption
          }) : null
        )
      );
    }
  }]);

  return Block;
}(_react.Component);

exports.default = Block;


var styles = _aphrodite.StyleSheet.create({
  inputWrapper: {
    width: '100%',
    textAlign: 'center'

  },
  input: {
    border: 'none',
    outline: 'none',
    fontSize: '14px',
    color: 'rgba(0,0,0,.6)',
    paddingLeft: '15px',
    paddingBottom: '15px',
    width: '100%',
    textAlign: 'center',
    resize: 'none'
  },
  videoDiv: {
    position: 'relative',
    height: '100%',
    width: '100%',
    overflow: 'hidden'
  },
  video: {
    height: 'auto',
    overflow: 'hidden'
  },
  popover: {
    zIndex: '2'
  },
  focus: {
    border: '3px solid #48e79a'
  }
});