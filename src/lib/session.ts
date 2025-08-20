import { supabase } from './supabase'
import type { User } from '@supabase/supabase-js'

export async function validateSession(): Promise<{ user: User | null; isAuthenticated: boolean }> {
  try {
    const { data: { session }, error } = await supabase.auth.getSession()
    
    if (error || !session) {
      return { user: null, isAuthenticated: false }
    }

    return { 
      user: session.user, 
      isAuthenticated: true 
    }
  } catch (error) {
    console.error('Session validation error:', error)
    return { user: null, isAuthenticated: false }
  }
}

export async function refreshSession() {
  try {
    const { data, error } = await supabase.auth.refreshSession()
    
    if (error) {
      throw new Error(`Session refresh failed: ${error.message}`)
    }
    
    return data.session
  } catch (error) {
    console.error('Session refresh error:', error)
    throw error
  }
}

export async function signOut() {
  try {
    const { error } = await supabase.auth.signOut()
    
    if (error) {
      throw new Error(`Sign out failed: ${error.message}`)
    }
  } catch (error) {
    console.error('Sign out error:', error)
    throw error
  }
}