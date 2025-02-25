"use client";

import { cn } from "@/lib/utils";
import Image from "next/image";

interface Avatar {
  imageUrl: string;
  profileUrl?: string;
}

interface AvatarCirclesProps {
  className?: string;
  numPeople?: number;
  avatars: Avatar[];
  size?: number;
  onClick?: () => void;
  showLink?: boolean;
}

export const AvatarCircles = ({
  numPeople,
  className,
  avatars,
  size = 40,
  onClick,
  showLink = true,
}: AvatarCirclesProps) => {
  // For single avatar use
  if (avatars.length === 1 && !numPeople) {
    const avatar = avatars[0];
    const content = (
      <Image
        className={cn(
          "rounded-full border-2 border-amber-500/20 object-cover ring-1 ring-amber-500/20",
          onClick && "cursor-pointer hover:border-amber-500/30 hover:ring-amber-500/30"
        )}
        src={avatar.imageUrl}
        width={size}
        height={size}
        alt="Avatar"
        style={{ width: size, height: size }}
      />
    );

    if (showLink && avatar.profileUrl) {
      return (
        <a
          href={avatar.profileUrl}
          className={className}
          onClick={(e) => {
            if (onClick) {
              e.preventDefault();
              onClick();
            }
          }}
        >
          {content}
        </a>
      );
    }

    return (
      <div className={className} onClick={onClick}>
        {content}
      </div>
    );
  }

  // Original multiple avatars display
  return (
    <div className={cn("z-10 flex -space-x-4 rtl:space-x-reverse", className)}>
      {avatars.map((avatar, index) => (
        <a
          key={index}
          href={avatar.profileUrl}
          target="_blank"
          rel="noopener noreferrer"
        >
          <Image
            className="rounded-full border-2 border-amber-500/20 object-cover ring-1 ring-amber-500/20 hover:border-amber-500/30 hover:ring-amber-500/30"
            src={avatar.imageUrl}
            width={size}
            height={size}
            alt={`Avatar ${index + 1}`}
            style={{ width: size, height: size }}
          />
        </a>
      ))}
      {(numPeople ?? 0) > 0 && (
        <a
          className={cn(
            "flex items-center justify-center rounded-full border-2 border-amber-500/20 bg-zinc-900 text-center text-xs font-medium",
            "text-amber-500 hover:bg-zinc-800 hover:border-amber-500/30 ring-1 ring-amber-500/20 hover:ring-amber-500/30"
          )}
          style={{ width: size, height: size }}
          href="#"
        >
          +{numPeople}
        </a>
      )}
    </div>
  );
};
