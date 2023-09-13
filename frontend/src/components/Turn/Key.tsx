import { SpaceInfo } from "../../interface/ingame";

interface Props {
  turnData: SpaceInfo;
  close: React.Dispatch<React.SetStateAction<boolean>>;
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export default function Key({ turnData, close }: Props) {
  return (
    <>
      <div className={"key"}>
        <div>
          <button onClick={() => close(false)}>닫기</button>
        </div>
        <div>황금열쇠</div>
      </div>
    </>
  );
}
