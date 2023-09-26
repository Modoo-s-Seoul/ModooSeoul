import "./TimeBar.css";

export default function TimeBar({ duration }: { duration: number }) {
  return (
    <>
      <div
        className="timeBar"
        style={{
          animation: `timer-animation ${duration}s linear`,
        }}
      ></div>
    </>
  );
}
