Repository: gyaanendra/dev-portfolio
Files analyzed: 18

Estimated tokens: 17.3k

Directory structure:
└── gyaanendra-dev-portfolio/
    ├── README.md
    ├── astro.config.mjs
    ├── package.json
    ├── tsconfig.json
    ├── public/
    │   └── images/
    │       ├── achievements/
    │       ├── images/
    │       │   └── blog/
    │       │       ├── announcing-dev-keys/
    │       │       └── self-hosting-appwrite-with-coolify/
    │       ├── projects/
    │       └── work-experience/
    └── src/
        ├── components/
        │   ├── About.astro
        │   ├── Achievements.jsx
        │   ├── Clubs.astro
        │   ├── Contact.astro
        │   ├── Education.astro
        │   ├── Hero.astro
        │   ├── Projects.astro
        │   ├── Skills.astro
        │   └── Work.astro
        ├── data/
        │   ├── data.json
        │   └── skills.json
        ├── layouts/
        │   └── Layout.astro
        ├── pages/
        │   └── index.astro
        └── styles/
            └── global.css


================================================
FILE: README.md
================================================
# Astro Starter Kit: Basics

```sh
npm create astro@latest -- --template basics
```

[![Open in StackBlitz](https://developer.stackblitz.com/img/open_in_stackblitz.svg)](https://stackblitz.com/github/withastro/astro/tree/latest/examples/basics)
[![Open with CodeSandbox](https://assets.codesandbox.io/github/button-edit-lime.svg)](https://codesandbox.io/p/sandbox/github/withastro/astro/tree/latest/examples/basics)
[![Open in GitHub Codespaces](https://github.com/codespaces/badge.svg)](https://codespaces.new/withastro/astro?devcontainer_path=.devcontainer/basics/devcontainer.json)

> 🧑‍🚀 **Seasoned astronaut?** Delete this file. Have fun!

![port](image.png)

## 🚀 Project Structure

Inside of your Astro project, you'll see the following folders and files:

```text
/
├── public/
│   └── favicon.svg
├── src
│   ├── assets
│   │   └── astro.svg
│   ├── components
│   │   └── Welcome.astro
│   ├── layouts
│   │   └── Layout.astro
│   └── pages
│       └── index.astro
└── package.json
```

To learn more about the folder structure of an Astro project, refer to [our guide on project structure](https://docs.astro.build/en/basics/project-structure/).

## 🧞 Commands

All commands are run from the root of the project, from a terminal:

| Command                   | Action                                           |
| :------------------------ | :----------------------------------------------- |
| `npm install`             | Installs dependencies                            |
| `npm run dev`             | Starts local dev server at `localhost:4321`      |
| `npm run build`           | Build your production site to `./dist/`          |
| `npm run preview`         | Preview your build locally, before deploying     |
| `npm run astro ...`       | Run CLI commands like `astro add`, `astro check` |
| `npm run astro -- --help` | Get help using the Astro CLI                     |

## 👀 Want to learn more?

Feel free to check [our documentation](https://docs.astro.build) or jump into our [Discord server](https://astro.build/chat).



================================================
FILE: astro.config.mjs
================================================
// @ts-check
import { defineConfig } from 'astro/config';

import tailwindcss from '@tailwindcss/vite';

import react from '@astrojs/react';

// https://astro.build/config
export default defineConfig({
  vite: {
    plugins: [tailwindcss()]
  },

  integrations: [react()]
});


================================================
FILE: package.json
================================================
{
  "name": "devportfolio",
  "type": "module",
  "version": "0.0.1",
  "scripts": {
    "dev": "astro dev",
    "build": "astro build",
    "preview": "astro preview",
    "astro": "astro"
  },
  "dependencies": {
    "@astrojs/react": "^4.3.0",
    "@lucide/astro": "^0.525.0",
    "@tailwindcss/vite": "^4.1.11",
    "@types/react": "^19.1.8",
    "@types/react-dom": "^19.1.6",
    "astro": "^5.12.0",
    "lucide-astro": "^0.525.0",
    "react": "^19.1.0",
    "react-dom": "^19.1.0",
    "react-icons": "^5.5.0",
    "remark": "^15.0.1",
    "remark-html": "^16.0.1",
    "tailwindcss": "^4.1.11"
  }
}



================================================
FILE: tsconfig.json
================================================
{
  "extends": "astro/tsconfigs/strict",
  "include": [".astro/types.d.ts", "**/*"],
  "exclude": ["dist"],
  "compilerOptions": {
    "jsx": "react-jsx",
    "jsxImportSource": "react"
  }
}








================================================
FILE: src/components/About.astro
================================================
---
import { remark } from 'remark';
import html from 'remark-html';
import { FileText } from "lucide-astro";
const {summary} = Astro.props
const processedSummary= await remark()
  .use(html)
  .process(summary);
---
<div class="flex gap-y-1 flex-col">
   <h2 class="text-4xl font-bold ">About</h2>
      <p class="prose max-w-full text-pretty font-sans text-sm text-muted-foreground dark:prose-invert">
         <div  set:html={processedSummary} />
      </p>
      <div class="flex items-center justify-end mt-4 ">
      <a href="/resume.pdf" target="_blank"  >
      <button type="button" class="text-gray-900 bg-white border border-gray-300 focus:outline-none hover:bg-gray-100 focus:ring-4 focus:ring-gray-100 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 flex gap-1">Download Resume <FileText size={18} /></button>
      </a>
   </div>
</div>


================================================
FILE: src/components/Achievements.jsx
================================================
// src/components/AchievementsCarousel.jsx
import { useState, useEffect } from "react";

const AchievementsCarousel = ({ achievements }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);

  // Auto-play functionality - runs infinitely
  useEffect(() => {
    if (!isAutoPlaying || !achievements || achievements.length === 0) return;

    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % achievements.length);
    }, 3200);

    return () => clearInterval(interval);
  }, [isAutoPlaying, achievements?.length]);

  const goToSlide = (index) => {
    setCurrentIndex(index);
  };

  const nextSlide = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % achievements.length);
  };

  const prevSlide = () => {
    setCurrentIndex(
      (prevIndex) => (prevIndex - 1 + achievements.length) % achievements.length
    );
  };

  const handleMouseEnter = () => {
    setIsAutoPlaying(false);
  };

  const handleMouseLeave = () => {
    setIsAutoPlaying(true);
  };

  // Guard clause for empty achievements
  if (!achievements || achievements.length === 0) {
    return (
      <div className="relative w-full">
        <div className="space-y-12 w-full py-12">
          <div className="flex flex-col items-center justify-center space-y-4 text-center">
            <div className="space-y-2">
              <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl">
                Achievements
              </h2>
              <p className="text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                No achievements to display yet.
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="relative w-full">
      <div className="space-y-12 w-full py-12">
        <div className="flex flex-col items-center justify-center space-y-4 text-center">
          <div className="space-y-2">
            <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl">
              Achievements
            </h2>
            <p className="text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
              During my time in university, I attended 4 hackathons. I like to
              keep exploring and learning new things.
            </p>
          </div>
        </div>
      </div>

      {/* Carousel wrapper */}
      <div
        className="relative h-56 overflow-hidden rounded-lg md:h-96"
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        {achievements.map((achievement, index) => (
          <div
            key={index}
            className={`absolute inset-0 transition-opacity duration-700 ease-in-out ${
              index === currentIndex ? "opacity-100" : "opacity-0"
            }`}
          >
            <img
              src={achievement.image}
              className="absolute block w-full h-full object-cover -translate-x-1/2 -translate-y-1/2 top-1/2 left-1/2"
              alt={achievement.title}
            />
            {/* Overlay with achievement info */}
            <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-6">
              <h3 className="text-white text-xl font-bold mb-1">
                {achievement.title}
              </h3>
              <p className="text-white/90 text-sm mb-1">{achievement.dates}</p>
              <p className="text-white/75 text-sm">{achievement.location}</p>
            </div>
          </div>
        ))}

        {/* Previous button - positioned within carousel */}
        <button
          type="button"
          className="absolute top-1/2 left-4 -translate-y-1/2 z-30 flex items-center justify-center cursor-pointer group focus:outline-none"
          onClick={prevSlide}
          aria-label="Previous slide"
        >
          <span className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-white/30 backdrop-blur-sm group-hover:bg-white/50 group-focus:ring-4 group-focus:ring-white/50 group-focus:outline-none transition-all duration-300">
            <svg
              className="w-4 h-4 text-white"
              aria-hidden="true"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 6 10"
            >
              <path
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M5 1 1 5l4 4"
              />
            </svg>
          </span>
        </button>

        {/* Next button - positioned within carousel */}
        <button
          type="button"
          className="absolute top-1/2 right-4 -translate-y-1/2 z-30 flex items-center justify-center cursor-pointer group focus:outline-none"
          onClick={nextSlide}
          aria-label="Next slide"
        >
          <span className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-white/30 backdrop-blur-sm group-hover:bg-white/50 group-focus:ring-4 group-focus:ring-white/50 group-focus:outline-none transition-all duration-300">
            <svg
              className="w-4 h-4 text-white"
              aria-hidden="true"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 6 10"
            >
              <path
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="m1 9 4-4-4-4"
              />
            </svg>
          </span>
        </button>

        {/* Slider indicators - positioned within carousel */}
        <div className="absolute z-30 flex -translate-x-1/2 bottom-5 left-1/2 space-x-3">
          {achievements.map((_, index) => (
            <button
              key={index}
              type="button"
              className={`w-3 h-3 rounded-full transition-all duration-300 ${
                index === currentIndex
                  ? "bg-white"
                  : "bg-white/50 hover:bg-white/75"
              }`}
              aria-current={index === currentIndex ? "true" : "false"}
              aria-label={`Slide ${index + 1}`}
              onClick={() => goToSlide(index)}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default AchievementsCarousel;



================================================
FILE: src/components/Clubs.astro
================================================
---

---

<div class="space-y-12 w-full py-12">
   <div class="flex flex-col items-center justify-center space-y-4 text-center">
      <div class="space-y-2">
         <h2 class="text-3xl font-bold tracking-tighter sm:text-5xl">
         Positions of Responsibility
         </h2>
         <p class="text-muted-foreground md:text-base/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
         I believe in the power of collaboration and teamwork. So I
         like to keep myself busy while working in different
         <span class="font-bold"> communities</span> and{" "}
         <span class="font-bold">projects</span>. Here are some of
         the positions I have held.
         </p>
      </div>
   </div>


================================================
FILE: src/components/Contact.astro
================================================
<!-- component -->
<div class="relative flex items-top justify-center min-h-screen bg-white  sm:items-center sm:pt-0">
        <div class="max-w-2xl mx-auto sm:px-6 lg:px-8">
            <div class="mt-8 overflow-hidden">
                <div class="grid grid-cols-1 md:grid-cols-2">
                    <div class="p-6 mr-2 bg-gray-100  sm:rounded-lg">
                        <h1 class="text-4xl sm:text-5xl text-gray-800  font-extrabold tracking-tight">
                            Get in touch
                        </h1>
                        <p class="text-normal text-lg sm:text-2xl font-medium text-gray-600  mt-2">
                            Fill in the form to start a conversation
                        </p>

                        <div class="flex items-center mt-8 text-gray-600 ">
                            <svg fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" viewBox="0 0 24 24" class="w-8 h-8 text-gray-500">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"/>
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"/>
                            </svg>
                            <div class="ml-4 text-md tracking-wide font-semibold w-40">
                                Acme Inc, Street, State,
                                Postal Code
                            </div>
                        </div>

                        <div class="flex items-center mt-4 text-gray-600 ">
                            <svg fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" viewBox="0 0 24 24" class="w-8 h-8 text-gray-500">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"/>
                            </svg>
                            <div class="ml-4 text-md tracking-wide font-semibold w-40">
                                +44 1234567890
                            </div>
                        </div>

                        <div class="flex items-center mt-2 text-gray-600 ">
                            <svg fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" viewBox="0 0 24 24" class="w-8 h-8 text-gray-500">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/>
                            </svg>
                            <div class="ml-4 text-md tracking-wide font-semibold w-40">
                                info@acme.org
                            </div>
                        </div>
                    </div>

                    <form class="p-6 flex flex-col justify-center">
                        <div class="flex flex-col">
                            <label for="name" class="hidden">Full Name</label>
                            <input type="text" name="name" id="name" placeholder="Full Name" class="w-100 mt-2 py-3 px-3 rounded-lg bg-white  border border-gray-400  text-gray-800 font-semibold focus:border-indigo-500 focus:outline-none">
                        </div>

                        <div class="flex flex-col mt-2">
                            <label for="email" class="hidden">Email</label>
                            <input type="email" name="email" id="email" placeholder="Email" class="w-100 mt-2 py-3 px-3 rounded-lg bg-white  border border-gray-400  text-gray-800 font-semibold focus:border-indigo-500 focus:outline-none">
                        </div>

                        <div class="flex flex-col mt-2">
                            <label for="tel" class="hidden">Number</label>
                            <input type="tel" name="tel" id="tel" placeholder="Telephone Number" class="w-100 mt-2 py-3 px-3 rounded-lg bg-white  border border-gray-400  text-gray-800 font-semibold focus:border-indigo-500 focus:outline-none">
                        </div>

                        <button type="submit" class="md:w-32 bg-indigo-600 hover:bg-blue-dark text-white font-bold py-3 px-6 rounded-lg mt-3 hover:bg-indigo-500 transition ease-in-out duration-300">
                            Submit
                        </button>
                    </form>
                </div>
            </div>
        </div>
    </div>


================================================
FILE: src/components/Education.astro
================================================
---
const {education} = Astro.props
---

<div class="flex min-h-0 min-w-0 w-full flex-col gap-y-3">
   <h2 class="text-3xl font-bold">Education</h2>
   {
      education.map((edu: any) => (
         <div class="block pointer-events-none py-1">
            <div class="rounded-lg bg-card text-card-foreground flex">
               <div class="flex-grow items-center flex-col group">
                  <div class="flex flex-col">
                     <div class="flex">
                        <span class="relative flex shrink-0 overflow-hidden rounded-full border border-gray-200 size-10 m-auto bg-muted-background  mr-4">
                           <img class="aspect-square h-full w-full object-contain" alt={edu.school} src={edu.logoUrl}>
                        </span>
                        <div class="w-full">
                           <div class="flex items-center justify-between gap-x-2 text-base">
                              <h3 class="inline-flex items-center justify-center font-semibold leading-none text-xs sm:text-sm">{edu.school}</h3>
                              <div class="text-xs sm:text-sm tabular-nums text-muted-foreground text-right mr-0">{edu.start} - {edu.end}</div>
                           </div>
                           <div class="text-xs">{edu.degree}</div>
                        </div>
                     </div>
                  </div>
               </div>
            </div>
         </div>
      ))
   }
</div>


================================================
FILE: src/components/Hero.astro
================================================
---

const {name , description , avatarUrl }  = Astro.props
---   
   
   
<div class="mx-auto w-full max-w-2xl space-y-2">
  <div class="gap-3 flex justify-between">
    <div class="flex-col flex flex-1 space-y-1.5">
      <h1 class="text-4xl font-bold tracking-tighter sm:text-5xl xl:text-6xl/none">
        {`Hi, I'm ${name.split(" ")[0]}`}
      </h1>
      <p class="max-w-[600px] md:text-xl">{description}</p>
    </div>
    <div class="size-44  hover:shadow-lg hover:shadow-foreground/20 transition-all duration-300 ease-in-out rounded-full overflow-hidden">
      <img alt={name} src={avatarUrl} class="" />
    </div>
  </div>
</div>


================================================
FILE: src/components/Projects.astro
================================================
---
---

<div class="space-y-12 w-full py-12">
   <div class="flex flex-col items-center justify-center space-y-4 text-center">
      <div class="space-y-2">
         <h2 class="text-3xl font-bold tracking-tighter sm:text-5xl">
         Projects
         </h2>
         <p class="text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
         I like to build projects. I have built a lot of projects, here
         are just some of my{" "}
         <span class="font-bold">favorites</span>.
         </p>
      </div>
   </div>
</div>


================================================
FILE: src/components/Skills.astro
================================================
---
const {skills} = Astro.props
---


<div class="flex min-h-0 min-w-0 w-full flex-col gap-y-3">
   <h2 class="text-3xl font-bold text-black">Skills</h2>
   <div class="flex flex-wrap gap-2 justify-center items-center">
      {
         skills.map((skill: any) => (
            <img 
               src={skill.url} 
               alt={skill.name}
               class="transition-transform hover:scale-105 border border-neutral-950"
            />
         ))
      }
   </div>
</div>


================================================
FILE: src/components/Work.astro
================================================
---
// WorkExperience.astro
const {work} = Astro.props

// Function to parse markdown-style bold text
import { remark } from 'remark';
import html from 'remark-html';

interface linkOBJ {
  type: string,
  href: string | URL | null | undefined
}
---

<div class="flex min-h-0 min-w-0 w-full flex-col gap-y-1">
  <h2 class="text-3xl font-bold text-gray-900">Work Experience</h2>
  
  <div class="space-y-3 divide-dashed divide-gray-200">
    {work.map((job: any, index: number) => (
      <div class="group overflow-hidden  bg-white">
        <!-- Hidden checkbox for state management -->
        <input type="checkbox" id={`accordion-${index}`} class="peer sr-only" />
        
        <!-- Accordion Header -->
        <label 
          for={`accordion-${index}`}
          class="block w-full px-4 py-4 cursor-pointer bg-white"
        >
          <div class="flex items-center gap-2">
            <div class="flex items-center space-x-4 flex-1 min-w-0 ">
              <div class="w-12 h-12 border border-gray-200 rounded-full flex items-center justify-center overflow-hidden">
                <img 
                  src={job.logoUrl} 
                  alt={`${job.company} logo`}
                  class="w-full h-full rounded-full object-cover"
                  onerror="this.style.display='none'; this.nextElementSibling.style.display='flex'"
                />
                <div class="w-full h-full  rounded-full text-black text-lg font-bold items-center justify-center hidden">
                  {job.company.charAt(0)}
                </div>
              </div>
               <div class="flex">

              <div class="flex-1 min-w-0">
                <h3 class="text-lg font-semibold text-gray-900 truncate">{job.title}</h3>
                <p class="text-sm text-gray-600 truncate">{job.company} • {job.location}</p>
              </div>
               <svg 
                class="w-5 h-5 mt-1 ml-1 text-gray-400 transform transition-transform duration-300 ease-out peer-checked:rotate-180"
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path>
              </svg>
               </div>
            </div>

            <div class="flex items-center space-x-3 ">
              <span class="text-sm text-gray-500 font-medium">{job.start} - {job.end}</span>
            </div>
          </div>
          {/* <!-- Mobile date display -->
          <div class="sm:hidden mt-2 text-left">
            <span class="text-sm text-gray-500 font-medium">{job.start} - {job.end}</span>
          </div> */}
        </label>

        <!-- Accordion Content -->
        <div class="max-h-0 overflow-hidden transition-all duration-500 ease-in-out peer-checked:max-h-screen peer-checked:pb-4">
          <div class="px-6 pt-0 pb-4 bg-gradient-to-r from-gray-50 to-blue-50/30 border-t border-gray-100">
            <div class="space-y-4 pt-4">
              <!-- Description -->
              <div class=" text-gray-700">
                {job.description.map(async(desc: any) => {
                  const processedDescription = await remark()
                    .use(html)
                    .process(desc);
                  return <div set:html={processedDescription} class="mb-3" />
                })}
              </div>
              
              <!-- Links -->
              {job.links && job.links.length > 0 && (
                <div class="pt-3 border-t border-gray-200">
                  <h4 class="text-sm font-semibold text-gray-800 mb-3">Related Links:</h4>
                  <div class="flex flex-wrap gap-2">
                    {job.links.map((link: linkOBJ) => (
                      <a 
                        href={link.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        class="inline-flex items-center px-3 py-2 text-sm font-medium text-blue-600 bg-blue-50 border border-blue-200 rounded-full hover:bg-blue-100 hover:border-blue-300 hover:scale-105 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-1 transition-all duration-200 ease-out"
                      >
                        <svg class="w-4 h-4 mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"></path>
                        </svg>
                        {link.type}
                      </a>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    ))}
  </div>
</div>

<style>
  /* Only keep the animation that Tailwind can't handle */
  @keyframes fadeInUp {
    from {
      opacity: 0;
      transform: translateY(-10px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }
  
  /* Apply animation to content when accordion is opened */
  .peer:checked ~ div > div {
    animation: fadeInUp 0.4s ease-out;
  }
  
  /* Fix for the icon rotation - needs to be in the label context */
  .peer:checked + label svg {
    transform: rotate(180deg);
  }
</style>


================================================
FILE: src/data/data.json
================================================
{
   "name": "Gyanendra Prakash",
   "initials": "GP",
   "url": "https://portfolio-zeta-one-39.vercel.app/",
   "location": "Mohali Punjab, India",
   "locationLink": "/",
   "description": "A curious developer/undergraduate with a growing interest in AI, LLMs, and the evolving landscape of intelligent systems.",
   "summary": "I am **Gyanendra Prakash**, a **second-year Bachelor of Technology student** from **India**, currently pursuing **Computer Science Engineering**. While still early in my academic journey, I am deeply passionate about the world of **Artificial Intelligence**, especially **Large Language Models**, **intelligent agents**, and seamless **AI integrations**. Beyond academics, I enjoy immersing myself in **video games**, exploring **cinematic universes**, and experimenting with new **recipes in the kitchen**.",
   "avatarUrl": "/images/me1.jpg",
   "skills": [
      {
         "name": "JavaScript",
         "url": "https://img.shields.io/badge/javascript-white?style=for-the-badge&logo=javascript&logoColor=black&labelColor=white&color=white"
      },
      {
         "name": "HTML5",
         "url": "https://img.shields.io/badge/html5-white?style=for-the-badge&logo=html5&logoColor=black&labelColor=white&color=white"
      },
      {
         "name": "CSS3",
         "url": "https://img.shields.io/badge/css3-white?style=for-the-badge&logo=css3&logoColor=black&labelColor=white&color=white"
      },
      {
         "name": "React",
         "url": "https://img.shields.io/badge/react-white?style=for-the-badge&logo=react&logoColor=black&labelColor=white&color=white"
      },
      {
         "name": "React Native",
         "url": "https://img.shields.io/badge/react_native-white?style=for-the-badge&logo=react&logoColor=black&labelColor=white&color=white"
      },
      {
         "name": "TailwindCSS",
         "url": "https://img.shields.io/badge/tailwindcss-white?style=for-the-badge&logo=tailwind-css&logoColor=black&labelColor=white&color=white"
      },
      {
         "name": "Python",
         "url": "https://img.shields.io/badge/python-white?style=for-the-badge&logo=python&logoColor=black&labelColor=white&color=white"
      },
      {
         "name": "FastAPI",
         "url": "https://img.shields.io/badge/FastAPI-white?style=for-the-badge&logo=fastapi&logoColor=black&labelColor=white&color=white"
      },
      {
         "name": "Flask",
         "url": "https://img.shields.io/badge/flask-white?style=for-the-badge&logo=flask&logoColor=black&labelColor=white&color=white"
      },
      {
         "name": "Streamlit",
         "url": "https://img.shields.io/badge/Streamlit-white?style=for-the-badge&logo=streamlit&logoColor=black&labelColor=white&color=white"
      },
      {
         "name": "NumPy",
         "url": "https://img.shields.io/badge/numpy-white?style=for-the-badge&logo=numpy&logoColor=black&labelColor=white&color=white"
      },
      {
         "name": "Pandas",
         "url": "https://img.shields.io/badge/pandas-white?style=for-the-badge&logo=pandas&logoColor=black&labelColor=white&color=white"
      },
      {
         "name": "Matplotlib",
         "url": "https://img.shields.io/badge/Matplotlib-white?style=for-the-badge&logo=Matplotlib&logoColor=black&labelColor=white&color=white"
      },
      {
         "name": "scikit-learn",
         "url": "https://img.shields.io/badge/scikit--learn-white?style=for-the-badge&logo=scikit-learn&logoColor=black&labelColor=white&color=white"
      },
      {
         "name": "SciPy",
         "url": "https://img.shields.io/badge/SciPy-white?style=for-the-badge&logo=scipy&logoColor=black&labelColor=white&color=white"
      },
      {
         "name": "PyTorch",
         "url": "https://img.shields.io/badge/PyTorch-white?style=for-the-badge&logo=PyTorch&logoColor=black&labelColor=white&color=white"
      },
      {
         "name": "TensorFlow",
         "url": "https://img.shields.io/badge/TensorFlow-white?style=for-the-badge&logo=TensorFlow&logoColor=black&labelColor=white&color=white"
      },
      {
         "name": "Git",
         "url": "https://img.shields.io/badge/git-white?style=for-the-badge&logo=git&logoColor=black&labelColor=white&color=white"
      },
      {
         "name": "GitHub",
         "url": "https://img.shields.io/badge/github-white?style=for-the-badge&logo=github&logoColor=black&labelColor=white&color=white"
      },
      {
         "name": "PostgreSQL",
         "url": "https://img.shields.io/badge/postgres-white?style=for-the-badge&logo=postgresql&logoColor=black&labelColor=white&color=white"
      },
      {
         "name": "Firebase",
         "url": "https://img.shields.io/badge/firebase-white?style=for-the-badge&logo=firebase&logoColor=black&labelColor=white&color=white"
      },
      {
         "name": "Bash Script",
         "url": "https://img.shields.io/badge/bash_script-white?style=for-the-badge&logo=gnu-bash&logoColor=black&labelColor=white&color=white"
      },
      {
         "name": "ESP32",
         "url": "https://img.shields.io/badge/ESP32-white?style=for-the-badge&logo=espressif&logoColor=black&labelColor=white&color=white"
      }
   ],
   "navbar": [
      {
         "href": "/",
         "label": "Home"
      }
   ],
   "contact": {
      "email": "gyanendraprakash10@gmail.com",
      "tel": "+91 9779515993",
      "social": {
         "GitHub": {
            "name": "GitHub",
            "url": "https://github.com/Gyaanendra",
            "navbar": true
         },
         "LinkedIn": {
            "name": "LinkedIn",
            "url": "https://www.linkedin.com/in/gyanendra-prakash-3b6293324/",
            "navbar": true
         },
         "X": {
            "name": "X",
            "url": "https://x.com/Gyaanendra1",
            "navbar": true
         },
         "email": {
            "name": "Send Email",
            "url": "mailto:gyanendraprakash10@gmail.com",
            "navbar": true
         }
      }
   },
   "work": [
      {
         "company": "Ezlearn",
         "href": "https://ezlearn.in/",
         "badges": [],
         "location": "Remote",
         "title": "Backend Intern",
         "logoUrl": "/images/work-experience/ez.png",
         "start": "Apr 2024",
         "end": "Present",
         "description": [
            " **•** Joined Ezlearn as a Backend Django **Intern** in April, 2025.",
            " **•** Started my work with **optimizing** the load on several **API endpoints**.",
            " **•**  Helped in creating a **simpler and more efficient course purchase flow**.",
            " **•**  Also implemented several **high-quality features** to enhance the **user experience**."
         ],
         "links": [
            {
               "type": "Website",
               "href": "https://ezlearn.in/"
            }
         ]
      },
      {
         "company": "nexCarft",
         "href": "https://skillarena.in/",
         "badges": [],
         "location": "Remote",
         "title": "AppDev Intern",
         "logoUrl": "/images/work-experience/nex.png",
         "start": "Jan 2024",
         "end": "Mar 2024",
         "description": [
            "**•**  Improved and maintained core backend systems written in the **MERN** stack",
            "**•**  Implemented a **real-time chat application** backend utilizing WebSockets and FastAPI"
         ],
         "links": [
            {
               "type": "Website",
               "href": "https://skillarena.in/"
            }
         ]
      }
   ],
   "education": [
      {
         "school": "Bennett University",
         "href": "https://bennett.edu.in/",
         "degree": "Bachelor's of Technology in Computer Science Engineering",
         "logoUrl": "/images/bennett.png",
         "start": "2024",
         "end": "2028"
      },
      {
         "school": "Goverment Model Senior Secondary School Sector 35-D",
         "href": "https://gmsss35.com/",
         "degree": "Senior Secondary (CBSE) | XII - 86.6%",
         "logoUrl": "/images/gmsss35.png",
         "start": "2022",
         "end": "2024"
      },
      {
         "school": "Manav Mangal Smart School",
         "href": "https://manavmangal.school/mmss-64-mohali",
         "degree": "Secondary (CBSE) | X - 88.8%",
         "logoUrl": "/images/mmss.png",
         "start": "2010",
         "end": "2022"
      }
   ],
   "projects": [
      {
         "title": "cooming soon 1",
         "href": "",
         "dates": "Nov 2024 - Present",
         "active": true,
         "description": "",
         "technologies": [
            "Next.js",
            "Typescript",
            "LLaMa3.2",
            "Web Scraping"
         ],
         "links": [
            {
               "type": "Website",
               "href": ""
            },
            {
               "type": "Source",
               "href": ""
            }
         ],
         "image": "/images/projects/project1.jpg"
      },
      {
         "title": "cooming soon 2",
         "href": "",
         "dates": "September 2024 - October 2024",
         "active": true,
         "description": "",
         "technologies": [
            "Next.js",
            "Typescript",
            "CopilotKit",
            "Appwrite"
         ],
         "links": [
            {
               "type": "Website",
               "href": ""
            },
            {
               "type": "Source",
               "href": ""
            }
         ],
         "image": "/images/projects/project2.jpg"
      },
      {
         "title": "cooming soon 3",
         "href": "",
         "dates": "April 2023 - March 2023",
         "active": true,
         "description": "",
         "technologies": [
            "Java",
            "XML",
            "Firebase",
            "Android Studio"
         ],
         "links": [
            {
               "type": "Play Store",
               "href": ""
            },
            {
               "type": "Source",
               "href": ""
            }
         ],
         "image": "/images/projects/project3.jpg"
      },
      {
         "title": "cooming soon 4",
         "href": "",
         "dates": "Dec 2022 - Jan 2023",
         "active": true,
         "description": "",
         "technologies": [
            "Python",
            "Tkinter",
            "SQLite"
         ],
         "links": [
            {
               "type": "Source",
               "href": ""
            }
         ],
         "image": "/images/projects/project4.jpg"
      }
   ],
   "positions": [
      {
         "title": "Junior core Tech Member",
         "dates": "Sep 2024 - Jun 2025",
         "location": "Artificial Intelligence Society, Bennett University",
         "description": "I worked with AIS to organise various events and Workshops. Also worked on its website, which helped me be updated with various kinds of technologies.",
         "image": "/images/ais.jpg",
         "links": [
            {
               "title": "LinkedIn",
               "href": "https://www.linkedin.com/company/ais-bennett/posts/?feedView=all"
            },
            {
               "title": "Website",
               "href": "https://aiswebsite-new.vercel.app/home"
            }
         ]
      },
      {
         "title": "Fullstack Developer and tech team",
         "dates": "Feb 2025 - May 2025",
         "location": "International Affairs Society, Bennett University",
         "description": "I worked part time with them and help them build Website with a CMS",
         "image": "/images/ias.jpg",
         "links": [
            {
               "title": "LinkedIn",
               "href": "https://www.linkedin.com/company/international-affairs-society-bennet/"
            }
         ]
      },
      {
         "title": "Tech team",
         "dates": "August 2023 - May 2024",
         "location": "SPARK E-Cell, Bennett University",
         "description": "As the technical member i helped in creation and managment of a live autioning webite for and an event called Spark aution bid, Where participaints where given 30 seconds to think and buy a startup , Team or invidual with highest total worth of startups bought would win.",
         "image": "/images/spark.jpg",
         "links": [
            {
               "title": "LinkedIn",
               "href": "https://www.linkedin.com/company/spark-e-cell/"
            }
         ]
      },
      {
         "title": "Tech Member",
         "dates": "September 2022 - May 2023",
         "location": "Centre for Law, Technology and Innovation, Bennett University",
         "description": "CLTI was a new and unique club launched in 2025 at Bennett University. As a member, I helped organize various fun games and stalls, and played a crucial role in the hackathon LexHack — a one-of-a-kind event that combined building websites with defending them in a simulated courtroom setting.",
         "image": "/images/clti.jpg",
         "links": [
            {
               "title": "LinkedIn",
               "href": "https://www.linkedin.com/company/clti-bu/"
            }
         ]
      }
   ],
   "achievements": [
      {
         "title": "Netruon",
         "dates": "Apr 2024",
         "location": "NST Riverhood campus",
         "image": "/images/achievements/nst.jpeg"
      },
      {
         "title": "Netruon",
         "dates": "Apr 2024",
         "location": "NST Riverhood campus",
         "image": "/images/achievements/nst2.jpg"
      },
      {
         "title": "Hackaccino",
         "dates": "Apr 2025",
         "location": "CSI Bennett University",
         "image": "/images/achievements/hackachino.jpeg"
      }
   ]
}


================================================
FILE: src/data/skills.json
================================================
{
   "skills": [
      {
         "name": "P5.js",
         "url": "https://img.shields.io/badge/p5.js-ED225D?style=for-the-badge&logo=p5.js&logoColor=FFFFFF&labelColor=black"
      },
      {
         "name": "JavaScript",
         "url": "https://img.shields.io/badge/javascript-%23323330.svg?style=for-the-badge&logo=javascript&logoColor=%23F7DF1E&labelColor=black"
      },
      {
         "name": "jQuery",
         "url": "https://img.shields.io/badge/jquery-%230769AD.svg?style=for-the-badge&logo=jquery&logoColor=white"
      },
      {
         "name": "HTML5",
         "url": "https://img.shields.io/badge/html5-%23E34F26.svg?style=for-the-badge&logo=html5&logoColor=white"
      },
      {
         "name": "CSS3",
         "url": "https://img.shields.io/badge/css3-%231572B6.svg?style=for-the-badge&logo=css3&logoColor=white"
      },
      {
         "name": "React",
         "url": "https://img.shields.io/badge/react-%2320232a.svg?style=for-the-badge&logo=react&logoColor=%2361DAFB"
      },
      {
         "name": "React Native",
         "url": "https://img.shields.io/badge/react_native-%2320232a.svg?style=for-the-badge&logo=react&logoColor=%2361DAFB"
      },
      {
         "name": "Next.js",
         "url": "https://img.shields.io/badge/Next-black?style=for-the-badge&logo=next.js&logoColor=white"
      },
      {
         "name": "Express.js",
         "url": "https://img.shields.io/badge/express.js-%23404d59.svg?style=for-the-badge&logo=express&logoColor=%2361DAFB"
      },
      {
         "name": "TailwindCSS",
         "url": "https://img.shields.io/badge/tailwindcss-%2338B2AC.svg?style=for-the-badge&logo=tailwind-css&logoColor=white"
      },
      {
         "name": "Three.js",
         "url": "https://img.shields.io/badge/threejs-black?style=for-the-badge&logo=three.js&logoColor=white"
      },
      {
         "name": "EJS",
         "url": "https://img.shields.io/badge/ejs-%23B4CA65.svg?style=for-the-badge&logo=ejs&logoColor=black"
      },
      {
         "name": "NPM",
         "url": "https://img.shields.io/badge/NPM-%23CB3837.svg?style=for-the-badge&logo=npm&logoColor=white"
      },
      {
         "name": "Vercel",
         "url": "https://img.shields.io/badge/vercel-%23000000.svg?style=for-the-badge&logo=vercel&logoColor=white"
      },
      {
         "name": "Expo",
         "url": "https://img.shields.io/badge/expo-1C1E24?style=for-the-badge&logo=expo&logoColor=#D04A37"
      },
      {
         "name": "Python",
         "url": "https://img.shields.io/badge/python-3670A0?style=for-the-badge&logo=python&logoColor=ffdd54"
      },
      {
         "name": "FastAPI",
         "url": "https://img.shields.io/badge/FastAPI-005571?style=for-the-badge&logo=fastapi"
      },
      {
         "name": "Flask",
         "url": "https://img.shields.io/badge/flask-%23000.svg?style=for-the-badge&logo=flask&logoColor=white"
      },
      {
         "name": "Gunicorn",
         "url": "https://img.shields.io/badge/gunicorn-%298729.svg?style=for-the-badge&logo=gunicorn&logoColor=white"
      },
      {
         "name": "Streamlit",
         "url": "https://img.shields.io/badge/Streamlit-%23FE4B4B.svg?style=for-the-badge&logo=streamlit&logoColor=white"
      },
      {
         "name": "NumPy",
         "url": "https://img.shields.io/badge/numpy-%23013243.svg?style=for-the-badge&logo=numpy&logoColor=white"
      },
      {
         "name": "Pandas",
         "url": "https://img.shields.io/badge/pandas-%23150458.svg?style=for-the-badge&logo=pandas&logoColor=white"
      },
      {
         "name": "Matplotlib",
         "url": "https://img.shields.io/badge/Matplotlib-%23ffffff.svg?style=for-the-badge&logo=Matplotlib&logoColor=black"
      },
      {
         "name": "scikit-learn",
         "url": "https://img.shields.io/badge/scikit--learn-%23F7931E.svg?style=for-the-badge&logo=scikit-learn&logoColor=white"
      },
      {
         "name": "SciPy",
         "url": "https://img.shields.io/badge/SciPy-%230C55A5.svg?style=for-the-badge&logo=scipy&logoColor=%white"
      },
      {
         "name": "PyTorch",
         "url": "https://img.shields.io/badge/PyTorch-%23EE4C2C.svg?style=for-the-badge&logo=PyTorch&logoColor=white"
      },
      {
         "name": "TensorFlow",
         "url": "https://img.shields.io/badge/TensorFlow-%23FF6F00.svg?style=for-the-badge&logo=TensorFlow&logoColor=white"
      },
      {
         "name": "Git",
         "url": "https://img.shields.io/badge/git-%23F05033.svg?style=for-the-badge&logo=git&logoColor=white"
      },
      {
         "name": "GitHub",
         "url": "https://img.shields.io/badge/github-%23121011.svg?style=for-the-badge&logo=github&logoColor=white"
      },
      {
         "name": "Docker",
         "url": "https://img.shields.io/badge/docker-%230db7ed.svg?style=for-the-badge&logo=docker&logoColor=white"
      },
      {
         "name": "Postan",
         "url": "https://img.shields.io/badge/Postman-FF6C37?style=for-the-badge&logo=postman&logoColor=white"
      },
      {
         "name": "PostgreSQL",
         "url": "https://img.shields.io/badge/postgres-%23316192.svg?style=for-the-badge&logo=postgresql&logoColor=white"
      },
      {
         "name": "Firebase",
         "url": "https://img.shields.io/badge/firebase-%23039BE5.svg?style=for-the-badge&logo=firebase"
      },
      {
         "name": "Render",
         "url": "https://img.shields.io/badge/Render-%46E3B7.svg?style=for-the-badge&logo=render&logoColor=white"
      },
      {
         "name": "Markdown",
         "url": "https://img.shields.io/badge/markdown-%23000000.svg?style=for-the-badge&logo=markdown&logoColor=white"
      },
      {
         "name": "Bash Script",
         "url": "https://img.shields.io/badge/bash_script-%23121011.svg?style=for-the-badge&logo=gnu-bash&logoColor=white"
      },
      {
         "name": "Arduino",
         "url": "https://img.shields.io/badge/-Arduino-00979D?style=for-the-badge&logo=Arduino&logoColor=white"
      },
      {
         "name": "ESP32",
         "url": "https://img.shields.io/badge/ESP32-E7352C?style=for-the-badge&logo=espressif&logoColor=white"
      },
      {
         "name": "Figma",
         "url": "https://img.shields.io/badge/figma-%23F24E1E.svg?style=for-the-badge&logo=figma&logoColor=white"
      },
      {
         "name": "Canva",
         "url": "https://img.shields.io/badge/Canva-%2300C4CC.svg?style=for-the-badge&logo=Canva&logoColor=white"
      }
   ],
   "skillsw": [
      {
         "name": "P5.js",
         "url": "https://img.shields.io/badge/p5.js-white?style=for-the-badge&logo=p5.js&logoColor=black&labelColor=white&color=white"
      },
      {
         "name": "JavaScript",
         "url": "https://img.shields.io/badge/javascript-white?style=for-the-badge&logo=javascript&logoColor=black&labelColor=white&color=white"
      },
      {
         "name": "jQuery",
         "url": "https://img.shields.io/badge/jquery-white?style=for-the-badge&logo=jquery&logoColor=black&labelColor=white&color=white"
      },
      {
         "name": "HTML5",
         "url": "https://img.shields.io/badge/html5-white?style=for-the-badge&logo=html5&logoColor=black&labelColor=white&color=white"
      },
      {
         "name": "CSS3",
         "url": "https://img.shields.io/badge/css3-white?style=for-the-badge&logo=css3&logoColor=black&labelColor=white&color=white"
      },
      {
         "name": "React",
         "url": "https://img.shields.io/badge/react-white?style=for-the-badge&logo=react&logoColor=black&labelColor=white&color=white"
      },
      {
         "name": "React Native",
         "url": "https://img.shields.io/badge/react_native-white?style=for-the-badge&logo=react&logoColor=black&labelColor=white&color=white"
      },
      {
         "name": "Next.js",
         "url": "https://img.shields.io/badge/Next-white?style=for-the-badge&logo=next.js&logoColor=black&labelColor=white&color=white"
      },
      {
         "name": "Express.js",
         "url": "https://img.shields.io/badge/express.js-white?style=for-the-badge&logo=express&logoColor=black&labelColor=white&color=white"
      },
      {
         "name": "TailwindCSS",
         "url": "https://img.shields.io/badge/tailwindcss-white?style=for-the-badge&logo=tailwind-css&logoColor=black&labelColor=white&color=white"
      },
      {
         "name": "Three.js",
         "url": "https://img.shields.io/badge/threejs-white?style=for-the-badge&logo=three.js&logoColor=black&labelColor=white&color=white"
      },
      {
         "name": "EJS",
         "url": "https://img.shields.io/badge/ejs-white?style=for-the-badge&logo=ejs&logoColor=black&labelColor=white&color=white"
      },
      {
         "name": "NPM",
         "url": "https://img.shields.io/badge/NPM-white?style=for-the-badge&logo=npm&logoColor=black&labelColor=white&color=white"
      },
      {
         "name": "Vercel",
         "url": "https://img.shields.io/badge/vercel-white?style=for-the-badge&logo=vercel&logoColor=black&labelColor=white&color=white"
      },
      {
         "name": "Expo",
         "url": "https://img.shields.io/badge/expo-white?style=for-the-badge&logo=expo&logoColor=black&labelColor=white&color=white"
      },
      {
         "name": "Python",
         "url": "https://img.shields.io/badge/python-white?style=for-the-badge&logo=python&logoColor=black&labelColor=white&color=white"
      },
      {
         "name": "FastAPI",
         "url": "https://img.shields.io/badge/FastAPI-white?style=for-the-badge&logo=fastapi&logoColor=black&labelColor=white&color=white"
      },
      {
         "name": "Flask",
         "url": "https://img.shields.io/badge/flask-white?style=for-the-badge&logo=flask&logoColor=black&labelColor=white&color=white"
      },
      {
         "name": "Gunicorn",
         "url": "https://img.shields.io/badge/gunicorn-white?style=for-the-badge&logo=gunicorn&logoColor=black&labelColor=white&color=white"
      },
      {
         "name": "Streamlit",
         "url": "https://img.shields.io/badge/Streamlit-white?style=for-the-badge&logo=streamlit&logoColor=black&labelColor=white&color=white"
      },
      {
         "name": "NumPy",
         "url": "https://img.shields.io/badge/numpy-white?style=for-the-badge&logo=numpy&logoColor=black&labelColor=white&color=white"
      },
      {
         "name": "Pandas",
         "url": "https://img.shields.io/badge/pandas-white?style=for-the-badge&logo=pandas&logoColor=black&labelColor=white&color=white"
      },
      {
         "name": "Matplotlib",
         "url": "https://img.shields.io/badge/Matplotlib-white?style=for-the-badge&logo=Matplotlib&logoColor=black&labelColor=white&color=white"
      },
      {
         "name": "scikit-learn",
         "url": "https://img.shields.io/badge/scikit--learn-white?style=for-the-badge&logo=scikit-learn&logoColor=black&labelColor=white&color=white"
      },
      {
         "name": "SciPy",
         "url": "https://img.shields.io/badge/SciPy-white?style=for-the-badge&logo=scipy&logoColor=black&labelColor=white&color=white"
      },
      {
         "name": "PyTorch",
         "url": "https://img.shields.io/badge/PyTorch-white?style=for-the-badge&logo=PyTorch&logoColor=black&labelColor=white&color=white"
      },
      {
         "name": "TensorFlow",
         "url": "https://img.shields.io/badge/TensorFlow-white?style=for-the-badge&logo=TensorFlow&logoColor=black&labelColor=white&color=white"
      },
      {
         "name": "Git",
         "url": "https://img.shields.io/badge/git-white?style=for-the-badge&logo=git&logoColor=black&labelColor=white&color=white"
      },
      {
         "name": "GitHub",
         "url": "https://img.shields.io/badge/github-white?style=for-the-badge&logo=github&logoColor=black&labelColor=white&color=white"
      },
      {
         "name": "Docker",
         "url": "https://img.shields.io/badge/docker-white?style=for-the-badge&logo=docker&logoColor=black&labelColor=white&color=white"
      },
      {
         "name": "Postman",
         "url": "https://img.shields.io/badge/Postman-white?style=for-the-badge&logo=postman&logoColor=black&labelColor=white&color=white"
      },
      {
         "name": "PostgreSQL",
         "url": "https://img.shields.io/badge/postgres-white?style=for-the-badge&logo=postgresql&logoColor=black&labelColor=white&color=white"
      },
      {
         "name": "Firebase",
         "url": "https://img.shields.io/badge/firebase-white?style=for-the-badge&logo=firebase&logoColor=black&labelColor=white&color=white"
      },
      {
         "name": "Render",
         "url": "https://img.shields.io/badge/Render-white?style=for-the-badge&logo=render&logoColor=black&labelColor=white&color=white"
      },
      {
         "name": "Markdown",
         "url": "https://img.shields.io/badge/markdown-white?style=for-the-badge&logo=markdown&logoColor=black&labelColor=white&color=white"
      },
      {
         "name": "Bash Script",
         "url": "https://img.shields.io/badge/bash_script-white?style=for-the-badge&logo=gnu-bash&logoColor=black&labelColor=white&color=white"
      },
      {
         "name": "Arduino",
         "url": "https://img.shields.io/badge/-Arduino-white?style=for-the-badge&logo=Arduino&logoColor=black&labelColor=white&color=white"
      },
      {
         "name": "ESP32",
         "url": "https://img.shields.io/badge/ESP32-white?style=for-the-badge&logo=espressif&logoColor=black&labelColor=white&color=white"
      },
      {
         "name": "Figma",
         "url": "https://img.shields.io/badge/figma-white?style=for-the-badge&logo=figma&logoColor=black&labelColor=white&color=white"
      },
      {
         "name": "Canva",
         "url": "https://img.shields.io/badge/Canva-white?style=for-the-badge&logo=Canva&logoColor=black&labelColor=white&color=white"
      }
   ],
   "skillsb": [
      {
         "name": "P5.js",
         "url": "https://img.shields.io/badge/p5.js-black?style=for-the-badge&logo=p5.js&logoColor=white&labelColor=black&color=black"
      },
      {
         "name": "JavaScript",
         "url": "https://img.shields.io/badge/javascript-black?style=for-the-badge&logo=javascript&logoColor=white&labelColor=black&color=black"
      },
      {
         "name": "jQuery",
         "url": "https://img.shields.io/badge/jquery-black?style=for-the-badge&logo=jquery&logoColor=white&labelColor=black&color=black"
      },
      {
         "name": "HTML5",
         "url": "https://img.shields.io/badge/html5-black?style=for-the-badge&logo=html5&logoColor=white&labelColor=black&color=black"
      },
      {
         "name": "CSS3",
         "url": "https://img.shields.io/badge/css3-black?style=for-the-badge&logo=css3&logoColor=white&labelColor=black&color=black"
      },
      {
         "name": "React",
         "url": "https://img.shields.io/badge/react-black?style=for-the-badge&logo=react&logoColor=white&labelColor=black&color=black"
      },
      {
         "name": "React Native",
         "url": "https://img.shields.io/badge/react_native-black?style=for-the-badge&logo=react&logoColor=white&labelColor=black&color=black"
      },
      {
         "name": "Next.js",
         "url": "https://img.shields.io/badge/Next-black?style=for-the-badge&logo=next.js&logoColor=white&labelColor=black&color=black"
      },
      {
         "name": "Express.js",
         "url": "https://img.shields.io/badge/express.js-black?style=for-the-badge&logo=express&logoColor=white&labelColor=black&color=black"
      },
      {
         "name": "TailwindCSS",
         "url": "https://img.shields.io/badge/tailwindcss-black?style=for-the-badge&logo=tailwind-css&logoColor=white&labelColor=black&color=black"
      },
      {
         "name": "Three.js",
         "url": "https://img.shields.io/badge/threejs-black?style=for-the-badge&logo=three.js&logoColor=white&labelColor=black&color=black"
      },
      {
         "name": "EJS",
         "url": "https://img.shields.io/badge/ejs-black?style=for-the-badge&logo=ejs&logoColor=white&labelColor=black&color=black"
      },
      {
         "name": "NPM",
         "url": "https://img.shields.io/badge/NPM-black?style=for-the-badge&logo=npm&logoColor=white&labelColor=black&color=black"
      },
      {
         "name": "Vercel",
         "url": "https://img.shields.io/badge/vercel-black?style=for-the-badge&logo=vercel&logoColor=white&labelColor=black&color=black"
      },
      {
         "name": "Expo",
         "url": "https://img.shields.io/badge/expo-black?style=for-the-badge&logo=expo&logoColor=white&labelColor=black&color=black"
      },
      {
         "name": "Python",
         "url": "https://img.shields.io/badge/python-black?style=for-the-badge&logo=python&logoColor=white&labelColor=black&color=black"
      },
      {
         "name": "FastAPI",
         "url": "https://img.shields.io/badge/FastAPI-black?style=for-the-badge&logo=fastapi&logoColor=white&labelColor=black&color=black"
      },
      {
         "name": "Flask",
         "url": "https://img.shields.io/badge/flask-black?style=for-the-badge&logo=flask&logoColor=white&labelColor=black&color=black"
      },
      {
         "name": "Gunicorn",
         "url": "https://img.shields.io/badge/gunicorn-black?style=for-the-badge&logo=gunicorn&logoColor=white&labelColor=black&color=black"
      },
      {
         "name": "Streamlit",
         "url": "https://img.shields.io/badge/Streamlit-black?style=for-the-badge&logo=streamlit&logoColor=white&labelColor=black&color=black"
      },
      {
         "name": "NumPy",
         "url": "https://img.shields.io/badge/numpy-black?style=for-the-badge&logo=numpy&logoColor=white&labelColor=black&color=black"
      },
      {
         "name": "Pandas",
         "url": "https://img.shields.io/badge/pandas-black?style=for-the-badge&logo=pandas&logoColor=white&labelColor=black&color=black"
      },
      {
         "name": "Matplotlib",
         "url": "https://img.shields.io/badge/Matplotlib-black?style=for-the-badge&logo=Matplotlib&logoColor=white&labelColor=black&color=black"
      },
      {
         "name": "scikit-learn",
         "url": "https://img.shields.io/badge/scikit--learn-black?style=for-the-badge&logo=scikit-learn&logoColor=white&labelColor=black&color=black"
      },
      {
         "name": "SciPy",
         "url": "https://img.shields.io/badge/SciPy-black?style=for-the-badge&logo=scipy&logoColor=white&labelColor=black&color=black"
      },
      {
         "name": "PyTorch",
         "url": "https://img.shields.io/badge/PyTorch-black?style=for-the-badge&logo=PyTorch&logoColor=white&labelColor=black&color=black"
      },
      {
         "name": "TensorFlow",
         "url": "https://img.shields.io/badge/TensorFlow-black?style=for-the-badge&logo=TensorFlow&logoColor=white&labelColor=black&color=black"
      },
      {
         "name": "Git",
         "url": "https://img.shields.io/badge/git-black?style=for-the-badge&logo=git&logoColor=white&labelColor=black&color=black"
      },
      {
         "name": "GitHub",
         "url": "https://img.shields.io/badge/github-black?style=for-the-badge&logo=github&logoColor=white&labelColor=black&color=black"
      },
      {
         "name": "Docker",
         "url": "https://img.shields.io/badge/docker-black?style=for-the-badge&logo=docker&logoColor=white&labelColor=black&color=black"
      },
      {
         "name": "Postman",
         "url": "https://img.shields.io/badge/Postman-black?style=for-the-badge&logo=postman&logoColor=white&labelColor=black&color=black"
      },
      {
         "name": "PostgreSQL",
         "url": "https://img.shields.io/badge/postgres-black?style=for-the-badge&logo=postgresql&logoColor=white&labelColor=black&color=black"
      },
      {
         "name": "Firebase",
         "url": "https://img.shields.io/badge/firebase-black?style=for-the-badge&logo=firebase&logoColor=white&labelColor=black&color=black"
      },
      {
         "name": "Render",
         "url": "https://img.shields.io/badge/Render-black?style=for-the-badge&logo=render&logoColor=white&labelColor=black&color=black"
      },
      {
         "name": "Markdown",
         "url": "https://img.shields.io/badge/markdown-black?style=for-the-badge&logo=markdown&logoColor=white&labelColor=black&color=black"
      },
      {
         "name": "Bash Script",
         "url": "https://img.shields.io/badge/bash_script-black?style=for-the-badge&logo=gnu-bash&logoColor=white&labelColor=black&color=black"
      },
      {
         "name": "Arduino",
         "url": "https://img.shields.io/badge/-Arduino-black?style=for-the-badge&logo=Arduino&logoColor=white&labelColor=black&color=black"
      },
      {
         "name": "ESP32",
         "url": "https://img.shields.io/badge/ESP32-black?style=for-the-badge&logo=espressif&logoColor=white&labelColor=black&color=black"
      },
      {
         "name": "Figma",
         "url": "https://img.shields.io/badge/figma-black?style=for-the-badge&logo=figma&logoColor=white&labelColor=black&color=black"
      },
      {
         "name": "Canva",
         "url": "https://img.shields.io/badge/Canva-black?style=for-the-badge&logo=Canva&logoColor=white&labelColor=black&color=black"
      }
   ]
}


================================================
FILE: src/layouts/Layout.astro
================================================
---
import "../styles/global.css"
---

<!doctype html>
<html lang="en">
	<head>
		<meta charset="UTF-8" />
		<meta name="viewport" content="width=device-width" />
		<link rel="icon" type="image/jpeg" href="/images/me1.jpg" />
		<meta name="generator" content={Astro.generator} />
		<title>Gyanendra's Portfolio</title>
	</head>
	<body class="min-h-screen bg-background font-['Arial'] antialiased max-w-4xl mx-auto py-12 sm:py-24 ">
		
		<slot />
	</body>
</html>



================================================
FILE: src/pages/index.astro
================================================
---
import Layout from "../layouts/Layout.astro"
import data from "../data/data.json"
import Work from "../components/Work.astro";
import Hero from "../components/Hero.astro";
import About from "../components/About.astro";
import Education from "../components/Education.astro"
import Skills from "../components/Skills.astro";
import Projects from "../components/Projects.astro";
import Clubs from "../components/Clubs.astro";
import Achievements from"../components/Achievements.jsx";
import Contact from "../components/Contact.astro";
---

<Layout>
  
  <main class="flex items-center justify-center flex-col min-h-[100dvh] space-y-10 px-6 divide-slate-950 border [&>*]:border">
    <div class="max-w-md mx-auto text-center px-6">
        <div class="mb-8">
            <div class="w-16 h-16 mx-auto mb-6 border-4 border-white rounded-full flex items-center justify-center">
                <div class="w-8 h-8 bg-white rounded-full animate-pulse"></div>
            </div>
            <h1 class="text-4xl font-bold mb-4 tracking-tight">Website Under Maintenance</h1>
            <p class="text-lg text-black-300 mb-8">Check back later for updates!</p>
        </div>
        
        <div class="border-t border-gray-700 pt-8">
            <p class="text-black-300 mb-6">In the meantime, you can view my</p>
            <div class="flex justify-center space-x-6">
                <a href="https://github.com/Gyaanendra" 
                   class="bg-white text-black px-6 py-3 rounded-lg font-semibold hover:bg-gray-200 transition-colors duration-200 transform hover:scale-105">
                    GitHub
                </a>
                <a href="https://www.linkedin.com/in/gyanendra-prakash-3b6293324/" 
                   class="border-2 border-white text-black px-6 py-3 rounded-lg font-semibold hover:bg-white hover:text-black transition-colors duration-200 transform hover:scale-105">
                    LinkedIn
                </a>
            </div>
        </div>
        
        <div class="mt-8 pt-8 border-t border-gray-700">
            <p class="text-sm text-black">Thank you for your patience!</p>
        </div>
    </div>
      <section id="hero">
         <Hero name={data.name}  description={data.description} avatarUrl={data.avatarUrl}  />
      </section>
      <section id="about" class="w-full">
        <About summary={data.summary} />
      </section>
         <section id="work" class="w-full">
            <Work work={data.work}/>
        </section>
        <section id="education" class="w-full">
        <Education education={data.education}/>
        </section>
        <section id="skills" class="w-full">
          <Skills skills={data.skills}/>
        </section>
        <section id="projects " class="w-full">
          <Projects/>
        </section>
        <section id="positions" class="w-full">
          <Clubs/>
        </section>
        <section id="achievements" class="w-full">
          <Achievements achievements={data.achievements} client:load/>
        </section>
         <section id="contact" class="w-full">
          <Contact/>
        </section> 

  </main>
</Layout>


================================================
FILE: src/styles/global.css
================================================
@import "tailwindcss";
