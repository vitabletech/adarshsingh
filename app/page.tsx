"use client";

import { FormEvent, PointerEvent, useEffect, useRef, useState } from "react";
import ModelViewer from "./components/ModelViewer";

const phone = "919424392871";

const looks = [
  { label: "01 / Orange study", image: "/images/1.webp", group: "Main" },
  { label: "02 / Street cast", image: "/images/10.webp", group: "Casual" },
  { label: "03 / Quiet form", image: "/images/3.webp", group: "Professional" },
  { label: "04 / In the hills", image: "/images/14.webp", group: "Casual" },
  { label: "05 / Studio light", image: "/images/5.webp", group: "Main" },
  { label: "06 / Monochrome", image: "/images/13.webp", group: "Like & Like" },
  { label: "07 / Field notes", image: "/images/11.webp", group: "Like & Like" },
  { label: "08 / Clean lines", image: "/images/4.webp", group: "Professional" },
];

const measurements = [
  ["Height", "On request"],
  ["Chest", "On request"],
  ["Waist", "On request"],
  ["Hips", "On request"],
  ["Shoe", "On request"],
  ["Eyes / Hair", "On request"],
];

function Photo({ src, alt, className = "", loading = "lazy" }: { src: string; alt: string; className?: string; loading?: "lazy" | "eager" }) {
  return <img className={className} src={src} alt={alt} loading={loading} decoding="async" />;
}

export default function Home() {
  const [active, setActive] = useState("All looks");
  const [tilt, setTilt] = useState({ x: 0, y: 0 });
  const heroRef = useRef<HTMLDivElement>(null);
  const categories = ["All looks", "Main", "Professional", "Casual", "Like & Like"];
  const filtered = active === "All looks" ? looks : looks.filter((look) => look.group === active);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => entries.forEach((entry) => entry.isIntersecting && entry.target.classList.add("is-visible")),
      { threshold: 0.12 },
    );
    document.querySelectorAll(".reveal").forEach((element) => observer.observe(element));
    return () => observer.disconnect();
  }, [active]);

  function handleTilt(event: PointerEvent<HTMLDivElement>) {
    if (event.pointerType === "touch") return;
    const bounds = event.currentTarget.getBoundingClientRect();
    const x = (event.clientX - bounds.left) / bounds.width - 0.5;
    const y = (event.clientY - bounds.top) / bounds.height - 0.5;
    setTilt({ x: -y * 7, y: x * 9 });
  }

  function resetTilt() {
    setTilt({ x: 0, y: 0 });
  }

  function sendEnquiry(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const message = [
      "Hello, I would like to enquire about Adarsh Singh Kushwah.",
      `Name: ${data.get("name")}`,
      `Company / brand: ${data.get("brand") || "Not provided"}`,
      `Email: ${data.get("email")}`,
      `Project: ${data.get("project")}`,
      `Dates / location: ${data.get("dates") || "Not provided"}`,
    ].join("\n");
    window.location.href = `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;
  }

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Person",
    name: "Adarsh Singh Kushwah",
    jobTitle: "Fashion Model",
    image: "https://vitabletech.github.io/adarshsingh/images/1.webp",
    url: "https://vitabletech.github.io/adarshsingh/",
    telephone: "+91 94243 92871",
    email: "info.itsyogiraj@gmail.com",
    address: { "@type": "PostalAddress", addressCountry: "IN" },
    knowsAbout: ["Fashion modeling", "Commercial modeling", "Editorial photography"],
  };

  return (
    <main>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <div className="topline">
        <a href="#top" className="wordmark" aria-label="Adarsh Singh Kushwah, home">ASK<span>·</span></a>
        <span className="topline-note">Model portfolio <i>—</i> India</span>
        <a className="topline-contact" href="#enquire">Enquiries <span aria-hidden="true">↗</span></a>
      </div>

      <section className="hero" id="top" aria-labelledby="hero-title">
        <div className="hero-copy">
          <p className="eyebrow"><span className="live-dot" /> Fashion · Commercial · Editorial</p>
          <h1 id="hero-title">Adarsh<br /><em>Singh</em> Kushwah</h1>
          <div className="hero-foot">
            <p>Fashion, commercial<br />&amp; editorial model</p>
            <a href="#portfolio" className="round-link" aria-label="Explore the portfolio">↓</a>
            <span className="hero-index">IND / 01—26</span>
          </div>
        </div>
        <div className="hero-image-wrap" ref={heroRef} onPointerMove={handleTilt} onPointerLeave={resetTilt}>
          <div className="hero-image" style={{ transform: `perspective(1200px) rotateX(${tilt.x}deg) rotateY(${tilt.y}deg)` }}>
            <Photo src="/images/1.webp" alt="Adarsh Singh Kushwah in a sunlit fashion portrait" className="hero-photo" loading="eager" />
            <div className="photo-stamp"><span>BOOK</span><span>01</span></div>
          </div>
          <span className="image-caption">Portfolio study no. 01 <span>MAIN BOOK</span></span>
          <span className="vertical-note">Adarsh Singh Kushwah&nbsp; / &nbsp;Fashion Model</span>
        </div>
        <div className="hero-side-note">Built for<br />the camera<span>✳</span></div>
      </section>

      <div className="ticker" aria-label="Modeling disciplines">
        <div className="ticker-track"><span>Fashion</span><b>✳</b><span>Editorial</span><b>✳</b><span>Commercial</span><b>✳</b><span>Campaign</span><b>✳</b><span>Fashion</span><b>✳</b><span>Editorial</span><b>✳</b><span>Commercial</span><b>✳</b><span>Campaign</span><b>✳</b></div>
      </div>

      <section className="portfolio section-shell" id="portfolio">
        <div className="section-heading reveal">
          <div><p className="eyebrow">The book / Selected works</p><h2>One face.<br /><em>Many frames.</em></h2></div>
          <p className="section-intro">A selection of portraits, on-location frames and clean casting images. For the full book or a specific look, start a conversation below.</p>
        </div>
        <div className="filter-row" role="group" aria-label="Filter portfolio images">
          {categories.map((category) => <button key={category} aria-pressed={active === category} className={active === category ? "filter active" : "filter"} onClick={() => setActive(category)}>{category}</button>)}
          <span className="filter-count">{String(filtered.length).padStart(2, "0")} frames</span>
        </div>
        <div className="look-grid">
          {filtered.map((look, index) => <figure className={`look-card look-${index + 1} reveal`} key={look.label}>
            <div className="look-image"><Photo src={look.image} alt={`${look.group} portfolio portrait of Adarsh Singh Kushwah`} /><span className="look-open" aria-hidden="true">↗</span></div>
            <figcaption><span>{look.label}</span><span>{look.group}</span></figcaption>
          </figure>)}
        </div>
      </section>

      <ModelViewer modelUrl="/models/adarsh-photo-avatar.glb" />

      <section className="profile" id="profile">
        <div className="profile-image reveal"><Photo src="/images/3.webp" alt="Full-length casting portrait of Adarsh" /><span>PROFILE / 02</span></div>
        <div className="profile-copy reveal">
          <p className="eyebrow">The model / India</p>
          <h2>Presence<br />with <em>range.</em></h2>
          <p className="profile-description">Adarsh Singh Kushwah is an Indian male model working across fashion, commercial and editorial imagery. His book moves between considered studio portraits and natural, on-location frames.</p>
          <div className="measurement-head"><h3>Measurements</h3><span>For casting reference</span></div>
          <dl className="measurements">{measurements.map(([label, value]) => <div key={label}><dt>{label}</dt><dd>{value}</dd></div>)}</dl>
          <p className="measurement-note">Please confirm current measurements before a casting.</p>
          <a className="text-link" href="#enquire">Ask about casting details <span>↗</span></a>
        </div>
      </section>

      <section className="booking section-shell" id="enquire">
        <div className="booking-heading reveal"><p className="eyebrow">For brands, casting &amp; creative teams</p><h2>Have a frame<br />in <em>mind?</em></h2><p>Share a few details about your project. The enquiry opens directly in WhatsApp, ready to send.</p><a className="booking-phone" href="tel:+919424392871">+91 94243 92871 <span>↗</span></a></div>
        <form className="enquiry-form reveal" onSubmit={sendEnquiry}>
          <div className="form-title"><span>Booking enquiry</span><span>01 — 06</span></div>
          <label>Your name<input name="name" autoComplete="name" required placeholder="Name" /></label>
          <label>Brand / company<input name="brand" autoComplete="organization" placeholder="Optional" /></label>
          <label>Email address<input name="email" type="email" autoComplete="email" required placeholder="you@company.com" /></label>
          <label>Project type<select name="project" defaultValue=""><option value="" disabled>Select a project</option><option>Fashion campaign</option><option>Editorial / magazine</option><option>E-commerce / commercial</option><option>Lookbook</option><option>Other</option></select></label>
          <label>Dates &amp; location<input name="dates" placeholder="Optional" /></label>
          <button type="submit" className="submit-button">Continue in WhatsApp <span>↗</span></button>
          <p className="form-note">Your details are added to a WhatsApp message. Nothing is stored on this site.</p>
        </form>
      </section>

      <footer className="footer">
        <a className="footer-name" href="#top">Adarsh<br /><em>Singh Kushwah</em></a>
        <div className="footer-info"><span>Fashion · Editorial · Commercial</span><a href="mailto:info.itsyogiraj@gmail.com">info.itsyogiraj@gmail.com</a><a href="tel:+919424392871">+91 94243 92871</a></div>
        <div className="footer-bottom"><span>© 2026 Adarsh Singh Kushwah</span><a href="#top">Back to top ↑</a><span>India</span></div>
      </footer>
    </main>
  );
}
