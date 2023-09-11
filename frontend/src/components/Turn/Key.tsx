import { SpaceInfo } from "../../data/BoardData";

interface Props {
  turnData: SpaceInfo;
  close: React.Dispatch<React.SetStateAction<boolean>>;
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
function Key({ turnData, close }: Props) {
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
export default Key;
