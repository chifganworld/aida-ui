export const settingsApi = () => '/settings/api'

export const settingsEncryption = () => '/settings/encryption'

export const messages = () => '/messages'

export const botIndex = () => '/b'

export const bot = (botId) => `/b/${botId}`

export const botData = (botId) => `/b/${botId}/data`

export const botAnalytics = (botId) => `/b/${botId}/analytics`

export const botChannelIndex = (botId) => `/b/${botId}/c`
export const botChannel = (botId, channelId) => `/b/${botId}/c/${channelId}`

export const botBehaviour = (botId) => `/b/${botId}/behaviour`

export const botFrontDesk = botBehaviour

export const botSkill = (botId, skillId) => `/b/${botId}/behaviour/${skillId}`

export const botTranslations = (botId) => `/b/${botId}/translations`
export const botTranslationsContent = (botId) => `/b/${botId}/translations/content`
export const botTranslationsVariables = (botId) => `/b/${botId}/translations/variables`
export const botTables = (botId) => `/b/${botId}/translations/tables`
export const botTable = (botId, tableId) => `/b/${botId}/translations/tables/${tableId}`

export const botCollaborators = (botId) => `/b/${botId}/collaborators`
export const botErrorLogs = (botId) => `/b/${botId}/error_logs`

export const absoluteUrl = (path) => {
  let baseUrl = window.baseUrl
  if (baseUrl.endsWith('/')) {
    baseUrl = baseUrl.slice(0, baseUrl.length - 1)
  }
  if (!path.startsWith('/')) {
    throw new Error('path argument must start with /')
  }
  return `${baseUrl}${path}`
}
