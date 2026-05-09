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
  {
    num: "01",
    date: "Brand + Social",
    title: "Bloom Botanicals",
    subtitle: "Full brand identity and social strategy. 3x growth in 6 months.",
    image: "/images/project-bloom.jpg",
    alt: "Bloom Botanicals project",
    tags: ["Brand", "Social"],
    bg: "rgb(54, 197, 240)",
    textColor: "rgb(17,18,18)",
    tagBg: "rgb(17,18,18)",
    tagText: "white",
  },
  {
    num: "02",
    date: "Paid Media",
    title: "Volt Energy",
    subtitle: "Google and Meta campaigns built around performance, clarity, and 480% ROAS.",
    image: "/images/project-volt.jpg",
    alt: "Volt Energy project",
    tags: ["Paid Media", "Growth"],
    bg: "rgb(17,18,18)",
    textColor: "white",
    tagBg: "white",
    tagText: "rgb(17,18,18)",
  },
  {
    num: "03",
    date: "Content + SEO",
    title: "Skyline Ventures",
    subtitle: "Content-led organic growth with #1 ranking in 4 months.",
    image: "/images/project-skyline.jpg",
    alt: "Skyline Ventures project",
    tags: ["Content", "SEO"],
    bg: "rgb(236, 178, 46)",
    textColor: "rgb(17,18,18)",
    tagBg: "rgb(17,18,18)",
    tagText: "white",
  },
  {
    num: "04",
    date: "Web Design",
    title: "Greenlight Studio",
    subtitle: "A fast, expressive digital experience built to convert attention into action.",
    image: "/images/project-greenlight.jpg",
    alt: "Greenlight Studio project",
    tags: ["Web", "Creative"],
    bg: "rgb(224, 30, 90)",
    textColor: "white",
    tagBg: "white",
    tagText: "rgb(224,30,90)",
  },
];

const ease = [0.22, 1, 0.36, 1] as const;
const TAB_HEIGHT = 72;
const TAB_OVERLAP = 36;
const NAV_CLEARANCE = 160;

export function FeaturedWorks() {
  return (
    <section id="work" className="relative w-full overflow-visible px-6 pt-28 pb-32">
      <div className="mx-auto mb-20 flex max-w-[1180px] flex-col items-center text-center">
        <motion.p
          initial={{ opacity: 0, y: 14 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-15% 0px" }}
          transition={{ duration: 0.6, ease }}
          className="mb-4 text-sm font-semibold uppercase tracking-[0.18em]"
        >
          Selected Work
        </motion.p>

        <motion.h2
          initial={{ opacity: 0, y: 30, scale: 0.96 }}
          whileInView={{ opacity: 1, y: 0, scale: 1 }}
          viewport={{ once: true, margin: "-15% 0px" }}
          transition={{ duration: 0.8, ease }}
          className="text-center font-black uppercase"
          style={{
            fontSize: "clamp(64px, 11vw, 150px)",
            lineHeight: 0.92,
            color: "rgb(17,18,18)",
          }}
        >
          Things we're
          <br />
          proud of.
        </motion.h2>
      </div>

      <div className="relative mx-auto max-w-[1800px] overflow-visible">
        {PROJECTS.map((project, index) => (
          <ProjectCard key={project.num} project={project} index={index} />
        ))}
      </div>
    </section>
  );
}

function ProjectCard({ project, index }: { project: Project; index: number }) {
  return (
    <div
      className="sticky"
      style={{
        top: NAV_CLEARANCE,
        zIndex: index + 1,
      }}
    >
      <ProjectTab project={project} index={index} />

      <motion.div
        whileHover={{ scale: 0.997 }}
        className="grid grid-cols-1 gap-6 rounded-b-2xl p-8 md:grid-cols-2 md:p-10"
        style={{
          background: project.bg,
          color: project.textColor,
          minHeight: 540,
          borderTopLeftRadius: 0,
          boxShadow: "0 -1px 0 rgba(17,18,18,0.06), 0 12px 28px rgba(17,18,18,0.08)",
        }}
      >
        <div className="flex flex-col">
          <div
            className="mb-6 flex items-center gap-2 uppercase"
            style={{
              fontFamily: "ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace",
              fontSize: 12,
              letterSpacing: "0.06em",
              opacity: 0.85,
            }}
          >
            <span className="inline-block h-2.5 w-2.5 rounded-full" style={{ background: project.textColor }} />
            {project.date}
          </div>

          <h3
            style={{
              fontSize: "clamp(42px, 5vw, 76px)",
              fontWeight: 800,
              lineHeight: 1,
            }}
          >
            {project.title}
          </h3>

          <p className="mt-4 max-w-md text-base leading-relaxed opacity-85">{project.subtitle}</p>

          <motion.a
            href="#"
            whileHover={{ x: 4 }}
            className="mt-8 inline-flex items-center gap-2 uppercase underline-offset-4 hover:underline"
            style={{
              fontFamily: "ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace",
              fontSize: 12,
              letterSpacing: "0.06em",
            }}
          >
            View project
            <ArrowUpRight className="h-3.5 w-3.5" />
          </motion.a>

          <div className="mt-auto flex flex-wrap gap-2 pt-12">
            {project.tags.map((tag) => (
              <div
                key={tag}
                className="flex items-center gap-1.5 px-3 py-1.5 uppercase"
                style={{
                  background: project.tagBg,
                  color: project.tagText,
                  fontFamily: "ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace",
                  fontSize: 11,
                  letterSpacing: "0.06em",
                  clipPath: "polygon(0 0, calc(100% - 10px) 0, 100% 100%, 0 100%)",
                  paddingRight: 18,
                }}
              >
                <BarChart3 className="h-3 w-3" />
                <span>{tag}</span>
              </div>
            ))}
          </div>
        </div>

        <motion.div
          whileHover={{ scale: 1.015 }}
          transition={{ duration: 0.4, ease }}
          className="relative overflow-hidden rounded-md"
          style={{ minHeight: 380 }}
        >
          <Image
            src={project.image}
            alt={project.alt}
            fill
            sizes="(max-width: 768px) 100vw, 50vw"
            className="object-cover"
          />

          <div
            className="absolute top-3 right-3 flex items-center gap-1.5 rounded px-2 py-1 uppercase"
            style={{
              background: "rgb(54,197,240)",
              color: "rgb(17,18,18)",
              fontFamily: "ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace",
              fontSize: 10,
              letterSpacing: "0.04em",
            }}
          >
            <ImageIcon className="h-3 w-3" />
            <span>IMAGE.JPG</span>
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
}

function ProjectTab({ project, index }: { project: Project; index: number }) {
  return (
    <div
      className="relative"
      style={{
        height: TAB_HEIGHT,
        marginBottom: -1,
        zIndex: 5,
      }}
    >
      <div
        className="absolute top-0 flex items-center justify-center gap-2 px-3 uppercase"
        style={{
          left: `calc(${index * 25}% - ${index * TAB_OVERLAP}px)`,
          width: `calc(25% + ${TAB_OVERLAP}px)`,
          height: TAB_HEIGHT,
          background: project.bg,
          color: project.textColor,
          clipPath:
            index === PROJECTS.length - 1
              ? "polygon(18px 0, calc(100% - 58px) 0, 100% 100%, 0 100%)"
              : "polygon(0 0, calc(100% - 58px) 0, 100% 100%, 0 100%)",
          fontFamily: "ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace",
          fontSize: 12,
          letterSpacing: "0.06em",
          paddingLeft: index === 0 ? 24 : 46,
          paddingRight: 58,
        }}
      >
        <Folder className="h-3.5 w-3.5 shrink-0" />
        <span className="whitespace-nowrap">Project {project.num}</span>
      </div>
    </div>
  );
}
