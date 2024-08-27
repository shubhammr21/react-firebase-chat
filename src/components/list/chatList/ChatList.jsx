import { doc, getDoc, onSnapshot } from "firebase/firestore"
import { useEffect, useState } from "react"
import { db } from "../../../lib/firebase"
import { useUserStore } from "../../../lib/store/userStore"
import AddUser from "../../addUser/AddUser"
import "./chatList.css"

function ChatList() {
  const [addMode, setAddMode] = useState(false)
  const [chats, setChats] = useState([])
  const { currentUser } = useUserStore()

  useEffect(() => {
    const unSub = onSnapshot(
      doc(db, "userChats", currentUser.id),
      async document => {
        const items = document.data().chats
        const promises = items.map(async item => {
          const userDocRef = doc(db, "users", item.receiverID)
          const userDocSnap = await getDoc(userDocRef)
          const user = userDocSnap.data()
          return { ...item, user }
        })
        const chatData = await Promise.all(promises)
        setChats(chatData.sort((a, b) => b.updatedAt - a.updatedAt))
      }
    )

    return () => {
      unSub()
    }
  }, [currentUser.id])

  return (
    <div className="chatList">
      <div className="search">
        <div className="searchBar">
          <img src="./search.png" alt="search" />
          <input type="text" name="search" id="search" placeholder="Search" />
        </div>
        <img
          src={addMode ? "./minus.png" : "./plus.png"}
          alt="create chat"
          className="add"
          onClick={() => setAddMode(prev => !prev)}
        />
      </div>
      {chats.map(chat => (
        <div className="item" key={chat.chatId}>
          <img src="./avatar.png" alt="avatar" />
          <div className="texts">
            <span>Jane Doe</span>
            <p>Hello</p>
          </div>
        </div>
      ))}
      {addMode && <AddUser />}
    </div>
  )
}

export default ChatList
