import {
  arrayUnion,
  collection,
  doc,
  getDocs,
  query,
  serverTimestamp,
  setDoc,
  updateDoc,
  where
} from "firebase/firestore"
import { useState } from "react"
import { toast } from "react-toastify"
import { db } from "../../lib/firebase"
import { useUserStore } from "../../lib/store/userStore"
import "./addUser.css"

const AddUser = () => {
  const [user, setUser] = useState(null)
  const { currentUser } = useUserStore()

  const handleSearch = async e => {
    e.preventDefault()
    const formData = new FormData(e.target)
    const username = formData.get("username")

    try {
      const usersRef = collection(db, "users")
      const q = query(usersRef, where("username", "==", username))
      const querySnapShot = await getDocs(q)

      if (!querySnapShot.empty) {
        const userData = querySnapShot.docs[0].data()
        if (userData.id === currentUser.id) {
          toast.warn("You can not add yourself in chat list!")
        } else {
          setUser(querySnapShot.docs[0].data())
        }
      }
    } catch (error) {
      console.error(error)
    }
  }

  const handleAdd = async () => {
    const chatRef = collection(db, "chats")
    const userChatRef = collection(db, "userChats")
    try {
      const newChatRef = doc(chatRef)
      await Promise.all([
        setDoc(newChatRef, {
          createdAt: serverTimestamp(),
          messages: []
        }),
        updateDoc(doc(userChatRef, user.id), {
          chats: arrayUnion({
            chatId: newChatRef.id,
            lastMessage: "",
            receiverId: currentUser.id,
            updatedAt: Date.now()
          })
        }),
        updateDoc(doc(userChatRef, currentUser.id), {
          chats: arrayUnion({
            chatId: newChatRef.id,
            lastMessage: "",
            receiverId: user.id,
            updatedAt: Date.now()
          })
        })
      ])
    } catch (error) {
      console.error(error)
    }
  }

  return (
    <div className="addUser">
      <form onSubmit={handleSearch}>
        <input
          type="text"
          name="username"
          id="username"
          placeholder="Username"
        />
        <button>Search</button>
      </form>
      {user && (
        <div className="user">
          <div className="detail">
            <img src={user.avatar || "./avatar.png"} alt="Search" />
            <span>{user.username}</span>
          </div>
          <button onClick={handleAdd}>Add User</button>
        </div>
      )}
    </div>
  )
}

export default AddUser
