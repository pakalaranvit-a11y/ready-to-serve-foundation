import React, { useEffect, useState } from "react";
import moment from "moment";
import { base44 } from "@/api/base44Client";
import { CONFIG, fmt } from "@/lib/charityConfig";

export default function Donors() {
  const [donations, setDonations] = useState(null);
  const [error, setError] = useState(false);

  useEffect(() => {
    let active = true;
    base44.entities.Donation.list("-created_date", 100)
      .then((items) => { if (active) setDonations(items); })
      .catch(() => { if (active) setError(true); });
    return () => { active = false; };
  }, []);

  const loading = donations === null && !error;
  const list = donations || [];
  const total = list.reduce((s, d) => s + (Number(d.amount) || 0), 0);
  const monthlyCount = list.filter((d) => d.frequency === "monthly").length;

  return (
    <section className="section donors" id="donors">
      <div className="wrap">
        <div className="section__head" data-reveal="">
          <span className="kicker">Wall of giving</span>
          <h2>The hearts behind the home</h2>
          <p className="section__sub">
            Every name here is a meal, a medicine, a moment of dignity for our elders. Thank you for standing with us since {CONFIG.sinceYear}.
          </p>
        </div>

        <div className="donors__stats" data-reveal="">
          <div className="donors__stat"><strong>₹{fmt(total)}</strong><span>raised so far</span></div>
          <div className="donors__stat"><strong>{loading ? "—" : list.length}</strong><span>gifts</span></div>
          <div className="donors__stat"><strong>{loading ? "—" : monthlyCount}</strong><span>monthly supporters</span></div>
        </div>

        {loading && <div className="donors__loading">Loading our donors…</div>}
        {error && <div className="donors__empty">We couldn't load the wall right now. Please try again in a moment.</div>}
        {!loading && !error && list.length === 0 && (
          <div className="donors__empty">
            No gifts yet — be the first to bring a smile to our elders.{" "}
            <a href="#donate" className="link-strong">Donate now →</a>
          </div>
        )}

        {!loading && !error && list.length > 0 && (
          <ul className="donors__list" role="list">
            {list.map((d) => {
              const name = d.anonymous || !d.donor_name ? "Anonymous Friend" : d.donor_name;
              const initial = name === "Anonymous Friend" ? "❤" : name.trim().charAt(0).toUpperCase();
              return (
                <li key={d.id} className="donor" data-reveal="">
                  <div className="donor__avatar" aria-hidden="true">{initial}</div>
                  <div className="donor__body">
                    <div className="donor__top">
                      <span className="donor__name">{name}</span>
                      {d.frequency === "monthly" && <span className="badge badge--monthly">Monthly</span>}
                    </div>
                    {d.message && <p className="donor__msg">“{d.message}”</p>}
                    <span className="donor__date">{moment(d.created_date).fromNow()}</span>
                  </div>
                  <div className="donor__amt">
                    ₹{fmt(d.amount)}{d.frequency === "monthly" && <small>/mo</small>}
                  </div>
                </li>
              );
            })}
          </ul>
        )}

        <p className="donors__reel" data-reveal="">
          Want to be on this wall? <a href="#donate" className="link-strong">Give now →</a>
        </p>
      </div>
    </section>
  );
}