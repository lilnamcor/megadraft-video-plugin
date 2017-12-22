/*
 * Copyright (c) 2017, Itai Reuveni <itaireuveni@gmail.com>
 *
 * License: MIT
 */

import React from "react";

import FaPlay from 'react-icons/lib/fa/play';

export default class extends React.Component {
  render() {
    return (
      <FaPlay width="18" height="18" {...this.props} style={{position: 'absolute', 'left': '65%', top: '60%'}}/>
    );
  }
}
