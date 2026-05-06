'use client';

import React from 'react';

interface VideoPlayerProps {
  youtubeUrl: string;
  title?: string;
}

export const VideoPlayer: React.FC<VideoPlayerProps> = ({ youtubeUrl, title }) => {
  // Extract YouTube video ID from verschiedenen URL formats
  const getYoutubeId = (url: string) => {
    if (url.length === 11) return url;
    const regex = /(?:https?:\/\/)?(?:www\.)?(?:youtube\.com\/(?:[^\/\n\s]+\/\S+\/|(?:v|e(?:mbed)?)\/|\S*?[?&]v=)|youtu\.be\/)([a-zA-Z0-9_-]{11})/;
    const match = url.match(regex);
    return match?.[1] || null;
  };

  const videoId = getYoutubeId(youtubeUrl);

  if (!videoId) {
    return (
      <div className="w-full bg-beige rounded-lg flex items-center justify-center h-96">
        <p className="text-warm-gray">Invalid video URL</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="relative w-full pb-[56.25%] bg-black rounded-lg overflow-hidden">
        <iframe
          className="absolute inset-0 w-full h-full"
          src={`https://www.youtube.com/embed/${videoId}`}
          title={title || 'Video player'}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        />
      </div>
    </div>
  );
};
