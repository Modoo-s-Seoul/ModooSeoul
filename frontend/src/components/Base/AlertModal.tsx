import { useRecoilState } from "recoil";
import { alertModalState } from "../../data/CommonData";
import "./AlertModal.css";

/** 토글로 커지는 옵션창 인터페이스 */
interface AlertModalProps {
  text: string; // onClose 함수의 타입을 명시적으로 정의합니다.
}
/** 토글로 커지는 옵션창 */
export function AlertModal({ text }: AlertModalProps) {
  // 모달 토글
  const [alertModal, setAlertModal] = useRecoilState(alertModalState);

  return (
    <>
      {alertModal && (
        <div className="alertModalOverlay">
          <div className="alertModal">
            <div className="alertModalClose">
              <div
                onClick={() => {
                  setAlertModal(false);
                }}
                style={{ cursor: "pointer" }}
              >
                ✖
              </div>
            </div>
            <div className="alertModalBody">
              <div>{text}</div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
