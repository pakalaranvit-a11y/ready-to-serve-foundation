import React from "react";
import { Image } from "@/components/ui/image";

// Featured contribution: Megastar Chiranjeevi & Mega Power Star Ram Charan
// visited the Ready To Serve Old Age Home on Ram Charan's birthday, spent time
// with the elders, served them a feast, and donated ₹2,00,000 for their welfare.
const FLYER = "https://media.base44.com/images/public/6a4bf7eda7bc99837f34a772/ef420f5be_IMG_5995.JPG";

const GALLERY = [
  { src: "https://media.base44.com/images/public/6a4bf7eda7bc99837f34a772/d9e52472d_IMG_5997.JPG", alt: "TV5 News coverage of Chiranjeevi's financial assistance to Ready To Serve Old Age Home" },
  { src: "https://media.base44.com/images/public/6a4bf7eda7bc99837f34a772/20f5562d4_IMG_5998.JPG", alt: "Chiranjeevi cutting a birthday cake with the elders of Ready To Serve Old Age Home" },
  { src: "https://media.base44.com/images/public/6a4bf7eda7bc99837f34a772/7d07498ef_IMG_5994.JPG", alt: "Chiranjeevi handing over a donation cheque to Ready To Serve Foundation" },
  { src: "https://media.base44.com/images/public/6a4bf7eda7bc99837f34a772/eb2e996dd_IMG_5992.JPG", alt: "Group photo with Chiranjeevi at the Ready To Serve Old Age Home" },
  { src: "https://media.base44.com/images/public/6a4bf7eda7bc99837f34a772/7b6cf9475_IMG_5991.JPG", alt: "Chiranjeevi with residents and volunteers of Ready To Serve Old Age Home" },
  { src: "https://media.base44.com/images/public/6a4bf7eda7bc99837f34a772/7f8dee80a_IMG_5990.JPG", alt: "Celebration at the Ready To Serve Old Age Home with elders" },
  { src: "https://media.base44.com/images/public/6a4bf7eda7bc99837f34a772/5db42ad94_IMG_5989.JPG", alt: "Supporters honoured with shawls at the Ready To Serve Foundation event" },
  { src: "https://media.base44.com/images/public/6a4bf7eda7bc99837f34a772/fcbdd8d17_IMG_5988.JPG", alt: "Supporters of Ready To Serve Foundation" },
  { src: "https://media.base44.com/images/public/6a4bf7eda7bc99837f34a772/6d6ff5b98_IMG_5987.JPG", alt: "Recognition at a Ready To Serve Foundation partner event" },
];

const Name = ({ children }) => (
  <span style={{ color: "var(--gold-500)", fontWeight: 700 }}>{children}</span>
);

export default function NotableSupporters() {
  return (
    <section className="section supporters" id="supporters">
      <div className="wrap">
        <div className="section__head" data-reveal="">
          <span className="kicker">Friends of the foundation</span>
          <h2>When the <em>Megastars</em> stood by our elders</h2>
          <p className="section__sub">
            On <strong>Ram Charan's birthday</strong>, <Name>Megastar Chiranjeevi</Name> and his son{" "}
            <Name>Mega Power Star Ram Charan</Name> visited our old age home in Vanasthalipuram —
            spent time with the elders, gifted them new clothes, personally served them a feast,
            and contributed <strong>₹2,00,000</strong> towards their welfare. Their kindness brought
            tears of joy to our residents' eyes.
          </p>
        </div>

        <div className="supporters__feature" data-reveal="">
          <figure className="supporters__flyer">
            <Image
              src={FLYER}
              alt="Ready To Serve Foundation flyer — Chiranjeevi and Ram Charan's donation event"
              fittingType="fit"
              className="supporters__flyer-img"
            />
            <figcaption>
              <span className="supporters__badge">₹2,00,000 contributed</span>
              <strong>
                <Name>Chiranjeevi</Name> &amp; <Name>Ram Charan</Name>
              </strong>
              <span className="supporters__caption-sub">Ram Charan's birthday · Ready To Serve Old Age Home, Vanasthalipuram</span>
            </figcaption>
          </figure>
        </div>

        <div className="stories__grid supporters__grid">
          {GALLERY.map((g, i) => (
            <figure className="story supporters__shot" key={i} data-reveal="">
              <Image
                src={g.src}
                alt={g.alt}
                fittingType="fill"
                className="supporters__shot-img"
              />
              <figcaption>{g.alt.replace(/at the .*?(Home|Foundation|event)[\s\S]*$/, "").replace("Ready To Serve ", "")}</figcaption>
            </figure>
          ))}
        </div>

        <p className="supporters__note" data-reveal="">
          We are deeply grateful to <Name>Chiranjeevi</Name> garu and <Name>Ram Charan</Name> garu for
          showing the world that caring for our elders is a responsibility we all share. 🙏
        </p>
      </div>
    </section>
  );
}