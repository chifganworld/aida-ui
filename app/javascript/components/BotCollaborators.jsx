import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import { Button, Checkbox, DialogContainer, FontIcon, TextField } from 'react-md'

import map from 'lodash/map'
import isFunction from 'lodash/isFunction'
import without from 'lodash/without'
import moment from 'moment'

import { MainGrey } from '../ui/MainGrey'
import Title from '../ui/Title'
import Headline from '../ui/Headline'
import { EmptyLoader }  from '../ui/Loader'
import { Listing, Column } from '../ui/Listing'
import EmptyContent from '../ui/EmptyContent'

import * as actions from '../actions/collaborators'
import * as invitationsActions from '../actions/invitations'

const hasRole = (roles, role) => {
  return roles.indexOf(role) >= 0
}

const toggleRole = (roles, role) => {
  return hasRole(roles, role) ? without(roles, role) : roles.concat([role])
}

class CollaboratorsList extends Component {
  static propTypes = {
    items: PropTypes.arrayOf(PropTypes.shape({
      type: PropTypes.oneOf(['invitation', 'collaborator']),
      email: PropTypes.string,
      roles: PropTypes.arrayOf(PropTypes.string),
      lastActivity: PropTypes.string,
      data: PropTypes.any
    })).isRequired,
    currentUserEmail: PropTypes.string.isRequired,
    onCancelInvitation: PropTypes.func.isRequired,
    onResendInvitation: PropTypes.func.isRequired,
    onRemoveCollaborator: PropTypes.func.isRequired,
    onToggleCollaboratorRole: PropTypes.func.isRequired
  }

  render() {
    const { items, currentUserEmail,
            onCancelInvitation, onResendInvitation,
            onRemoveCollaborator, onToggleCollaboratorRole } = this.props

    const title = items.length == 1 ? '1 collaborator' : `${items.length} collaborators`
    const renderCollaboratorColumn = (col) => (item) => {
      const className = item.type == 'collaborator' ? '' : 'invitation-row'
      const content = isFunction(col) ? col(item) : item[col]
      return (<span className={className}>{content}</span>)
    }
    const lastActivityContent = (item) => {
      if (item.type == 'invitation' && item.lastActivity) {
        return (<span className="invitation-activity">
          {`Invited ${moment(item.lastActivity).fromNow()}`}
          <Button icon iconChildren="refresh"
                  onClick={() => onResendInvitation(item.data)}
                  tooltipLabel="Resend invitation"
                  tooltipPosition="left"
                  component="a" />
        </span>)
      } else if (item.lastActivity) {
        return moment(item.lastActivity).fromNow()
      } else {
        return ''
      }
    }
    const roleContent = role => item => {
      const isChecked = hasRole(item.roles, role)
      const toggle = () => {
        if (item.type == 'collaborator') {
          onToggleCollaboratorRole(item.data, role)
        }
      }
      return (
        <Checkbox id={`role-${role}-${item.type}-${item.id}`}
                  name={`role-${role}-${item.type}-${item.id}`}
                  aria-label={`Toggle ${role} role`}
                  onChange={toggle}
                  checked={isChecked}
                  disabled={item.type == 'invitation'}
                  checkedCheckboxIcon={<FontIcon>check</FontIcon>}
                  uncheckedCheckboxIcon={null} />
      )
    }
    const renderCollaboratorAction = (item) => {
      if (item.type == 'invitation') {
        return (<Button icon iconChildren="close"
                        className="invitation-row"
                        onClick={() => onCancelInvitation(item.data)}
                        tooltipLabel="Cancel invitation"
                        tooltipPosition="left" />)
      } else if (item.email != currentUserEmail) {
        return (<Button icon iconChildren="close"
                        onClick={() => onRemoveCollaborator(item.data)}
                        tooltipLabel="Remove collaborator"
                        tooltipPosition="left" />)
      }
    }
    return (
      <Listing items={items} title={title}>
        <Column title="Email"         render={renderCollaboratorColumn('email')} />
        <Column title="Publish"       render={renderCollaboratorColumn(roleContent('publish'))} />
        <Column title="Behaviour"     render={renderCollaboratorColumn(roleContent('behaviour'))} />
        <Column title="Content"       render={renderCollaboratorColumn(roleContent('content'))} />
        <Column title="Variables"     render={renderCollaboratorColumn(roleContent('variables'))} />
        <Column title="Results"       render={renderCollaboratorColumn(roleContent('results'))} />
        <Column title="Last activity" render={renderCollaboratorColumn(lastActivityContent)} />
        <Column title=""              render={renderCollaboratorAction} />
      </Listing>
    )
  }
}

class InviteDialog extends Component {
  state = {
    email: '',
    roles: []
  }

  static propTypes = {
    visible: PropTypes.bool,
    onCancel: PropTypes.func,
    onInvite: PropTypes.func,
    anonymousLink: PropTypes.string
  }

  static defaultProps = {
    visible: true
  }

  render() {
    const { anonymousLink, visible, onCancel, onInvite } = this.props
    const { email, roles } = this.state

    const resetState = () => this.setState({ email: '', roles: [] })

    const hideDialog = () => {
      if (onCancel) {
        onCancel()
      }
      resetState()
    }

    const inviteCollaborator = () => {
      if (onInvite) {
        onInvite(this.state.email, this.state.roles)
      }
      resetState()
    }

    const roleCheckbox = (role, label, description) => (
      <Checkbox id={`role-invitation-${role}`}
                key={role}
                name={`role-invitation-${role}`}
                className="role-toggle-control"
                onChange={() => this.setState({ roles: toggleRole(this.state.roles, role) })}
                label={<span className="role-description">
                  {label}
                  <span className="hint">{description}</span>
                </span>} />
    )

    return (
        <DialogContainer
          id="invite-collaborator-dialog"
          visible={visible}
          onHide={hideDialog}
          title={<span>
            Invite collaborators
            <span className="subtitle">The access of project collaborators will be managed through roles</span>
          </span>}>
          <TextField id="invite-email"
                     label="Enter collaborator's email"
                     value={email}
                     onChange={email => this.setState({ email })}/>
          <div>
            {[
               roleCheckbox('publish',   'Publish',   'Can publish the bot and change the channel configuration'),
               roleCheckbox('behaviour', 'Behaviour', 'Can change skills configuration'),
               roleCheckbox('content',   'Content',   'Can edit messages and translations'),
               roleCheckbox('variables', 'Variables', 'Can modify variable values'),
               roleCheckbox('results',   'Results',   'Can view stats, conversation logs, survey results and feedback'),
            ]}
          </div>
          <div className="action-buttons">
            <Button flat secondary swapTheming id="invite-send-button" onClick={inviteCollaborator}>Send</Button>
            <Button flat id="invite-cancel-button" onClick={hideDialog}>Cancel</Button>
          </div>
          <footer>
            <FontIcon>link</FontIcon> Or invite to collaborate with a <a href={anonymousLink}>single use link</a>
          </footer>
        </DialogContainer>
    )
  }
}

class BotCollaborators extends Component {
  componentDidMount() {
    const { bot, actions } = this.props
    actions.fetchCollaborators({ botId: bot.id })
  }

  render() {
    const { bot, loaded, collaborators, invitations, anonymousLink,
            currentUserEmail, invitationsActions,
            actions, dialogVisible, hideDialog, showDialog } = this.props

    if (!loaded) {
      return (<EmptyLoader>Loading collaborators for {bot.name}</EmptyLoader>)
    }

    const items = map(collaborators, c => ({
      type: 'collaborator',
      email: c.user_email,
      roles: c.roles,
      lastActivity: c.last_activity,
      data: c
    })).concat(map(invitations, i => ({
      type: 'invitation',
      email: i.email,
      roles: i.roles,
      lastActivity: i.sent_at,
      data: i
    })))

    const inviteCollaborator = (email, roles) => {
      actions.inviteCollaborator(bot, email, roles)
      hideDialog()
    }
    const cancelInvitation = (invitation) => {
      invitationsActions.cancelInvitation(invitation)
    }
    const resendInvitation = (invitation) => {
      invitationsActions.resendInvitation(invitation)
    }
    const removeCollaborator = (collaborator) => {
      actions.removeCollaborator(collaborator)
    }
    const toggleCollaboratorRole = (collaborator, role) => {
      const roles = toggleRole(collaborator.roles, role)
      actions.updateCollaborator({...collaborator, roles})
    }

    const inviteDialog = (<InviteDialog visible={dialogVisible}
                                        onCancel={hideDialog}
                                        onInvite={inviteCollaborator}
                                        anonymousLink={anonymousLink} />)

    if (items.length == 0) {
      return (
        <EmptyContent icon='folder_shared'>
          <Headline>
            You have no collaborators on this project
            <span><a href="javascript:" onClick={showDialog}>Invite them</a></span>
          </Headline>
          {inviteDialog}
        </EmptyContent>
      )
    } else {
      return (
        <MainGrey>
          <CollaboratorsList items={items}
                             currentUserEmail={currentUserEmail}
                             onRemoveCollaborator={removeCollaborator}
                             onCancelInvitation={cancelInvitation}
                             onResendInvitation={resendInvitation}
                             onToggleCollaboratorRole={toggleCollaboratorRole} />
          {inviteDialog}
        </MainGrey>
      )
    }
  }
}

const mapStateToProps = (state, {bot}) => {
  const { fetching, scope, data } = state.collaborators
  if (!data || fetching || bot.id != scope.botId) {
    return {
      collaborators: [],
      invitations: [],
      loaded: false
    }
  } else {
    return {
      collaborators: data.collaborators,
      invitations: data.invitations,
      anonymousLink: data.anonymous_invitation.link_url,
      loaded: true,
      currentUserEmail: state.auth.userEmail
    }
  }
}

const mapDispatchToProps = (dispatch) => ({
  actions: bindActionCreators(actions, dispatch),
  invitationsActions: bindActionCreators(invitationsActions, dispatch)
})

export default connect(mapStateToProps, mapDispatchToProps)(BotCollaborators)
