import ChatResultMessage from './ChatResultMessage'
import RobotAvatar from './RobotAvatar'

export default function ChatMessage({ message }) {
  if (message.type === 'typing') {
    return (
      <div className="chat-bubble-row chat-bubble-row--bot">
        <RobotAvatar />
        <div className="chat-bubble chat-bubble--bot chat-bubble--typing">
          <div className="typing-dots">
            <span />
            <span />
            <span />
          </div>
        </div>
      </div>
    )
  }

  if (message.type === 'result') {
    return (
      <div className="chat-bubble-row chat-bubble-row--bot">
        <RobotAvatar />
        <div className="chat-bubble chat-bubble--result">
          <ChatResultMessage resultData={message.resultData} bonusData={message.bonusData} />
        </div>
      </div>
    )
  }

  if (message.role === 'bot') {
    return (
      <div className="chat-bubble-row chat-bubble-row--bot">
        <RobotAvatar />
        <div className="chat-bubble chat-bubble--bot">
          {message.content}
        </div>
      </div>
    )
  }

  return (
    <div className={`chat-bubble chat-bubble--${message.role}`}>
      {message.content}
    </div>
  )
}
