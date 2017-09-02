/*
 * Copyright (c) 2017, Itai Reuveni <itaireuveni@gmail.com>
 *
 * License: MIT
 */

import React, {Component} from "react";

import Dropzone from "react-dropzone";

import Modal from "react-modal";

import {StyleSheet, css} from 'aphrodite';

import FaTimes from 'react-icons/lib/fa/times-circle';
import Immutable from "immutable";

import Icon from "./icon.js";
import constants from "./constants";
import {insertDataBlock} from "megadraft";
import { genKey, EditorState, ContentState, ContentBlock, SelectionState, Modifier } from "draft-js";

// IPFS Config
import { ipfsConfig, IPFS_ADDRESS } from './ipfs-config';
import { uploadFiles } from './ipfs-helper';

const {
  List,
  Map
} = Immutable;

const IPFS = window.Ipfs;

export default class Button extends Component {
  constructor(props) {
    super(props);

    this._closeModal = ::this._closeModal;
    this.state = {
      open: false,
    }
  }

  onDrop(acceptedFiles, rejectedFiles) {
    if (acceptedFiles.length > 0) {
      const loader = {
        type: constants.PLUGIN_TYPE,
        load: true,
      }
      this.props.onChange(insertDataBlock(this.props.editorState, loader));
      uploadFiles(acceptedFiles, this.node)
      .then((result) => {
        var videoHash = result[0].hash;
        const data = {
          type: constants.PLUGIN_TYPE,
          videoPreview: acceptedFiles[0].preview,
          videoHash: videoHash,
          load: false,
        }
        var editorState = this.props.editorState;
        const _contentState = editorState.getCurrentContent();
        var blocks = editorState.getCurrentContent().getBlocksAsArray();

        var loadIndex = 0;
        var replaceKey = '';
        for (var i = 0; i < blocks.length; i++) {
          if (blocks[i].getType() === 'atomic' && blocks[i].getData().get('load')) {
            loadIndex = i;
            replaceKey = blocks[i].getKey();
            break;
          }
        }
        var selectionState = SelectionState.createEmpty(replaceKey);
        var newContentState = Modifier.setBlockData(_contentState, selectionState, data);

        // var blockMap = _contentState.getBlockMap()

        // const newContentState = blockMap.reduce((contentState, block) => {
        //   // const block = contentState.getBlockForKey(blockKey);
        //   if (block.getType() === 'atomic' && block.getData().get('load')) {
        //     var blockKey = block.getKey();
        //     var videoBlock = new ContentBlock({
        //       key: genKey(),
        //       type: "atomic",
        //       text: "",
        //       characterList: List(),
        //       data: new Map(data)
        //     });

        //     return contentState.merge({
        //       blockMap: blockMap.set(
        //         blockKey,
        //         videoBlock
        //       ),
        //     });
        //   } else {
        //     return contentState;
        //   }
        // }, _contentState);

        // insertDataBlock(this.props.editorState, data);
        // blocks[loadIndex] = videoBlock;
        // var contentState = ContentState.createFromBlockArray(blocks);
        var newEditorState = EditorState.push(this.props.editorState, newContentState, 'replace-load-with-video');
        // var newEditorState = EditorState.createWithContent(contentState, this.props.editorState.getDecorator());
        this.props.onChange(newEditorState);
      });
    } else {
      this.setState({open: true})
    }
  }

  componentDidMount() {
    if (IPFS) {
      this.node = new IPFS(ipfsConfig);
    }
  }

  _closeModal() {
    this.setState({open: false})
  }

  render() {
    return (
      <div className={css(styles.videoButton)}>
        <Dropzone
          className={this.props.className}
          onDrop={(acceptedFiles, rejectedFiles) => this.onDrop(acceptedFiles, rejectedFiles)}
          multiple={false}
          title={constants.PLUGIN_NAME}
          accept="video/*">
          <Icon className="sidemenu__button__icon" />
        </Dropzone>
        <Modal
          isOpen={this.state.open}
          overlayClassName = {css(styles.overlay)}
          className={css(styles.content)}
          onRequestClose={this._closeModal}
          aria={{
            labelledby: "heading",
            describedby: "full_description",
            xbutton: "xbutton"
          }}>
          <div>
            <h1 id="heading">Uh oh!</h1>
            <div id="full_description">
              <p>The file you tried to upload is a type we do not understand.</p>
              <p>Supported video formats are JPEG, PNG, and GIF.</p>
            </div>
            <div onClick={this._closeModal} id='xbutton' className={css(styles.xButton)}>
              <FaTimes/>
            </div>
            <button onClick={this._closeModal} className={css(styles.okButton)}>Ok</button>
          </div>
        </Modal>
      </div>
    );
  }
}

var styles = StyleSheet.create({
  overlay: {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'black',
    zIndex: '2',
  },
  videoButton: {
    marginLeft: '2px',
  },
  content: {
    position: 'absolute',
    top: '-250px',
    left: '0px',
    right: '0px',
    bottom: '0px',
    background: '#fff',
    overflow: 'auto',
    WebkitOverflowScrolling: 'touch',
    borderRadius: '4px',
    outline: 'none',
    padding: '20px',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    textAlign: 'center',
  },
  okButton: {
    borderRadius: '10px',
    background: 'white',
    color: '#02b875',
    borderColor: '#02b875',
    cursor: 'pointer',
    borderStyle: 'solid',
    borderWidth: '1px',
    paddingLeft: '15px',
    paddingRight: '15px',
  },
  xButton: {
    position: 'absolute',
    top: 260,
    right: 10,
    cursor: 'pointer',
    fontSize: '30px',
  }
})
