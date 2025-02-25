'use client';

import * as React from 'react';
import { createClient } from '@/utils/supabase/client';
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Settings } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { cn } from "@/lib/utils";

interface UserProfileProps {
  className?: string;
  sidebarOpen?: boolean;
}

interface Profile {
  id: string;
  assistant_name: string | null;
  system_prompt: string | null;
  temperature: number;
  created_at: string;
  updated_at: string;
}

interface UserMetadata {
  avatar_url?: string;
  full_name?: string;
  email?: string;
  username?: string;
}

interface User {
  id: string;
  email?: string;
  user_metadata: UserMetadata;
  profile?: Profile;
}

const formSchema = z.object({
  assistantName: z.string().min(2, {
    message: "Assistant name must be at least 2 characters.",
  }),
  systemPrompt: z.string().min(10, {
    message: "System prompt must be at least 10 characters.",
  }),
  temperature: z.number().min(0).max(1).default(0.7),
  full_name: z.string().optional(),
  username: z.string().optional(),
  avatar_url: z.string().optional(),
});

export function UserProfile({ className, sidebarOpen = true }: UserProfileProps) {
  const [user, setUser] = React.useState<User | null>(null);
  const [loading, setLoading] = React.useState(true);
  const supabase = createClient();
  const { toast } = useToast();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      assistantName: "BLOG MNKY",
      systemPrompt: "",
      temperature: 0.7,
    },
  });

  React.useEffect(() => {
    async function getProfile() {
      try {
        setLoading(true);
        const { data: { user } } = await supabase.auth.getUser();

        if (user) {
          const { data: profile } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', user.id)
            .single();

          if (profile) {
            form.reset({
              assistantName: profile.assistant_name || "BLOG MNKY",
              systemPrompt: profile.system_prompt || "",
              temperature: profile.temperature || 0.7,
            });
          }

          setUser({
            id: user.id,
            email: user.email || '',
            user_metadata: user.user_metadata,
            profile
          });
        }
      } catch (error) {
        console.error('Error fetching profile:', error);
      } finally {
        setLoading(false);
      }
    }

    getProfile();
  }, [form, supabase]);

  React.useEffect(() => {
    if (user) {
      form.setValue('full_name', user.user_metadata.full_name || '');
      form.setValue('username', user.user_metadata.username || '');
      form.setValue('avatar_url', user.user_metadata.avatar_url || '');
    }
  }, [user, form]);

  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      const { error } = await supabase
        .from('profiles')
        .upsert({
          id: user?.id,
          assistant_name: values.assistantName,
          system_prompt: values.systemPrompt,
          temperature: values.temperature,
          updated_at: new Date().toISOString(),
        });

      if (error) throw error;

      // Update Flowise configuration
      const response = await fetch('/api/flowise/config', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          assistantName: values.assistantName,
          systemPrompt: values.systemPrompt,
          temperature: values.temperature,
        }),
      });

      if (!response.ok) throw new Error('Failed to update Flowise configuration');

      toast({
        title: "Settings updated",
        description: "Your assistant preferences have been saved.",
      });
    } catch (error) {
      console.error('Error updating profile:', error);
      toast({
        title: "Error",
        description: "Failed to update settings. Please try again.",
        variant: "destructive",
      });
    }
  }

  if (loading) {
    return (
      <Button 
        variant="ghost" 
        className={cn(
          "w-full justify-start gap-2 text-zinc-400",
          !sidebarOpen && "justify-center px-0",
          className
        )}
      >
        <Settings className="h-4 w-4 animate-spin" />
        {sidebarOpen && <span>Loading...</span>}
      </Button>
    );
  }

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button 
          variant="ghost" 
          className={cn(
            "w-full justify-start gap-2 text-zinc-400 hover:text-amber-500 hover:bg-zinc-800/50",
            !sidebarOpen && "justify-center px-0",
            className
          )}
        >
          <Avatar className="h-6 w-6 ring-1 ring-amber-500/20">
            <AvatarImage src={user?.user_metadata?.avatar_url} />
            <AvatarFallback className="bg-zinc-800 text-amber-500 text-xs">
              {user?.email?.charAt(0).toUpperCase()}
            </AvatarFallback>
          </Avatar>
          {sidebarOpen && (
            <div className="flex flex-col items-start text-left">
              <span className="text-sm truncate">
                {user?.user_metadata?.full_name || user?.email?.split('@')[0] || 'User'}
              </span>
              <span className="text-xs">
                <span className="text-amber-500">BLOG</span>{" "}
                <span className="text-zinc-400">MNKY</span>{" "}
                <span className="text-zinc-500">config</span>
              </span>
            </div>
          )}
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px] bg-zinc-900 border-zinc-800">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold bg-gradient-to-r from-amber-500 to-amber-600 bg-clip-text text-transparent">
            Assistant Configuration
          </DialogTitle>
          <DialogDescription className="text-zinc-400">
            Customize your BLOG MNKY assistant's personality and behavior.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="assistantName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Assistant Name</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="BLOG MNKY"
                      className="bg-zinc-800/50 border-zinc-700 text-zinc-100"
                      {...field}
                    />
                  </FormControl>
                  <FormDescription className="text-zinc-500">
                    Give your assistant a unique name.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="systemPrompt"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>System Prompt</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Enter custom instructions for your assistant..."
                      className="bg-zinc-800/50 border-zinc-700 text-zinc-100 min-h-[100px]"
                      {...field}
                    />
                  </FormControl>
                  <FormDescription className="text-zinc-500">
                    Customize how your assistant behaves and responds.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="temperature"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Temperature ({field.value})</FormLabel>
                  <FormControl>
                    <Input
                      type="range"
                      min="0"
                      max="1"
                      step="0.1"
                      className="bg-zinc-800/50 border-zinc-700"
                      {...field}
                      onChange={e => field.onChange(parseFloat(e.target.value))}
                    />
                  </FormControl>
                  <FormDescription className="text-zinc-500">
                    Adjust creativity level (0 = focused, 1 = creative)
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button
              type="submit"
              className="w-full bg-amber-500 hover:bg-amber-600 text-zinc-900"
            >
              Save Changes
            </Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
} 