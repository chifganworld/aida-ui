import React, { Component } from 'react'
import { FontIcon,
         DialogContainer,
         Button,
         TextField,
         ListItem,
         DropdownMenu,
         Menu,
} from 'react-md'
import SideBar, { SidebarItem, SidebarMenuItem } from '../ui/SideBar'
import { DragDropContext } from 'react-dnd'
import HTML5Backend from 'react-dnd-html5-backend'

import { withRouter } from 'react-router'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import sortBy from 'lodash/sortBy'
import includes from 'lodash/includes'

import SkillListItem from './SkillListItem'
import FrontDeskItem from './FrontDeskItem'
import * as routes from '../utils/routes'
import { blank } from '../utils/string'
import { skillIcon } from '../utils/skills_bar'
import * as actions from '../actions/skills'
import * as skillActions from '../actions/skill'

const SKILL_KINDS = ['language_detector', 'keyword_responder', 'survey', 'scheduled_messages', 'decision_tree', 'human_override']
const RENAMEABLE_SKILLS = ['keyword_responder', 'survey', 'scheduled_messages', 'decision_tree', 'human_override']

const defaultSkillName = (kind) => {
  switch (kind) {
    case 'language_detector':
      return 'Language detector'
    case 'keyword_responder':
      return 'Keyword responder'
    case 'human_override':
      return 'Human override'
    case 'survey':
      return 'Survey'
    case 'scheduled_messages':
      return 'Scheduled messages'
    case 'decision_tree':
      return 'Decision tree'
  }
}

const skillDescription = (kind) => {
  switch (kind) {
    case 'keyword_responder':
      return 'This skill will let your users query for information using simple keywords'
    case 'human_override':
      return 'This skill will let your users contact operators using simple keywords'
    case 'survey':
      return 'This skill will let you examine users opinions'
    case 'scheduled_messages':
      return 'This skill will let you send messages automatically on a schedule'
    case 'decision_tree':
      return 'This skill will guide the user for diagnostic purposes or information access'
    default:
      return ''
  }
}

const isSkillRenameable = (kind) => includes(RENAMEABLE_SKILLS, kind)

class SkillNameDialog extends Component {
  state = {
    name: ''
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.visible && !this.props.visible) {
      const name = nextProps.skill && (nextProps.skill.name || defaultSkillName(nextProps.skill.kind))
      this.setState({name})
    }
  }

  render() {
    const { visible, skill, onClose, onSubmit } = this.props
    const isNewSkill = !skill || !skill.id
    const kind = skill && skill.kind

    const actions = [
      { primary: true, children: 'Cancel', onClick: onClose },
      (<Button flat secondary onClick={() => onSubmit(this.state.name)}>{isNewSkill ? 'Add' : 'Rename'}</Button>)
    ]
    const dialogTitle = isNewSkill ? (defaultSkillName(kind) || 'Add skill') : 'Rename skill'
    const dialogDescription = isNewSkill ? skillDescription(kind) : ''

    return (
      <DialogContainer
        id="skill-name-dialog"
        visible={visible}
        onHide={onClose}
        actions={actions}
        title={dialogTitle}>
        <h4>{dialogDescription}</h4>
        <TextField id="skill-name-field"
                   label="Skill name"
                   value={this.state.name}
                   onChange={(name) => this.setState({name})} />
      </DialogContainer>
    )
  }
}

class SkillsBar extends Component {
  state = {
    dialogSkill: null
  }

  componentDidMount() {
    const { skills, bot, actions } = this.props
    if (!skills) {
      actions.fetchSkills({botId: bot.id})
    }
  }

  render() {
    const { bot, skills, creating, history, location, actions, skillActions, errors } = this.props
    const { dialogSkill } = this.state
    const dialogVisible = !!dialogSkill

    const hasError = skill => {
      const hasWitError = (
        (skill.enabled && skill.config) &&
        ((skill.config.use_wit_ai && errors.some(e => e.path[0] == 'wit_ai')) ||
        (skill.kind == 'language_detector' && (errors.some(e => (e.path[0] == 'wit_ai' && e.message == 'multilingual-bot') || e.path[0].startsWith('languages')))))
      )

      const skillErrorIndex = skills.filter(s => s.enabled).findIndex(s => s.id == skill.id)
      return errors.some(e => e.path[0] == `skills/${skillErrorIndex}`) || hasWitError
    }

    const skillsItems = skills
                      ? skills.map(skill => {
                          return (
                            <SkillListItem skill={skill} key={skill.id} botId={bot.id}
                              active={location.pathname == routes.botSkill(bot.id, skill.id)}
                              onClick={() => history.push(routes.botSkill(bot.id, skill.id))}
                              onToggleSkill={() => skillActions.toggleSkill(skill)}
                              onRenameSkill={() => openDialog(skill)}
                              onDeleteSkill={() => skillActions.deleteSkill(skill)}
                              hasError={hasError(skill)}
                            />
                          )
                        })
                      : [<SidebarItem key="loading"
                                   icon={skillIcon('LOADING')}
                                   label="Loading skills..." />]

    let missingSkill = ""
    if(errors.some(e => e.path[0] == "skills")) {
      missingSkill = (<ListItem className="missing-skill" primaryText={errors.filter(e => e.path[0] == "skills")[0].message} />)
    }

    const skillKindItems = SKILL_KINDS.map(kind => ({
      key: kind,
      primaryText: defaultSkillName(kind),
      leftIcon: <FontIcon>{skillIcon(kind)}</FontIcon>,
      onClick: () => {
        if (isSkillRenameable(kind)) {
          openDialog({ kind, name: defaultSkillName(kind) })
        } else {
          actions.createSkill({botId: bot.id}, {kind}, history)
        }
      }
    }))

    const openDialog = (skill) => {
      this.setState({ dialogSkill: skill })
    }

    const closeDialog = () => {
      this.setState({ dialogSkill: null })
    }

    const dialogSubmit = (name) => {
      const { dialogSkill } = this.state
      if (dialogSkill && dialogSkill.kind) {
        const { kind, id } = dialogSkill
        if (id) {
          skillActions.updateSkill({...dialogSkill, name})
        } else {
          actions.createSkill({botId: bot.id}, {kind, name}, history)
        }
      }
      closeDialog()
    }

    return (
      <SideBar title="Skills">
        <FrontDeskItem
          bot={bot}
          skill={{"kind": "front_desk"}}
          icon={skillIcon("front_desk")}
          onClick={() => history.push(routes.botFrontDesk(bot.id))}
          hasError={errors.some(e => e.path[0].startsWith("front_desk") && e.path[0].endsWith("/en"))} />
        {skillsItems}
        {missingSkill}
        <DropdownMenu id="add-skill-menu"
                      cascading
                      block={true}
                      anchor={{x: DropdownMenu.HorizontalAnchors.INNER_LEFT, y: DropdownMenu.VerticalAnchors.OVERLAP}}
                      position={DropdownMenu.Positions.TOP_LEFT}
                      menuItems={skillKindItems}>
          <SidebarItem id="add-skill"
                    icon={skillIcon('ADD')}
                    label="Add skill"
                    className="addlink"
                    onClick={(e) => e.stopPropagation() }/>
        </DropdownMenu>

        <SkillNameDialog visible={dialogVisible}
                         skill={dialogSkill}
                         onClose={closeDialog}
                         onSubmit={dialogSubmit} />
      </SideBar>
    )
  }
}

const mapStateToProps = (state, {bot}) => {
  const { scope, items, creating } = state.skills
  if (scope && scope.botId == bot.id && items) {
    return {
      skills: sortBy(Object.values(items), 'order'),
      creating
    }
  } else {
    return { skills: null }
  }
}

const mapDispatchToProps = (dispatch) => ({
  actions: bindActionCreators(actions, dispatch),
  skillActions: bindActionCreators(skillActions, dispatch)
})

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(DragDropContext(HTML5Backend)(SkillsBar)))
