import { ImageResponse } from "next/og";

export const size = {
  width: 32,
  height: 32,
};

export const contentType = "image/png";

export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          alignItems: "center",
          background: "#f5a623",
          borderRadius: "50%",
          display: "flex",
          fontSize: 20,
          height: "100%",
          justifyContent: "center",
          width: "100%",
        }}
      >
        <div style={{ color: "#ffffff", fontSize: 20, lineHeight: 1 }}>★</div>
      </div>
    ),
    size
  );
}
