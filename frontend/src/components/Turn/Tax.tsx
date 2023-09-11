import { SpaceInfo } from "../../data/BoardData";

interface Props {
  turnData: SpaceInfo;
  close: React.Dispatch<React.SetStateAction<boolean>>;
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
function Tax({ turnData, close }: Props) {
  return (
    <>
      <div className={"tax"}>
        <div>
          <button onClick={() => close(false)}>닫기</button>
        </div>
        <div>국세청</div>
      </div>
    </>
  );
}
export default Tax;
