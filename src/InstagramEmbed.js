import React, { useEffect } from 'react';

const InstagramEmbed = ({ url, maxWidth = 320, hideCaption = false }) => {
  useEffect(() => {
    const script = document.createElement('script');
    script.src = "https://www.instagram.com/embed.js";
    script.async = true;
    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script);
    };
  }, [url]);

  return (
    <blockquote
      className="instagram-media"
      data-instgrm-permalink={url}
      data-instgrm-version="14"
      style={{
        maxWidth: `${maxWidth}px`,
        margin: "auto",
      }}
      data-instgrm-captioned={!hideCaption}
    />
  );
};

export default InstagramEmbed;
