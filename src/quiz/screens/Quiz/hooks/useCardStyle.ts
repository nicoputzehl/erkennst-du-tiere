import { useMemo } from "react";
import { useColorScheme } from "@/src/common/hooks/useColorScheme.web";

export const useCardStyle = (size: number, inactive = false) => {
  const colorScheme = useColorScheme();

  return useMemo(
    () => ({
      width: size,
      height: size,
      backgroundColor: inactive
        ? colorScheme === "dark"
          ? "rgba(158,158,158,0.2)"
          : "hsla(0, 4%, 20%, 0.16)"
        : colorScheme === "dark"
          ? "rgba(255,255,255,0.1)"
          : "rgba(0,0,0,0.05)",
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: colorScheme === "dark" ? 0.3 : 0.1,
      shadowRadius: 4,
      elevation: 3,
    }),
    [size, inactive, colorScheme]
  );
};
