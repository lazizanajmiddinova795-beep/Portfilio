"use client";

import { motion, useInView } from "framer-motion";
import { useRef, useState } from "react";
import { useTranslation } from "@/components/providers/I18nProvider";
import { CheckCircle2 } from "lucide-react";

interface ProjectCardProps {
  name: string;
  tagline: string;
  description: string;
  features: readonly string[];
  gradient: string;
  index: number;
  isInView: boolean;
}

function ProjectCard({
  name,
  tagline,
  description,
  features,
  gradient,
  index,
  isInView,
}: ProjectCardProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [tilt, setTilt] = useState({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = useState(false);

  const onMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = cardRef.current?.getBoundingClientRect();
    if (!rect) return;
    const cx = rect.left + rect.width / 2;
    const cy = rect.top + rect.height / 2;
    const x = ((e.clientY - cy) / (rect.height / 2)) * 6;
    const y = ((cx - e.clientX) / (rect.width / 2)) * 6;
    setTilt({ x, y });
  };

  const onMouseLeave = () => {
    setTilt({ x: 0, y: 0 });
    setIsHovered(false);
  };

  return (
    <motion.div
      ref={cardRef}
      className="relative group"
      initial={{ opacity: 0, y: 40 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{
        duration: 0.7,
        delay: index * 0.15,
        ease: [0.22, 1, 0.36, 1],
      }}
      style={{
        perspective: 1000,
        transformStyle: "preserve-3d",
      }}
      onMouseMove={onMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={onMouseLeave}
    >
      <motion.div
        className="rounded-3xl overflow-hidden border border-green-100/80 dark:border-white/10 bg-white dark:bg-white/5 shadow-lg hover:shadow-2xl transition-shadow duration-500"
        animate={{
          rotateX: tilt.x,
          rotateY: tilt.y,
          scale: isHovered ? 1.02 : 1,
        }}
        transition={{ type: "spring", stiffness: 200, damping: 20 }}
        style={{ transformStyle: "preserve-3d" }}
      >
        {/* Card Header */}
        <div className={`relative h-48 bg-gradient-to-br ${gradient} p-8 overflow-hidden`}>
          {/* Grid pattern */}
          <div
            className="absolute inset-0 opacity-10"
            style={{
              backgroundImage: `linear-gradient(rgba(255,255,255,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.5) 1px, transparent 1px)`,
              backgroundSize: "30px 30px",
            }}
          />

          {/* Floating circle decoration */}
          <div className="absolute -right-8 -top-8 w-40 h-40 rounded-full bg-white/10" />
          <div className="absolute -right-4 top-8 w-24 h-24 rounded-full bg-white/10" />

          <div className="relative z-10">
            <span className="inline-block px-3 py-1 rounded-full bg-white/20 text-white text-xs font-semibold mb-4 backdrop-blur-sm">
              {tagline}
            </span>
            <h3 className="text-3xl font-bold text-white">{name}</h3>
          </div>
        </div>

        {/* Card Body */}
        <div className="p-8 space-y-6">
          <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
            {description}
          </p>

          <div>
            <p className="text-xs font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-widest mb-4">
              Features
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {features.map((feature) => (
                <div key={feature} className="flex items-center gap-2">
                  <CheckCircle2
                    size={14}
                    className="text-green-500 flex-shrink-0"
                  />
                  <span className="text-sm text-gray-600 dark:text-gray-400">
                    {feature}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </motion.div>

      {/* Glow effect */}
      <motion.div
        className={`absolute inset-0 rounded-3xl bg-gradient-to-br ${gradient} opacity-0 group-hover:opacity-10 transition-opacity duration-500 blur-xl -z-10`}
      />
    </motion.div>
  );
}

export default function Projects() {
  const { t } = useTranslation();
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  const projects = [
    {
      ...t.projects.vrestro,
      gradient: "from-green-500 via-emerald-500 to-teal-500",
    },
    {
      ...t.projects.gymMaster,
      gradient: "from-emerald-500 via-green-500 to-lime-500",
    },
  ];

  return (
    <section
      id="projects"
      ref={ref}
      className="py-24 sm:py-32 bg-gradient-to-b from-transparent via-green-50/20 dark:via-green-900/5 to-transparent"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          className="text-center mb-16 space-y-4"
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
        >
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-green-50 dark:bg-green-900/20 border border-green-200/60 dark:border-green-700/30">
            <div className="w-1.5 h-1.5 rounded-full bg-green-500" />
            <span className="text-xs font-semibold text-green-700 dark:text-green-400 tracking-widest uppercase">
              {t.projects.badge}
            </span>
          </div>
          <h2 className="text-4xl sm:text-5xl font-bold text-gray-900 dark:text-white">
            {t.projects.title}
          </h2>
          <p className="max-w-xl mx-auto text-gray-500 dark:text-gray-400">
            {t.projects.subtitle}
          </p>
        </motion.div>

        {/* Project cards */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {projects.map((project, i) => (
            <ProjectCard
              key={project.name}
              name={project.name}
              tagline={project.tagline}
              description={project.description}
              features={project.features}
              gradient={project.gradient}
              index={i}
              isInView={isInView}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
