import { CursorProps, useCursorify } from "@cursorify/react";
import React from "react";

export const EmojiCursor: React.FC<CursorProps> = ({ disabled }) => {
  const { mouseState, style } = useCursorify();
  const p1 = (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="64"
      height="64"
      fill="none"
      viewBox="0 0 32 32"
    >
      <g filter="url(#filter0_d_182_6967)">
        <mask
          id="path-1-outside-1_182_6967"
          width="14"
          height="22"
          x="1.2"
          y="2"
          fill="#216524"
          maskUnits="userSpaceOnUse"
        >
          <path fill="#fff" d="M1.2 2H15.2V24H1.2z"></path>
          <path d="M14.2 14.878L3 3v16.244l4-.508L10.4 23l.898-.409L11 17.213l3.2-2.335z"></path>
        </mask>
        <path
          fill="#216524"
          d="M14.2 14.878L3 3v16.244l4-.508L10.4 23l.898-.409L11 17.213l3.2-2.335z"
        ></path>
        <path
          stroke="#fff"
          strokeLinejoin="round"
          strokeWidth="2"
          d="M14.2 14.878L3 3v16.244l4-.508L10.4 23l.898-.409L11 17.213l3.2-2.335z"
          mask="url(#path-1-outside-1_182_6967)"
        ></path>
      </g>
      <defs>
        <filter
          id="filter0_d_182_6967"
          width="36"
          height="36"
          x="-2"
          y="-2"
          colorInterpolationFilters="sRGB"
          filterUnits="userSpaceOnUse"
        >
          <feFlood floodOpacity="0" result="BackgroundImageFix"></feFlood>
          <feColorMatrix
            in="SourceAlpha"
            result="hardAlpha"
            values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
          ></feColorMatrix>
          <feOffset></feOffset>
          <feGaussianBlur stdDeviation="1"></feGaussianBlur>
          <feColorMatrix values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.2 0"></feColorMatrix>
          <feBlend
            in2="BackgroundImageFix"
            result="effect1_dropShadow_182_6967"
          ></feBlend>
          <feBlend
            in="SourceGraphic"
            in2="effect1_dropShadow_182_6967"
            result="shape"
          ></feBlend>
        </filter>
      </defs>
    </svg>
  );
  const pp1 = (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="64"
      height="64"
      fill="none"
      viewBox="0 0 32 32"
      style={{ position: "absolute", top: "-10", left: "-15" }} // 원하는 간격으로 조절
    >
      <g filter="url(#filter0_d_182_7013)">
        <mask
          id="path-1-outside-1_182_7013"
          width="20"
          height="21"
          x="5"
          y="6"
          fill="#216524"
          maskUnits="userSpaceOnUse"
        >
          <path fill="#fff" d="M5 6H25V27H5z"></path>
          <path
            fillRule="evenodd"
            d="M12 9c0-.5 0-2 1.5-2S15 8.5 15 9v5.461c0-.534.037-1.961 1.5-1.961 1.5 0 1.5 1.5 1.5 2V16v-1c0-.5 0-2 1.5-2s1.5 1.5 1.5 2v.95c.002-.544.048-1.95 1.5-1.95 1.5 0 1.5 1.5 1.5 2l-.5 6c-.5 4-4.5 4-4.5 4h-4v-7 7c-1 0-4.5 0-5.5-4S6 17.5 6 17.5 6 16 8 16c1.988 0 3.976 2.964 4 3V9z"
            clipRule="evenodd"
          ></path>
        </mask>
        <path
          fill="#216524"
          fillRule="evenodd"
          d="M12 9c0-.5 0-2 1.5-2S15 8.5 15 9v5.461c0-.534.037-1.961 1.5-1.961 1.5 0 1.5 1.5 1.5 2V16v-1c0-.5 0-2 1.5-2s1.5 1.5 1.5 2v.95c.002-.544.048-1.95 1.5-1.95 1.5 0 1.5 1.5 1.5 2l-.5 6c-.5 4-4.5 4-4.5 4h-4v-7 7c-1 0-4.5 0-5.5-4S6 17.5 6 17.5 6 16 8 16c1.988 0 3.976 2.964 4 3V9z"
          clipRule="evenodd"
        ></path>
        <path
          fill="#fff"
          d="M12 9h-1 1zm3 5.461h-1a1 1 0 002 .002l-1-.002zM18 16h-1a1 1 0 001 1v-1zm0 0v1a1 1 0 001-1h-1zm3-1h1-1zm0 .95h-1a1 1 0 002 .002l-1-.003zm3 .05v1a1 1 0 001-1h-1zm0 0v-1a1 1 0 00-.997.917L24 16zm-.5 6l.992.124a.933.933 0 00.005-.041L23.5 22zM15 26h-1a1 1 0 001 1v-1zm0-7h1a1 1 0 00-1-1v1zm0 0v-1a1 1 0 00-1 1h1zm0 7v1a1 1 0 001-1h-1zm-9-8.5H5a1 1 0 00.804.98L6 17.5zm6 1.5l-.832.555A1 1 0 0013 19h-1zm0-3v-1a1 1 0 00-1 1h1zm0 0v1a1 1 0 001-1h-1zm1.5-10c-.55 0-1.039.14-1.443.424-.397.28-.64.65-.789.995C10.99 8.069 11 8.767 11 9h2c0-.267.01-.57.107-.794.04-.092.077-.129.101-.146.018-.013.091-.06.292-.06V6zM16 9c0-.233.01-.93-.268-1.581a2.309 2.309 0 00-.79-.995C14.54 6.14 14.05 6 13.5 6v2c.2 0 .274.047.292.06.024.017.062.054.101.146.096.224.107.527.107.794h2zm0 5.461V9h-2v5.461h2zm.5-2.961c-.535 0-1.014.133-1.413.404a2.29 2.29 0 00-.796.963c-.29.64-.29 1.328-.291 1.592l2 .004c0-.27.018-.563.113-.77a.304.304 0 01.098-.135c.019-.013.093-.058.289-.058v-2zm2.5 3c0-.233.01-.93-.268-1.581a2.31 2.31 0 00-.79-.995c-.403-.284-.893-.424-1.442-.424v2c.2 0 .273.047.292.06.024.017.062.054.101.146.096.224.107.527.107.794h2zm0 1.5v-1.5h-2V16h2zm-1-1v2-2zm-1 0v1h2v-1h-2zm2.5-3c-.55 0-1.039.14-1.443.424a2.31 2.31 0 00-.789.995C16.99 14.069 17 14.767 17 15h2c0-.267.01-.57.107-.794.04-.092.077-.129.101-.146.019-.013.091-.06.292-.06v-2zm2.5 3c0-.233.01-.93-.268-1.581a2.31 2.31 0 00-.79-.995C20.54 12.14 20.05 12 19.5 12v2c.2 0 .274.047.292.06.024.017.062.054.101.146.096.224.107.527.107.794h2zm0 .95V15h-2v.95h2zm0 .002c0-.27.02-.56.114-.763a.298.298 0 01.097-.131c.02-.013.094-.058.289-.058v-2c-.53 0-1.007.131-1.405.398a2.285 2.285 0 00-.797.954c-.293.636-.297 1.322-.298 1.594l2 .006zm.5-.952c.2 0 .274.047.292.06.024.017.062.054.101.146.096.224.107.527.107.794h2c0-.233.01-.93-.268-1.581a2.31 2.31 0 00-.79-.995C23.54 13.14 23.05 13 22.5 13v2zm1.5 0v2-2zm.497 7.083l.5-6-1.994-.166-.5 6 1.994.166zM19 26l.001 1H19.028a2.619 2.619 0 00.216-.01 6.452 6.452 0 002.245-.585c1.312-.618 2.703-1.88 3.003-4.281l-1.984-.248c-.2 1.599-1.059 2.337-1.871 2.72a4.462 4.462 0 01-1.642.404h.004L19 26zm-4 1h4v-2h-4v2zm-1-8v7h2v-7h-2zm1 1v-2 2zm1 6v-7h-2v7h2zm-7.47-3.758c.579 2.316 1.924 3.554 3.314 4.172C13.178 27.007 14.49 27 15 27v-2c-.491 0-1.428-.007-2.344-.414-.86-.382-1.765-1.144-2.186-2.828l-1.94.485zM6 17.5l-.197.98H5.8 5.8l-.005-.001-.006-.002h-.002l.031.009c.036.01.101.033.188.07.174.077.435.217.73.462.577.482 1.343 1.418 1.795 3.224l1.94-.485c-.548-2.193-1.532-3.507-2.455-4.275a5.077 5.077 0 00-1.208-.758 3.78 3.78 0 00-.536-.188 1.983 1.983 0 00-.045-.01l-.017-.004-.007-.001-.003-.001h-.001c-.001 0-.002 0-.198.98zM8 15c-1.291 0-2.124.508-2.582 1.195A2.533 2.533 0 005 17.475v.024l1 .001 1 .001v.004a.573.573 0 010 .023v.002a.534.534 0 01.083-.226c.04-.062.208-.304.917-.304v-2zm4.831 3.444a12.06 12.06 0 00-1.389-1.666 7.81 7.81 0 00-1.47-1.173C9.419 15.274 8.743 15 8 15v2c.252 0 .57.097.948.322.372.223.743.535 1.083.873.68.678 1.14 1.365 1.137 1.36l1.663-1.111zM11 16v3h2v-3h-2zm1-1v2-2zm-1-6v7h2V9h-2z"
          mask="url(#path-1-outside-1_182_7013)"
        ></path>
      </g>
      <defs>
        <filter
          id="filter0_d_182_7013"
          width="36"
          height="36"
          x="-2"
          y="-2"
          colorInterpolationFilters="sRGB"
          filterUnits="userSpaceOnUse"
        >
          <feFlood floodOpacity="0" result="BackgroundImageFix"></feFlood>
          <feColorMatrix
            in="SourceAlpha"
            result="hardAlpha"
            values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
          ></feColorMatrix>
          <feOffset></feOffset>
          <feGaussianBlur stdDeviation="1"></feGaussianBlur>
          <feColorMatrix values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.2 0"></feColorMatrix>
          <feBlend
            in2="BackgroundImageFix"
            result="effect1_dropShadow_182_7013"
          ></feBlend>
          <feBlend
            in="SourceGraphic"
            in2="effect1_dropShadow_182_7013"
            result="shape"
          ></feBlend>
        </filter>
      </defs>
    </svg>
  );

  return (
    <div
      data-hover={style}
      style={{
        width: 10,
        height: 10,
        fontSize: 60,
      }}
    >
      {(() => {
        if (disabled) return p1;
        if (style === "pointer") return pp1;
        if (mouseState === "mouseDown") return p1;
        return p1;
      })()}
    </div>
  );
};
