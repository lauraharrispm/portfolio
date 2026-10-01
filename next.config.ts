import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    dangerouslyAllowSVG: true,
    contentDispositionType: "attachment",
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
    // Next 16 requires an explicit allowlist (default is [75] only); 90 is
    // needed for the hero headshot, which otherwise gets silently clamped
    // down to 75 and reads as soft/pixelated under zoom.
    qualities: [75, 90],
  },
};

export default nextConfig;
