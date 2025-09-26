import React, { useEffect, useRef } from "react";
import BannerVideo from "../Assets/Hailuo_Video_A cinematic forward tracking s_427492511959605251.mp4"; // Verify this path
import Lenis from "@studio-freight/lenis";

export default function VideoBanner() {
  const videoRef = useRef(null);
  const scrollFractionRef = useRef(0);
  const rafRef = useRef(null);
  const lenisRef = useRef(null);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    // Ensure video is ready before manipulating
    video.pause();
    video.currentTime = 0; // Start at beginning

    // Initialize Lenis
    const lenis = new Lenis({
      duration: 1,
      easing: (t) => t, // Linear easing
      smooth: true,
    });
    lenisRef.current = lenis;

    // Update scroll fraction based on Lenis scroll position
    const updateScrollFraction = () => {
      const scrollTop = lenis.scroll; // Use Lenis scroll position
      const container = document.querySelector(".video-container");
      const containerHeight = container?.scrollHeight - window.innerHeight || 1;
      let scrollFraction = scrollTop / containerHeight;
      scrollFraction = Math.min(Math.max(scrollFraction, 0), 1);
      scrollFractionRef.current = scrollFraction;
    };

    // Animation loop
    const animate = () => {
      const video = videoRef.current;
      if (video && video.readyState >= 2 && video.duration) {
        const targetTime = video.duration * scrollFractionRef.current;
        video.currentTime += (targetTime - video.currentTime) * .1; // Adjusted lerp factor
      }
      rafRef.current = requestAnimationFrame(animate);
    };

    // Lenis RAF loop
    const lenisRaf = (time) => {
      lenis.raf(time);
      requestAnimationFrame(lenisRaf);
    };

    // Start video playback (handle autoplay policy)
    video.play().catch((error) => {
      console.error("Video playback failed:", error);
      // Optionally show a play button for user interaction
    });

    // Add scroll listener and start animations
    lenis.on("scroll", updateScrollFraction);
    updateScrollFraction(); // Initial calculation
    rafRef.current = requestAnimationFrame(animate);
    requestAnimationFrame(lenisRaf);

    // Cleanup
    return () => {
      lenis.off("scroll", updateScrollFraction);
      cancelAnimationFrame(rafRef.current);
      lenis.destroy();
    };
  }, []);

  return (
    <div className="video-container" style={{ height: "4000px" }}>
      <video
        ref={videoRef}
        style={{ position: "sticky", top: 0, width: "100%", display: "block" }}
        muted
        playsInline
        preload="auto"
        aria-label="Scroll-driven video animation"
      >
        <source src={BannerVideo} type="video/mp4" />
        <p>Your browser does not support the video tag.</p>
      </video>
    </div>
  );
}