import { SpaceInfo } from "../../interface/ingame";

interface Props {
  turnData: SpaceInfo;
  close: React.Dispatch<React.SetStateAction<boolean>>;
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export default function Oil({ turnData, close }: Props) {
  return (
    <>
      <div className={"oil"}>
        <div>
          <button onClick={() => close(false)}>닫기</button>
        </div>
        <div>오일랜드</div>
      </div>
    </>
  );
}
