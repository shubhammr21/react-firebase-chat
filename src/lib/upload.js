import { getDownloadURL, ref, uploadBytesResumable } from "firebase/storage"
import { storage } from "./firebase"

const uploadFileToFirebaseStorage = async file => {
  const date = new Date()
  const storageRef = ref(storage, `images/${date.toISOString()}_${file.name}`)
  const uploadTask = uploadBytesResumable(storageRef, file)
  return new Promise((resolve, reject) => {
    uploadTask.on(
      "state_changed",
      snapshot => {
        const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100
        console.log(`Upload is ${progress}% done`)
        switch (snapshot.state) {
          case "running":
            console.log("Upload is running")
            break
          case "paused":
            console.log("Upload is paused")
            break
          case "success":
            console.log("Upload is success")
            break
          case "canceled":
            console.log("Upload is canceled")
            break
          case "error":
            console.log("Upload is error")
            break
        }
      },
      error => {
        console.error(error)
        reject(`File Upload error! [${error.code}]`)
      },
      () => {
        getDownloadURL(uploadTask.snapshot.ref).then(downloadUrl => {
          console.log(`Upload is completed. URL: ${downloadUrl}`)
          resolve(downloadUrl)
        })
      }
    )
  })
}

export default uploadFileToFirebaseStorage
