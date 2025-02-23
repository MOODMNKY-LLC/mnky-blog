import { createClient } from '@/utils/supabase/server'
import { Navbar } from './navbar'

export async function NavWrapper() {
  const supabase = await createClient()

  try {
    const { data: { user }, error: userError } = await supabase.auth.getUser()

    if (userError || !user) {
      return <Navbar 
        isAuthenticated={false} 
        user={{ email: undefined, fullName: undefined, avatarUrl: undefined }} 
      />
    }

    // Fetch user profile data
    const { data: profile } = await supabase
      .from('profiles')
      .select('full_name, avatar_url')
      .eq('id', user.id)
      .single()

    return (
      <Navbar
        isAuthenticated={true}
        user={{
          email: user.email,
          fullName: profile?.full_name,
          avatarUrl: profile?.avatar_url
        }}
      />
    )
  } catch (error) {
    // Log only unexpected errors
    if (error instanceof Error && !error.message.includes('not found')) {
      console.error('NavWrapper Error:', error)
    }
    return <Navbar 
      isAuthenticated={false} 
      user={{ email: undefined, fullName: undefined, avatarUrl: undefined }}
    />
  }
} 