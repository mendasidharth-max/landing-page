"use client";

import Image from "next/image";
import { motion } from "motion/react";
import { ArrowUpRight, BarChart3, Folder, ImageIcon } from "lucide-react";

type Project = {
  num: string;
  date: string;
  title: string;
  subtitle: string;
  image: string;
  alt: string;
  tags: string[];
  bg: string;
  textColor: string;
  tagBg: string;
  tagText: string;
};

const PROJECTS: Project[] = [
  { num: "01", date: "Mar 19, 2026", title: "Meridian Health", subtitle: "When therapists spend less time clicking, they have more time for patients.", image: "/images/project-meridian.jpg", alt: "A group of people on a running track", tags: ["Healthcare", "Workflow Design"], bg: "rgb(54, 197, 240)", textColor: "rgb(17,18,18)", tagBg: "rgb(17,18,18)", tagText: "white" },
  { num: "02", date: "Mar 2, 2026", title: "StyleBook", subtitle: "From 'I hate this system' to 'Can we show other salons?'", image: "/images/project-stylebook.jpg", alt: "A man sitting indoors", tags: ["SAAS", "Transformation"], bg: "rgb(17,18,18)", textColor: "white", tagBg: "white", tagText: "rgb(17,18,18)" },
  { num: "03", date: "Jan 2, 2025", title: "Homestead", subtitle: "Reimagining the way people find their next home.", image: "/images/project-homestead.jpg", alt: "A colorful house detail", tags: ["PROPTECH", "0 -> 1"], bg: "rgb(236, 178, 46)", textColor: "rgb(17,18,18)", tagBg: "rgb(17,18,18)", tagText: "white" },
  { num: "04", date: "Mar 19, 2026", title: "North Light", subtitle: "Helping enterprise teams navigate hard strategic choices.", image: "/images/project-northlight.jpg", alt: "A person in the desert", tags: ["STRATEGY", "ENTERPRISE"], bg: "rgb(224, 30, 90)", textColor: "white", tagBg: "white", tagText: "rgb(224,30,90)" },
];

const ease = [0.22, 1, 0.36, 1] as const;
const TAB_HEIGHT = 72;
const TAB_OVERLAP = 36;
const NAV_CLEARANCE = 80;

export function FeaturedWorks() {
  return (
    <section id="works" className="relative w-full px-6 pt-28 pb-32">
      <div className="mx-auto mb-20 flex max-w-[1180px] flex-col items-center text-center">
        <motion.div initial={{ opacity: 0, y: 14, rotate: 0 }} whileInView={{ opacity: 1, y: 0, rotate: -2 }} viewport={{ once: true, margin: "-15% 0px" }} transition={{ duration: 0.6, ease }} className="mb-2 text-[26px]" style={{ fontFamily: "var(--font-handwritten, cursive)", color: "rgb(17,18,18)" }}>
          explore my work!
          <div className="mx-auto mt-1 h-[3px] w-24 bg-black/80" style={{ borderRadius: 2 }} />
        </motion.div>
        <motion.h2 initial={{ opacity: 0, y: 30, scale: 0.96 }} whileInView={{ opacity: 1, y: 0, scale: 1 }} viewport={{ once: true, margin: "-15% 0px" }} transition={{ duration: 0.8, ease }} className="my-4 uppercase" style={{ fontFamily: "var(--font-flux, Impact, system-ui, sans-serif)", fontSize: "clamp(72px, 12vw, 156px)", lineHeight: 0.95, color: "rgb(17,18,18)" }}>
          Featured<br />Works
        </motion.h2>
        <motion.div initial={{ opacity: 0, y: 12, rotate: 4 }} whileInView={{ opacity: 1, y: 0, rotate: -2 }} viewport={{ once: true, margin: "-10% 0px" }} transition={{ duration: 0.7, delay: 0.2, ease }} className="mt-2 inline-block max-w-[280px] px-3 py-2 shadow-[0_4px_14px_rgba(17,18,18,0.08)]" style={{ background: "rgb(245, 221, 161)", fontFamily: "var(--font-handwritten, cursive)", fontSize: 20, lineHeight: 1.2 }}>
          This is a showcase of what happens when curiosity drives the process.
        </motion.div>
      </div>
      <div className="relative mx-auto max-w-[1800px]">
        {PROJECTS.map((project, index) => <ProjectCard key={project.num} project={project} index={index} />)}
      </div>
    </section>
  );
}

function ProjectCard({ project, index }: { project: Project; index: number }) {
  return (
    <div className="sticky" style={{ top: NAV_CLEARANCE, zIndex: index + 1 }}>
      <ProjectTab project={project} index={index} />
      <motion.div whileHover={{ scale: 0.997 }} className="grid grid-cols-1 gap-6 rounded-b-2xl p-8 md:grid-cols-2 md:p-10" style={{ background: project.bg, color: project.textColor, minHeight: 540, borderTopLeftRadius: 0, boxShadow: "0 -1px 0 rgba(17,18,18,0.06), 0 12px 28px rgba(17,18,18,0.08)" }}>
        <div className="flex flex-col">
          <div className="mb-6 flex items-center gap-2 uppercase" style={{ fontFamily: "var(--font-mono, ui-monospace, monospace)", fontSize: 12, letterSpacing: "0.06em", opacity: 0.85 }}><span className="inline-block h-2.5 w-2.5 rounded-full" style={{ background: project.textColor }} />{project.date}</div>
          <h3 style={{ fontFamily: "var(--font-display, Inter, system-ui, sans-serif)", fontSize: "clamp(40px, 5vw, 72px)", fontWeight: 700, lineHeight: 1 }}>{project.title}</h3>
          <p className="mt-3 max-w-md" style={{ fontSize: 14, lineHeight: 1.5, opacity: 0.85 }}>{project.subtitle}</p>
          <motion.a href="#" whileHover={{ x: 4 }} className="mt-6 inline-flex items-center gap-2 uppercase underline-offset-4 hover:underline" style={{ fontFamily: "var(--font-mono, ui-monospace, monospace)", fontSize: 12, letterSpacing: "0.06em" }}>View project <ArrowUpRight className="h-3.5 w-3.5" /></motion.a>
          <div className="mt-auto flex flex-wrap gap-2 pt-12">{project.tags.map((tag) => <div key={tag} className="flex items-center gap-1.5 px-3 py-1.5 uppercase" style={{ background: project.tagBg, color: project.tagText, fontFamily: "var(--font-mono, ui-monospace, monospace)", fontSize: 11, letterSpacing: "0.06em", clipPath: "polygon(0 0, calc(100% - 10px) 0, 100% 100%, 0 100%)", paddingRight: 18 }}><BarChart3 className="h-3 w-3" /><span>{tag}</span></div>)}</div>
        </div>
        <motion.div whileHover={{ scale: 1.015 }} transition={{ duration: 0.4, ease }} className="relative overflow-hidden rounded-md" style={{ minHeight: 380 }}>
          <Image src={project.image} alt={project.alt} fill sizes="(max-width: 768px) 100vw, 50vw" className="object-cover" />
          <div className="absolute top-3 right-3 flex items-center gap-1.5 rounded px-2 py-1 uppercase" style={{ background: "rgb(54,197,240)", color: "rgb(17,18,18)", fontFamily: "var(--font-mono, ui-monospace, monospace)", fontSize: 10, letterSpacing: "0.04em" }}><ImageIcon className="h-3 w-3" /><span>IMAGE.JPG</span></div>
        </motion.div>
      </motion.div>
    </div>
  );
}

function ProjectTab({ project, index }: { project: Project; index: number }) {
  return (
    <div className="relative" style={{ height: TAB_HEIGHT, marginBottom: -1, zIndex: 5 }}>
      <div className="absolute top-0 flex items-center justify-center gap-2 px-3 uppercase" style={{ left: `calc(${index * 25}% - ${index * TAB_OVERLAP}px)`, width: `calc(25% + ${TAB_OVERLAP}px)`, height: TAB_HEIGHT, background: project.bg, color: project.textColor, clipPath: index === PROJECTS.length - 1 ? "polygon(18px 0, calc(100% - 58px) 0, 100% 100%, 0 100%)" : "polygon(0 0, calc(100% - 58px) 0, 100% 100%, 0 100%)", fontFamily: "var(--font-mono, ui-monospace, monospace)", fontSize: 12, letterSpacing: "0.06em", paddingLeft: index === 0 ? 24 : 46, paddingRight: 58 }}>
        <Folder className="h-3.5 w-3.5 shrink-0" />
        <span className="whitespace-nowrap">Project {project.num}</span>
      </div>
    </div>
  );
}
