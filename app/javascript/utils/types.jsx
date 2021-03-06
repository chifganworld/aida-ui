/* @flow */

export * from './types-generated-decl'
import * as T from './types-generated-decl'

export type ById<T> = { [string]: T };
export type DirectionalMessage = T.DirectionalMessage

export type Scope = {
  botId: number
};

export type UpdatedVariableAttributes = {
  id: string,
  name: string,
  value: string,
  conditionId?: string,
  condition?: string,
  conditionOrder?: number,
  lang: T.Language
};

export type Permission = 'can_admin'
                       | 'can_publish'
                       | 'manages_behaviour'
                       | 'manages_content'
                       | 'manages_variables'
                       | 'manages_results';

export type AuthAction = {
  type: 'AUTH_INIT',
  userEmail: string,
  userName: string
};

export type BotAction = {
  type: "BOT_UPDATE",
  bot: T.Bot,
} | {
  type: "BOT_PUBLISH",
  botId: number,
} | {
  type: "BOT_PUBLISH_SUCCESS",
  botId: number,
  uuid: string
} | {
  type: "BOT_PUBLISH_FAILURE",
  botId: number,
  errors: any
} | {
  type: "BOT_UNPUBLISH",
  botId: number,
} | {
  type: "BOT_UNPUBLISH_SUCCESS",
  botId: number,
} | {
  type: "BOT_DELETE",
  botId: number,
} | {
  type: "BOT_SELECT",
  botId: number,
};

export type BotsAction = {
  type: 'BOTS_RECEIVE',
  items: ById<T.Bot>,
} | {
  type: 'BOTS_RECEIVE_ERROR',
} | {
  type: 'BOTS_FETCH',
} | {
  type: 'BOTS_CREATE_SUCCESS',
  bot: T.Bot,
}

export type ChannelAction = {
  type: "CHANNEL_UPDATE",
  channel: T.Channel,
} | {
  type: "CHANNEL_DELETE",
  channelId: number,
};

export type ChannelsAction = {
  type: 'CHANNELS_RECEIVE',
  scope: ?any,
  items: ById<T.Channel>,
} | {
  type: 'CHANNELS_RECEIVE_ERROR',
} | {
  type: 'CHANNELS_FETCH',
  scope: ?any,
} | {
  type: 'CHANNELS_CREATE',
  scope: ?any,
} | {
  type: 'CHANNELS_CREATE_SUCCESS',
  channel: T.Channel,
} | {
  type: 'CHANNELS_CREATE_FAILURE',
};

export type ChatAction = {
  type: 'SEND_MESSAGE',
  id: number,
  text: string,
  sent: boolean,
  timestamp: Date
} | {
  type: 'RECEIVE_MESSAGE',
  id: number,
  text: string,
  sent: boolean,
  timestamp: Date
} | {
  type: 'SEND_ATTACHMENT_SUCCESS',
  id: number,
  attachment: string,
  sent: boolean,
  timestamp: Date
} | {
  type: 'START_PREVIEW',
  botId: number,
  accessToken: string
} | {
  type: 'START_PREVIEW_SUCCESS',
  botId: number,
  previewUuid: string,
  sessionId: string,
  accessToken: string
} | {
  type: 'START_PREVIEW_FAILURE',
  botId: number,
  errors: any
} | {
  type: 'PAUSE_PREVIEW',
  botId: number,
} | {
  type: 'NEW_SESSION',
  botId: number,
  sessionId: string,
} | {
  type: 'CHAT_CONNECTED',
  previewUuid: string
} | {
  type: 'CHAT_DISCONNECTED',
  previewUuid: string
} | {
  type: 'CHAT_CONNECTING',
  previewUuid: string
}

export type WebChatAction = {
  type: 'WEB_CHAT_START',
  botId: string,
  accessToken: string
} | {
  type: 'NEW_WEB_CHAT_SESSION',
  sessionId: string
} | {
  type: 'WEB_CHAT_SEND_MESSAGE',
  id: number,
  text: string,
  sent: boolean,
  timestamp: Date
} | {
  type: 'WEB_CHAT_RECEIVE_MESSAGE',
  id: number,
  text: string,
  sent: boolean,
  timestamp: Date
} | {
  type: 'WEB_CHAT_SEND_ATTACHMENT_SUCCESS',
  id: number,
  attachment: string,
  sent: boolean,
  timestamp: Date
} | {
  type: 'WEB_CHAT_CONNECTED',
  previewUuid: string
} | {
  type: 'WEB_CHAT_DISCONNECTED',
  previewUuid: string
}

export type CollaboratorsAction = {
  type: 'COLLABORATORS_FETCH',
  scope: Scope,
} | {
  type: 'COLLABORATORS_FETCH_SUCCESS',
  scope: Scope,
  data: T.CollaboratorsIndex,
} | {
  type: 'COLLABORATORS_FETCH_ERROR',
} | {
  type: 'COLLABORATORS_INVITE',
} | {
  type: 'COLLABORATORS_INVITE_SUCCESS',
  botId: number,
  invitation: T.Invitation,
} | {
  type: 'COLLABORATORS_INVITE_ERROR',
} | {
  type: 'COLLABORATORS_REMOVE',
  collaborator: T.Collaborator,
} | {
  type: 'COLLABORATORS_REMOVE_SUCCESS',
} | {
  type: 'COLLABORATORS_REMOVE_ERROR',
} | {
  type: 'COLLABORATORS_UPDATE',
  collaborator: T.Collaborator,
} | {
  type: 'COLLABORATORS_UPDATE_SUCCESS',
} | {
  type: 'COLLABORATORS_UPDATE_ERROR',
};

export type ErrorLogsAction = {
  type: 'ERROR_LOGS_FETCH',
  scope: Scope,
} | {
  type: 'ERROR_LOGS_FETCH_SUCCESS',
  scope: Scope,
  items: Array<ErrorLog>,
} | {
  type: 'ERROR_LOGS_FETCH_ERROR',
}

export type InvitationsAction = {
  type: 'INVITATIONS_CANCEL',
  invitation: T.Invitation,
} | {
  type: 'INVITATIONS_CANCEL_SUCCESS',
} | {
  type: 'INVITATIONS_CANCEL_ERROR',
} | {
  type: 'INVITATION_RETRIEVE',
  token: string
} | {
  type: 'INVITATION_RETRIEVE_SUCCESS',
  token: string,
  invitation: T.InvitationData
} | {
  type: 'INVITATION_RETRIEVE_ERROR',
  token: string
} | {
  type: 'INVITATION_ACCEPT',
} | {
  type: 'INVITATION_ACCEPT_SUCCESS',
} | {
  type: 'INVITATION_ACCEPT_ERROR',
} | {
  type: 'INVITATION_RESEND_SUCCESS',
  invitation: T.Invitation
};

export type FrontDeskAction = {
  type: 'FRONT_DESK_FETCH',
  botId: number
} | {
  type: 'FRONT_DESK_FETCH_SUCCESS',
  data: T.FrontDesk
} | {
  type: 'FRONT_DESK_FETCH_ERROR'
} | {
  type: 'FRONT_DESK_UPDATE_CONFIG',
  config: T.FrontDeskConfig
};

export type HumanOverrideMessageAction = {
  type: 'MESSAGES_FETCH',
} | {
  type: 'MESSAGES_ADD_SUCCESS',
  messageId: number,
  message: T.DirectionalMessage
} | {
  type: 'MESSAGES_RESOLVE_SUCCESS',
  messageId: number
} | {
  type: 'MESSAGES_RECEIVE',
  items: ById<T.HumanOverrideNotification>,
} | {
  type: 'MESSAGES_RECEIVE_ERROR',
};

export type KeyPairAction = {
  type: 'KEYPAIR_FETCH'
} | {
  type: 'KEYPAIR_FETCH_SUCCESS',
  encryptedKeyPair: T.EncryptedKeyPair
};

export type NotificationsAction = {
  type: 'NOTIF_PUSH',
  message: string
} | {
  type: 'NOTIF_DISMISS'
};

export type SkillAction = {
  type: "SKILL_UPDATE",
  skill: T.Skill,
} | {
  type: "SKILL_DELETE",
  skillId: number
};

export type SkillsAction = {
  type: 'SKILLS_RECEIVE',
  scope: ?any,
  items: ById<T.Skill>,
} | {
  type: 'SKILLS_RECEIVE_ERROR',
} | {
  type: 'SKILLS_FETCH',
  scope: ?any,
} | {
  type: 'SKILLS_CREATE_SUCCESS',
  scope: Scope,
  skill: T.Skill
} | {
  type: 'SKILLS_REORDER',
  order: {}
};

export type StatsAction = {
  type: 'STATS_FETCH',
  botId: number,
  period: T.StatsPeriod
} | {
  type: 'STATS_FETCH_SUCCESS',
  botId: number,
  period: T.StatsPeriod,
  data: T.BotStats
} | {
  type: 'STATS_FETCH_ERROR',
  botId: number,
  period: T.StatsPeriod,
  error: string
};

export type TablesAction = {
  type: 'TABLES_FETCH',
  scope: Scope
} | {
  type: 'TABLES_FETCH_SUCCESS',
  scope: Scope,
  items: ById<T.DataTable>
} | {
  type: 'TABLES_FETCH_ERROR',
  scope: Scope
} | {
  type: 'TABLE_CREATE',
} | {
  type: 'TABLE_CREATE_SUCCESS',
  botId: number,
  table: T.DataTable
} | {
  type: 'TABLE_CREATE_ERROR',
  botId: number,
  error: string
} | {
  type: 'TABLE_UPDATE',
  table: T.DataTable
} | {
  type: 'TABLE_UPDATE_SUCCESS',
  table: T.DataTable
} | {
  type: 'TABLE_UPDATE_ERROR',
  tableId: number,
  error: string
} | {
  type: 'TABLE_DESTROY',
  tableId: number,
} | {
  type: 'TABLE_DESTROY_SUCCESS',
  tableId: number
} | {
  type: 'TABLE_DESTROY_ERROR',
  tableId: number,
  error: string
} | {
  type: 'TABLES_UPLOAD',
} | {
  type: 'TABLES_UPLOAD_SUCCESS',
  data: T.DataTableData
} | {
  type: 'TABLES_UPLOAD_ERROR',
  error: string
} | {
  type: 'TABLES_UPLOAD_RESET',
};

export type TranslationsAction = {
  type: 'TRANSLATIONS_FETCH',
  scope: Scope,
} | {
  type: 'TRANSLATIONS_RECEIVE',
  scope: Scope,
  data: T.TranslationsIndex
} | {
  type: 'TRANSLATION_UPDATE',
  botId: number,
  translation: T.Translation,
};

export type VariablesAction = {
  type: 'VARIABLE_ADD',
  defaultLang: string
} | {
  type: 'VARIABLE_REMOVE',
  botId: number,
  variableId: string,
  conditionId: ?string
} | {
  type: 'VARIABLE_UPDATE',
  botId: number,
  updatedAttrs: UpdatedVariableAttributes
} | {
  type: 'VARIABLE_ADD_CONDITION',
  botId: number,
  variableId: string
};

export type XlsFormsAction = {
  type: 'XLSFORMS_UPLOAD',
  surveyId: number,
} | {
  type: 'XLSFORMS_UPLOAD_SUCCESS',
  surveyId: number,
} | {
  type: 'XLSFORMS_UPLOAD_ERROR',
  surveyId: number,
  error: string
};

export type Action = AuthAction
                   | BotAction
                   | BotsAction
                   | ChannelAction
                   | ChannelsAction
                   | ChatAction
                   | CollaboratorsAction
                   | ErrorLogsAction
                   | FrontDeskAction
                   | HumanOverrideMessageAction
                   | InvitationsAction
                   | KeyPairAction
                   | NotificationsAction
                   | SkillAction
                   | SkillsAction
                   | StatsAction
                   | TablesAction
                   | TranslationsAction
                   | VariablesAction
                   | XlsFormsAction;

export type AuthState = {
  userEmail: ?string,
  userName: ?string
};

export type BotsState = {
  fetching: boolean,
  items: ?ById<T.Bot>
};

export type ChannelsState = {
  fetching: boolean,
  creating: boolean,
  scope: ?any,
  items: ?ById<T.Channel>
};

export type ChatMessage = {
  id: number,
  text?: string,
  attachment?: string,
  sent: boolean,
  timestamp: Date
}

export type ChatState = {
  scope: Scope,
  messages: Array<ChatMessage>,
  previewUuid: ?string,
  accessToken: string,
  sessionId: ?string,
};

export type WebChatState = {
  messages: Array<ChatMessage>,
  botId: string,
  accessToken: string,
  sessionId: ?string,
};

export type CollaboratorsState = {
  fetching: boolean,
  scope: ?Scope,
  data: ?T.CollaboratorsIndex,
};

export type ErrorLog = {
  timestamp: string,
  bot_id: string,
  session_id: string,
  skill_id: string,
  message: string
};

export type ErrorLogsState = {
  fetching: boolean,
  scope: ?Scope,
  items: ?Array<ErrorLog>,
};

export type FrontDeskState = {
  fetching: boolean,
  botId: ?number,
  data: ?T.FrontDesk
};

export type KeyPairState = {
  fetching: boolean,
  encryptedKeyPair: ?T.EncryptedKeyPair
};

export type InvitationState = {
  fetching: boolean,
  token: ?string,
  invitation: ?T.InvitationData
};

export type HumanOverrideMessagesState = {
  fetching: boolean,
  items: ?ById<T.HumanOverrideNotification>
};

export type NotifState = {
  toasts: Array<{text: string, action: any}>
};

export type SkillsState = {
  fetching: boolean,
  scope: ?Scope,
  items: ?ById<T.Skill>
};

export type StatsState = {
  fetching: boolean,
  botId: ?number,
  period: ?T.StatsPeriod,
  data: ?T.BotStats
};

export type TablesState = {
  fetching: boolean,
  scope: ?Scope,
  items: ?ById<T.DataTable>,
  uploading: boolean,
  uploadError: ?string,
  uploadedData: null | Array<any>;
};

export type TranslationsState = {
  fetching: boolean,
  scope: ?Scope,
  languages: ?Array<string>,
  defaultLanguage: ?string,
  variables: ?T.VariableAssignments,
  behaviours: ?T.TranslationBehaviours
};

export type XlsFormsState = {
  uploadStatus: {
    [number]: { uploading: boolean, error: ?string }
  }
};

export type State = {
  auth: AuthState,
  bots: BotsState,
  channels: ChannelsState,
  chat: ChatState,
  webChat: WebChatState,
  collaborators: CollaboratorsState,
  errorLogs: ErrorLogsState,
  frontDesk: FrontDeskState,
  keypair: KeyPairState,
  invitation: InvitationState,
  messages: HumanOverrideMessagesState,
  notifications: NotifState,
  skills: SkillsState,
  stats: StatsState,
  tables: TablesState,
  translations: TranslationsState,
  xlsForms: XlsFormsState,
};

export type Dispatch = (action : Action | ThunkAction | PromiseAction) => any;
export type GetState = () => State;
export type ThunkAction = (dispatch : Dispatch, getState : GetState) => any;
export type PromiseAction = Promise<Action>;

export type Reducer<T> = (state : T, action : Action) => T;
