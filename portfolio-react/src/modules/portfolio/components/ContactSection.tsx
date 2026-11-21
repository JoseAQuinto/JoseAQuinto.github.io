import {
  ArrowDownTrayIcon,
  ArrowUpRightIcon,
  ClipboardDocumentIcon,
} from "@heroicons/react/24/outline";
import { motion, useReducedMotion, useScroll, useTransform } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import LabBadge from "../lab/LabBadge";
import ScrollLetters from "../lab/ScrollLetters";
import type { CvLink } from "../portfolio.types";
import { CONTACT } from "../contact";

type ContactCopy = {
  title: string;
  text: string;
  copy: string;
  copied: string;
  copyFailed: string;
  channelsLabel: string;
  linkedin: string;
  linkedinDetail: string;
  github: string;
  githubDetail: string;
  cv: string;
  cvDetail: string;
  location: string;
  locationDetail: string;
};

type ContactSectionProps = {
  copy: ContactCopy;
  cv: CvLink;
};

export default function ContactSection({ copy, cv }: ContactSectionProps) {
  const [copyState, setCopyState] = useState<"idle" | "copied" | "failed">(
    "idle"
  );
  const resetTimer = useRef<number | null>(null);
  const sectionRef = useRef<HTMLElement>(null);
  const reduceMotion = useReducedMotion();
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "start 0.3"],
  });
  const tape = useTransform(scrollYProgress, [0.5, 1], [1, 6]);

  useEffect(
    () => () => {
      if (resetTimer.current) window.clearTimeout(resetTimer.current);
    },
    []
  );

  const copyEmail = async () => {
    try {
      await navigator.clipboard.writeText(CONTACT.email);
      setCopyState("copied");
    } catch {
      setCopyState("failed");
    }
    if (resetTimer.current) window.clearTimeout(resetTimer.current);
    resetTimer.current = window.setTimeout(() => setCopyState("idle"), 4000);
  };

  return (
    <section
      ref={sectionRef}
      id="contact"
      className="pf-section pf-contact"
      aria-labelledby="contact-title"
    >
      <div className="pf-wrap pf-contact__grid">
        <div className="pf-contact__intro">
          <LabBadge letter="G" name="Letras que caen y se apilan" tone="dark" />
          <motion.span
            className="pf-aisle"
            aria-hidden="true"
            style={reduceMotion ? undefined : { scaleX: tape, transformOrigin: "left" }}
          />
          <h2 id="contact-title" className="pf-display pf-h2 lab-contact-title">
            <ScrollLetters text={copy.title} mode="drop" progress={scrollYProgress} />
          </h2>
          <p className="pf-contact__text">{copy.text}</p>

          <a className="pf-contact__email" href={`mailto:${CONTACT.email}`}>
            {CONTACT.email}
          </a>

          <div className="pf-contact__copy">
            <button
              type="button"
              className="pf-btn pf-btn--outline-light pf-btn--small"
              onClick={copyEmail}
            >
              <ClipboardDocumentIcon aria-hidden="true" />
              {copy.copy}
            </button>
            <span className="pf-copy-status" role="status" aria-live="polite">
              {copyState === "copied"
                ? copy.copied
                : copyState === "failed"
                  ? copy.copyFailed
                  : ""}
            </span>
          </div>
        </div>

        <div className="pf-contact__channels">
          <h3 className="pf-sr-only">{copy.channelsLabel}</h3>
          <ul className="pf-channels">
            <li>
              <a href={CONTACT.linkedin} target="_blank" rel="noopener noreferrer">
                <span className="pf-channels__name">{copy.linkedin}</span>
                <span className="pf-channels__detail">
                  {copy.linkedinDetail}
                  <ArrowUpRightIcon aria-hidden="true" />
                </span>
              </a>
            </li>
            <li>
              <a href={CONTACT.github} target="_blank" rel="noopener noreferrer">
                <span className="pf-channels__name">{copy.github}</span>
                <span className="pf-channels__detail">
                  {copy.githubDetail}
                  <ArrowUpRightIcon aria-hidden="true" />
                </span>
              </a>
            </li>
            <li>
              <a href={cv.href} download={cv.fileName} aria-label={cv.ariaLabel}>
                <span className="pf-channels__name">{copy.cv}</span>
                <span className="pf-channels__detail">
                  {copy.cvDetail}
                  <ArrowDownTrayIcon aria-hidden="true" />
                </span>
              </a>
            </li>
            <li>
              <p className="pf-channels__static">
                <span className="pf-channels__name">{copy.location}</span>
                <span className="pf-channels__detail">{copy.locationDetail}</span>
              </p>
            </li>
          </ul>
        </div>
      </div>
    </section>
  );
}
