import EmojiPicker from "emoji-picker-react"
import {
  arrayUnion,
  doc,
  getDoc,
  onSnapshot,
  updateDoc
} from "firebase/firestore"
import { useEffect, useRef, useState } from "react"
import { db } from "../../lib/firebase"
import { useChatStore } from "../../lib/store/chatStore"
import { useUserStore } from "../../lib/store/userStore"
import uploadFileToFirebaseStorage from "../../lib/upload"
import "./chat.css"

function Chat() {
  const [isEmojiOpen, setIsEmojiOpen] = useState(false)
  const [chat, setChat] = useState()
  const [text, setText] = useState("")
  const [counter, setCounter] = useState(0)

  const { currentUser } = useUserStore()
  const { chatId, user, isCurrentUserBlocked, isReceiverBlocked } =
    useChatStore()

  const isBlocked = isCurrentUserBlocked || isReceiverBlocked
  const [image, setImage] = useState({
    file: null,
    url: ""
  })
  const handleImage = e => {
    const image = e.target.files[0]
    if (image) {
      setImage({
        file: image,
        url: URL.createObjectURL(image)
      })
    }
  }

  const endRef = useRef(null)
  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [counter])
  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [])

  useEffect(() => {
    const unSub = onSnapshot(doc(db, "chats", chatId), async document => {
      setChat(document.data())
      setCounter(prev => prev + 1)
    })

    return () => {
      unSub()
    }
  }, [chatId])

  const handleEmoji = e => {
    setText(prev => prev + e.emoji)
  }

  const handleSend = async () => {
    if (text === "") return

    try {
      const imageUrl = await uploadFileToFirebaseStorage(image.file)
      await updateDoc(doc(db, "chats", chatId), {
        messages: arrayUnion({
          senderId: currentUser.id,
          text,
          createdAt: new Date(),
          ...(imageUrl && { img: imageUrl })
        })
      })

      const userIDs = [currentUser.id, user.id]

      userIDs.forEach(async id => {
        const userChatsRef = doc(db, "userChats", id)
        const userChatsSnapshot = await getDoc(userChatsRef)
        if (userChatsSnapshot.exists()) {
          const userChatsData = userChatsSnapshot.data()
          const chatIndex = userChatsData.chats.findIndex(
            c => c.chatId === chatId
          )
          userChatsData.chats[chatIndex].lastMessage = text
          userChatsData.chats[chatIndex].isSeen = id === currentUser.id
          userChatsData.chats[chatIndex].updatedAt = Date.now()

          await updateDoc(userChatsRef, {
            chats: userChatsData.chats
          })
        }
      })
      setText("")
      setImage({
        file: null,
        url: null
      })
      setCounter(prev => prev + 1)
    } catch (error) {
      console.error(error)
    }
  }

  return (
    <div className="chat">
      <div className="top">
        <div className="user">
          <img src={user?.avatar || "./avatar.png"} alt="avatar" />
          <div className="texts">
            <span>{user?.username}</span>
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
          <div
            className={
              message.senderId === currentUser?.id ? "message own" : "message"
            }
            key={message?.createdAt}
          >
            <img src="./avatar.png" alt="avatar" />
            <div className="texts">
              {message?.img && <img src={message?.img} alt="shared image" />}
              <p>{message.text}</p>
              {/* <span>1 min ago</span> */}
            </div>
          </div>
        ))}
        {image.url && (
          <div className="message own">
            <div className="texts">
              <img
                src={image.url}
                alt="shared image"
                style={{
                  filter: "brightness(70%)"
                }}
              />
            </div>
          </div>
        )}
        <div ref={endRef}></div>
      </div>
      <div className="bottom">
        <div className="icons">
          <label htmlFor="file">
            <img src="./img.png" alt="emoji" />
          </label>
          <input
            type="file"
            name="image"
            id="file"
            style={{ display: "none" }}
            onChange={handleImage}
          />
          <img src="./camera.png" alt="emoji" />
          <img src="./mic.png" alt="emoji" />
        </div>
        <input
          type="text"
          name="chat"
          placeholder={
            isBlocked ? "You cannot send the message!" : "Type a message..."
          }
          onChange={e => setText(e.target.value)}
          value={text}
          disabled={isBlocked}
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
        <button
          className="sendButton"
          onClick={handleSend}
          disabled={isBlocked}
        >
          Send
        </button>
      </div>
    </div>
  )
}

export default Chat
