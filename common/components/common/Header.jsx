import React, { PropTypes } from 'react'
import { connect } from 'react-redux'
import { Menu, Loading } from '.'

const Header = ({remoteActions}) => (
  <div id="header-ctr">
    <Loading inline={false} />
    <Menu />
  </div>
)

export default Header
