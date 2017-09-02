/*
 * Copyright (c) 2017, Itai Reuveni <itaireuveni@gmail.com>
 *
 * License: MIT
 */

import React, {Component} from "react";

import TextAreaAutoSize from "react-textarea-autosize";

import Popover from "react-popover";

import VideoPopover from './VideoPopover.js';

import {MegadraftPlugin, MegadraftIcons} from "megadraft";

import {StyleSheet, css} from 'aphrodite';
import Loader from 'halogen/PulseLoader';

// IPFS Config
import { ipfsConfig, IPFS_ADDRESS } from './ipfs-config';
import { getFiles } from './ipfs-helper';

const IPFS = window.Ipfs;

const {BlockContent, BlockData, BlockInput, CommonBlock} = MegadraftPlugin;


export default class Block extends Component {

  constructor(props) {
    super(props);

    this._handleCaptionChange = ::this._handleCaptionChange;
    this._clearPlaceholder = ::this._clearPlaceholder;
    this._putPlaceholder = ::this._putPlaceholder;
    this.changeWidth = ::this.changeWidth;
    this.state = {
        placeholder: "Type caption here (optional)",
        open: false,
        width: '75%',
        focus: false,
    }

    this.actions = [
      {"key": "delete", "icon": MegadraftIcons.DeleteIcon, "action": this.props.container.remove}
    ];
  }

  _handleCaptionChange(event) {
    this.props.container.updateData({caption: event.target.value});
  }

  _clearPlaceholder(event) {
    this.setState({placeholder: ""});
  }

  _putPlaceholder(event) {
    this.setState({placeholder: "Type caption here (optional)"});
  }

  handleClick(e) {
    this.setState({
      open: !this.state.open,
      focus: !this.state.focus,
    });
  }

  handleClose(e) {
    this.setState({open: false});
  }

  changeWidth(width) {
    this.setState({width: width});
  }

  handleClickOut = (e) => {
    // mousedown event that removes the border from the video
    if (this.video && !this.video.contains(e.target)) {
      this.setState({
        focus: false
      });
    }
  }

  componentDidMount() {
    if (this.video)
      this.video.click();
    var readOnly = this.props.blockProps.getInitialReadOnly();
    
    // Only add the mousedown event if we're not readonly.
    if (readOnly) {
      document.addEventListener('mousedown', this.handleClickOut);
    }

    if (IPFS) {
      this.node = new IPFS(ipfsConfig);
      this.node.on('ready', () => {
        this.setState({
          ipfsConnected: true,
        });
      });
    }
  }

  componentDidUpdate(prevProps, prevState) {
    if (this.state.ipfsConnected && !prevState.ipfsConnected) {
      getFiles(this.props.data.videoHash, this.node).then((blobUrl) => {
        this.setState({
          blobUrl: blobUrl[0],
        });
      });
    }
  }

  componentWillUnmount() {
    document.removeEventListener('mousedown', this.handleClickOut);
  }


  render(){
    // TODO: what do we render if we don't have an video?
    var readOnly = this.props.blockProps.getInitialReadOnly();
    return (
      <div className={css(styles.inputWrapper)}>
        <div className="block">
          <div className={css(styles.videoDiv)}>
            <Popover
              className={css(styles.popover)}
              body={<VideoPopover changeWidth={this.changeWidth} width={this.state.width} />}
              preferPlace='above'
              place="column"
              onOuterAction={this.handleClick.bind(this)}
              isOpen={this.state.open}>
              {this.state.blobUrl
                ?   <video
                      src={this.state.blobUrl}
                      ref={(video) => this.video = video}
                      controls
                      className={css(styles.video, this.state.focus && styles.focus)}
                      style={{width:this.state.width}}
                      onClick={readOnly ? null : this.handleClick.bind(this)}
                    />
                :   <Loader color="#26A65B" size="16px" margin="4px" />
              }
            </Popover>
          </div>
          {!this.props.data.load && (readOnly && this.props.data.caption || !readOnly)
            ?   <TextAreaAutoSize
                  onFocus={this._clearPlaceholder}
                  onBlur={this._putPlaceholder}
                  id='caption'
                  rows={1}
                  disabled={readOnly}
                  placeholder={this.state.placeholder}
                  className={css(styles.input)}
                  onChange={this._handleCaptionChange}
                  value={this.props.data.caption}
                />
            :   null
          }
        </div>
      </div>
    );
  }
}

var styles = StyleSheet.create({
  inputWrapper: {
    width: '100%',
    textAlign: 'center',

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
    resize: 'none',
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
    zIndex: '2',
  },
  focus: {
    border: '3px solid #48e79a',
  }
})

