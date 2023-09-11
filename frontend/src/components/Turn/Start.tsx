import { SpaceInfo } from "../../data/BoardData";

interface Props {
  turnData: SpaceInfo;
  close: React.Dispatch<React.SetStateAction<boolean>>;
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
function Start({ turnData, close }: Props) {
  return (
    <>
      <div className={"start"}>
        <div>
          <button onClick={() => close(false)}>닫기</button>
        </div>
        <div>시작점</div>
      </div>
    </>
  );
}
export default Start;
