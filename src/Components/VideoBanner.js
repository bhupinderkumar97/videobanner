import React, { useRef, useEffect } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import BannerVideo from '../Assets/Hailuo_Video_A cinematic forward tracking s_427492511959605251.mp4';

// Register the ScrollTrigger plugin with GSAP
gsap.registerPlugin(ScrollTrigger);

// --- GSAP ScrollTrigger Setup Function ---
const setupVideoScrub = (video, container, isLowPerformance = false) => {
    ScrollTrigger.getById('video-scrub')?.kill();

    ScrollTrigger.create({
        id: 'video-scrub',
        trigger: container,
        start: 'top top',
        end: 'bottom bottom',
        scrub: isLowPerformance ? 1.5 : 1, // Higher scrub for low-performance PCs
        immediateRender: false,
        onUpdate: (self) => {
            const progress = self.progress;
            const newTime = progress * video.duration;

            // Throttle updates with requestAnimationFrame
            requestAnimationFrame(() => {
                if (Math.abs(video.currentTime - newTime) > (isLowPerformance ? 0.5 : 0.3)) { // Larger threshold for low-performance
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

        // Optimize video settings
        video.preload = 'auto';
        video.muted = true;
        video.playsInline = true;
        video.disablePictureInPicture = true;

        // Detect low-performance system (basic heuristic)
        const isLowPerformance = navigator.hardwareConcurrency <= 4 || !window.matchMedia('(min-resolution: 2dppx)').matches;

        const handleVideoReady = () => {
            console.log('Video readyState:', video.readyState, 'Duration:', video.duration);
            video.currentTime = 0;
            video.pause();
            setupVideoScrub(video, container, isLowPerformance);
        };

        // Force GPU rendering
        video.style.transform = 'translateZ(0)';

        if (video.readyState >= 3) {
            handleVideoReady();
        } else {
            video.addEventListener('canplaythrough', handleVideoReady, { once: true });
        }

        // Cleanup
        return () => {
            ScrollTrigger.getAll().forEach(trigger => trigger.kill());
            video.removeEventListener('canplaythrough', handleVideoReady);
        };
    }, []);

    return (
        <div ref={containerRef} className="scroll-video-section relative h-[350vh] bg-black">
            <div className="sticky top-0 h-screen overflow-hidden">
                <video
                    ref={videoRef}
                    muted
                    playsInline
                    preload="auto"
                    className="h-full w-full object-cover will-change-transform backface-hidden"
                    style={{ transform: 'translateZ(0)' }}
                >
                    <source src={BannerVideo} type="video/mp4" />
                    <p>Your browser does not support the video tag.</p>
                </video>
            </div>
        </div>
    );
}