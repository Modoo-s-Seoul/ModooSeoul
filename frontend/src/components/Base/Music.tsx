import React, { useEffect, useRef } from "react";

interface BackgroundMusicProps {
  src: string;
}

const BackgroundMusic: React.FC<BackgroundMusicProps> = ({ src }) => {
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    const audioElement = audioRef.current;
    if (audioElement) {
      audioElement.src = "../../../public/music.mp3";
      audioElement.loop = true;
      audioElement.play().catch((error) => {
        // 오디오를 재생할 수 없는 경우에 대한 오류 처리
        console.error("음악을 재생할 수 없습니다:", error);
      });
    }

    return () => {
      if (audioElement) {
        // audioElement.pause();
      }
    };
  }, [src]);

  return null;
};

export default BackgroundMusic;
