import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword
} from "firebase/auth"
import { doc, setDoc } from "firebase/firestore"
import { useState } from "react"
import { toast } from "react-toastify"
import { auth, db } from "../../lib/firebase"
import uploadFileToFirebaseStorage from "../../lib/upload"
import "./login.css"
function Login() {
  const [avatar, setAvatar] = useState({
    file: null,
    url: ""
  })

  const [loading, setLoading] = useState(false)

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
    const formData = new FormData(e.target)
    const { email, password } = Object.fromEntries(formData)
    if (!(email || password)) {
      toast.warn("All field required")
      return
    }

    try {
      setLoading(true)
      await signInWithEmailAndPassword(auth, email, password)
      toast.success("You have successfully logged in!")
    } catch (error) {
      console.log(error)
      toast.error(error.message)
    } finally {
      setLoading(false)
    }
  }
  const handleRegister = async e => {
    e.preventDefault()
    setLoading(true)
    const formData = new FormData(e.target)
    const { username, email, password } = Object.fromEntries(formData)
    if (!(username || email || password)) {
      toast.warn("All field required")

      return
    }

    try {
      const imgUrl = await uploadFileToFirebaseStorage(avatar.file)
      const response = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      )
      await setDoc(doc(db, "users", response.user.uid), {
        username,
        email,
        avatar: imgUrl,
        id: response.user.uid,
        blocked: []
      })
      await setDoc(doc(db, "userChats", response.user.uid), {
        chats: []
      })
      toast.success("Account created! You can login now!")
    } catch (error) {
      console.log(error)
      toast.error(error.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="login">
      <div className="item">
        <h2>Welcome Back,</h2>
        <form onSubmit={handleLogin}>
          <input type="email" name="email" placeholder="Email" />
          <input type="password" name="password" placeholder="Password" />
          <button disabled={loading}>{loading ? "Loading..." : "Login"}</button>
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
          <input type="email" name="email" placeholder="Email" required />
          <input
            type="password"
            name="password"
            placeholder="Password"
            required
          />
          <button disabled={loading}>
            {loading ? "Loading..." : "Sign up"}
          </button>
        </form>
      </div>
    </div>
  )
}

export default Login
