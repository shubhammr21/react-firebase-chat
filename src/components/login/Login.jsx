import { createUserWithEmailAndPassword } from "firebase/auth"
import { doc, setDoc } from "firebase/firestore/lite"
import { useState } from "react"
import { toast } from "react-toastify"
import { auth, db } from "../../lib/firebase"
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

  const handleLogin = async e => {
    e.preventDefault()

    toast.success("Hello")
  }
  const handleRegister = async e => {
    e.preventDefault()
    const formData = new FormData(e.target)
    const { username, email, password } = Object.fromEntries(formData)
    if (!(username || email || password)) {
      toast.warn("All field required")

      return
    }

    try {
      const response = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      )
      await setDoc(doc(db, "users", response.user.uid), {
        username,
        email,
        id: response.user.uid,
        blocked: []
      })
      toast.success("Account created! You can login now!")
    } catch (error) {
      console.log(error)
      toast.error(error.message)
    }
  }

  return (
    <div className="login">
      <div className="item">
        <h2>Welcome Back,</h2>
        <form onSubmit={handleLogin}>
          <input type="text" name="email" placeholder="Email" />
          <input type="password" name="password" placeholder="Password" />
          <button>Login</button>
        </form>
      </div>
      <div className="separator"></div>
      <div className="item">
        <h2>Create an Account</h2>
        <form onSubmit={handleRegister}>
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
          <input type="text" name="username" placeholder="Username" required />
          <input type="text" name="email" placeholder="Email" required />
          <input
            type="password"
            name="password"
            placeholder="Password"
            required
          />
          <button>Sign up</button>
        </form>
      </div>
    </div>
  )
}

export default Login
