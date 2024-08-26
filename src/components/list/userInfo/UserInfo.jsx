import "./userInfo.css"

function UserInfo() {
  return (
    <div className="userInfo">
      <div className="user">
        <img src="./avatar.png" alt="more" />
        <h2>John Doe</h2>
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
