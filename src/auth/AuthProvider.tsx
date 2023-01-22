import { useNavigate } from 'react-router-dom'
import { createContext, useContext, useMemo, ReactNode, useState } from 'react'
import useLocalStorage from '../hooks/useLocalStorage'
import { makeRequest } from '../helpers/makeRequest'

export interface ITokens {
  access_token: string
  refresh_token: string
}

export interface IStoredTokens {
  accessToken: string
  refreshToken: '' | { 0: string; 1: number }
}

interface ICredentials {
  email: string
  password: string
}

interface IAuthContextType {
  tokens: IStoredTokens
  signIn: (credentials: ICredentials) => Promise<void>
  signUp: (credentials: ICredentials) => Promise<void>
  logout: () => Promise<void>
  refresh: () => Promise<ITokens['access_token']>
}

interface IAuthProviderProps {
  children: ReactNode
}

const initialState: IAuthContextType = {
  tokens: {
    accessToken: '',
    refreshToken: '',
  },
  signIn: async _credentials => {},
  signUp: async _credentials => {},
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
        try {
          const tokens = await makeRequest<ITokens>('auth/local/signin', 'POST', credentials)
          setAccessToken(tokens.access_token)
          setRefreshToken({ 0: tokens.refresh_token, 1: Date.now() })
          navigate('/dashboard', { replace: true })
        } catch (error) {
          console.warn('Sign In failed:', error)
        }
      },
      signUp: async (credentials: ICredentials) => {
        try {
          const tokens = await makeRequest<ITokens>('auth/local/signup', 'POST', credentials)
          setAccessToken(tokens.access_token)
          setRefreshToken({ 0: tokens.refresh_token, 1: Date.now() })
          navigate('/dashboard', { replace: true })
        } catch (error) {
          console.warn('Sign Up failed:', error)
        }
      },
      logout: async () => {
        try {
          await makeRequest(
            'auth/logout',
            'POST',
            {},
            {
              Authorization: `Bearer ${accessToken}`,
            }
          )
        } catch (error) {
          console.warn('Logout failed:', error)
        }
        setAccessToken('')
        removeRefreshToken()
        navigate('/login', { replace: true })
      },
      refresh: async () => {
        try {
          const tokens = await makeRequest<ITokens>(
            'auth/refresh',
            'POST',
            {},
            {
              Authorization: `Bearer ${refreshToken[0]}`,
            }
          )
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
