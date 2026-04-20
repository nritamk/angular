import React from "react";
import { initPlasmicLoader } from "@plasmicapp/loader-react";
import Navbar from "./components/Navbar";
import HeroSection from "./components/HeroSection";
import ScrollCamera from "./components/ScrollCamera";
import StorySection from "./components/StorySection";
import type { StorySectionData } from "./components/StorySection";
import Footer from "./components/Footer";

export const PLASMIC = initPlasmicLoader({
  projects: [
    {
      id: "mPbTdLnCtd28LGuCfjkarc",
      token:
        "2EzpXF8BSclI0eQAlTRkpZGKYoOsBGcL3UsSdva13w8jZ8hmXOOYRWN4ZtCS84YJRFh2uBxRuy4IKW7DaP1oQ",
    },
  ],
  preview: true,
});

PLASMIC.registerComponent(Navbar, {
  name: "Navbar",
  props: {},
  description: "Site navigation bar with scroll-aware styling and mobile menu",
  importPath: "./components/Navbar",
});

PLASMIC.registerComponent(HeroSection, {
  name: "HeroSection",
  props: {},
  description: "Full-screen hero section with GSAP entrance animations",
  importPath: "./components/HeroSection",
});

PLASMIC.registerComponent(ScrollCamera, {
  name: "ScrollCamera",
  props: {},
  description: "Floating camera SVG that tracks across story sections on scroll",
  importPath: "./components/ScrollCamera",
});

// Wrapper exposes StorySectionData fields as flat props for Plasmic Studio
function StorySectionWrapper(props: {
  id?: string;
  number?: string;
  eyebrow?: string;
  title?: string;
  body?: string;
  image?: string;
  imageAlt?: string;
  align?: "left" | "right";
  bg?: "light" | "pale" | "dark";
}) {
  const data: StorySectionData = {
    id: props.id ?? "section",
    number: props.number ?? "01",
    eyebrow: props.eyebrow ?? "Eyebrow",
    title: props.title ?? "Section Title",
    body: props.body ?? "Section body text.",
    image: props.image ?? "",
    imageAlt: props.imageAlt ?? "",
    align: props.align ?? "right",
    bg: props.bg ?? "light",
  };
  return React.createElement(StorySection, { data });
}

PLASMIC.registerComponent(StorySectionWrapper, {
  name: "StorySection",
  props: {
    id: "string",
    number: "string",
    eyebrow: "string",
    title: "string",
    body: "string",
    image: "string",
    imageAlt: "string",
    align: {
      type: "choice",
      options: ["left", "right"],
      defaultValue: "right",
    },
    bg: {
      type: "choice",
      options: ["light", "pale", "dark"],
      defaultValue: "light",
    },
  },
  description: "Service/story section with scroll-driven GSAP animations",
  importPath: "./components/StorySection",
});

PLASMIC.registerComponent(Footer, {
  name: "Footer",
  props: {},
  description: "Site footer with contact CTA, links and social icons",
  importPath: "./components/Footer",
});
