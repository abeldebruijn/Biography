type ExperienceItem = {
  title: string;
  period: string;
  summary: string;
  link?: { href: string; label: string };
  projects?: Array<{
    title: string;
    period: string;
    summary: string;
    link?: { href: string; label: string };
  }>;
};

type EducationItem = {
  title: string;
  period: string;
  summary?: string;
  details?: string[];
  link?: { href: string; label: string };
};

type SimpleItem = {
  title: string;
  period?: string;
  summary: string;
  link?: { href: string; label: string };
};

const contactLinks = [
  { label: "GitHub", href: "https://github.com/abeldebruijn" },
  { label: "LinkedIn", href: "https://linkedin.com/in/abeldebruijn" },
] as const;

const profile =
  "Full-stack developer experienced with frameworks such as Next.js and SvelteKit. I specialize in graphics computations using WebGPU, WebGL, and Three.js. Currently, I am experimenting with AI and LLM tools.";

const experience: ExperienceItem[] = [
  {
    title: "InKaart.nu",
    period: "2026",
    summary: `Built an AI-assisted workflow for ecology inspection forms in construction projects. As of January 2024, it is mandatory to inspect the surrounding flora and fauna before starting a
construction project. Inspectors conduct these inspections on foot, recording any sightings of
endangered species with a form. This form includes many project-specific elements, however some
are static and consist mainly of legal wording. To create a new form quickly, the previous form is
cloned and updated with the latest information. This updating process uses AI, instructing the tool to
update only the necessary parts; without manipulating the static elements.`,
  },
  {
    title: "PRIME (TU Delft)",
    period: "2021-2025",
    summary:
      "The goal of PRIME (PRogramme of Innovation and Math Education) is to teach fundamental mathematics to engineering students. The teams consist primarily of lecturers teaching first-year students at TUDelft. My aim is to enhance their lectures by providing interactive tools that help students better understand the abstract material. The following three projects highlight my contributions.Contributed interactive tools to help engineering students understand abstract mathematics in first-year courses.",
    projects: [
      {
        title: "Open Linear Algebra Book",
        period: "2021-2025",
        summary:
          "Developed interactive applets for an open-source linear algebra textbook, translating abstract concepts into visual and hands-on learning experiences.",
        link: {
          href: "https://openla.ewi.tudelft.nl/applet",
          label: "openla.ewi.tudelft.nl/applet",
        },
      },
      {
        title: "Project Graph",
        period: "2025",
        summary:
          "Created a visualization of course structure and topic dependencies so students can see prerequisite knowledge and subject progression across lectures.",
      },
      {
        title: "Augmented Reality Game: LavaFlow",
        period: "2021-2022",
        summary:
          "Built major front-end parts of the game for the Interactive Visual Computing course, including state management, navigation, and 3D UI components.",
        link: {
          href: "https://lava.ewi.tudelft.nl/",
          label: "lava.ewi.tudelft.nl",
        },
      },
    ],
  },
  {
    title: "Open Summer of Code Belgium",
    period: "2022",
    summary:
      'Handled front-end development for the "Powerful Personal Data" project, creating a web3 use case that used personal and publicly linked data through Solid Pods.',
    link: {
      href: "https://osoc.be/editions/2022/powerful-personal-data",
      label: "osoc.be/editions/2022/powerful-personal-data",
    },
  },
];

const education: EducationItem[] = [
  {
    title: "MSc Computer Science, Delft University of Technology",
    period: "2023-2026 (January)",
    details: [
      "Master Thesis: Interactive line manipulation (2025)",
      "Explored methods for line selection that balance efficiency, accuracy, and human interpretability in large-scale datasets.",
    ],
    link: {
      href: "https://repository.tudelft.nl/islandora/object/uuid%3A40f1743c-a5b3-4429-886b-c881536f4e26",
      label:
        "repository.tudelft.nl/record/uuid:40f1743c-a5b3-4429-886b-c881536f4e26",
    },
  },
  {
    title:
      "BSc Computer Science and Engineering, Delft University of Technology",
    period: "2019-2023",
    details: [
      "Minor in Architecture (Heritage and Design)",
      "Bachelor Thesis: 3D random walkers (2023)",
      "Investigated emergent patterns in two-species bacterial movement in 3D, using Three.js and SvelteKit.",
    ],
    link: {
      href: "https://repository.tudelft.nl/islandora/object/uuid%3Ab11dbf3-6aa4-44ae-9ede-f6eb84be1b59",
      label:
        "repository.tudelft.nl/record/uuid:b11dbf3-6aa4-44ae-9ede-f6eb84be1b59",
    },
  },
];

const conferences: SimpleItem[] = [
  {
    title: "Web3D SIGGRAPH",
    period: "2023",
    summary:
      "Presented a poster on LavaFlow, focused on the development process and technologies used.",
    link: { href: "https://web3d.siggraph.org/", label: "web3d.siggraph.org" },
  },
  {
    title: "Mini Symposium: Mathematics and Art",
    period: "2023",
    summary:
      "Presented a talk on how interactive design can be used to teach mathematics.",
    link: {
      href: "https://www.tu-ilmenau.de/dmv2023/program/minisymposia/",
      label: "tu-ilmenau.de/dmv2023/program/minisymposia",
    },
  },
];

const hobbies: SimpleItem[] = [
  {
    title: "(Competitive) Rowing",
    period: "2013-2024",
    summary:
      "Started rowing in 2013 and later joined the lightweight competitive team at Proteus-Eretes. In 2024, I moved to a club-eight year.",
  },
  {
    title: "Cooking",
    summary:
      "I enjoy spending full days in the kitchen, learning new dishes and sharing them with friends and family. Right now I am perfecting palak paneer.",
  },
  {
    title: "Home Automation",
    summary:
      "Built a comfort-driven home setup with smart lights, phone/voice controls, and event-triggered automations for day-to-day routines.",
  },
];

const sectionTitleClass =
  "font-(family-name:--font-cormorant) text-[clamp(1.7rem,3vw,2.35rem)] tracking-[0.01em] text-[#edf4ff]";

function ExternalLink({ href, label }: { href: string; label: string }) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noreferrer"
      className="text-[#9eceff] underline decoration-[#9eceff]/45 underline-offset-4 transition-colors hover:text-[#c8e4ff]"
    >
      {label}
    </a>
  );
}

export function CV() {
  return (
    <section
      id="cv"
      className="relative z-20 mx-auto w-full max-w-5xl px-4 pb-16 pt-10 sm:px-8 sm:pt-16"
    >
      <div className="animate-hero-enter rounded-4xl border border-[#9eceff]/30 bg-[#091426]/72 p-6 shadow-[0_18px_80px_rgba(0,0,0,0.38)] backdrop-blur-lg sm:p-10">
        <div className="grid gap-8 border-b border-[#9eceff]/20 pb-8 md:grid-cols-[1.25fr_0.75fr]">
          <div>
            <p className="text-xs uppercase tracking-[0.24em] text-[#b7cbe6]/80">
              Curriculum Vitae
            </p>
            <h2 className="mt-2 font-(family-name:--font-cormorant) text-[clamp(2.3rem,7vw,4.2rem)] leading-[0.92] text-[#edf4ff]">
              Abel de Bruijn
            </h2>
            <p className="mt-5 max-w-2xl text-sm leading-relaxed text-[#d8e7fb]/92 sm:text-base">
              {profile}
            </p>
          </div>

          <div className="space-y-3 rounded-3xl border border-[#9eceff]/20 bg-[#0d1f36]/70 p-5 text-sm text-[#d8e7fb]">
            <p>
              <span className="text-[#9eceff]">Date of Birth:</span> 19-01-2000
            </p>
            <p>
              <span className="text-[#9eceff]">Location:</span> The Netherlands
            </p>
            <div className="pt-2">
              {contactLinks.map((contact) => (
                <p key={contact.href} className="py-1">
                  <ExternalLink href={contact.href} label={contact.label} />
                </p>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-8 space-y-10">
          <section aria-labelledby="experience-heading">
            <h3 id="experience-heading" className={sectionTitleClass}>
              Experience
            </h3>
            <div className="mt-4 space-y-5">
              {experience.map((item) => (
                <article
                  key={`${item.title}-${item.period}`}
                  className="rounded-3xl border border-[#9eceff]/16 bg-[#0c1d32]/66 p-5"
                >
                  <p className="text-xs uppercase tracking-[0.2em] text-[#9eceff]/80">
                    {item.period}
                  </p>
                  <h4 className="mt-1 text-lg font-semibold text-[#eef4ff]">
                    {item.title}
                  </h4>
                  <p className="mt-3 text-sm leading-relaxed text-[#d7e5f7]/92 sm:text-base">
                    {item.summary}
                  </p>
                  {item.link ? (
                    <p className="mt-2 text-sm">
                      <ExternalLink
                        href={item.link.href}
                        label={item.link.label}
                      />
                    </p>
                  ) : null}

                  {item.projects?.length ? (
                    <div className="mt-4 space-y-6 border-l border-[#9eceff]/20 pl-4 py-2">
                      {item.projects.map((project) => (
                        <article key={`${project.title}-${project.period}`}>
                          <p className="text-xs uppercase tracking-[0.2em] text-[#9eceff]/65">
                            {project.period}
                          </p>
                          <h5 className="text-base font-semibold text-[#e8f2ff]">
                            {project.title}
                          </h5>
                          <p className="mt-1 text-sm leading-relaxed text-[#d0e2f8]/90">
                            {project.summary}
                          </p>
                          {project.link ? (
                            <p className="mt-1 text-sm">
                              <ExternalLink
                                href={project.link.href}
                                label={project.link.label}
                              />
                            </p>
                          ) : null}
                        </article>
                      ))}
                    </div>
                  ) : null}
                </article>
              ))}
            </div>
          </section>

          <section aria-labelledby="education-heading">
            <h3 id="education-heading" className={sectionTitleClass}>
              Education
            </h3>
            <div className="mt-4 space-y-5">
              {education.map((item) => (
                <article
                  key={`${item.title}-${item.period}`}
                  className="rounded-3xl border border-[#9eceff]/16 bg-[#0c1d32]/66 p-5"
                >
                  <p className="text-xs uppercase tracking-[0.2em] text-[#9eceff]/80">
                    {item.period}
                  </p>
                  <h4 className="mt-1 text-lg font-semibold text-[#eef4ff]">
                    {item.title}
                  </h4>
                  {item.summary ? (
                    <p className="mt-3 text-sm leading-relaxed text-[#d7e5f7]/92 sm:text-base">
                      {item.summary}
                    </p>
                  ) : null}
                  {item.details?.length ? (
                    <div className="mt-3 space-y-2 text-sm leading-relaxed text-[#d7e5f7]/92 sm:text-base">
                      {item.details.map((detail) => (
                        <p key={detail}>{detail}</p>
                      ))}
                    </div>
                  ) : null}
                  {item.link ? (
                    <p className="mt-3 text-sm">
                      Paper:{" "}
                      <ExternalLink
                        href={item.link.href}
                        label={item.link.label}
                      />
                    </p>
                  ) : null}
                </article>
              ))}
            </div>
          </section>

          <section aria-labelledby="conferences-heading">
            <h3 id="conferences-heading" className={sectionTitleClass}>
              Conferences
            </h3>
            <div className="mt-4 grid gap-4 md:grid-cols-2">
              {conferences.map((item) => (
                <article
                  key={`${item.title}-${item.period}`}
                  className="rounded-3xl border border-[#9eceff]/16 bg-[#0c1d32]/66 p-5"
                >
                  <p className="text-xs uppercase tracking-[0.2em] text-[#9eceff]/80">
                    {item.period}
                  </p>
                  <h4 className="mt-1 text-lg font-semibold text-[#eef4ff]">
                    {item.title}
                  </h4>
                  <p className="mt-3 text-sm leading-relaxed text-[#d7e5f7]/92 sm:text-base">
                    {item.summary}
                  </p>
                  {item.link ? (
                    <p className="mt-2 text-sm">
                      <ExternalLink
                        href={item.link.href}
                        label={item.link.label}
                      />
                    </p>
                  ) : null}
                </article>
              ))}
            </div>
          </section>

          <section aria-labelledby="hobbies-heading">
            <h3 id="hobbies-heading" className={sectionTitleClass}>
              Hobbies
            </h3>
            <div className="mt-4 grid gap-4 md:grid-cols-3">
              {hobbies.map((item) => (
                <article
                  key={item.title}
                  className="rounded-3xl border border-[#9eceff]/16 bg-[#0c1d32]/66 p-5"
                >
                  {item.period ? (
                    <p className="text-xs uppercase tracking-[0.2em] text-[#9eceff]/80">
                      {item.period}
                    </p>
                  ) : null}
                  <h4 className="mt-1 text-lg font-semibold text-[#eef4ff]">
                    {item.title}
                  </h4>
                  <p className="mt-3 text-sm leading-relaxed text-[#d7e5f7]/92 sm:text-base">
                    {item.summary}
                  </p>
                </article>
              ))}
            </div>
          </section>
        </div>
      </div>
    </section>
  );
}

export default CV;
