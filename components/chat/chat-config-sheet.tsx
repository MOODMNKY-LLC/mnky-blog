import { GearIcon } from "@radix-ui/react-icons";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Slider } from "@/components/ui/slider";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { useState } from "react";

const chatConfigSchema = z.object({
  temperature: z.number().min(0).max(1),
  maxTokens: z.number().min(100).max(4000),
  topP: z.number().min(0).max(1),
  frequencyPenalty: z.number().min(0).max(2),
  presencePenalty: z.number().min(0).max(2),
  memoryType: z.enum(['chat', 'buffer', 'summary']),
  messageWindow: z.number().min(1).max(50),
  systemPrompt: z.string().min(10).max(1000),
});

export type ChatConfig = z.infer<typeof chatConfigSchema>;

const defaultConfig: ChatConfig = {
  temperature: 0.7,
  maxTokens: 2000,
  topP: 0.9,
  frequencyPenalty: 0,
  presencePenalty: 0,
  memoryType: 'chat',
  messageWindow: 10,
  systemPrompt: "You are BLOG MNKY, a helpful AI assistant...",
};

interface ChatConfigSheetProps {
  children?: React.ReactNode;
  onConfigUpdate?: (config: ChatConfig) => void;
}

export function ChatConfigSheet({ children, onConfigUpdate }: ChatConfigSheetProps) {
  const [open, setOpen] = useState(false);
  const form = useForm<ChatConfig>({
    resolver: zodResolver(chatConfigSchema),
    defaultValues: defaultConfig,
  });

  function onSubmit(data: ChatConfig) {
    console.log('Updating chat config:', data);
    onConfigUpdate?.(data);
    setOpen(false);
  }

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        {children || (
          <Button variant="ghost" size="icon" className="relative z-10">
            <GearIcon className="h-8 w-8" />
          </Button>
        )}
      </SheetTrigger>
      <SheetContent className="w-[400px] bg-zinc-900/95 border-zinc-800">
        <SheetHeader>
          <SheetTitle className="text-amber-500">Chat Configuration</SheetTitle>
          <SheetDescription>
            Adjust the behavior and responses of the BLOG MNKY chat assistant.
          </SheetDescription>
        </SheetHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 pt-6">
            <FormField
              control={form.control}
              name="temperature"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Temperature ({field.value})</FormLabel>
                  <FormControl>
                    <Slider
                      min={0}
                      max={1}
                      step={0.1}
                      value={[field.value]}
                      onValueChange={([value]) => field.onChange(value)}
                      className="[&_[role=slider]]:bg-amber-500"
                    />
                  </FormControl>
                  <FormDescription>
                    Controls response creativity (0 = focused, 1 = creative)
                  </FormDescription>
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="maxTokens"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Max Tokens</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      {...field}
                      onChange={e => field.onChange(Number(e.target.value))}
                      className="bg-zinc-800/50 border-zinc-700"
                    />
                  </FormControl>
                  <FormDescription>
                    Maximum length of the response (100-4000)
                  </FormDescription>
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="memoryType"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Memory Type</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger className="bg-zinc-800/50 border-zinc-700">
                        <SelectValue placeholder="Select memory type" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent className="bg-zinc-900 border-zinc-800">
                      <SelectItem value="chat">Chat History</SelectItem>
                      <SelectItem value="buffer">Buffer Memory</SelectItem>
                      <SelectItem value="summary">Summary Memory</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormDescription>
                    How the chat assistant remembers conversation context
                  </FormDescription>
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
                    <Input
                      {...field}
                      className="bg-zinc-800/50 border-zinc-700"
                    />
                  </FormControl>
                  <FormDescription>
                    Base instruction for the chat assistant's behavior
                  </FormDescription>
                </FormItem>
              )}
            />

            <div className="flex justify-end gap-2 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => setOpen(false)}
                className="border-amber-500/20 text-amber-500 hover:bg-amber-500/10"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                className="bg-amber-500 text-zinc-900 hover:bg-amber-600"
              >
                Save Changes
              </Button>
            </div>
          </form>
        </Form>
      </SheetContent>
    </Sheet>
  );
} 