import React, { useRef, useEffect } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import BannerVideo from '../Assets/Hailuo_Video_A cinematic forward tracking s_427492511959605251.mp4';

// Register the ScrollTrigger plugin with GSAP
gsap.registerPlugin(ScrollTrigger);

// --- GSAP ScrollTrigger Setup Function ---
const setupVideoScrub = (video, container) => {
    ScrollTrigger.getById('video-scrub')?.kill();

    ScrollTrigger.create({
        id: 'video-scrub',
        trigger: container,
        start: 'top top',
        end: 'bottom bottom',
        scrub: 0.7, // Increased scrub for smoother interpolation
        immediateRender: false, // Prevent unnecessary initial renders
        onUpdate: (self) => {
            const progress = self.progress;
            const newTime = progress * video.duration;

            // Throttle updates with requestAnimationFrame and a larger threshold
            requestAnimationFrame(() => {
                if (Math.abs(video.currentTime - newTime) > 0.2) { // Larger threshold
                    video.currentTime = newTime;
                }
            });
        },
    });
};

// --- Main React Component ---
export default function VideoBanner() {
    const videoRef = useRef(null);
    const containerRef = useRef(null);

    useEffect(() => {
        const video = videoRef.current;
        const container = containerRef.current;

        if (!video || !container) return;

        // Optimize video settings for Windows
        video.preload = 'auto';
        video.muted = true;
        video.playsInline = true;
        video.disablePictureInPicture = true; // Reduce overhead

        const handleVideoReady = () => {
            video.currentTime = 0;
            video.pause();
            setupVideoScrub(video, container);
        };

        // Ensure video is fully buffered before enabling scrub
        if (video.readyState >= 3) {
            handleVideoReady();
        } else {
            video.addEventListener('canplaythrough', handleVideoReady, { once: true });
        }

        // Enable hardware acceleration explicitly
        video.style.transform = 'translateZ(0)'; // Force GPU rendering

        // Cleanup
        return () => {
            ScrollTrigger.getAll().forEach(trigger => trigger.kill());
            video.removeEventListener('canplaythrough', handleVideoReady);
        };
    }, []);

    return (
        <div ref={containerRef} className="scroll-video-section relative h-[400vh] bg-black">
            <div className="sticky top-0 h-screen overflow-hidden">
                <video
                    ref={videoRef}
                    muted
                    playsInline
                    preload="auto"
                    className="h-full w-full object-cover will-change-transform"
                    style={{ transform: 'translateZ(0)' }} // Force GPU rendering
                >
                    <source src={BannerVideo} type="video/mp4" />
                    <p>Your browser does not support the video tag.</p>
                </video>
            </div>
        </div>
    );
}