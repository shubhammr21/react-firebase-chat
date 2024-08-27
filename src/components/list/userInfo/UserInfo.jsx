import { useUserStore } from "../../../lib/store/userStore"
import "./userInfo.css"

function UserInfo() {
  const { currentUser } = useUserStore()

  return (
    <div className="userInfo">
      <div className="user">
        <img src={currentUser.avatar || "./avatar.png"} alt="more" />
        <h2>{currentUser.username}</h2>
      </div>
      <div className="icons">
        <img src="./more.png" alt="more" />
        <img src="./video.png" alt="video" />
        <img src="./edit.png" alt="edit" />
      </div>
    </div>
  )
}

export default UserInfo
