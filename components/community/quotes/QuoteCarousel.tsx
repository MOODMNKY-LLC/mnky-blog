'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Quote, Heart } from 'lucide-react';
import { createClient } from '@/utils/supabase/client';
import { cn } from '@/lib/utils';

interface Quote {
  id: string;
  text: string;
  author: string;
  type: string;
  is_active: boolean;
}

interface QuoteCarouselProps {
  initialQuotes: Quote[];
  className?: string;
}

export function QuoteCarousel({ initialQuotes, className }: QuoteCarouselProps) {
  const [quotes, setQuotes] = useState<Quote[]>(initialQuotes);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const supabase = createClient();

  // Auto-cycle quotes
  useEffect(() => {
    const interval = setInterval(() => {
      setIsTransitioning(true);
      setTimeout(() => {
        setCurrentIndex((current) => (current + 1) % quotes.length);
        setIsTransitioning(false);
      }, 500); // Match this with the CSS transition duration
    }, 10000); // Change quote every 10 seconds

    return () => clearInterval(interval);
  }, [quotes.length]);

  // Subscribe to quote changes
  useEffect(() => {
    const channel = supabase
      .channel('quotes_channel')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'daily_quotes',
          filter: 'is_active=eq.true'
        },
        async (payload) => {
          // Fetch all active quotes when there's a change
          const { data: newQuotes } = await supabase
            .from('daily_quotes')
            .select('*')
            .eq('is_active', true)
            .order('created_at', { ascending: false });
          
          if (newQuotes) {
            setQuotes(newQuotes);
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [supabase]);

  const currentQuote = quotes[currentIndex];

  if (!currentQuote) return null;

  return (
    <Card className={cn(
      "bg-zinc-900/50 border-zinc-800/50 backdrop-blur-sm hover:border-amber-500/50 transition-colors duration-500 h-full",
      className
    )}>
      <CardContent className="flex flex-col h-full pt-6 pb-5">
        <div className="flex flex-col items-center text-center h-full">
          <div className="h-12 w-12 rounded-full bg-amber-500/10 flex items-center justify-center">
            <Quote className="h-6 w-6 text-amber-500" />
          </div>
          <div className={cn(
            "flex-1 flex flex-col items-center justify-center space-y-3 min-h-[190px] transition-opacity duration-500 my-4",
            isTransitioning ? "opacity-0" : "opacity-100"
          )}>
            <p className="text-xl text-zinc-100 font-medium italic leading-relaxed">"{currentQuote.text}"</p>
            <p className="text-sm text-zinc-400">— {currentQuote.author}</p>
          </div>
          <div className="mt-auto space-y-2">
            <div className="flex items-center gap-2">
              <Heart className="h-4 w-4 text-amber-500" />
              <span className="text-xs text-zinc-500">Daily Inspiration</span>
            </div>
            
            {/* Quote Navigation Dots */}
            <div className="flex gap-2">
              {quotes.map((_, index) => (
                <button
                  key={index}
                  onClick={() => {
                    setIsTransitioning(true);
                    setTimeout(() => {
                      setCurrentIndex(index);
                      setIsTransitioning(false);
                    }, 500);
                  }}
                  className={cn(
                    "w-1.5 h-1.5 rounded-full transition-all duration-300",
                    index === currentIndex
                      ? "bg-amber-500"
                      : "bg-zinc-600 hover:bg-zinc-500"
                  )}
                />
              ))}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
} 