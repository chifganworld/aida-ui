import React, { Component } from 'react'
import PropTypes from 'prop-types'
import UntitledIfEmpty from './UntitledIfEmpty'
import TextField from 'react-md/lib/TextFields'
import FontIcon from 'react-md/lib/FontIcons'

export default class EditableTitleLabel extends Component {
  constructor(props) {
    super(props)
    this.state = {
      editing: false
    }
    this.inputRef = null
  }

  handleClick() {
    if (!this.state.editing && !this.props.readOnly) {
      let editing = !this.state.editing
      this.setState({editing: editing})
    }
  }

  endEdit() {
    this.setState({editing: false})
  }

  endAndSubmit() {
    const { onSubmit } = this.props
    this.endEdit()
    onSubmit(this.inputRef.getField().value)
  }

  onKeyDown(event) {
    if (event.key == 'Enter') {
      this.endAndSubmit()
    } else if (event.key == 'Escape') {
      this.endEdit()
    }
  }

  setInput(node) {
    this.inputRef = node

    if (node) {
      // focus element when first rendered. react-md's TextField doesn't support autofocus.
      node.focus()
    }
  }

  render() {
    const { title, emptyText, maxLength, hideEditingIcon } = this.props

    let icon = null
    if ((!title || title.trim() == '') && !hideEditingIcon) {
      icon = <FontIcon>mode_edit</FontIcon>
    }

    if (!this.state.editing) {
      return (
        <a className='ui-editable-title-label app-header-title-view' onClick={e => this.handleClick(e)}>
          <span><UntitledIfEmpty text={title} emptyText={emptyText} /></span>
          {icon}
        </a>
      )
    } else {
      return (
        <TextField
          maxLength={maxLength}
          defaultValue={title || ''}
          ref={node => this.setInput(node)}
          onKeyDown={e => this.onKeyDown(e)}
          onBlur={e => this.endAndSubmit(e)}
          size={50}
          className='app-header-title-edit'
          id="ui-editable-title-label" />
      )
    }
  }
}

EditableTitleLabel.propTypes = {
  onSubmit: PropTypes.func.isRequired,
  title: PropTypes.string,
  emptyText: PropTypes.string,
  readOnly: PropTypes.bool,
  hideEditingIcon: PropTypes.bool,
  maxLength: PropTypes.number
}
