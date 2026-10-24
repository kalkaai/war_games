import { ImageResponse } from "next/og";
import { NextRequest } from "next/server";

export const runtime = "edge";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const type = searchParams.get("type") ?? "schedule";
  const title =
    searchParams.get("title") ?? "GAMIDES Tactical Summary";
  const subtitle =
    searchParams.get("subtitle") ?? "Last Z: Survival Shooter • Alliance Companion";
  const stat1Label = searchParams.get("s1l") ?? "Wood / Food";
  const stat1Val = searchParams.get("s1v") ?? "—";
  const stat2Label = searchParams.get("s2l") ?? "Zent / Steel";
  const stat2Val = searchParams.get("s2v") ?? "—";
  const stat3Label = searchParams.get("s3l") ?? "Build Time / Speed-ups";
  const stat3Val = searchParams.get("s3v") ?? "—";
  const footerNote =
    searchParams.get("note") ??
    "Interactive Calculators • Event Timers • Seasonal Guides";

  const accentColor =
    type === "alert"
      ? "#f59e0b"
      : type === "wos"
      ? "#0ea5e9"
      : type === "lastwar"
      ? "#e11d48"
      : "#9333ea";

  return new ImageResponse(
    (
      <div
        style={{
          background: "#0a0014",
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: "48px 56px",
          fontFamily: "system-ui, sans-serif",
          color: "white",
          position: "relative",
        }}
      >
        {/* Top Accent Bar */}
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            height: "8px",
            background: accentColor,
          }}
        />

        {/* Header Row */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <div style={{ display: "flex", flexDirection: "column" }}>
            <div
              style={{
                fontSize: "20px",
                fontWeight: 700,
                color: "#d8b4fe",
                letterSpacing: "3px",
                textTransform: "uppercase",
              }}
            >
              {subtitle}
            </div>
            <div
              style={{
                fontSize: "48px",
                fontWeight: 800,
                color: "white",
                marginTop: "8px",
                lineHeight: 1.1,
              }}
            >
              {title}
            </div>
          </div>

          <div
            style={{
              background: "rgba(147, 51, 234, 0.25)",
              border: `2px solid ${accentColor}`,
              borderRadius: "14px",
              padding: "12px 24px",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
            }}
          >
            <div
              style={{
                fontSize: "28px",
                fontWeight: 900,
                color: "white",
                letterSpacing: "-1px",
              }}
            >
              GAMIDES.COM
            </div>
            <div
              style={{
                fontSize: "13px",
                color: "#e9d5ff",
                letterSpacing: "1px",
              }}
            >
              VERIFIED STRATEGY DATA
            </div>
          </div>
        </div>

        {/* Stat Cards Row */}
        <div
          style={{
            display: "flex",
            gap: "24px",
            marginTop: "24px",
            marginBottom: "24px",
          }}
        >
          {[
            { label: stat1Label, value: stat1Val },
            { label: stat2Label, value: stat2Val },
            { label: stat3Label, value: stat3Val },
          ].map((stat, idx) => (
            <div
              key={idx}
              style={{
                flex: 1,
                background: "rgba(88, 28, 135, 0.35)",
                border: "1px solid rgba(168, 85, 247, 0.4)",
                borderRadius: "16px",
                padding: "28px 24px",
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
              }}
            >
              <div
                style={{
                  fontSize: "18px",
                  color: "#d8b4fe",
                  fontWeight: 600,
                }}
              >
                {stat.label}
              </div>
              <div
                style={{
                  fontSize: "38px",
                  fontWeight: 800,
                  color: "white",
                  marginTop: "10px",
                }}
              >
                {stat.value}
              </div>
            </div>
          ))}
        </div>

        {/* Watermarked Footer */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            borderTop: "1px solid rgba(147, 51, 234, 0.35)",
            paddingTop: "20px",
          }}
        >
          <div style={{ fontSize: "20px", color: "#cbd5e1" }}>{footerNote}</div>
          <div
            style={{
              fontSize: "22px",
              fontWeight: 800,
              color: "#c084fc",
            }}
          >
            🌐 www.gamides.com
          </div>
        </div>
      </div>
    ),
    {
      width: 1200,
      height: 630,
    }
  );
}
