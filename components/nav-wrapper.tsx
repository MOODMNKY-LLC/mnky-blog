import { createClient } from '@/utils/supabase/server'
import { Navbar } from './navbar'

export async function NavWrapper() {
  try {
    const supabase = await createClient()
    
    // First check the session to avoid unnecessary user fetches
    const { data: { session } } = await supabase.auth.getSession()
    
    if (!session) {
      return <Navbar user={null} isAuthenticated={false} />
    }

    // Only fetch user and profile if we have a session
    const { data: { user } } = await supabase.auth.getUser()
    
    if (!user) {
      return <Navbar user={null} isAuthenticated={false} />
    }

    // Get profile data
    const { data: profile } = await supabase
      .from('profiles')
      .select('full_name, avatar_url')
      .eq('id', user.id)
      .single()
    
    return (
      <Navbar 
        user={{
          email: user.email,
          fullName: profile?.full_name,
          avatarUrl: profile?.avatar_url
        }}
        isAuthenticated={true}
      />
    )
  } catch (error) {
    // Don't log auth session missing errors as they're expected for logged out users
    if (!(error instanceof Error && error.message === 'Auth session missing!')) {
      console.error('Error in NavWrapper:', error)
    }
    return <Navbar user={null} isAuthenticated={false} />
  }
} 