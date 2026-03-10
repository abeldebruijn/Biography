import type { ReactNode } from "react";

type PictureProps = {
  src: string;
  alt?: string;
  className?: string;
  imgClassName?: string;
  children?: ReactNode;
  loading?: "lazy" | "eager";
  width?: number | string;
  height?: number | string;
};

export function Picture({
  src,
  alt = "",
  className,
  imgClassName,
  children,
  loading = "lazy",
  width,
  height,
}: PictureProps) {
  return (
    <figure className={className}>
      {/** biome-ignore lint/performance/noImgElement: <explanation>This is a picture element, not an img element.</explanation> */}
      <img
        src={src}
        alt={alt}
        className={imgClassName}
        loading={loading}
        {...(width !== undefined ? { width } : {})}
        {...(height !== undefined ? { height } : {})}
      />
      {children}
    </figure>
  );
}

type PictureCaptionProps = {
  children?: ReactNode;
  className?: string;
};

export function PictureCaption({ children, className }: PictureCaptionProps) {
  return <figcaption className={className}>{children}</figcaption>;
}
