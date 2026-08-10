import React from "react";
import { Image } from "@/components/ui/image";

const LOGO_URL =
  "https://media.base44.com/images/public/6a4bf7eda7bc99837f34a772/f4adef1ad_PHOTO-2026-08-09-10-16-06.jpg";

export function LogoMark({ size = 26 }) {
  return (
    <Image
      src={LOGO_URL}
      alt="Ready To Serve Foundation"
      fittingType="fit"
      className="w-full h-full"
    />
  );
}

export default function Logo() {
  return (
    <a className="brand" href="#top" aria-label="Ready To Serve Foundation home">
      <span className="brand__mark" aria-hidden="true">
        <LogoMark size={26} />
      </span>
      <span className="brand__text">
        Ready&nbsp;To&nbsp;Serve
        <small>Foundation</small>
      </span>
    </a>
  );
}