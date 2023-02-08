import { makeRequest } from './../helpers/makeRequest'
import { create } from 'zustand'

interface IUser {
  id: number
  email: string
  firstName: string | null
  lastName: string | null
}

export interface IText {
  textId: number
  text: string
  sentiment: string
  probability: string
}

interface IState {
  user: IUser
  setUser: (user: IUser) => void
  texts: IText[]
  fetchTexts: (authToken: string) => Promise<void>
}

export const useStore = create<IState>((set, get) => ({
  user: {
    id: 0,
    email: '',
    firstName: null,
    lastName: null,
  },
  setUser: user => set(() => ({ user })),
  texts: [],
  fetchTexts: async (authToken: string) => {
    const texts = await makeRequest<IText[]>(`text/${get().user.id}/all`, 'GET', undefined, {
      Authorization: `Bearer ${authToken}`,
    })
    set({ texts })
  },
}))
