import { SpaceInfo } from "../../interface/ingame";

interface Props {
  turnData: SpaceInfo;
  close: React.Dispatch<React.SetStateAction<boolean>>;
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export default function Subway({ turnData, close }: Props) {
  return (
    <>
      <div className={"subway"}>
        <div>
          <button onClick={() => close(false)}>닫기</button>
        </div>
        <div>서울메트로</div>
      </div>
    </>
  );
}
