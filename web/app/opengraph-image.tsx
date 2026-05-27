import { ImageResponse } from "next/og";

export const alt = "WarGuard — Last Z Reference";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          background: "#0a0014",
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          fontFamily: "system-ui, sans-serif",
          position: "relative",
          overflow: "hidden",
        }}
      >
        {/* Radial glow */}
        <div
          style={{
            position: "absolute",
            top: "50%",
            left: "50%",
            width: "700px",
            height: "400px",
            marginTop: "-200px",
            marginLeft: "-350px",
            background:
              "radial-gradient(ellipse, rgba(147,51,234,0.18) 0%, transparent 70%)",
          }}
        />

        {/* Top accent line */}
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            height: "3px",
            background:
              "linear-gradient(90deg, transparent, rgba(147,51,234,0.8), transparent)",
          }}
        />

        {/* Main content */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: "0px",
          }}
        >
          {/* Site name */}
          <div
            style={{
              fontSize: "88px",
              fontWeight: 800,
              color: "white",
              letterSpacing: "-3px",
              lineHeight: 1,
            }}
          >
            WarGuard
          </div>

          {/* Divider */}
          <div
            style={{
              width: "120px",
              height: "2px",
              background: "rgba(147,51,234,0.6)",
              marginTop: "20px",
              marginBottom: "20px",
            }}
          />

          {/* Subtitle */}
          <div
            style={{
              fontSize: "26px",
              color: "rgba(216,180,254,0.7)",
              letterSpacing: "5px",
              textTransform: "uppercase",
            }}
          >
            Last Z Reference
          </div>

          {/* Section pills */}
          <div
            style={{
              display: "flex",
              gap: "10px",
              marginTop: "36px",
            }}
          >
            {["Events", "HQ Upgrades", "Research", "Heroes", "PvP", "Gear"].map(
              (label) => (
                <div
                  key={label}
                  style={{
                    background: "rgba(88,28,135,0.45)",
                    border: "1px solid rgba(147,51,234,0.35)",
                    borderRadius: "6px",
                    padding: "7px 18px",
                    fontSize: "16px",
                    color: "rgba(216,180,254,0.75)",
                  }}
                >
                  {label}
                </div>
              )
            )}
          </div>
        </div>

        {/* Bottom accent line */}
        <div
          style={{
            position: "absolute",
            bottom: 0,
            left: 0,
            right: 0,
            height: "3px",
            background:
              "linear-gradient(90deg, transparent, rgba(147,51,234,0.8), transparent)",
          }}
        />
      </div>
    ),
    { ...size }
  );
}
