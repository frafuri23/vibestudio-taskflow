// Single source of design tokens — import this everywhere, never ad-hoc colors/sizes.

export const colors = {
  background: "#F7F7FB",
  surface: "#FFFFFF",
  elevated: "#FFFFFF",
  text: "#15151E",
  mutedText: "#8A8A99",
  border: "#EBEBF2",
  accent: "#2563EB",
  accentTint: "#E8EFFE",
  success: "#22C55E",
  successTint: "#E8FBEF",
  warn: "#F59E0B",
  warnTint: "#FEF3E0",
  danger: "#EF4444",
  dangerTint: "#FDEAEA",
  white: "#FFFFFF",
};

export const spacing = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
  xxl: 32,
};

export const radius = {
  sm: 10,
  md: 14,
  lg: 20,
  pill: 999,
};

export const type = {
  display: { fontSize: 32, fontWeight: "800" as const, letterSpacing: 0.2 },
  title: { fontSize: 22, fontWeight: "700" as const, letterSpacing: 0.1 },
  heading: { fontSize: 17, fontWeight: "600" as const },
  body: { fontSize: 15.5, fontWeight: "500" as const },
  bodyRegular: { fontSize: 15.5, fontWeight: "400" as const },
  caption: { fontSize: 12.5, fontWeight: "600" as const, letterSpacing: 0.3 },
};

export const shadow = {
  card: {
    shadowColor: "#1A1A2E",
    shadowOpacity: 0.06,
    shadowRadius: 16,
    shadowOffset: { width: 0, height: 6 },
    elevation: 2,
  },
  floating: {
    shadowColor: "#2563EB",
    shadowOpacity: 0.35,
    shadowRadius: 16,
    shadowOffset: { width: 0, height: 8 },
    elevation: 6,
  },
};

export const priorityColor = (p: "low" | "medium" | "high") => {
  if (p === "high") return colors.danger;
  if (p === "medium") return colors.warn;
  return colors.accent;
};

export const priorityTint = (p: "low" | "medium" | "high") => {
  if (p === "high") return colors.dangerTint;
  if (p === "medium") return colors.warnTint;
  return colors.accentTint;
};
