import { useState } from "react"
import "./chatList.css"

function ChatList() {
  const [addMode, setAddMode] = useState(false)
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
    </div>
  )
}

export default ChatList
