import { useState, useEffect, useCallback, useRef } from "react";
import {
  Shield,
  Swords,
  Wrench,
  Github,
  Linkedin,
  Mail,
  ExternalLink,
  ChevronDown,
  ChevronUp,
  Menu,
  X,
  GraduationCap,
  Award,
  Lock,
  Terminal,
  Copy,
  Check,
} from "lucide-react";

/* ════════════════════════════════════════════════════════════════
   DATA — Edit these objects to customise the portfolio.
   ════════════════════════════════════════════════════════════════ */

const PROFILE = {
  name: "Krishna Gautam",
  degree: "MSc Cyber Security",
  tagline:
    "Passionate about Application Security and Network Defense. Building secure systems and protecting digital infrastructure through research, offensive security testing, and defensive strategies.",
  email: "gautamkrish@proton.me",
  linkedin: "https://www.linkedin.com/in/kgautam07/",
  github: "https://github.com/gtkri",
  location: "Germany",
  interests: "Threat Modelling · Incident Response · Cloud Security",
};

const ABOUT_TEXT = [
  "I'm a Master's student specializing in Cyber Security, with a focus on securing web applications and network infrastructure. My academic journey has equipped me with deep knowledge in threat modeling, vulnerability assessment, and incident response.",
  "Through hands-on projects and CTF competitions, I've developed practical skills in penetration testing, log analysis, and security tool development. I'm committed to staying current with emerging threats and continuously expanding my expertise in offensive and defensive security..",
  "My long-term goal is to contribute to defensive security at scale — whether that is building detection pipelines, improving incident response playbooks, or securing critical infrastructure from emerging threats. ",
];

const SKILLS = {
  "Defensive (Blue Team)": {
    icon: Shield,
    items: [
      "SIEM Engineering",
      "EDR / XDR",
      "Threat Hunting",
      "Incident Response",
      "Log Analysis",
      "YARA / Sigma Rules",
      "Digital Forensics",
      "Malware Triage",
    ],
  },
  "Offensive (Red Team)": {
    icon: Swords,
    items: [
      "Penetration Testing",
      "Web App Security",
      "Active Directory Attacks",
      "Privilege Escalation",
      "OSINT",
      "Social Engineering",
      "Exploit Development",
      "CTF Competitions",
    ],
  },
  "Architecture & Tooling": {
    icon: Wrench,
    items: [
      "Linux Administration",
      "Docker / K8s",
      "Terraform / IaC",
      "CI / CD Pipelines",
      "Python Scripting",
      "Bash / PowerShell",
      "Git / GitHub Actions",
      "Network Protocols",
    ],
  },
};

const PROJECTS = [
  {
    title: "Enterprise AD Homelab",
    description:
      "Multi-forest Active Directory environment with GPO hardening, Kerberos delegation attacks, and Splunk SIEM integration for detection engineering.",
    tech: ["Windows Server", "Splunk", "Sysmon", "PowerShell"],
    link: "[Repo Link]",
  },
  {
    title: "Cloud SIEM Pipeline",
    description:
      "End-to-end detection pipeline ingesting AWS CloudTrail and VPC Flow Logs into Elasticsearch with custom Sigma rule translation.",
    tech: ["AWS", "Elasticsearch", "Sigma", "Terraform"],
    link: "[Repo Link]",
  },
  {
    title: "CTF Write-ups Collection",
    description:
      "Detailed write-ups for 30+ CTF challenges covering web exploitation, reverse engineering, cryptography, and forensics.",
    tech: ["Ghidra", "Burp Suite", "Python", "Wireshark"],
    link: "[Repo Link]",
  },
  {
    title: "Vulnerability Disclosure — CVE-XXXX-XXXX",
    description:
      "Responsible disclosure of an authentication bypass in an open-source WAF. Includes root cause analysis and proposed patch.",
    tech: ["Fuzzing", "C", "HTTP/2", "Docker"],
    link: "[Repo Link]",
  },
  {
    title: "Automated Malware Sandbox",
    description:
      "Cuckoo-based sandbox with YARA rule auto-generation and VirusTotal enrichment, deployed via Docker Compose.",
    tech: ["Cuckoo", "YARA", "Docker", "Python"],
    link: "[Repo Link]",
  },
  {
    title: "Zero Trust Network Lab",
    description:
      "Proof-of-concept zero-trust architecture using WireGuard, mutual TLS, and OPA policy enforcement for micro-segmentation.",
    tech: ["WireGuard", "mTLS", "OPA", "Go"],
    link: "[Repo Link]",
  },
];

const EDUCATION = [
  {
    title: "MSc Cyber Security",
    org: "Brandenburgische Technische Universität Cottbus-Senftenberg",
    date: "2024 — 2026",
    status: "In Progress",
    detail:
      "Modules include Network Security, Cryptography, Ethical Hacking, Process Architecture.",
  },
  {
    title: "BSc Computer Science",
    org: "Jacobs University Bremen",
    date: "2021 — 2024",
    status: "Completed",
    detail: "Modules include Algorithms and Data Structures, Operating Systems, Databases and Web Services, Computer Networks, Computer Vision, Automata Computability and Complexity.",
  },
];

const CERTIFICATIONS = [
  {
    title: "CompTIA Security+",
    org: "CompTIA",
    date: "2024",
    status: "Completed",
    detail: "Foundational security certification covering risk management, threat analysis, and security operations.",
  },
  {
    title: "Certified Ethical Hacker (CEH)",
    org: "EC-Council",
    date: "2025",
    status: "Completed",
    detail: "Validated skills in ethical hacking methodologies and penetration testing techniques.",
  },
  {
    title: "OSCP — Offensive Security Certified Professional",
    org: "Offensive Security",
    date: "2026 (Target)",
    status: "In Progress",
    detail: "Hands-on penetration testing certification — currently preparing via HackTheBox and personal lab.",
  },
];

const PGP_KEY = `-----BEGIN PGP PUBLIC KEY BLOCK-----

[Paste your full PGP public key block here]

-----END PGP PUBLIC KEY BLOCK-----`;

/* ════════════════════════════════════════════════════════════════
   UTILITY HOOKS
   ════════════════════════════════════════════════════════════════ */

function useActiveSection(ids) {
  const [active, setActive] = useState(ids[0]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);
        if (visible.length > 0) {
          setActive(visible[0].target.id);
        }
      },
      { rootMargin: "-20% 0px -75% 0px", threshold: 0 }
    );

    ids.forEach((id) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, [ids]);

  return active;
}

/* ════════════════════════════════════════════════════════════════
   COMPONENTS
   ════════════════════════════════════════════════════════════════ */

/* ── Section wrapper ────────────────────────────────────────── */
function Section({ id, label, children, className = "" }) {
  return (
    <section
      id={id}
      aria-label={label}
      className={`py-10 md:py-14 ${className}`}
    >
      <div className="mx-auto max-w-5xl px-6">{children}</div>
    </section>
  );
}

function SectionHeading({ children }) {
  return (
    <h2 className="mb-8 text-2xl font-bold tracking-tight text-slate-100 md:text-3xl">
      <span className="mr-2 font-mono text-accent">#</span>
      {children}
    </h2>
  );
}

/* ── Navbar ─────────────────────────────────────────────────── */
const NAV_IDS = ["hero", "about", "skills", "projects", "education", "certifications", "contact"];
const NAV_LABELS = {
  hero: "Home",
  about: "About",
  skills: "Skills",
  projects: "Projects",
  education: "Education",
  certifications: "Certs",
  contact: "Contact",
};

function Navbar() {
  const active = useActiveSection(NAV_IDS);
  const [open, setOpen] = useState(false);

  const close = useCallback(() => setOpen(false), []);

  /* Close mobile menu on resize to desktop */
  useEffect(() => {
    const mq = window.matchMedia("(min-width: 768px)");
    const handler = () => {
      if (mq.matches) setOpen(false);
    };
    mq.addEventListener("change", handler);
    return () => mq.removeEventListener("change", handler);
  }, []);

  return (
    <header
      role="banner"
      className="fixed inset-x-0 top-0 z-50 border-b border-border-subtle bg-surface/85 backdrop-blur-lg"
    >
      <nav
        aria-label="Primary navigation"
        className="mx-auto flex h-14 max-w-5xl items-center justify-between px-6"
      >
        {/* Logo */}
        <a
          href="#hero"
          className="font-mono text-sm font-semibold tracking-wide text-accent transition-colors hover:text-accent-hover"
          aria-label="Go to top"
        >
          ~/portfolio
        </a>

        {/* Desktop links */}
        <ul className="hidden gap-6 md:flex" role="list">
          {NAV_IDS.filter((id) => id !== "hero").map((id) => (
            <li key={id}>
              <a
                href={`#${id}`}
                className={`text-sm transition-colors ${
                  active === id
                    ? "font-medium text-accent"
                    : "text-text-secondary hover:text-slate-100"
                }`}
              >
                {NAV_LABELS[id]}
              </a>
            </li>
          ))}
        </ul>

        {/* Mobile toggle */}
        <button
          onClick={() => setOpen((prev) => !prev)}
          className="inline-flex items-center justify-center rounded-md p-2 text-text-secondary transition-colors hover:text-slate-100 md:hidden"
          aria-expanded={open}
          aria-controls="mobile-menu"
          aria-label={open ? "Close menu" : "Open menu"}
        >
          {open ? <X size={20} /> : <Menu size={20} />}
        </button>
      </nav>

      {/* Mobile menu */}
      {open && (
        <ul
          id="mobile-menu"
          role="list"
          className="border-t border-border-subtle bg-surface/95 px-6 py-4 backdrop-blur-lg md:hidden"
        >
          {NAV_IDS.filter((id) => id !== "hero").map((id) => (
            <li key={id}>
              <a
                href={`#${id}`}
                onClick={close}
                className={`block py-2 text-sm transition-colors ${
                  active === id
                    ? "font-medium text-accent"
                    : "text-text-secondary hover:text-slate-100"
                }`}
              >
                {NAV_LABELS[id]}
              </a>
            </li>
          ))}
        </ul>
      )}
    </header>
  );
}

/* ── Hero ───────────────────────────────────────────────────── */
function Hero() {
  return (
    <Section id="hero" label="Introduction" className="pt-24 md:pt-28">
      <div className="grid items-start gap-8 lg:grid-cols-5">
        {/* Text column */}
        <div className="lg:col-span-3">
          <p className="mb-2 font-mono text-sm font-medium tracking-wide text-accent">Hello, my name is</p>
          <h1 className="mb-3 text-4xl font-extrabold tracking-tight text-slate-50 md:text-5xl lg:text-6xl">
            {PROFILE.name}
          </h1>
          <p className="mb-4 text-lg font-medium text-text-primary md:text-xl">
            {PROFILE.degree}
          </p>
          <p className="max-w-xl text-base leading-relaxed text-text-secondary">
            {PROFILE.tagline}
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            <a
              href="#projects"
              className="inline-flex items-center gap-2 rounded-md bg-accent px-5 py-2.5 text-sm font-semibold text-surface shadow-sm shadow-accent/20 transition-colors hover:bg-accent-hover"
            >
              View Projects
            </a>
            <a
              href="#contact"
              className="inline-flex items-center gap-2 rounded-md border border-border-subtle px-5 py-2.5 text-sm font-medium text-text-primary transition-colors hover:border-accent hover:text-accent"
            >
              Get in Touch
            </a>
          </div>
        </div>

        {/* Terminal card */}
        <div
          aria-hidden="true"
          className="w-full overflow-hidden rounded-lg border border-border-subtle bg-surface-raised lg:col-span-2"
        >
          {/* Title bar */}
          <div className="flex items-center gap-2 border-b border-border-subtle px-4 py-2.5">
            <span className="h-2.5 w-2.5 rounded-full bg-red-400" />
            <span className="h-2.5 w-2.5 rounded-full bg-yellow-400" />
            <span className="h-2.5 w-2.5 rounded-full bg-green-400" />
            <span className="ml-2 font-mono text-xs text-text-muted">
              ~/:whoami
            </span>
          </div>
          {/* Body */}
          <div className="space-y-1.5 px-4 py-4 font-mono text-xs leading-relaxed text-text-secondary sm:text-sm">
            <p>
              <span className="text-accent">$</span> whoami
            </p>
            <p className="text-slate-100">{PROFILE.name}</p>
            <p className="mt-3">
              <span className="text-accent">$</span> cat /etc/profile
            </p>
            <p>
              <span className="text-text-muted">degree :</span>{" "}
              <span className="text-slate-100">{PROFILE.degree}</span>
            </p>
            <p>
              <span className="text-text-muted">location :</span>{" "}
              <span className="text-slate-100">{PROFILE.location}</span>
            </p>
            <p>
              <span className="text-text-muted">interests:</span>{" "}
              <span className="text-slate-100">{PROFILE.interests}</span>
            </p>
            <p className="mt-3 animate-pulse text-accent">▌</p>
          </div>
        </div>
      </div>
    </Section>
  );
}

/* ── About ──────────────────────────────────────────────────── */
function About() {
  return (
    <Section id="about" label="About me">
      <SectionHeading>About Me</SectionHeading>
      <div className="max-w-3xl space-y-4 text-base leading-relaxed text-text-secondary">
        {ABOUT_TEXT.map((p, i) => (
          <p key={i}>{p}</p>
        ))}
      </div>
    </Section>
  );
}

/* ── Skills ─────────────────────────────────────────────────── */
function SkillTag({ label }) {
  return (
    <span className="inline-block rounded-md border border-border-subtle bg-surface px-3 py-1.5 font-mono text-xs tracking-wide text-text-secondary transition-all duration-200 hover:border-accent hover:text-accent">
      {label}
    </span>
  );
}

function Skills() {
  return (
    <Section id="skills" label="Core competencies">
      <SectionHeading>Core Competencies</SectionHeading>
      <div className="grid gap-6 md:grid-cols-3">
        {Object.entries(SKILLS).map(([category, { icon: Icon, items }]) => (
          <div
            key={category}
            className="rounded-lg border border-border-subtle bg-surface-raised p-6 transition-all duration-200 hover:border-accent/30"
          >
            <div className="mb-4 flex items-center gap-3">
              <Icon
                size={20}
                className="shrink-0 text-accent"
                aria-hidden="true"
              />
              <h3 className="text-sm font-semibold text-slate-50">
                {category}
              </h3>
            </div>
            <div className="flex flex-wrap gap-2" role="list" aria-label={`${category} skills`}>
              {items.map((skill) => (
                <SkillTag key={skill} label={skill} />
              ))}
            </div>
          </div>
        ))}
      </div>
    </Section>
  );
}

/* ── Projects ───────────────────────────────────────────────── */
function ProjectCard({ title, description, tech, link }) {
  return (
    <article className="group flex flex-col rounded-lg border border-border-subtle bg-surface-raised p-6 transition-all duration-200 hover:border-accent/50">
      <h3 className="mb-2 text-base font-semibold text-slate-50">{title}</h3>
      <p className="mb-4 flex-1 text-sm leading-relaxed text-text-secondary">
        {description}
      </p>
      <div className="mb-4 flex flex-wrap gap-2">
        {tech.map((t) => (
          <span
            key={t}
            className="rounded bg-surface px-2 py-0.5 font-mono text-xs text-text-muted"
          >
            {t}
          </span>
        ))}
      </div>
      <a
        href={link}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex items-center gap-1.5 text-sm font-medium text-accent transition-colors hover:text-accent-hover"
        aria-label={`View ${title} on GitHub (opens in new tab)`}
      >
        <Github size={14} aria-hidden="true" />
        View Repository
        <ExternalLink size={12} aria-hidden="true" />
      </a>
    </article>
  );
}

function Projects() {
  return (
    <Section id="projects" label="Homelab and research projects">
      <SectionHeading>Homelab &amp; Research</SectionHeading>
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {PROJECTS.map((p) => (
          <ProjectCard key={p.title} {...p} />
        ))}
      </div>
    </Section>
  );
}

/* ── Timeline Item (shared) ──────────────────────────────────── */
function TimelineItem({ icon: Icon, title, org, date, status, detail }) {
  const inProgress = status === "In Progress";

  return (
    <li className="relative pl-8 before:absolute before:left-[7px] before:top-8 before:h-full before:w-px before:bg-border-subtle last:before:hidden">
      {/* Dot */}
      <span
        className={`absolute left-0 top-1.5 flex h-4 w-4 items-center justify-center rounded-full border-2 ${
          inProgress
            ? "border-accent bg-accent/20"
            : "border-border-subtle bg-surface-raised"
        }`}
        aria-hidden="true"
      />
      <div className="pb-8">
        <div className="mb-1 flex flex-wrap items-center gap-2">
          <Icon size={14} className="text-accent" aria-hidden="true" />
          <h3 className="text-sm font-semibold text-slate-50">{title}</h3>
          {inProgress && (
            <span className="rounded-full bg-accent/20 px-2.5 py-0.5 font-mono text-[10px] font-semibold uppercase tracking-wider text-accent">
              In Progress
            </span>
          )}
        </div>
        <p className="mb-1 text-xs text-text-muted">
          {org} · {date}
        </p>
        <p className="text-sm leading-relaxed text-text-secondary">{detail}</p>
      </div>
    </li>
  );
}

/* ── Education ──────────────────────────────────────────────── */
function Education() {
  return (
    <Section id="education" label="Education" className="pb-4 md:pb-6">
      <SectionHeading>Education</SectionHeading>
      <ol className="relative max-w-2xl" role="list">
        {EDUCATION.map((item) => (
          <TimelineItem key={item.title} icon={GraduationCap} {...item} />
        ))}
      </ol>
    </Section>
  );
}

/* ── Certifications ─────────────────────────────────────────── */
function Certifications() {
  return (
    <Section id="certifications" label="Certifications" className="pt-6 md:pt-8">
      <SectionHeading>Certifications</SectionHeading>
      <ol className="relative max-w-2xl" role="list">
        {CERTIFICATIONS.map((item) => (
          <TimelineItem key={item.title} icon={Award} {...item} />
        ))}
      </ol>
    </Section>
  );
}

/* ── PGP Key toggle ─────────────────────────────────────────── */
function PGPBlock() {
  const [show, setShow] = useState(false);
  const [copied, setCopied] = useState(false);
  const preRef = useRef(null);

  const handleCopy = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(PGP_KEY);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      /* fallback */
      if (preRef.current) {
        const range = document.createRange();
        range.selectNodeContents(preRef.current);
        window.getSelection()?.removeAllRanges();
        window.getSelection()?.addRange(range);
      }
    }
  }, []);

  return (
    <div className="mt-6">
      <button
        onClick={() => setShow((prev) => !prev)}
        className="inline-flex items-center gap-2 rounded-md border border-border-subtle px-4 py-2 font-mono text-xs text-text-secondary transition-all duration-200 hover:border-accent hover:text-accent"
        aria-expanded={show}
        aria-controls="pgp-block"
      >
        <Lock size={14} aria-hidden="true" />
        {show ? "Hide" : "Show"} PGP Public Key
        {show ? (
          <ChevronUp size={14} aria-hidden="true" />
        ) : (
          <ChevronDown size={14} aria-hidden="true" />
        )}
      </button>

      {show && (
        <div
          id="pgp-block"
          className="relative mt-3 overflow-hidden rounded-lg border border-border-subtle bg-surface-raised"
        >
          <div className="flex items-center justify-between border-b border-border-subtle px-4 py-2">
            <span className="flex items-center gap-2 font-mono text-xs text-text-muted">
              <Terminal size={12} aria-hidden="true" />
              pgp-public-key.asc
            </span>
            <button
              onClick={handleCopy}
              className="inline-flex items-center gap-1.5 rounded px-2 py-1 text-xs text-text-muted transition-colors hover:text-accent"
              aria-label="Copy PGP key to clipboard"
            >
              {copied ? (
                <>
                  <Check size={12} aria-hidden="true" /> Copied
                </>
              ) : (
                <>
                  <Copy size={12} aria-hidden="true" /> Copy
                </>
              )}
            </button>
          </div>
          <pre
            ref={preRef}
            className="overflow-x-auto px-4 py-4 font-mono text-xs leading-relaxed text-text-secondary"
          >
            {PGP_KEY}
          </pre>
        </div>
      )}
    </div>
  );
}

/* ── Contact / Footer ───────────────────────────────────────── */
function Contact() {
  const links = [
    {
      href: `mailto:${PROFILE.email}`,
      icon: Mail,
      label: PROFILE.email,
      ariaLabel: "Send email",
    },
    {
      href: PROFILE.linkedin,
      icon: Linkedin,
      label: "LinkedIn",
      ariaLabel: "Visit LinkedIn profile (opens in new tab)",
      external: true,
    },
    {
      href: PROFILE.github,
      icon: Github,
      label: "GitHub",
      ariaLabel: "Visit GitHub profile (opens in new tab)",
      external: true,
    },
  ];

  return (
    <Section id="contact" label="Contact information">
      <SectionHeading>Trust &amp; Contact</SectionHeading>

      <p className="mb-6 max-w-xl text-sm leading-relaxed text-text-secondary">
        Interested in collaborating on security research, discussing threat
        landscapes, or just want to connect? Reach out through any of the
        channels below. For sensitive communications, please use my PGP key.
      </p>

      <ul className="flex flex-wrap gap-3" role="list">
        {links.map(({ href, icon: Icon, label, ariaLabel, external }) => (
          <li key={label}>
            <a
              href={href}
              {...(external
                ? { target: "_blank", rel: "noopener noreferrer" }
                : {})}
              className="inline-flex items-center gap-2 rounded-md border border-border-subtle bg-surface-raised px-4 py-2.5 text-sm font-medium text-text-primary transition-colors hover:border-accent hover:text-accent"
              aria-label={ariaLabel}
            >
              <Icon size={16} aria-hidden="true" />
              {label}
            </a>
          </li>
        ))}
      </ul>

      <PGPBlock />
    </Section>
  );
}

function Footer() {
  return (
    <footer
      role="contentinfo"
      className="border-t border-border-subtle py-6 text-center"
    >
      <p className="font-mono text-xs text-text-muted">
        &copy; {new Date().getFullYear()} {PROFILE.name} · Built with React
        &amp; Tailwind CSS
      </p>
    </footer>
  );
}

/* ════════════════════════════════════════════════════════════════
   APP
   ════════════════════════════════════════════════════════════════ */

export default function App() {
  return (
    <>
      <a
        href="#hero"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[100] focus:rounded focus:bg-accent focus:px-4 focus:py-2 focus:text-sm focus:font-medium focus:text-surface"
      >
        Skip to main content
      </a>
      <Navbar />
      <main>
        <Hero />
        <About />
        <Skills />
        <Projects />
        <Education />
        <Certifications />
        <Contact />
      </main>
      <Footer />
    </>
  );
}
