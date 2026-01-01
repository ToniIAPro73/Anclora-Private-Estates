'use client';

import React from 'react';
import { Share2, Linkedin, Facebook, Twitter } from 'lucide-react';

interface ShareButtonsProps {
  title: string;
  url: string;
}

/**
 * ShareButtons Component
 * 
 * Social media sharing buttons for blog posts
 */
export function ShareButtons({ title, url }: ShareButtonsProps) {
  const encodedTitle = encodeURIComponent(title);
  const encodedUrl = encodeURIComponent(url);

  const shareLinks = [
    {
      icon: Linkedin,
      href: `https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`,
      label: 'LinkedIn',
      color: 'hover:bg-[#0A66C2] hover:text-white',
    },
    {
      icon: Facebook,
      href: `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`,
      label: 'Facebook',
      color: 'hover:bg-[#1877F2] hover:text-white',
    },
    {
      icon: Twitter,
      href: `https://twitter.com/intent/tweet?text=${encodedTitle}&url=${encodedUrl}`,
      label: 'Twitter',
      color: 'hover:bg-[#1DA1F2] hover:text-white',
    },
  ];

  const handleNativeShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title,
          url,
        });
      } catch (error) {
        console.log('Error sharing:', error);
      }
    }
  };

  return (
    <div className="flex items-center gap-3">
      <span className="text-sm font-medium text-gray-600">Compartir:</span>
      
      <div className="flex gap-2">
        {shareLinks.map((link, index) => {
          const Icon = link.icon;
          return (
            <a
              key={index}
              href={link.href}
              target="_blank"
              rel="noopener noreferrer"
              className={`w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center transition-colors ${link.color}`}
              aria-label={`Share on ${link.label}`}
            >
              <Icon className="w-5 h-5" />
            </a>
          );
        })}

        {/* Native Share (mobile) */}
        {typeof navigator !== 'undefined' && navigator.share && (
          <button
            onClick={handleNativeShare}
            className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center hover:bg-anclora-gold hover:text-white transition-colors"
            aria-label="Share"
          >
            <Share2 className="w-5 h-5" />
          </button>
        )}
      </div>
    </div>
  );
}
