import { doc, getDoc } from "firebase/firestore"
import { create } from "zustand"
import { auth, db } from "../firebase"

export const useUserStore = create(set => ({
  currentUser: null,
  isLoading: true,
  fetchUserInfo: async uid => {
    if (!uid) return set({ currentUser: null, isLoading: false })
    try {
      const docRef = doc(db, "users", uid)
      const docSnap = await getDoc(docRef)
      if (docSnap.exists()) {
        return set({ currentUser: docSnap.data(), isLoading: false })
      } else {
        auth.signOut()
        return set({ currentUser: null, isLoading: false })
      }
    } catch (error) {
      return set({ currentUser: null, isLoading: false })
    }
  }
}))
