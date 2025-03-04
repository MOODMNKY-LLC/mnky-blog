import { createClient } from '@/utils/supabase/server';
import { ChatChannel } from './ChatChannel';
import { redirect, notFound } from 'next/navigation';
import { ChatMessages } from '@/components/community/chat/ChatMessages';

interface Channel {
  id: string;
  name: string;
  slug: string;
  type: 'TEXT' | 'ANNOUNCEMENT' | 'BLOG_DISCUSSION' | 'FORUM_THREAD' | 'EVENT_CHAT' | 'DIRECT_MESSAGE';
  description?: string;
  is_private: boolean;
  is_direct: boolean;
  metadata: Record<string, any>;
  created_by: string;
  created_at: string;
  updated_at: string;
  archived_at?: string;
}

interface ChannelWithMemberCount extends Channel {
  member_count: number;
}

export default async function ChatChannelPage({
  params,
}: {
  params: Promise<{ channelId: string }>;
}) {
  const supabase = await createClient();
  const { channelId } = await params;

  console.log('[ Debug ] Initial params:', {
    channelId,
    type: typeof channelId
  });

  // First get the current user
  const { data: { user }, error: userError } = await supabase.auth.getUser();

  if (userError || !user) {
    console.error('Auth error:', userError);
    redirect('/login');
  }

  console.log('[ Debug ] Auth check passed:', {
    userId: user.id
  });

  // First try to find by ID
  let { data: channel, error: channelError } = await supabase
    .from('channels')
    .select('*')
    .eq('id', channelId)
    .single();

  // If not found by ID, try by slug
  if (!channel) {
    console.log('[ Debug ] Channel not found by ID, trying slug');
    const slugResult = await supabase
      .from('channels')
      .select('*')
      .eq('slug', channelId)
      .single();
    
    channel = slugResult.data;
    channelError = slugResult.error;

    // If channel doesn't exist and slug is 'general', create it
    if (!channel && channelId === 'general') {
      console.log('[ Debug ] Creating general channel');
      const { data: newChannel, error: createError } = await supabase
        .from('channels')
        .insert({
          name: 'General',
          slug: 'general',
          type: 'TEXT',
          description: 'General discussion channel',
          is_private: false,
          is_direct: false,
          created_by: user.id,
          metadata: {}
        })
        .select()
        .single();

      if (createError) {
        console.error('Error creating general channel:', createError);
        throw new Error('Failed to create general channel');
      }

      channel = newChannel;
      channelError = null;

      // Add the creator as a member and owner
      const { error: memberError } = await supabase
        .from('channel_members')
        .insert({
          channel_id: channel.id,
          user_id: user.id,
          role: 'OWNER'
        });

      if (memberError) {
        console.error('Error adding channel owner:', memberError);
        throw new Error('Failed to set channel ownership');
      }
    }
  }

  if (channelError || !channel) {
    console.error('Channel error:', {
      error: channelError,
      channelId,
      attemptedLookup: 'both id and slug'
    });
    notFound();
  }

  console.log('[ Debug ] Channel found:', {
    id: channel.id,
    slug: channel.slug,
    name: channel.name
  });

  // Check if user has access to this channel
  let { data: membership, error: membershipError } = await supabase
    .from('channel_members')
    .select('role')
    .eq('channel_id', channel.id)
    .eq('user_id', user.id)
    .single();

  // If not a member and channel is public, join it
  if (!membership && !channel.is_private) {
    console.log('[ Debug ] Auto-joining public channel');
    const { data: newMembership, error: joinError } = await supabase
      .from('channel_members')
      .insert({
        channel_id: channel.id,
        user_id: user.id,
        role: 'MEMBER'
      })
      .select()
      .single();

    if (joinError) {
      console.error('Error joining channel:', joinError);
      throw new Error('Failed to join channel');
    }

    membership = newMembership;
    membershipError = null;
  }

  if (membershipError || !membership) {
    console.error('Membership error:', {
      error: membershipError,
      channelId: channel.id,
      userId: user.id
    });
    notFound();
  }

  console.log('[ Debug ] Membership verified:', {
    channelId: channel.id,
    userId: user.id,
    role: membership.role
  });

  // Get member count
  const { count } = await supabase
    .from('channel_members')
    .select('*', { count: 'exact', head: true })
    .eq('channel_id', channel.id);

  console.log('[ Debug ] Member count:', count);

  const channelWithCount: ChannelWithMemberCount = {
    ...channel,
    member_count: count || 0
  };

  return (
    <div className="flex flex-col flex-1 min-h-0">
      <ChatChannel channel={channelWithCount} />
    </div>
  );
} 