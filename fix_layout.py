import re

with open("src/app/components/HomeClient.tsx", "r") as f:
    content = f.read()

# We will replace each section to use a flex layout:
# <div className="w-full max-w-[1300px] mx-auto flex flex-col xl:flex-row xl:gap-12 items-start justify-end">
#   <div className="w-full xl:w-[340px] flex-shrink-0 hidden xl:block"></div>
#   <div className="w-full max-w-4xl"> ... </div>
# </div>

# About
about_orig = """          <section id="about" className="section about-section relative py-[180px]">
            <SectionHeading title="About" label="Background & focus" className="max-w-4xl mx-auto" />
            <div className="relative max-w-4xl mx-auto">
              <div className="grid md:grid-cols-2 gap-12">
                <RevealOnScroll direction="left" className="relative">
                  <div className="relative lg:absolute lg:right-[100%] lg:mr-12 lg:top-0 flip-card w-[340px] h-[340px] mx-auto lg:mx-0 mb-6 lg:mb-0">
                    <div className="flip-card-inner h-full">
                      <div className="flip-card-front rounded-lg overflow-hidden border border-black/5 dark:border-white/10 bg-fog-bg dark:bg-graphite-bg">
                        <img
                          src="/football.jpeg"
                          alt="Playing football"
                          className="w-full h-full object-contain"
                          style={{ objectPosition: "right center", filter: "grayscale(85%)" }}
                        />
                      </div>
                      <div className="flip-card-back rounded-lg overflow-hidden border border-black/5 dark:border-white/10 bg-fog-bg dark:bg-graphite-bg">
                        <img
                          src="/anime_.jpeg"
                          alt="Anime"
                          className="w-full h-full object-contain"
                          style={{ objectPosition: "right center", filter: "grayscale(85%)" }}
                        />
                      </div>
                    </div>
                  </div>

                  <div className="lg:flex lg:flex-col lg:min-h-[340px]">
                    <p className="text-body text-ebony-text/70 dark:text-white/50 leading-body measure mb-4 lg:mb-0">
                      I started in RF and signals. Turns out the most interesting signal to decode is language.
                      Now I build the systems that do both — from transformers to multi-agent pipelines to LLM-controlled hardware.
                    </p>
                    <div className="hidden lg:block flex-1" />
                    <p className="text-body text-ebony-text/70 dark:text-white/50 leading-body measure">
                      B.Tech — Electronics & Telecom Engineering at SGGSIE&T, Nanded (2023–Present).
                    </p>
                  </div>
                </RevealOnScroll>

                <RevealOnScroll direction="right">
                  <h3 className="text-subheading text-ebony-text leading-subheading font-medium mb-16">
                    Achievements
                  </h3>
                  <ul className="space-y-5 about-achievements">"""

about_new = """          <section id="about" className="section about-section relative py-[180px]">
            <div className="w-full max-w-[1300px] mx-auto flex flex-col xl:flex-row xl:gap-12 items-start justify-end">
              <div className="w-full xl:w-[340px] flex-shrink-0 mb-12 xl:mb-0 flex justify-center xl:justify-start">
                <RevealOnScroll direction="left">
                  <div className="flip-card w-[340px] h-[340px]">
                    <div className="flip-card-inner h-full">
                      <div className="flip-card-front rounded-lg overflow-hidden border border-black/5 dark:border-white/10 bg-fog-bg dark:bg-graphite-bg">
                        <img
                          src="/football.jpeg"
                          alt="Playing football"
                          className="w-full h-full object-contain"
                          style={{ objectPosition: "right center", filter: "grayscale(85%)" }}
                        />
                      </div>
                      <div className="flip-card-back rounded-lg overflow-hidden border border-black/5 dark:border-white/10 bg-fog-bg dark:bg-graphite-bg">
                        <img
                          src="/anime_.jpeg"
                          alt="Anime"
                          className="w-full h-full object-contain"
                          style={{ objectPosition: "right center", filter: "grayscale(85%)" }}
                        />
                      </div>
                    </div>
                  </div>
                </RevealOnScroll>
              </div>

              <div className="w-full max-w-4xl relative">
                <SectionHeading title="About" label="Background & focus" />
                <div className="grid md:grid-cols-2 gap-12 mt-12">
                  <RevealOnScroll direction="bottom" className="lg:flex lg:flex-col lg:min-h-[340px]">
                    <p className="text-body text-ebony-text/70 dark:text-white/50 leading-body measure mb-4 lg:mb-0">
                      I started in RF and signals. Turns out the most interesting signal to decode is language.
                      Now I build the systems that do both — from transformers to multi-agent pipelines to LLM-controlled hardware.
                    </p>
                    <div className="hidden lg:block flex-1" />
                    <p className="text-body text-ebony-text/70 dark:text-white/50 leading-body measure">
                      B.Tech — Electronics & Telecom Engineering at SGGSIE&T, Nanded (2023–Present).
                    </p>
                  </RevealOnScroll>

                  <RevealOnScroll direction="right">
                    <h3 className="text-subheading text-ebony-text leading-subheading font-medium mb-16">
                      Achievements
                    </h3>
                    <ul className="space-y-5 about-achievements">"""

content = content.replace(about_orig, about_new)

# Experience
exp_orig = """          <section
            id="experience"
            ref={experienceRef}
            className="section experience-section relative"
          >
            <div className="experience-inner max-w-4xl mx-auto">
              <SectionHeading title="Experience" label="Research & engineering" />
              <ExperienceTrack entries={experienceEntries} />
            </div>
          </section>"""

exp_new = """          <section
            id="experience"
            ref={experienceRef}
            className="section experience-section relative"
          >
            <div className="w-full max-w-[1300px] mx-auto flex flex-col xl:flex-row xl:gap-12 items-start justify-end">
              <div className="w-full xl:w-[340px] flex-shrink-0 hidden xl:block"></div>
              <div className="w-full max-w-4xl experience-inner">
                <SectionHeading title="Experience" label="Research & engineering" />
                <ExperienceTrack entries={experienceEntries} />
              </div>
            </div>
          </section>"""
content = content.replace(exp_orig, exp_new)

# Research
res_orig = """          <section id="research" className="section research-section py-[180px]">
            <div className="research-inner">
              <SectionHeading
                title="Research"
                label="Papers & interests"
              />
              <RevealOnScroll direction="bottom">
                <p className="research-intro">
                  Reading and building on foundational ML research. Here are papers that shaped my thinking.
                </p>
              </RevealOnScroll>
            </div>
            <div className="research-marquee-outer">
              <ResearchMarquee />
            </div>
          </section>"""

res_new = """          <section id="research" className="section research-section py-[180px]">
            <div className="w-full max-w-[1300px] mx-auto flex flex-col xl:flex-row xl:gap-12 items-start justify-end">
              <div className="w-full xl:w-[340px] flex-shrink-0 hidden xl:block"></div>
              <div className="w-full max-w-4xl research-inner">
                <SectionHeading
                  title="Research"
                  label="Papers & interests"
                />
                <RevealOnScroll direction="bottom">
                  <p className="research-intro mt-12 mb-8">
                    Reading and building on foundational ML research. Here are papers that shaped my thinking.
                  </p>
                </RevealOnScroll>
              </div>
            </div>
            <div className="w-full max-w-[1300px] mx-auto flex flex-col xl:flex-row xl:gap-12 items-start justify-end">
              <div className="w-full xl:w-[340px] flex-shrink-0 hidden xl:block"></div>
              <div className="w-full max-w-4xl research-marquee-outer">
                <ResearchMarquee />
              </div>
            </div>
          </section>"""
content = content.replace(res_orig, res_new)

# Contact
cont_orig = """          <section id="contact" className="section contact-section">
            <SectionHeading title="Contact" label="Get in touch" className="max-w-4xl mx-auto" />
            <RevealOnScroll direction="bottom">
              <div className="contact-content max-w-4xl mx-auto">"""

cont_new = """          <section id="contact" className="section contact-section">
            <div className="w-full max-w-[1300px] mx-auto flex flex-col xl:flex-row xl:gap-12 items-start justify-end">
              <div className="w-full xl:w-[340px] flex-shrink-0 hidden xl:block"></div>
              <div className="w-full max-w-4xl">
                <SectionHeading title="Contact" label="Get in touch" />
                <RevealOnScroll direction="bottom">
                  <div className="contact-content mt-12">"""
content = content.replace(cont_orig, cont_new)

cont_end_orig = """                </div>
              </div>
            </RevealOnScroll>
          </section>"""

cont_end_new = """                  </div>
                </RevealOnScroll>
              </div>
            </div>
          </section>"""
content = content.replace(cont_end_orig, cont_end_new)

with open("src/app/components/HomeClient.tsx", "w") as f:
    f.write(content)
