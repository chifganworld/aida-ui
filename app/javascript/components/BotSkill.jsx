import React, { Component } from 'react'
import { Redirect } from 'react-router-dom'
import Title from '../ui/Title'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'

import * as routes from '../utils/routes'
import * as actions from '../actions/skill'

import KeywordResponder from './KeywordResponder'
import LanguageDetector from './LanguageDetector'
import Survey from './Survey'
import ScheduledMessages from './ScheduledMessages'

const SkillComponent = ({skill, actions}) => {
  const { kind } = skill

  switch (kind) {
    case 'keyword_responder':
      return (<KeywordResponder skill={skill} actions={actions} />)
    case 'language_detector':
      return (<LanguageDetector skill={skill} actions={actions} />)
    case 'survey':
      return (<Survey skill={skill} actions={actions} />)
    case 'scheduled_messages':
      return (<ScheduledMessages skill={skill} actions={actions} />)
    default:
      return (<Title>{skill.name} #{skill.id}</Title>)
  }
}

class BotSkill extends Component {
  render() {
    const { bot, skill, actions, loading } = this.props
    if (loading) {
      return <Title>Loading skill...</Title>
    } else if (skill) {
      return <SkillComponent skill={skill} actions={actions}/>
    } else {
      return <Redirect to={routes.botFrontDesk(bot.id)} />
    }
  }
}

const mapStateToProps = (state, {skillId}) => {
  const { items } = state.skills
  if (items) {
    return { loading: false, skill: items[skillId] }
  } else {
    return { loading: true }
  }
}

const mapDispatchToProps = (dispatch) => ({
  actions: bindActionCreators(actions, dispatch)
})

export default connect(mapStateToProps, mapDispatchToProps)(BotSkill)
