"use client";

import Image from "next/image";

export default function FloatingPotatoCorner() {
    return (
        <div
            className="
        fixed bottom-4 right-4 z-9999
        w-62.5 h-62.5
        drop-shadow-xl
        pointer-events-none
      "
        >
            <video

                autoPlay
                muted
                loop
                disablePictureInPicture
                preload="metadata"
                style={{ width: "100%", maxWidth: 720, borderRadius: 12 }}
            >
                <source src="/video/vo002.mp4" type="video/mp4" />
                Your browser does not support the video tag.
            </video>
        </div>
    );
}
