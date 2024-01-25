import React, { useRef, useEffect, useState } from 'react';

function LazyImage({ src, 'data-real-src': dataRealSrc, alt }) {
  const [loaded, setLoaded] = useState(false);
  const imageRef = useRef();

  useEffect(() => {
    const options = {
      root: null, // viewport
      rootMargin: '0px', // margin around root
      threshold: 0.5, // visible area ratio
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          // Generate a random delay between 1 and 3 seconds
          const randomDelay = Math.floor(Math.random() * 1000) + 1000;

          // Wait for the random delay before loading the image
          setTimeout(() => {
            // Ensure that imageRef.current exists before accessing its attributes
            if (imageRef.current) {
              // Load the image by setting the data-real-src attribute
              const realSrc = imageRef.current.getAttribute('data-real-src');
              if (realSrc) {
                imageRef.current.src = realSrc;
                imageRef.current.onload = () => {
                  // Once the image is loaded, update the state to display it
                  setLoaded(true);
                };
              }
            }

            // Disconnect the observer since we only want to load the image once
            observer.disconnect();
          }, randomDelay);
        }
      });
    }, options);

    // Start observing the image element
    if (imageRef.current) {
      observer.observe(imageRef.current);
    }

    // Clean up the observer on unmount
    return () => {
      if (imageRef.current) {
        observer.unobserve(imageRef.current);
      }
    };
  }, []);

  return (
    <img
      ref={imageRef}
      data-real-src={dataRealSrc}
      src={loaded ? dataRealSrc : src}
      alt={alt}
    />
  );
}

export default LazyImage;
