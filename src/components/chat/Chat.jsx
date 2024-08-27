import EmojiPicker from "emoji-picker-react"
import { doc, onSnapshot } from "firebase/firestore"
import { useEffect, useRef, useState } from "react"
import { db } from "../../lib/firebase"
import { useChatStore } from "../../lib/store/chatStore"
import { useUserStore } from "../../lib/store/userStore"
import "./chat.css"

function Chat() {
  const [isEmojiOpen, setIsEmojiOpen] = useState(false)
  const [chat, setChat] = useState()
  const [text, setText] = useState("")

  const { currentUser } = useUserStore()
  const { chatId } = useChatStore()

  const endRef = useRef(null)
  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [])
  useEffect(() => {
    const unSub = onSnapshot(doc(db, "chats", chatId), async document => {
      setChat(document.data())
    })

    return () => {
      unSub()
    }
  }, [chatId])

  const handleEmoji = e => {
    setText(prev => prev + e.emoji)
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
      <div className="center">
        {chat?.messages?.map(message => (
          <div className="message" key={message?.createAt}>
            <img src="./avatar.png" alt="avatar" />
            <div className="texts">
              {message?.img && <img src={message?.img} alt="shared image" />}
              <p>{message.text}</p>
              {/* <span>1 min ago</span> */}
            </div>
          </div>
        ))}
        {/*
        // for reference
        <div className="message own">
          <div className="texts">
            <p>
              Lorem ipsum dolor sit amet consectetur adipisicing elit. Maiores
              fugiat at quidem? Reprehenderit quibusdam, quasi ad, neque fugit
              laboriosam assumenda eius odit sit ratione quas consectetur,
              facilis nulla nemo atque?
            </p>
            <span>1 min ago</span>
          </div>
        </div>
        <div className="message">
          <img src="./avatar.png" alt="avatar" />
          <div className="texts">
            <img
              src="https://images.pexels.com/photos/2693212/pexels-photo-2693212.png?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2"
              alt="shared image"
            />
            <p>
              Lorem ipsum dolor sit amet consectetur adipisicing elit. Maiores
              fugiat at quidem? Reprehenderit quibusdam, quasi ad, neque fugit
              laboriosam assumenda eius odit sit ratione quas consectetur,
              facilis nulla nemo atque?
            </p>
            <span>1 min ago</span>
          </div>
        </div> */}
        <div ref={endRef}></div>
      </div>
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
