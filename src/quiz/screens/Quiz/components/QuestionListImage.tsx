import { ImageType, useImageDisplay } from "@/src/quiz/hooks";
import { Image } from "expo-image";
import { useMemo } from "react";
import type { QuestionTileImageProps } from "../types";

export const QuestionTileImage = ({
  size,
  item
}: QuestionTileImageProps) => {

  const { getImageUrl } = useImageDisplay(item.images, item.status);
  const imageStyle = useMemo(
    () => ({
      width: size,
      height: size,
      borderRadius: 6,
    }),
    [size],
  );



  return (
    <Image
      source={getImageUrl(ImageType.IMG)}
      style={imageStyle}
      contentFit="cover"
      cachePolicy="memory-disk"
      transition={200}
      placeholder={{ blurhash: "LGF5]+Yk^37c.8x]M{s-00?b%NWB" }}
    />
  );
};