// BackgroundMusic.tsx
import { useRecoilValue } from "recoil";
import React, { useEffect } from "react";
import { musicState } from "../../data/CommonData";

const BackgroundMusic: React.FC = () => {
  // const [audio] = useState(new Audio(music));
  const audio = useRecoilValue(musicState);

  useEffect(() => {
    const playMusic = () => {
      // 음악을 재생하고 이벤트 리스너를 제거합니다.
      console.log("배경음악 세팅");
      audio.muted = true; // 추후 제거 옵션

      audio.play();
      audio.pause();
      window.removeEventListener("click", playMusic);
      window.removeEventListener("keydown", playMusic);
    };
    // 페이지가 로드될 때 클릭 이벤트나 키보드 이벤트를 기다려 음악을 재생합니다.
    window.addEventListener("click", playMusic);
    window.addEventListener("keydown", playMusic);
    return () => {
      // 컴포넌트가 언마운트될 때 이벤트 리스너를 제거합니다.
      // window.removeEventListener("click", playMusic);
      // window.removeEventListener("keydown", playMusic);
    };
  }, [audio]);

  return null;
};

export default BackgroundMusic;
