import { useNavigate } from 'react-router-dom'
import { createContext, useContext, useMemo, ReactNode, useState } from 'react'
import useLocalStorage from '../hooks/useLocalStorage'
import { makeRequest } from '../helpers/makeRequest'

type UserId<T> = {
  id: number
} & T

interface IUserName {
  firstName: string | null
  lastName: string | null
}

export type User = UserId<IUserName>

export type Tokens = UserId<{
  access_token: string
  refresh_token: string
}>

export type UserTokens = UserId<User & Tokens>

export interface IStoredTokens {
  accessToken: string
  refreshToken: '' | { 0: string; 1: number }
}

interface ICredentials extends IUserName {
  email: string
  password: string
}

interface IAuthContextType {
  tokens: IStoredTokens
  signIn: (credentials: ICredentials) => Promise<User>
  signUp: (credentials: ICredentials) => Promise<number>
  logout: () => Promise<void>
  refresh: () => Promise<Tokens['access_token']>
}

interface IAuthProviderProps {
  children: ReactNode
}

const initialState: IAuthContextType = {
  tokens: {
    accessToken: '',
    refreshToken: '',
  },
  signIn: async _credentials => ({
    id: 0,
    firstName: '',
    lastName: '',
  }),
  signUp: async _credentials => 0,
  logout: async () => {},
  refresh: async () => '',
} as const

const AuthContext = createContext<IAuthContextType>(initialState)

const AuthProvider = ({ children }: IAuthProviderProps) => {
  const [refreshToken, setRefreshToken, removeRefreshToken] = useLocalStorage<IStoredTokens['refreshToken']>(
    import.meta.env.VITE_TOKEN_KEY
  )
  const [accessToken, setAccessToken] = useState('')

  const navigate = useNavigate()

  const value = useMemo<IAuthContextType>(
    () => ({
      tokens: { accessToken, refreshToken },
      signIn: async (credentials: ICredentials) => {
        const { id, firstName, lastName, ...tokens } = await makeRequest<UserTokens>('auth/local/signin', {
          method: 'POST',
          body: credentials,
        })
        setAccessToken(tokens.access_token)
        setRefreshToken({ 0: tokens.refresh_token, 1: Date.now() })
        navigate('/dashboard', { replace: true })
        return { id, firstName, lastName }
      },
      signUp: async (credentials: ICredentials) => {
        const tokens = await makeRequest<Tokens>('auth/local/signup', {
          method: 'POST',
          body: credentials,
        })
        setAccessToken(tokens.access_token)
        setRefreshToken({ 0: tokens.refresh_token, 1: Date.now() })
        navigate('/dashboard', { replace: true })
        return tokens.id
      },
      logout: async () => {
        try {
          await makeRequest('auth/logout', {
            method: 'POST',
            body: {},
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          })
        } catch (error) {
          console.warn('Logout failed:', error)
        }
        setAccessToken('')
        removeRefreshToken()
        navigate('/', { replace: true })
      },
      refresh: async () => {
        try {
          const tokens = await makeRequest<Tokens>('auth/refresh', {
            method: 'POST',
            body: {},
            headers: {
              Authorization: `Bearer ${refreshToken[0]}`,
            },
          })
          setAccessToken(tokens.access_token)
          setRefreshToken({ 0: tokens.refresh_token, 1: Date.now() })
          return tokens.access_token
        } catch (error) {
          console.warn('Refresh failed:', error)
          setAccessToken('')
          removeRefreshToken()
          return ''
        }
      },
    }),
    [accessToken, refreshToken, setRefreshToken, navigate, removeRefreshToken]
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export const useAuth = () => useContext(AuthContext)

export default AuthProvider
