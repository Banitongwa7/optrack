import { ImageResponse } from "next/og";

export const runtime = "edge";
export const alt = "OpTrack – Opportunity Tracker";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OgImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "1200px",
          height: "630px",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          background: "#081A51",
          fontFamily: "sans-serif",
          padding: "60px",
        }}
      >
        {/* Logo row */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "20px",
            marginBottom: "40px",
          }}
        >
          {/* Map-pin badge */}
          <div
            style={{
              background: "#FCD34D",
              borderRadius: "12px",
              width: "72px",
              height: "72px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: "40px",
            }}
          >
            🗺️
          </div>
          <span
            style={{
              fontSize: "72px",
              fontWeight: "700",
              color: "#FFFFFF",
              letterSpacing: "-2px",
            }}
          >
            OpTrack
          </span>
        </div>

        {/* Tagline */}
        <p
          style={{
            fontSize: "30px",
            color: "#CBD5E1",
            textAlign: "center",
            maxWidth: "800px",
            lineHeight: "1.4",
            margin: "0 0 48px 0",
          }}
        >
          Centralize &amp; explore internship, job, apprenticeship and freelance
          opportunities across the world.
        </p>

        {/* Feature pills */}
        <div
          style={{
            display: "flex",
            gap: "16px",
          }}
        >
          {["Dashboard", "World Map", "Analytics", "Explore Data"].map(
            (label) => (
              <div
                key={label}
                style={{
                  background: "rgba(255,255,255,0.12)",
                  border: "1px solid rgba(255,255,255,0.25)",
                  borderRadius: "999px",
                  padding: "10px 24px",
                  fontSize: "22px",
                  color: "#E2E8F0",
                }}
              >
                {label}
              </div>
            )
          )}
        </div>
      </div>
    ),
    { ...size }
  );
}
