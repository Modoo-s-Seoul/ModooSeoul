import { SpaceInfo } from "../../data/BoardData";

interface Props {
  turnData: SpaceInfo;
  close: React.Dispatch<React.SetStateAction<boolean>>;
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export default function Prison({ turnData, close }: Props) {
  return (
    <>
      <div className={"prison"}>
        <div>
          <button onClick={() => close(false)}>닫기</button>
        </div>
        <div>감옥</div>
      </div>
    </>
  );
}
