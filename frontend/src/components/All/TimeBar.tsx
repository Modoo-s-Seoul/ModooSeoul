import "./TimeBar.css";

export default function TimeBar({ duration }: { duration: number }) {
  return (
    <>
      <div
        className="testTimeBar"
        style={{
          animation: `timer-animation ${duration}s linear infinite`,
        }}
      ></div>
    </>
  );
}
