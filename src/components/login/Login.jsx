import { useState } from "react"
import "./login.css"
function Login() {
  const [avatar, setAvatar] = useState({
    file: null,
    url: ""
  })

  const handleAvatar = e => {
    const avatar = e.target.files[0]
    if (avatar) {
      setAvatar({
        file: avatar,
        url: URL.createObjectURL(avatar)
      })
    }
  }

  return (
    <div className="login">
      <div className="item">
        <h2>Welcome Back,</h2>
        <form>
          <input type="text" name="email" placeholder="Email" />
          <input type="password" name="password" placeholder="Password" />
          <button>Login</button>
        </form>
      </div>
      <div className="separator"></div>
      <div className="item">
        <h2>Create an Account</h2>
        <form>
          <label htmlFor="avatar">
            <img src={avatar.url || "./avatar.png"} alt="avatar" />
            Upload an image
          </label>
          <input
            type="file"
            name="file"
            id="avatar"
            style={{ display: "none" }}
            onChange={handleAvatar}
          />
          <input type="text" name="username" placeholder="Username" />
          <input type="text" name="email" placeholder="Email" />
          <input type="password" name="password" placeholder="Password" />
          <button>Sign up</button>
        </form>
      </div>
    </div>
  )
}

export default Login
