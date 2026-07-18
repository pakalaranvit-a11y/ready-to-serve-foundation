import React from "react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { CONFIG } from "@/lib/charityConfig";

const milestones = [
  { year: "2011", title: "It began with five", text: `A handful of volunteers rented a single room and took in ${CONFIG.membersStart} abandoned elders. There was no money — only the conviction that no one should grow old alone.` },
  { year: "2015", title: "Our first real home", text: "With your support we moved into a permanent shelter in Vanasthalipuram, Hyderabad, and grew to care for 20 elders with three meals a day." },
  { year: "2020", title: "Holding the line", text: "Through the pandemic, when everything shut, our kitchen never did. We delivered meals and medicines to elders with no one else to turn to." },
  { year: "2026", title: "A family of 100", text: `Today ${CONFIG.membersNow} full-time elders call the Ready To Serve Foundation home. Every one of them is fed, medicated and remembered — because of donors like you.` },
];

export default function Journey() {
  return (
    <section className="section" id="journey" style={{ background: "linear-gradient(180deg,var(--cream),var(--cream-2))" }}>
      <div className="wrap">
        <div className="section__head" data-reveal="">
          <span className="kicker">Our story</span>
          <h2>Fifteen years of serving India's elders</h2>
          <p className="section__sub">
            From a handful of volunteers in {CONFIG.foundedYear} to a full-time family today — this is the journey your kindness keeps alive.
          </p>
        </div>

        <Tabs defaultValue="journey" data-reveal="">
          <TabsList style={{ width: "100%", marginBottom: "1.4rem" }}>
            <TabsTrigger value="journey" style={{ flex: 1 }}>Our Journey</TabsTrigger>
            <TabsTrigger value="elders" style={{ flex: 1 }}>Our Elders</TabsTrigger>
          </TabsList>

          <TabsContent value="journey">
            <ol className="timeline">
              {milestones.map((m) => (
                <li key={m.year}>
                  <span className="timeline__year">{m.year}</span>
                  <div>
                    <h3>{m.title}</h3>
                    <p>{m.text}</p>
                  </div>
                </li>
              ))}
            </ol>
          </TabsContent>

          <TabsContent value="elders">
            <div className="elders-tab">
              <p>
                Our residents are elders who once had families, jobs and homes of their own — and who now, through loss, illness or abandonment, had nowhere left to turn. Most are over 65. Some are over 80.
              </p>
              <ul className="ticks">
                <li>Three nutritious meals, every single day</li>
                <li>Regular health check-ups and daily medicines</li>
                <li>Clean clothes, a warm bed and a safe roof</li>
                <li>Birthday celebrations so no elder feels forgotten</li>
                <li>Companionship — prayer, conversation and dignity</li>
              </ul>
              <p>
                Many arrive frightened and alone. Within weeks you see the change: a smile at breakfast, a hand reaching for another's during evening prayer. <strong>This is what your donation buys — not just food, but family.</strong>
              </p>
              <a href="#donate" className="btn btn--primary" style={{ marginTop: ".6rem" }}>Sponsor an elder</a>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </section>
  );
}