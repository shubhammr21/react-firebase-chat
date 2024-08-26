import EmojiPicker from "emoji-picker-react"
import { useState } from "react"
import "./chat.css"

function Chat() {
  const [isEmojiOpen, setIsEmojiOpen] = useState(false)
  const [text, setText] = useState("")

  const handleEmoji = e => {
    setText(prev => prev + e.emoji)
    console.log(e)
  }

  return (
    <div className="chat">
      <div className="top">
        <div className="user">
          <img src="./avatar.png" alt="avatar" />
          <div className="texts">
            <span>Jane Doe</span>
            <p>Lorem ipsum dolor sit amet consectetur adipisicing elit.</p>
          </div>
        </div>
        <div className="icons">
          <img src="./phone.png" alt="phone" />
          <img src="./video.png" alt="video" />
          <img src="./info.png" alt="avatar" />
        </div>
      </div>
      <div className="center"></div>
      <div className="bottom">
        <div className="icons">
          <img src="./img.png" alt="emoji" />
          <img src="./camera.png" alt="emoji" />
          <img src="./mic.png" alt="emoji" />
        </div>
        <input
          type="text"
          name="chat"
          placeholder="Type a message..."
          onChange={e => setText(e.target.value)}
          value={text}
        />
        <div className="emoji">
          <img
            src="./emoji.png"
            alt="emoji"
            onClick={() => setIsEmojiOpen(prev => !prev)}
          />
          <EmojiPicker
            className="picker"
            open={isEmojiOpen}
            onEmojiClick={handleEmoji}
          />
        </div>
        <button className="sendButton">Send</button>
      </div>
    </div>
  )
}

export default Chat
