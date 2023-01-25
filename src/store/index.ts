import { create } from 'zustand'

interface IUser {
  id: number
  email: string
  firstName: string | null
  lastName: string | null
}

interface IState {
  user: IUser
  setUser: (user: IUser) => void
}

export const useStore = create<IState>(set => ({
  user: {
    id: 0,
    email: '',
    firstName: null,
    lastName: null,
  },
  setUser: user => set(() => ({ user })),
}))
