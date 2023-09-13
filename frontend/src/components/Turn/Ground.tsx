import { SpaceInfo } from "../../data/BoardData";

interface Props {
  turnData: SpaceInfo;
  close: React.Dispatch<React.SetStateAction<boolean>>;
}

export default function Ground({ turnData, close }: Props) {
  return (
    <>
      <div className={"ground"}>
        <div>
          <button onClick={() => close(false)}>닫기</button>
        </div>
        <div>위치 : {turnData.name}</div>
        <div>가격 : {turnData.price}</div>
        <div>통행료 : {turnData.cost}</div>
      </div>
    </>
  );
}
