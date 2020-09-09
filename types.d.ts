export type ContentType = 'text' | 'voice' | 'image'
export type ID = string
export type TextContent = string
export type ImageContent = string
export type VoiceContent = string

export interface MessageInstance<
  T = ContentType,
  S = TextContent | ImageContent | VoiceContent
> {
  readonly id: ID
  senderAvatarUrl: string
  senderId: ID
  senderName: string
  contentType: T
  content: S
  createTime: number
}

export interface SendMessageInstance extends MessageInstance {
  isSent?: boolean
  loading?: boolean
  duration?: number
}
