import ChatResultMessage from './ChatResultMessage'

export default function ChatMessage({ message }) {
  if (message.type === 'typing') {
    return (
      <div className="chat-bubble chat-bubble--bot chat-bubble--typing">
        <div className="typing-dots">
          <span />
          <span />
          <span />
        </div>
      </div>
    )
  }

  if (message.type === 'result') {
    return (
      <div className="chat-bubble chat-bubble--result">
        <ChatResultMessage resultData={message.resultData} bonusData={message.bonusData} />
      </div>
    )
  }

  return (
    <div className={`chat-bubble chat-bubble--${message.role}`}>
      {message.content}
    </div>
  )
}
