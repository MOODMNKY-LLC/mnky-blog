'use client'

import { Button } from '@/components/ui/button'
import { initializeDefaultChannels } from '@/app/actions/initialize-channels'
import { useToast } from '@/components/ui/use-toast'

interface InitializeChannelsResult {
  success?: boolean;
  error?: string;
  channels?: Array<{
    name: string;
    type: string;
  }>;
}

export function InitializeChannelsButton() {
  const { toast } = useToast()

  const handleInitialize = async () => {
    const result: InitializeChannelsResult = await initializeDefaultChannels()
    
    if (result.error) {
      toast({
        title: 'Error',
        description: result.error,
        variant: 'destructive',
      })
      return
    }

    // Create a formatted list of channels
    const channelList = result.channels
      ? result.channels.map(ch => `${ch.name} (${ch.type})`).join('\n')
      : 'No channels found'
    
    toast({
      title: 'Success',
      description: `Channels initialized:\n${channelList}`,
    })
  }

  return (
    <Button 
      onClick={handleInitialize}
      className="mt-8 mx-auto"
    >
      Initialize Default Channels
    </Button>
  )
} 