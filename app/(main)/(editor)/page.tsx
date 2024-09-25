"use client";

import React, { useCallback, useEffect, useState } from "react";
import {
  Code,
  Eye,
  Monitor,
  Moon,
  Redo,
  Smartphone,
  Sun,
  Tablet,
  Undo,
} from "lucide-react";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Toast } from "@/components/ui/toast";

import LeftSidebar from "./components/left-sidebar";
import MainEditor from "./components/main-editor";
import RightSidebar from "./components/right-sidebar";
import { TreeItem } from "./types";

// import babel from '@babel/core';
import { parse } from '@babel/parser';
import traverse from '@babel/traverse';
import generator from '@babel/generator';
import { useTheme } from "next-themes"


const initialTree: TreeItem[] = [
  {
    id: "1",
    name: "Page Container",
    type: "div",
    icon: <div className="h-4 w-4 rounded bg-gray-400" />,
    allowsChildren: true,
    children: [],
  },
];

const componentLibrary: TreeItem[] = [
  {
    id: "section",
    name: "Section",
    type: "section",
    icon: <div className="h-4 w-4 rounded bg-gray-400" />,
    allowsChildren: true,
  },
  {
    id: "div",
    name: "Div",
    type: "div",
    icon: <div className="h-4 w-4 rounded bg-gray-300" />,
    allowsChildren: true,
  },
  {
    id: "span",
    name: "Span",
    type: "span",
    icon: <div className="h-4 w-4 rounded bg-gray-300" />,
    allowsChildren: true,
  },
  {
    id: "Link",
    name: "Link",
    type: "link",
    icon: <div className="h-4 w-4 rounded bg-gray-300" />,
    allowsChildren: true,
  },
  {
    id: "h1",
    name: "Heading 1",
    type: "h1",
    icon: <div className="h-4 w-4 rounded bg-blue-400" />,
    props: { content: "Heading 1" },
  },
  {
    id: "h2",
    name: "Heading 2",
    type: "h2",
    icon: <div className="h-4 w-4 rounded bg-blue-300" />,
    props: { content: "Heading 2" },
  },
  {
    id: "h3",
    name: "Heading 3",
    type: "h3",
    icon: <div className="h-4 w-4 rounded bg-blue-200" />,
    props: { content: "Heading 3" },
  },
  {
    id: "h4",
    name: "Heading 4",
    type: "h4",
    icon: <div className="h-4 w-4 rounded bg-blue-100" />,
    props: { content: "Heading 4" },
  },
  {
    id: "p",
    name: "Paragraph",
    type: "p",
    icon: <div className="h-4 w-4 rounded bg-green-400" />,
    props: { content: "Paragraph text" },
  },
  {
    id: "button",
    name: "Button",
    type: "button",
    icon: <div className="h-4 w-4 rounded bg-purple-400" />,
    props: { content: "Button" },
  },
  {
    id: "input",
    name: "Input",
    type: "input",
    icon: <div className="h-4 w-4 rounded bg-yellow-400" />,
  },
  {
    id: "textarea",
    name: "Textarea",
    type: "textarea",
    icon: <div className="h-4 w-4 rounded bg-yellow-300" />,
  },
  {
    id: "accordion",
    name: "Accordion",
    type: "accordion",
    icon: <div className="h-4 w-4 rounded bg-indigo-400" />,
    allowsChildren: true,
  },
  {
    id: "card",
    name: "Card",
    type: "card",
    icon: <div className="h-4 w-4 rounded bg-pink-400" />,
    allowsChildren: true,
  },
  {
    id: "checkbox",
    name: "Checkbox",
    type: "checkbox",
    icon: <div className="h-4 w-4 rounded bg-green-300" />,
  },
  {
    id: "radio-group",
    name: "Radio Group",
    type: "radio-group",
    icon: <div className="h-4 w-4 rounded bg-red-300" />,
  },
  {
    id: "switch",
    name: "Switch",
    type: "switch",
    icon: <div className="h-4 w-4 rounded bg-blue-300" />,
  },
  {
    id: "slider",
    name: "Slider",
    type: "slider",
    icon: <div className="h-4 w-4 rounded bg-purple-300" />,
  },
  {
    id: "select",
    name: "Select",
    type: "select",
    icon: <div className="h-4 w-4 rounded bg-red-400" />,
  },
  {
    id: "progress",
    name: "Progress",
    type: "progress",
    icon: <div className="h-4 w-4 rounded bg-indigo-400" />,
  },
  {
    id: "avatar",
    name: "Avatar",
    type: "avatar",
    icon: <div className="h-4 w-4 rounded bg-pink-400" />,
  },
  {
    id: "toggle",
    name: "Toggle",
    type: "toggle",
    icon: <div className="h-4 w-4 rounded bg-orange-400" />,
  },
  // Next.js components
  {
    id: "Image",
    name: "Image",
    type: "Image",
    icon: <div className="h-4 w-4 rounded bg-teal-400" />,
  },
  {
    id: "Input",
    name: "Input (Next.js)",
    type: "Input",
    icon: <div className="h-4 w-4 rounded bg-teal-300" />,
  },
  {
    id: "Script",
    name: "Script",
    type: "Script",
    icon: <div className="h-4 w-4 rounded bg-teal-200" />,
  },
  {
    id: "Head",
    name: "Head",
    type: "Head",
    icon: <div className="h-4 w-4 rounded bg-teal-100" />,
  },
];


const heroSection: TreeItem[] = [
  {
    id: "hero-section",
    name: "Hero Section",
    type: "section",
    icon: <div className="h-4 w-4 rounded bg-indigo-500" />,
    allowsChildren: true,
    props: { className: "bg-gray-100 py-12" },
    children: [
      {
        id: "hero-container",
        name: "Hero Container",
        type: "div",
        icon: <div className="h-4 w-4 rounded bg-gray-500" />,
        props: { className: "container mx-auto px-4 text-center" },
        allowsChildren: true,
        children: [
          {
            id: "hero-title",
            name: "Hero Title",
            type: "h1",
            icon: <div className="h-4 w-4 rounded bg-blue-500" />,
            props: {
              className: "text-5xl font-bold leading-tight text-gray-900 mb-4",
            },
            allowsChildren: false,
            children: [
              {
                id: "text-hero-title",
                name: "Text Hero Title",
                type: "text",
                icon: <div className="h-4 w-4 rounded bg-blue-300" />,
                allowsChildren: false,
                props: { content: "Empower Your Business" },
              },
            ],
          },
          {
            id: "hero-subtitle",
            name: "Hero Subtitle",
            type: "h2",
            icon: <div className="h-4 w-4 rounded bg-green-500" />,
            props: {
              className: "text-2xl font-medium text-gray-700 mb-6",
            },
            allowsChildren: false,
            children: [
              {
                id: "text-hero-subtitle",
                name: "Text Hero Subtitle",
                type: "text",
                icon: <div className="h-4 w-4 rounded bg-green-300" />,
                allowsChildren: false,
                props: {
                  content: "Solutions that drive performance and efficiency",
                },
              },
            ],
          },
          {
            id: "hero-cta-group",
            name: "Hero CTA Group",
            type: "div",
            icon: <div className="h-4 w-4 rounded bg-purple-500" />,
            props: {
              className: "mt-8 flex justify-center space-x-4",
            },
            allowsChildren: true,
            children: [
              {
                id: "hero-primary-cta",
                name: "Primary CTA",
                type: "button",
                icon: <div className="h-4 w-4 rounded bg-blue-500" />,
                props: {
                  className:
                    "px-6 py-3 bg-indigo-600 text-white font-semibold rounded-lg hover:bg-indigo-700 transition",
                  onClick: "handlePrimaryClick",
                },
                allowsChildren: false,
                children: [
                  {
                    id: "text-hero-primary-cta",
                    name: "Text Primary CTA",
                    type: "text",
                    icon: <div className="h-4 w-4 rounded bg-blue-300" />,
                    allowsChildren: false,
                    props: { content: "Get Started" },
                  },
                ],
              },
              {
                id: "hero-secondary-cta",
                name: "Secondary CTA",
                type: "button",
                icon: <div className="h-4 w-4 rounded bg-gray-500" />,
                props: {
                  className:
                    "px-6 py-3 bg-gray-100 text-gray-800 font-semibold rounded-lg hover:bg-gray-200 transition",
                  onClick: "handleSecondaryClick",
                },
                allowsChildren: false,
                children: [
                  {
                    id: "text-hero-secondary-cta",
                    name: "Text Secondary CTA",
                    type: "text",
                    icon: <div className="h-4 w-4 rounded bg-gray-300" />,
                    allowsChildren: false,
                    props: { content: "Learn More" },
                  },
                ],
              },
            ],
          },
        ],
      },
    ],
  },
];

const heroSection3: TreeItem[] = [
  {
    "id": "rz0expmy2",
    "name": "Hero Section",
    "type": "section",
    "props": {
      "className": "w-full py-12 md:py-24 lg:py-32 xl:py-48 bg-muted"
    },
    "allowsChildren": true,
    "children": [
      {
        "id": "i8ir083zy",
        "name": "div",
        "type": "div",
        "props": {
          "className": "container px-4 md:px-6"
        },
        "allowsChildren": true,
        "children": [
          {
            "id": "3r3q0ajzo",
            "name": "div",
            "type": "div",
            "props": {
              "className": "grid gap-6 lg:grid-cols-[1fr_400px] lg:gap-12 xl:grid-cols-[1fr_550px]"
            },
            "allowsChildren": true,
            "children": [
              {
                "id": "0ckf1ck9p",
                "name": "div",
                "type": "div",
                "props": {
                  "className": "flex flex-col justify-center space-y-4"
                },
                "allowsChildren": true,
                "children": [
                  {
                    "id": "wx0tjsmrb",
                    "name": "div",
                    "type": "div",
                    "props": {
                      "className": "space-y-2"
                    },
                    "allowsChildren": true,
                    "children": [
                      {
                        "id": "y4zmi3dab",
                        "name": "h1",
                        "type": "h1",
                        "props": {
                          "className": "text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl lg:text-6xl/none"
                        },
                        "allowsChildren": true,
                        "children": [
                          {
                            "id": "1727149211031x3njszzsc",
                            "name": "Text",
                            "type": "text",
                            "allowsChildren": false,
                            "children": [],
                            "props": {
                              "content": "Unlock the Power of Web Development"
                            },
                            icon: undefined
                          }
                        ],
                        icon: undefined
                      },
                      {
                        "id": "6f01qla5s",
                        "name": "p",
                        "type": "p",
                        "props": {
                          "className": "max-w-[600px] text-gray-500 md:text-xl dark:text-gray-400"
                        },
                        "allowsChildren": true,
                        "children": [
                          {
                            "id": "1727149211034cz6qpgwn0",
                            "name": "Text",
                            "type": "text",
                            "allowsChildren": false,
                            "children": [],
                            "props": {
                              "content": "Streamline your web development workflow with our cutting-edge tools and services. Unleash your\n                creativity and deliver stunning, high-performing websites."
                            },
                            icon: undefined
                          }
                        ],
                        icon: undefined
                      }
                    ],
                    icon: undefined
                  },
                  {
                    "id": "8p9hwmku2",
                    "name": "div",
                    "type": "div",
                    "props": {
                      "className": "w-full max-w-sm space-y-2"
                    },
                    "allowsChildren": true,
                    "children": [
                      {
                        "id": "bejv5n3lc",
                        "name": "form",
                        "type": "form",
                        "props": {
                          "className": "flex space-x-2"
                        },
                        "allowsChildren": true,
                        "children": [
                          {
                            "id": "8r9bgolks",
                            "name": "Input",
                            "type": "Input",
                            "props": {
                              "type": "email",
                              "placeholder": "Enter your email",
                              "className": "max-w-lg flex-1"
                            },
                            "allowsChildren": true,
                            "children": [],
                            icon: undefined
                          },
                          {
                            "id": "kctio3wr1",
                            "name": "Button",
                            "type": "Button",
                            "props": {
                              "type": "submit"
                            },
                            "allowsChildren": true,
                            "children": [
                              {
                                "id": "1727149211037zbnp67jws",
                                "name": "Text",
                                "type": "text",
                                "allowsChildren": false,
                                "children": [],
                                "props": {
                                  "content": "Get Started"
                                },
                                icon: undefined
                              }
                            ],
                            icon: undefined
                          }
                        ],
                        icon: undefined
                      },
                      {
                        "id": "1m38gzb8l",
                        "name": "p",
                        "type": "p",
                        "props": {
                          "className": "text-xs text-gray-500 dark:text-gray-400"
                        },
                        "allowsChildren": true,
                        "children": [
                          {
                            "id": "172714921103875rayu9ot",
                            "name": "Text",
                            "type": "text",
                            "allowsChildren": false,
                            "children": [],
                            "props": {
                              "content": "Sign up to unlock exclusive features and early access."
                            },
                            icon: undefined
                          },
                          {
                            "id": "uss2jhjod",
                            "name": "Link",
                            "type": "Link",
                            "props": {
                              "href": "#",
                              "className": "underline underline-offset-2",
                              "prefetch": null
                            },
                            "allowsChildren": true,
                            "children": [
                              {
                                "id": "172714921103836ohab84h",
                                "name": "Text",
                                "type": "text",
                                "allowsChildren": false,
                                "children": [],
                                "props": {
                                  "content": "Terms & Conditions"
                                },
                                icon: undefined
                              }
                            ],
                            icon: undefined
                          }
                        ],
                        icon: undefined
                      }
                    ],
                    icon: undefined
                  }
                ],
                icon: undefined
              },
              {
                "id": "ru1walu34",
                "name": "img",
                "type": "img",
                "props": {
                  "src": "/placeholder.svg",
                  "width": "550",
                  "height": "400",
                  "alt": "Hero",
                  "className": "mx-auto aspect-[4/3] overflow-hidden rounded-xl object-cover object-center sm:w-full lg:order-last"
                },
                "allowsChildren": true,
                "children": [],
                icon: undefined
              }
            ],
            icon: undefined
          }
        ],
        icon: undefined
      }
    ],
    icon: undefined
  }
]

const featureSection: TreeItem[] = [
  {
    id: "feature-section",
    name: "Feature Section",
    type: "section",
    icon: <div className="h-4 w-4 rounded bg-teal-500" />,
    props: { className: "bg-white py-12" },
    allowsChildren: true,
    children: [
      {
        id: "feature-container",
        name: "Feature Container",
        type: "div",
        icon: <div className="h-4 w-4 rounded bg-gray-500" />,
        props: { className: "container mx-auto px-4 grid grid-cols-1 md:grid-cols-3 gap-8" },
        allowsChildren: true,
        children: [
          {
            id: "feature-item-1",
            name: "Feature Item 1",
            type: "div",
            icon: <div className="h-4 w-4 rounded bg-indigo-500" />,
            props: { className: "text-center" },
            allowsChildren: true,
            children: [
              {
                id: "feature-icon-1",
                name: "Feature Icon 1",
                type: "icon",
                icon: <div className="h-4 w-4 rounded bg-blue-500" />,
                props: { className: "mb-4 text-indigo-600" },
                allowsChildren: false,
              },
              {
                id: "feature-title-1",
                name: "Feature Title 1",
                type: "h3",
                icon: <div className="h-4 w-4 rounded bg-indigo-300" />,
                props: { className: "text-lg font-semibold text-gray-900" },
                allowsChildren: false,
                children: [
                  {
                    id: "text-feature-title-1",
                    name: "Text Feature Title 1",
                    type: "text",
                    props: { content: "Fast Performance" },
                    icon: undefined
                  },
                ],
              },
              {
                id: "feature-description-1",
                name: "Feature Description 1",
                type: "p",
                icon: <div className="h-4 w-4 rounded bg-gray-300" />,
                props: { className: "mt-2 text-gray-600" },
                allowsChildren: false,
                children: [
                  {
                    id: "text-feature-description-1",
                    name: "Text Feature Description 1",
                    type: "text",
                    props: { content: "Optimized for speed and efficiency." },
                    icon: undefined
                  },
                ],
              },
            ],
          },
          {
            id: "feature-item-1",
            name: "Feature Item 1",
            type: "div",
            icon: <div className="h-4 w-4 rounded bg-indigo-500" />,
            props: { className: "text-center" },
            allowsChildren: true,
            children: [
              {
                id: "feature-icon-1",
                name: "Feature Icon 1",
                type: "icon",
                icon: <div className="h-4 w-4 rounded bg-blue-500" />,
                props: { className: "mb-4 text-indigo-600" },
                allowsChildren: false,
              },
              {
                id: "feature-title-1",
                name: "Feature Title 1",
                type: "h3",
                icon: <div className="h-4 w-4 rounded bg-indigo-300" />,
                props: { className: "text-lg font-semibold text-gray-900" },
                allowsChildren: false,
                children: [
                  {
                    id: "text-feature-title-1",
                    name: "Text Feature Title 1",
                    type: "text",
                    props: { content: "Fast Performance" },
                    icon: undefined
                  },
                ],
              },
              {
                id: "feature-description-1",
                name: "Feature Description 1",
                type: "p",
                icon: <div className="h-4 w-4 rounded bg-gray-300" />,
                props: { className: "mt-2 text-gray-600" },
                allowsChildren: false,
                children: [
                  {
                    id: "text-feature-description-1",
                    name: "Text Feature Description 1",
                    type: "text",
                    props: { content: "Optimized for speed and efficiency." },
                    icon: undefined
                  },
                ],
              },
            ],
          },
          {
            id: "feature-item-1",
            name: "Feature Item 1",
            type: "div",
            icon: <div className="h-4 w-4 rounded bg-indigo-500" />,
            props: { className: "text-center" },
            allowsChildren: true,
            children: [
              {
                id: "feature-icon-1",
                name: "Feature Icon 1",
                type: "icon",
                icon: <div className="h-4 w-4 rounded bg-blue-500" />,
                props: { className: "mb-4 text-indigo-600" },
                allowsChildren: false,
              },
              {
                id: "feature-title-1",
                name: "Feature Title 1",
                type: "h3",
                icon: <div className="h-4 w-4 rounded bg-indigo-300" />,
                props: { className: "text-lg font-semibold text-gray-900" },
                allowsChildren: false,
                children: [
                  {
                    id: "text-feature-title-1",
                    name: "Text Feature Title 1",
                    type: "text",
                    props: { content: "Fast Performance" },
                    icon: undefined
                  },
                ],
              },
              {
                id: "feature-description-1",
                name: "Feature Description 1",
                type: "p",
                icon: <div className="h-4 w-4 rounded bg-gray-300" />,
                props: { className: "mt-2 text-gray-600" },
                allowsChildren: false,
                children: [
                  {
                    id: "text-feature-description-1",
                    name: "Text Feature Description 1",
                    type: "text",
                    props: { content: "Optimized for speed and efficiency." },
                    icon: undefined
                  },
                ],
              },
            ],
          },
        ],
      },
    ],
  },
];

const featureSection2: TreeItem[] = [
  {
    id: "feature-section",
    name: "Feature Section",
    type: "section",
    icon: <div className="h-4 w-4 rounded bg-teal-500" />,
    props: { className: "bg-white py-12" },
    allowsChildren: true,
    children: [
      {
        id: "feature-container",
        name: "Feature Container",
        type: "div",
        icon: <div className="h-4 w-4 rounded bg-gray-200" />,
        props: { className: "container mx-auto px-4 text-center" },
        allowsChildren: true,
        children: [
          {
            id: "feature-title",
            name: "Feature Title",
            type: "h2",
            icon: <div className="h-4 w-4 rounded bg-teal-300" />,
            props: { className: "text-3xl font-bold mb-6" },
            allowsChildren: false,
            children: [
              {
                id: "text-feature-title",
                name: "Text Feature Title",
                type: "text",
                props: { content: "Key Features" },
                icon: undefined
              },
            ],
          },
          {
            id: "feature-list",
            name: "Feature List",
            type: "div",
            icon: <div className="h-4 w-4 rounded bg-teal-200" />,
            props: { className: "grid grid-cols-1 md:grid-cols-3 gap-6" },
            allowsChildren: true,
            children: [
              {
                id: "feature-item-1",
                name: "Feature Item",
                type: "div",
                icon: <div className="h-4 w-4 rounded bg-teal-400" />,
                props: { className: "p-4 border rounded shadow" },
                allowsChildren: true,
                children: [
                  {
                    id: "feature-icon-1",
                    name: "Feature Icon",
                    type: "img",
                    props: { src: "/icon1.png", alt: "Feature 1", className: "h-12 mx-auto mb-2" },
                    allowsChildren: false,
                    icon: undefined
                  },
                  {
                    id: "feature-description-1",
                    name: "Feature Description",
                    type: "p",
                    props: { className: "text-lg" },
                    allowsChildren: false,
                    children: [
                      {
                        id: "text-feature-description-1",
                        name: "Text Feature Description",
                        type: "text",
                        props: { content: "Feature 1 description goes here." },
                        icon: undefined
                      },
                    ],
                    icon: undefined
                  },
                ],
              },
              {
                id: "feature-item-1",
                name: "Feature Item",
                type: "div",
                icon: <div className="h-4 w-4 rounded bg-teal-400" />,
                props: { className: "p-4 border rounded shadow" },
                allowsChildren: true,
                children: [
                  {
                    id: "feature-icon-1",
                    name: "Feature Icon",
                    type: "img",
                    props: { src: "/icon1.png", alt: "Feature 1", className: "h-12 mx-auto mb-2" },
                    allowsChildren: false,
                    icon: undefined
                  },
                  {
                    id: "feature-description-1",
                    name: "Feature Description",
                    type: "p",
                    props: { className: "text-lg" },
                    allowsChildren: false,
                    children: [
                      {
                        id: "text-feature-description-1",
                        name: "Text Feature Description",
                        type: "text",
                        props: { content: "Feature 1 description goes here." },
                        icon: undefined
                      },
                    ],
                    icon: undefined
                  },
                ],
              },
              {
                id: "feature-item-1",
                name: "Feature Item",
                type: "div",
                icon: <div className="h-4 w-4 rounded bg-teal-400" />,
                props: { className: "p-4 border rounded shadow" },
                allowsChildren: true,
                children: [
                  {
                    id: "feature-icon-1",
                    name: "Feature Icon",
                    type: "img",
                    props: { src: "/icon1.png", alt: "Feature 1", className: "h-12 mx-auto mb-2" },
                    allowsChildren: false,
                    icon: undefined
                  },
                  {
                    id: "feature-description-1",
                    name: "Feature Description",
                    type: "p",
                    props: { className: "text-lg" },
                    allowsChildren: false,
                    children: [
                      {
                        id: "text-feature-description-1",
                        name: "Text Feature Description",
                        type: "text",
                        props: { content: "Feature 1 description goes here." },
                        icon: undefined
                      },
                    ],
                    icon: undefined
                  },
                ],
              },
              // Add more feature items as needed
            ],
          },
        ],
      },
    ],
  },
];


const testimonialSection: TreeItem[] = [
  {
    id: "testimonial-section",
    name: "Testimonial Section",
    type: "section",
    icon: <div className="h-4 w-4 rounded bg-yellow-500" />,
    props: { className: "bg-gray-50 py-12" },
    allowsChildren: true,
    children: [
      {
        id: "testimonial-container",
        name: "Testimonial Container",
        type: "div",
        icon: <div className="h-4 w-4 rounded bg-gray-500" />,
        props: { className: "container mx-auto px-4 text-center" },
        allowsChildren: true,
        children: [
          {
            id: "testimonial-title",
            name: "Testimonial Title",
            type: "h2",
            icon: <div className="h-4 w-4 rounded bg-yellow-300" />,
            props: { className: "text-3xl font-semibold text-gray-900 mb-6" },
            allowsChildren: false,
            children: [
              {
                id: "text-testimonial-title",
                name: "Text Testimonial Title",
                type: "text",
                props: { content: "What Our Clients Say" },
                icon: undefined
              },
            ],
          },
          {
            id: "testimonial-grid",
            name: "Testimonial Grid",
            type: "div",
            icon: <div className="h-4 w-4 rounded bg-gray-300" />,
            props: { className: "grid grid-cols-1 md:grid-cols-3 gap-8" },
            allowsChildren: true,
            children: [
              {
                id: "testimonial-item-1",
                name: "Testimonial Item 1",
                type: "div",
                icon: <div className="h-4 w-4 rounded bg-yellow-400" />,
                props: { className: "p-4 bg-white shadow-lg rounded-md" },
                allowsChildren: true,
                children: [
                  {
                    id: "testimonial-content-1",
                    name: "Testimonial Content 1",
                    type: "p",
                    props: { className: "text-gray-700 mb-4" },
                    children: [
                      {
                        id: "text-testimonial-content-1",
                        name: "Text Testimonial Content 1",
                        type: "text",
                        props: { content: "This product has transformed our business!" },
                        icon: undefined
                      },
                    ],
                    icon: undefined
                  },
                  {
                    id: "testimonial-author-1",
                    name: "Testimonial Author 1",
                    type: "h3",
                    icon: <div className="h-4 w-4 rounded bg-gray-300" />,
                    props: { className: "font-semibold text-gray-900" },
                    allowsChildren: false,
                    children: [
                      {
                        id: "text-testimonial-author-1",
                        name: "Text Testimonial Author 1",
                        type: "text",
                        props: { content: "John Doe, CEO of Acme Inc." },
                        icon: undefined
                      },
                    ],
                  },
                ],
              },
              {
                id: "testimonial-item-1",
                name: "Testimonial Item 1",
                type: "div",
                icon: <div className="h-4 w-4 rounded bg-yellow-400" />,
                props: { className: "p-4 bg-white shadow-lg rounded-md" },
                allowsChildren: true,
                children: [
                  {
                    id: "testimonial-content-1",
                    name: "Testimonial Content 1",
                    type: "p",
                    props: { className: "text-gray-700 mb-4" },
                    children: [
                      {
                        id: "text-testimonial-content-1",
                        name: "Text Testimonial Content 1",
                        type: "text",
                        props: { content: "This product has transformed our business!" },
                        icon: undefined
                      },
                    ],
                    icon: undefined
                  },
                  {
                    id: "testimonial-author-1",
                    name: "Testimonial Author 1",
                    type: "h3",
                    icon: <div className="h-4 w-4 rounded bg-gray-300" />,
                    props: { className: "font-semibold text-gray-900" },
                    allowsChildren: false,
                    children: [
                      {
                        id: "text-testimonial-author-1",
                        name: "Text Testimonial Author 1",
                        type: "text",
                        props: { content: "John Doe, CEO of Acme Inc." },
                        icon: undefined
                      },
                    ],
                  },
                ],
              },
              {
                id: "testimonial-item-1",
                name: "Testimonial Item 1",
                type: "div",
                icon: <div className="h-4 w-4 rounded bg-yellow-400" />,
                props: { className: "p-4 bg-white shadow-lg rounded-md" },
                allowsChildren: true,
                children: [
                  {
                    id: "testimonial-content-1",
                    name: "Testimonial Content 1",
                    type: "p",
                    props: { className: "text-gray-700 mb-4" },
                    children: [
                      {
                        id: "text-testimonial-content-1",
                        name: "Text Testimonial Content 1",
                        type: "text",
                        props: { content: "This product has transformed our business!" },
                        icon: undefined
                      },
                    ],
                    icon: undefined
                  },
                  {
                    id: "testimonial-author-1",
                    name: "Testimonial Author 1",
                    type: "h3",
                    icon: <div className="h-4 w-4 rounded bg-gray-300" />,
                    props: { className: "font-semibold text-gray-900" },
                    allowsChildren: false,
                    children: [
                      {
                        id: "text-testimonial-author-1",
                        name: "Text Testimonial Author 1",
                        type: "text",
                        props: { content: "John Doe, CEO of Acme Inc." },
                        icon: undefined
                      },
                    ],
                  },
                ],
              },
              // Repetir para Testimonial Item 2 e 3
            ],
          },
        ],
      },
    ],
  },
];

const testimonialSection2: TreeItem[] = [
  {
    id: "testimonial-section",
    name: "Testimonial Section",
    type: "section",
    icon: <div className="h-4 w-4 rounded bg-blue-500" />,
    props: { className: "bg-gray-100 py-12" },
    allowsChildren: true,
    children: [
      {
        id: "testimonial-container",
        name: "Testimonial Container",
        type: "div",
        icon: <div className="h-4 w-4 rounded bg-gray-300" />,
        props: { className: "container mx-auto px-4 text-center" },
        allowsChildren: true,
        children: [
          {
            id: "testimonial-title",
            name: "Testimonial Title",
            type: "h2",
            icon: <div className="h-4 w-4 rounded bg-blue-300" />,
            props: { className: "text-3xl font-bold mb-6" },
            allowsChildren: false,
            children: [
              {
                id: "text-testimonial-title",
                name: "Text Testimonial Title",
                type: "text",
                props: { content: "What Our Clients Say" },
                icon: undefined
              },
            ],
          },
          {
            id: "testimonial-list",
            name: "Testimonial List",
            type: "ul",
            icon: <div className="h-4 w-4 rounded bg-blue-200" />,
            props: { className: "space-y-6" },
            allowsChildren: true,
            children: [
              {
                id: "testimonial-item-1",
                name: "Testimonial Item",
                type: "li",
                icon: <div className="h-4 w-4 rounded bg-blue-400" />,
                props: {},
                allowsChildren: true,
                children: [
                  {
                    id: "testimonial-content-1",
                    name: "Testimonial Content",
                    type: "text",
                    props: { content: "This product changed my life! Highly recommend." },
                    icon: undefined
                  },
                  {
                    id: "testimonial-author-1",
                    name: "Testimonial Author",
                    type: "text",
                    props: { content: "- John Doe" },
                    icon: undefined
                  },
                ],
              },
              {
                id: "testimonial-item-2",
                name: "Testimonial Item",
                type: "li",
                icon: <div className="h-4 w-4 rounded bg-blue-400" />,
                props: {},
                allowsChildren: true,
                children: [
                  {
                    id: "testimonial-content-2",
                    name: "Testimonial Content",
                    type: "text",
                    props: { content: "Amazing service and support. Will use again!" },
                    icon: undefined
                  },
                  {
                    id: "testimonial-author-2",
                    name: "Testimonial Author",
                    type: "text",
                    props: { content: "- Jane Smith" },
                    icon: undefined
                  },
                ],
              },
            ],
          },
        ],
      },
    ],
  },
];


const pricingSection: TreeItem[] = [
  {
    "id": "03g6ulgie",
    "name": "Pricing Section",
    "type": "section",
    "props": {
      "className": "w-full py-12 bg-gradient-to-r from-gray-50 to-gray-100 dark:from-zinc-900 dark:to-zinc-800 flex items-center justify-center"
    },
    "allowsChildren": true,
    "children": [
      {
        "id": "7eatb334q",
        "name": "div",
        "type": "div",
        "props": {
          "className": "container px-4 md:px-6"
        },
        "allowsChildren": true,
        "children": [
          {
            "id": "vlecj1ugv",
            "name": "div",
            "type": "div",
            "props": {
              "className": "grid grid-cols-1 gap-6 mt-8 md:grid-cols-3 md:gap-8"
            },
            "allowsChildren": true,
            "children": [
              {
                "id": "zsp3vl3zd",
                "name": "div",
                "type": "div",
                "props": {
                  "className": "flex flex-col p-6 bg-white shadow-lg rounded-lg dark:bg-zinc-850 justify-between border border-gray-300"
                },
                "allowsChildren": true,
                "children": [
                  {
                    "id": "bpblw3e25",
                    "name": "div",
                    "type": "div",
                    "props": {},
                    "allowsChildren": true,
                    "children": [
                      {
                        "id": "pb7ukyim6",
                        "name": "h3",
                        "type": "h3",
                        "props": {
                          "className": "text-2xl font-bold text-center"
                        },
                        "allowsChildren": true,
                        "children": [
                          {
                            "id": "17271496851633cuzp4dqz",
                            "name": "Text",
                            "type": "text",
                            "allowsChildren": false,
                            "children": [],
                            "props": {
                              "content": "Basic"
                            },
                            icon: undefined
                          }
                        ],
                        icon: undefined
                      },
                      {
                        "id": "6ke2ye5da",
                        "name": "div",
                        "type": "div",
                        "props": {
                          "className": "mt-4 text-center text-zinc-600 dark:text-zinc-400"
                        },
                        "allowsChildren": true,
                        "children": [
                          {
                            "id": "n15mb7nii",
                            "name": "span",
                            "type": "span",
                            "props": {
                              "className": "text-4xl font-bold"
                            },
                            "allowsChildren": true,
                            "children": [
                              {
                                "id": "1727149685164ga9kf8gea",
                                "name": "Text",
                                "type": "text",
                                "allowsChildren": false,
                                "children": [],
                                "props": {
                                  "content": "$29"
                                },
                                icon: undefined
                              }
                            ],
                            icon: undefined
                          },
                          {
                            "id": "1727149685164digr2utwa",
                            "name": "Text",
                            "type": "text",
                            "allowsChildren": false,
                            "children": [],
                            "props": {
                              "content": "/ month"
                            },
                            icon: undefined
                          }
                        ],
                        icon: undefined
                      },
                      {
                        "id": "0astix3fl",
                        "name": "ul",
                        "type": "ul",
                        "props": {
                          "className": "mt-4 space-y-2"
                        },
                        "allowsChildren": true,
                        "children": [
                          {
                            "id": "rgbnx548d",
                            "name": "li",
                            "type": "li",
                            "props": {
                              "className": "flex items-center"
                            },
                            "allowsChildren": true,
                            "children": [
                              {
                                "id": "sylozhhyt",
                                "name": "CheckIcon",
                                "type": "CheckIcon",
                                "props": {
                                  "className": "text-white text-xs bg-green-500 rounded-full mr-2 p-1"
                                },
                                "allowsChildren": true,
                                "children": [],
                                icon: undefined
                              },
                              {
                                "id": "1727149685165n9w28wax1",
                                "name": "Text",
                                "type": "text",
                                "allowsChildren": false,
                                "children": [],
                                "props": {
                                  "content": "720p Video Rendering"
                                },
                                icon: undefined
                              }
                            ],
                            icon: undefined
                          },
                          {
                            "id": "e5hl8jpyw",
                            "name": "li",
                            "type": "li",
                            "props": {
                              "className": "flex items-center"
                            },
                            "allowsChildren": true,
                            "children": [
                              {
                                "id": "i3skprfgc",
                                "name": "CheckIcon",
                                "type": "CheckIcon",
                                "props": {
                                  "className": "text-white text-xs bg-green-500 rounded-full mr-2 p-1"
                                },
                                "allowsChildren": true,
                                "children": [],
                                icon: undefined
                              },
                              {
                                "id": "17271496851661dzbolhi4",
                                "name": "Text",
                                "type": "text",
                                "allowsChildren": false,
                                "children": [],
                                "props": {
                                  "content": "2GB Cloud Storage"
                                },
                                icon: undefined
                              }
                            ],
                            icon: undefined
                          },
                          {
                            "id": "nxwcguc85",
                            "name": "li",
                            "type": "li",
                            "props": {
                              "className": "flex items-center"
                            },
                            "allowsChildren": true,
                            "children": [
                              {
                                "id": "yxcl0jcij",
                                "name": "CheckIcon",
                                "type": "CheckIcon",
                                "props": {
                                  "className": "text-white text-xs bg-green-500 rounded-full mr-2 p-1"
                                },
                                "allowsChildren": true,
                                "children": [],
                                icon: undefined
                              },
                              {
                                "id": "17271496851662c66ptn8a",
                                "name": "Text",
                                "type": "text",
                                "allowsChildren": false,
                                "children": [],
                                "props": {
                                  "content": "Basic Video Templates"
                                },
                                icon: undefined
                              }
                            ],
                            icon: undefined
                          }
                        ],
                        icon: undefined
                      }
                    ],
                    icon: undefined
                  },
                  {
                    "id": "gpw9djbzw",
                    "name": "div",
                    "type": "div",
                    "props": {
                      "className": "mt-6"
                    },
                    "allowsChildren": true,
                    "children": [
                      {
                        "id": "jcvg1vsjr",
                        "name": "Button",
                        "type": "Button",
                        "props": {
                          "className": "w-full"
                        },
                        "allowsChildren": true,
                        "children": [
                          {
                            "id": "17271496851670c57rkl0e",
                            "name": "Text",
                            "type": "text",
                            "allowsChildren": false,
                            "children": [],
                            "props": {
                              "content": "Get Started"
                            },
                            icon: undefined
                          }
                        ],
                        icon: undefined
                      }
                    ],
                    icon: undefined
                  }
                ],
                icon: undefined
              },
              {
                "id": "wfuuehzzr",
                "name": "div",
                "type": "div",
                "props": {
                  "className": "relative flex flex-col p-6 bg-white shadow-lg rounded-lg dark:bg-zinc-850 justify-between border border-purple-500"
                },
                "allowsChildren": true,
                "children": [
                  {
                    "id": "06lcab3c5",
                    "name": "div",
                    "type": "div",
                    "props": {},
                    "allowsChildren": true,
                    "children": [
                      {
                        "id": "jpghffqmj",
                        "name": "h3",
                        "type": "h3",
                        "props": {
                          "className": "text-2xl font-bold text-center"
                        },
                        "allowsChildren": true,
                        "children": [
                          {
                            "id": "17271496851721w8hxgwj4",
                            "name": "Text",
                            "type": "text",
                            "allowsChildren": false,
                            "children": [],
                            "props": {
                              "content": "Pro"
                            },
                            icon: undefined
                          }
                        ],
                        icon: undefined
                      },
                      {
                        "id": "akn4uscqg",
                        "name": "div",
                        "type": "div",
                        "props": {
                          "className": "mt-4 text-center text-zinc-600 dark:text-zinc-400"
                        },
                        "allowsChildren": true,
                        "children": [
                          {
                            "id": "6a2151pun",
                            "name": "span",
                            "type": "span",
                            "props": {
                              "className": "text-4xl font-bold"
                            },
                            "allowsChildren": true,
                            "children": [
                              {
                                "id": "1727149685173onqsiowoc",
                                "name": "Text",
                                "type": "text",
                                "allowsChildren": false,
                                "children": [],
                                "props": {
                                  "content": "$59"
                                },
                                icon: undefined
                              }
                            ],
                            icon: undefined
                          },
                          {
                            "id": "1727149685173zxi1yuw6q",
                            "name": "Text",
                            "type": "text",
                            "allowsChildren": false,
                            "children": [],
                            "props": {
                              "content": "/ month"
                            },
                            icon: undefined
                          }
                        ],
                        icon: undefined
                      },
                      {
                        "id": "fkf7wznd2",
                        "name": "ul",
                        "type": "ul",
                        "props": {
                          "className": "mt-4 space-y-2"
                        },
                        "allowsChildren": true,
                        "children": [
                          {
                            "id": "hud93q4bq",
                            "name": "li",
                            "type": "li",
                            "props": {
                              "className": "flex items-center"
                            },
                            "allowsChildren": true,
                            "children": [
                              {
                                "id": "7jjn82aux",
                                "name": "CheckIcon",
                                "type": "CheckIcon",
                                "props": {
                                  "className": "text-white text-2xs bg-green-500 rounded-full mr-2 p-1"
                                },
                                "allowsChildren": true,
                                "children": [],
                                icon: undefined
                              },
                              {
                                "id": "17271496851747mod87qma",
                                "name": "Text",
                                "type": "text",
                                "allowsChildren": false,
                                "children": [],
                                "props": {
                                  "content": "1080p Video Rendering"
                                },
                                icon: undefined
                              }
                            ],
                            icon: undefined
                          },
                          {
                            "id": "jgpfzy9f5",
                            "name": "li",
                            "type": "li",
                            "props": {
                              "className": "flex items-center"
                            },
                            "allowsChildren": true,
                            "children": [
                              {
                                "id": "o1ttx8aet",
                                "name": "CheckIcon",
                                "type": "CheckIcon",
                                "props": {
                                  "className": "text-white text-xs bg-green-500 rounded-full mr-2 p-1"
                                },
                                "allowsChildren": true,
                                "children": [],
                                icon: undefined
                              },
                              {
                                "id": "1727149685175lpgxpy08u",
                                "name": "Text",
                                "type": "text",
                                "allowsChildren": false,
                                "children": [],
                                "props": {
                                  "content": "10GB Cloud Storage"
                                },
                                icon: undefined
                              }
                            ],
                            icon: undefined
                          },
                          {
                            "id": "vtj7q0czy",
                            "name": "li",
                            "type": "li",
                            "props": {
                              "className": "flex items-center"
                            },
                            "allowsChildren": true,
                            "children": [
                              {
                                "id": "tzjlv3qwr",
                                "name": "CheckIcon",
                                "type": "CheckIcon",
                                "props": {
                                  "className": "text-white text-xs bg-green-500 rounded-full mr-2 p-1"
                                },
                                "allowsChildren": true,
                                "children": [],
                                icon: undefined
                              },
                              {
                                "id": "17271496851750navc9wfa",
                                "name": "Text",
                                "type": "text",
                                "allowsChildren": false,
                                "children": [],
                                "props": {
                                  "content": "Premium Video Templates"
                                },
                                icon: undefined
                              }
                            ],
                            icon: undefined
                          },
                          {
                            "id": "39ialuif6",
                            "name": "li",
                            "type": "li",
                            "props": {
                              "className": "flex items-center"
                            },
                            "allowsChildren": true,
                            "children": [
                              {
                                "id": "gha2y5haa",
                                "name": "CheckIcon",
                                "type": "CheckIcon",
                                "props": {
                                  "className": "text-white text-xs bg-green-500 rounded-full mr-2 p-1"
                                },
                                "allowsChildren": true,
                                "children": [],
                                icon: undefined
                              },
                              {
                                "id": "1727149685176vt7r5b2mf",
                                "name": "Text",
                                "type": "text",
                                "allowsChildren": false,
                                "children": [],
                                "props": {
                                  "content": "Collaboration Tools"
                                },
                                icon: undefined
                              }
                            ],
                            icon: undefined
                          }
                        ],
                        icon: undefined
                      }
                    ],
                    icon: undefined
                  },
                  {
                    "id": "wyol35ukz",
                    "name": "div",
                    "type": "div",
                    "props": {
                      "className": "mt-6"
                    },
                    "allowsChildren": true,
                    "children": [
                      {
                        "id": "gd5xnw1ot",
                        "name": "Button",
                        "type": "Button",
                        "props": {
                          "className": "w-full bg-gradient-to-r from-pink-500 to-purple-500"
                        },
                        "allowsChildren": true,
                        "children": [
                          {
                            "id": "1727149685176804u3zizj",
                            "name": "Text",
                            "type": "text",
                            "allowsChildren": false,
                            "children": [],
                            "props": {
                              "content": "Get Started"
                            },
                            icon: undefined
                          }
                        ],
                        icon: undefined
                      }
                    ],
                    icon: undefined
                  }
                ],
                icon: undefined
              },
              {
                "id": "wugte66ju",
                "name": "div",
                "type": "div",
                "props": {
                  "className": "flex flex-col p-6 bg-white shadow-lg rounded-lg dark:bg-zinc-850 justify-between border border-gray-300"
                },
                "allowsChildren": true,
                "children": [
                  {
                    "id": "mi9driamw",
                    "name": "div",
                    "type": "div",
                    "props": {},
                    "allowsChildren": true,
                    "children": [
                      {
                        "id": "y0ih7k855",
                        "name": "h3",
                        "type": "h3",
                        "props": {
                          "className": "text-2xl font-bold text-center"
                        },
                        "allowsChildren": true,
                        "children": [
                          {
                            "id": "1727149685179dwzwkab0o",
                            "name": "Text",
                            "type": "text",
                            "allowsChildren": false,
                            "children": [],
                            "props": {
                              "content": "Enterprise"
                            },
                            icon: undefined
                          }
                        ],
                        icon: undefined
                      },
                      {
                        "id": "6vhjc1g8a",
                        "name": "div",
                        "type": "div",
                        "props": {
                          "className": "mt-4 text-center text-zinc-600 dark:text-zinc-400"
                        },
                        "allowsChildren": true,
                        "children": [
                          {
                            "id": "zhtxqa479",
                            "name": "span",
                            "type": "span",
                            "props": {
                              "className": "text-4xl font-bold"
                            },
                            "allowsChildren": true,
                            "children": [
                              {
                                "id": "1727149685179bupp3q68h",
                                "name": "Text",
                                "type": "text",
                                "allowsChildren": false,
                                "children": [],
                                "props": {
                                  "content": "$99"
                                },
                                icon: undefined
                              }
                            ],
                            icon: undefined
                          },
                          {
                            "id": "1727149685179qirbet9dk",
                            "name": "Text",
                            "type": "text",
                            "allowsChildren": false,
                            "children": [],
                            "props": {
                              "content": "/ month"
                            },
                            icon: undefined
                          }
                        ],
                        icon: undefined
                      },
                      {
                        "id": "9lkc2n4yh",
                        "name": "ul",
                        "type": "ul",
                        "props": {
                          "className": "mt-4 space-y-2"
                        },
                        "allowsChildren": true,
                        "children": [
                          {
                            "id": "kiwh14axz",
                            "name": "li",
                            "type": "li",
                            "props": {
                              "className": "flex items-center"
                            },
                            "allowsChildren": true,
                            "children": [
                              {
                                "id": "rwduxvuow",
                                "name": "CheckIcon",
                                "type": "CheckIcon",
                                "props": {
                                  "className": "text-white text-xs bg-green-500 rounded-full mr-2 p-1"
                                },
                                "allowsChildren": true,
                                "children": [],
                                icon: undefined
                              },
                              {
                                "id": "1727149685180g5c388soj",
                                "name": "Text",
                                "type": "text",
                                "allowsChildren": false,
                                "children": [],
                                "props": {
                                  "content": "4K Video Rendering"
                                },
                                icon: undefined
                              }
                            ],
                            icon: undefined
                          },
                          {
                            "id": "2186d1tuv",
                            "name": "li",
                            "type": "li",
                            "props": {
                              "className": "flex items-center"
                            },
                            "allowsChildren": true,
                            "children": [
                              {
                                "id": "hycjwbzix",
                                "name": "CheckIcon",
                                "type": "CheckIcon",
                                "props": {
                                  "className": "text-white text-xs bg-green-500 rounded-full mr-2 p-1"
                                },
                                "allowsChildren": true,
                                "children": [],
                                icon: undefined
                              },
                              {
                                "id": "17271496851814tneqhwec",
                                "name": "Text",
                                "type": "text",
                                "allowsChildren": false,
                                "children": [],
                                "props": {
                                  "content": "Unlimited Cloud Storage"
                                },
                                icon: undefined
                              }
                            ],
                            icon: undefined
                          },
                          {
                            "id": "5d4r22o1k",
                            "name": "li",
                            "type": "li",
                            "props": {
                              "className": "flex items-center"
                            },
                            "allowsChildren": true,
                            "children": [
                              {
                                "id": "itvx7b85o",
                                "name": "CheckIcon",
                                "type": "CheckIcon",
                                "props": {
                                  "className": "text-white text-xs bg-green-500 rounded-full mr-2 p-1"
                                },
                                "allowsChildren": true,
                                "children": [],
                                icon: undefined
                              },
                              {
                                "id": "1727149685181u5l8f6zpc",
                                "name": "Text",
                                "type": "text",
                                "allowsChildren": false,
                                "children": [],
                                "props": {
                                  "content": "Custom Video Templates"
                                },
                                icon: undefined
                              }
                            ],
                            icon: undefined
                          },
                          {
                            "id": "o15wa3hm9",
                            "name": "li",
                            "type": "li",
                            "props": {
                              "className": "flex items-center"
                            },
                            "allowsChildren": true,
                            "children": [
                              {
                                "id": "dancq4f4d",
                                "name": "CheckIcon",
                                "type": "CheckIcon",
                                "props": {
                                  "className": "text-white text-xs bg-green-500 rounded-full mr-2 p-1"
                                },
                                "allowsChildren": true,
                                "children": [],
                                icon: undefined
                              },
                              {
                                "id": "17271496851826d6xdox45",
                                "name": "Text",
                                "type": "text",
                                "allowsChildren": false,
                                "children": [],
                                "props": {
                                  "content": "Advanced Collaboration Tools"
                                },
                                icon: undefined
                              }
                            ],
                            icon: undefined
                          },
                          {
                            "id": "la3emiebf",
                            "name": "li",
                            "type": "li",
                            "props": {
                              "className": "flex items-center"
                            },
                            "allowsChildren": true,
                            "children": [
                              {
                                "id": "tbu4586ur",
                                "name": "CheckIcon",
                                "type": "CheckIcon",
                                "props": {
                                  "className": "text-white text-xs bg-green-500 rounded-full mr-2 p-1"
                                },
                                "allowsChildren": true,
                                "children": [],
                                icon: undefined
                              },
                              {
                                "id": "1727149685182erngc660k",
                                "name": "Text",
                                "type": "text",
                                "allowsChildren": false,
                                "children": [],
                                "props": {
                                  "content": "Dedicated Support"
                                },
                                icon: undefined
                              }
                            ],
                            icon: undefined
                          }
                        ],
                        icon: undefined
                      }
                    ],
                    icon: undefined
                  },
                  {
                    "id": "xo1nh1mq1",
                    "name": "div",
                    "type": "div",
                    "props": {
                      "className": "mt-6"
                    },
                    "allowsChildren": true,
                    "children": [
                      {
                        "id": "c6lkg1zmw",
                        "name": "Button",
                        "type": "Button",
                        "props": {
                          "className": "w-full"
                        },
                        "allowsChildren": true,
                        "children": [
                          {
                            "id": "1727149685183lp5131azf",
                            "name": "Text",
                            "type": "text",
                            "allowsChildren": false,
                            "children": [],
                            "props": {
                              "content": "Get Started"
                            },
                            icon: undefined
                          }
                        ],
                        icon: undefined
                      }
                    ],
                    icon: undefined
                  }
                ],
                icon: undefined
              }
            ],
            icon: undefined
          }
        ],
        icon: undefined
      }
    ],
    icon: undefined
  }
]

const callToActionSection: TreeItem[] = [
  {
    id: "cta-section",
    name: "Call To Action Section",
    type: "section",
    icon: <div className="h-4 w-4 rounded bg-purple-500" />,
    props: { className: "bg-purple-600 py-12" },
    allowsChildren: true,
    children: [
      {
        id: "cta-container",
        name: "CTA Container",
        type: "div",
        icon: <div className="h-4 w-4 rounded bg-gray-500" />,
        props: { className: "container mx-auto px-4 text-center" },
        allowsChildren: true,
        children: [
          {
            id: "cta-title",
            name: "CTA Title",
            type: "h2",
            icon: <div className="h-4 w-4 rounded bg-purple-300" />,
            props: { className: "text-4xl font-bold text-white mb-4" },
            allowsChildren: false,
            children: [
              {
                id: "text-cta-title",
                name: "Text CTA Title",
                type: "text",
                props: { content: "Get Started Today!" },
                icon: undefined
              },
            ],
          },
          {
            id: "cta-description",
            name: "CTA Description",
            type: "p",
            icon: <div className="h-4 w-4 rounded bg-gray-300" />,
            props: { className: "text-lg text-white mb-8" },
            allowsChildren: false,
            children: [
              {
                id: "text-cta-description",
                name: "Text CTA Description",
                type: "text",
                props: { content: "Join us now and transform your business." },
                icon: undefined
              },
            ],
          },
          {
            id: "cta-button",
            name: "CTA Button",
            type: "button",
            icon: <div className="h-4 w-4 rounded bg-purple-700" />,
            props: { className: "bg-white text-purple-600 py-3 px-6 rounded-lg font-semibold" },
            allowsChildren: false,
            children: [
              {
                id: "text-cta-button",
                name: "Text CTA Button",
                type: "text",
                props: { content: "Start Free Trial" },
                icon: undefined
              },
            ],
          },
        ],
      },
    ],
  },
];

const heroSection2: TreeItem[] = [
  {
    id: "hero-section",
    name: "Hero Section",
    type: "section",
    icon: <div className="h-4 w-4 rounded bg-blue-500" />,
    props: { className: "bg-gray-900 text-white py-24" },
    allowsChildren: true,
    children: [
      {
        id: "hero-container",
        name: "Hero Container",
        type: "div",
        icon: <div className="h-4 w-4 rounded bg-gray-500" />,
        props: { className: "container mx-auto px-4 text-center" },
        allowsChildren: true,
        children: [
          {
            id: "hero-title",
            name: "Hero Title",
            type: "h1",
            icon: <div className="h-4 w-4 rounded bg-blue-300" />,
            props: { className: "text-5xl font-bold mb-4" },
            allowsChildren: false,
            children: [
              {
                id: "text-hero-title",
                name: "Text Hero Title",
                type: "text",
                props: { content: "Welcome to the Future of Business" },
                icon: undefined
              },
            ],
          },
          {
            id: "hero-subtitle",
            name: "Hero Subtitle",
            type: "p",
            icon: <div className="h-4 w-4 rounded bg-gray-300" />,
            props: { className: "text-xl font-light mb-8" },
            allowsChildren: false,
            children: [
              {
                id: "text-hero-subtitle",
                name: "Text Hero Subtitle",
                type: "text",
                props: { content: "Empowering companies with cutting-edge solutions." },
                icon: undefined
              },
            ],
          },
          {
            id: "hero-button",
            name: "Hero Button",
            type: "button",
            icon: <div className="h-4 w-4 rounded bg-blue-700" />,
            props: { className: "bg-blue-600 text-white py-3 px-6 rounded-lg font-semibold" },
            allowsChildren: false,
            children: [
              {
                id: "text-hero-button",
                name: "Text Hero Button",
                type: "text",
                props: { content: "Get Started" },
                icon: undefined
              },
            ],
          },
        ],
      },
    ],
  },
];

const faqSection: TreeItem[] = [
  {
    id: "faq-section",
    name: "FAQ Section",
    type: "section",
    icon: <div className="h-4 w-4 rounded bg-green-500" />,
    props: { className: "bg-gray-50 py-12" },
    allowsChildren: true,
    children: [
      {
        id: "faq-container",
        name: "FAQ Container",
        type: "div",
        icon: <div className="h-4 w-4 rounded bg-gray-500" />,
        props: { className: "container mx-auto px-4" },
        allowsChildren: true,
        children: [
          {
            id: "faq-title",
            name: "FAQ Title",
            type: "h2",
            icon: <div className="h-4 w-4 rounded bg-green-300" />,
            props: { className: "text-3xl font-semibold text-gray-900 mb-6 text-center" },
            allowsChildren: false,
            children: [
              {
                id: "text-faq-title",
                name: "Text FAQ Title",
                type: "text",
                props: { content: "Frequently Asked Questions" },
                icon: undefined
              },
            ],
          },
          {
            id: "faq-list",
            name: "FAQ List",
            type: "div",
            icon: <div className="h-4 w-4 rounded bg-gray-300" />,
            props: { className: "space-y-8" },
            allowsChildren: true,
            children: [
              {
                id: "faq-item-1",
                name: "FAQ Item 1",
                type: "div",
                icon: <div className="h-4 w-4 rounded bg-green-400" />,
                props: { className: "border-b pb-4" },
                allowsChildren: true,
                children: [
                  {
                    id: "faq-question-1",
                    name: "FAQ Question 1",
                    type: "h3",
                    props: { className: "text-lg font-semibold text-gray-800" },
                    allowsChildren: false,
                    children: [
                      {
                        id: "text-faq-question-1",
                        name: "Text FAQ Question 1",
                        type: "text",
                        props: { content: "What is your refund policy?" },
                        icon: undefined
                      },
                    ],
                    icon: undefined
                  },
                  {
                    id: "faq-answer-1",
                    name: "FAQ Answer 1",
                    type: "p",
                    props: { className: "text-gray-600 mt-2" },
                    allowsChildren: false,
                    children: [
                      {
                        id: "text-faq-answer-1",
                        name: "Text FAQ Answer 1",
                        type: "text",
                        props: { content: "We offer a 30-day money-back guarantee." },
                        icon: undefined
                      },
                    ],
                    icon: undefined
                  },
                ],
              },
              // Repetir para FAQ Item 2, 3, etc.
            ],
          },
        ],
      },
    ],
  },
];

const faqSection2: TreeItem[] = [
  {
    id: "faq-section",
    name: "FAQ Section",
    type: "section",
    icon: <div className="h-4 w-4 rounded bg-purple-600" />,
    props: { className: "bg-white py-12" },
    allowsChildren: true,
    children: [
      {
        id: "faq-container",
        name: "FAQ Container",
        type: "div",
        icon: <div className="h-4 w-4 rounded bg-gray-200" />,
        props: { className: "container mx-auto px-4 text-center" },
        allowsChildren: true,
        children: [
          {
            id: "faq-title",
            name: "FAQ Title",
            type: "h2",
            icon: <div className="h-4 w-4 rounded bg-purple-300" />,
            props: { className: "text-3xl font-bold mb-6" },
            allowsChildren: false,
            children: [
              {
                id: "text-faq-title",
                name: "Text FAQ Title",
                type: "text",
                props: { content: "Frequently Asked Questions" },
                icon: undefined
              },
            ],
          },
          {
            id: "faq-list",
            name: "FAQ List",
            type: "div",
            icon: <div className="h-4 w-4 rounded bg-purple-200" />,
            props: { className: "space-y-4" },
            allowsChildren: true,
            children: [
              {
                id: "faq-item-1",
                name: "FAQ Item",
                type: "div",
                icon: <div className="h-4 w-4 rounded bg-purple-400" />,
                props: { className: "border-b py-2" },
                allowsChildren: true,
                children: [
                  {
                    id: "faq-question-1",
                    name: "FAQ Question",
                    type: "p",
                    props: { className: "font-semibold" },
                    allowsChildren: false,
                    children: [
                      {
                        id: "text-faq-question-1",
                        name: "Text FAQ Question",
                        type: "text",
                        props: { content: "What is your return policy?" },
                        icon: undefined
                      },
                    ],
                    icon: undefined
                  },
                  {
                    id: "faq-answer-1",
                    name: "FAQ Answer",
                    type: "p",
                    props: { className: "text-gray-600" },
                    allowsChildren: false,
                    children: [
                      {
                        id: "text-faq-answer-1",
                        name: "Text FAQ Answer",
                        type: "text",
                        props: { content: "You can return any unused product within 30 days for a full refund." },
                        icon: undefined
                      },
                    ],
                    icon: undefined
                  },
                ],
              },
              // Add more FAQ items as needed
            ],
          },
        ],
      },
    ],
  },
];


const teamSection: TreeItem[] = [
  {
    id: "team-section",
    name: "Team Section",
    type: "section",
    icon: <div className="h-4 w-4 rounded bg-orange-500" />,
    props: { className: "bg-white py-12" },
    allowsChildren: true,
    children: [
      {
        id: "team-container",
        name: "Team Container",
        type: "div",
        icon: <div className="h-4 w-4 rounded bg-gray-500" />,
        props: { className: "container mx-auto px-4 text-center" },
        allowsChildren: true,
        children: [
          {
            id: "team-title",
            name: "Team Title",
            type: "h2",
            icon: <div className="h-4 w-4 rounded bg-orange-300" />,
            props: { className: "text-3xl font-semibold text-gray-900 mb-6" },
            allowsChildren: false,
            children: [
              {
                id: "text-team-title",
                name: "Text Team Title",
                type: "text",
                props: { content: "Meet Our Team" },
                icon: undefined
              },
            ],
          },
          {
            id: "team-grid",
            name: "Team Grid",
            type: "div",
            icon: <div className="h-4 w-4 rounded bg-gray-300" />,
            props: { className: "grid grid-cols-1 md:grid-cols-3 gap-8" },
            allowsChildren: true,
            children: [
              {
                id: "team-member-1",
                name: "Team Member 1",
                type: "div",
                icon: <div className="h-4 w-4 rounded bg-orange-400" />,
                props: { className: "text-center" },
                allowsChildren: true,
                children: [
                  {
                    id: "team-image-1",
                    name: "Team Image 1",
                    type: "image",
                    props: { className: "mb-4 rounded-full", src: "/team-member-1.jpg", alt: "Team Member 1" },
                    allowsChildren: false,
                    icon: undefined
                  },
                  {
                    id: "team-name-1",
                    name: "Team Name 1",
                    type: "h3",
                    props: { className: "text-lg font-semibold text-gray-900" },
                    allowsChildren: false,
                    children: [
                      {
                        id: "text-team-name-1",
                        name: "Text Team Name 1",
                        type: "text",
                        props: { content: "John Doe" },
                        icon: undefined
                      },
                    ],
                    icon: undefined
                  },
                  {
                    id: "team-position-1",
                    name: "Team Position 1",
                    type: "p",
                    props: { className: "text-gray-600" },
                    allowsChildren: false,
                    children: [
                      {
                        id: "text-team-position-1",
                        name: "Text Team Position 1",
                        type: "text",
                        props: { content: "CEO & Founder" },
                        icon: undefined
                      },
                    ],
                    icon: undefined
                  },
                ],
              },
              {
                id: "team-member-1",
                name: "Team Member 1",
                type: "div",
                icon: <div className="h-4 w-4 rounded bg-orange-400" />,
                props: { className: "text-center" },
                allowsChildren: true,
                children: [
                  {
                    id: "team-image-1",
                    name: "Team Image 1",
                    type: "image",
                    props: { className: "mb-4 rounded-full", src: "/team-member-1.jpg", alt: "Team Member 1" },
                    allowsChildren: false,
                    icon: undefined
                  },
                  {
                    id: "team-name-2",
                    name: "Team Name 2",
                    type: "h3",
                    props: { className: "text-lg font-semibold text-gray-900" },
                    allowsChildren: false,
                    children: [
                      {
                        id: "text-team-name-2",
                        name: "Text Team Name 2",
                        type: "text",
                        props: { content: "John Doe" },
                        icon: undefined
                      },
                    ],
                    icon: undefined
                  },
                  {
                    id: "team-position-3",
                    name: "Team Position 3",
                    type: "p",
                    props: { className: "text-gray-600" },
                    allowsChildren: false,
                    children: [
                      {
                        id: "text-team-position-3",
                        name: "Text Team Position 3",
                        type: "text",
                        props: { content: "CEO & Founder" },
                        icon: undefined
                      },
                    ],
                    icon: undefined
                  },
                ],
              },
              {
                id: "team-member-1",
                name: "Team Member 1",
                type: "div",
                icon: <div className="h-4 w-4 rounded bg-orange-400" />,
                props: { className: "text-center" },
                allowsChildren: true,
                children: [
                  {
                    id: "team-image-1",
                    name: "Team Image 1",
                    type: "image",
                    props: { className: "mb-4 rounded-full", src: "/team-member-1.jpg", alt: "Team Member 1" },
                    allowsChildren: false,
                    icon: undefined
                  },
                  {
                    id: "team-name-1",
                    name: "Team Name 1",
                    type: "h3",
                    props: { className: "text-lg font-semibold text-gray-900" },
                    allowsChildren: false,
                    children: [
                      {
                        id: "text-team-name-1",
                        name: "Text Team Name 1",
                        type: "text",
                        props: { content: "John Doe" },
                        icon: undefined
                      },
                    ],
                    icon: undefined
                  },
                  {
                    id: "team-position-1",
                    name: "Team Position 1",
                    type: "p",
                    props: { className: "text-gray-600" },
                    allowsChildren: false,
                    children: [
                      {
                        id: "text-team-position-1",
                        name: "Text Team Position 1",
                        type: "text",
                        props: { content: "CEO & Founder" },
                        icon: undefined
                      },
                    ],
                    icon: undefined
                  },
                ],
              },
              // Repetir para Team Member 2 e 3
            ],
          },
        ],
      },
    ],
  },
];

const teamSection2: TreeItem[] = [
  {
    id: "team-section",
    name: "Team Section",
    type: "section",
    icon: <div className="h-4 w-4 rounded bg-orange-500" />,
    props: { className: "bg-gray-100 py-12" },
    allowsChildren: true,
    children: [
      {
        id: "team-container",
        name: "Team Container",
        type: "div",
        icon: <div className="h-4 w-4 rounded bg-gray-200" />,
        props: { className: "container mx-auto px-4 text-center" },
        allowsChildren: true,
        children: [
          {
            id: "team-title",
            name: "Team Title",
            type: "h2",
            icon: <div className="h-4 w-4 rounded bg-orange-300" />,
            props: { className: "text-3xl font-bold mb-6" },
            allowsChildren: false,
            children: [
              {
                id: "text-team-title",
                name: "Text Team Title",
                type: "text",
                props: { content: "Meet Our Team" },
                icon: undefined
              },
            ],
          },
          {
            id: "team-list",
            name: "Team List",
            type: "div",
            icon: <div className="h-4 w-4 rounded bg-orange-200" />,
            props: { className: "grid grid-cols-1 md:grid-cols-3 gap-6" },
            allowsChildren: true,
            children: [
              {
                id: "team-member-1",
                name: "Team Member",
                type: "div",
                icon: <div className="h-4 w-4 rounded bg-orange-400" />,
                props: { className: "text-center" },
                allowsChildren: true,
                children: [
                  {
                    id: "member-avatar-1",
                    name: "Member Avatar",
                    type: "Avatar",
                    props: { src: "https://github.com/shadcn.png", alt: "Member 1", className: "w-14 h-14 rounded-full mx-auto mb-2" },
                    allowsChildren: false,
                    icon: undefined
                  },
                  {
                    id: "member-name-1",
                    name: "Member Name",
                    type: "p",
                    props: { className: "font-semibold" },
                    allowsChildren: false,
                    children: [
                      {
                        id: "text-member-name-1",
                        name: "Text Member Name",
                        type: "text",
                        props: { content: "John Doe" },
                        icon: undefined
                      },
                    ],
                    icon: undefined
                  },
                  {
                    id: "member-role-1",
                    name: "Member Role",
                    type: "p",
                    props: { className: "text-gray-500" },
                    allowsChildren: false,
                    children: [
                      {
                        id: "text-member-role-1",
                        name: "Text Member Role",
                        type: "text",
                        props: { content: "CEO" },
                        icon: undefined
                      },
                    ],
                    icon: undefined
                  },
                ],
              },
              {
                id: "team-member-1",
                name: "Team Member",
                type: "div",
                icon: <div className="h-4 w-4 rounded bg-orange-400" />,
                props: { className: "text-center" },
                allowsChildren: true,
                children: [
                  {
                    id: "member-avatar-1",
                    name: "Member Avatar",
                    type: "Avatar",
                    props: { src: "https://github.com/shadcn.png", alt: "Member 1", className: "w-14 h-14 rounded-full mx-auto mb-2" },
                    allowsChildren: false,
                    icon: undefined
                  },
                  {
                    id: "member-name-1",
                    name: "Member Name",
                    type: "p",
                    props: { className: "font-semibold" },
                    allowsChildren: false,
                    children: [
                      {
                        id: "text-member-name-1",
                        name: "Text Member Name",
                        type: "text",
                        props: { content: "John Doe" },
                        icon: undefined
                      },
                    ],
                    icon: undefined
                  },
                  {
                    id: "member-role-1",
                    name: "Member Role",
                    type: "p",
                    props: { className: "text-gray-500" },
                    allowsChildren: false,
                    children: [
                      {
                        id: "text-member-role-1",
                        name: "Text Member Role",
                        type: "text",
                        props: { content: "CEO" },
                        icon: undefined
                      },
                    ],
                    icon: undefined
                  },
                ],
              },
              {
                id: "team-member-1",
                name: "Team Member",
                type: "div",
                icon: <div className="h-4 w-4 rounded bg-orange-400" />,
                props: { className: "text-center" },
                allowsChildren: true,
                children: [
                  {
                    id: "member-avatar-1",
                    name: "Member Avatar",
                    type: "Avatar",
                    props: { src: "https://github.com/shadcn.png", alt: "Member 1", className: "w-14 h-14 rounded-full mx-auto mb-2" },
                    allowsChildren: false,
                    icon: undefined
                  },
                  {
                    id: "member-name-1",
                    name: "Member Name",
                    type: "p",
                    props: { className: "font-semibold" },
                    allowsChildren: false,
                    children: [
                      {
                        id: "text-member-name-1",
                        name: "Text Member Name",
                        type: "text",
                        props: { content: "John Doe" },
                        icon: undefined
                      },
                    ],
                    icon: undefined
                  },
                  {
                    id: "member-role-1",
                    name: "Member Role",
                    type: "p",
                    props: { className: "text-gray-500" },
                    allowsChildren: false,
                    children: [
                      {
                        id: "text-member-role-1",
                        name: "Text Member Role",
                        type: "text",
                        props: { content: "CEO" },
                        icon: undefined
                      },
                    ],
                    icon: undefined
                  },
                ],
              },
              // Add more team members as needed
            ],
          },
        ],
      },
    ],
  },
];


const newsletterSection: TreeItem[] = [
  {
    id: "newsletter-section",
    name: "Newsletter Section",
    type: "section",
    icon: <div className="h-4 w-4 rounded bg-purple-500" />,
    props: { className: "bg-purple-700 py-12 text-white" },
    allowsChildren: true,
    children: [
      {
        id: "newsletter-container",
        name: "Newsletter Container",
        type: "div",
        icon: <div className="h-4 w-4 rounded bg-gray-500" />,
        props: { className: "container mx-auto px-4 text-center" },
        allowsChildren: true,
        children: [
          {
            id: "newsletter-title",
            name: "Newsletter Title",
            type: "h2",
            icon: <div className="h-4 w-4 rounded bg-purple-300" />,
            props: { className: "text-4xl font-bold mb-4" },
            allowsChildren: false,
            children: [
              {
                id: "text-newsletter-title",
                name: "Text Newsletter Title",
                type: "text",
                props: { content: "Subscribe to Our Newsletter" },
                icon: undefined
              },
            ],
          },
          {
            id: "newsletter-description",
            name: "Newsletter Description",
            type: "p",
            icon: <div className="h-4 w-4 rounded bg-gray-300" />,
            props: { className: "text-lg mb-6" },
            allowsChildren: false,
            children: [
              {
                id: "text-newsletter-description",
                name: "Text Newsletter Description",
                type: "text",
                props: { content: "Get the latest updates and exclusive offers directly in your inbox." },
                icon: undefined
              },
            ],
          },
          {
            id: "newsletter-form",
            name: "Newsletter Form",
            type: "form",
            icon: <div className="h-4 w-4 rounded bg-purple-800" />,
            props: { className: "flex justify-center items-center" },
            allowsChildren: true,
            children: [
              {
                id: "newsletter-input",
                name: "Newsletter Input",
                type: "input",
                icon: <div className="h-4 w-4 rounded bg-purple-600" />,
                props: { 
                  type: "email", 
                  placeholder: "Enter your email", 
                  className: "px-4 py-2 rounded-l-lg focus:outline-none" 
                },
                allowsChildren: false,
              },
              {
                id: "newsletter-button",
                name: "Newsletter Button",
                type: "button",
                icon: <div className="h-4 w-4 rounded bg-purple-800" />,
                props: { className: "bg-white text-purple-600 py-2 px-6 rounded-r-lg font-semibold" },
                allowsChildren: false,
                children: [
                  {
                    id: "text-newsletter-button",
                    name: "Text Newsletter Button",
                    type: "text",
                    props: { content: "Subscribe" },
                    icon: undefined
                  },
                ],
              },
            ],
          },
        ],
      },
    ],
  },
];

const newsletterSection2: TreeItem[] = [
  {
    "id": "7ehmjotuh",
    "name": "Newsletter Section",
    "type": "section",
    "props": {
      "className": "w-full h-full py-12 md:py-24 lg:py-32 xl:py-48 bg-black"
    },
    "allowsChildren": true,
    "children": [
      {
        "id": "0r6h52jaa",
        "name": "div",
        "type": "div",
        "props": {
          "className": "container px-4 md:px-6"
        },
        "allowsChildren": true,
        "children": [
          {
            "id": "omtsize1o",
            "name": "div",
            "type": "div",
            "props": {
              "className": "grid gap-6 items-center"
            },
            "allowsChildren": true,
            "children": [
              {
                "id": "agcabwzxu",
                "name": "div",
                "type": "div",
                "props": {
                  "className": "flex flex-col justify-center space-y-4 text-center"
                },
                "allowsChildren": true,
                "children": [
                  {
                    "id": "vgnlh01aj",
                    "name": "div",
                    "type": "div",
                    "props": {
                      "className": "space-y-2"
                    },
                    "allowsChildren": true,
                    "children": [
                      {
                        "id": "mbny0gu0o",
                        "name": "h1",
                        "type": "h1",
                        "props": {
                          "className": "text-3xl font-bold tracking-tighter sm:text-5xl xl:text-6xl/none bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-500"
                        },
                        "allowsChildren": true,
                        "children": [
                          {
                            "id": "17271487115242f0bp6yv4",
                            "name": "Text",
                            "type": "text",
                            "allowsChildren": false,
                            "children": [],
                            "props": {
                              "content": "Revolutionize Your Email Experience"
                            },
                            icon: undefined
                          }
                        ],
                        icon: undefined
                      },
                      {
                        "id": "1flrg8rea",
                        "name": "p",
                        "type": "p",
                        "props": {
                          "className": "max-w-[600px] text-zinc-200 md:text-xl dark:text-zinc-100 mx-auto"
                        },
                        "allowsChildren": true,
                        "children": [
                          {
                            "id": "17271487115250b479q9fe",
                            "name": "Text",
                            "type": "text",
                            "allowsChildren": false,
                            "children": [],
                            "props": {
                              "content": "Join us and take control of your inbox. Fast, secure, and designed for modern life."
                            },
                            icon: undefined
                          }
                        ],
                        icon: undefined
                      }
                    ],
                    icon: undefined
                  },
                  {
                    "id": "3zi7gukkg",
                    "name": "div",
                    "type": "div",
                    "props": {
                      "className": "w-full max-w-sm space-y-2 mx-auto"
                    },
                    "allowsChildren": true,
                    "children": [
                      {
                        "id": "daa493zeu",
                        "name": "form",
                        "type": "form",
                        "props": {
                          "className": "flex space-x-2"
                        },
                        "allowsChildren": true,
                        "children": [
                          {
                            "id": "zytltojhs",
                            "name": "Input",
                            "type": "Input",
                            "props": {
                              "className": "max-w-lg flex-1 bg-gray-800 text-white border-gray-900",
                              "placeholder": "Enter your email",
                              "type": "email"
                            },
                            "allowsChildren": true,
                            "children": [],
                            icon: undefined
                          },
                          {
                            "id": "32opjef7q",
                            "name": "Button",
                            "type": "Button",
                            "props": {
                              "className": "bg-white text-black",
                              "type": "submit"
                            },
                            "allowsChildren": true,
                            "children": [
                              {
                                "id": "1727148711531xrjwffj2j",
                                "name": "Text",
                                "type": "text",
                                "allowsChildren": false,
                                "children": [],
                                "props": {
                                  "content": "Join Now"
                                },
                                icon: undefined
                              }
                            ],
                            icon: undefined
                          }
                        ],
                        icon: undefined
                      },
                      {
                        "id": "jxtx83tri",
                        "name": "p",
                        "type": "p",
                        "props": {
                          "className": "text-xs text-zinc-200 dark:text-zinc-100"
                        },
                        "allowsChildren": true,
                        "children": [
                          {
                            "id": "1727148711532k8d4vy0fd",
                            "name": "Text",
                            "type": "text",
                            "allowsChildren": false,
                            "children": [],
                            "props": {
                              "content": "Get ready to redefine your email experience."
                            },
                            icon: undefined
                          },
                          {
                            "id": "ywtj0swo5",
                            "name": "Link",
                            "type": "Link",
                            "props": {
                              "className": "underline underline-offset-2 text-white",
                              "href": "#",
                              "prefetch": null
                            },
                            "allowsChildren": true,
                            "children": [
                              {
                                "id": "1727148711533e6isfmdq3",
                                "name": "Text",
                                "type": "text",
                                "allowsChildren": false,
                                "children": [],
                                "props": {
                                  "content": "Terms & Conditions"
                                },
                                icon: undefined
                              }
                            ],
                            icon: undefined
                          }
                        ],
                        icon: undefined
                      }
                    ],
                    icon: undefined
                  }
                ],
                icon: undefined
              }
            ],
            icon: undefined
          }
        ],
        icon: undefined
      }
    ],
    icon: undefined
  }
]

const footerSection: TreeItem[] = [
  {
    id: "footer-section",
    name: "Footer Section",
    type: "section",
    icon: <div className="h-4 w-4 rounded bg-green-500" />,
    props: { className: "bg-gray-800 text-white py-6" },
    allowsChildren: true,
    children: [
      {
        id: "footer-container",
        name: "Footer Container",
        type: "div",
        icon: <div className="h-4 w-4 rounded bg-gray-700" />,
        props: { className: "container mx-auto px-4 text-center" },
        allowsChildren: true,
        children: [
          {
            id: "footer-links",
            name: "Footer Links",
            type: "div",
            icon: <div className="h-4 w-4 rounded bg-green-300" />,
            props: { className: "flex justify-center space-x-6 mb-4" },
            allowsChildren: true,
            children: [
              {
                id: "footer-link-1",
                name: "Footer Link",
                type: "a",
                icon: <div className="h-4 w-4 rounded bg-green-200" />,
                props: { href: "#", className: "hover:underline" },
                allowsChildren: false,
                children: [
                  {
                    id: "text-footer-link-1",
                    name: "Text Footer Link",
                    type: "text",
                    props: { content: "Home" },
                    icon: undefined
                  },
                ],
              },
              {
                id: "footer-link-2",
                name: "Footer Link",
                type: "a",
                icon: <div className="h-4 w-4 rounded bg-green-200" />,
                props: { href: "#", className: "hover:underline" },
                allowsChildren: false,
                children: [
                  {
                    id: "text-footer-link-2",
                    name: "Text Footer Link",
                    type: "text",
                    props: { content: "About" },
                    icon: undefined
                  },
                ],
              },
              {
                id: "footer-link-3",
                name: "Footer Link",
                type: "a",
                icon: <div className="h-4 w-4 rounded bg-green-200" />,
                props: { href: "#", className: "hover:underline" },
                allowsChildren: false,
                children: [
                  {
                    id: "text-footer-link-3",
                    name: "Text Footer Link",
                    type: "text",
                    props: { content: "Contact" },
                    icon: undefined
                  },
                ],
              },
            ],
          },
          {
            id: "footer-copy",
            name: "Footer Copyright",
            type: "p",
            icon: <div className="h-4 w-4 rounded bg-gray-600" />,
            props: { className: "text-sm" },
            allowsChildren: false,
            children: [
              {
                id: "text-footer-copy",
                name: "Text Footer Copyright",
                type: "text",
                props: { content: "© 2024 Your Company. All rights reserved." },
                icon: undefined
              },
            ],
          },
        ],
      },
    ],
  },
];

const headerSection: TreeItem[] = [
  {
    id: "header-section",
    name: "Header Section",
    type: "section",
    icon: <div className="h-4 w-4 rounded bg-indigo-500" />,
    props: { className: "bg-white shadow-md py-4" },
    allowsChildren: true,
    children: [
      {
        id: "header-container",
        name: "Header Container",
        type: "div",
        icon: <div className="h-4 w-4 rounded bg-gray-200" />,
        props: { className: "container mx-auto flex justify-between items-center px-4" },
        allowsChildren: true,
        children: [
          {
            id: "logo",
            name: "Logo",
            type: "img",
            icon: <div className="h-4 w-4 rounded bg-indigo-300" />,
            props: { src: "https://github.com/shadcn.png", alt: "Company Logo", className: "h-10" },
            allowsChildren: false,
          },
          {
            id: "nav-menu",
            name: "Navigation Menu",
            type: "nav",
            icon: <div className="h-4 w-4 rounded bg-indigo-200" />,
            props: { className: "flex space-x-6" },
            allowsChildren: true,
            children: [
              {
                id: "nav-item-home",
                name: "Nav Item - Home",
                type: "a",
                icon: <div className="h-4 w-4 rounded bg-indigo-400" />,
                props: { href: "#", className: "text-gray-700 hover:text-indigo-600" },
                allowsChildren: false,
                children: [
                  {
                    id: "text-nav-item-home",
                    name: "Text Nav Item - Home",
                    type: "text",
                    props: { content: "Home" },
                    icon: undefined
                  },
                ],
              },
              {
                id: "nav-item-about",
                name: "Nav Item - About",
                type: "a",
                icon: <div className="h-4 w-4 rounded bg-indigo-400" />,
                props: { href: "#", className: "text-gray-700 hover:text-indigo-600" },
                allowsChildren: false,
                children: [
                  {
                    id: "text-nav-item-about",
                    name: "Text Nav Item - About",
                    type: "text",
                    props: { content: "About" },
                    icon: undefined
                  },
                ],
              },
              {
                id: "nav-item-contact",
                name: "Nav Item - Contact",
                type: "a",
                icon: <div className="h-4 w-4 rounded bg-indigo-400" />,
                props: { href: "#", className: "text-gray-700 hover:text-indigo-600" },
                allowsChildren: false,
                children: [
                  {
                    id: "text-nav-item-contact",
                    name: "Text Nav Item - Contact",
                    type: "text",
                    props: { content: "Contact" },
                    icon: undefined
                  },
                ],
              },
            ],
          },
          {
            id: "header-cta",
            name: "Header CTA",
            type: "button",
            icon: <div className="h-4 w-4 rounded bg-indigo-600" />,
            props: { className: "bg-indigo-600 text-white py-2 px-4 rounded-md hover:bg-indigo-700" },
            allowsChildren: false,
            children: [
              {
                id: "text-header-cta",
                name: "Text Header CTA",
                type: "text",
                props: { content: "Get Started" },
                icon: undefined
              },
            ],
          },
        ],
      },
    ],
  },
];

const signUpSection: TreeItem[] = [
  {
    "id": "lvmd3mic1",
    "name": "SignUp Section",
    "type": "div",
    "props": {
      "className": "flex min-h-screen w-full items-center justify-center bg-background text-card-foreground"
    },
    "allowsChildren": true,
    "children": [
      {
        "id": "zifiifp0q",
        "name": "div",
        "type": "div",
        "props": {
          "className": "container mx-auto grid max-w-5xl grid-cols-1 gap-8 rounded-lg bg-card p-8 shadow-xl md:grid-cols-2 md:gap-12 lg:p-12"
        },
        "allowsChildren": true,
        "children": [
          {
            "id": "azthcrdp4",
            "name": "div",
            "type": "div",
            "props": {
              "className": "space-y-6"
            },
            "allowsChildren": true,
            "children": [
              {
                "id": "078ak4b5u",
                "name": "h1",
                "type": "h1",
                "props": {
                  "className": "text-3xl font-bold"
                },
                "allowsChildren": true,
                "children": [
                  {
                    "id": "1727218819869006q3m8w7",
                    "name": "Text",
                    "type": "text",
                    "allowsChildren": false,
                    "children": [],
                    "props": {
                      "content": "Sign up and start today"
                    },
                    icon: undefined
                  }
                ],
                icon: undefined
              },
              {
                "id": "or0bljdi4",
                "name": "p",
                "type": "p",
                "props": {
                  "className": "text-muted-foreground"
                },
                "allowsChildren": true,
                "children": [
                  {
                    "id": "1727218819871v5oh1bqca",
                    "name": "Text",
                    "type": "text",
                    "allowsChildren": false,
                    "children": [],
                    "props": {
                      "content": "Create your account and get access to our powerful SaaS platform."
                    },
                    icon: undefined
                  }
                ],
                icon: undefined
              },
              {
                "id": "8jh7uv7th",
                "name": "form",
                "type": "form",
                "props": {
                  "className": "space-y-4"
                },
                "allowsChildren": true,
                "children": [
                  {
                    "id": "pzfjegv62",
                    "name": "div",
                    "type": "div",
                    "props": {
                      "className": "grid grid-cols-2 gap-4"
                    },
                    "allowsChildren": true,
                    "children": [
                      {
                        "id": "d8vtkdznc",
                        "name": "div",
                        "type": "div",
                        "props": {
                          "className": "space-y-2"
                        },
                        "allowsChildren": true,
                        "children": [
                          {
                            "id": "nzrtrxcgp",
                            "name": "Label",
                            "type": "Label",
                            "props": {
                              "htmlFor": "firstName"
                            },
                            "allowsChildren": true,
                            "children": [
                              {
                                "id": "17272188198807k1rf2eh4",
                                "name": "Text",
                                "type": "text",
                                "allowsChildren": false,
                                "children": [],
                                "props": {
                                  "content": "First Name"
                                },
                                icon: undefined
                              }
                            ],
                            icon: undefined
                          },
                          {
                            "id": "o4df39bo1",
                            "name": "Input",
                            "type": "Input",
                            "props": {
                              "id": "firstName",
                              "placeholder": "John",
                              "required": true
                            },
                            "allowsChildren": true,
                            "children": [],
                            icon: undefined
                          }
                        ],
                        icon: undefined
                      },
                      {
                        "id": "950ifr15z",
                        "name": "div",
                        "type": "div",
                        "props": {
                          "className": "space-y-2"
                        },
                        "allowsChildren": true,
                        "children": [
                          {
                            "id": "t002p4iyn",
                            "name": "Label",
                            "type": "Label",
                            "props": {
                              "htmlFor": "lastName"
                            },
                            "allowsChildren": true,
                            "children": [
                              {
                                "id": "1727218819885medvzsbds",
                                "name": "Text",
                                "type": "text",
                                "allowsChildren": false,
                                "children": [],
                                "props": {
                                  "content": "Last Name"
                                },
                                icon: undefined
                              }
                            ],
                            icon: undefined
                          },
                          {
                            "id": "ssoyly2gh",
                            "name": "Input",
                            "type": "Input",
                            "props": {
                              "id": "lastName",
                              "placeholder": "Doe",
                              "required": true
                            },
                            "allowsChildren": true,
                            "children": [],
                            icon: undefined
                          }
                        ],
                        icon: undefined
                      }
                    ],
                    icon: undefined
                  },
                  {
                    "id": "11s9v2mt6",
                    "name": "div",
                    "type": "div",
                    "props": {
                      "className": "space-y-2"
                    },
                    "allowsChildren": true,
                    "children": [
                      {
                        "id": "zmfhjyyk6",
                        "name": "Label",
                        "type": "Label",
                        "props": {
                          "htmlFor": "email"
                        },
                        "allowsChildren": true,
                        "children": [
                          {
                            "id": "1727218819890zjgdzvn1t",
                            "name": "Text",
                            "type": "text",
                            "allowsChildren": false,
                            "children": [],
                            "props": {
                              "content": "Email"
                            },
                            icon: undefined
                          }
                        ],
                        icon: undefined
                      },
                      {
                        "id": "36v25u36n",
                        "name": "Input",
                        "type": "Input",
                        "props": {
                          "id": "email",
                          "type": "email",
                          "placeholder": "john@example.com",
                          "required": true
                        },
                        "allowsChildren": true,
                        "children": [],
                        icon: undefined
                      }
                    ],
                    icon: undefined
                  },
                  {
                    "id": "7rffk97so",
                    "name": "div",
                    "type": "div",
                    "props": {
                      "className": "space-y-2"
                    },
                    "allowsChildren": true,
                    "children": [
                      {
                        "id": "o2xm7q0on",
                        "name": "Label",
                        "type": "Label",
                        "props": {
                          "htmlFor": "password"
                        },
                        "allowsChildren": true,
                        "children": [
                          {
                            "id": "1727218819892lwry6raz5",
                            "name": "Text",
                            "type": "text",
                            "allowsChildren": false,
                            "children": [],
                            "props": {
                              "content": "Password"
                            },
                            icon: undefined
                          }
                        ],
                        icon: undefined
                      },
                      {
                        "id": "41tc8zytk",
                        "name": "Input",
                        "type": "Input",
                        "props": {
                          "id": "password",
                          "type": "password",
                          "required": true
                        },
                        "allowsChildren": true,
                        "children": [],
                        icon: undefined
                      }
                    ],
                    icon: undefined
                  },
                  {
                    "id": "3dz6txomo",
                    "name": "Button",
                    "type": "Button",
                    "props": {
                      "type": "submit",
                      "className": "mt-4 w-full bg-primary text-primary-foreground"
                    },
                    "allowsChildren": true,
                    "children": [
                      {
                        "id": "1727218819893meccwk2ua",
                        "name": "Text",
                        "type": "text",
                        "allowsChildren": false,
                        "children": [],
                        "props": {
                          "content": "Buy Now"
                        },
                        icon: undefined
                      }
                    ],
                    icon: undefined
                  }
                ],
                icon: undefined
              }
            ],
            icon: undefined
          },
          {
            "id": "5rxcl5yuf",
            "name": "div",
            "type": "div",
            "props": {
              "className": "space-y-6 rounded-lg bg-muted p-6 shadow-xl"
            },
            "allowsChildren": true,
            "children": [
              {
                "id": "k45zwofkm",
                "name": "div",
                "type": "div",
                "props": {},
                "allowsChildren": true,
                "children": [
                  {
                    "id": "nwv6kkviw",
                    "name": "h2",
                    "type": "h2",
                    "props": {
                      "className": "text-2xl font-bold"
                    },
                    "allowsChildren": true,
                    "children": [
                      {
                        "id": "172721881990038m42kfhc",
                        "name": "Text",
                        "type": "text",
                        "allowsChildren": false,
                        "children": [],
                        "props": {
                          "content": "Pro Plan"
                        },
                        icon: undefined
                      }
                    ],
                    icon: undefined
                  },
                  {
                    "id": "k8wqvi36p",
                    "name": "p",
                    "type": "p",
                    "props": {
                      "className": "text-4xl font-bold"
                    },
                    "allowsChildren": true,
                    "children": [
                      {
                        "id": "1727218819900e63htipp8",
                        "name": "Text",
                        "type": "text",
                        "allowsChildren": false,
                        "children": [],
                        "props": {
                          "content": "$99/mo"
                        },
                        icon: undefined
                      }
                    ],
                    icon: undefined
                  },
                  {
                    "id": "gmdb2rgc5",
                    "name": "p",
                    "type": "p",
                    "props": {
                      "className": "text-muted-foreground"
                    },
                    "allowsChildren": true,
                    "children": [
                      {
                        "id": "17272188199011rlly2vix",
                        "name": "Text",
                        "type": "text",
                        "allowsChildren": false,
                        "children": [],
                        "props": {
                          "content": "Billed annually"
                        },
                        icon: undefined
                      }
                    ],
                    icon: undefined
                  }
                ],
                icon: undefined
              },
              {
                "id": "i3x57q2va",
                "name": "div",
                "type": "div",
                "props": {
                  "className": "space-y-2"
                },
                "allowsChildren": true,
                "children": [
                  {
                    "id": "a9zh5c923",
                    "name": "div",
                    "type": "div",
                    "props": {
                      "className": "flex items-center gap-2"
                    },
                    "allowsChildren": true,
                    "children": [
                      {
                        "id": "yzeb6sebt",
                        "name": "CheckIcon",
                        "type": "CheckIcon",
                        "props": {
                          "className": "h-5 w-5 text-green-500"
                        },
                        "allowsChildren": true,
                        "children": [],
                        icon: undefined
                      },
                      {
                        "id": "enpvnsynv",
                        "name": "p",
                        "type": "p",
                        "props": {},
                        "allowsChildren": true,
                        "children": [
                          {
                            "id": "1727218819909shz8fj875",
                            "name": "Text",
                            "type": "text",
                            "allowsChildren": false,
                            "children": [],
                            "props": {
                              "content": "Unlimited users"
                            },
                            icon: undefined
                          }
                        ],
                        icon: undefined
                      }
                    ],
                    icon: undefined
                  },
                  {
                    "id": "qq2jbmgrt",
                    "name": "div",
                    "type": "div",
                    "props": {
                      "className": "flex items-center gap-2"
                    },
                    "allowsChildren": true,
                    "children": [
                      {
                        "id": "jjxesv721",
                        "name": "CheckIcon",
                        "type": "CheckIcon",
                        "props": {
                          "className": "h-5 w-5 text-green-500"
                        },
                        "allowsChildren": true,
                        "children": [],
                        icon: undefined
                      },
                      {
                        "id": "vg3ox5qvz",
                        "name": "p",
                        "type": "p",
                        "props": {},
                        "allowsChildren": true,
                        "children": [
                          {
                            "id": "1727218819911o0bgoysdo",
                            "name": "Text",
                            "type": "text",
                            "allowsChildren": false,
                            "children": [],
                            "props": {
                              "content": "Dedicated support"
                            },
                            icon: undefined
                          }
                        ],
                        icon: undefined
                      }
                    ],
                    icon: undefined
                  },
                  {
                    "id": "8sqr1uauv",
                    "name": "div",
                    "type": "div",
                    "props": {
                      "className": "flex items-center gap-2"
                    },
                    "allowsChildren": true,
                    "children": [
                      {
                        "id": "eqwqzmlg2",
                        "name": "CheckIcon",
                        "type": "CheckIcon",
                        "props": {
                          "className": "h-5 w-5 text-green-500"
                        },
                        "allowsChildren": true,
                        "children": [],
                        icon: undefined
                      },
                      {
                        "id": "a4utgq0j8",
                        "name": "p",
                        "type": "p",
                        "props": {},
                        "allowsChildren": true,
                        "children": [
                          {
                            "id": "1727218819914h539bxplw",
                            "name": "Text",
                            "type": "text",
                            "allowsChildren": false,
                            "children": [],
                            "props": {
                              "content": "Advanced analytics"
                            },
                            icon: undefined
                          }
                        ],
                        icon: undefined
                      }
                    ],
                    icon: undefined
                  },
                  {
                    "id": "66ot567g9",
                    "name": "div",
                    "type": "div",
                    "props": {
                      "className": "flex items-center gap-2"
                    },
                    "allowsChildren": true,
                    "children": [
                      {
                        "id": "qnuy3x5b3",
                        "name": "CheckIcon",
                        "type": "CheckIcon",
                        "props": {
                          "className": "h-5 w-5 text-green-500"
                        },
                        "allowsChildren": true,
                        "children": [],
                        icon: undefined
                      },
                      {
                        "id": "674vv3syr",
                        "name": "p",
                        "type": "p",
                        "props": {},
                        "allowsChildren": true,
                        "children": [
                          {
                            "id": "1727218819914p6fcw3mdx",
                            "name": "Text",
                            "type": "text",
                            "allowsChildren": false,
                            "children": [],
                            "props": {
                              "content": "Custom branding"
                            },
                            icon: undefined
                          }
                        ],
                        icon: undefined
                      }
                    ],
                    icon: undefined
                  }
                ],
                icon: undefined
              }
            ],
            icon: undefined
          }
        ],
        icon: undefined
      }
    ],
    icon: undefined
  }
];

const checkOutSection: TreeItem[] = [
  {
    "id": "4v17qe96b",
    "name": "CheckOut Section",
    "type": "div",
    "props": {
      "className": "flex min-h-[100dvh] flex-col bg-background text-foreground"
    },
    "allowsChildren": true,
    "children": [
      {
        "id": "7g1ri9vnr",
        "name": "main",
        "type": "main",
        "props": {
          "className": "container mx-auto flex flex-1 flex-col items-center justify-center px-4 py-12 sm:px-6 lg:px-8"
        },
        "allowsChildren": true,
        "children": [
          {
            "id": "lsixjrcfd",
            "name": "div",
            "type": "div",
            "props": {
              "className": "mx-auto w-full max-w-2xl space-y-8"
            },
            "allowsChildren": true,
            "children": [
              {
                "id": "617403nik",
                "name": "div",
                "type": "div",
                "props": {
                  "className": "space-y-4"
                },
                "allowsChildren": true,
                "children": [
                  {
                    "id": "lz3y91tcl",
                    "name": "h1",
                    "type": "h1",
                    "props": {
                      "className": "text-3xl font-bold tracking-tight md:text-4xl"
                    },
                    "allowsChildren": true,
                    "children": [
                      {
                        "id": "1727219040480e720axyt4",
                        "name": "Text",
                        "type": "text",
                        "allowsChildren": false,
                        "children": [],
                        "props": {
                          "content": "Acme SaaS Platform"
                        },
                        icon: undefined
                      }
                    ],
                    icon: undefined
                  },
                  {
                    "id": "e1ff6t8do",
                    "name": "p",
                    "type": "p",
                    "props": {
                      "className": "text-muted-foreground"
                    },
                    "allowsChildren": true,
                    "children": [
                      {
                        "id": "17272190404812t4fdvlg8",
                        "name": "Text",
                        "type": "text",
                        "allowsChildren": false,
                        "children": [],
                        "props": {
                          "content": "Unlock the power of our cutting-edge SaaS platform and take your business to new heights."
                        },
                        icon: undefined
                      }
                    ],
                    icon: undefined
                  }
                ],
                icon: undefined
              },
              {
                "id": "j6fcheej0",
                "name": "div",
                "type": "div",
                "props": {
                  "className": "grid grid-cols-1 gap-8 md:grid-cols-2"
                },
                "allowsChildren": true,
                "children": [
                  {
                    "id": "v61apj7rj",
                    "name": "div",
                    "type": "div",
                    "props": {
                      "className": "space-y-4"
                    },
                    "allowsChildren": true,
                    "children": [
                      {
                        "id": "aw67glla3",
                        "name": "div",
                        "type": "div",
                        "props": {},
                        "allowsChildren": true,
                        "children": [
                          {
                            "id": "jaar9pjsb",
                            "name": "h2",
                            "type": "h2",
                            "props": {
                              "className": "text-2xl font-bold"
                            },
                            "allowsChildren": true,
                            "children": [
                              {
                                "id": "172721904048669s18xhzb",
                                "name": "Text",
                                "type": "text",
                                "allowsChildren": false,
                                "children": [],
                                "props": {
                                  "content": "Pricing"
                                },
                                icon: undefined
                              }
                            ],
                            icon: undefined
                          },
                          {
                            "id": "bggw0fqvl",
                            "name": "p",
                            "type": "p",
                            "props": {
                              "className": "text-muted-foreground"
                            },
                            "allowsChildren": true,
                            "children": [
                              {
                                "id": "1727219040486g7yjby0ib",
                                "name": "Text",
                                "type": "text",
                                "allowsChildren": false,
                                "children": [],
                                "props": {
                                  "content": "Choose the plan that fits your needs."
                                },
                                icon: undefined
                              }
                            ],
                            icon: undefined
                          }
                        ],
                        icon: undefined
                      },
                      {
                        "id": "3hfehcsij",
                        "name": "div",
                        "type": "div",
                        "props": {
                          "className": "rounded-lg border border-muted bg-card p-6"
                        },
                        "allowsChildren": true,
                        "children": [
                          {
                            "id": "u0j2oz1si",
                            "name": "div",
                            "type": "div",
                            "props": {
                              "className": "flex items-baseline justify-between"
                            },
                            "allowsChildren": true,
                            "children": [
                              {
                                "id": "za0a5wgc4",
                                "name": "span",
                                "type": "span",
                                "props": {
                                  "className": "text-4xl font-bold"
                                },
                                "allowsChildren": true,
                                "children": [
                                  {
                                    "id": "17272190404887uhhcxydf",
                                    "name": "Text",
                                    "type": "text",
                                    "allowsChildren": false,
                                    "children": [],
                                    "props": {
                                      "content": "$99"
                                    },
                                    icon: undefined
                                  }
                                ],
                                icon: undefined
                              },
                              {
                                "id": "r3vfomj45",
                                "name": "span",
                                "type": "span",
                                "props": {
                                  "className": "text-muted-foreground"
                                },
                                "allowsChildren": true,
                                "children": [
                                  {
                                    "id": "1727219040488hlgq8nfap",
                                    "name": "Text",
                                    "type": "text",
                                    "allowsChildren": false,
                                    "children": [],
                                    "props": {
                                      "content": "/ month"
                                    },
                                    icon: undefined
                                  }
                                ],
                                icon: undefined
                              }
                            ],
                            icon: undefined
                          },
                          {
                            "id": "ftcwmbfg2",
                            "name": "Separator",
                            "type": "Separator",
                            "props": {
                              "className": "my-4"
                            },
                            "allowsChildren": true,
                            "children": [],
                            icon: undefined
                          },
                          {
                            "id": "shzalddhc",
                            "name": "div",
                            "type": "div",
                            "props": {
                              "className": "space-y-2"
                            },
                            "allowsChildren": true,
                            "children": [
                              {
                                "id": "43iqqnbbq",
                                "name": "div",
                                "type": "div",
                                "props": {
                                  "className": "flex items-center gap-2"
                                },
                                "allowsChildren": true,
                                "children": [
                                  {
                                    "id": "z195pfpqj",
                                    "name": "CheckIcon",
                                    "type": "CheckIcon",
                                    "props": {
                                      "className": "h-5 w-5 text-primary"
                                    },
                                    "allowsChildren": true,
                                    "children": [],
                                    icon: undefined
                                  },
                                  {
                                    "id": "23top6zbf",
                                    "name": "span",
                                    "type": "span",
                                    "props": {},
                                    "allowsChildren": true,
                                    "children": [
                                      {
                                        "id": "1727219040491fn5p3ujdq",
                                        "name": "Text",
                                        "type": "text",
                                        "allowsChildren": false,
                                        "children": [],
                                        "props": {
                                          "content": "Unlimited users"
                                        },
                                        icon: undefined
                                      }
                                    ],
                                    icon: undefined
                                  }
                                ],
                                icon: undefined
                              },
                              {
                                "id": "50lnn5vau",
                                "name": "div",
                                "type": "div",
                                "props": {
                                  "className": "flex items-center gap-2"
                                },
                                "allowsChildren": true,
                                "children": [
                                  {
                                    "id": "nanbgy0xw",
                                    "name": "CheckIcon",
                                    "type": "CheckIcon",
                                    "props": {
                                      "className": "h-5 w-5 text-primary"
                                    },
                                    "allowsChildren": true,
                                    "children": [],
                                    icon: undefined
                                  },
                                  {
                                    "id": "4jv9iezxl",
                                    "name": "span",
                                    "type": "span",
                                    "props": {},
                                    "allowsChildren": true,
                                    "children": [
                                      {
                                        "id": "1727219040492qyzzosohb",
                                        "name": "Text",
                                        "type": "text",
                                        "allowsChildren": false,
                                        "children": [],
                                        "props": {
                                          "content": "24/7 support"
                                        },
                                        icon: undefined
                                      }
                                    ],
                                    icon: undefined
                                  }
                                ],
                                icon: undefined
                              },
                              {
                                "id": "gr6qp62r3",
                                "name": "div",
                                "type": "div",
                                "props": {
                                  "className": "flex items-center gap-2"
                                },
                                "allowsChildren": true,
                                "children": [
                                  {
                                    "id": "wvvhqbzqb",
                                    "name": "CheckIcon",
                                    "type": "CheckIcon",
                                    "props": {
                                      "className": "h-5 w-5 text-primary"
                                    },
                                    "allowsChildren": true,
                                    "children": [],
                                    icon: undefined
                                  },
                                  {
                                    "id": "gki1jxci8",
                                    "name": "span",
                                    "type": "span",
                                    "props": {},
                                    "allowsChildren": true,
                                    "children": [
                                      {
                                        "id": "1727219040493i8b8gc9x5",
                                        "name": "Text",
                                        "type": "text",
                                        "allowsChildren": false,
                                        "children": [],
                                        "props": {
                                          "content": "Advanced analytics"
                                        },
                                        icon: undefined
                                      }
                                    ],
                                    icon: undefined
                                  }
                                ],
                                icon: undefined
                              }
                            ],
                            icon: undefined
                          }
                        ],
                        icon: undefined
                      }
                    ],
                    icon: undefined
                  },
                  {
                    "id": "a46o0rg5a",
                    "name": "div",
                    "type": "div",
                    "props": {
                      "className": "space-y-4"
                    },
                    "allowsChildren": true,
                    "children": [
                      {
                        "id": "yp663zplf",
                        "name": "div",
                        "type": "div",
                        "props": {},
                        "allowsChildren": true,
                        "children": [
                          {
                            "id": "6l1984h8s",
                            "name": "h2",
                            "type": "h2",
                            "props": {
                              "className": "text-2xl font-bold"
                            },
                            "allowsChildren": true,
                            "children": [
                              {
                                "id": "17272190405003mik3ta5t",
                                "name": "Text",
                                "type": "text",
                                "allowsChildren": false,
                                "children": [],
                                "props": {
                                  "content": "Checkout"
                                },
                                icon: undefined
                              }
                            ],
                            icon: undefined
                          },
                          {
                            "id": "vgngvuu3b",
                            "name": "p",
                            "type": "p",
                            "props": {
                              "className": "text-muted-foreground"
                            },
                            "allowsChildren": true,
                            "children": [
                              {
                                "id": "17272190405006xuyyt6nq",
                                "name": "Text",
                                "type": "text",
                                "allowsChildren": false,
                                "children": [],
                                "props": {
                                  "content": "Complete your purchase and start using our platform."
                                },
                                icon: undefined
                              }
                            ],
                            icon: undefined
                          }
                        ],
                        icon: undefined
                      },
                      {
                        "id": "pmtahsnyg",
                        "name": "Card",
                        "type": "Card",
                        "props": {
                          "className": "rounded-lg border border-muted bg-card p-6"
                        },
                        "allowsChildren": true,
                        "children": [
                          {
                            "id": "mdnaaeymf",
                            "name": "form",
                            "type": "form",
                            "props": {
                              "className": "space-y-4"
                            },
                            "allowsChildren": true,
                            "children": [
                              {
                                "id": "qfx7rar6i",
                                "name": "div",
                                "type": "div",
                                "props": {
                                  "className": "grid gap-2"
                                },
                                "allowsChildren": true,
                                "children": [
                                  {
                                    "id": "cdh3rtcqd",
                                    "name": "Label",
                                    "type": "Label",
                                    "props": {
                                      "htmlFor": "email"
                                    },
                                    "allowsChildren": true,
                                    "children": [
                                      {
                                        "id": "1727219040520d3d8jh0n8",
                                        "name": "Text",
                                        "type": "text",
                                        "allowsChildren": false,
                                        "children": [],
                                        "props": {
                                          "content": "Email"
                                        },
                                        icon: undefined
                                      }
                                    ],
                                    icon: undefined
                                  },
                                  {
                                    "id": "4qylmrs3a",
                                    "name": "Input",
                                    "type": "Input",
                                    "props": {
                                      "id": "email",
                                      "type": "email",
                                      "placeholder": "you@example.com"
                                    },
                                    "allowsChildren": true,
                                    "children": [],
                                    icon: undefined
                                  }
                                ],
                                icon: undefined
                              },
                              {
                                "id": "l2guurmv8",
                                "name": "div",
                                "type": "div",
                                "props": {
                                  "className": "grid gap-2"
                                },
                                "allowsChildren": true,
                                "children": [
                                  {
                                    "id": "u47v1g8ak",
                                    "name": "Label",
                                    "type": "Label",
                                    "props": {
                                      "htmlFor": "card-number"
                                    },
                                    "allowsChildren": true,
                                    "children": [
                                      {
                                        "id": "1727219040522171mmjm16",
                                        "name": "Text",
                                        "type": "text",
                                        "allowsChildren": false,
                                        "children": [],
                                        "props": {
                                          "content": "Card Number"
                                        },
                                        icon: undefined
                                      }
                                    ],
                                    icon: undefined
                                  },
                                  {
                                    "id": "beovsronj",
                                    "name": "Input",
                                    "type": "Input",
                                    "props": {
                                      "id": "card-number",
                                      "type": "text",
                                      "placeholder": "4111 1111 1111 1111"
                                    },
                                    "allowsChildren": true,
                                    "children": [],
                                    icon: undefined
                                  }
                                ],
                                icon: undefined
                              },
                              {
                                "id": "0a7ssi01g",
                                "name": "div",
                                "type": "div",
                                "props": {
                                  "className": "grid grid-cols-3 gap-4"
                                },
                                "allowsChildren": true,
                                "children": [
                                  {
                                    "id": "5v4xekcw8",
                                    "name": "div",
                                    "type": "div",
                                    "props": {
                                      "className": "grid gap-2"
                                    },
                                    "allowsChildren": true,
                                    "children": [
                                      {
                                        "id": "b8er0csum",
                                        "name": "Label",
                                        "type": "Label",
                                        "props": {
                                          "htmlFor": "expiry"
                                        },
                                        "allowsChildren": true,
                                        "children": [
                                          {
                                            "id": "1727219040525zgyaeush8",
                                            "name": "Text",
                                            "type": "text",
                                            "allowsChildren": false,
                                            "children": [],
                                            "props": {
                                              "content": "Expiry"
                                            },
                                            icon: undefined
                                          }
                                        ],
                                        icon: undefined
                                      },
                                      {
                                        "id": "6edezz1ou",
                                        "name": "div",
                                        "type": "div",
                                        "props": {
                                          "className": "flex gap-2"
                                        },
                                        "allowsChildren": true,
                                        "children": [
                                          {
                                            "id": "bofbcahs7",
                                            "name": "Select",
                                            "type": "Select",
                                            "props": {},
                                            "allowsChildren": true,
                                            "children": [
                                              {
                                                "id": "qvitd5gg7",
                                                "name": "SelectTrigger",
                                                "type": "SelectTrigger",
                                                "props": {
                                                  "className": "w-full"
                                                },
                                                "allowsChildren": true,
                                                "children": [
                                                  {
                                                    "id": "onxyzkrt4",
                                                    "name": "SelectValue",
                                                    "type": "SelectValue",
                                                    "props": {
                                                      "placeholder": "MM"
                                                    },
                                                    "allowsChildren": true,
                                                    "children": [],
                                                    icon: undefined
                                                  }
                                                ],
                                                icon: undefined
                                              },
                                              {
                                                "id": "fxt8bpvrg",
                                                "name": "SelectContent",
                                                "type": "SelectContent",
                                                "props": {},
                                                "allowsChildren": true,
                                                "children": [
                                                  {
                                                    "id": "25dcrfsih",
                                                    "name": "SelectItem",
                                                    "type": "SelectItem",
                                                    "props": {
                                                      "value": "01"
                                                    },
                                                    "allowsChildren": true,
                                                    "children": [
                                                      {
                                                        "id": "1727219040529a7ozkaj8c",
                                                        "name": "Text",
                                                        "type": "text",
                                                        "allowsChildren": false,
                                                        "children": [],
                                                        "props": {
                                                          "content": "01"
                                                        },
                                                        icon: undefined
                                                      }
                                                    ],
                                                    icon: undefined
                                                  },
                                                  {
                                                    "id": "nz6esltyb",
                                                    "name": "SelectItem",
                                                    "type": "SelectItem",
                                                    "props": {
                                                      "value": "02"
                                                    },
                                                    "allowsChildren": true,
                                                    "children": [
                                                      {
                                                        "id": "17272190405306pqf20qan",
                                                        "name": "Text",
                                                        "type": "text",
                                                        "allowsChildren": false,
                                                        "children": [],
                                                        "props": {
                                                          "content": "02"
                                                        },
                                                        icon: undefined
                                                      }
                                                    ],
                                                    icon: undefined
                                                  },
                                                  {
                                                    "id": "194f06xv4",
                                                    "name": "SelectItem",
                                                    "type": "SelectItem",
                                                    "props": {
                                                      "value": "03"
                                                    },
                                                    "allowsChildren": true,
                                                    "children": [
                                                      {
                                                        "id": "17272190405300lw8hx70p",
                                                        "name": "Text",
                                                        "type": "text",
                                                        "allowsChildren": false,
                                                        "children": [],
                                                        "props": {
                                                          "content": "03"
                                                        },
                                                        icon: undefined
                                                      }
                                                    ],
                                                    icon: undefined
                                                  },
                                                  {
                                                    "id": "731aq4cga",
                                                    "name": "SelectItem",
                                                    "type": "SelectItem",
                                                    "props": {
                                                      "value": "04"
                                                    },
                                                    "allowsChildren": true,
                                                    "children": [
                                                      {
                                                        "id": "1727219040530hbw4d4op8",
                                                        "name": "Text",
                                                        "type": "text",
                                                        "allowsChildren": false,
                                                        "children": [],
                                                        "props": {
                                                          "content": "04"
                                                        },
                                                        icon: undefined
                                                      }
                                                    ],
                                                    icon: undefined
                                                  },
                                                  {
                                                    "id": "vpjq9hvh4",
                                                    "name": "SelectItem",
                                                    "type": "SelectItem",
                                                    "props": {
                                                      "value": "05"
                                                    },
                                                    "allowsChildren": true,
                                                    "children": [
                                                      {
                                                        "id": "1727219040531qudg3bzpk",
                                                        "name": "Text",
                                                        "type": "text",
                                                        "allowsChildren": false,
                                                        "children": [],
                                                        "props": {
                                                          "content": "05"
                                                        },
                                                        icon: undefined
                                                      }
                                                    ],
                                                    icon: undefined
                                                  },
                                                  {
                                                    "id": "tilit4yea",
                                                    "name": "SelectItem",
                                                    "type": "SelectItem",
                                                    "props": {
                                                      "value": "06"
                                                    },
                                                    "allowsChildren": true,
                                                    "children": [
                                                      {
                                                        "id": "1727219040531j91ztvjj5",
                                                        "name": "Text",
                                                        "type": "text",
                                                        "allowsChildren": false,
                                                        "children": [],
                                                        "props": {
                                                          "content": "06"
                                                        },
                                                        icon: undefined
                                                      }
                                                    ],
                                                    icon: undefined
                                                  },
                                                  {
                                                    "id": "2y77jrdm7",
                                                    "name": "SelectItem",
                                                    "type": "SelectItem",
                                                    "props": {
                                                      "value": "07"
                                                    },
                                                    "allowsChildren": true,
                                                    "children": [
                                                      {
                                                        "id": "172721904053128d213pif",
                                                        "name": "Text",
                                                        "type": "text",
                                                        "allowsChildren": false,
                                                        "children": [],
                                                        "props": {
                                                          "content": "07"
                                                        },
                                                        icon: undefined
                                                      }
                                                    ],
                                                    icon: undefined
                                                  },
                                                  {
                                                    "id": "2gt2q4y6i",
                                                    "name": "SelectItem",
                                                    "type": "SelectItem",
                                                    "props": {
                                                      "value": "08"
                                                    },
                                                    "allowsChildren": true,
                                                    "children": [
                                                      {
                                                        "id": "1727219040532plaka2ng9",
                                                        "name": "Text",
                                                        "type": "text",
                                                        "allowsChildren": false,
                                                        "children": [],
                                                        "props": {
                                                          "content": "08"
                                                        },
                                                        icon: undefined
                                                      }
                                                    ],
                                                    icon: undefined
                                                  },
                                                  {
                                                    "id": "uvxik5y5l",
                                                    "name": "SelectItem",
                                                    "type": "SelectItem",
                                                    "props": {
                                                      "value": "09"
                                                    },
                                                    "allowsChildren": true,
                                                    "children": [
                                                      {
                                                        "id": "1727219040532cxgmcz3d6",
                                                        "name": "Text",
                                                        "type": "text",
                                                        "allowsChildren": false,
                                                        "children": [],
                                                        "props": {
                                                          "content": "09"
                                                        },
                                                        icon: undefined
                                                      }
                                                    ],
                                                    icon: undefined
                                                  },
                                                  {
                                                    "id": "iq7pb9ubs",
                                                    "name": "SelectItem",
                                                    "type": "SelectItem",
                                                    "props": {
                                                      "value": "10"
                                                    },
                                                    "allowsChildren": true,
                                                    "children": [
                                                      {
                                                        "id": "1727219040533e9k0l0u7x",
                                                        "name": "Text",
                                                        "type": "text",
                                                        "allowsChildren": false,
                                                        "children": [],
                                                        "props": {
                                                          "content": "10"
                                                        },
                                                        icon: undefined
                                                      }
                                                    ],
                                                    icon: undefined
                                                  },
                                                  {
                                                    "id": "455yi1kob",
                                                    "name": "SelectItem",
                                                    "type": "SelectItem",
                                                    "props": {
                                                      "value": "11"
                                                    },
                                                    "allowsChildren": true,
                                                    "children": [
                                                      {
                                                        "id": "1727219040533nl9s9k9vx",
                                                        "name": "Text",
                                                        "type": "text",
                                                        "allowsChildren": false,
                                                        "children": [],
                                                        "props": {
                                                          "content": "11"
                                                        },
                                                        icon: undefined
                                                      }
                                                    ],
                                                    icon: undefined
                                                  },
                                                  {
                                                    "id": "v645dmbce",
                                                    "name": "SelectItem",
                                                    "type": "SelectItem",
                                                    "props": {
                                                      "value": "12"
                                                    },
                                                    "allowsChildren": true,
                                                    "children": [
                                                      {
                                                        "id": "1727219040534nlodfz7o9",
                                                        "name": "Text",
                                                        "type": "text",
                                                        "allowsChildren": false,
                                                        "children": [],
                                                        "props": {
                                                          "content": "12"
                                                        },
                                                        icon: undefined
                                                      }
                                                    ],
                                                    icon: undefined
                                                  }
                                                ],
                                                icon: undefined
                                              }
                                            ],
                                            icon: undefined
                                          },
                                          {
                                            "id": "uqawzus1m",
                                            "name": "Select",
                                            "type": "Select",
                                            "props": {},
                                            "allowsChildren": true,
                                            "children": [
                                              {
                                                "id": "omwtc2ta6",
                                                "name": "SelectTrigger",
                                                "type": "SelectTrigger",
                                                "props": {
                                                  "className": "w-full"
                                                },
                                                "allowsChildren": true,
                                                "children": [
                                                  {
                                                    "id": "z9arjaxow",
                                                    "name": "SelectValue",
                                                    "type": "SelectValue",
                                                    "props": {
                                                      "placeholder": "YY"
                                                    },
                                                    "allowsChildren": true,
                                                    "children": [],
                                                    icon: undefined
                                                  }
                                                ],
                                                icon: undefined
                                              },
                                              {
                                                "id": "o3vpsvmyl",
                                                "name": "SelectContent",
                                                "type": "SelectContent",
                                                "props": {},
                                                "allowsChildren": true,
                                                "children": [
                                                  {
                                                    "id": "8qt4zzqhh",
                                                    "name": "SelectItem",
                                                    "type": "SelectItem",
                                                    "props": {
                                                      "value": "23"
                                                    },
                                                    "allowsChildren": true,
                                                    "children": [
                                                      {
                                                        "id": "1727219040538hu2wh1efk",
                                                        "name": "Text",
                                                        "type": "text",
                                                        "allowsChildren": false,
                                                        "children": [],
                                                        "props": {
                                                          "content": "23"
                                                        },
                                                        icon: undefined
                                                      }
                                                    ],
                                                    icon: undefined
                                                  },
                                                  {
                                                    "id": "y3mwhkss1",
                                                    "name": "SelectItem",
                                                    "type": "SelectItem",
                                                    "props": {
                                                      "value": "24"
                                                    },
                                                    "allowsChildren": true,
                                                    "children": [
                                                      {
                                                        "id": "1727219040538451u9yz00",
                                                        "name": "Text",
                                                        "type": "text",
                                                        "allowsChildren": false,
                                                        "children": [],
                                                        "props": {
                                                          "content": "24"
                                                        },
                                                        icon: undefined
                                                      }
                                                    ],
                                                    icon: undefined
                                                  },
                                                  {
                                                    "id": "24iy3w5yx",
                                                    "name": "SelectItem",
                                                    "type": "SelectItem",
                                                    "props": {
                                                      "value": "25"
                                                    },
                                                    "allowsChildren": true,
                                                    "children": [
                                                      {
                                                        "id": "1727219040539uxroy17li",
                                                        "name": "Text",
                                                        "type": "text",
                                                        "allowsChildren": false,
                                                        "children": [],
                                                        "props": {
                                                          "content": "25"
                                                        },
                                                        icon: undefined
                                                      }
                                                    ],
                                                    icon: undefined
                                                  },
                                                  {
                                                    "id": "5o4g83zml",
                                                    "name": "SelectItem",
                                                    "type": "SelectItem",
                                                    "props": {
                                                      "value": "26"
                                                    },
                                                    "allowsChildren": true,
                                                    "children": [
                                                      {
                                                        "id": "1727219040539hdhl7iewv",
                                                        "name": "Text",
                                                        "type": "text",
                                                        "allowsChildren": false,
                                                        "children": [],
                                                        "props": {
                                                          "content": "26"
                                                        },
                                                        icon: undefined
                                                      }
                                                    ],
                                                    icon: undefined
                                                  },
                                                  {
                                                    "id": "cln9thvb8",
                                                    "name": "SelectItem",
                                                    "type": "SelectItem",
                                                    "props": {
                                                      "value": "27"
                                                    },
                                                    "allowsChildren": true,
                                                    "children": [
                                                      {
                                                        "id": "17272190405408kvoklini",
                                                        "name": "Text",
                                                        "type": "text",
                                                        "allowsChildren": false,
                                                        "children": [],
                                                        "props": {
                                                          "content": "27"
                                                        },
                                                        icon: undefined
                                                      }
                                                    ],
                                                    icon: undefined
                                                  },
                                                  {
                                                    "id": "g7463el9e",
                                                    "name": "SelectItem",
                                                    "type": "SelectItem",
                                                    "props": {
                                                      "value": "28"
                                                    },
                                                    "allowsChildren": true,
                                                    "children": [
                                                      {
                                                        "id": "17272190405408l7a0y4d0",
                                                        "name": "Text",
                                                        "type": "text",
                                                        "allowsChildren": false,
                                                        "children": [],
                                                        "props": {
                                                          "content": "28"
                                                        },
                                                        icon: undefined
                                                      }
                                                    ],
                                                    icon: undefined
                                                  },
                                                  {
                                                    "id": "20pfa1bnw",
                                                    "name": "SelectItem",
                                                    "type": "SelectItem",
                                                    "props": {
                                                      "value": "29"
                                                    },
                                                    "allowsChildren": true,
                                                    "children": [
                                                      {
                                                        "id": "17272190405402ayxp3938",
                                                        "name": "Text",
                                                        "type": "text",
                                                        "allowsChildren": false,
                                                        "children": [],
                                                        "props": {
                                                          "content": "29"
                                                        },
                                                        icon: undefined
                                                      }
                                                    ],
                                                    icon: undefined
                                                  },
                                                  {
                                                    "id": "zeofte8rw",
                                                    "name": "SelectItem",
                                                    "type": "SelectItem",
                                                    "props": {
                                                      "value": "30"
                                                    },
                                                    "allowsChildren": true,
                                                    "children": [
                                                      {
                                                        "id": "17272190405410k063cdeo",
                                                        "name": "Text",
                                                        "type": "text",
                                                        "allowsChildren": false,
                                                        "children": [],
                                                        "props": {
                                                          "content": "30"
                                                        },
                                                        icon: undefined
                                                      }
                                                    ],
                                                    icon: undefined
                                                  }
                                                ],
                                                icon: undefined
                                              }
                                            ],
                                            icon: undefined
                                          }
                                        ],
                                        icon: undefined
                                      }
                                    ],
                                    icon: undefined
                                  },
                                  {
                                    "id": "oyh2ru8gw",
                                    "name": "div",
                                    "type": "div",
                                    "props": {
                                      "className": "grid gap-2"
                                    },
                                    "allowsChildren": true,
                                    "children": [
                                      {
                                        "id": "owf2fw1cf",
                                        "name": "Label",
                                        "type": "Label",
                                        "props": {
                                          "htmlFor": "cvc"
                                        },
                                        "allowsChildren": true,
                                        "children": [
                                          {
                                            "id": "1727219040542rgzj1g8qt",
                                            "name": "Text",
                                            "type": "text",
                                            "allowsChildren": false,
                                            "children": [],
                                            "props": {
                                              "content": "CVC"
                                            },
                                            icon: undefined
                                          }
                                        ],
                                        icon: undefined
                                      },
                                      {
                                        "id": "zyy8xh5pp",
                                        "name": "Input",
                                        "type": "Input",
                                        "props": {
                                          "id": "cvc",
                                          "type": "text",
                                          "placeholder": "123"
                                        },
                                        "allowsChildren": true,
                                        "children": [],
                                        icon: undefined
                                      }
                                    ],
                                    icon: undefined
                                  }
                                ],
                                icon: undefined
                              },
                              {
                                "id": "vgjx3gs02",
                                "name": "Button",
                                "type": "Button",
                                "props": {
                                  "type": "submit",
                                  "className": "w-full"
                                },
                                "allowsChildren": true,
                                "children": [
                                  {
                                    "id": "17272190405423xs0tld4b",
                                    "name": "Text",
                                    "type": "text",
                                    "allowsChildren": false,
                                    "children": [],
                                    "props": {
                                      "content": "Start Your Free Trial"
                                    },
                                    icon: undefined
                                  }
                                ],
                                icon: undefined
                              }
                            ],
                            icon: undefined
                          }
                        ],
                        icon: undefined
                      }
                    ],
                    icon: undefined
                  }
                ],
                icon: undefined
              }
            ],
            icon: undefined
          }
        ],
        icon: undefined
      }
    ],
    icon: undefined
  }
]

const contactSection: TreeItem[] = [
  {
    "id": "6gionqvsi",
    "name": "Contact Section",
    "type": "Card",
    "props": {
      "className": "mx-auto max-w-md my-10"
    },
    "allowsChildren": true,
    "children": [
      {
        "id": "dgn5s173a",
        "name": "CardHeader",
        "type": "CardHeader",
        "props": {},
        "allowsChildren": true,
        "children": [
          {
            "id": "432vudiz4",
            "name": "CardTitle",
            "type": "CardTitle",
            "props": {},
            "allowsChildren": true,
            "children": [
              {
                "id": "1727219275849qfzaa36qx",
                "name": "Text",
                "type": "text",
                "allowsChildren": false,
                "children": [],
                "props": {
                  "content": "Contact Us"
                },
                icon: undefined
              }
            ],
            icon: undefined
          },
          {
            "id": "bho1sjqql",
            "name": "CardDescription",
            "type": "CardDescription",
            "props": {},
            "allowsChildren": true,
            "children": [
              {
                "id": "1727219275850o3kchwr5o",
                "name": "Text",
                "type": "text",
                "allowsChildren": false,
                "children": [],
                "props": {
                  "content": "Fill out the form below and we'll get back to you as soon as possible."
                },
                icon: undefined
              }
            ],
            icon: undefined
          }
        ],
        icon: undefined
      },
      {
        "id": "1ms1mvkjj",
        "name": "CardContent",
        "type": "CardContent",
        "props": {},
        "allowsChildren": true,
        "children": [
          {
            "id": "hiucxxxua",
            "name": "form",
            "type": "form",
            "props": {
              "className": "space-y-4"
            },
            "allowsChildren": true,
            "children": [
              {
                "id": "8dwykejfu",
                "name": "div",
                "type": "div",
                "props": {
                  "className": "grid grid-cols-2 gap-4"
                },
                "allowsChildren": true,
                "children": [
                  {
                    "id": "y2dgb4zsa",
                    "name": "div",
                    "type": "div",
                    "props": {
                      "className": "space-y-2"
                    },
                    "allowsChildren": true,
                    "children": [
                      {
                        "id": "4fxeghvyb",
                        "name": "Label",
                        "type": "Label",
                        "props": {
                          "htmlFor": "first-name"
                        },
                        "allowsChildren": true,
                        "children": [
                          {
                            "id": "1727219275861ozbwb8hn9",
                            "name": "Text",
                            "type": "text",
                            "allowsChildren": false,
                            "children": [],
                            "props": {
                              "content": "First Name"
                            },
                            icon: undefined
                          }
                        ],
                        icon: undefined
                      },
                      {
                        "id": "i8rlvcfaw",
                        "name": "Input",
                        "type": "Input",
                        "props": {
                          "id": "first-name",
                          "placeholder": "John"
                        },
                        "allowsChildren": true,
                        "children": [],
                        icon: undefined
                      }
                    ],
                    icon: undefined
                  },
                  {
                    "id": "qhcbn8jyd",
                    "name": "div",
                    "type": "div",
                    "props": {
                      "className": "space-y-2"
                    },
                    "allowsChildren": true,
                    "children": [
                      {
                        "id": "nyibv1sth",
                        "name": "Label",
                        "type": "Label",
                        "props": {
                          "htmlFor": "last-name"
                        },
                        "allowsChildren": true,
                        "children": [
                          {
                            "id": "17272192758685lz8iudkq",
                            "name": "Text",
                            "type": "text",
                            "allowsChildren": false,
                            "children": [],
                            "props": {
                              "content": "Last Name"
                            },
                            icon: undefined
                          }
                        ],
                        icon: undefined
                      },
                      {
                        "id": "xyktzqi77",
                        "name": "Input",
                        "type": "Input",
                        "props": {
                          "id": "last-name",
                          "placeholder": "Doe"
                        },
                        "allowsChildren": true,
                        "children": [],
                        icon: undefined
                      }
                    ],
                    icon: undefined
                  }
                ],
                icon: undefined
              },
              {
                "id": "fkqcxgqav",
                "name": "div",
                "type": "div",
                "props": {
                  "className": "space-y-2"
                },
                "allowsChildren": true,
                "children": [
                  {
                    "id": "et82l5ix9",
                    "name": "Label",
                    "type": "Label",
                    "props": {
                      "htmlFor": "email"
                    },
                    "allowsChildren": true,
                    "children": [
                      {
                        "id": "1727219275870wisy039by",
                        "name": "Text",
                        "type": "text",
                        "allowsChildren": false,
                        "children": [],
                        "props": {
                          "content": "Email"
                        },
                        icon: undefined
                      }
                    ],
                    icon: undefined
                  },
                  {
                    "id": "joh26mlwn",
                    "name": "Input",
                    "type": "Input",
                    "props": {
                      "id": "email",
                      "type": "email",
                      "placeholder": "john@example.com"
                    },
                    "allowsChildren": true,
                    "children": [],
                    icon: undefined
                  }
                ],
                icon: undefined
              },
              {
                "id": "lbxgth7kt",
                "name": "div",
                "type": "div",
                "props": {
                  "className": "space-y-2"
                },
                "allowsChildren": true,
                "children": [
                  {
                    "id": "t95s5hysu",
                    "name": "Label",
                    "type": "Label",
                    "props": {
                      "htmlFor": "message"
                    },
                    "allowsChildren": true,
                    "children": [
                      {
                        "id": "1727219275871ozwop1yah",
                        "name": "Text",
                        "type": "text",
                        "allowsChildren": false,
                        "children": [],
                        "props": {
                          "content": "Message"
                        },
                        icon: undefined
                      }
                    ],
                    icon: undefined
                  },
                  {
                    "id": "zw3kv7xdd",
                    "name": "Textarea",
                    "type": "Textarea",
                    "props": {
                      "id": "message",
                      "placeholder": "How can we help you?",
                      "className": "min-h-[120px]"
                    },
                    "allowsChildren": true,
                    "children": [],
                    icon: undefined
                  }
                ],
                icon: undefined
              },
              {
                "id": "rq60krvre",
                "name": "Button",
                "type": "Button",
                "props": {
                  "type": "submit",
                  "className": "w-full"
                },
                "allowsChildren": true,
                "children": [
                  {
                    "id": "1727219275872t8dhkdzqk",
                    "name": "Text",
                    "type": "text",
                    "allowsChildren": false,
                    "children": [],
                    "props": {
                      "content": "Submit"
                    },
                    icon: undefined
                  }
                ],
                icon: undefined
              }
            ],
            icon: undefined
          }
        ],
        icon: undefined
      }
    ],
    icon: undefined
  }
]

const landingPageSection: TreeItem[] = [
  {
    "id": "xmzrynoog",
    "name": "LandingPage Section",
    "type": "div",
    "props": {
      "className": "flex flex-col min-h-[100dvh]"
    },
    "allowsChildren": true,
    "children": [
      {
        "id": "eyaxwt9ql",
        "name": "header",
        "type": "header",
        "props": {
          "className": "px-4 lg:px-6 h-14 flex items-center bg-background border-b"
        },
        "allowsChildren": true,
        "children": [
          {
            "id": "w519n1jhe",
            "name": "Link",
            "type": "Link",
            "props": {
              "href": "#",
              "className": "flex items-center justify-center",
              "prefetch": null
            },
            "allowsChildren": true,
            "children": [
              {
                "id": "y7ofznejk",
                "name": "CodeIcon",
                "type": "CodeIcon",
                "props": {
                  "className": "h-6 w-6 text-primary"
                },
                "allowsChildren": true,
                "children": [],
                icon: undefined
              },
              {
                "id": "tub2w131q",
                "name": "span",
                "type": "span",
                "props": {
                  "className": "ml-2 text-lg font-bold text-foreground"
                },
                "allowsChildren": true,
                "children": [
                  {
                    "id": "1727219418920v082fccx8",
                    "name": "Text",
                    "type": "text",
                    "allowsChildren": false,
                    "children": [],
                    "props": {
                      "content": "John Doe"
                    },
                    icon: undefined
                  }
                ],
                icon: undefined
              }
            ],
            icon: undefined
          },
          {
            "id": "43ymbx0dd",
            "name": "nav",
            "type": "nav",
            "props": {
              "className": "ml-auto flex gap-4 sm:gap-6"
            },
            "allowsChildren": true,
            "children": [
              {
                "id": "87c1zdt1p",
                "name": "Link",
                "type": "Link",
                "props": {
                  "href": "#",
                  "className": "text-sm font-medium hover:underline underline-offset-4 text-foreground",
                  "prefetch": null
                },
                "allowsChildren": true,
                "children": [
                  {
                    "id": "1727219418924a0ekjy20f",
                    "name": "Text",
                    "type": "text",
                    "allowsChildren": false,
                    "children": [],
                    "props": {
                      "content": "About"
                    },
                    icon: undefined
                  }
                ],
                icon: undefined
              },
              {
                "id": "voq1gh6d2",
                "name": "Link",
                "type": "Link",
                "props": {
                  "href": "#",
                  "className": "text-sm font-medium hover:underline underline-offset-4 text-foreground",
                  "prefetch": null
                },
                "allowsChildren": true,
                "children": [
                  {
                    "id": "1727219418925nhe2ki2b8",
                    "name": "Text",
                    "type": "text",
                    "allowsChildren": false,
                    "children": [],
                    "props": {
                      "content": "Projects"
                    },
                    icon: undefined
                  }
                ],
                icon: undefined
              },
              {
                "id": "0ff46fyuy",
                "name": "Link",
                "type": "Link",
                "props": {
                  "href": "#",
                  "className": "text-sm font-medium hover:underline underline-offset-4 text-foreground",
                  "prefetch": null
                },
                "allowsChildren": true,
                "children": [
                  {
                    "id": "17272194189251d4161v2c",
                    "name": "Text",
                    "type": "text",
                    "allowsChildren": false,
                    "children": [],
                    "props": {
                      "content": "Contact"
                    },
                    icon: undefined
                  }
                ],
                icon: undefined
              }
            ],
            icon: undefined
          }
        ],
        icon: undefined
      },
      {
        "id": "lb1riwsn1",
        "name": "main",
        "type": "main",
        "props": {
          "className": "flex-1"
        },
        "allowsChildren": true,
        "children": [
          {
            "id": "5da6ue8he",
            "name": "section",
            "type": "section",
            "props": {
              "className": "w-full py-12 md:py-24 lg:py-32 bg-background"
            },
            "allowsChildren": true,
            "children": [
              {
                "id": "wt9n09t3y",
                "name": "div",
                "type": "div",
                "props": {
                  "className": "container px-4 md:px-6"
                },
                "allowsChildren": true,
                "children": [
                  {
                    "id": "9b6tnnwm6",
                    "name": "div",
                    "type": "div",
                    "props": {
                      "className": "grid gap-6 lg:grid-cols-[1fr_400px] lg:gap-12 xl:grid-cols-[1fr_600px]"
                    },
                    "allowsChildren": true,
                    "children": [
                      {
                        "id": "qvpgfig4r",
                        "name": "div",
                        "type": "div",
                        "props": {
                          "className": "flex flex-col justify-center space-y-4"
                        },
                        "allowsChildren": true,
                        "children": [
                          {
                            "id": "87fzynp7o",
                            "name": "div",
                            "type": "div",
                            "props": {
                              "className": "space-y-2"
                            },
                            "allowsChildren": true,
                            "children": [
                              {
                                "id": "e76c8jmpt",
                                "name": "h1",
                                "type": "h1",
                                "props": {
                                  "className": "text-4xl font-bold tracking-tighter sm:text-5xl xl:text-6xl/none text-foreground"
                                },
                                "allowsChildren": true,
                                "children": [
                                  {
                                    "id": "17272194189421hbdd1u81",
                                    "name": "Text",
                                    "type": "text",
                                    "allowsChildren": false,
                                    "children": [],
                                    "props": {
                                      "content": "John Doe"
                                    },
                                    icon: undefined
                                  }
                                ],
                                icon: undefined
                              },
                              {
                                "id": "2owvp52js",
                                "name": "p",
                                "type": "p",
                                "props": {
                                  "className": "max-w-[600px] text-muted-foreground md:text-xl"
                                },
                                "allowsChildren": true,
                                "children": [
                                  {
                                    "id": "1727219418942j302jjeen",
                                    "name": "Text",
                                    "type": "text",
                                    "allowsChildren": false,
                                    "children": [],
                                    "props": {
                                      "content": "Fullstack Developer | React | Node.js | MongoDB"
                                    },
                                    icon: undefined
                                  }
                                ],
                                icon: undefined
                              },
                              {
                                "id": "3i4g140bv",
                                "name": "p",
                                "type": "p",
                                "props": {
                                  "className": "max-w-[600px] text-muted-foreground md:text-xl"
                                },
                                "allowsChildren": true,
                                "children": [
                                  {
                                    "id": "1727219418943uxkebtqoz",
                                    "name": "Text",
                                    "type": "text",
                                    "allowsChildren": false,
                                    "children": [],
                                    "props": {
                                      "content": "I'm a passionate fullstack developer with expertise in building modern web applications using the\n                    latest technologies."
                                    },
                                    icon: undefined
                                  }
                                ],
                                icon: undefined
                              }
                            ],
                            icon: undefined
                          }
                        ],
                        icon: undefined
                      },
                      {
                        "id": "hazdt881q",
                        "name": "img",
                        "type": "img",
                        "props": {
                          "src": "/placeholder.svg",
                          "width": "550",
                          "height": "550",
                          "alt": "Hero",
                          "className": "mx-auto aspect-video overflow-hidden rounded-xl object-cover sm:w-full lg:order-last lg:aspect-square"
                        },
                        "allowsChildren": true,
                        "children": [],
                        icon: undefined
                      }
                    ],
                    icon: undefined
                  }
                ],
                icon: undefined
              }
            ],
            icon: undefined
          },
          {
            "id": "3ee0vwvt2",
            "name": "section",
            "type": "section",
            "props": {
              "className": "w-full py-12 md:py-24 lg:py-32 bg-muted"
            },
            "allowsChildren": true,
            "children": [
              {
                "id": "fqe8lpvh0",
                "name": "div",
                "type": "div",
                "props": {
                  "className": "container px-4 md:px-6"
                },
                "allowsChildren": true,
                "children": [
                  {
                    "id": "kespot0zb",
                    "name": "div",
                    "type": "div",
                    "props": {
                      "className": "flex flex-col items-center justify-center space-y-4 text-center"
                    },
                    "allowsChildren": true,
                    "children": [
                      {
                        "id": "k6vhzhuas",
                        "name": "div",
                        "type": "div",
                        "props": {
                          "className": "space-y-2"
                        },
                        "allowsChildren": true,
                        "children": [
                          {
                            "id": "1102zoi0m",
                            "name": "h2",
                            "type": "h2",
                            "props": {
                              "className": "text-3xl font-bold tracking-tighter sm:text-5xl text-foreground"
                            },
                            "allowsChildren": true,
                            "children": [
                              {
                                "id": "1727219418954l9kp889ue",
                                "name": "Text",
                                "type": "text",
                                "allowsChildren": false,
                                "children": [],
                                "props": {
                                  "content": "Featured Projects"
                                },
                                icon: undefined
                              }
                            ],
                            icon: undefined
                          },
                          {
                            "id": "yuxyytpv6",
                            "name": "p",
                            "type": "p",
                            "props": {
                              "className": "max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed"
                            },
                            "allowsChildren": true,
                            "children": [
                              {
                                "id": "1727219418955hdsx4kh5o",
                                "name": "Text",
                                "type": "text",
                                "allowsChildren": false,
                                "children": [],
                                "props": {
                                  "content": "Check out some of my recent projects and the technologies I used to build them."
                                },
                                icon: undefined
                              }
                            ],
                            icon: undefined
                          }
                        ],
                        icon: undefined
                      }
                    ],
                    icon: undefined
                  },
                  {
                    "id": "rf34d8xgp",
                    "name": "div",
                    "type": "div",
                    "props": {
                      "className": "mx-auto grid max-w-5xl grid-cols-1 gap-6 py-12 sm:grid-cols-2 lg:grid-cols-3 lg:gap-12"
                    },
                    "allowsChildren": true,
                    "children": [
                      {
                        "id": "lng02n6js",
                        "name": "Card",
                        "type": "Card",
                        "props": {},
                        "allowsChildren": true,
                        "children": [
                          {
                            "id": "w2aks53k9",
                            "name": "CardHeader",
                            "type": "CardHeader",
                            "props": {},
                            "allowsChildren": true,
                            "children": [
                              {
                                "id": "j0vamtvz4",
                                "name": "img",
                                "type": "img",
                                "props": {
                                  "src": "/placeholder.svg",
                                  "width": "550",
                                  "height": "310",
                                  "alt": "Project 1",
                                  "className": "mx-auto aspect-video overflow-hidden rounded-xl object-cover object-center sm:w-full"
                                },
                                "allowsChildren": true,
                                "children": [],
                                icon: undefined
                              }
                            ],
                            icon: undefined
                          },
                          {
                            "id": "m5w1ebf04",
                            "name": "CardContent",
                            "type": "CardContent",
                            "props": {},
                            "allowsChildren": true,
                            "children": [
                              {
                                "id": "towh6vs0y",
                                "name": "div",
                                "type": "div",
                                "props": {
                                  "className": "space-y-2"
                                },
                                "allowsChildren": true,
                                "children": [
                                  {
                                    "id": "lmqsu1xze",
                                    "name": "h3",
                                    "type": "h3",
                                    "props": {
                                      "className": "text-xl font-bold text-foreground"
                                    },
                                    "allowsChildren": true,
                                    "children": [
                                      {
                                        "id": "1727219418962y1m5e3nfh",
                                        "name": "Text",
                                        "type": "text",
                                        "allowsChildren": false,
                                        "children": [],
                                        "props": {
                                          "content": "Project 1"
                                        },
                                        icon: undefined
                                      }
                                    ],
                                    icon: undefined
                                  },
                                  {
                                    "id": "u281oyl0s",
                                    "name": "p",
                                    "type": "p",
                                    "props": {
                                      "className": "text-muted-foreground"
                                    },
                                    "allowsChildren": true,
                                    "children": [
                                      {
                                        "id": "17272194189621dbt4gxpa",
                                        "name": "Text",
                                        "type": "text",
                                        "allowsChildren": false,
                                        "children": [],
                                        "props": {
                                          "content": "A fullstack web application built with Next.js, Node.js, and MongoDB."
                                        },
                                        icon: undefined
                                      }
                                    ],
                                    icon: undefined
                                  },
                                  {
                                    "id": "fkyybeubw",
                                    "name": "div",
                                    "type": "div",
                                    "props": {
                                      "className": "flex gap-2 text-sm text-muted-foreground"
                                    },
                                    "allowsChildren": true,
                                    "children": [
                                      {
                                        "id": "nb3ly1sip",
                                        "name": "div",
                                        "type": "div",
                                        "props": {
                                          "className": "flex items-center"
                                        },
                                        "allowsChildren": true,
                                        "children": [
                                          {
                                            "id": "tz9mbmy2b",
                                            "name": "CodepenIcon",
                                            "type": "CodepenIcon",
                                            "props": {
                                              "className": "w-4 h-4 mr-1"
                                            },
                                            "allowsChildren": true,
                                            "children": [],
                                            icon: undefined
                                          },
                                          {
                                            "id": "1727219418963m8zy4z2vk",
                                            "name": "Text",
                                            "type": "text",
                                            "allowsChildren": false,
                                            "children": [],
                                            "props": {
                                              "content": "React"
                                            },
                                            icon: undefined
                                          }
                                        ],
                                        icon: undefined
                                      },
                                      {
                                        "id": "dd6vayjey",
                                        "name": "div",
                                        "type": "div",
                                        "props": {
                                          "className": "flex items-center"
                                        },
                                        "allowsChildren": true,
                                        "children": [
                                          {
                                            "id": "jjsfjvbvz",
                                            "name": "NetworkIcon",
                                            "type": "NetworkIcon",
                                            "props": {
                                              "className": "w-4 h-4 mr-1"
                                            },
                                            "allowsChildren": true,
                                            "children": [],
                                            icon: undefined
                                          },
                                          {
                                            "id": "1727219418964t59mgsfwy",
                                            "name": "Text",
                                            "type": "text",
                                            "allowsChildren": false,
                                            "children": [],
                                            "props": {
                                              "content": "Node.js"
                                            },
                                            icon: undefined
                                          }
                                        ],
                                        icon: undefined
                                      },
                                      {
                                        "id": "er1j0tblf",
                                        "name": "div",
                                        "type": "div",
                                        "props": {
                                          "className": "flex items-center"
                                        },
                                        "allowsChildren": true,
                                        "children": [
                                          {
                                            "id": "71mnm2lln",
                                            "name": "DatabaseIcon",
                                            "type": "DatabaseIcon",
                                            "props": {
                                              "className": "w-4 h-4 mr-1"
                                            },
                                            "allowsChildren": true,
                                            "children": [],
                                            icon: undefined
                                          },
                                          {
                                            "id": "1727219418965zq4rrsslz",
                                            "name": "Text",
                                            "type": "text",
                                            "allowsChildren": false,
                                            "children": [],
                                            "props": {
                                              "content": "MongoDB"
                                            },
                                            icon: undefined
                                          }
                                        ],
                                        icon: undefined
                                      }
                                    ],
                                    icon: undefined
                                  }
                                ],
                                icon: undefined
                              }
                            ],
                            icon: undefined
                          }
                        ],
                        icon: undefined
                      },
                      {
                        "id": "sundlbota",
                        "name": "Card",
                        "type": "Card",
                        "props": {},
                        "allowsChildren": true,
                        "children": [
                          {
                            "id": "l14bib22f",
                            "name": "CardHeader",
                            "type": "CardHeader",
                            "props": {},
                            "allowsChildren": true,
                            "children": [
                              {
                                "id": "hmprrdpex",
                                "name": "img",
                                "type": "img",
                                "props": {
                                  "src": "/placeholder.svg",
                                  "width": "550",
                                  "height": "310",
                                  "alt": "Project 2",
                                  "className": "mx-auto aspect-video overflow-hidden rounded-xl object-cover object-center sm:w-full"
                                },
                                "allowsChildren": true,
                                "children": [],
                                icon: undefined
                              }
                            ],
                            icon: undefined
                          },
                          {
                            "id": "hkvc7bctt",
                            "name": "CardContent",
                            "type": "CardContent",
                            "props": {},
                            "allowsChildren": true,
                            "children": [
                              {
                                "id": "dwbvenbja",
                                "name": "div",
                                "type": "div",
                                "props": {
                                  "className": "space-y-2"
                                },
                                "allowsChildren": true,
                                "children": [
                                  {
                                    "id": "o3s491j2t",
                                    "name": "h3",
                                    "type": "h3",
                                    "props": {
                                      "className": "text-xl font-bold text-foreground"
                                    },
                                    "allowsChildren": true,
                                    "children": [
                                      {
                                        "id": "17272194189698ojocp0np",
                                        "name": "Text",
                                        "type": "text",
                                        "allowsChildren": false,
                                        "children": [],
                                        "props": {
                                          "content": "Project 2"
                                        },
                                        icon: undefined
                                      }
                                    ],
                                    icon: undefined
                                  },
                                  {
                                    "id": "81fnqgrnn",
                                    "name": "p",
                                    "type": "p",
                                    "props": {
                                      "className": "text-muted-foreground"
                                    },
                                    "allowsChildren": true,
                                    "children": [
                                      {
                                        "id": "1727219418970wnlr4alkw",
                                        "name": "Text",
                                        "type": "text",
                                        "allowsChildren": false,
                                        "children": [],
                                        "props": {
                                          "content": "A mobile-first e-commerce application built with React Native and Firebase."
                                        },
                                        icon: undefined
                                      }
                                    ],
                                    icon: undefined
                                  },
                                  {
                                    "id": "eadc65tl0",
                                    "name": "div",
                                    "type": "div",
                                    "props": {
                                      "className": "flex gap-2 text-sm text-muted-foreground"
                                    },
                                    "allowsChildren": true,
                                    "children": [
                                      {
                                        "id": "vil3kuulr",
                                        "name": "div",
                                        "type": "div",
                                        "props": {
                                          "className": "flex items-center"
                                        },
                                        "allowsChildren": true,
                                        "children": [
                                          {
                                            "id": "qssu46h5e",
                                            "name": "CodepenIcon",
                                            "type": "CodepenIcon",
                                            "props": {
                                              "className": "w-4 h-4 mr-1"
                                            },
                                            "allowsChildren": true,
                                            "children": [],
                                            icon: undefined
                                          },
                                          {
                                            "id": "1727219418970ouqpuswfo",
                                            "name": "Text",
                                            "type": "text",
                                            "allowsChildren": false,
                                            "children": [],
                                            "props": {
                                              "content": "React Native"
                                            },
                                            icon: undefined
                                          }
                                        ],
                                        icon: undefined
                                      },
                                      {
                                        "id": "urmbuzfuf",
                                        "name": "div",
                                        "type": "div",
                                        "props": {
                                          "className": "flex items-center"
                                        },
                                        "allowsChildren": true,
                                        "children": [
                                          {
                                            "id": "hz32e5zxy",
                                            "name": "CloudIcon",
                                            "type": "CloudIcon",
                                            "props": {
                                              "className": "w-4 h-4 mr-1"
                                            },
                                            "allowsChildren": true,
                                            "children": [],
                                            icon: undefined
                                          },
                                          {
                                            "id": "1727219418971019reeo4r",
                                            "name": "Text",
                                            "type": "text",
                                            "allowsChildren": false,
                                            "children": [],
                                            "props": {
                                              "content": "Firebase"
                                            },
                                            icon: undefined
                                          }
                                        ],
                                        icon: undefined
                                      }
                                    ],
                                    icon: undefined
                                  }
                                ],
                                icon: undefined
                              }
                            ],
                            icon: undefined
                          }
                        ],
                        icon: undefined
                      },
                      {
                        "id": "ylbuech06",
                        "name": "Card",
                        "type": "Card",
                        "props": {},
                        "allowsChildren": true,
                        "children": [
                          {
                            "id": "oxtqsln99",
                            "name": "CardHeader",
                            "type": "CardHeader",
                            "props": {},
                            "allowsChildren": true,
                            "children": [
                              {
                                "id": "lkxmsm2h1",
                                "name": "img",
                                "type": "img",
                                "props": {
                                  "src": "/placeholder.svg",
                                  "width": "550",
                                  "height": "310",
                                  "alt": "Project 3",
                                  "className": "mx-auto aspect-video overflow-hidden rounded-xl object-cover object-center sm:w-full"
                                },
                                "allowsChildren": true,
                                "children": [],
                                icon: undefined
                              }
                            ],
                            icon: undefined
                          },
                          {
                            "id": "uncepx9ui",
                            "name": "CardContent",
                            "type": "CardContent",
                            "props": {},
                            "allowsChildren": true,
                            "children": [
                              {
                                "id": "n8dux18lf",
                                "name": "div",
                                "type": "div",
                                "props": {
                                  "className": "space-y-2"
                                },
                                "allowsChildren": true,
                                "children": [
                                  {
                                    "id": "o6qr992n0",
                                    "name": "h3",
                                    "type": "h3",
                                    "props": {
                                      "className": "text-xl font-bold text-foreground"
                                    },
                                    "allowsChildren": true,
                                    "children": [
                                      {
                                        "id": "1727219418975h5htvp2yl",
                                        "name": "Text",
                                        "type": "text",
                                        "allowsChildren": false,
                                        "children": [],
                                        "props": {
                                          "content": "Project 3"
                                        },
                                        icon: undefined
                                      }
                                    ],
                                    icon: undefined
                                  },
                                  {
                                    "id": "pp2u5o08k",
                                    "name": "p",
                                    "type": "p",
                                    "props": {
                                      "className": "text-muted-foreground"
                                    },
                                    "allowsChildren": true,
                                    "children": [
                                      {
                                        "id": "1727219418975l66w83aeh",
                                        "name": "Text",
                                        "type": "text",
                                        "allowsChildren": false,
                                        "children": [],
                                        "props": {
                                          "content": "A real-time chat application built with Socket.IO, Node.js, and React."
                                        },
                                        icon: undefined
                                      }
                                    ],
                                    icon: undefined
                                  },
                                  {
                                    "id": "taloqz5x6",
                                    "name": "div",
                                    "type": "div",
                                    "props": {
                                      "className": "flex gap-2 text-sm text-muted-foreground"
                                    },
                                    "allowsChildren": true,
                                    "children": [
                                      {
                                        "id": "1w9n97pgf",
                                        "name": "div",
                                        "type": "div",
                                        "props": {
                                          "className": "flex items-center"
                                        },
                                        "allowsChildren": true,
                                        "children": [
                                          {
                                            "id": "n3wu1kcbo",
                                            "name": "CodepenIcon",
                                            "type": "CodepenIcon",
                                            "props": {
                                              "className": "w-4 h-4 mr-1"
                                            },
                                            "allowsChildren": true,
                                            "children": [],
                                            icon: undefined
                                          },
                                          {
                                            "id": "17272194189769dq01tgh0",
                                            "name": "Text",
                                            "type": "text",
                                            "allowsChildren": false,
                                            "children": [],
                                            "props": {
                                              "content": "React"
                                            },
                                            icon: undefined
                                          }
                                        ],
                                        icon: undefined
                                      },
                                      {
                                        "id": "mm9jp0ysq",
                                        "name": "div",
                                        "type": "div",
                                        "props": {
                                          "className": "flex items-center"
                                        },
                                        "allowsChildren": true,
                                        "children": [
                                          {
                                            "id": "pithyro1z",
                                            "name": "NetworkIcon",
                                            "type": "NetworkIcon",
                                            "props": {
                                              "className": "w-4 h-4 mr-1"
                                            },
                                            "allowsChildren": true,
                                            "children": [],
                                            icon: undefined
                                          },
                                          {
                                            "id": "1727219418977tvqeiqox7",
                                            "name": "Text",
                                            "type": "text",
                                            "allowsChildren": false,
                                            "children": [],
                                            "props": {
                                              "content": "Node.js"
                                            },
                                            icon: undefined
                                          }
                                        ],
                                        icon: undefined
                                      },
                                      {
                                        "id": "qv9asuqtm",
                                        "name": "div",
                                        "type": "div",
                                        "props": {
                                          "className": "flex items-center"
                                        },
                                        "allowsChildren": true,
                                        "children": [
                                          {
                                            "id": "3bq83durs",
                                            "name": "ServerIcon",
                                            "type": "ServerIcon",
                                            "props": {
                                              "className": "w-4 h-4 mr-1"
                                            },
                                            "allowsChildren": true,
                                            "children": [],
                                            icon: undefined
                                          },
                                          {
                                            "id": "1727219418977qk4qfygsf",
                                            "name": "Text",
                                            "type": "text",
                                            "allowsChildren": false,
                                            "children": [],
                                            "props": {
                                              "content": "Socket.IO"
                                            },
                                            icon: undefined
                                          }
                                        ],
                                        icon: undefined
                                      }
                                    ],
                                    icon: undefined
                                  }
                                ],
                                icon: undefined
                              }
                            ],
                            icon: undefined
                          }
                        ],
                        icon: undefined
                      }
                    ],
                    icon: undefined
                  }
                ],
                icon: undefined
              }
            ],
            icon: undefined
          },
          {
            "id": "nozgvleeu",
            "name": "section",
            "type": "section",
            "props": {
              "className": "w-full py-12 md:py-24 lg:py-32 bg-background"
            },
            "allowsChildren": true,
            "children": [
              {
                "id": "c21nwz3bz",
                "name": "div",
                "type": "div",
                "props": {
                  "className": "container px-4 md:px-6"
                },
                "allowsChildren": true,
                "children": [
                  {
                    "id": "ps1d5827c",
                    "name": "div",
                    "type": "div",
                    "props": {
                      "className": "grid gap-6 lg:grid-cols-[1fr_400px] lg:gap-12 xl:grid-cols-[1fr_600px]"
                    },
                    "allowsChildren": true,
                    "children": [
                      {
                        "id": "rpvx364ck",
                        "name": "div",
                        "type": "div",
                        "props": {
                          "className": "flex flex-col justify-center space-y-4"
                        },
                        "allowsChildren": true,
                        "children": [
                          {
                            "id": "oj2egjbew",
                            "name": "div",
                            "type": "div",
                            "props": {
                              "className": "space-y-2"
                            },
                            "allowsChildren": true,
                            "children": [
                              {
                                "id": "xx8qrv3vj",
                                "name": "h2",
                                "type": "h2",
                                "props": {
                                  "className": "text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl text-foreground"
                                },
                                "allowsChildren": true,
                                "children": [
                                  {
                                    "id": "17272194189893dlux8a3s",
                                    "name": "Text",
                                    "type": "text",
                                    "allowsChildren": false,
                                    "children": [],
                                    "props": {
                                      "content": "About Me"
                                    },
                                    icon: undefined
                                  }
                                ],
                                icon: undefined
                              },
                              {
                                "id": "sxw7wf0df",
                                "name": "p",
                                "type": "p",
                                "props": {
                                  "className": "max-w-[600px] text-muted-foreground md:text-xl"
                                },
                                "allowsChildren": true,
                                "children": [
                                  {
                                    "id": "172721941899000dztu7av",
                                    "name": "Text",
                                    "type": "text",
                                    "allowsChildren": false,
                                    "children": [],
                                    "props": {
                                      "content": "I'm a passionate fullstack developer with over 5 years of experience in building modern web\n                    applications. I have a strong background in React, Node.js, and MongoDB, and I'm always eager to\n                    learn new technologies and techniques."
                                    },
                                    icon: undefined
                                  }
                                ],
                                icon: undefined
                              },
                              {
                                "id": "ezsbir7k1",
                                "name": "p",
                                "type": "p",
                                "props": {
                                  "className": "max-w-[600px] text-muted-foreground md:text-xl"
                                },
                                "allowsChildren": true,
                                "children": [
                                  {
                                    "id": "1727219418991vszqknfjb",
                                    "name": "Text",
                                    "type": "text",
                                    "allowsChildren": false,
                                    "children": [],
                                    "props": {
                                      "content": "In my free time, I enjoy contributing to open-source projects, attending local meetups, and staying\n                    up-to-date with the latest industry trends. I'm a firm believer in writing clean, maintainable code\n                    and following best practices."
                                    },
                                    icon: undefined
                                  }
                                ],
                                icon: undefined
                              }
                            ],
                            icon: undefined
                          }
                        ],
                        icon: undefined
                      },
                      {
                        "id": "i2fwaj8ek",
                        "name": "div",
                        "type": "div",
                        "props": {
                          "className": "flex flex-col justify-center space-y-4"
                        },
                        "allowsChildren": true,
                        "children": [
                          {
                            "id": "fupvax6sb",
                            "name": "div",
                            "type": "div",
                            "props": {
                              "className": "space-y-2"
                            },
                            "allowsChildren": true,
                            "children": [
                              {
                                "id": "udh21n8ny",
                                "name": "h2",
                                "type": "h2",
                                "props": {
                                  "className": "text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl text-foreground"
                                },
                                "allowsChildren": true,
                                "children": [
                                  {
                                    "id": "1727219419011cyx2n5c7n",
                                    "name": "Text",
                                    "type": "text",
                                    "allowsChildren": false,
                                    "children": [],
                                    "props": {
                                      "content": "Skills"
                                    },
                                    icon: undefined
                                  }
                                ],
                                icon: undefined
                              },
                              {
                                "id": "i1y3yh50w",
                                "name": "div",
                                "type": "div",
                                "props": {
                                  "className": "grid grid-cols-2 gap-4"
                                },
                                "allowsChildren": true,
                                "children": [
                                  {
                                    "id": "zgxqtzy51",
                                    "name": "div",
                                    "type": "div",
                                    "props": {
                                      "className": "flex items-center gap-2"
                                    },
                                    "allowsChildren": true,
                                    "children": [
                                      {
                                        "id": "4qkh54vkn",
                                        "name": "CodepenIcon",
                                        "type": "CodepenIcon",
                                        "props": {
                                          "className": "w-6 h-6 text-primary"
                                        },
                                        "allowsChildren": true,
                                        "children": [],
                                        icon: undefined
                                      },
                                      {
                                        "id": "513cnpg5s",
                                        "name": "span",
                                        "type": "span",
                                        "props": {
                                          "className": "text-muted-foreground"
                                        },
                                        "allowsChildren": true,
                                        "children": [
                                          {
                                            "id": "17272194190143y9f4wjl8",
                                            "name": "Text",
                                            "type": "text",
                                            "allowsChildren": false,
                                            "children": [],
                                            "props": {
                                              "content": "React"
                                            },
                                            icon: undefined
                                          }
                                        ],
                                        icon: undefined
                                      }
                                    ],
                                    icon: undefined
                                  },
                                  {
                                    "id": "2w52gv792",
                                    "name": "div",
                                    "type": "div",
                                    "props": {
                                      "className": "flex items-center gap-2"
                                    },
                                    "allowsChildren": true,
                                    "children": [
                                      {
                                        "id": "3670y5gny",
                                        "name": "NetworkIcon",
                                        "type": "NetworkIcon",
                                        "props": {
                                          "className": "w-6 h-6 text-primary"
                                        },
                                        "allowsChildren": true,
                                        "children": [],
                                        icon: undefined
                                      },
                                      {
                                        "id": "qeywrdgdv",
                                        "name": "span",
                                        "type": "span",
                                        "props": {
                                          "className": "text-muted-foreground"
                                        },
                                        "allowsChildren": true,
                                        "children": [
                                          {
                                            "id": "1727219419016or1toeo1b",
                                            "name": "Text",
                                            "type": "text",
                                            "allowsChildren": false,
                                            "children": [],
                                            "props": {
                                              "content": "Node.js"
                                            },
                                            icon: undefined
                                          }
                                        ],
                                        icon: undefined
                                      }
                                    ],
                                    icon: undefined
                                  },
                                  {
                                    "id": "2hne1cn9y",
                                    "name": "div",
                                    "type": "div",
                                    "props": {
                                      "className": "flex items-center gap-2"
                                    },
                                    "allowsChildren": true,
                                    "children": [
                                      {
                                        "id": "xd20762zt",
                                        "name": "DatabaseIcon",
                                        "type": "DatabaseIcon",
                                        "props": {
                                          "className": "w-6 h-6 text-primary"
                                        },
                                        "allowsChildren": true,
                                        "children": [],
                                        icon: undefined
                                      },
                                      {
                                        "id": "8yp4bqug3",
                                        "name": "span",
                                        "type": "span",
                                        "props": {
                                          "className": "text-muted-foreground"
                                        },
                                        "allowsChildren": true,
                                        "children": [
                                          {
                                            "id": "172721941901954gyr3xwm",
                                            "name": "Text",
                                            "type": "text",
                                            "allowsChildren": false,
                                            "children": [],
                                            "props": {
                                              "content": "MongoDB"
                                            },
                                            icon: undefined
                                          }
                                        ],
                                        icon: undefined
                                      }
                                    ],
                                    icon: undefined
                                  },
                                  {
                                    "id": "uhox1pvkl",
                                    "name": "div",
                                    "type": "div",
                                    "props": {
                                      "className": "flex items-center gap-2"
                                    },
                                    "allowsChildren": true,
                                    "children": [
                                      {
                                        "id": "jdmt22zyy",
                                        "name": "CodepenIcon",
                                        "type": "CodepenIcon",
                                        "props": {
                                          "className": "w-6 h-6 text-primary"
                                        },
                                        "allowsChildren": true,
                                        "children": [],
                                        icon: undefined
                                      },
                                      {
                                        "id": "i2nqh3iw1",
                                        "name": "span",
                                        "type": "span",
                                        "props": {
                                          "className": "text-muted-foreground"
                                        },
                                        "allowsChildren": true,
                                        "children": [
                                          {
                                            "id": "1727219419021gh2aqhx1c",
                                            "name": "Text",
                                            "type": "text",
                                            "allowsChildren": false,
                                            "children": [],
                                            "props": {
                                              "content": "Next.js"
                                            },
                                            icon: undefined
                                          }
                                        ],
                                        icon: undefined
                                      }
                                    ],
                                    icon: undefined
                                  },
                                  {
                                    "id": "zg8g89azs",
                                    "name": "div",
                                    "type": "div",
                                    "props": {
                                      "className": "flex items-center gap-2"
                                    },
                                    "allowsChildren": true,
                                    "children": [
                                      {
                                        "id": "nlx6h8fqb",
                                        "name": "XIcon",
                                        "type": "XIcon",
                                        "props": {
                                          "className": "w-6 h-6 text-primary"
                                        },
                                        "allowsChildren": true,
                                        "children": [],
                                        icon: undefined
                                      },
                                      {
                                        "id": "x1mu6k5hj",
                                        "name": "span",
                                        "type": "span",
                                        "props": {
                                          "className": "text-muted-foreground"
                                        },
                                        "allowsChildren": true,
                                        "children": [
                                          {
                                            "id": "17272194190227bctwq3fj",
                                            "name": "Text",
                                            "type": "text",
                                            "allowsChildren": false,
                                            "children": [],
                                            "props": {
                                              "content": "Express"
                                            },
                                            icon: undefined
                                          }
                                        ],
                                        icon: undefined
                                      }
                                    ],
                                    icon: undefined
                                  },
                                  {
                                    "id": "rni3tbxpd",
                                    "name": "div",
                                    "type": "div",
                                    "props": {
                                      "className": "flex items-center gap-2"
                                    },
                                    "allowsChildren": true,
                                    "children": [
                                      {
                                        "id": "uzo8iq9qd",
                                        "name": "CloudIcon",
                                        "type": "CloudIcon",
                                        "props": {
                                          "className": "w-6 h-6 text-primary"
                                        },
                                        "allowsChildren": true,
                                        "children": [],
                                        icon: undefined
                                      },
                                      {
                                        "id": "6ek6xru71",
                                        "name": "span",
                                        "type": "span",
                                        "props": {
                                          "className": "text-muted-foreground"
                                        },
                                        "allowsChildren": true,
                                        "children": [
                                          {
                                            "id": "1727219419023hi3lfdruj",
                                            "name": "Text",
                                            "type": "text",
                                            "allowsChildren": false,
                                            "children": [],
                                            "props": {
                                              "content": "Firebase"
                                            },
                                            icon: undefined
                                          }
                                        ],
                                        icon: undefined
                                      }
                                    ],
                                    icon: undefined
                                  }
                                ],
                                icon: undefined
                              }
                            ],
                            icon: undefined
                          }
                        ],
                        icon: undefined
                      }
                    ],
                    icon: undefined
                  }
                ],
                icon: undefined
              }
            ],
            icon: undefined
          },
          {
            "id": "a0ckvoele",
            "name": "section",
            "type": "section",
            "props": {
              "className": "w-full py-12 md:py-24 lg:py-32 bg-muted"
            },
            "allowsChildren": true,
            "children": [
              {
                "id": "30igaqusg",
                "name": "div",
                "type": "div",
                "props": {
                  "className": "container px-4 md:px-6"
                },
                "allowsChildren": true,
                "children": [
                  {
                    "id": "z3gmp2jcf",
                    "name": "div",
                    "type": "div",
                    "props": {
                      "className": "flex flex-col items-center justify-center space-y-4 text-center"
                    },
                    "allowsChildren": true,
                    "children": [
                      {
                        "id": "1361dica9",
                        "name": "div",
                        "type": "div",
                        "props": {
                          "className": "space-y-2"
                        },
                        "allowsChildren": true,
                        "children": [
                          {
                            "id": "5dzz3nmep",
                            "name": "h2",
                            "type": "h2",
                            "props": {
                              "className": "text-3xl font-bold tracking-tighter sm:text-5xl text-foreground"
                            },
                            "allowsChildren": true,
                            "children": [
                              {
                                "id": "1727219419029ljfdk90rc",
                                "name": "Text",
                                "type": "text",
                                "allowsChildren": false,
                                "children": [],
                                "props": {
                                  "content": "Get in Touch"
                                },
                                icon: undefined
                              }
                            ],
                            icon: undefined
                          },
                          {
                            "id": "9ce3gwj36",
                            "name": "p",
                            "type": "p",
                            "props": {
                              "className": "max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed"
                            },
                            "allowsChildren": true,
                            "children": [
                              {
                                "id": "172721941902922zc63387",
                                "name": "Text",
                                "type": "text",
                                "allowsChildren": false,
                                "children": [],
                                "props": {
                                  "content": "Have a project in mind or just want to say hello? Fill out the form below and I'll get back to you as\n                  soon as possible."
                                },
                                icon: undefined
                              }
                            ],
                            icon: undefined
                          }
                        ],
                        icon: undefined
                      },
                      {
                        "id": "utjr93ds3",
                        "name": "div",
                        "type": "div",
                        "props": {
                          "className": "mx-auto w-full max-w-sm space-y-2"
                        },
                        "allowsChildren": true,
                        "children": [
                          {
                            "id": "zf2hf9htu",
                            "name": "form",
                            "type": "form",
                            "props": {
                              "className": "flex flex-col gap-4"
                            },
                            "allowsChildren": true,
                            "children": [
                              {
                                "id": "1yeni063q",
                                "name": "Input",
                                "type": "Input",
                                "props": {
                                  "type": "text",
                                  "placeholder": "Name",
                                  "className": "max-w-lg flex-1"
                                },
                                "allowsChildren": true,
                                "children": [],
                                icon: undefined
                              },
                              {
                                "id": "dfuem4i25",
                                "name": "Input",
                                "type": "Input",
                                "props": {
                                  "type": "email",
                                  "placeholder": "Email",
                                  "className": "max-w-lg flex-1"
                                },
                                "allowsChildren": true,
                                "children": [],
                                icon: undefined
                              },
                              {
                                "id": "efhifnsfq",
                                "name": "Textarea",
                                "type": "Textarea",
                                "props": {
                                  "placeholder": "Message",
                                  "className": "max-w-lg flex-1"
                                },
                                "allowsChildren": true,
                                "children": [],
                                icon: undefined
                              },
                              {
                                "id": "svrt4hlki",
                                "name": "Button",
                                "type": "Button",
                                "props": {
                                  "type": "submit",
                                  "className": "self-start"
                                },
                                "allowsChildren": true,
                                "children": [
                                  {
                                    "id": "1727219419031vypmubse2",
                                    "name": "Text",
                                    "type": "text",
                                    "allowsChildren": false,
                                    "children": [],
                                    "props": {
                                      "content": "Submit"
                                    },
                                    icon: undefined
                                  }
                                ],
                                icon: undefined
                              }
                            ],
                            icon: undefined
                          }
                        ],
                        icon: undefined
                      }
                    ],
                    icon: undefined
                  }
                ],
                icon: undefined
              }
            ],
            icon: undefined
          }
        ],
        icon: undefined
      },
      {
        "id": "96op661w4",
        "name": "footer",
        "type": "footer",
        "props": {
          "className": "flex flex-col gap-2 sm:flex-row py-6 w-full shrink-0 items-center px-4 md:px-6 border-t"
        },
        "allowsChildren": true,
        "children": [
          {
            "id": "pdf9yffvu",
            "name": "p",
            "type": "p",
            "props": {
              "className": "text-xs text-muted-foreground"
            },
            "allowsChildren": true,
            "children": [
              {
                "id": "17272194190340snxwbu6p",
                "name": "Text",
                "type": "text",
                "allowsChildren": false,
                "children": [],
                "props": {
                  "content": "© 2024 John Doe. All rights reserved."
                },
                icon: undefined
              }
            ],
            icon: undefined
          },
          {
            "id": "f6zecvs8m",
            "name": "nav",
            "type": "nav",
            "props": {
              "className": "sm:ml-auto flex gap-4 sm:gap-6"
            },
            "allowsChildren": true,
            "children": [
              {
                "id": "1wl06pmzq",
                "name": "Link",
                "type": "Link",
                "props": {
                  "href": "#",
                  "className": "text-xs hover:underline underline-offset-4 text-muted-foreground",
                  "prefetch": null
                },
                "allowsChildren": true,
                "children": [
                  {
                    "id": "1727219419036ocy1nwmpq",
                    "name": "Text",
                    "type": "text",
                    "allowsChildren": false,
                    "children": [],
                    "props": {
                      "content": "Terms of Service"
                    },
                    icon: undefined
                  }
                ],
                icon: undefined
              },
              {
                "id": "xtz5x398b",
                "name": "Link",
                "type": "Link",
                "props": {
                  "href": "#",
                  "className": "text-xs hover:underline underline-offset-4 text-muted-foreground",
                  "prefetch": null
                },
                "allowsChildren": true,
                "children": [
                  {
                    "id": "1727219419036cbgy0or1k",
                    "name": "Text",
                    "type": "text",
                    "allowsChildren": false,
                    "children": [],
                    "props": {
                      "content": "Privacy Policy"
                    },
                    icon: undefined
                  }
                ],
                icon: undefined
              }
            ],
            icon: undefined
          }
        ],
        icon: undefined
      }
    ],
    icon: undefined
  }
]

const miniAppSection: TreeItem[] = [
  {
    "id": "lo5ymn9az",
    "name": "MiniApp Section",
    "type": "div",
    "props": {
      "className": "flex flex-col h-screen bg-background"
    },
    "allowsChildren": true,
    "children": [
      {
        "id": "osr8yyb2p",
        "name": "header",
        "type": "header",
        "props": {
          "className": "bg-primary text-primary-foreground py-4 px-6 flex items-center justify-between"
        },
        "allowsChildren": true,
        "children": [
          {
            "id": "lxb2o5hwg",
            "name": "div",
            "type": "div",
            "props": {
              "className": "flex items-center gap-4"
            },
            "allowsChildren": true,
            "children": [
              {
                "id": "3ndhy4znk",
                "name": "BookIcon",
                "type": "BookIcon",
                "props": {
                  "className": "w-8 h-8"
                },
                "allowsChildren": true,
                "children": [],
                icon: undefined
              },
              {
                "id": "syr2ri1iy",
                "name": "h1",
                "type": "h1",
                "props": {
                  "className": "text-2xl font-bold"
                },
                "allowsChildren": true,
                "children": [
                  {
                    "id": "1727219574797h9q3jbfuk",
                    "name": "Text",
                    "type": "text",
                    "allowsChildren": false,
                    "children": [],
                    "props": {
                      "content": "Bible App"
                    },
                    icon: undefined
                  }
                ],
                icon: undefined
              }
            ],
            icon: undefined
          },
          {
            "id": "87s3ix5b9",
            "name": "div",
            "type": "div",
            "props": {
              "className": "flex items-center gap-4"
            },
            "allowsChildren": true,
            "children": [
              {
                "id": "t1jjm5grc",
                "name": "DropdownMenu",
                "type": "DropdownMenu",
                "props": {},
                "allowsChildren": true,
                "children": [
                  {
                    "id": "od50blubd",
                    "name": "DropdownMenuTrigger",
                    "type": "DropdownMenuTrigger",
                    "props": {
                      "asChild": true
                    },
                    "allowsChildren": true,
                    "children": [
                      {
                        "id": "v5x6k3xaw",
                        "name": "Button",
                        "type": "Button",
                        "props": {
                          "variant": "ghost",
                          "size": "icon"
                        },
                        "allowsChildren": true,
                        "children": [
                          {
                            "id": "izcgvutde",
                            "name": "ImportIcon",
                            "type": "ImportIcon",
                            "props": {
                              "className": "w-6 h-6"
                            },
                            "allowsChildren": true,
                            "children": [],
                            icon: undefined
                          },
                          {
                            "id": "sm2t0ob69",
                            "name": "span",
                            "type": "span",
                            "props": {
                              "className": "sr-only"
                            },
                            "allowsChildren": true,
                            "children": [
                              {
                                "id": "1727219574803d1igzk38e",
                                "name": "Text",
                                "type": "text",
                                "allowsChildren": false,
                                "children": [],
                                "props": {
                                  "content": "Language"
                                },
                                icon: undefined
                              }
                            ],
                            icon: undefined
                          }
                        ],
                        icon: undefined
                      }
                    ],
                    icon: undefined
                  },
                  {
                    "id": "9sb3tw4lp",
                    "name": "DropdownMenuContent",
                    "type": "DropdownMenuContent",
                    "props": {
                      "align": "end"
                    },
                    "allowsChildren": true,
                    "children": [
                      {
                        "id": "a0l5hxadb",
                        "name": "DropdownMenuLabel",
                        "type": "DropdownMenuLabel",
                        "props": {},
                        "allowsChildren": true,
                        "children": [
                          {
                            "id": "1727219574804vdvydked3",
                            "name": "Text",
                            "type": "text",
                            "allowsChildren": false,
                            "children": [],
                            "props": {
                              "content": "Select Language"
                            },
                            icon: undefined
                          }
                        ],
                        icon: undefined
                      },
                      {
                        "id": "h3a5yui7f",
                        "name": "DropdownMenuSeparator",
                        "type": "DropdownMenuSeparator",
                        "props": {},
                        "allowsChildren": true,
                        "children": [],
                        icon: undefined
                      },
                      {
                        "id": "sl4zzq1jy",
                        "name": "DropdownMenuItem",
                        "type": "DropdownMenuItem",
                        "props": {},
                        "allowsChildren": true,
                        "children": [
                          {
                            "id": "17272195748058pldg3bcv",
                            "name": "Text",
                            "type": "text",
                            "allowsChildren": false,
                            "children": [],
                            "props": {
                              "content": "English"
                            },
                            icon: undefined
                          }
                        ],
                        icon: undefined
                      },
                      {
                        "id": "f9ijl0t7y",
                        "name": "DropdownMenuItem",
                        "type": "DropdownMenuItem",
                        "props": {},
                        "allowsChildren": true,
                        "children": [
                          {
                            "id": "1727219574805ut0x9ncd4",
                            "name": "Text",
                            "type": "text",
                            "allowsChildren": false,
                            "children": [],
                            "props": {
                              "content": "Spanish"
                            },
                            icon: undefined
                          }
                        ],
                        icon: undefined
                      },
                      {
                        "id": "oe191a56a",
                        "name": "DropdownMenuItem",
                        "type": "DropdownMenuItem",
                        "props": {},
                        "allowsChildren": true,
                        "children": [
                          {
                            "id": "1727219574805ft1aakjnd",
                            "name": "Text",
                            "type": "text",
                            "allowsChildren": false,
                            "children": [],
                            "props": {
                              "content": "French"
                            },
                            icon: undefined
                          }
                        ],
                        icon: undefined
                      },
                      {
                        "id": "c2nijl3lj",
                        "name": "DropdownMenuItem",
                        "type": "DropdownMenuItem",
                        "props": {},
                        "allowsChildren": true,
                        "children": [
                          {
                            "id": "1727219574806tujbwkfgl",
                            "name": "Text",
                            "type": "text",
                            "allowsChildren": false,
                            "children": [],
                            "props": {
                              "content": "German"
                            },
                            icon: undefined
                          }
                        ],
                        icon: undefined
                      },
                      {
                        "id": "jbn99msh8",
                        "name": "DropdownMenuItem",
                        "type": "DropdownMenuItem",
                        "props": {},
                        "allowsChildren": true,
                        "children": [
                          {
                            "id": "1727219574806vnnk6w32m",
                            "name": "Text",
                            "type": "text",
                            "allowsChildren": false,
                            "children": [],
                            "props": {
                              "content": "Chinese"
                            },
                            icon: undefined
                          }
                        ],
                        icon: undefined
                      }
                    ],
                    icon: undefined
                  }
                ],
                icon: undefined
              },
              {
                "id": "ldgijabgd",
                "name": "DropdownMenu",
                "type": "DropdownMenu",
                "props": {},
                "allowsChildren": true,
                "children": [
                  {
                    "id": "dpla4pz99",
                    "name": "DropdownMenuTrigger",
                    "type": "DropdownMenuTrigger",
                    "props": {
                      "asChild": true
                    },
                    "allowsChildren": true,
                    "children": [
                      {
                        "id": "hqbov3gvf",
                        "name": "Button",
                        "type": "Button",
                        "props": {
                          "variant": "ghost",
                          "size": "icon"
                        },
                        "allowsChildren": true,
                        "children": [
                          {
                            "id": "rkqntag9z",
                            "name": "SettingsIcon",
                            "type": "SettingsIcon",
                            "props": {
                              "className": "w-6 h-6"
                            },
                            "allowsChildren": true,
                            "children": [],
                            icon: undefined
                          },
                          {
                            "id": "ghfyzipzs",
                            "name": "span",
                            "type": "span",
                            "props": {
                              "className": "sr-only"
                            },
                            "allowsChildren": true,
                            "children": [
                              {
                                "id": "1727219574810eibktuubr",
                                "name": "Text",
                                "type": "text",
                                "allowsChildren": false,
                                "children": [],
                                "props": {
                                  "content": "Settings"
                                },
                                icon: undefined
                              }
                            ],
                            icon: undefined
                          }
                        ],
                        icon: undefined
                      }
                    ],
                    icon: undefined
                  },
                  {
                    "id": "w502xfjok",
                    "name": "DropdownMenuContent",
                    "type": "DropdownMenuContent",
                    "props": {
                      "align": "end"
                    },
                    "allowsChildren": true,
                    "children": [
                      {
                        "id": "5yrq2rd6x",
                        "name": "DropdownMenuLabel",
                        "type": "DropdownMenuLabel",
                        "props": {},
                        "allowsChildren": true,
                        "children": [
                          {
                            "id": "1727219574811un6r4ndn4",
                            "name": "Text",
                            "type": "text",
                            "allowsChildren": false,
                            "children": [],
                            "props": {
                              "content": "Settings"
                            },
                            icon: undefined
                          }
                        ],
                        icon: undefined
                      },
                      {
                        "id": "0r9mqz7ru",
                        "name": "DropdownMenuSeparator",
                        "type": "DropdownMenuSeparator",
                        "props": {},
                        "allowsChildren": true,
                        "children": [],
                        icon: undefined
                      },
                      {
                        "id": "er3ct2ru0",
                        "name": "DropdownMenuItem",
                        "type": "DropdownMenuItem",
                        "props": {},
                        "allowsChildren": true,
                        "children": [
                          {
                            "id": "17272195748127qvxrjkx6",
                            "name": "Text",
                            "type": "text",
                            "allowsChildren": false,
                            "children": [],
                            "props": {
                              "content": "Appearance"
                            },
                            icon: undefined
                          }
                        ],
                        icon: undefined
                      },
                      {
                        "id": "rfrqpj5bl",
                        "name": "DropdownMenuItem",
                        "type": "DropdownMenuItem",
                        "props": {},
                        "allowsChildren": true,
                        "children": [
                          {
                            "id": "1727219574812plrynq8on",
                            "name": "Text",
                            "type": "text",
                            "allowsChildren": false,
                            "children": [],
                            "props": {
                              "content": "Notifications"
                            },
                            icon: undefined
                          }
                        ],
                        icon: undefined
                      },
                      {
                        "id": "qyplmblb4",
                        "name": "DropdownMenuItem",
                        "type": "DropdownMenuItem",
                        "props": {},
                        "allowsChildren": true,
                        "children": [
                          {
                            "id": "17272195748135x3hbtowj",
                            "name": "Text",
                            "type": "text",
                            "allowsChildren": false,
                            "children": [],
                            "props": {
                              "content": "Privacy"
                            },
                            icon: undefined
                          }
                        ],
                        icon: undefined
                      }
                    ],
                    icon: undefined
                  }
                ],
                icon: undefined
              }
            ],
            icon: undefined
          }
        ],
        icon: undefined
      },
      {
        "id": "laxfziq35",
        "name": "main",
        "type": "main",
        "props": {
          "className": "flex-1 grid grid-cols-[240px_1fr] gap-6 p-6"
        },
        "allowsChildren": true,
        "children": [
          {
            "id": "uod6ghew3",
            "name": "div",
            "type": "div",
            "props": {
              "className": "bg-card text-card-foreground rounded-lg shadow-md p-6 flex flex-col gap-6"
            },
            "allowsChildren": true,
            "children": [
              {
                "id": "l18pdiob9",
                "name": "div",
                "type": "div",
                "props": {
                  "className": "flex items-center gap-4"
                },
                "allowsChildren": true,
                "children": [
                  {
                    "id": "l9dabjjjo",
                    "name": "BookIcon",
                    "type": "BookIcon",
                    "props": {
                      "className": "w-6 h-6"
                    },
                    "allowsChildren": true,
                    "children": [],
                    icon: undefined
                  },
                  {
                    "id": "yshvddbyq",
                    "name": "h2",
                    "type": "h2",
                    "props": {
                      "className": "text-xl font-bold"
                    },
                    "allowsChildren": true,
                    "children": [
                      {
                        "id": "1727219574830h7mzwvl0j",
                        "name": "Text",
                        "type": "text",
                        "allowsChildren": false,
                        "children": [],
                        "props": {
                          "content": "Explore"
                        },
                        icon: undefined
                      }
                    ],
                    icon: undefined
                  }
                ],
                icon: undefined
              },
              {
                "id": "omhl3fcqa",
                "name": "nav",
                "type": "nav",
                "props": {
                  "className": "flex flex-col gap-2"
                },
                "allowsChildren": true,
                "children": [
                  {
                    "id": "3d1jbdg64",
                    "name": "Link",
                    "type": "Link",
                    "props": {
                      "href": "#",
                      "className": "flex items-center gap-2 hover:bg-card-hover p-2 rounded-md",
                      "prefetch": null
                    },
                    "allowsChildren": true,
                    "children": [
                      {
                        "id": "w2lwatk2t",
                        "name": "HomeIcon",
                        "type": "HomeIcon",
                        "props": {
                          "className": "w-5 h-5"
                        },
                        "allowsChildren": true,
                        "children": [],
                        icon: undefined
                      },
                      {
                        "id": "50d0ux8qk",
                        "name": "span",
                        "type": "span",
                        "props": {},
                        "allowsChildren": true,
                        "children": [
                          {
                            "id": "1727219574833nc045fvsu",
                            "name": "Text",
                            "type": "text",
                            "allowsChildren": false,
                            "children": [],
                            "props": {
                              "content": "Home"
                            },
                            icon: undefined
                          }
                        ],
                        icon: undefined
                      }
                    ],
                    icon: undefined
                  },
                  {
                    "id": "2iq1fq6dg",
                    "name": "Link",
                    "type": "Link",
                    "props": {
                      "href": "#",
                      "className": "flex items-center gap-2 hover:bg-card-hover p-2 rounded-md",
                      "prefetch": null
                    },
                    "allowsChildren": true,
                    "children": [
                      {
                        "id": "sj2gq9j9c",
                        "name": "BookOpenIcon",
                        "type": "BookOpenIcon",
                        "props": {
                          "className": "w-5 h-5"
                        },
                        "allowsChildren": true,
                        "children": [],
                        icon: undefined
                      },
                      {
                        "id": "9qm0jwwt0",
                        "name": "span",
                        "type": "span",
                        "props": {},
                        "allowsChildren": true,
                        "children": [
                          {
                            "id": "1727219574835qjjlg740t",
                            "name": "Text",
                            "type": "text",
                            "allowsChildren": false,
                            "children": [],
                            "props": {
                              "content": "Bible"
                            },
                            icon: undefined
                          }
                        ],
                        icon: undefined
                      }
                    ],
                    icon: undefined
                  },
                  {
                    "id": "wjcrli1v0",
                    "name": "Link",
                    "type": "Link",
                    "props": {
                      "href": "#",
                      "className": "flex items-center gap-2 hover:bg-card-hover p-2 rounded-md",
                      "prefetch": null
                    },
                    "allowsChildren": true,
                    "children": [
                      {
                        "id": "i0pelz6gm",
                        "name": "SearchIcon",
                        "type": "SearchIcon",
                        "props": {
                          "className": "w-5 h-5"
                        },
                        "allowsChildren": true,
                        "children": [],
                        icon: undefined
                      },
                      {
                        "id": "rby8hw0bn",
                        "name": "span",
                        "type": "span",
                        "props": {},
                        "allowsChildren": true,
                        "children": [
                          {
                            "id": "1727219574836ajq6640qw",
                            "name": "Text",
                            "type": "text",
                            "allowsChildren": false,
                            "children": [],
                            "props": {
                              "content": "Search"
                            },
                            icon: undefined
                          }
                        ],
                        icon: undefined
                      }
                    ],
                    icon: undefined
                  },
                  {
                    "id": "6vlzfwh40",
                    "name": "Link",
                    "type": "Link",
                    "props": {
                      "href": "#",
                      "className": "flex items-center gap-2 hover:bg-card-hover p-2 rounded-md",
                      "prefetch": null
                    },
                    "allowsChildren": true,
                    "children": [
                      {
                        "id": "8zldry644",
                        "name": "BookmarkIcon",
                        "type": "BookmarkIcon",
                        "props": {
                          "className": "w-5 h-5"
                        },
                        "allowsChildren": true,
                        "children": [],
                        icon: undefined
                      },
                      {
                        "id": "13rss6gb6",
                        "name": "span",
                        "type": "span",
                        "props": {},
                        "allowsChildren": true,
                        "children": [
                          {
                            "id": "1727219574838cw7lfnsob",
                            "name": "Text",
                            "type": "text",
                            "allowsChildren": false,
                            "children": [],
                            "props": {
                              "content": "Bookmarks"
                            },
                            icon: undefined
                          }
                        ],
                        icon: undefined
                      }
                    ],
                    icon: undefined
                  },
                  {
                    "id": "jnh40ezm7",
                    "name": "Link",
                    "type": "Link",
                    "props": {
                      "href": "#",
                      "className": "flex items-center gap-2 hover:bg-card-hover p-2 rounded-md",
                      "prefetch": null
                    },
                    "allowsChildren": true,
                    "children": [
                      {
                        "id": "ft5dnre5d",
                        "name": "CalendarIcon",
                        "type": "CalendarIcon",
                        "props": {
                          "className": "w-5 h-5"
                        },
                        "allowsChildren": true,
                        "children": [],
                        icon: undefined
                      },
                      {
                        "id": "pndzs88ly",
                        "name": "span",
                        "type": "span",
                        "props": {},
                        "allowsChildren": true,
                        "children": [
                          {
                            "id": "1727219574839qyszxpute",
                            "name": "Text",
                            "type": "text",
                            "allowsChildren": false,
                            "children": [],
                            "props": {
                              "content": "Daily Verse"
                            },
                            icon: undefined
                          }
                        ],
                        icon: undefined
                      }
                    ],
                    icon: undefined
                  },
                  {
                    "id": "p78rfvtrg",
                    "name": "Link",
                    "type": "Link",
                    "props": {
                      "href": "#",
                      "className": "flex items-center gap-2 hover:bg-card-hover p-2 rounded-md",
                      "prefetch": null
                    },
                    "allowsChildren": true,
                    "children": [
                      {
                        "id": "jahvxn36q",
                        "name": "LinkIcon",
                        "type": "LinkIcon",
                        "props": {
                          "className": "w-5 h-5"
                        },
                        "allowsChildren": true,
                        "children": [],
                        icon: undefined
                      },
                      {
                        "id": "zbf0vtpu4",
                        "name": "span",
                        "type": "span",
                        "props": {},
                        "allowsChildren": true,
                        "children": [
                          {
                            "id": "1727219574840lvhgtg7qx",
                            "name": "Text",
                            "type": "text",
                            "allowsChildren": false,
                            "children": [],
                            "props": {
                              "content": "Recommendations"
                            },
                            icon: undefined
                          }
                        ],
                        icon: undefined
                      }
                    ],
                    icon: undefined
                  }
                ],
                icon: undefined
              },
              {
                "id": "684ix42ow",
                "name": "div",
                "type": "div",
                "props": {
                  "className": "flex items-center gap-4"
                },
                "allowsChildren": true,
                "children": [
                  {
                    "id": "hmjf9mlrt",
                    "name": "DownloadIcon",
                    "type": "DownloadIcon",
                    "props": {
                      "className": "w-6 h-6"
                    },
                    "allowsChildren": true,
                    "children": [],
                    icon: undefined
                  },
                  {
                    "id": "jwg5grnkc",
                    "name": "h2",
                    "type": "h2",
                    "props": {
                      "className": "text-xl font-bold"
                    },
                    "allowsChildren": true,
                    "children": [
                      {
                        "id": "172721957484297z6hi4e0",
                        "name": "Text",
                        "type": "text",
                        "allowsChildren": false,
                        "children": [],
                        "props": {
                          "content": "Offline"
                        },
                        icon: undefined
                      }
                    ],
                    icon: undefined
                  }
                ],
                icon: undefined
              },
              {
                "id": "qg823l0ry",
                "name": "nav",
                "type": "nav",
                "props": {
                  "className": "flex flex-col gap-2"
                },
                "allowsChildren": true,
                "children": [
                  {
                    "id": "jc8n8ld93",
                    "name": "Link",
                    "type": "Link",
                    "props": {
                      "href": "#",
                      "className": "flex items-center gap-2 hover:bg-card-hover p-2 rounded-md",
                      "prefetch": null
                    },
                    "allowsChildren": true,
                    "children": [
                      {
                        "id": "oo4s5idmh",
                        "name": "DownloadIcon",
                        "type": "DownloadIcon",
                        "props": {
                          "className": "w-5 h-5"
                        },
                        "allowsChildren": true,
                        "children": [],
                        icon: undefined
                      },
                      {
                        "id": "mdijxfj7x",
                        "name": "span",
                        "type": "span",
                        "props": {},
                        "allowsChildren": true,
                        "children": [
                          {
                            "id": "17272195748433k2o7epfc",
                            "name": "Text",
                            "type": "text",
                            "allowsChildren": false,
                            "children": [],
                            "props": {
                              "content": "Download Versions"
                            },
                            icon: undefined
                          }
                        ],
                        icon: undefined
                      }
                    ],
                    icon: undefined
                  },
                  {
                    "id": "x2q64m74t",
                    "name": "Link",
                    "type": "Link",
                    "props": {
                      "href": "#",
                      "className": "flex items-center gap-2 hover:bg-card-hover p-2 rounded-md",
                      "prefetch": null
                    },
                    "allowsChildren": true,
                    "children": [
                      {
                        "id": "ujgxz7xvr",
                        "name": "FolderSyncIcon",
                        "type": "FolderSyncIcon",
                        "props": {
                          "className": "w-5 h-5"
                        },
                        "allowsChildren": true,
                        "children": [],
                        icon: undefined
                      },
                      {
                        "id": "c8x8jj4qs",
                        "name": "span",
                        "type": "span",
                        "props": {},
                        "allowsChildren": true,
                        "children": [
                          {
                            "id": "1727219574844xnjz9jeby",
                            "name": "Text",
                            "type": "text",
                            "allowsChildren": false,
                            "children": [],
                            "props": {
                              "content": "Sync Progress"
                            },
                            icon: undefined
                          }
                        ],
                        icon: undefined
                      }
                    ],
                    icon: undefined
                  }
                ],
                icon: undefined
              }
            ],
            icon: undefined
          },
          {
            "id": "9wxna5qa6",
            "name": "div",
            "type": "div",
            "props": {
              "className": "bg-card text-card-foreground rounded-lg shadow-md p-6 flex flex-col gap-6"
            },
            "allowsChildren": true,
            "children": [
              {
                "id": "6z9n4ipx3",
                "name": "div",
                "type": "div",
                "props": {
                  "className": "flex items-center justify-between"
                },
                "allowsChildren": true,
                "children": [
                  {
                    "id": "525kjlv5a",
                    "name": "div",
                    "type": "div",
                    "props": {
                      "className": "flex items-center gap-4"
                    },
                    "allowsChildren": true,
                    "children": [
                      {
                        "id": "5q7m0ri4l",
                        "name": "BookOpenIcon",
                        "type": "BookOpenIcon",
                        "props": {
                          "className": "w-6 h-6"
                        },
                        "allowsChildren": true,
                        "children": [],
                        icon: undefined
                      },
                      {
                        "id": "jwyazqxz9",
                        "name": "h2",
                        "type": "h2",
                        "props": {
                          "className": "text-xl font-bold"
                        },
                        "allowsChildren": true,
                        "children": [
                          {
                            "id": "1727219574862o76psc83s",
                            "name": "Text",
                            "type": "text",
                            "allowsChildren": false,
                            "children": [],
                            "props": {
                              "content": "Bible"
                            },
                            icon: undefined
                          }
                        ],
                        icon: undefined
                      }
                    ],
                    icon: undefined
                  },
                  {
                    "id": "yx5x5u5ei",
                    "name": "div",
                    "type": "div",
                    "props": {
                      "className": "flex items-center gap-4"
                    },
                    "allowsChildren": true,
                    "children": [
                      {
                        "id": "ukii1u5ls",
                        "name": "DropdownMenu",
                        "type": "DropdownMenu",
                        "props": {},
                        "allowsChildren": true,
                        "children": [
                          {
                            "id": "eyrtaw6qm",
                            "name": "DropdownMenuTrigger",
                            "type": "DropdownMenuTrigger",
                            "props": {
                              "asChild": true
                            },
                            "allowsChildren": true,
                            "children": [
                              {
                                "id": "cudfbvcu8",
                                "name": "Button",
                                "type": "Button",
                                "props": {
                                  "variant": "outline",
                                  "size": "sm"
                                },
                                "allowsChildren": true,
                                "children": [
                                  {
                                    "id": "j57gajmgf",
                                    "name": "ImportIcon",
                                    "type": "ImportIcon",
                                    "props": {
                                      "className": "w-4 h-4 mr-2"
                                    },
                                    "allowsChildren": true,
                                    "children": [],
                                    icon: undefined
                                  },
                                  {
                                    "id": "0d7nxjqfg",
                                    "name": "span",
                                    "type": "span",
                                    "props": {},
                                    "allowsChildren": true,
                                    "children": [
                                      {
                                        "id": "1727219574868uav691crd",
                                        "name": "Text",
                                        "type": "text",
                                        "allowsChildren": false,
                                        "children": [],
                                        "props": {
                                          "content": "Version"
                                        },
                                        icon: undefined
                                      }
                                    ],
                                    icon: undefined
                                  },
                                  {
                                    "id": "ntdz7urdx",
                                    "name": "ChevronsUpDownIcon",
                                    "type": "ChevronsUpDownIcon",
                                    "props": {
                                      "className": "w-4 h-4 ml-2"
                                    },
                                    "allowsChildren": true,
                                    "children": [],
                                    icon: undefined
                                  }
                                ],
                                icon: undefined
                              }
                            ],
                            icon: undefined
                          },
                          {
                            "id": "8stv737yz",
                            "name": "DropdownMenuContent",
                            "type": "DropdownMenuContent",
                            "props": {
                              "align": "end"
                            },
                            "allowsChildren": true,
                            "children": [
                              {
                                "id": "sg0nimzjl",
                                "name": "DropdownMenuLabel",
                                "type": "DropdownMenuLabel",
                                "props": {},
                                "allowsChildren": true,
                                "children": [
                                  {
                                    "id": "17272195748700g6ipx2ac",
                                    "name": "Text",
                                    "type": "text",
                                    "allowsChildren": false,
                                    "children": [],
                                    "props": {
                                      "content": "Select Version"
                                    },
                                    icon: undefined
                                  }
                                ],
                                icon: undefined
                              },
                              {
                                "id": "vubf21ge9",
                                "name": "DropdownMenuSeparator",
                                "type": "DropdownMenuSeparator",
                                "props": {},
                                "allowsChildren": true,
                                "children": [],
                                icon: undefined
                              },
                              {
                                "id": "sm6freesm",
                                "name": "DropdownMenuItem",
                                "type": "DropdownMenuItem",
                                "props": {},
                                "allowsChildren": true,
                                "children": [
                                  {
                                    "id": "1727219574870xxt7qmc7n",
                                    "name": "Text",
                                    "type": "text",
                                    "allowsChildren": false,
                                    "children": [],
                                    "props": {
                                      "content": "King James Version (KJV)"
                                    },
                                    icon: undefined
                                  }
                                ],
                                icon: undefined
                              },
                              {
                                "id": "m22ckpxcr",
                                "name": "DropdownMenuItem",
                                "type": "DropdownMenuItem",
                                "props": {},
                                "allowsChildren": true,
                                "children": [
                                  {
                                    "id": "1727219574870u19fh8z5b",
                                    "name": "Text",
                                    "type": "text",
                                    "allowsChildren": false,
                                    "children": [],
                                    "props": {
                                      "content": "New International Version (NIV)"
                                    },
                                    icon: undefined
                                  }
                                ],
                                icon: undefined
                              },
                              {
                                "id": "gnn2aqk6t",
                                "name": "DropdownMenuItem",
                                "type": "DropdownMenuItem",
                                "props": {},
                                "allowsChildren": true,
                                "children": [
                                  {
                                    "id": "17272195748706ax741u0u",
                                    "name": "Text",
                                    "type": "text",
                                    "allowsChildren": false,
                                    "children": [],
                                    "props": {
                                      "content": "English Standard Version (ESV)"
                                    },
                                    icon: undefined
                                  }
                                ],
                                icon: undefined
                              },
                              {
                                "id": "1rqnwtc2a",
                                "name": "DropdownMenuItem",
                                "type": "DropdownMenuItem",
                                "props": {},
                                "allowsChildren": true,
                                "children": [
                                  {
                                    "id": "1727219574870c36ebaj0i",
                                    "name": "Text",
                                    "type": "text",
                                    "allowsChildren": false,
                                    "children": [],
                                    "props": {
                                      "content": "New Living Translation (NLT)"
                                    },
                                    icon: undefined
                                  }
                                ],
                                icon: undefined
                              },
                              {
                                "id": "idhgsfisl",
                                "name": "DropdownMenuItem",
                                "type": "DropdownMenuItem",
                                "props": {},
                                "allowsChildren": true,
                                "children": [
                                  {
                                    "id": "1727219574871si3t613km",
                                    "name": "Text",
                                    "type": "text",
                                    "allowsChildren": false,
                                    "children": [],
                                    "props": {
                                      "content": "Douay-Rheims Bible (DRB)"
                                    },
                                    icon: undefined
                                  }
                                ],
                                icon: undefined
                              }
                            ],
                            icon: undefined
                          }
                        ],
                        icon: undefined
                      },
                      {
                        "id": "qiixn3asm",
                        "name": "DropdownMenu",
                        "type": "DropdownMenu",
                        "props": {},
                        "allowsChildren": true,
                        "children": [
                          {
                            "id": "45414xvrc",
                            "name": "DropdownMenuTrigger",
                            "type": "DropdownMenuTrigger",
                            "props": {
                              "asChild": true
                            },
                            "allowsChildren": true,
                            "children": [
                              {
                                "id": "1up3zcm9q",
                                "name": "Button",
                                "type": "Button",
                                "props": {
                                  "variant": "outline",
                                  "size": "sm"
                                },
                                "allowsChildren": true,
                                "children": [
                                  {
                                    "id": "god18od5f",
                                    "name": "FilterIcon",
                                    "type": "FilterIcon",
                                    "props": {
                                      "className": "w-4 h-4 mr-2"
                                    },
                                    "allowsChildren": true,
                                    "children": [],
                                    icon: undefined
                                  },
                                  {
                                    "id": "jdiqvgyof",
                                    "name": "span",
                                    "type": "span",
                                    "props": {},
                                    "allowsChildren": true,
                                    "children": [
                                      {
                                        "id": "1727219574874m5ciob7k9",
                                        "name": "Text",
                                        "type": "text",
                                        "allowsChildren": false,
                                        "children": [],
                                        "props": {
                                          "content": "Filter"
                                        },
                                        icon: undefined
                                      }
                                    ],
                                    icon: undefined
                                  },
                                  {
                                    "id": "0vnrakuie",
                                    "name": "ChevronsUpDownIcon",
                                    "type": "ChevronsUpDownIcon",
                                    "props": {
                                      "className": "w-4 h-4 ml-2"
                                    },
                                    "allowsChildren": true,
                                    "children": [],
                                    icon: undefined
                                  }
                                ],
                                icon: undefined
                              }
                            ],
                            icon: undefined
                          },
                          {
                            "id": "0nua3jmqd",
                            "name": "DropdownMenuContent",
                            "type": "DropdownMenuContent",
                            "props": {
                              "align": "end"
                            },
                            "allowsChildren": true,
                            "children": [
                              {
                                "id": "nfr6jdvdn",
                                "name": "DropdownMenuLabel",
                                "type": "DropdownMenuLabel",
                                "props": {},
                                "allowsChildren": true,
                                "children": [
                                  {
                                    "id": "1727219574875vs252fqt2",
                                    "name": "Text",
                                    "type": "text",
                                    "allowsChildren": false,
                                    "children": [],
                                    "props": {
                                      "content": "Filter Options"
                                    },
                                    icon: undefined
                                  }
                                ],
                                icon: undefined
                              },
                              {
                                "id": "7eid77at3",
                                "name": "DropdownMenuSeparator",
                                "type": "DropdownMenuSeparator",
                                "props": {},
                                "allowsChildren": true,
                                "children": [],
                                icon: undefined
                              },
                              {
                                "id": "1356y26vf",
                                "name": "DropdownMenuItem",
                                "type": "DropdownMenuItem",
                                "props": {},
                                "allowsChildren": true,
                                "children": [
                                  {
                                    "id": "je4mlg302",
                                    "name": "Checkbox",
                                    "type": "Checkbox",
                                    "props": {
                                      "checked": true
                                    },
                                    "allowsChildren": true,
                                    "children": [],
                                    icon: undefined
                                  },
                                  {
                                    "id": "koiuyi0bh",
                                    "name": "span",
                                    "type": "span",
                                    "props": {},
                                    "allowsChildren": true,
                                    "children": [
                                      {
                                        "id": "17272195748759gkt9w86s",
                                        "name": "Text",
                                        "type": "text",
                                        "allowsChildren": false,
                                        "children": [],
                                        "props": {
                                          "content": "Old Testament"
                                        },
                                        icon: undefined
                                      }
                                    ],
                                    icon: undefined
                                  }
                                ],
                                icon: undefined
                              },
                              {
                                "id": "kpndfmfh8",
                                "name": "DropdownMenuItem",
                                "type": "DropdownMenuItem",
                                "props": {},
                                "allowsChildren": true,
                                "children": [
                                  {
                                    "id": "aw7a9mzms",
                                    "name": "Checkbox",
                                    "type": "Checkbox",
                                    "props": {
                                      "checked": true
                                    },
                                    "allowsChildren": true,
                                    "children": [],
                                    icon: undefined
                                  },
                                  {
                                    "id": "qjgafogen",
                                    "name": "span",
                                    "type": "span",
                                    "props": {},
                                    "allowsChildren": true,
                                    "children": [
                                      {
                                        "id": "1727219574876wtide7uxr",
                                        "name": "Text",
                                        "type": "text",
                                        "allowsChildren": false,
                                        "children": [],
                                        "props": {
                                          "content": "New Testament"
                                        },
                                        icon: undefined
                                      }
                                    ],
                                    icon: undefined
                                  }
                                ],
                                icon: undefined
                              },
                              {
                                "id": "smgi5hrzl",
                                "name": "DropdownMenuItem",
                                "type": "DropdownMenuItem",
                                "props": {},
                                "allowsChildren": true,
                                "children": [
                                  {
                                    "id": "q24whl43p",
                                    "name": "Checkbox",
                                    "type": "Checkbox",
                                    "props": {
                                      "checked": null
                                    },
                                    "allowsChildren": true,
                                    "children": [],
                                    icon: undefined
                                  },
                                  {
                                    "id": "20t2ohfcr",
                                    "name": "span",
                                    "type": "span",
                                    "props": {},
                                    "allowsChildren": true,
                                    "children": [
                                      {
                                        "id": "1727219574878ldgfam90u",
                                        "name": "Text",
                                        "type": "text",
                                        "allowsChildren": false,
                                        "children": [],
                                        "props": {
                                          "content": "Apocrypha"
                                        },
                                        icon: undefined
                                      }
                                    ],
                                    icon: undefined
                                  }
                                ],
                                icon: undefined
                              }
                            ],
                            icon: undefined
                          }
                        ],
                        icon: undefined
                      }
                    ],
                    icon: undefined
                  }
                ],
                icon: undefined
              },
              {
                "id": "3jq4sj7yc",
                "name": "div",
                "type": "div",
                "props": {
                  "className": "grid gap-4"
                },
                "allowsChildren": true,
                "children": [
                  {
                    "id": "grys2k65e",
                    "name": "div",
                    "type": "div",
                    "props": {
                      "className": "bg-muted/20 p-4 rounded-md"
                    },
                    "allowsChildren": true,
                    "children": [
                      {
                        "id": "j5rssipm7",
                        "name": "h3",
                        "type": "h3",
                        "props": {
                          "className": "text-lg font-bold"
                        },
                        "allowsChildren": true,
                        "children": [
                          {
                            "id": "1727219574884yh8hvdknv",
                            "name": "Text",
                            "type": "text",
                            "allowsChildren": false,
                            "children": [],
                            "props": {
                              "content": "Today's Verse"
                            },
                            icon: undefined
                          }
                        ],
                        icon: undefined
                      },
                      {
                        "id": "3er19ooft",
                        "name": "div",
                        "type": "div",
                        "props": {
                          "className": "mt-2 text-xl font-bold"
                        },
                        "allowsChildren": true,
                        "children": [
                          {
                            "id": "1727219574885yyozdblv8",
                            "name": "Text",
                            "type": "text",
                            "allowsChildren": false,
                            "children": [],
                            "props": {
                              "content": "\"For God so loved the world, that he gave his only begotten Son, that whosoever believeth in him should\n                not perish, but have everlasting life.\""
                            },
                            icon: undefined
                          }
                        ],
                        icon: undefined
                      },
                      {
                        "id": "tshb3fhtr",
                        "name": "div",
                        "type": "div",
                        "props": {
                          "className": "mt-2 text-sm text-muted-foreground"
                        },
                        "allowsChildren": true,
                        "children": [
                          {
                            "id": "1727219574885mbjd3c9ej",
                            "name": "Text",
                            "type": "text",
                            "allowsChildren": false,
                            "children": [],
                            "props": {
                              "content": "John 3:16"
                            },
                            icon: undefined
                          }
                        ],
                        icon: undefined
                      }
                    ],
                    icon: undefined
                  },
                  {
                    "id": "q6ef4vxks",
                    "name": "div",
                    "type": "div",
                    "props": {
                      "className": "bg-muted/20 p-4 rounded-md"
                    },
                    "allowsChildren": true,
                    "children": [
                      {
                        "id": "vg1vmt8cu",
                        "name": "h3",
                        "type": "h3",
                        "props": {
                          "className": "text-lg font-bold"
                        },
                        "allowsChildren": true,
                        "children": [
                          {
                            "id": "1727219574888h3k1p1d46",
                            "name": "Text",
                            "type": "text",
                            "allowsChildren": false,
                            "children": [],
                            "props": {
                              "content": "Recommended for You"
                            },
                            icon: undefined
                          }
                        ],
                        icon: undefined
                      },
                      {
                        "id": "xgrurnm06",
                        "name": "div",
                        "type": "div",
                        "props": {
                          "className": "mt-2 grid gap-2"
                        },
                        "allowsChildren": true,
                        "children": [
                          {
                            "id": "putye3psm",
                            "name": "div",
                            "type": "div",
                            "props": {
                              "className": "flex items-center gap-2"
                            },
                            "allowsChildren": true,
                            "children": [
                              {
                                "id": "20cy6suwc",
                                "name": "LinkIcon",
                                "type": "LinkIcon",
                                "props": {
                                  "className": "w-5 h-5"
                                },
                                "allowsChildren": true,
                                "children": [],
                                icon: undefined
                              },
                              {
                                "id": "fkhuy8po5",
                                "name": "div",
                                "type": "div",
                                "props": {},
                                "allowsChildren": true,
                                "children": [
                                  {
                                    "id": "b0nbqi62u",
                                    "name": "div",
                                    "type": "div",
                                    "props": {
                                      "className": "font-medium"
                                    },
                                    "allowsChildren": true,
                                    "children": [
                                      {
                                        "id": "1727219574891p7cjtlgwp",
                                        "name": "Text",
                                        "type": "text",
                                        "allowsChildren": false,
                                        "children": [],
                                        "props": {
                                          "content": "Overcoming Anxiety"
                                        },
                                        icon: undefined
                                      }
                                    ],
                                    icon: undefined
                                  },
                                  {
                                    "id": "g977uo42r",
                                    "name": "div",
                                    "type": "div",
                                    "props": {
                                      "className": "text-sm text-muted-foreground"
                                    },
                                    "allowsChildren": true,
                                    "children": [
                                      {
                                        "id": "1727219574891hb4fcph2p",
                                        "name": "Text",
                                        "type": "text",
                                        "allowsChildren": false,
                                        "children": [],
                                        "props": {
                                          "content": "Philippians 4:6-7"
                                        },
                                        icon: undefined
                                      }
                                    ],
                                    icon: undefined
                                  }
                                ],
                                icon: undefined
                              }
                            ],
                            icon: undefined
                          },
                          {
                            "id": "efav5n31k",
                            "name": "div",
                            "type": "div",
                            "props": {
                              "className": "flex items-center gap-2"
                            },
                            "allowsChildren": true,
                            "children": [
                              {
                                "id": "ka3nafugj",
                                "name": "LinkIcon",
                                "type": "LinkIcon",
                                "props": {
                                  "className": "w-5 h-5"
                                },
                                "allowsChildren": true,
                                "children": [],
                                icon: undefined
                              },
                              {
                                "id": "rvcntl1zm",
                                "name": "div",
                                "type": "div",
                                "props": {},
                                "allowsChildren": true,
                                "children": [
                                  {
                                    "id": "yalz239bd",
                                    "name": "div",
                                    "type": "div",
                                    "props": {
                                      "className": "font-medium"
                                    },
                                    "allowsChildren": true,
                                    "children": [
                                      {
                                        "id": "17272195748915d3e5x6nb",
                                        "name": "Text",
                                        "type": "text",
                                        "allowsChildren": false,
                                        "children": [],
                                        "props": {
                                          "content": "Finding Peace in Troubled Times"
                                        },
                                        icon: undefined
                                      }
                                    ],
                                    icon: undefined
                                  },
                                  {
                                    "id": "b6bnf9431",
                                    "name": "div",
                                    "type": "div",
                                    "props": {
                                      "className": "text-sm text-muted-foreground"
                                    },
                                    "allowsChildren": true,
                                    "children": [
                                      {
                                        "id": "17272195748928f9bfvejo",
                                        "name": "Text",
                                        "type": "text",
                                        "allowsChildren": false,
                                        "children": [],
                                        "props": {
                                          "content": "John 14:27"
                                        },
                                        icon: undefined
                                      }
                                    ],
                                    icon: undefined
                                  }
                                ],
                                icon: undefined
                              }
                            ],
                            icon: undefined
                          },
                          {
                            "id": "0bmv9rkah",
                            "name": "div",
                            "type": "div",
                            "props": {
                              "className": "flex items-center gap-2"
                            },
                            "allowsChildren": true,
                            "children": [
                              {
                                "id": "n776un95h",
                                "name": "LinkIcon",
                                "type": "LinkIcon",
                                "props": {
                                  "className": "w-5 h-5"
                                },
                                "allowsChildren": true,
                                "children": [],
                                icon: undefined
                              },
                              {
                                "id": "j6013kad8",
                                "name": "div",
                                "type": "div",
                                "props": {},
                                "allowsChildren": true,
                                "children": [
                                  {
                                    "id": "h67kzyqmx",
                                    "name": "div",
                                    "type": "div",
                                    "props": {
                                      "className": "font-medium"
                                    },
                                    "allowsChildren": true,
                                    "children": [
                                      {
                                        "id": "172721957489332zg8z6v1",
                                        "name": "Text",
                                        "type": "text",
                                        "allowsChildren": false,
                                        "children": [],
                                        "props": {
                                          "content": "Trusting in God's Plan"
                                        },
                                        icon: undefined
                                      }
                                    ],
                                    icon: undefined
                                  },
                                  {
                                    "id": "jg7b3t1xi",
                                    "name": "div",
                                    "type": "div",
                                    "props": {
                                      "className": "text-sm text-muted-foreground"
                                    },
                                    "allowsChildren": true,
                                    "children": [
                                      {
                                        "id": "1727219574893aim5l912s",
                                        "name": "Text",
                                        "type": "text",
                                        "allowsChildren": false,
                                        "children": [],
                                        "props": {
                                          "content": "Jeremiah 29:11"
                                        },
                                        icon: undefined
                                      }
                                    ],
                                    icon: undefined
                                  }
                                ],
                                icon: undefined
                              }
                            ],
                            icon: undefined
                          }
                        ],
                        icon: undefined
                      }
                    ],
                    icon: undefined
                  },
                  {
                    "id": "jqosh8u2j",
                    "name": "div",
                    "type": "div",
                    "props": {
                      "className": "bg-muted/20 p-4 rounded-md"
                    },
                    "allowsChildren": true,
                    "children": [
                      {
                        "id": "i5q2i5988",
                        "name": "h3",
                        "type": "h3",
                        "props": {
                          "className": "text-lg font-bold"
                        },
                        "allowsChildren": true,
                        "children": [
                          {
                            "id": "172721957489490jx5lzzr",
                            "name": "Text",
                            "type": "text",
                            "allowsChildren": false,
                            "children": [],
                            "props": {
                              "content": "Search"
                            },
                            icon: undefined
                          }
                        ],
                        icon: undefined
                      },
                      {
                        "id": "n5n16az5i",
                        "name": "form",
                        "type": "form",
                        "props": {
                          "className": "mt-2 flex items-center gap-2"
                        },
                        "allowsChildren": true,
                        "children": [
                          {
                            "id": "ig596q1c6",
                            "name": "Input",
                            "type": "Input",
                            "props": {
                              "type": "search",
                              "placeholder": "Search Bible",
                              "className": "flex-1"
                            },
                            "allowsChildren": true,
                            "children": [],
                            icon: undefined
                          },
                          {
                            "id": "xxqt8nzqn",
                            "name": "Button",
                            "type": "Button",
                            "props": {
                              "size": "sm"
                            },
                            "allowsChildren": true,
                            "children": [
                              {
                                "id": "b72r4agvh",
                                "name": "SearchIcon",
                                "type": "SearchIcon",
                                "props": {
                                  "className": "w-4 h-4"
                                },
                                "allowsChildren": true,
                                "children": [],
                                icon: undefined
                              },
                              {
                                "id": "a1ancewpp",
                                "name": "span",
                                "type": "span",
                                "props": {},
                                "allowsChildren": true,
                                "children": [
                                  {
                                    "id": "1727219574897r7ve7hcpd",
                                    "name": "Text",
                                    "type": "text",
                                    "allowsChildren": false,
                                    "children": [],
                                    "props": {
                                      "content": "Search"
                                    },
                                    icon: undefined
                                  }
                                ],
                                icon: undefined
                              }
                            ],
                            icon: undefined
                          }
                        ],
                        icon: undefined
                      }
                    ],
                    icon: undefined
                  },
                  {
                    "id": "1fu3fe1mz",
                    "name": "div",
                    "type": "div",
                    "props": {
                      "className": "bg-muted/20 p-4 rounded-md"
                    },
                    "allowsChildren": true,
                    "children": [
                      {
                        "id": "ipfiaxh3w",
                        "name": "h3",
                        "type": "h3",
                        "props": {
                          "className": "text-lg font-bold"
                        },
                        "allowsChildren": true,
                        "children": [
                          {
                            "id": "1727219574900rh4d43srh",
                            "name": "Text",
                            "type": "text",
                            "allowsChildren": false,
                            "children": [],
                            "props": {
                              "content": "Bookmarks"
                            },
                            icon: undefined
                          }
                        ],
                        icon: undefined
                      },
                      {
                        "id": "jwyqqaf1i",
                        "name": "div",
                        "type": "div",
                        "props": {
                          "className": "mt-2 grid gap-2"
                        },
                        "allowsChildren": true,
                        "children": [
                          {
                            "id": "hgq4md6pi",
                            "name": "div",
                            "type": "div",
                            "props": {
                              "className": "flex items-center gap-2"
                            },
                            "allowsChildren": true,
                            "children": [
                              {
                                "id": "b786i7ga1",
                                "name": "BookmarkIcon",
                                "type": "BookmarkIcon",
                                "props": {
                                  "className": "w-5 h-5"
                                },
                                "allowsChildren": true,
                                "children": [],
                                icon: undefined
                              },
                              {
                                "id": "glgro75rt",
                                "name": "div",
                                "type": "div",
                                "props": {},
                                "allowsChildren": true,
                                "children": [
                                  {
                                    "id": "m7scsvv89",
                                    "name": "div",
                                    "type": "div",
                                    "props": {
                                      "className": "font-medium"
                                    },
                                    "allowsChildren": true,
                                    "children": [
                                      {
                                        "id": "1727219574902eqi4i97kr",
                                        "name": "Text",
                                        "type": "text",
                                        "allowsChildren": false,
                                        "children": [],
                                        "props": {
                                          "content": "Psalm 23"
                                        },
                                        icon: undefined
                                      }
                                    ],
                                    icon: undefined
                                  },
                                  {
                                    "id": "sd2xdorfd",
                                    "name": "div",
                                    "type": "div",
                                    "props": {
                                      "className": "text-sm text-muted-foreground"
                                    },
                                    "allowsChildren": true,
                                    "children": [
                                      {
                                        "id": "1727219574902d5y4l61l5",
                                        "name": "Text",
                                        "type": "text",
                                        "allowsChildren": false,
                                        "children": [],
                                        "props": {
                                          "content": "The Lord is my shepherd"
                                        },
                                        icon: undefined
                                      }
                                    ],
                                    icon: undefined
                                  }
                                ],
                                icon: undefined
                              }
                            ],
                            icon: undefined
                          },
                          {
                            "id": "zmqb5gldg",
                            "name": "div",
                            "type": "div",
                            "props": {
                              "className": "flex items-center gap-2"
                            },
                            "allowsChildren": true,
                            "children": [
                              {
                                "id": "ahg98a599",
                                "name": "BookmarkIcon",
                                "type": "BookmarkIcon",
                                "props": {
                                  "className": "w-5 h-5"
                                },
                                "allowsChildren": true,
                                "children": [],
                                icon: undefined
                              },
                              {
                                "id": "9hf9kdqc9",
                                "name": "div",
                                "type": "div",
                                "props": {},
                                "allowsChildren": true,
                                "children": [
                                  {
                                    "id": "zv8jy1mor",
                                    "name": "div",
                                    "type": "div",
                                    "props": {
                                      "className": "font-medium"
                                    },
                                    "allowsChildren": true,
                                    "children": [
                                      {
                                        "id": "1727219574903sl34udfqh",
                                        "name": "Text",
                                        "type": "text",
                                        "allowsChildren": false,
                                        "children": [],
                                        "props": {
                                          "content": "Philippians 4:6-7"
                                        },
                                        icon: undefined
                                      }
                                    ],
                                    icon: undefined
                                  },
                                  {
                                    "id": "qtnyuggka",
                                    "name": "div",
                                    "type": "div",
                                    "props": {
                                      "className": "text-sm text-muted-foreground"
                                    },
                                    "allowsChildren": true,
                                    "children": [
                                      {
                                        "id": "17272195749037x2onjdfy",
                                        "name": "Text",
                                        "type": "text",
                                        "allowsChildren": false,
                                        "children": [],
                                        "props": {
                                          "content": "Do not be anxious about anything"
                                        },
                                        icon: undefined
                                      }
                                    ],
                                    icon: undefined
                                  }
                                ],
                                icon: undefined
                              }
                            ],
                            icon: undefined
                          },
                          {
                            "id": "yoj5hq7l3",
                            "name": "div",
                            "type": "div",
                            "props": {
                              "className": "flex items-center gap-2"
                            },
                            "allowsChildren": true,
                            "children": [
                              {
                                "id": "bk2x9u2vb",
                                "name": "BookmarkIcon",
                                "type": "BookmarkIcon",
                                "props": {
                                  "className": "w-5 h-5"
                                },
                                "allowsChildren": true,
                                "children": [],
                                icon: undefined
                              },
                              {
                                "id": "nohp9g5xg",
                                "name": "div",
                                "type": "div",
                                "props": {},
                                "allowsChildren": true,
                                "children": [
                                  {
                                    "id": "bcm5ex3x9",
                                    "name": "div",
                                    "type": "div",
                                    "props": {
                                      "className": "font-medium"
                                    },
                                    "allowsChildren": true,
                                    "children": [
                                      {
                                        "id": "17272195749040kohvpszf",
                                        "name": "Text",
                                        "type": "text",
                                        "allowsChildren": false,
                                        "children": [],
                                        "props": {
                                          "content": "John 3:16"
                                        },
                                        icon: undefined
                                      }
                                    ],
                                    icon: undefined
                                  },
                                  {
                                    "id": "vphlpmxcu",
                                    "name": "div",
                                    "type": "div",
                                    "props": {
                                      "className": "text-sm text-muted-foreground"
                                    },
                                    "allowsChildren": true,
                                    "children": [
                                      {
                                        "id": "1727219574904jrlz9ju4u",
                                        "name": "Text",
                                        "type": "text",
                                        "allowsChildren": false,
                                        "children": [],
                                        "props": {
                                          "content": "For God so loved the world"
                                        },
                                        icon: undefined
                                      }
                                    ],
                                    icon: undefined
                                  }
                                ],
                                icon: undefined
                              }
                            ],
                            icon: undefined
                          }
                        ],
                        icon: undefined
                      }
                    ],
                    icon: undefined
                  }
                ],
                icon: undefined
              }
            ],
            icon: undefined
          }
        ],
        icon: undefined
      }
    ],
    icon: undefined
  }
]

const kanbanSection: TreeItem[] = [
  {
    "id": "heipj1m1c",
    "name": "Kanban Section",
    "type": "div",
    "props": {
      "className": "grid grid-cols-3 gap-4 p-4"
    },
    "allowsChildren": true,
    "children": [
      {
        "id": "csm3exo7v",
        "name": "div",
        "type": "div",
        "props": {
          "className": "bg-card rounded-lg shadow"
        },
        "allowsChildren": true,
        "children": [
          {
            "id": "svokwugcu",
            "name": "div",
            "type": "div",
            "props": {
              "className": "bg-card-foreground text-card px-4 py-3 font-medium rounded-t-lg"
            },
            "allowsChildren": true,
            "children": [
              {
                "id": "1727219973381qj06rqods",
                "name": "Text",
                "type": "text",
                "allowsChildren": false,
                "children": [],
                "props": {
                  "content": "To Do"
                },
                icon: undefined
              }
            ],
            icon: undefined
          },
          {
            "id": "sptrl9xaz",
            "name": "div",
            "type": "div",
            "props": {
              "className": "p-4 space-y-4"
            },
            "allowsChildren": true,
            "children": [
              {
                "id": "f9691zz6q",
                "name": "div",
                "type": "div",
                "props": {
                  "className": "bg-background rounded-lg shadow"
                },
                "allowsChildren": true,
                "children": [
                  {
                    "id": "xflgm7wan",
                    "name": "div",
                    "type": "div",
                    "props": {
                      "className": "p-4"
                    },
                    "allowsChildren": true,
                    "children": [
                      {
                        "id": "onjy6oe74",
                        "name": "h3",
                        "type": "h3",
                        "props": {
                          "className": "font-medium"
                        },
                        "allowsChildren": true,
                        "children": [
                          {
                            "id": "17272199733874grci27wl",
                            "name": "Text",
                            "type": "text",
                            "allowsChildren": false,
                            "children": [],
                            "props": {
                              "content": "Finish wireframes"
                            },
                            icon: undefined
                          }
                        ],
                        icon: undefined
                      },
                      {
                        "id": "jt4nrecn7",
                        "name": "p",
                        "type": "p",
                        "props": {
                          "className": "text-muted-foreground text-sm"
                        },
                        "allowsChildren": true,
                        "children": [
                          {
                            "id": "172721997338740mv442l6",
                            "name": "Text",
                            "type": "text",
                            "allowsChildren": false,
                            "children": [],
                            "props": {
                              "content": "Complete the initial wireframes for the new homepage design."
                            },
                            icon: undefined
                          }
                        ],
                        icon: undefined
                      }
                    ],
                    icon: undefined
                  }
                ],
                icon: undefined
              },
              {
                "id": "tjvw85iqm",
                "name": "div",
                "type": "div",
                "props": {
                  "className": "bg-background rounded-lg shadow"
                },
                "allowsChildren": true,
                "children": [
                  {
                    "id": "1le7npv4v",
                    "name": "div",
                    "type": "div",
                    "props": {
                      "className": "p-4"
                    },
                    "allowsChildren": true,
                    "children": [
                      {
                        "id": "tst17l4wp",
                        "name": "h3",
                        "type": "h3",
                        "props": {
                          "className": "font-medium"
                        },
                        "allowsChildren": true,
                        "children": [
                          {
                            "id": "1727219973389xu6tr3vq7",
                            "name": "Text",
                            "type": "text",
                            "allowsChildren": false,
                            "children": [],
                            "props": {
                              "content": "Review content strategy"
                            },
                            icon: undefined
                          }
                        ],
                        icon: undefined
                      },
                      {
                        "id": "aaqji3w4m",
                        "name": "p",
                        "type": "p",
                        "props": {
                          "className": "text-muted-foreground text-sm"
                        },
                        "allowsChildren": true,
                        "children": [
                          {
                            "id": "1727219973391eddncfkfr",
                            "name": "Text",
                            "type": "text",
                            "allowsChildren": false,
                            "children": [],
                            "props": {
                              "content": "Discuss the content strategy with the marketing team."
                            },
                            icon: undefined
                          }
                        ],
                        icon: undefined
                      }
                    ],
                    icon: undefined
                  }
                ],
                icon: undefined
              },
              {
                "id": "o9xt163ab",
                "name": "div",
                "type": "div",
                "props": {
                  "className": "bg-background rounded-lg shadow"
                },
                "allowsChildren": true,
                "children": [
                  {
                    "id": "gycjgioet",
                    "name": "div",
                    "type": "div",
                    "props": {
                      "className": "p-4"
                    },
                    "allowsChildren": true,
                    "children": [
                      {
                        "id": "qskomaeco",
                        "name": "h3",
                        "type": "h3",
                        "props": {
                          "className": "font-medium"
                        },
                        "allowsChildren": true,
                        "children": [
                          {
                            "id": "1727219973393v43a693en",
                            "name": "Text",
                            "type": "text",
                            "allowsChildren": false,
                            "children": [],
                            "props": {
                              "content": "Set up project management tool"
                            },
                            icon: undefined
                          }
                        ],
                        icon: undefined
                      },
                      {
                        "id": "o9mjs4ezm",
                        "name": "p",
                        "type": "p",
                        "props": {
                          "className": "text-muted-foreground text-sm"
                        },
                        "allowsChildren": true,
                        "children": [
                          {
                            "id": "1727219973394s7fqt4qs2",
                            "name": "Text",
                            "type": "text",
                            "allowsChildren": false,
                            "children": [],
                            "props": {
                              "content": "Integrate the new project management tool with the team."
                            },
                            icon: undefined
                          }
                        ],
                        icon: undefined
                      }
                    ],
                    icon: undefined
                  }
                ],
                icon: undefined
              }
            ],
            icon: undefined
          }
        ],
        icon: undefined
      },
      {
        "id": "1wbzmszxj",
        "name": "div",
        "type": "div",
        "props": {
          "className": "bg-card rounded-lg shadow"
        },
        "allowsChildren": true,
        "children": [
          {
            "id": "6vhf3l37p",
            "name": "div",
            "type": "div",
            "props": {
              "className": "bg-card-foreground text-card px-4 py-3 font-medium rounded-t-lg"
            },
            "allowsChildren": true,
            "children": [
              {
                "id": "1727219973396wwerynhy8",
                "name": "Text",
                "type": "text",
                "allowsChildren": false,
                "children": [],
                "props": {
                  "content": "In Progress"
                },
                icon: undefined
              }
            ],
            icon: undefined
          },
          {
            "id": "t09lcslvk",
            "name": "div",
            "type": "div",
            "props": {
              "className": "p-4 space-y-4"
            },
            "allowsChildren": true,
            "children": [
              {
                "id": "2yprk2u6b",
                "name": "div",
                "type": "div",
                "props": {
                  "className": "bg-background rounded-lg shadow"
                },
                "allowsChildren": true,
                "children": [
                  {
                    "id": "xwsiqz1v0",
                    "name": "div",
                    "type": "div",
                    "props": {
                      "className": "p-4"
                    },
                    "allowsChildren": true,
                    "children": [
                      {
                        "id": "xam5tzdwv",
                        "name": "h3",
                        "type": "h3",
                        "props": {
                          "className": "font-medium"
                        },
                        "allowsChildren": true,
                        "children": [
                          {
                            "id": "1727219973401wgrvaicbw",
                            "name": "Text",
                            "type": "text",
                            "allowsChildren": false,
                            "children": [],
                            "props": {
                              "content": "Develop new homepage"
                            },
                            icon: undefined
                          }
                        ],
                        icon: undefined
                      },
                      {
                        "id": "k8van3lzg",
                        "name": "p",
                        "type": "p",
                        "props": {
                          "className": "text-muted-foreground text-sm"
                        },
                        "allowsChildren": true,
                        "children": [
                          {
                            "id": "1727219973401ku664q07q",
                            "name": "Text",
                            "type": "text",
                            "allowsChildren": false,
                            "children": [],
                            "props": {
                              "content": "Lorem ipsum"
                            },
                            icon: undefined
                          }
                        ],
                        icon: undefined
                      }
                    ],
                    icon: undefined
                  }
                ],
                icon: undefined
              },
              {
                "id": "cbiadmxgc",
                "name": "div",
                "type": "div",
                "props": {
                  "className": "bg-background rounded-lg shadow"
                },
                "allowsChildren": true,
                "children": [
                  {
                    "id": "6w8smsyq9",
                    "name": "div",
                    "type": "div",
                    "props": {
                      "className": "p-4"
                    },
                    "allowsChildren": true,
                    "children": [
                      {
                        "id": "whohr4qbr",
                        "name": "h3",
                        "type": "h3",
                        "props": {
                          "className": "font-medium"
                        },
                        "allowsChildren": true,
                        "children": [
                          {
                            "id": "1727219973403klci4wt7n",
                            "name": "Text",
                            "type": "text",
                            "allowsChildren": false,
                            "children": [],
                            "props": {
                              "content": "Optimize website performance"
                            },
                            icon: undefined
                          }
                        ],
                        icon: undefined
                      },
                      {
                        "id": "r4rfqcz56",
                        "name": "p",
                        "type": "p",
                        "props": {
                          "className": "text-muted-foreground text-sm"
                        },
                        "allowsChildren": true,
                        "children": [
                          {
                            "id": "1727219973404nfwqy76sf",
                            "name": "Text",
                            "type": "text",
                            "allowsChildren": false,
                            "children": [],
                            "props": {
                              "content": "Implement performance optimizations to improve website speed."
                            },
                            icon: undefined
                          }
                        ],
                        icon: undefined
                      }
                    ],
                    icon: undefined
                  }
                ],
                icon: undefined
              }
            ],
            icon: undefined
          }
        ],
        icon: undefined
      },
      {
        "id": "np8h457sh",
        "name": "div",
        "type": "div",
        "props": {
          "className": "bg-card rounded-lg shadow"
        },
        "allowsChildren": true,
        "children": [
          {
            "id": "xypvrgfbu",
            "name": "div",
            "type": "div",
            "props": {
              "className": "bg-card-foreground text-card px-4 py-3 font-medium rounded-t-lg"
            },
            "allowsChildren": true,
            "children": [
              {
                "id": "1727219973405qpp6ubn4y",
                "name": "Text",
                "type": "text",
                "allowsChildren": false,
                "children": [],
                "props": {
                  "content": "Done"
                },
                icon: undefined
              }
            ],
            icon: undefined
          },
          {
            "id": "0ahnwkuen",
            "name": "div",
            "type": "div",
            "props": {
              "className": "p-4 space-y-4"
            },
            "allowsChildren": true,
            "children": [
              {
                "id": "twrl2xma7",
                "name": "div",
                "type": "div",
                "props": {
                  "className": "bg-background rounded-lg shadow"
                },
                "allowsChildren": true,
                "children": [
                  {
                    "id": "ljesmbbf8",
                    "name": "div",
                    "type": "div",
                    "props": {
                      "className": "p-4"
                    },
                    "allowsChildren": true,
                    "children": [
                      {
                        "id": "fbmrihyl2",
                        "name": "h3",
                        "type": "h3",
                        "props": {
                          "className": "font-medium"
                        },
                        "allowsChildren": true,
                        "children": [
                          {
                            "id": "1727219973407pdagh26nn",
                            "name": "Text",
                            "type": "text",
                            "allowsChildren": false,
                            "children": [],
                            "props": {
                              "content": "Conduct user research"
                            },
                            icon: undefined
                          }
                        ],
                        icon: undefined
                      },
                      {
                        "id": "tgpha4ra0",
                        "name": "p",
                        "type": "p",
                        "props": {
                          "className": "text-muted-foreground text-sm"
                        },
                        "allowsChildren": true,
                        "children": [
                          {
                            "id": "1727219973408dacakrgs7",
                            "name": "Text",
                            "type": "text",
                            "allowsChildren": false,
                            "children": [],
                            "props": {
                              "content": "Gather user feedback and insights through interviews and surveys."
                            },
                            icon: undefined
                          }
                        ],
                        icon: undefined
                      }
                    ],
                    icon: undefined
                  }
                ],
                icon: undefined
              },
              {
                "id": "n45a9anom",
                "name": "div",
                "type": "div",
                "props": {
                  "className": "bg-background rounded-lg shadow"
                },
                "allowsChildren": true,
                "children": [
                  {
                    "id": "21fluo283",
                    "name": "div",
                    "type": "div",
                    "props": {
                      "className": "p-4"
                    },
                    "allowsChildren": true,
                    "children": [
                      {
                        "id": "cm0ac8d7g",
                        "name": "h3",
                        "type": "h3",
                        "props": {
                          "className": "font-medium"
                        },
                        "allowsChildren": true,
                        "children": [
                          {
                            "id": "1727219973409vk6rdw81w",
                            "name": "Text",
                            "type": "text",
                            "allowsChildren": false,
                            "children": [],
                            "props": {
                              "content": "Finalize branding guidelines"
                            },
                            icon: undefined
                          }
                        ],
                        icon: undefined
                      },
                      {
                        "id": "ht3xc9t6o",
                        "name": "p",
                        "type": "p",
                        "props": {
                          "className": "text-muted-foreground text-sm"
                        },
                        "allowsChildren": true,
                        "children": [
                          {
                            "id": "1727219973409jg1qnc96j",
                            "name": "Text",
                            "type": "text",
                            "allowsChildren": false,
                            "children": [],
                            "props": {
                              "content": "Establish the new branding guidelines for the company."
                            },
                            icon: undefined
                          }
                        ],
                        icon: undefined
                      }
                    ],
                    icon: undefined
                  }
                ],
                icon: undefined
              },
              {
                "id": "zp95yk77t",
                "name": "div",
                "type": "div",
                "props": {
                  "className": "bg-background rounded-lg shadow"
                },
                "allowsChildren": true,
                "children": [
                  {
                    "id": "qlima409d",
                    "name": "div",
                    "type": "div",
                    "props": {
                      "className": "p-4"
                    },
                    "allowsChildren": true,
                    "children": [
                      {
                        "id": "ypu47xr2f",
                        "name": "h3",
                        "type": "h3",
                        "props": {
                          "className": "font-medium"
                        },
                        "allowsChildren": true,
                        "children": [
                          {
                            "id": "17272199734100zn6wiv9d",
                            "name": "Text",
                            "type": "text",
                            "allowsChildren": false,
                            "children": [],
                            "props": {
                              "content": "Launch new website"
                            },
                            icon: undefined
                          }
                        ],
                        icon: undefined
                      },
                      {
                        "id": "hq09jkzfw",
                        "name": "p",
                        "type": "p",
                        "props": {
                          "className": "text-muted-foreground text-sm"
                        },
                        "allowsChildren": true,
                        "children": [
                          {
                            "id": "1727219973410xnnf9nead",
                            "name": "Text",
                            "type": "text",
                            "allowsChildren": false,
                            "children": [],
                            "props": {
                              "content": "Deploy the new website and announce the launch to the public."
                            },
                            icon: undefined
                          }
                        ],
                        icon: undefined
                      }
                    ],
                    icon: undefined
                  }
                ],
                icon: undefined
              }
            ],
            icon: undefined
          }
        ],
        icon: undefined
      }
    ],
    icon: undefined
  }
]

const reservationSection: TreeItem[] = [
  {
    "id": "33gs9w1mf",
    "name": "Reservation Section",
    "type": "section",
    "props": {
      "className": "relative inset-0 flex items-center justify-center z-50 bg-[#304529] p-10"
    },
    "allowsChildren": true,
    "children": [
      {
        "id": "txuh8j776",
        "name": "div",
        "type": "div",
        "props": {
          "className": "bg-white dark:bg-gray-800 opacity-75 rounded-lg shadow-lg w-96 p-8"
        },
        "allowsChildren": true,
        "children": [
          {
            "id": "yfbcb2wqj",
            "name": "h2",
            "type": "h2",
            "props": {
              "className": "text-2xl font-bold mb-4 dark:text-white"
            },
            "allowsChildren": true,
            "children": [
              {
                "id": "172722010370918pjmh3x5",
                "name": "Text",
                "type": "text",
                "allowsChildren": false,
                "children": [],
                "props": {
                  "content": "Reservation Dates"
                },
                icon: undefined
              }
            ],
            icon: undefined
          },
          {
            "id": "34jkvzoru",
            "name": "ul",
            "type": "ul",
            "props": {
              "className": "divide-y divide-gray-200 dark:divide-gray-700"
            },
            "allowsChildren": true,
            "children": [
              {
                "id": "p0mimuyfk",
                "name": "li",
                "type": "li",
                "props": {
                  "className": "py-4"
                },
                "allowsChildren": true,
                "children": [
                  {
                    "id": "m6uksyroe",
                    "name": "h3",
                    "type": "h3",
                    "props": {
                      "className": "mb-2 text-lg font-semibold dark:text-gray-200"
                    },
                    "allowsChildren": true,
                    "children": [
                      {
                        "id": "1727220103715iy2k2y60s",
                        "name": "Text",
                        "type": "text",
                        "allowsChildren": false,
                        "children": [],
                        "props": {
                          "content": "This Week"
                        },
                        icon: undefined
                      }
                    ],
                    icon: undefined
                  },
                  {
                    "id": "laai5qj2z",
                    "name": "div",
                    "type": "div",
                    "props": {
                      "className": "flex justify-between items-center"
                    },
                    "allowsChildren": true,
                    "children": [
                      {
                        "id": "c7by6ubef",
                        "name": "span",
                        "type": "span",
                        "props": {
                          "className": "text-gray-600 dark:text-gray-400"
                        },
                        "allowsChildren": true,
                        "children": [
                          {
                            "id": "1727220103716g10tnmhsn",
                            "name": "Text",
                            "type": "text",
                            "allowsChildren": false,
                            "children": [],
                            "props": {
                              "content": "29.10.2023, Thursday"
                            },
                            icon: undefined
                          }
                        ],
                        icon: undefined
                      },
                      {
                        "id": "e4nwf6bw2",
                        "name": "Link",
                        "type": "Link",
                        "props": {
                          "href": "#",
                          "className": "text-green-500 hover:underline flex items-center",
                          "prefetch": null
                        },
                        "allowsChildren": true,
                        "children": [
                          {
                            "id": "1727220103718vavxnkwh3",
                            "name": "Text",
                            "type": "text",
                            "allowsChildren": false,
                            "children": [],
                            "props": {
                              "content": "Reservation"
                            },
                            icon: undefined
                          },
                          {
                            "id": "i7nvqui7z",
                            "name": "ArrowRightIcon",
                            "type": "ArrowRightIcon",
                            "props": {
                              "className": "ml-2 h-5 w-5"
                            },
                            "allowsChildren": true,
                            "children": [],
                            icon: undefined
                          }
                        ],
                        icon: undefined
                      }
                    ],
                    icon: undefined
                  },
                  {
                    "id": "60k88v75m",
                    "name": "div",
                    "type": "div",
                    "props": {
                      "className": "flex justify-between items-center"
                    },
                    "allowsChildren": true,
                    "children": [
                      {
                        "id": "bq5p6hqmf",
                        "name": "span",
                        "type": "span",
                        "props": {
                          "className": "text-gray-600 dark:text-gray-400"
                        },
                        "allowsChildren": true,
                        "children": [
                          {
                            "id": "1727220103722nnfkz60x1",
                            "name": "Text",
                            "type": "text",
                            "allowsChildren": false,
                            "children": [],
                            "props": {
                              "content": "30.10.2023, Friday"
                            },
                            icon: undefined
                          }
                        ],
                        icon: undefined
                      },
                      {
                        "id": "u3mo1q2e9",
                        "name": "Link",
                        "type": "Link",
                        "props": {
                          "href": "#",
                          "className": "text-green-500 hover:underline flex items-center",
                          "prefetch": null
                        },
                        "allowsChildren": true,
                        "children": [
                          {
                            "id": "1727220103723qeb5feria",
                            "name": "Text",
                            "type": "text",
                            "allowsChildren": false,
                            "children": [],
                            "props": {
                              "content": "Reservation"
                            },
                            icon: undefined
                          },
                          {
                            "id": "wn9x6nnrg",
                            "name": "ArrowRightIcon",
                            "type": "ArrowRightIcon",
                            "props": {
                              "className": "ml-2 h-5 w-5"
                            },
                            "allowsChildren": true,
                            "children": [],
                            icon: undefined
                          }
                        ],
                        icon: undefined
                      }
                    ],
                    icon: undefined
                  },
                  {
                    "id": "2dkqv5s0j",
                    "name": "div",
                    "type": "div",
                    "props": {
                      "className": "flex justify-between items-center line-through"
                    },
                    "allowsChildren": true,
                    "children": [
                      {
                        "id": "3357p6gr2",
                        "name": "span",
                        "type": "span",
                        "props": {
                          "className": "text-gray-600 dark:text-gray-400"
                        },
                        "allowsChildren": true,
                        "children": [
                          {
                            "id": "1727220103724pj5m036b2",
                            "name": "Text",
                            "type": "text",
                            "allowsChildren": false,
                            "children": [],
                            "props": {
                              "content": "31.10.2023, Saturday"
                            },
                            icon: undefined
                          }
                        ],
                        icon: undefined
                      }
                    ],
                    icon: undefined
                  },
                  {
                    "id": "bya6j6olk",
                    "name": "div",
                    "type": "div",
                    "props": {
                      "className": "flex justify-between items-center"
                    },
                    "allowsChildren": true,
                    "children": [
                      {
                        "id": "ak2kt1ylt",
                        "name": "span",
                        "type": "span",
                        "props": {
                          "className": "text-gray-600 dark:text-gray-400"
                        },
                        "allowsChildren": true,
                        "children": [
                          {
                            "id": "17272201037281ekvbzvtr",
                            "name": "Text",
                            "type": "text",
                            "allowsChildren": false,
                            "children": [],
                            "props": {
                              "content": "01.11.2023, Sunday"
                            },
                            icon: undefined
                          }
                        ],
                        icon: undefined
                      },
                      {
                        "id": "wdiufka50",
                        "name": "Link",
                        "type": "Link",
                        "props": {
                          "href": "#",
                          "className": "text-green-500 hover:underline flex items-center",
                          "prefetch": null
                        },
                        "allowsChildren": true,
                        "children": [
                          {
                            "id": "17272201037298v38t1fmr",
                            "name": "Text",
                            "type": "text",
                            "allowsChildren": false,
                            "children": [],
                            "props": {
                              "content": "Reservation"
                            },
                            icon: undefined
                          },
                          {
                            "id": "8hfmononp",
                            "name": "ArrowRightIcon",
                            "type": "ArrowRightIcon",
                            "props": {
                              "className": "ml-2 h-5 w-5"
                            },
                            "allowsChildren": true,
                            "children": [],
                            icon: undefined
                          }
                        ],
                        icon: undefined
                      }
                    ],
                    icon: undefined
                  }
                ],
                icon: undefined
              },
              {
                "id": "0it642gr5",
                "name": "li",
                "type": "li",
                "props": {
                  "className": "py-4"
                },
                "allowsChildren": true,
                "children": [
                  {
                    "id": "hbaxbzs8x",
                    "name": "h3",
                    "type": "h3",
                    "props": {
                      "className": "mb-2 text-lg font-semibold dark:text-gray-200"
                    },
                    "allowsChildren": true,
                    "children": [
                      {
                        "id": "172722010373101jfftepj",
                        "name": "Text",
                        "type": "text",
                        "allowsChildren": false,
                        "children": [],
                        "props": {
                          "content": "Three Weeks From Now"
                        },
                        icon: undefined
                      }
                    ],
                    icon: undefined
                  },
                  {
                    "id": "h117qmf5d",
                    "name": "div",
                    "type": "div",
                    "props": {
                      "className": "flex justify-between items-center"
                    },
                    "allowsChildren": true,
                    "children": [
                      {
                        "id": "ng3foydh5",
                        "name": "span",
                        "type": "span",
                        "props": {
                          "className": "text-gray-600 dark:text-gray-400"
                        },
                        "allowsChildren": true,
                        "children": [
                          {
                            "id": "1727220103732gbumziic2",
                            "name": "Text",
                            "type": "text",
                            "allowsChildren": false,
                            "children": [],
                            "props": {
                              "content": "19.11.2023, Thursday"
                            },
                            icon: undefined
                          }
                        ],
                        icon: undefined
                      },
                      {
                        "id": "dzonqbn95",
                        "name": "Link",
                        "type": "Link",
                        "props": {
                          "href": "#",
                          "className": "text-green-500 hover:underline flex items-center",
                          "prefetch": null
                        },
                        "allowsChildren": true,
                        "children": [
                          {
                            "id": "1727220103732sf78st3l3",
                            "name": "Text",
                            "type": "text",
                            "allowsChildren": false,
                            "children": [],
                            "props": {
                              "content": "Reservation"
                            },
                            icon: undefined
                          },
                          {
                            "id": "en0sv03zo",
                            "name": "ArrowRightIcon",
                            "type": "ArrowRightIcon",
                            "props": {
                              "className": "ml-2 h-5 w-5"
                            },
                            "allowsChildren": true,
                            "children": [],
                            icon: undefined
                          }
                        ],
                        icon: undefined
                      }
                    ],
                    icon: undefined
                  },
                  {
                    "id": "1i9rdxsqj",
                    "name": "div",
                    "type": "div",
                    "props": {
                      "className": "flex justify-between items-center"
                    },
                    "allowsChildren": true,
                    "children": [
                      {
                        "id": "h2q12bi50",
                        "name": "span",
                        "type": "span",
                        "props": {
                          "className": "text-gray-600 dark:text-gray-400"
                        },
                        "allowsChildren": true,
                        "children": [
                          {
                            "id": "1727220103733oyc93magr",
                            "name": "Text",
                            "type": "text",
                            "allowsChildren": false,
                            "children": [],
                            "props": {
                              "content": "20.11.2023, Friday"
                            },
                            icon: undefined
                          }
                        ],
                        icon: undefined
                      },
                      {
                        "id": "sh11q0oz1",
                        "name": "Link",
                        "type": "Link",
                        "props": {
                          "href": "#",
                          "className": "text-green-500 hover:underline flex items-center",
                          "prefetch": null
                        },
                        "allowsChildren": true,
                        "children": [
                          {
                            "id": "1727220103734x1huk99md",
                            "name": "Text",
                            "type": "text",
                            "allowsChildren": false,
                            "children": [],
                            "props": {
                              "content": "Reservation"
                            },
                            icon: undefined
                          },
                          {
                            "id": "zgt07ezvv",
                            "name": "ArrowRightIcon",
                            "type": "ArrowRightIcon",
                            "props": {
                              "className": "ml-2 h-5 w-5"
                            },
                            "allowsChildren": true,
                            "children": [],
                            icon: undefined
                          }
                        ],
                        icon: undefined
                      }
                    ],
                    icon: undefined
                  },
                  {
                    "id": "tm88awuqx",
                    "name": "div",
                    "type": "div",
                    "props": {
                      "className": "flex justify-between items-center line-through"
                    },
                    "allowsChildren": true,
                    "children": [
                      {
                        "id": "idlgf87xk",
                        "name": "span",
                        "type": "span",
                        "props": {
                          "className": "text-gray-600 dark:text-gray-400"
                        },
                        "allowsChildren": true,
                        "children": [
                          {
                            "id": "17272201037347b1yf1hpx",
                            "name": "Text",
                            "type": "text",
                            "allowsChildren": false,
                            "children": [],
                            "props": {
                              "content": "21.11.2023, Saturday"
                            },
                            icon: undefined
                          }
                        ],
                        icon: undefined
                      }
                    ],
                    icon: undefined
                  },
                  {
                    "id": "g6d8cvna8",
                    "name": "div",
                    "type": "div",
                    "props": {
                      "className": "flex justify-between items-center"
                    },
                    "allowsChildren": true,
                    "children": [
                      {
                        "id": "n3xprt2px",
                        "name": "span",
                        "type": "span",
                        "props": {
                          "className": "text-gray-600 dark:text-gray-400"
                        },
                        "allowsChildren": true,
                        "children": [
                          {
                            "id": "17272201037371s2bggl80",
                            "name": "Text",
                            "type": "text",
                            "allowsChildren": false,
                            "children": [],
                            "props": {
                              "content": "22.11.2023, Sunday"
                            },
                            icon: undefined
                          }
                        ],
                        icon: undefined
                      },
                      {
                        "id": "3l4jgxn5y",
                        "name": "Link",
                        "type": "Link",
                        "props": {
                          "href": "#",
                          "className": "text-green-500 hover:underline flex items-center",
                          "prefetch": null
                        },
                        "allowsChildren": true,
                        "children": [
                          {
                            "id": "1727220103737jbxwhzbci",
                            "name": "Text",
                            "type": "text",
                            "allowsChildren": false,
                            "children": [],
                            "props": {
                              "content": "Reservation"
                            },
                            icon: undefined
                          },
                          {
                            "id": "ev0v447x4",
                            "name": "ArrowRightIcon",
                            "type": "ArrowRightIcon",
                            "props": {
                              "className": "ml-2 h-5 w-5"
                            },
                            "allowsChildren": true,
                            "children": [],
                            icon: undefined
                          }
                        ],
                        icon: undefined
                      }
                    ],
                    icon: undefined
                  }
                ],
                icon: undefined
              }
            ],
            icon: undefined
          },
          {
            "id": "2klo0mam7",
            "name": "button",
            "type": "button",
            "props": {
              "className": "mt-4 w-full h-10 bg-green-500 hover:bg-green-600 text-white rounded-md focus:outline-none focus:ring-2 focus:ring-green-600 focus:ring-opacity-50"
            },
            "allowsChildren": true,
            "children": [
              {
                "id": "17272201037396k61l9o2h",
                "name": "Text",
                "type": "text",
                "allowsChildren": false,
                "children": [],
                "props": {
                  "content": "Close"
                },
                icon: undefined
              }
            ],
            icon: undefined
          }
        ],
        icon: undefined
      }
    ],
    icon: undefined
  }
]

const profileSection: TreeItem[] = [
  {
    "id": "2x6kcqrnf",
    "name": "Profile Section",
    "type": "div",
    "props": {
      "className": "min-h-screen bg-gradient-to-r from-purple-400 via-pink-500 to-red-500 flex justify-center items-center"
    },
    "allowsChildren": true,
    "children": [
      {
        "id": "8bm2yb0zl",
        "name": "div",
        "type": "div",
        "props": {
          "className": "flex flex-col p-8 space-y-4 bg-white shadow-lg rounded-lg"
        },
        "allowsChildren": true,
        "children": [
          {
            "id": "edlvp5hgk",
            "name": "div",
            "type": "div",
            "props": {
              "className": "flex flex-col items-center"
            },
            "allowsChildren": true,
            "children": [
              {
                "id": "q93915vcq",
                "name": "label",
                "type": "label",
                "props": {
                  "className": "mt-2 cursor-pointer"
                },
                "allowsChildren": true,
                "children": [
                  {
                    "id": "ivbkuayck",
                    "name": "input",
                    "type": "input",
                    "props": {
                      "type": "file",
                      "className": "hidden",
                      "aria-label": "Upload profile picture"
                    },
                    "allowsChildren": true,
                    "children": [],
                    icon: undefined
                  },
                  {
                    "id": "h5y3avf13",
                    "name": "img",
                    "type": "img",
                    "props": {
                      "src": "/placeholder.svg",
                      "alt": "Doctor's profile picture",
                      "height": "100",
                      "width": "100",
                      "className": "rounded-full",
                      "style": null
                    },
                    "allowsChildren": true,
                    "children": [],
                    icon: undefined
                  }
                ],
                icon: undefined
              },
              {
                "id": "mw08ybj27",
                "name": "h2",
                "type": "h2",
                "props": {
                  "className": "mt-2 text-lg font-semibold"
                },
                "allowsChildren": true,
                "children": [
                  {
                    "id": "1727220176504enkolr4gv",
                    "name": "Text",
                    "type": "text",
                    "allowsChildren": false,
                    "children": [],
                    "props": {
                      "content": "Dr. Maximilian Mustermann"
                    },
                    icon: undefined
                  }
                ],
                icon: undefined
              }
            ],
            icon: undefined
          },
          {
            "id": "h0zm5bfml",
            "name": "div",
            "type": "div",
            "props": {
              "className": "flex gap-4"
            },
            "allowsChildren": true,
            "children": [
              {
                "id": "4kkiady5s",
                "name": "Input",
                "type": "Input",
                "props": {
                  "type": "text",
                  "aria-label": "Doctor's first name",
                  "placeholder": "First name",
                  "className": "border rounded-md p-2 flex-grow"
                },
                "allowsChildren": true,
                "children": [],
                icon: undefined
              },
              {
                "id": "8kt3bwgp1",
                "name": "Input",
                "type": "Input",
                "props": {
                  "type": "text",
                  "aria-label": "Doctor's last name",
                  "placeholder": "Last name",
                  "className": "border rounded-md p-2 flex-grow"
                },
                "allowsChildren": true,
                "children": [],
                icon: undefined
              }
            ],
            icon: undefined
          },
          {
            "id": "ochy2buhh",
            "name": "Input",
            "type": "Input",
            "props": {
              "type": "text",
              "aria-label": "Doctor's title",
              "placeholder": "Doctor's title",
              "className": "border rounded-md p-2"
            },
            "allowsChildren": true,
            "children": [],
            icon: undefined
          },
          {
            "id": "ob8hznob8",
            "name": "Select",
            "type": "Select",
            "props": {},
            "allowsChildren": true,
            "children": [
              {
                "id": "81jlkvit8",
                "name": "SelectTrigger",
                "type": "SelectTrigger",
                "props": {
                  "className": "w-full border rounded-md p-2"
                },
                "allowsChildren": true,
                "children": [
                  {
                    "id": "u2pfibguw",
                    "name": "SelectValue",
                    "type": "SelectValue",
                    "props": {
                      "placeholder": "Select specialization"
                    },
                    "allowsChildren": true,
                    "children": [],
                    icon: undefined
                  }
                ],
                icon: undefined
              },
              {
                "id": "pgdply1jv",
                "name": "SelectContent",
                "type": "SelectContent",
                "props": {},
                "allowsChildren": true,
                "children": [
                  {
                    "id": "zfvf6tnh2",
                    "name": "SelectGroup",
                    "type": "SelectGroup",
                    "props": {},
                    "allowsChildren": true,
                    "children": [
                      {
                        "id": "z7d5whl3l",
                        "name": "SelectLabel",
                        "type": "SelectLabel",
                        "props": {},
                        "allowsChildren": true,
                        "children": [
                          {
                            "id": "1727220176515ywq976huv",
                            "name": "Text",
                            "type": "text",
                            "allowsChildren": false,
                            "children": [],
                            "props": {
                              "content": "Specializations"
                            },
                            icon: undefined
                          }
                        ],
                        icon: undefined
                      },
                      {
                        "id": "96hkb1py0",
                        "name": "SelectItem",
                        "type": "SelectItem",
                        "props": {
                          "value": "cardiology"
                        },
                        "allowsChildren": true,
                        "children": [
                          {
                            "id": "1727220176515zx6nexv0a",
                            "name": "Text",
                            "type": "text",
                            "allowsChildren": false,
                            "children": [],
                            "props": {
                              "content": "Cardiology"
                            },
                            icon: undefined
                          }
                        ],
                        icon: undefined
                      },
                      {
                        "id": "hx4slz0og",
                        "name": "SelectItem",
                        "type": "SelectItem",
                        "props": {
                          "value": "neurology"
                        },
                        "allowsChildren": true,
                        "children": [
                          {
                            "id": "1727220176516m5603bukr",
                            "name": "Text",
                            "type": "text",
                            "allowsChildren": false,
                            "children": [],
                            "props": {
                              "content": "Neurology"
                            },
                            icon: undefined
                          }
                        ],
                        icon: undefined
                      },
                      {
                        "id": "5rjg14z2r",
                        "name": "SelectItem",
                        "type": "SelectItem",
                        "props": {
                          "value": "orthopedics"
                        },
                        "allowsChildren": true,
                        "children": [
                          {
                            "id": "1727220176517na38k5smj",
                            "name": "Text",
                            "type": "text",
                            "allowsChildren": false,
                            "children": [],
                            "props": {
                              "content": "Orthopedics"
                            },
                            icon: undefined
                          }
                        ],
                        icon: undefined
                      },
                      {
                        "id": "k7pmm7rlh",
                        "name": "SelectItem",
                        "type": "SelectItem",
                        "props": {
                          "value": "pediatrics"
                        },
                        "allowsChildren": true,
                        "children": [
                          {
                            "id": "17272201765170jk549fvd",
                            "name": "Text",
                            "type": "text",
                            "allowsChildren": false,
                            "children": [],
                            "props": {
                              "content": "Pediatrics"
                            },
                            icon: undefined
                          }
                        ],
                        icon: undefined
                      },
                      {
                        "id": "ujl7d8tkv",
                        "name": "SelectItem",
                        "type": "SelectItem",
                        "props": {
                          "value": "psychiatry"
                        },
                        "allowsChildren": true,
                        "children": [
                          {
                            "id": "1727220176517wolb8juu2",
                            "name": "Text",
                            "type": "text",
                            "allowsChildren": false,
                            "children": [],
                            "props": {
                              "content": "Psychiatry"
                            },
                            icon: undefined
                          }
                        ],
                        icon: undefined
                      }
                    ],
                    icon: undefined
                  }
                ],
                icon: undefined
              }
            ],
            icon: undefined
          },
          {
            "id": "tioatu0wb",
            "name": "div",
            "type": "div",
            "props": {
              "className": "flex flex-wrap gap-2"
            },
            "allowsChildren": true,
            "children": [
              {
                "id": "azs9dlqxm",
                "name": "div",
                "type": "div",
                "props": {
                  "className": "inline-flex items-center px-2.5 py-0.5 rounded-full text-sm font-medium bg-blue-100 text-blue-800"
                },
                "allowsChildren": true,
                "children": [
                  {
                    "id": "1727220176519jj7b9giyz",
                    "name": "Text",
                    "type": "text",
                    "allowsChildren": false,
                    "children": [],
                    "props": {
                      "content": "English"
                    },
                    icon: undefined
                  },
                  {
                    "id": "zlq8dfa9p",
                    "name": "Button",
                    "type": "Button",
                    "props": {
                      "variant": "destructive",
                      "size": "sm",
                      "className": "ml-2 bg-transparent hover:bg-transparent"
                    },
                    "allowsChildren": true,
                    "children": [
                      {
                        "id": "n00rr4q56",
                        "name": "XIcon",
                        "type": "XIcon",
                        "props": {
                          "className": "h-4 w-4 text-blue-800"
                        },
                        "allowsChildren": true,
                        "children": [],
                        icon: undefined
                      }
                    ],
                    icon: undefined
                  }
                ],
                icon: undefined
              },
              {
                "id": "c485g4i07",
                "name": "div",
                "type": "div",
                "props": {
                  "className": "inline-flex items-center px-2.5 py-0.5 rounded-full text-sm font-medium bg-blue-100 text-blue-800"
                },
                "allowsChildren": true,
                "children": [
                  {
                    "id": "1727220176522nskalpe05",
                    "name": "Text",
                    "type": "text",
                    "allowsChildren": false,
                    "children": [],
                    "props": {
                      "content": "Spanish"
                    },
                    icon: undefined
                  },
                  {
                    "id": "ufiawl9ad",
                    "name": "Button",
                    "type": "Button",
                    "props": {
                      "variant": "destructive",
                      "size": "sm",
                      "className": "ml-2 bg-transparent hover:bg-transparent"
                    },
                    "allowsChildren": true,
                    "children": [
                      {
                        "id": "2195lci6m",
                        "name": "XIcon",
                        "type": "XIcon",
                        "props": {
                          "className": "h-4 w-4 text-blue-800"
                        },
                        "allowsChildren": true,
                        "children": [],
                        icon: undefined
                      }
                    ],
                    icon: undefined
                  }
                ],
                icon: undefined
              },
              {
                "id": "1oag4224c",
                "name": "Button",
                "type": "Button",
                "props": {
                  "variant": "outline",
                  "size": "sm"
                },
                "allowsChildren": true,
                "children": [
                  {
                    "id": "1727220176524bzghn8lav",
                    "name": "Text",
                    "type": "text",
                    "allowsChildren": false,
                    "children": [],
                    "props": {
                      "content": "Add Language"
                    },
                    icon: undefined
                  }
                ],
                icon: undefined
              }
            ],
            icon: undefined
          },
          {
            "id": "hduknuwev",
            "name": "Button",
            "type": "Button",
            "props": {
              "type": "submit",
              "className": "mt-4 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-full"
            },
            "allowsChildren": true,
            "children": [
              {
                "id": "17272201765247uol014eq",
                "name": "Text",
                "type": "text",
                "allowsChildren": false,
                "children": [],
                "props": {
                  "content": "Continue"
                },
                icon: undefined
              }
            ],
            icon: undefined
          }
        ],
        icon: undefined
      }
    ],
    icon: undefined
  }
]

const cardProfileSection: TreeItem[] = [
  {
    "id": "sbby4dixn",
    "name": "Card Profile Section",
    "type": "div",
    "props": {
      "className": "flex items-center justify-center h-screen"
    },
    "allowsChildren": true,
    "children": [
      {
        "id": "lajw4jduq",
        "name": "div",
        "type": "div",
        "props": {
          "className": "rounded-lg shadow-lg w-64"
        },
        "allowsChildren": true,
        "children": [
          {
            "id": "46ri13a30",
            "name": "div",
            "type": "div",
            "props": {
              "className": "h-24 bg-blue-600 rounded-t-lg"
            },
            "allowsChildren": true,
            "children": [],
            icon: undefined
          },
          {
            "id": "fed4tujd9",
            "name": "img",
            "type": "img",
            "props": {
              "src": "/placeholder.svg",
              "height": "100",
              "width": "100",
              "className": "rounded-full -mt-12 border-4 border-white mx-auto",
              "alt": "User avatar",
              "style": null
            },
            "allowsChildren": true,
            "children": [],
            icon: undefined
          },
          {
            "id": "unwdtods6",
            "name": "div",
            "type": "div",
            "props": {
              "className": "text-center mt-2"
            },
            "allowsChildren": true,
            "children": [
              {
                "id": "6g8xes373",
                "name": "h2",
                "type": "h2",
                "props": {
                  "className": "text-lg font-semibold"
                },
                "allowsChildren": true,
                "children": [
                  {
                    "id": "17272202345853kpzh4dlw",
                    "name": "Text",
                    "type": "text",
                    "allowsChildren": false,
                    "children": [],
                    "props": {
                      "content": "John Doe"
                    },
                    icon: undefined
                  }
                ],
                icon: undefined
              },
              {
                "id": "oze43zj1z",
                "name": "p",
                "type": "p",
                "props": {
                  "className": "text-gray-500"
                },
                "allowsChildren": true,
                "children": [
                  {
                    "id": "1727220234587htqf6r49s",
                    "name": "Text",
                    "type": "text",
                    "allowsChildren": false,
                    "children": [],
                    "props": {
                      "content": "Software Engineer"
                    },
                    icon: undefined
                  }
                ],
                icon: undefined
              }
            ],
            icon: undefined
          },
          {
            "id": "l9jg1aeo5",
            "name": "div",
            "type": "div",
            "props": {
              "className": "flex justify-around my-4"
            },
            "allowsChildren": true,
            "children": [
              {
                "id": "scnej5xq2",
                "name": "div",
                "type": "div",
                "props": {
                  "className": "text-center"
                },
                "allowsChildren": true,
                "children": [
                  {
                    "id": "19jxabj7b",
                    "name": "h3",
                    "type": "h3",
                    "props": {
                      "className": "font-semibold text-lg"
                    },
                    "allowsChildren": true,
                    "children": [
                      {
                        "id": "1727220234591zzapq3i9w",
                        "name": "Text",
                        "type": "text",
                        "allowsChildren": false,
                        "children": [],
                        "props": {
                          "content": "500"
                        },
                        icon: undefined
                      }
                    ],
                    icon: undefined
                  },
                  {
                    "id": "usp1am3h4",
                    "name": "p",
                    "type": "p",
                    "props": {
                      "className": "text-gray-500"
                    },
                    "allowsChildren": true,
                    "children": [
                      {
                        "id": "1727220234592a708pj3ml",
                        "name": "Text",
                        "type": "text",
                        "allowsChildren": false,
                        "children": [],
                        "props": {
                          "content": "Followers"
                        },
                        icon: undefined
                      }
                    ],
                    icon: undefined
                  }
                ],
                icon: undefined
              },
              {
                "id": "gd9662sl8",
                "name": "div",
                "type": "div",
                "props": {
                  "className": "text-center"
                },
                "allowsChildren": true,
                "children": [
                  {
                    "id": "mcxbtcqbe",
                    "name": "h3",
                    "type": "h3",
                    "props": {
                      "className": "font-semibold text-lg"
                    },
                    "allowsChildren": true,
                    "children": [
                      {
                        "id": "1727220234593i525u0t8z",
                        "name": "Text",
                        "type": "text",
                        "allowsChildren": false,
                        "children": [],
                        "props": {
                          "content": "300"
                        },
                        icon: undefined
                      }
                    ],
                    icon: undefined
                  },
                  {
                    "id": "iiydr141z",
                    "name": "p",
                    "type": "p",
                    "props": {
                      "className": "text-gray-500"
                    },
                    "allowsChildren": true,
                    "children": [
                      {
                        "id": "17272202345946cdq08j30",
                        "name": "Text",
                        "type": "text",
                        "allowsChildren": false,
                        "children": [],
                        "props": {
                          "content": "Following"
                        },
                        icon: undefined
                      }
                    ],
                    icon: undefined
                  }
                ],
                icon: undefined
              }
            ],
            icon: undefined
          },
          {
            "id": "68cb056ld",
            "name": "div",
            "type": "div",
            "props": {
              "className": "px-6 py-4"
            },
            "allowsChildren": true,
            "children": [
              {
                "id": "s8l25r31q",
                "name": "Button",
                "type": "Button",
                "props": {
                  "className": "w-full bg-blue-600 text-white rounded-lg"
                },
                "allowsChildren": true,
                "children": [
                  {
                    "id": "1727220234595i3adtdegv",
                    "name": "Text",
                    "type": "text",
                    "allowsChildren": false,
                    "children": [],
                    "props": {
                      "content": "Follow"
                    },
                    icon: undefined
                  }
                ],
                icon: undefined
              }
            ],
            icon: undefined
          }
        ],
        icon: undefined
      }
    ],
    icon: undefined
  }
]

const cookieSection: TreeItem[] = [
  {
    "id": "i894z0d5k",
    "name": "Cookie Section",
    "type": "Card",
    "props": {
      "key": "1",
      "className": "w-full max-w-lg"
    },
    "allowsChildren": true,
    "children": [
      {
        "id": "zfkm6hqiy",
        "name": "CardHeader",
        "type": "CardHeader",
        "props": {
          "className": "border-b border-dark-gray-300 pb-4"
        },
        "allowsChildren": true,
        "children": [
          {
            "id": "0b52l7cdj",
            "name": "div",
            "type": "div",
            "props": {
              "className": "flex items-center"
            },
            "allowsChildren": true,
            "children": [
              {
                "id": "faktibyij",
                "name": "CookieIcon",
                "type": "CookieIcon",
                "props": {
                  "className": "mr-2"
                },
                "allowsChildren": true,
                "children": [],
                icon: undefined
              },
              {
                "id": "jjchvbhaz",
                "name": "CardTitle",
                "type": "CardTitle",
                "props": {},
                "allowsChildren": true,
                "children": [
                  {
                    "id": "1727220300725j3j8e17bo",
                    "name": "Text",
                    "type": "text",
                    "allowsChildren": false,
                    "children": [],
                    "props": {
                      "content": "Cookie Preferences"
                    },
                    icon: undefined
                  }
                ],
                icon: undefined
              }
            ],
            icon: undefined
          },
          {
            "id": "3bq9oslqp",
            "name": "CardDescription",
            "type": "CardDescription",
            "props": {},
            "allowsChildren": true,
            "children": [
              {
                "id": "1727220300726mpjdbaoj6",
                "name": "Text",
                "type": "text",
                "allowsChildren": false,
                "children": [],
                "props": {
                  "content": "Manage your cookie settings. You can enable or disable different types of cookies below."
                },
                icon: undefined
              }
            ],
            icon: undefined
          }
        ],
        icon: undefined
      },
      {
        "id": "wkndbqbd8",
        "name": "CardContent",
        "type": "CardContent",
        "props": {
          "className": "space-y-4 pt-4"
        },
        "allowsChildren": true,
        "children": [
          {
            "id": "76ued9hax",
            "name": "div",
            "type": "div",
            "props": {
              "className": "flex justify-between items-start space-y-2"
            },
            "allowsChildren": true,
            "children": [
              {
                "id": "70g8q5sxy",
                "name": "div",
                "type": "div",
                "props": {},
                "allowsChildren": true,
                "children": [
                  {
                    "id": "emqqjp4d3",
                    "name": "Label",
                    "type": "Label",
                    "props": {
                      "htmlFor": "essential"
                    },
                    "allowsChildren": true,
                    "children": [
                      {
                        "id": "1727220300735jdwpri4s6",
                        "name": "Text",
                        "type": "text",
                        "allowsChildren": false,
                        "children": [],
                        "props": {
                          "content": "Essential Cookies"
                        },
                        icon: undefined
                      }
                    ],
                    icon: undefined
                  },
                  {
                    "id": "ftglnoert",
                    "name": "p",
                    "type": "p",
                    "props": {
                      "className": "text-dark-gray-500 text-sm"
                    },
                    "allowsChildren": true,
                    "children": [
                      {
                        "id": "1727220300736t1i03mq6r",
                        "name": "Text",
                        "type": "text",
                        "allowsChildren": false,
                        "children": [],
                        "props": {
                          "content": "These cookies are necessary for the website to function and cannot be switched off."
                        },
                        icon: undefined
                      }
                    ],
                    icon: undefined
                  }
                ],
                icon: undefined
              },
              {
                "id": "y6kte6o7t",
                "name": "Switch",
                "type": "Switch",
                "props": {
                  "className": "ml-auto",
                  "id": "essential"
                },
                "allowsChildren": true,
                "children": [],
                icon: undefined
              }
            ],
            icon: undefined
          },
          {
            "id": "ci4b0yihz",
            "name": "div",
            "type": "div",
            "props": {
              "className": "flex justify-between items-start space-y-2"
            },
            "allowsChildren": true,
            "children": [
              {
                "id": "15idlfkfz",
                "name": "div",
                "type": "div",
                "props": {},
                "allowsChildren": true,
                "children": [
                  {
                    "id": "vf8p7a63r",
                    "name": "Label",
                    "type": "Label",
                    "props": {
                      "htmlFor": "analytics"
                    },
                    "allowsChildren": true,
                    "children": [
                      {
                        "id": "17272203007404q89n3rk8",
                        "name": "Text",
                        "type": "text",
                        "allowsChildren": false,
                        "children": [],
                        "props": {
                          "content": "Analytics Cookies"
                        },
                        icon: undefined
                      }
                    ],
                    icon: undefined
                  },
                  {
                    "id": "rq3ulxy4k",
                    "name": "p",
                    "type": "p",
                    "props": {
                      "className": "text-dark-gray-500 text-sm"
                    },
                    "allowsChildren": true,
                    "children": [
                      {
                        "id": "1727220300740on36oq1ml",
                        "name": "Text",
                        "type": "text",
                        "allowsChildren": false,
                        "children": [],
                        "props": {
                          "content": "These cookies allow us to count visits and traffic sources, so we can measure and improve the performance\n              of our site."
                        },
                        icon: undefined
                      }
                    ],
                    icon: undefined
                  }
                ],
                icon: undefined
              },
              {
                "id": "0xtkpu3xx",
                "name": "Switch",
                "type": "Switch",
                "props": {
                  "className": "ml-auto",
                  "id": "analytics"
                },
                "allowsChildren": true,
                "children": [],
                icon: undefined
              }
            ],
            icon: undefined
          },
          {
            "id": "ftcqk4tx0",
            "name": "div",
            "type": "div",
            "props": {
              "className": "flex justify-between items-start space-y-2"
            },
            "allowsChildren": true,
            "children": [
              {
                "id": "56pcbeo86",
                "name": "div",
                "type": "div",
                "props": {},
                "allowsChildren": true,
                "children": [
                  {
                    "id": "vq9aq236i",
                    "name": "Label",
                    "type": "Label",
                    "props": {
                      "htmlFor": "marketing"
                    },
                    "allowsChildren": true,
                    "children": [
                      {
                        "id": "1727220300742uub4l5y4u",
                        "name": "Text",
                        "type": "text",
                        "allowsChildren": false,
                        "children": [],
                        "props": {
                          "content": "Marketing Cookies"
                        },
                        icon: undefined
                      }
                    ],
                    icon: undefined
                  },
                  {
                    "id": "so8wuuym8",
                    "name": "p",
                    "type": "p",
                    "props": {
                      "className": "text-dark-gray-500 text-sm"
                    },
                    "allowsChildren": true,
                    "children": [
                      {
                        "id": "1727220300742xpe8wui0g",
                        "name": "Text",
                        "type": "text",
                        "allowsChildren": false,
                        "children": [],
                        "props": {
                          "content": "These cookies help us show you relevant ads."
                        },
                        icon: undefined
                      }
                    ],
                    icon: undefined
                  }
                ],
                icon: undefined
              },
              {
                "id": "ojeqh6ho9",
                "name": "Switch",
                "type": "Switch",
                "props": {
                  "className": "ml-auto",
                  "id": "marketing"
                },
                "allowsChildren": true,
                "children": [],
                icon: undefined
              }
            ],
            icon: undefined
          }
        ],
        icon: undefined
      },
      {
        "id": "tg7xrz0or",
        "name": "div",
        "type": "div",
        "props": {
          "className": "border-t border-dark-gray-300 mt-4"
        },
        "allowsChildren": true,
        "children": [],
        icon: undefined
      },
      {
        "id": "tjg2383ng",
        "name": "CardFooter",
        "type": "CardFooter",
        "props": {},
        "allowsChildren": true,
        "children": [
          {
            "id": "353b97q6d",
            "name": "Button",
            "type": "Button",
            "props": {
              "className": "ml-auto",
              "type": "submit"
            },
            "allowsChildren": true,
            "children": [
              {
                "id": "172722030074407acp603k",
                "name": "Text",
                "type": "text",
                "allowsChildren": false,
                "children": [],
                "props": {
                  "content": "Save Preferences"
                },
                icon: undefined
              }
            ],
            icon: undefined
          }
        ],
        icon: undefined
      }
    ],
    icon: undefined
  }
]

const faqSection3: TreeItem[] = [
  {
    "id": "0o62zo0mw",
    "name": "FAQ Section3",
    "type": "div",
    "props": {
      "className": "flex justify-center items-center min-h-screen"
    },
    "allowsChildren": true,
    "children": [
      {
        "id": "jq6agskyb",
        "name": "Card",
        "type": "Card",
        "props": {
          "className": "shadow-lg w-[550px]"
        },
        "allowsChildren": true,
        "children": [
          {
            "id": "u6l6ntvfr",
            "name": "CardContent",
            "type": "CardContent",
            "props": {
              "className": "p-6"
            },
            "allowsChildren": true,
            "children": [
              {
                "id": "np4z9gkdl",
                "name": "h2",
                "type": "h2",
                "props": {
                  "className": "text-2xl font-semibold"
                },
                "allowsChildren": true,
                "children": [
                  {
                    "id": "17272203660910q8lox8nl",
                    "name": "Text",
                    "type": "text",
                    "allowsChildren": false,
                    "children": [],
                    "props": {
                      "content": "Frequently Asked Questions"
                    },
                    icon: undefined
                  }
                ],
                icon: undefined
              },
              {
                "id": "p8b5fnmyi",
                "name": "Accordion",
                "type": "Accordion",
                "props": {
                  "className": "w-full mt-4",
                  "collapsible": "",
                  "type": "multiple"
                },
                "allowsChildren": true,
                "children": [
                  {
                    "id": "or9eu1r03",
                    "name": "AccordionItem",
                    "type": "AccordionItem",
                    "props": {
                      "value": "item-1"
                    },
                    "allowsChildren": true,
                    "children": [
                      {
                        "id": "bxv7smznh",
                        "name": "AccordionTrigger",
                        "type": "AccordionTrigger",
                        "props": {
                          "className": "hover:underline-none"
                        },
                        "allowsChildren": true,
                        "children": [
                          {
                            "id": "1727220366096txxgfvjdj",
                            "name": "Text",
                            "type": "text",
                            "allowsChildren": false,
                            "children": [],
                            "props": {
                              "content": "Why does turning my device off and on again solve all issues?"
                            },
                            icon: undefined
                          }
                        ],
                        icon: undefined
                      },
                      {
                        "id": "xnk4phb54",
                        "name": "AccordionContent",
                        "type": "AccordionContent",
                        "props": {},
                        "allowsChildren": true,
                        "children": [
                          {
                            "id": "1727220366096hx3a3g73w",
                            "name": "Text",
                            "type": "text",
                            "allowsChildren": false,
                            "children": [],
                            "props": {
                              "content": "Because it clears the memory and starts the system from scratch."
                            },
                            icon: undefined
                          }
                        ],
                        icon: undefined
                      }
                    ],
                    icon: undefined
                  },
                  {
                    "id": "qbgoa1eg2",
                    "name": "AccordionItem",
                    "type": "AccordionItem",
                    "props": {
                      "value": "item-2"
                    },
                    "allowsChildren": true,
                    "children": [
                      {
                        "id": "ho8xwqghu",
                        "name": "AccordionTrigger",
                        "type": "AccordionTrigger",
                        "props": {
                          "className": "hover:underline-none"
                        },
                        "allowsChildren": true,
                        "children": [
                          {
                            "id": "1727220366098g0exrfure",
                            "name": "Text",
                            "type": "text",
                            "allowsChildren": false,
                            "children": [],
                            "props": {
                              "content": "Are extra cables in the box bonus decorations?"
                            },
                            icon: undefined
                          }
                        ],
                        icon: undefined
                      },
                      {
                        "id": "0k3solumr",
                        "name": "AccordionContent",
                        "type": "AccordionContent",
                        "props": {},
                        "allowsChildren": true,
                        "children": [
                          {
                            "id": "17272203660992gkubn49m",
                            "name": "Text",
                            "type": "text",
                            "allowsChildren": false,
                            "children": [],
                            "props": {
                              "content": "As tempting as it is to weave them into artistic sculptures, those cables are essential for connecting,\n                charging, and beaming digital magic."
                            },
                            icon: undefined
                          }
                        ],
                        icon: undefined
                      }
                    ],
                    icon: undefined
                  },
                  {
                    "id": "pnmllxwgv",
                    "name": "AccordionItem",
                    "type": "AccordionItem",
                    "props": {
                      "value": "item-3"
                    },
                    "allowsChildren": true,
                    "children": [
                      {
                        "id": "8cznpu667",
                        "name": "AccordionTrigger",
                        "type": "AccordionTrigger",
                        "props": {
                          "className": "hover:underline-none"
                        },
                        "allowsChildren": true,
                        "children": [
                          {
                            "id": "17272203661006lnd3ie5t",
                            "name": "Text",
                            "type": "text",
                            "allowsChildren": false,
                            "children": [],
                            "props": {
                              "content": "Can I wear my VR headset to my cousin's wedding?"
                            },
                            icon: undefined
                          }
                        ],
                        icon: undefined
                      },
                      {
                        "id": "go0p7b0dz",
                        "name": "AccordionContent",
                        "type": "AccordionContent",
                        "props": {},
                        "allowsChildren": true,
                        "children": [
                          {
                            "id": "1727220366100yd4tstyma",
                            "name": "Text",
                            "type": "text",
                            "allowsChildren": false,
                            "children": [],
                            "props": {
                              "content": "Yes but you might end up inadvertently dodging invisible dance partners or trying to high-five digital\n                confetti."
                            },
                            icon: undefined
                          }
                        ],
                        icon: undefined
                      }
                    ],
                    icon: undefined
                  },
                  {
                    "id": "cnz46wp1b",
                    "name": "AccordionItem",
                    "type": "AccordionItem",
                    "props": {
                      "value": "item-4"
                    },
                    "allowsChildren": true,
                    "children": [
                      {
                        "id": "w7dk1yvan",
                        "name": "AccordionTrigger",
                        "type": "AccordionTrigger",
                        "props": {
                          "className": "hover:underline-none"
                        },
                        "allowsChildren": true,
                        "children": [
                          {
                            "id": "1727220366101xst5fwb5o",
                            "name": "Text",
                            "type": "text",
                            "allowsChildren": false,
                            "children": [],
                            "props": {
                              "content": "How often should I update my software?"
                            },
                            icon: undefined
                          }
                        ],
                        icon: undefined
                      },
                      {
                        "id": "czj3j9mll",
                        "name": "AccordionContent",
                        "type": "AccordionContent",
                        "props": {},
                        "allowsChildren": true,
                        "children": [
                          {
                            "id": "1727220366101y00rzw4ro",
                            "name": "Text",
                            "type": "text",
                            "allowsChildren": false,
                            "children": [],
                            "props": {
                              "content": "It's recommended to keep your software up to date to ensure you have the latest security patches and\n                features."
                            },
                            icon: undefined
                          }
                        ],
                        icon: undefined
                      }
                    ],
                    icon: undefined
                  },
                  {
                    "id": "vrtfcajcw",
                    "name": "AccordionItem",
                    "type": "AccordionItem",
                    "props": {
                      "className": "border-b-0",
                      "value": "item-5"
                    },
                    "allowsChildren": true,
                    "children": [
                      {
                        "id": "5qmjn9wwr",
                        "name": "AccordionTrigger",
                        "type": "AccordionTrigger",
                        "props": {
                          "className": "hover:underline-none"
                        },
                        "allowsChildren": true,
                        "children": [
                          {
                            "id": "17272203661021k5ao3q9x",
                            "name": "Text",
                            "type": "text",
                            "allowsChildren": false,
                            "children": [],
                            "props": {
                              "content": "Why does my device get hot when I'm using it?"
                            },
                            icon: undefined
                          }
                        ],
                        icon: undefined
                      },
                      {
                        "id": "s9pchgzc5",
                        "name": "AccordionContent",
                        "type": "AccordionContent",
                        "props": {},
                        "allowsChildren": true,
                        "children": [
                          {
                            "id": "172722036610341gtw6vct",
                            "name": "Text",
                            "type": "text",
                            "allowsChildren": false,
                            "children": [],
                            "props": {
                              "content": "Devices can generate heat during operation, especially when running intensive tasks. This is normal, but\n                if it gets too hot, it may indicate a problem."
                            },
                            icon: undefined
                          }
                        ],
                        icon: undefined
                      }
                    ],
                    icon: undefined
                  }
                ],
                icon: undefined
              }
            ],
            icon: undefined
          }
        ],
        icon: undefined
      }
    ],
    icon: undefined
  }
]

const tweetSection: TreeItem[] = [
  {
    "id": "y4xsv1kg0",
    "name": "Tweet Section",
    "type": "div",
    "props": {
      "className": "w-full max-w-md bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden mx-auto my-10"
    },
    "allowsChildren": true,
    "children": [
      {
        "id": "bp2t9j9mc",
        "name": "div",
        "type": "div",
        "props": {
          "className": "flex justify-between items-center px-6 py-4"
        },
        "allowsChildren": true,
        "children": [
          {
            "id": "a110cibt0",
            "name": "div",
            "type": "div",
            "props": {
              "className": "flex space-x-4"
            },
            "allowsChildren": true,
            "children": [
              {
                "id": "qanognw7z",
                "name": "div",
                "type": "div",
                "props": {},
                "allowsChildren": true,
                "children": [
                  {
                    "id": "f3bozu683",
                    "name": "img",
                    "type": "img",
                    "props": {
                      "alt": "Profile",
                      "className": "rounded-full",
                      "height": "48",
                      "src": "/placeholder.svg",
                      "width": "48",
                      "style": null
                    },
                    "allowsChildren": true,
                    "children": [],
                    icon: undefined
                  }
                ],
                icon: undefined
              },
              {
                "id": "se7o749rr",
                "name": "div",
                "type": "div",
                "props": {},
                "allowsChildren": true,
                "children": [
                  {
                    "id": "xl96xsinb",
                    "name": "div",
                    "type": "div",
                    "props": {
                      "className": "text-lg font-bold dark:text-white"
                    },
                    "allowsChildren": true,
                    "children": [
                      {
                        "id": "17272204281209btdw11jp",
                        "name": "Text",
                        "type": "text",
                        "allowsChildren": false,
                        "children": [],
                        "props": {
                          "content": "John Doe"
                        },
                        icon: undefined
                      }
                    ],
                    icon: undefined
                  },
                  {
                    "id": "o9tshq541",
                    "name": "div",
                    "type": "div",
                    "props": {
                      "className": "text-sm text-gray-500 dark:text-gray-200"
                    },
                    "allowsChildren": true,
                    "children": [
                      {
                        "id": "1727220428120q313l8mnn",
                        "name": "Text",
                        "type": "text",
                        "allowsChildren": false,
                        "children": [],
                        "props": {
                          "content": "@johndoe"
                        },
                        icon: undefined
                      }
                    ],
                    icon: undefined
                  }
                ],
                icon: undefined
              }
            ],
            icon: undefined
          },
          {
            "id": "h8s055yw4",
            "name": "div",
            "type": "div",
            "props": {},
            "allowsChildren": true,
            "children": [
              {
                "id": "2f0n12ixd",
                "name": "Select",
                "type": "Select",
                "props": {
                  "className": "w-6 h-6 text-gray-500 dark:text-gray-200"
                },
                "allowsChildren": true,
                "children": [
                  {
                    "id": "pj9ajsgsr",
                    "name": "SelectTrigger",
                    "type": "SelectTrigger",
                    "props": {
                      "aria-label": "Options"
                    },
                    "allowsChildren": true,
                    "children": [
                      {
                        "id": "0w7xajhec",
                        "name": "svg",
                        "type": "svg",
                        "props": {
                          "className": " w-6 h-6 text-gray-500 dark:text-gray-200",
                          "fill": "none",
                          "height": "24",
                          "stroke": "currentColor",
                          "strokeLinecap": "round",
                          "strokeLinejoin": "round",
                          "strokeWidth": "2",
                          "viewBox": "0 0 24 24",
                          "width": "24",
                          "xmlns": "http://www.w3.org/2000/svg"
                        },
                        "allowsChildren": true,
                        "children": [
                          {
                            "id": "hjtxxgnsj",
                            "name": "circle",
                            "type": "circle",
                            "props": {
                              "cx": "12",
                              "cy": "12",
                              "r": "1"
                            },
                            "allowsChildren": true,
                            "children": [],
                            icon: undefined
                          },
                          {
                            "id": "26h2ddxfa",
                            "name": "circle",
                            "type": "circle",
                            "props": {
                              "cx": "19",
                              "cy": "12",
                              "r": "1"
                            },
                            "allowsChildren": true,
                            "children": [],
                            icon: undefined
                          },
                          {
                            "id": "e3377sriq",
                            "name": "circle",
                            "type": "circle",
                            "props": {
                              "cx": "5",
                              "cy": "12",
                              "r": "1"
                            },
                            "allowsChildren": true,
                            "children": [],
                            icon: undefined
                          }
                        ],
                        icon: undefined
                      }
                    ],
                    icon: undefined
                  },
                  {
                    "id": "en8hmxsf7",
                    "name": "SelectContent",
                    "type": "SelectContent",
                    "props": {},
                    "allowsChildren": true,
                    "children": [
                      {
                        "id": "993d3jh7q",
                        "name": "SelectItem",
                        "type": "SelectItem",
                        "props": {
                          "value": "delete"
                        },
                        "allowsChildren": true,
                        "children": [
                          {
                            "id": "1727220428136odtndikgr",
                            "name": "Text",
                            "type": "text",
                            "allowsChildren": false,
                            "children": [],
                            "props": {
                              "content": "Delete tweet"
                            },
                            icon: undefined
                          }
                        ],
                        icon: undefined
                      }
                    ],
                    icon: undefined
                  }
                ],
                icon: undefined
              }
            ],
            icon: undefined
          }
        ],
        icon: undefined
      },
      {
        "id": "cs03b3gk6",
        "name": "div",
        "type": "div",
        "props": {
          "className": "px-6 py-4"
        },
        "allowsChildren": true,
        "children": [
          {
            "id": "f73k4xja1",
            "name": "div",
            "type": "div",
            "props": {
              "className": "text-sm text-gray-800 dark:text-gray-200"
            },
            "allowsChildren": true,
            "children": [
              {
                "id": "1727220428137jt79z6txb",
                "name": "Text",
                "type": "text",
                "allowsChildren": false,
                "children": [],
                "props": {
                  "content": "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Maecenas pellentesque id erat at blandit. Donec\n          ullamcorper turpis vitae dolor lacinia mollis. Donec at augue eget ipsum porttitor interdum."
                },
                icon: undefined
              }
            ],
            icon: undefined
          }
        ],
        icon: undefined
      },
      {
        "id": "gult6pxal",
        "name": "div",
        "type": "div",
        "props": {
          "className": "flex justify-between items-center space-x-4 pt-4 border-t border-gray-200 dark:border-gray-700 p-4"
        },
        "allowsChildren": true,
        "children": [
          {
            "id": "pczincnpk",
            "name": "div",
            "type": "div",
            "props": {
              "className": "flex items-center space-x-4"
            },
            "allowsChildren": true,
            "children": [
              {
                "id": "uk8snyf07",
                "name": "svg",
                "type": "svg",
                "props": {
                  "className": " h-4 w-4 text-gray-500 dark:text-gray-200",
                  "fill": "none",
                  "height": "24",
                  "stroke": "currentColor",
                  "strokeLinecap": "round",
                  "strokeLinejoin": "round",
                  "strokeWidth": "2",
                  "viewBox": "0 0 24 24",
                  "width": "24",
                  "xmlns": "http://www.w3.org/2000/svg"
                },
                "allowsChildren": true,
                "children": [
                  {
                    "id": "chj0sg7im",
                    "name": "path",
                    "type": "path",
                    "props": {
                      "d": "M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 8"
                    },
                    "allowsChildren": true,
                    "children": [],
                    icon: undefined
                  },
                  {
                    "id": "ktbuzv56c",
                    "name": "path",
                    "type": "path",
                    "props": {
                      "d": "M21 3v5h-5"
                    },
                    "allowsChildren": true,
                    "children": [],
                    icon: undefined
                  },
                  {
                    "id": "qd2zgg5f5",
                    "name": "path",
                    "type": "path",
                    "props": {
                      "d": "M21 12a9 9 0 0 1-9 9 9.75 9.75 0 0 1-6.74-2.74L3 16"
                    },
                    "allowsChildren": true,
                    "children": [],
                    icon: undefined
                  },
                  {
                    "id": "sjdl2i59k",
                    "name": "path",
                    "type": "path",
                    "props": {
                      "d": "M8 16H3v5"
                    },
                    "allowsChildren": true,
                    "children": [],
                    icon: undefined
                  }
                ],
                icon: undefined
              },
              {
                "id": "shmly4llk",
                "name": "svg",
                "type": "svg",
                "props": {
                  "className": " h-4 w-4 text-gray-500 dark:text-gray-200",
                  "fill": "none",
                  "height": "24",
                  "stroke": "currentColor",
                  "strokeLinecap": "round",
                  "strokeLinejoin": "round",
                  "strokeWidth": "2",
                  "viewBox": "0 0 24 24",
                  "width": "24",
                  "xmlns": "http://www.w3.org/2000/svg"
                },
                "allowsChildren": true,
                "children": [
                  {
                    "id": "o48lhtcmb",
                    "name": "path",
                    "type": "path",
                    "props": {
                      "d": "M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"
                    },
                    "allowsChildren": true,
                    "children": [],
                    icon: undefined
                  }
                ],
                icon: undefined
              },
              {
                "id": "n84yswvyh",
                "name": "svg",
                "type": "svg",
                "props": {
                  "className": " h-4 w-4 text-gray-500 dark:text-gray-200",
                  "fill": "none",
                  "height": "24",
                  "stroke": "currentColor",
                  "strokeLinecap": "round",
                  "strokeLinejoin": "round",
                  "strokeWidth": "2",
                  "viewBox": "0 0 24 24",
                  "width": "24",
                  "xmlns": "http://www.w3.org/2000/svg"
                },
                "allowsChildren": true,
                "children": [
                  {
                    "id": "xiqgem3nv",
                    "name": "path",
                    "type": "path",
                    "props": {
                      "d": "M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"
                    },
                    "allowsChildren": true,
                    "children": [],
                    icon: undefined
                  },
                  {
                    "id": "hfscdpnei",
                    "name": "polyline",
                    "type": "polyline",
                    "props": {
                      "points": "17 8 12 3 7 8"
                    },
                    "allowsChildren": true,
                    "children": [],
                    icon: undefined
                  },
                  {
                    "id": "zy5ri8d64",
                    "name": "line",
                    "type": "line",
                    "props": {
                      "x1": "12",
                      "x2": "12",
                      "y1": "3",
                      "y2": "15"
                    },
                    "allowsChildren": true,
                    "children": [],
                    icon: undefined
                  }
                ],
                icon: undefined
              }
            ],
            icon: undefined
          },
          {
            "id": "f5adugxm1",
            "name": "div",
            "type": "div",
            "props": {
              "className": "flex items-center space-x-4"
            },
            "allowsChildren": true,
            "children": [
              {
                "id": "7i4eh1du8",
                "name": "svg",
                "type": "svg",
                "props": {
                  "className": " h-4 w-4 text-gray-500 dark:text-gray-200",
                  "fill": "none",
                  "height": "24",
                  "stroke": "currentColor",
                  "strokeLinecap": "round",
                  "strokeLinejoin": "round",
                  "strokeWidth": "2",
                  "viewBox": "0 0 24 24",
                  "width": "24",
                  "xmlns": "http://www.w3.org/2000/svg"
                },
                "allowsChildren": true,
                "children": [
                  {
                    "id": "3xd6jdyeb",
                    "name": "circle",
                    "type": "circle",
                    "props": {
                      "cx": "12",
                      "cy": "12",
                      "r": "1"
                    },
                    "allowsChildren": true,
                    "children": [],
                    icon: undefined
                  },
                  {
                    "id": "g4agb97t1",
                    "name": "circle",
                    "type": "circle",
                    "props": {
                      "cx": "19",
                      "cy": "12",
                      "r": "1"
                    },
                    "allowsChildren": true,
                    "children": [],
                    icon: undefined
                  },
                  {
                    "id": "uam5c7zbj",
                    "name": "circle",
                    "type": "circle",
                    "props": {
                      "cx": "5",
                      "cy": "12",
                      "r": "1"
                    },
                    "allowsChildren": true,
                    "children": [],
                    icon: undefined
                  }
                ],
                icon: undefined
              },
              {
                "id": "g92miluth",
                "name": "svg",
                "type": "svg",
                "props": {
                  "className": " h-4 w-4 text-gray-500 dark:text-gray-200",
                  "fill": "none",
                  "height": "24",
                  "stroke": "currentColor",
                  "strokeLinecap": "round",
                  "strokeLinejoin": "round",
                  "strokeWidth": "2",
                  "viewBox": "0 0 24 24",
                  "width": "24",
                  "xmlns": "http://www.w3.org/2000/svg"
                },
                "allowsChildren": true,
                "children": [
                  {
                    "id": "0r4f8onwp",
                    "name": "path",
                    "type": "path",
                    "props": {
                      "d": "m19 21-7-4-7 4V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v16z"
                    },
                    "allowsChildren": true,
                    "children": [],
                    icon: undefined
                  }
                ],
                icon: undefined
              }
            ],
            icon: undefined
          }
        ],
        icon: undefined
      }
    ],
    icon: undefined
  }
]

const contactUsSection: TreeItem[] = [
  {
    "id": "tv97hn6q5",
    "name": "ContactUs Section",
    "type": "div",
    "props": {
      "className": "flex items-center justify-center h-screen bg-green-500"
    },
    "allowsChildren": true,
    "children": [
      {
        "id": "bgihrorvk",
        "name": "Card",
        "type": "Card",
        "props": {},
        "allowsChildren": true,
        "children": [
          {
            "id": "0dn5d2gn4",
            "name": "CardContent",
            "type": "CardContent",
            "props": {},
            "allowsChildren": true,
            "children": [
              {
                "id": "2zc8kx4p2",
                "name": "div",
                "type": "div",
                "props": {
                  "className": "space-y-8"
                },
                "allowsChildren": true,
                "children": [
                  {
                    "id": "5h2trzqtt",
                    "name": "div",
                    "type": "div",
                    "props": {
                      "className": "space-y-2"
                    },
                    "allowsChildren": true,
                    "children": [
                      {
                        "id": "oqv84akan",
                        "name": "h2",
                        "type": "h2",
                        "props": {
                          "className": "text-3xl font-semibold"
                        },
                        "allowsChildren": true,
                        "children": [
                          {
                            "id": "1727220647897x7d9s2u23",
                            "name": "Text",
                            "type": "text",
                            "allowsChildren": false,
                            "children": [],
                            "props": {
                              "content": "Contact Us"
                            },
                            icon: undefined
                          }
                        ],
                        icon: undefined
                      },
                      {
                        "id": "3up87bbyc",
                        "name": "p",
                        "type": "p",
                        "props": {
                          "className": "text-zinc-500 dark:text-zinc-400"
                        },
                        "allowsChildren": true,
                        "children": [
                          {
                            "id": "17272206478984p7pd3q6q",
                            "name": "Text",
                            "type": "text",
                            "allowsChildren": false,
                            "children": [],
                            "props": {
                              "content": "Fill out the form below and we'll get back to you as soon as possible."
                            },
                            icon: undefined
                          }
                        ],
                        icon: undefined
                      }
                    ],
                    icon: undefined
                  },
                  {
                    "id": "tybxt8ix8",
                    "name": "div",
                    "type": "div",
                    "props": {
                      "className": "space-y-4"
                    },
                    "allowsChildren": true,
                    "children": [
                      {
                        "id": "1nt1wr5ml",
                        "name": "div",
                        "type": "div",
                        "props": {
                          "className": "grid grid-cols-2 gap-4"
                        },
                        "allowsChildren": true,
                        "children": [
                          {
                            "id": "fjv0un6wr",
                            "name": "div",
                            "type": "div",
                            "props": {
                              "className": "space-y-2"
                            },
                            "allowsChildren": true,
                            "children": [
                              {
                                "id": "lagy75lpi",
                                "name": "Label",
                                "type": "Label",
                                "props": {
                                  "htmlFor": "first-name"
                                },
                                "allowsChildren": true,
                                "children": [
                                  {
                                    "id": "172722064790386h7jtmsw",
                                    "name": "Text",
                                    "type": "text",
                                    "allowsChildren": false,
                                    "children": [],
                                    "props": {
                                      "content": "First name"
                                    },
                                    icon: undefined
                                  }
                                ],
                                icon: undefined
                              },
                              {
                                "id": "wmo6pxku9",
                                "name": "Input",
                                "type": "Input",
                                "props": {
                                  "id": "first-name",
                                  "placeholder": "Enter your first name"
                                },
                                "allowsChildren": true,
                                "children": [],
                                icon: undefined
                              }
                            ],
                            icon: undefined
                          },
                          {
                            "id": "f87enhb3m",
                            "name": "div",
                            "type": "div",
                            "props": {
                              "className": "space-y-2"
                            },
                            "allowsChildren": true,
                            "children": [
                              {
                                "id": "xcmsagh1z",
                                "name": "Label",
                                "type": "Label",
                                "props": {
                                  "htmlFor": "last-name"
                                },
                                "allowsChildren": true,
                                "children": [
                                  {
                                    "id": "1727220647904xeuezqssh",
                                    "name": "Text",
                                    "type": "text",
                                    "allowsChildren": false,
                                    "children": [],
                                    "props": {
                                      "content": "Last name"
                                    },
                                    icon: undefined
                                  }
                                ],
                                icon: undefined
                              },
                              {
                                "id": "t7xnlu37z",
                                "name": "Input",
                                "type": "Input",
                                "props": {
                                  "id": "last-name",
                                  "placeholder": "Enter your last name"
                                },
                                "allowsChildren": true,
                                "children": [],
                                icon: undefined
                              }
                            ],
                            icon: undefined
                          }
                        ],
                        icon: undefined
                      },
                      {
                        "id": "w07titvun",
                        "name": "div",
                        "type": "div",
                        "props": {
                          "className": "space-y-2"
                        },
                        "allowsChildren": true,
                        "children": [
                          {
                            "id": "ieyfbvxay",
                            "name": "Label",
                            "type": "Label",
                            "props": {
                              "htmlFor": "email"
                            },
                            "allowsChildren": true,
                            "children": [
                              {
                                "id": "1727220647906zv90ekqnx",
                                "name": "Text",
                                "type": "text",
                                "allowsChildren": false,
                                "children": [],
                                "props": {
                                  "content": "Email"
                                },
                                icon: undefined
                              }
                            ],
                            icon: undefined
                          },
                          {
                            "id": "92feqihhz",
                            "name": "Input",
                            "type": "Input",
                            "props": {
                              "id": "email",
                              "placeholder": "Enter your email",
                              "type": "email"
                            },
                            "allowsChildren": true,
                            "children": [],
                            icon: undefined
                          }
                        ],
                        icon: undefined
                      },
                      {
                        "id": "44l5wup1s",
                        "name": "div",
                        "type": "div",
                        "props": {
                          "className": "space-y-2"
                        },
                        "allowsChildren": true,
                        "children": [
                          {
                            "id": "3pot474qz",
                            "name": "Label",
                            "type": "Label",
                            "props": {},
                            "allowsChildren": true,
                            "children": [
                              {
                                "id": "1727220647908gg9i9njyc",
                                "name": "Text",
                                "type": "text",
                                "allowsChildren": false,
                                "children": [],
                                "props": {
                                  "content": "Pronoun"
                                },
                                icon: undefined
                              }
                            ],
                            icon: undefined
                          },
                          {
                            "id": "2ljk1ydyl",
                            "name": "Select",
                            "type": "Select",
                            "props": {},
                            "allowsChildren": true,
                            "children": [
                              {
                                "id": "qo8mdpmtc",
                                "name": "SelectTrigger",
                                "type": "SelectTrigger",
                                "props": {
                                  "aria-label": "Pronoun"
                                },
                                "allowsChildren": true,
                                "children": [
                                  {
                                    "id": "c4lkpssxh",
                                    "name": "SelectValue",
                                    "type": "SelectValue",
                                    "props": {
                                      "placeholder": "Select your pronoun"
                                    },
                                    "allowsChildren": true,
                                    "children": [],
                                    icon: undefined
                                  }
                                ],
                                icon: undefined
                              },
                              {
                                "id": "iu7gv8igi",
                                "name": "SelectContent",
                                "type": "SelectContent",
                                "props": {},
                                "allowsChildren": true,
                                "children": [
                                  {
                                    "id": "utf170w9d",
                                    "name": "SelectGroup",
                                    "type": "SelectGroup",
                                    "props": {},
                                    "allowsChildren": true,
                                    "children": [
                                      {
                                        "id": "lvi9etruj",
                                        "name": "SelectLabel",
                                        "type": "SelectLabel",
                                        "props": {},
                                        "allowsChildren": true,
                                        "children": [
                                          {
                                            "id": "1727220647912qduz6x97r",
                                            "name": "Text",
                                            "type": "text",
                                            "allowsChildren": false,
                                            "children": [],
                                            "props": {
                                              "content": "Pronouns"
                                            },
                                            icon: undefined
                                          }
                                        ],
                                        icon: undefined
                                      },
                                      {
                                        "id": "a4tm5q3fi",
                                        "name": "SelectItem",
                                        "type": "SelectItem",
                                        "props": {
                                          "value": "he/him"
                                        },
                                        "allowsChildren": true,
                                        "children": [
                                          {
                                            "id": "1727220647913lihargl6p",
                                            "name": "Text",
                                            "type": "text",
                                            "allowsChildren": false,
                                            "children": [],
                                            "props": {
                                              "content": "He/Him"
                                            },
                                            icon: undefined
                                          }
                                        ],
                                        icon: undefined
                                      },
                                      {
                                        "id": "4gg7glc62",
                                        "name": "SelectItem",
                                        "type": "SelectItem",
                                        "props": {
                                          "value": "she/her"
                                        },
                                        "allowsChildren": true,
                                        "children": [
                                          {
                                            "id": "17272206479133b4kgau9q",
                                            "name": "Text",
                                            "type": "text",
                                            "allowsChildren": false,
                                            "children": [],
                                            "props": {
                                              "content": "She/Her"
                                            },
                                            icon: undefined
                                          }
                                        ],
                                        icon: undefined
                                      },
                                      {
                                        "id": "o4qmymtdj",
                                        "name": "SelectItem",
                                        "type": "SelectItem",
                                        "props": {
                                          "value": "they/them"
                                        },
                                        "allowsChildren": true,
                                        "children": [
                                          {
                                            "id": "1727220647914fargg5vsz",
                                            "name": "Text",
                                            "type": "text",
                                            "allowsChildren": false,
                                            "children": [],
                                            "props": {
                                              "content": "They/Them"
                                            },
                                            icon: undefined
                                          }
                                        ],
                                        icon: undefined
                                      },
                                      {
                                        "id": "20qq9uira",
                                        "name": "SelectItem",
                                        "type": "SelectItem",
                                        "props": {
                                          "value": "prefer not to say"
                                        },
                                        "allowsChildren": true,
                                        "children": [
                                          {
                                            "id": "17272206479147rglwbxby",
                                            "name": "Text",
                                            "type": "text",
                                            "allowsChildren": false,
                                            "children": [],
                                            "props": {
                                              "content": "Prefer not to say"
                                            },
                                            icon: undefined
                                          }
                                        ],
                                        icon: undefined
                                      }
                                    ],
                                    icon: undefined
                                  }
                                ],
                                icon: undefined
                              }
                            ],
                            icon: undefined
                          }
                        ],
                        icon: undefined
                      },
                      {
                        "id": "c3vpqs4zb",
                        "name": "div",
                        "type": "div",
                        "props": {
                          "className": "space-y-2"
                        },
                        "allowsChildren": true,
                        "children": [
                          {
                            "id": "t3sffc6jt",
                            "name": "Label",
                            "type": "Label",
                            "props": {
                              "htmlFor": "message"
                            },
                            "allowsChildren": true,
                            "children": [
                              {
                                "id": "1727220647916i8v62hfpj",
                                "name": "Text",
                                "type": "text",
                                "allowsChildren": false,
                                "children": [],
                                "props": {
                                  "content": "Message"
                                },
                                icon: undefined
                              }
                            ],
                            icon: undefined
                          },
                          {
                            "id": "v2t5jo1k3",
                            "name": "Textarea",
                            "type": "Textarea",
                            "props": {
                              "id": "message",
                              "placeholder": "Enter your message",
                              "className": "min-h-[100px]"
                            },
                            "allowsChildren": true,
                            "children": [],
                            icon: undefined
                          }
                        ],
                        icon: undefined
                      },
                      {
                        "id": "vc3bov9r6",
                        "name": "Button",
                        "type": "Button",
                        "props": {
                          "type": "submit",
                          "className": "bg-gray-800 text-white"
                        },
                        "allowsChildren": true,
                        "children": [
                          {
                            "id": "172722064791887b9dqm87",
                            "name": "Text",
                            "type": "text",
                            "allowsChildren": false,
                            "children": [],
                            "props": {
                              "content": "Send message"
                            },
                            icon: undefined
                          }
                        ],
                        icon: undefined
                      }
                    ],
                    icon: undefined
                  }
                ],
                icon: undefined
              }
            ],
            icon: undefined
          }
        ],
        icon: undefined
      }
    ],
    icon: undefined
  }
]

const musicAppSection: TreeItem[] = [
  {
    "id": "osp9o9dg5",
    "name": "MusicApp Section",
    "type": "div",
    "props": {
      "className": "w-full h-screen bg-cyan-500 flex items-center justify-center"
    },
    "allowsChildren": true,
    "children": [
      {
        "id": "nrzdx4ifb",
        "name": "div",
        "type": "div",
        "props": {
          "className": "w-96 h-auto bg-white dark:bg-gray-800 shadow-lg rounded-lg overflow-hidden"
        },
        "allowsChildren": true,
        "children": [
          {
            "id": "2wxx4r68e",
            "name": "div",
            "type": "div",
            "props": {
              "className": "flex justify-between items-center bg-gray-100 dark:bg-gray-700 px-4 py-2"
            },
            "allowsChildren": true,
            "children": [
              {
                "id": "srqm0mtye",
                "name": "h2",
                "type": "h2",
                "props": {
                  "className": "text-lg font-medium text-gray-900 dark:text-gray-100"
                },
                "allowsChildren": true,
                "children": [
                  {
                    "id": "17272207530814tajtrj5u",
                    "name": "Text",
                    "type": "text",
                    "allowsChildren": false,
                    "children": [],
                    "props": {
                      "content": "Music Player"
                    },
                    icon: undefined
                  }
                ],
                icon: undefined
              },
              {
                "id": "w3gd22okt",
                "name": "div",
                "type": "div",
                "props": {
                  "className": "flex space-x-2"
                },
                "allowsChildren": true,
                "children": [
                  {
                    "id": "06xj59gvq",
                    "name": "ExpandIcon",
                    "type": "ExpandIcon",
                    "props": {
                      "className": "text-gray-900 dark:text-gray-100"
                    },
                    "allowsChildren": true,
                    "children": [],
                    icon: undefined
                  },
                  {
                    "id": "ygvv9wbio",
                    "name": "ConstructionIcon",
                    "type": "ConstructionIcon",
                    "props": {
                      "className": "text-gray-900 dark:text-gray-100"
                    },
                    "allowsChildren": true,
                    "children": [],
                    icon: undefined
                  },
                  {
                    "id": "wvxjt3l9t",
                    "name": "MenuIcon",
                    "type": "MenuIcon",
                    "props": {
                      "className": "text-gray-900 dark:text-gray-100"
                    },
                    "allowsChildren": true,
                    "children": [],
                    icon: undefined
                  }
                ],
                icon: undefined
              }
            ],
            icon: undefined
          },
          {
            "id": "a306v9na0",
            "name": "div",
            "type": "div",
            "props": {
              "className": "flex flex-col space-y-4 p-4"
            },
            "allowsChildren": true,
            "children": [
              {
                "id": "xnn35lffq",
                "name": "div",
                "type": "div",
                "props": {
                  "className": "flex items-center space-x-4"
                },
                "allowsChildren": true,
                "children": [
                  {
                    "id": "pr5e0s3iq",
                    "name": "img",
                    "type": "img",
                    "props": {
                      "alt": "Album Art",
                      "height": "64",
                      "width": "64",
                      "src": "/placeholder.svg",
                      "style": null
                    },
                    "allowsChildren": true,
                    "children": [],
                    icon: undefined
                  },
                  {
                    "id": "wy4e21ewv",
                    "name": "div",
                    "type": "div",
                    "props": {
                      "className": "flex-1 space-y-1"
                    },
                    "allowsChildren": true,
                    "children": [
                      {
                        "id": "bsk1zoxdy",
                        "name": "h2",
                        "type": "h2",
                        "props": {
                          "className": "text-lg font-medium text-gray-900 dark:text-gray-100"
                        },
                        "allowsChildren": true,
                        "children": [
                          {
                            "id": "1727220753092tnx0m87ec",
                            "name": "Text",
                            "type": "text",
                            "allowsChildren": false,
                            "children": [],
                            "props": {
                              "content": "Blowin' in the Wind"
                            },
                            icon: undefined
                          }
                        ],
                        icon: undefined
                      },
                      {
                        "id": "7v7f4faa1",
                        "name": "p",
                        "type": "p",
                        "props": {
                          "className": "text-sm text-gray-500 dark:text-gray-400"
                        },
                        "allowsChildren": true,
                        "children": [
                          {
                            "id": "1727220753092kf149kcp8",
                            "name": "Text",
                            "type": "text",
                            "allowsChildren": false,
                            "children": [],
                            "props": {
                              "content": "Bob Dylan"
                            },
                            icon: undefined
                          }
                        ],
                        icon: undefined
                      }
                    ],
                    icon: undefined
                  }
                ],
                icon: undefined
              },
              {
                "id": "jzq90ifrq",
                "name": "Slider",
                "type": "Slider",
                "props": {
                  "className": "flex-1",
                  "value": null
                },
                "allowsChildren": true,
                "children": [],
                icon: undefined
              },
              {
                "id": "mlo9dfvzh",
                "name": "div",
                "type": "div",
                "props": {
                  "className": "flex items-center justify-between"
                },
                "allowsChildren": true,
                "children": [
                  {
                    "id": "firo986qm",
                    "name": "Button",
                    "type": "Button",
                    "props": {
                      "size": "icon",
                      "variant": "ghost"
                    },
                    "allowsChildren": true,
                    "children": [
                      {
                        "id": "w7rmhpzp4",
                        "name": "ArrowLeftIcon",
                        "type": "ArrowLeftIcon",
                        "props": {
                          "className": "text-gray-900 dark:text-gray-100"
                        },
                        "allowsChildren": true,
                        "children": [],
                        icon: undefined
                      }
                    ],
                    icon: undefined
                  },
                  {
                    "id": "76w6goec0",
                    "name": "Button",
                    "type": "Button",
                    "props": {
                      "className": "p-2",
                      "size": "icon"
                    },
                    "allowsChildren": true,
                    "children": [
                      {
                        "id": "dc7catr24",
                        "name": "PlayIcon",
                        "type": "PlayIcon",
                        "props": {
                          "className": "text-gray-900 dark:text-gray-100"
                        },
                        "allowsChildren": true,
                        "children": [],
                        icon: undefined
                      }
                    ],
                    icon: undefined
                  },
                  {
                    "id": "jfodchyrx",
                    "name": "Button",
                    "type": "Button",
                    "props": {
                      "size": "icon",
                      "variant": "ghost"
                    },
                    "allowsChildren": true,
                    "children": [
                      {
                        "id": "ydy2wffeo",
                        "name": "ArrowRightIcon",
                        "type": "ArrowRightIcon",
                        "props": {
                          "className": "text-gray-900 dark:text-gray-100"
                        },
                        "allowsChildren": true,
                        "children": [],
                        icon: undefined
                      }
                    ],
                    icon: undefined
                  }
                ],
                icon: undefined
              }
            ],
            icon: undefined
          },
          {
            "id": "4kp375fne",
            "name": "div",
            "type": "div",
            "props": {
              "className": "p-4"
            },
            "allowsChildren": true,
            "children": [
              {
                "id": "vexwml2lx",
                "name": "h2",
                "type": "h2",
                "props": {
                  "className": "text-lg font-medium text-gray-900 dark:text-gray-100 mb-2"
                },
                "allowsChildren": true,
                "children": [
                  {
                    "id": "1727220753099kd4l37uwm",
                    "name": "Text",
                    "type": "text",
                    "allowsChildren": false,
                    "children": [],
                    "props": {
                      "content": "Playlist"
                    },
                    icon: undefined
                  }
                ],
                icon: undefined
              },
              {
                "id": "0gva5cv4c",
                "name": "div",
                "type": "div",
                "props": {
                  "className": "space-y-2"
                },
                "allowsChildren": true,
                "children": [
                  {
                    "id": "0ao32t1v9",
                    "name": "div",
                    "type": "div",
                    "props": {
                      "className": "flex items-center justify-between"
                    },
                    "allowsChildren": true,
                    "children": [
                      {
                        "id": "w18zno1p0",
                        "name": "p",
                        "type": "p",
                        "props": {
                          "className": "text-sm text-gray-900 dark:text-gray-100"
                        },
                        "allowsChildren": true,
                        "children": [
                          {
                            "id": "17272207531029srl06eht",
                            "name": "Text",
                            "type": "text",
                            "allowsChildren": false,
                            "children": [],
                            "props": {
                              "content": "Like a Rolling Stone"
                            },
                            icon: undefined
                          }
                        ],
                        icon: undefined
                      },
                      {
                        "id": "ahrdfb3sr",
                        "name": "PlayIcon",
                        "type": "PlayIcon",
                        "props": {
                          "className": "text-gray-900 dark:text-gray-100"
                        },
                        "allowsChildren": true,
                        "children": [],
                        icon: undefined
                      }
                    ],
                    icon: undefined
                  },
                  {
                    "id": "dx4jbv8bc",
                    "name": "div",
                    "type": "div",
                    "props": {
                      "className": "flex items-center justify-between"
                    },
                    "allowsChildren": true,
                    "children": [
                      {
                        "id": "zvsivr6by",
                        "name": "p",
                        "type": "p",
                        "props": {
                          "className": "text-sm text-gray-900 dark:text-gray-100"
                        },
                        "allowsChildren": true,
                        "children": [
                          {
                            "id": "1727220753104fffyvqaut",
                            "name": "Text",
                            "type": "text",
                            "allowsChildren": false,
                            "children": [],
                            "props": {
                              "content": "The Times They Are a-Changin'"
                            },
                            icon: undefined
                          }
                        ],
                        icon: undefined
                      },
                      {
                        "id": "ok0mq4701",
                        "name": "PlayIcon",
                        "type": "PlayIcon",
                        "props": {
                          "className": "text-gray-900 dark:text-gray-100"
                        },
                        "allowsChildren": true,
                        "children": [],
                        icon: undefined
                      }
                    ],
                    icon: undefined
                  },
                  {
                    "id": "6qiotypug",
                    "name": "div",
                    "type": "div",
                    "props": {
                      "className": "flex items-center justify-between"
                    },
                    "allowsChildren": true,
                    "children": [
                      {
                        "id": "0eijgiypy",
                        "name": "p",
                        "type": "p",
                        "props": {
                          "className": "text-sm text-gray-900 dark:text-gray-100"
                        },
                        "allowsChildren": true,
                        "children": [
                          {
                            "id": "1727220753106idlwf5ets",
                            "name": "Text",
                            "type": "text",
                            "allowsChildren": false,
                            "children": [],
                            "props": {
                              "content": "Subterranean Homesick Blues"
                            },
                            icon: undefined
                          }
                        ],
                        icon: undefined
                      },
                      {
                        "id": "ui3i5ryua",
                        "name": "PlayIcon",
                        "type": "PlayIcon",
                        "props": {
                          "className": "text-gray-900 dark:text-gray-100"
                        },
                        "allowsChildren": true,
                        "children": [],
                        icon: undefined
                      }
                    ],
                    icon: undefined
                  }
                ],
                icon: undefined
              }
            ],
            icon: undefined
          }
        ],
        icon: undefined
      }
    ],
    icon: undefined
  }
]

const dashboardSection: TreeItem[] = [
  {
    "id": "68wdxbfd2",
    "name": "Dashboard Section",
    "type": "div",
    "props": {
      "className": "flex min-h-screen w-full flex-col bg-background"
    },
    "allowsChildren": true,
    "children": [
      {
        "id": "6i9zb41ix",
        "name": "header",
        "type": "header",
        "props": {
          "className": "sticky top-0 z-40 flex h-16 w-full shrink-0 items-center border-b bg-background px-4 md:px-6"
        },
        "allowsChildren": true,
        "children": [
          {
            "id": "pr3vbj4hn",
            "name": "Link",
            "type": "Link",
            "props": {
              "href": "#",
              "className": "flex items-center gap-2",
              "prefetch": null
            },
            "allowsChildren": true,
            "children": [
              {
                "id": "u9mq40758",
                "name": "MountainIcon",
                "type": "MountainIcon",
                "props": {
                  "className": "h-6 w-6"
                },
                "allowsChildren": true,
                "children": [],
                icon: undefined
              },
              {
                "id": "a8v3w1dou",
                "name": "span",
                "type": "span",
                "props": {
                  "className": "sr-only"
                },
                "allowsChildren": true,
                "children": [
                  {
                    "id": "1727221118554aiyy75elm",
                    "name": "Text",
                    "type": "text",
                    "allowsChildren": false,
                    "children": [],
                    "props": {
                      "content": "Acme Inc"
                    },
                    icon: undefined
                  }
                ],
                icon: undefined
              }
            ],
            icon: undefined
          },
          {
            "id": "hsg7cr9q2",
            "name": "nav",
            "type": "nav",
            "props": {
              "className": "ml-auto flex items-center gap-4"
            },
            "allowsChildren": true,
            "children": [
              {
                "id": "zwqxnfno1",
                "name": "Link",
                "type": "Link",
                "props": {
                  "href": "#",
                  "className": "flex h-9 w-9 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-muted hover:text-foreground",
                  "prefetch": null
                },
                "allowsChildren": true,
                "children": [
                  {
                    "id": "ukwkzkmc7",
                    "name": "UsersIcon",
                    "type": "UsersIcon",
                    "props": {
                      "className": "h-5 w-5"
                    },
                    "allowsChildren": true,
                    "children": [],
                    icon: undefined
                  },
                  {
                    "id": "ndhn51f3o",
                    "name": "span",
                    "type": "span",
                    "props": {
                      "className": "sr-only"
                    },
                    "allowsChildren": true,
                    "children": [
                      {
                        "id": "1727221118560onzv1g95p",
                        "name": "Text",
                        "type": "text",
                        "allowsChildren": false,
                        "children": [],
                        "props": {
                          "content": "Users"
                        },
                        icon: undefined
                      }
                    ],
                    icon: undefined
                  }
                ],
                icon: undefined
              },
              {
                "id": "ndo42pgdk",
                "name": "Link",
                "type": "Link",
                "props": {
                  "href": "#",
                  "className": "flex h-9 w-9 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-muted hover:text-foreground",
                  "prefetch": null
                },
                "allowsChildren": true,
                "children": [
                  {
                    "id": "s1yn0qso4",
                    "name": "PenToolIcon",
                    "type": "PenToolIcon",
                    "props": {
                      "className": "h-5 w-5"
                    },
                    "allowsChildren": true,
                    "children": [],
                    icon: undefined
                  },
                  {
                    "id": "mg4314hb4",
                    "name": "span",
                    "type": "span",
                    "props": {
                      "className": "sr-only"
                    },
                    "allowsChildren": true,
                    "children": [
                      {
                        "id": "1727221118572sueoydnbg",
                        "name": "Text",
                        "type": "text",
                        "allowsChildren": false,
                        "children": [],
                        "props": {
                          "content": "Tools"
                        },
                        icon: undefined
                      }
                    ],
                    icon: undefined
                  }
                ],
                icon: undefined
              },
              {
                "id": "hyhy0hche",
                "name": "Link",
                "type": "Link",
                "props": {
                  "href": "#",
                  "className": "flex h-9 w-9 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-muted hover:text-foreground",
                  "prefetch": null
                },
                "allowsChildren": true,
                "children": [
                  {
                    "id": "btbul4j5u",
                    "name": "CheckIcon",
                    "type": "CheckIcon",
                    "props": {
                      "className": "h-5 w-5"
                    },
                    "allowsChildren": true,
                    "children": [],
                    icon: undefined
                  },
                  {
                    "id": "3ojhwzof5",
                    "name": "span",
                    "type": "span",
                    "props": {
                      "className": "sr-only"
                    },
                    "allowsChildren": true,
                    "children": [
                      {
                        "id": "1727221118573j68cce6qj",
                        "name": "Text",
                        "type": "text",
                        "allowsChildren": false,
                        "children": [],
                        "props": {
                          "content": "Reports"
                        },
                        icon: undefined
                      }
                    ],
                    icon: undefined
                  }
                ],
                icon: undefined
              },
              {
                "id": "iaaoz0ynm",
                "name": "Link",
                "type": "Link",
                "props": {
                  "href": "#",
                  "className": "flex h-9 w-9 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-muted hover:text-foreground",
                  "prefetch": null
                },
                "allowsChildren": true,
                "children": [
                  {
                    "id": "j4ahi8c9x",
                    "name": "DollarSignIcon",
                    "type": "DollarSignIcon",
                    "props": {
                      "className": "h-5 w-5"
                    },
                    "allowsChildren": true,
                    "children": [],
                    icon: undefined
                  },
                  {
                    "id": "i3t4yuma4",
                    "name": "span",
                    "type": "span",
                    "props": {
                      "className": "sr-only"
                    },
                    "allowsChildren": true,
                    "children": [
                      {
                        "id": "1727221118574zehws32dm",
                        "name": "Text",
                        "type": "text",
                        "allowsChildren": false,
                        "children": [],
                        "props": {
                          "content": "Financials"
                        },
                        icon: undefined
                      }
                    ],
                    icon: undefined
                  }
                ],
                icon: undefined
              },
              {
                "id": "jn9445neo",
                "name": "Link",
                "type": "Link",
                "props": {
                  "href": "#",
                  "className": "flex h-9 w-9 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-muted hover:text-foreground",
                  "prefetch": null
                },
                "allowsChildren": true,
                "children": [
                  {
                    "id": "zw8xik5xw",
                    "name": "SettingsIcon",
                    "type": "SettingsIcon",
                    "props": {
                      "className": "h-5 w-5"
                    },
                    "allowsChildren": true,
                    "children": [],
                    icon: undefined
                  },
                  {
                    "id": "vmn8cv1cw",
                    "name": "span",
                    "type": "span",
                    "props": {
                      "className": "sr-only"
                    },
                    "allowsChildren": true,
                    "children": [
                      {
                        "id": "1727221118575vk5pslp02",
                        "name": "Text",
                        "type": "text",
                        "allowsChildren": false,
                        "children": [],
                        "props": {
                          "content": "Settings"
                        },
                        icon: undefined
                      }
                    ],
                    icon: undefined
                  }
                ],
                icon: undefined
              },
              {
                "id": "cbvzu9j4i",
                "name": "DropdownMenu",
                "type": "DropdownMenu",
                "props": {},
                "allowsChildren": true,
                "children": [
                  {
                    "id": "scaltz3us",
                    "name": "DropdownMenuTrigger",
                    "type": "DropdownMenuTrigger",
                    "props": {
                      "asChild": true
                    },
                    "allowsChildren": true,
                    "children": [
                      {
                        "id": "jmfctscqa",
                        "name": "Button",
                        "type": "Button",
                        "props": {
                          "variant": "outline",
                          "size": "icon",
                          "className": "overflow-hidden rounded-full"
                        },
                        "allowsChildren": true,
                        "children": [
                          {
                            "id": "l0c0iadtk",
                            "name": "img",
                            "type": "img",
                            "props": {
                              "src": "/placeholder.svg",
                              "width": null,
                              "height": null,
                              "alt": "Avatar",
                              "className": "overflow-hidden rounded-full",
                              "style": null
                            },
                            "allowsChildren": true,
                            "children": [],
                            icon: undefined
                          }
                        ],
                        icon: undefined
                      }
                    ],
                    icon: undefined
                  },
                  {
                    "id": "sqazhvi20",
                    "name": "DropdownMenuContent",
                    "type": "DropdownMenuContent",
                    "props": {
                      "align": "end"
                    },
                    "allowsChildren": true,
                    "children": [
                      {
                        "id": "mk6i3ny9b",
                        "name": "DropdownMenuLabel",
                        "type": "DropdownMenuLabel",
                        "props": {},
                        "allowsChildren": true,
                        "children": [
                          {
                            "id": "1727221118581vgudtch26",
                            "name": "Text",
                            "type": "text",
                            "allowsChildren": false,
                            "children": [],
                            "props": {
                              "content": "My Account"
                            },
                            icon: undefined
                          }
                        ],
                        icon: undefined
                      },
                      {
                        "id": "7wqwuxx8b",
                        "name": "DropdownMenuSeparator",
                        "type": "DropdownMenuSeparator",
                        "props": {},
                        "allowsChildren": true,
                        "children": [],
                        icon: undefined
                      },
                      {
                        "id": "fb61w7xyo",
                        "name": "DropdownMenuItem",
                        "type": "DropdownMenuItem",
                        "props": {},
                        "allowsChildren": true,
                        "children": [
                          {
                            "id": "1727221118582y6lp33o41",
                            "name": "Text",
                            "type": "text",
                            "allowsChildren": false,
                            "children": [],
                            "props": {
                              "content": "Settings"
                            },
                            icon: undefined
                          }
                        ],
                        icon: undefined
                      },
                      {
                        "id": "8m72mst3s",
                        "name": "DropdownMenuItem",
                        "type": "DropdownMenuItem",
                        "props": {},
                        "allowsChildren": true,
                        "children": [
                          {
                            "id": "172722111858246vmiyrs5",
                            "name": "Text",
                            "type": "text",
                            "allowsChildren": false,
                            "children": [],
                            "props": {
                              "content": "Support"
                            },
                            icon: undefined
                          }
                        ],
                        icon: undefined
                      },
                      {
                        "id": "5whz1vhs0",
                        "name": "DropdownMenuSeparator",
                        "type": "DropdownMenuSeparator",
                        "props": {},
                        "allowsChildren": true,
                        "children": [],
                        icon: undefined
                      },
                      {
                        "id": "nn1f4nhs3",
                        "name": "DropdownMenuItem",
                        "type": "DropdownMenuItem",
                        "props": {},
                        "allowsChildren": true,
                        "children": [
                          {
                            "id": "172722111858308lf7ypi9",
                            "name": "Text",
                            "type": "text",
                            "allowsChildren": false,
                            "children": [],
                            "props": {
                              "content": "Logout"
                            },
                            icon: undefined
                          }
                        ],
                        icon: undefined
                      }
                    ],
                    icon: undefined
                  }
                ],
                icon: undefined
              }
            ],
            icon: undefined
          }
        ],
        icon: undefined
      },
      {
        "id": "deq0px6pc",
        "name": "main",
        "type": "main",
        "props": {
          "className": "flex-1 p-4 md:p-6"
        },
        "allowsChildren": true,
        "children": [
          {
            "id": "nu9gxs6y9",
            "name": "div",
            "type": "div",
            "props": {
              "className": "grid gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
            },
            "allowsChildren": true,
            "children": [
              {
                "id": "7ewjfhkx8",
                "name": "Card",
                "type": "Card",
                "props": {},
                "allowsChildren": true,
                "children": [
                  {
                    "id": "6g33lrnci",
                    "name": "CardHeader",
                    "type": "CardHeader",
                    "props": {
                      "className": "flex flex-row items-center justify-between pb-2"
                    },
                    "allowsChildren": true,
                    "children": [
                      {
                        "id": "ugvlu5trl",
                        "name": "CardTitle",
                        "type": "CardTitle",
                        "props": {
                          "className": "text-sm font-medium"
                        },
                        "allowsChildren": true,
                        "children": [
                          {
                            "id": "1727221118597cpjgj1djj",
                            "name": "Text",
                            "type": "text",
                            "allowsChildren": false,
                            "children": [],
                            "props": {
                              "content": "Active Users"
                            },
                            icon: undefined
                          }
                        ],
                        icon: undefined
                      },
                      {
                        "id": "j36sky1ma",
                        "name": "UsersIcon",
                        "type": "UsersIcon",
                        "props": {
                          "className": "w-4 h-4 text-muted-foreground"
                        },
                        "allowsChildren": true,
                        "children": [],
                        icon: undefined
                      }
                    ],
                    icon: undefined
                  },
                  {
                    "id": "mlrxpbsi2",
                    "name": "CardContent",
                    "type": "CardContent",
                    "props": {},
                    "allowsChildren": true,
                    "children": [
                      {
                        "id": "2ljrhchil",
                        "name": "div",
                        "type": "div",
                        "props": {
                          "className": "text-2xl font-bold"
                        },
                        "allowsChildren": true,
                        "children": [
                          {
                            "id": "17272211185981g1yh6yr3",
                            "name": "Text",
                            "type": "text",
                            "allowsChildren": false,
                            "children": [],
                            "props": {
                              "content": "1,234"
                            },
                            icon: undefined
                          }
                        ],
                        icon: undefined
                      },
                      {
                        "id": "u6mi2htcj",
                        "name": "p",
                        "type": "p",
                        "props": {
                          "className": "text-xs text-muted-foreground"
                        },
                        "allowsChildren": true,
                        "children": [
                          {
                            "id": "1727221118599cc85za3am",
                            "name": "Text",
                            "type": "text",
                            "allowsChildren": false,
                            "children": [],
                            "props": {
                              "content": "+5.2% from last month"
                            },
                            icon: undefined
                          }
                        ],
                        icon: undefined
                      }
                    ],
                    icon: undefined
                  }
                ],
                icon: undefined
              },
              {
                "id": "fis7ysabg",
                "name": "Card",
                "type": "Card",
                "props": {},
                "allowsChildren": true,
                "children": [
                  {
                    "id": "5gfb91fbz",
                    "name": "CardHeader",
                    "type": "CardHeader",
                    "props": {
                      "className": "flex flex-row items-center justify-between pb-2"
                    },
                    "allowsChildren": true,
                    "children": [
                      {
                        "id": "3n3ctlfi5",
                        "name": "CardTitle",
                        "type": "CardTitle",
                        "props": {
                          "className": "text-sm font-medium"
                        },
                        "allowsChildren": true,
                        "children": [
                          {
                            "id": "1727221118601r89l2eclj",
                            "name": "Text",
                            "type": "text",
                            "allowsChildren": false,
                            "children": [],
                            "props": {
                              "content": "Files Processed"
                            },
                            icon: undefined
                          }
                        ],
                        icon: undefined
                      },
                      {
                        "id": "8we4795sb",
                        "name": "FileIcon",
                        "type": "FileIcon",
                        "props": {
                          "className": "w-4 h-4 text-muted-foreground"
                        },
                        "allowsChildren": true,
                        "children": [],
                        icon: undefined
                      }
                    ],
                    icon: undefined
                  },
                  {
                    "id": "5kxv1y7rs",
                    "name": "CardContent",
                    "type": "CardContent",
                    "props": {},
                    "allowsChildren": true,
                    "children": [
                      {
                        "id": "jla3zk1cd",
                        "name": "div",
                        "type": "div",
                        "props": {
                          "className": "text-2xl font-bold"
                        },
                        "allowsChildren": true,
                        "children": [
                          {
                            "id": "17272211186021grxuijzr",
                            "name": "Text",
                            "type": "text",
                            "allowsChildren": false,
                            "children": [],
                            "props": {
                              "content": "12,345"
                            },
                            icon: undefined
                          }
                        ],
                        icon: undefined
                      },
                      {
                        "id": "soru3e4da",
                        "name": "p",
                        "type": "p",
                        "props": {
                          "className": "text-xs text-muted-foreground"
                        },
                        "allowsChildren": true,
                        "children": [
                          {
                            "id": "17272211186031ep7skdoc",
                            "name": "Text",
                            "type": "text",
                            "allowsChildren": false,
                            "children": [],
                            "props": {
                              "content": "+8.1% from last month"
                            },
                            icon: undefined
                          }
                        ],
                        icon: undefined
                      }
                    ],
                    icon: undefined
                  }
                ],
                icon: undefined
              },
              {
                "id": "mqdqm1i79",
                "name": "Card",
                "type": "Card",
                "props": {},
                "allowsChildren": true,
                "children": [
                  {
                    "id": "2f0g74yv9",
                    "name": "CardHeader",
                    "type": "CardHeader",
                    "props": {
                      "className": "flex flex-row items-center justify-between pb-2"
                    },
                    "allowsChildren": true,
                    "children": [
                      {
                        "id": "6f0x31sbl",
                        "name": "CardTitle",
                        "type": "CardTitle",
                        "props": {
                          "className": "text-sm font-medium"
                        },
                        "allowsChildren": true,
                        "children": [
                          {
                            "id": "1727221118604h96zagrp3",
                            "name": "Text",
                            "type": "text",
                            "allowsChildren": false,
                            "children": [],
                            "props": {
                              "content": "Server Usage"
                            },
                            icon: undefined
                          }
                        ],
                        icon: undefined
                      },
                      {
                        "id": "ff7rum3bc",
                        "name": "ServerIcon",
                        "type": "ServerIcon",
                        "props": {
                          "className": "w-4 h-4 text-muted-foreground"
                        },
                        "allowsChildren": true,
                        "children": [],
                        icon: undefined
                      }
                    ],
                    icon: undefined
                  },
                  {
                    "id": "j6un3t6gh",
                    "name": "CardContent",
                    "type": "CardContent",
                    "props": {},
                    "allowsChildren": true,
                    "children": [
                      {
                        "id": "i58j6sz3c",
                        "name": "div",
                        "type": "div",
                        "props": {
                          "className": "text-2xl font-bold"
                        },
                        "allowsChildren": true,
                        "children": [
                          {
                            "id": "1727221118604iyr3pmcev",
                            "name": "Text",
                            "type": "text",
                            "allowsChildren": false,
                            "children": [],
                            "props": {
                              "content": "78%"
                            },
                            icon: undefined
                          }
                        ],
                        icon: undefined
                      },
                      {
                        "id": "h4bcrsvh9",
                        "name": "p",
                        "type": "p",
                        "props": {
                          "className": "text-xs text-muted-foreground"
                        },
                        "allowsChildren": true,
                        "children": [
                          {
                            "id": "1727221118605fdej2dhq1",
                            "name": "Text",
                            "type": "text",
                            "allowsChildren": false,
                            "children": [],
                            "props": {
                              "content": "+2.3% from last month"
                            },
                            icon: undefined
                          }
                        ],
                        icon: undefined
                      }
                    ],
                    icon: undefined
                  }
                ],
                icon: undefined
              },
              {
                "id": "6fr1cc83l",
                "name": "Card",
                "type": "Card",
                "props": {},
                "allowsChildren": true,
                "children": [
                  {
                    "id": "p3icy8cfv",
                    "name": "CardHeader",
                    "type": "CardHeader",
                    "props": {
                      "className": "flex flex-row items-center justify-between pb-2"
                    },
                    "allowsChildren": true,
                    "children": [
                      {
                        "id": "2jzl8w76b",
                        "name": "CardTitle",
                        "type": "CardTitle",
                        "props": {
                          "className": "text-sm font-medium"
                        },
                        "allowsChildren": true,
                        "children": [
                          {
                            "id": "1727221118606i19fu9ye3",
                            "name": "Text",
                            "type": "text",
                            "allowsChildren": false,
                            "children": [],
                            "props": {
                              "content": "Disk Space"
                            },
                            icon: undefined
                          }
                        ],
                        icon: undefined
                      },
                      {
                        "id": "kbdgdhswz",
                        "name": "HardDriveIcon",
                        "type": "HardDriveIcon",
                        "props": {
                          "className": "w-4 h-4 text-muted-foreground"
                        },
                        "allowsChildren": true,
                        "children": [],
                        icon: undefined
                      }
                    ],
                    icon: undefined
                  },
                  {
                    "id": "unte4duue",
                    "name": "CardContent",
                    "type": "CardContent",
                    "props": {},
                    "allowsChildren": true,
                    "children": [
                      {
                        "id": "uxchmvp6c",
                        "name": "div",
                        "type": "div",
                        "props": {
                          "className": "text-2xl font-bold"
                        },
                        "allowsChildren": true,
                        "children": [
                          {
                            "id": "1727221118607m6m5bwfo9",
                            "name": "Text",
                            "type": "text",
                            "allowsChildren": false,
                            "children": [],
                            "props": {
                              "content": "82%"
                            },
                            icon: undefined
                          }
                        ],
                        icon: undefined
                      },
                      {
                        "id": "dvxr3y6po",
                        "name": "p",
                        "type": "p",
                        "props": {
                          "className": "text-xs text-muted-foreground"
                        },
                        "allowsChildren": true,
                        "children": [
                          {
                            "id": "17272211186073zrjmqv4w",
                            "name": "Text",
                            "type": "text",
                            "allowsChildren": false,
                            "children": [],
                            "props": {
                              "content": "+1.9% from last month"
                            },
                            icon: undefined
                          }
                        ],
                        icon: undefined
                      }
                    ],
                    icon: undefined
                  }
                ],
                icon: undefined
              }
            ],
            icon: undefined
          },
          {
            "id": "momh58uv3",
            "name": "div",
            "type": "div",
            "props": {
              "className": "grid gap-4 mt-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
            },
            "allowsChildren": true,
            "children": [
              {
                "id": "y6ny4frtd",
                "name": "Card",
                "type": "Card",
                "props": {},
                "allowsChildren": true,
                "children": [
                  {
                    "id": "799skdfsk",
                    "name": "CardHeader",
                    "type": "CardHeader",
                    "props": {
                      "className": "flex flex-row items-center justify-between pb-2"
                    },
                    "allowsChildren": true,
                    "children": [
                      {
                        "id": "y0fymbuf1",
                        "name": "CardTitle",
                        "type": "CardTitle",
                        "props": {
                          "className": "text-sm font-medium"
                        },
                        "allowsChildren": true,
                        "children": [
                          {
                            "id": "1727221118613k4es5tq62",
                            "name": "Text",
                            "type": "text",
                            "allowsChildren": false,
                            "children": [],
                            "props": {
                              "content": "Tool Usage Trends"
                            },
                            icon: undefined
                          }
                        ],
                        icon: undefined
                      },
                      {
                        "id": "qlitsdjjt",
                        "name": "GitGraphIcon",
                        "type": "GitGraphIcon",
                        "props": {
                          "className": "w-4 h-4 text-muted-foreground"
                        },
                        "allowsChildren": true,
                        "children": [],
                        icon: undefined
                      }
                    ],
                    icon: undefined
                  },
                  {
                    "id": "5bnr6zsf8",
                    "name": "CardContent",
                    "type": "CardContent",
                    "props": {},
                    "allowsChildren": true,
                    "children": [
                      {
                        "id": "7a4553atr",
                        "name": "LineChart",
                        "type": "LineChart",
                        "props": {
                          "className": "w-full aspect-[4/3]"
                        },
                        "allowsChildren": true,
                        "children": [],
                        icon: undefined
                      }
                    ],
                    icon: undefined
                  }
                ],
                icon: undefined
              },
              {
                "id": "1ie1xi22c",
                "name": "Card",
                "type": "Card",
                "props": {},
                "allowsChildren": true,
                "children": [
                  {
                    "id": "3ranzts0a",
                    "name": "CardHeader",
                    "type": "CardHeader",
                    "props": {
                      "className": "flex flex-row items-center justify-between pb-2"
                    },
                    "allowsChildren": true,
                    "children": [
                      {
                        "id": "ee908re3r",
                        "name": "CardTitle",
                        "type": "CardTitle",
                        "props": {
                          "className": "text-sm font-medium"
                        },
                        "allowsChildren": true,
                        "children": [
                          {
                            "id": "1727221118618h82ndqars",
                            "name": "Text",
                            "type": "text",
                            "allowsChildren": false,
                            "children": [],
                            "props": {
                              "content": "Recent Activity"
                            },
                            icon: undefined
                          }
                        ],
                        icon: undefined
                      },
                      {
                        "id": "yllkh6lj9",
                        "name": "ActivityIcon",
                        "type": "ActivityIcon",
                        "props": {
                          "className": "w-4 h-4 text-muted-foreground"
                        },
                        "allowsChildren": true,
                        "children": [],
                        icon: undefined
                      }
                    ],
                    icon: undefined
                  },
                  {
                    "id": "pomota3pn",
                    "name": "CardContent",
                    "type": "CardContent",
                    "props": {},
                    "allowsChildren": true,
                    "children": [
                      {
                        "id": "roesnebcn",
                        "name": "div",
                        "type": "div",
                        "props": {
                          "className": "grid gap-4"
                        },
                        "allowsChildren": true,
                        "children": [
                          {
                            "id": "4y73dxhvh",
                            "name": "div",
                            "type": "div",
                            "props": {
                              "className": "flex items-start gap-3"
                            },
                            "allowsChildren": true,
                            "children": [
                              {
                                "id": "0pffbn3w6",
                                "name": "Avatar",
                                "type": "Avatar",
                                "props": {
                                  "className": "w-8 h-8"
                                },
                                "allowsChildren": true,
                                "children": [
                                  {
                                    "id": "dwogh7gwx",
                                    "name": "AvatarImage",
                                    "type": "AvatarImage",
                                    "props": {
                                      "src": "/placeholder-user.jpg",
                                      "alt": "@shadcn"
                                    },
                                    "allowsChildren": true,
                                    "children": [],
                                    icon: undefined
                                  },
                                  {
                                    "id": "4wl4vzbyu",
                                    "name": "AvatarFallback",
                                    "type": "AvatarFallback",
                                    "props": {},
                                    "allowsChildren": true,
                                    "children": [
                                      {
                                        "id": "1727221118623eue4fmfel",
                                        "name": "Text",
                                        "type": "text",
                                        "allowsChildren": false,
                                        "children": [],
                                        "props": {
                                          "content": "AC"
                                        },
                                        icon: undefined
                                      }
                                    ],
                                    icon: undefined
                                  }
                                ],
                                icon: undefined
                              },
                              {
                                "id": "brk1y353l",
                                "name": "div",
                                "type": "div",
                                "props": {
                                  "className": "flex-1 space-y-1"
                                },
                                "allowsChildren": true,
                                "children": [
                                  {
                                    "id": "u0vbrrfbw",
                                    "name": "div",
                                    "type": "div",
                                    "props": {
                                      "className": "flex items-center justify-between"
                                    },
                                    "allowsChildren": true,
                                    "children": [
                                      {
                                        "id": "wrc2xkyeu",
                                        "name": "p",
                                        "type": "p",
                                        "props": {
                                          "className": "font-medium"
                                        },
                                        "allowsChildren": true,
                                        "children": [
                                          {
                                            "id": "1727221118624379pccizo",
                                            "name": "Text",
                                            "type": "text",
                                            "allowsChildren": false,
                                            "children": [],
                                            "props": {
                                              "content": "John Doe"
                                            },
                                            icon: undefined
                                          }
                                        ],
                                        icon: undefined
                                      },
                                      {
                                        "id": "9e8eodmvx",
                                        "name": "p",
                                        "type": "p",
                                        "props": {
                                          "className": "text-xs text-muted-foreground"
                                        },
                                        "allowsChildren": true,
                                        "children": [
                                          {
                                            "id": "1727221118624hssqumsjz",
                                            "name": "Text",
                                            "type": "text",
                                            "allowsChildren": false,
                                            "children": [],
                                            "props": {
                                              "content": "2h ago"
                                            },
                                            icon: undefined
                                          }
                                        ],
                                        icon: undefined
                                      }
                                    ],
                                    icon: undefined
                                  },
                                  {
                                    "id": "1dchsrrg2",
                                    "name": "p",
                                    "type": "p",
                                    "props": {
                                      "className": "text-sm text-muted-foreground"
                                    },
                                    "allowsChildren": true,
                                    "children": [
                                      {
                                        "id": "17272211186257s1f90nse",
                                        "name": "Text",
                                        "type": "text",
                                        "allowsChildren": false,
                                        "children": [],
                                        "props": {
                                          "content": "Added a new user to the team."
                                        },
                                        icon: undefined
                                      }
                                    ],
                                    icon: undefined
                                  }
                                ],
                                icon: undefined
                              }
                            ],
                            icon: undefined
                          },
                          {
                            "id": "jh4of4pg0",
                            "name": "div",
                            "type": "div",
                            "props": {
                              "className": "flex items-start gap-3"
                            },
                            "allowsChildren": true,
                            "children": [
                              {
                                "id": "mil7p9pb2",
                                "name": "Avatar",
                                "type": "Avatar",
                                "props": {
                                  "className": "w-8 h-8"
                                },
                                "allowsChildren": true,
                                "children": [
                                  {
                                    "id": "wxz51ils3",
                                    "name": "AvatarImage",
                                    "type": "AvatarImage",
                                    "props": {
                                      "src": "/placeholder-user.jpg",
                                      "alt": "@shadcn"
                                    },
                                    "allowsChildren": true,
                                    "children": [],
                                    icon: undefined
                                  },
                                  {
                                    "id": "dqh87dgha",
                                    "name": "AvatarFallback",
                                    "type": "AvatarFallback",
                                    "props": {},
                                    "allowsChildren": true,
                                    "children": [
                                      {
                                        "id": "1727221118627tw45il896",
                                        "name": "Text",
                                        "type": "text",
                                        "allowsChildren": false,
                                        "children": [],
                                        "props": {
                                          "content": "AC"
                                        },
                                        icon: undefined
                                      }
                                    ],
                                    icon: undefined
                                  }
                                ],
                                icon: undefined
                              },
                              {
                                "id": "on8kbb94c",
                                "name": "div",
                                "type": "div",
                                "props": {
                                  "className": "flex-1 space-y-1"
                                },
                                "allowsChildren": true,
                                "children": [
                                  {
                                    "id": "ts5itppb6",
                                    "name": "div",
                                    "type": "div",
                                    "props": {
                                      "className": "flex items-center justify-between"
                                    },
                                    "allowsChildren": true,
                                    "children": [
                                      {
                                        "id": "iappzxrhm",
                                        "name": "p",
                                        "type": "p",
                                        "props": {
                                          "className": "font-medium"
                                        },
                                        "allowsChildren": true,
                                        "children": [
                                          {
                                            "id": "17272211186406e5o7lxhm",
                                            "name": "Text",
                                            "type": "text",
                                            "allowsChildren": false,
                                            "children": [],
                                            "props": {
                                              "content": "Jane Smith"
                                            },
                                            icon: undefined
                                          }
                                        ],
                                        icon: undefined
                                      },
                                      {
                                        "id": "3c3i0h1g8",
                                        "name": "p",
                                        "type": "p",
                                        "props": {
                                          "className": "text-xs text-muted-foreground"
                                        },
                                        "allowsChildren": true,
                                        "children": [
                                          {
                                            "id": "1727221118640fc73d8vhh",
                                            "name": "Text",
                                            "type": "text",
                                            "allowsChildren": false,
                                            "children": [],
                                            "props": {
                                              "content": "4h ago"
                                            },
                                            icon: undefined
                                          }
                                        ],
                                        icon: undefined
                                      }
                                    ],
                                    icon: undefined
                                  },
                                  {
                                    "id": "hbn59dqmu",
                                    "name": "p",
                                    "type": "p",
                                    "props": {
                                      "className": "text-sm text-muted-foreground"
                                    },
                                    "allowsChildren": true,
                                    "children": [
                                      {
                                        "id": "17272211186406wt2rucco",
                                        "name": "Text",
                                        "type": "text",
                                        "allowsChildren": false,
                                        "children": [],
                                        "props": {
                                          "content": "Uploaded a new report."
                                        },
                                        icon: undefined
                                      }
                                    ],
                                    icon: undefined
                                  }
                                ],
                                icon: undefined
                              }
                            ],
                            icon: undefined
                          },
                          {
                            "id": "tgdaq24jy",
                            "name": "div",
                            "type": "div",
                            "props": {
                              "className": "flex items-start gap-3"
                            },
                            "allowsChildren": true,
                            "children": [
                              {
                                "id": "kh4o5dmnm",
                                "name": "Avatar",
                                "type": "Avatar",
                                "props": {
                                  "className": "w-8 h-8"
                                },
                                "allowsChildren": true,
                                "children": [
                                  {
                                    "id": "wue4bck1a",
                                    "name": "AvatarImage",
                                    "type": "AvatarImage",
                                    "props": {
                                      "src": "/placeholder-user.jpg",
                                      "alt": "@shadcn"
                                    },
                                    "allowsChildren": true,
                                    "children": [],
                                    icon: undefined
                                  },
                                  {
                                    "id": "me87fdi6e",
                                    "name": "AvatarFallback",
                                    "type": "AvatarFallback",
                                    "props": {},
                                    "allowsChildren": true,
                                    "children": [
                                      {
                                        "id": "1727221118642530q5s54h",
                                        "name": "Text",
                                        "type": "text",
                                        "allowsChildren": false,
                                        "children": [],
                                        "props": {
                                          "content": "AC"
                                        },
                                        icon: undefined
                                      }
                                    ],
                                    icon: undefined
                                  }
                                ],
                                icon: undefined
                              },
                              {
                                "id": "7j4j07r7z",
                                "name": "div",
                                "type": "div",
                                "props": {
                                  "className": "flex-1 space-y-1"
                                },
                                "allowsChildren": true,
                                "children": [
                                  {
                                    "id": "a9ef73zus",
                                    "name": "div",
                                    "type": "div",
                                    "props": {
                                      "className": "flex items-center justify-between"
                                    },
                                    "allowsChildren": true,
                                    "children": [
                                      {
                                        "id": "r5hxp3jpv",
                                        "name": "p",
                                        "type": "p",
                                        "props": {
                                          "className": "font-medium"
                                        },
                                        "allowsChildren": true,
                                        "children": [
                                          {
                                            "id": "1727221118643m7bw8osqe",
                                            "name": "Text",
                                            "type": "text",
                                            "allowsChildren": false,
                                            "children": [],
                                            "props": {
                                              "content": "Bob Johnson"
                                            },
                                            icon: undefined
                                          }
                                        ],
                                        icon: undefined
                                      },
                                      {
                                        "id": "imj0urln7",
                                        "name": "p",
                                        "type": "p",
                                        "props": {
                                          "className": "text-xs text-muted-foreground"
                                        },
                                        "allowsChildren": true,
                                        "children": [
                                          {
                                            "id": "1727221118643gnda2h8i4",
                                            "name": "Text",
                                            "type": "text",
                                            "allowsChildren": false,
                                            "children": [],
                                            "props": {
                                              "content": "6h ago"
                                            },
                                            icon: undefined
                                          }
                                        ],
                                        icon: undefined
                                      }
                                    ],
                                    icon: undefined
                                  },
                                  {
                                    "id": "10an6zc5v",
                                    "name": "p",
                                    "type": "p",
                                    "props": {
                                      "className": "text-sm text-muted-foreground"
                                    },
                                    "allowsChildren": true,
                                    "children": [
                                      {
                                        "id": "1727221118644n2dluk5gx",
                                        "name": "Text",
                                        "type": "text",
                                        "allowsChildren": false,
                                        "children": [],
                                        "props": {
                                          "content": "Archived an old project."
                                        },
                                        icon: undefined
                                      }
                                    ],
                                    icon: undefined
                                  }
                                ],
                                icon: undefined
                              }
                            ],
                            icon: undefined
                          }
                        ],
                        icon: undefined
                      }
                    ],
                    icon: undefined
                  }
                ],
                icon: undefined
              },
              {
                "id": "hzmethekq",
                "name": "Card",
                "type": "Card",
                "props": {},
                "allowsChildren": true,
                "children": [
                  {
                    "id": "epo477ysj",
                    "name": "CardHeader",
                    "type": "CardHeader",
                    "props": {
                      "className": "flex flex-row items-center justify-between pb-2"
                    },
                    "allowsChildren": true,
                    "children": [
                      {
                        "id": "62rywu95n",
                        "name": "CardTitle",
                        "type": "CardTitle",
                        "props": {
                          "className": "text-sm font-medium"
                        },
                        "allowsChildren": true,
                        "children": [
                          {
                            "id": "17272211186463fkgtvjpf",
                            "name": "Text",
                            "type": "text",
                            "allowsChildren": false,
                            "children": [],
                            "props": {
                              "content": "System Alerts"
                            },
                            icon: undefined
                          }
                        ],
                        icon: undefined
                      },
                      {
                        "id": "1r99tdjps",
                        "name": "BadgeAlertIcon",
                        "type": "BadgeAlertIcon",
                        "props": {
                          "className": "w-4 h-4 text-muted-foreground"
                        },
                        "allowsChildren": true,
                        "children": [],
                        icon: undefined
                      }
                    ],
                    icon: undefined
                  },
                  {
                    "id": "2zv0rchh9",
                    "name": "CardContent",
                    "type": "CardContent",
                    "props": {},
                    "allowsChildren": true,
                    "children": [
                      {
                        "id": "9u0oaj7z1",
                        "name": "div",
                        "type": "div",
                        "props": {
                          "className": "grid gap-4"
                        },
                        "allowsChildren": true,
                        "children": [
                          {
                            "id": "0fp2yu2f4",
                            "name": "div",
                            "type": "div",
                            "props": {
                              "className": "flex items-start gap-3"
                            },
                            "allowsChildren": true,
                            "children": [
                              {
                                "id": "1kab7h8xk",
                                "name": "div",
                                "type": "div",
                                "props": {
                                  "className": "rounded-full bg-red-500 text-white p-2"
                                },
                                "allowsChildren": true,
                                "children": [
                                  {
                                    "id": "lqby5o3br",
                                    "name": "BadgeAlertIcon",
                                    "type": "BadgeAlertIcon",
                                    "props": {
                                      "className": "w-4 h-4"
                                    },
                                    "allowsChildren": true,
                                    "children": [],
                                    icon: undefined
                                  }
                                ],
                                icon: undefined
                              },
                              {
                                "id": "l4xhlhkrv",
                                "name": "div",
                                "type": "div",
                                "props": {
                                  "className": "flex-1 space-y-1"
                                },
                                "allowsChildren": true,
                                "children": [
                                  {
                                    "id": "rs24spauu",
                                    "name": "p",
                                    "type": "p",
                                    "props": {
                                      "className": "font-medium"
                                    },
                                    "allowsChildren": true,
                                    "children": [
                                      {
                                        "id": "1727221118652gbhfvfbj0",
                                        "name": "Text",
                                        "type": "text",
                                        "allowsChildren": false,
                                        "children": [],
                                        "props": {
                                          "content": "Server Overload"
                                        },
                                        icon: undefined
                                      }
                                    ],
                                    icon: undefined
                                  },
                                  {
                                    "id": "snplmg1j3",
                                    "name": "p",
                                    "type": "p",
                                    "props": {
                                      "className": "text-sm text-muted-foreground"
                                    },
                                    "allowsChildren": true,
                                    "children": [
                                      {
                                        "id": "1727221118652nm70w49mf",
                                        "name": "Text",
                                        "type": "text",
                                        "allowsChildren": false,
                                        "children": [],
                                        "props": {
                                          "content": "Server usage has exceeded 90%. Please investigate and take action."
                                        },
                                        icon: undefined
                                      }
                                    ],
                                    icon: undefined
                                  }
                                ],
                                icon: undefined
                              }
                            ],
                            icon: undefined
                          },
                          {
                            "id": "16f0y1q4f",
                            "name": "div",
                            "type": "div",
                            "props": {
                              "className": "flex items-start gap-3"
                            },
                            "allowsChildren": true,
                            "children": [
                              {
                                "id": "x7cnczpu3",
                                "name": "div",
                                "type": "div",
                                "props": {
                                  "className": "rounded-full bg-yellow-500 text-white p-2"
                                },
                                "allowsChildren": true,
                                "children": [
                                  {
                                    "id": "sp1idmrbx",
                                    "name": "BadgeAlertIcon",
                                    "type": "BadgeAlertIcon",
                                    "props": {
                                      "className": "w-4 h-4"
                                    },
                                    "allowsChildren": true,
                                    "children": [],
                                    icon: undefined
                                  }
                                ],
                                icon: undefined
                              },
                              {
                                "id": "ejdnneg3m",
                                "name": "div",
                                "type": "div",
                                "props": {
                                  "className": "flex-1 space-y-1"
                                },
                                "allowsChildren": true,
                                "children": [
                                  {
                                    "id": "azz0aa3nq",
                                    "name": "p",
                                    "type": "p",
                                    "props": {
                                      "className": "font-medium"
                                    },
                                    "allowsChildren": true,
                                    "children": [
                                      {
                                        "id": "1727221118654e49weenmg",
                                        "name": "Text",
                                        "type": "text",
                                        "allowsChildren": false,
                                        "children": [],
                                        "props": {
                                          "content": "Disk Space Low"
                                        },
                                        icon: undefined
                                      }
                                    ],
                                    icon: undefined
                                  },
                                  {
                                    "id": "755ye3bnv",
                                    "name": "p",
                                    "type": "p",
                                    "props": {
                                      "className": "text-sm text-muted-foreground"
                                    },
                                    "allowsChildren": true,
                                    "children": [
                                      {
                                        "id": "17272211186543iu128wed",
                                        "name": "Text",
                                        "type": "text",
                                        "allowsChildren": false,
                                        "children": [],
                                        "props": {
                                          "content": "Disk space is running low. Please free up some space or consider upgrading."
                                        },
                                        icon: undefined
                                      }
                                    ],
                                    icon: undefined
                                  }
                                ],
                                icon: undefined
                              }
                            ],
                            icon: undefined
                          },
                          {
                            "id": "fvoz3zhf1",
                            "name": "div",
                            "type": "div",
                            "props": {
                              "className": "flex items-start gap-3"
                            },
                            "allowsChildren": true,
                            "children": [
                              {
                                "id": "sus5u8her",
                                "name": "div",
                                "type": "div",
                                "props": {
                                  "className": "rounded-full bg-green-500 text-white p-2"
                                },
                                "allowsChildren": true,
                                "children": [
                                  {
                                    "id": "kaph5cm9m",
                                    "name": "BadgeAlertIcon",
                                    "type": "BadgeAlertIcon",
                                    "props": {
                                      "className": "w-4 h-4"
                                    },
                                    "allowsChildren": true,
                                    "children": [],
                                    icon: undefined
                                  }
                                ],
                                icon: undefined
                              },
                              {
                                "id": "0pl09km2e",
                                "name": "div",
                                "type": "div",
                                "props": {
                                  "className": "flex-1 space-y-1"
                                },
                                "allowsChildren": true,
                                "children": [
                                  {
                                    "id": "xapq3ne8t",
                                    "name": "p",
                                    "type": "p",
                                    "props": {
                                      "className": "font-medium"
                                    },
                                    "allowsChildren": true,
                                    "children": [
                                      {
                                        "id": "1727221118656lh3k7m82z",
                                        "name": "Text",
                                        "type": "text",
                                        "allowsChildren": false,
                                        "children": [],
                                        "props": {
                                          "content": "New Feature Released"
                                        },
                                        icon: undefined
                                      }
                                    ],
                                    icon: undefined
                                  },
                                  {
                                    "id": "hoczsdie2",
                                    "name": "p",
                                    "type": "p",
                                    "props": {
                                      "className": "text-sm text-muted-foreground"
                                    },
                                    "allowsChildren": true,
                                    "children": [
                                      {
                                        "id": "17272211186562k8a3bw3y",
                                        "name": "Text",
                                        "type": "text",
                                        "allowsChildren": false,
                                        "children": [],
                                        "props": {
                                          "content": "A new feature has been released. Check the release notes for more information."
                                        },
                                        icon: undefined
                                      }
                                    ],
                                    icon: undefined
                                  }
                                ],
                                icon: undefined
                              }
                            ],
                            icon: undefined
                          }
                        ],
                        icon: undefined
                      }
                    ],
                    icon: undefined
                  }
                ],
                icon: undefined
              },
              {
                "id": "5ddtyaakp",
                "name": "Card",
                "type": "Card",
                "props": {},
                "allowsChildren": true,
                "children": [
                  {
                    "id": "x5ixxhdvt",
                    "name": "CardHeader",
                    "type": "CardHeader",
                    "props": {
                      "className": "flex flex-row items-center justify-between pb-2"
                    },
                    "allowsChildren": true,
                    "children": [
                      {
                        "id": "qkcyemmhx",
                        "name": "CardTitle",
                        "type": "CardTitle",
                        "props": {
                          "className": "text-sm font-medium"
                        },
                        "allowsChildren": true,
                        "children": [
                          {
                            "id": "1727221118659y24bioz3h",
                            "name": "Text",
                            "type": "text",
                            "allowsChildren": false,
                            "children": [],
                            "props": {
                              "content": "Frequent Actions"
                            },
                            icon: undefined
                          }
                        ],
                        icon: undefined
                      },
                      {
                        "id": "06xiyg4qr",
                        "name": "RocketIcon",
                        "type": "RocketIcon",
                        "props": {
                          "className": "w-4 h-4 text-muted-foreground"
                        },
                        "allowsChildren": true,
                        "children": [],
                        icon: undefined
                      }
                    ],
                    icon: undefined
                  },
                  {
                    "id": "bqiup79cp",
                    "name": "CardContent",
                    "type": "CardContent",
                    "props": {},
                    "allowsChildren": true,
                    "children": [
                      {
                        "id": "g6ycd0vld",
                        "name": "div",
                        "type": "div",
                        "props": {
                          "className": "grid grid-cols-2 gap-4"
                        },
                        "allowsChildren": true,
                        "children": [
                          {
                            "id": "zg0vsyqjn",
                            "name": "Button",
                            "type": "Button",
                            "props": {
                              "variant": "outline",
                              "size": "sm"
                            },
                            "allowsChildren": true,
                            "children": [
                              {
                                "id": "1beoed5nk",
                                "name": "PlusIcon",
                                "type": "PlusIcon",
                                "props": {
                                  "className": "w-4 h-4 mr-2"
                                },
                                "allowsChildren": true,
                                "children": [],
                                icon: undefined
                              },
                              {
                                "id": "1727221118661it05tizlt",
                                "name": "Text",
                                "type": "text",
                                "allowsChildren": false,
                                "children": [],
                                "props": {
                                  "content": "Add User"
                                },
                                icon: undefined
                              }
                            ],
                            icon: undefined
                          },
                          {
                            "id": "ganmv518o",
                            "name": "Button",
                            "type": "Button",
                            "props": {
                              "variant": "outline",
                              "size": "sm"
                            },
                            "allowsChildren": true,
                            "children": [
                              {
                                "id": "big44blq3",
                                "name": "FileIcon",
                                "type": "FileIcon",
                                "props": {
                                  "className": "w-4 h-4 mr-2"
                                },
                                "allowsChildren": true,
                                "children": [],
                                icon: undefined
                              },
                              {
                                "id": "1727221118662fx9wlel71",
                                "name": "Text",
                                "type": "text",
                                "allowsChildren": false,
                                "children": [],
                                "props": {
                                  "content": "Generate Report"
                                },
                                icon: undefined
                              }
                            ],
                            icon: undefined
                          },
                          {
                            "id": "m4i83qif5",
                            "name": "Button",
                            "type": "Button",
                            "props": {
                              "variant": "outline",
                              "size": "sm"
                            },
                            "allowsChildren": true,
                            "children": [
                              {
                                "id": "vi7u0qexj",
                                "name": "SettingsIcon",
                                "type": "SettingsIcon",
                                "props": {
                                  "className": "w-4 h-4 mr-2"
                                },
                                "allowsChildren": true,
                                "children": [],
                                icon: undefined
                              },
                              {
                                "id": "1727221118662zy7rjs4le",
                                "name": "Text",
                                "type": "text",
                                "allowsChildren": false,
                                "children": [],
                                "props": {
                                  "content": "Manage Tools"
                                },
                                icon: undefined
                              }
                            ],
                            icon: undefined
                          },
                          {
                            "id": "f0i8tj9tr",
                            "name": "Button",
                            "type": "Button",
                            "props": {
                              "variant": "outline",
                              "size": "sm"
                            },
                            "allowsChildren": true,
                            "children": [
                              {
                                "id": "e4cec53or",
                                "name": "DollarSignIcon",
                                "type": "DollarSignIcon",
                                "props": {
                                  "className": "w-4 h-4 mr-2"
                                },
                                "allowsChildren": true,
                                "children": [],
                                icon: undefined
                              },
                              {
                                "id": "1727221118662ez4xdxpxd",
                                "name": "Text",
                                "type": "text",
                                "allowsChildren": false,
                                "children": [],
                                "props": {
                                  "content": "View Financials"
                                },
                                icon: undefined
                              }
                            ],
                            icon: undefined
                          }
                        ],
                        icon: undefined
                      }
                    ],
                    icon: undefined
                  }
                ],
                icon: undefined
              }
            ],
            icon: undefined
          }
        ],
        icon: undefined
      }
    ],
    icon: undefined
  }
]

const dashboardSection2: TreeItem[] = [
  {
    "id": "mjnrwcqfq",
    "name": "Dashboard Section2",
    "type": "div",
    "props": {
      "className": "grid min-h-screen w-full grid-cols-[280px_1fr_280px]"
    },
    "allowsChildren": true,
    "children": [
      {
        "id": "j4xq5qmix",
        "name": "div",
        "type": "div",
        "props": {
          "className": "flex flex-col gap-4 border-r bg-muted/40 p-4"
        },
        "allowsChildren": true,
        "children": [
          {
            "id": "82ym6tgt2",
            "name": "div",
            "type": "div",
            "props": {
              "className": "flex h-[60px] items-center border-b"
            },
            "allowsChildren": true,
            "children": [
              {
                "id": "j5bfdgci4",
                "name": "Link",
                "type": "Link",
                "props": {
                  "href": "#",
                  "className": "flex items-center gap-2 font-semibold",
                  "prefetch": null
                },
                "allowsChildren": true,
                "children": [
                  {
                    "id": "w1oyd9r9u",
                    "name": "BarChartIcon",
                    "type": "BarChartIcon",
                    "props": {
                      "className": "h-6 w-6"
                    },
                    "allowsChildren": true,
                    "children": [],
                    icon: undefined
                  },
                  {
                    "id": "xsya0yss0",
                    "name": "span",
                    "type": "span",
                    "props": {},
                    "allowsChildren": true,
                    "children": [
                      {
                        "id": "17272214214838u17ws2ab",
                        "name": "Text",
                        "type": "text",
                        "allowsChildren": false,
                        "children": [],
                        "props": {
                          "content": "Data Analytics"
                        },
                        icon: undefined
                      }
                    ],
                    icon: undefined
                  }
                ],
                icon: undefined
              },
              {
                "id": "uwrgbiqzv",
                "name": "Button",
                "type": "Button",
                "props": {
                  "variant": "outline",
                  "size": "icon",
                  "className": "ml-auto h-8 w-8"
                },
                "allowsChildren": true,
                "children": [
                  {
                    "id": "ewzmvvgwa",
                    "name": "BellIcon",
                    "type": "BellIcon",
                    "props": {
                      "className": "h-4 w-4"
                    },
                    "allowsChildren": true,
                    "children": [],
                    icon: undefined
                  },
                  {
                    "id": "twiqe5xkd",
                    "name": "span",
                    "type": "span",
                    "props": {
                      "className": "sr-only"
                    },
                    "allowsChildren": true,
                    "children": [
                      {
                        "id": "17272214214900lgxch9o4",
                        "name": "Text",
                        "type": "text",
                        "allowsChildren": false,
                        "children": [],
                        "props": {
                          "content": "Toggle notifications"
                        },
                        icon: undefined
                      }
                    ],
                    icon: undefined
                  }
                ],
                icon: undefined
              }
            ],
            icon: undefined
          },
          {
            "id": "jkop8uy36",
            "name": "nav",
            "type": "nav",
            "props": {
              "className": "grid gap-2 text-sm font-medium"
            },
            "allowsChildren": true,
            "children": [
              {
                "id": "8f6md5pmb",
                "name": "Link",
                "type": "Link",
                "props": {
                  "href": "#",
                  "className": "flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-colors hover:bg-accent hover:text-accent-foreground",
                  "prefetch": null
                },
                "allowsChildren": true,
                "children": [
                  {
                    "id": "izkndv3kw",
                    "name": "HomeIcon",
                    "type": "HomeIcon",
                    "props": {
                      "className": "h-4 w-4"
                    },
                    "allowsChildren": true,
                    "children": [],
                    icon: undefined
                  },
                  {
                    "id": "1727221421498oxffs1d48",
                    "name": "Text",
                    "type": "text",
                    "allowsChildren": false,
                    "children": [],
                    "props": {
                      "content": "Dashboard"
                    },
                    icon: undefined
                  }
                ],
                icon: undefined
              },
              {
                "id": "vmrvt61vg",
                "name": "Link",
                "type": "Link",
                "props": {
                  "href": "#",
                  "className": "flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-colors hover:bg-accent hover:text-accent-foreground",
                  "prefetch": null
                },
                "allowsChildren": true,
                "children": [
                  {
                    "id": "mq035q7gj",
                    "name": "BarChartIcon",
                    "type": "BarChartIcon",
                    "props": {
                      "className": "h-4 w-4"
                    },
                    "allowsChildren": true,
                    "children": [],
                    icon: undefined
                  },
                  {
                    "id": "17272214214996kw57lqzp",
                    "name": "Text",
                    "type": "text",
                    "allowsChildren": false,
                    "children": [],
                    "props": {
                      "content": "Analytics"
                    },
                    icon: undefined
                  }
                ],
                icon: undefined
              },
              {
                "id": "5yu1nppr6",
                "name": "Link",
                "type": "Link",
                "props": {
                  "href": "#",
                  "className": "flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-colors hover:bg-accent hover:text-accent-foreground",
                  "prefetch": null
                },
                "allowsChildren": true,
                "children": [
                  {
                    "id": "92k8mief9",
                    "name": "PieChartIcon",
                    "type": "PieChartIcon",
                    "props": {
                      "className": "h-4 w-4"
                    },
                    "allowsChildren": true,
                    "children": [],
                    icon: undefined
                  },
                  {
                    "id": "17272214215019utlg6n79",
                    "name": "Text",
                    "type": "text",
                    "allowsChildren": false,
                    "children": [],
                    "props": {
                      "content": "Reports"
                    },
                    icon: undefined
                  }
                ],
                icon: undefined
              },
              {
                "id": "2v4p21kp6",
                "name": "Link",
                "type": "Link",
                "props": {
                  "href": "#",
                  "className": "flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-colors hover:bg-accent hover:text-accent-foreground",
                  "prefetch": null
                },
                "allowsChildren": true,
                "children": [
                  {
                    "id": "v5cg0xhs4",
                    "name": "PenToolIcon",
                    "type": "PenToolIcon",
                    "props": {
                      "className": "h-4 w-4"
                    },
                    "allowsChildren": true,
                    "children": [],
                    icon: undefined
                  },
                  {
                    "id": "1727221421503kaaw5fcbf",
                    "name": "Text",
                    "type": "text",
                    "allowsChildren": false,
                    "children": [],
                    "props": {
                      "content": "Tools"
                    },
                    icon: undefined
                  }
                ],
                icon: undefined
              },
              {
                "id": "hkretcjvx",
                "name": "Link",
                "type": "Link",
                "props": {
                  "href": "#",
                  "className": "flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-colors hover:bg-accent hover:text-accent-foreground",
                  "prefetch": null
                },
                "allowsChildren": true,
                "children": [
                  {
                    "id": "8pj4iwzpp",
                    "name": "SettingsIcon",
                    "type": "SettingsIcon",
                    "props": {
                      "className": "h-4 w-4"
                    },
                    "allowsChildren": true,
                    "children": [],
                    icon: undefined
                  },
                  {
                    "id": "172722142150547fzbthno",
                    "name": "Text",
                    "type": "text",
                    "allowsChildren": false,
                    "children": [],
                    "props": {
                      "content": "Settings"
                    },
                    icon: undefined
                  }
                ],
                icon: undefined
              }
            ],
            icon: undefined
          }
        ],
        icon: undefined
      },
      {
        "id": "a0ru95vcm",
        "name": "div",
        "type": "div",
        "props": {
          "className": "flex flex-col"
        },
        "allowsChildren": true,
        "children": [
          {
            "id": "cnlicivfs",
            "name": "header",
            "type": "header",
            "props": {
              "className": "flex h-14 items-center gap-4 border-b bg-muted/40 px-6"
            },
            "allowsChildren": true,
            "children": [
              {
                "id": "t3bfeme33",
                "name": "div",
                "type": "div",
                "props": {
                  "className": "w-full flex-1"
                },
                "allowsChildren": true,
                "children": [
                  {
                    "id": "435a87j9x",
                    "name": "form",
                    "type": "form",
                    "props": {},
                    "allowsChildren": true,
                    "children": [
                      {
                        "id": "ruoi5im5n",
                        "name": "div",
                        "type": "div",
                        "props": {
                          "className": "relative"
                        },
                        "allowsChildren": true,
                        "children": [
                          {
                            "id": "xer5yy800",
                            "name": "SearchIcon",
                            "type": "SearchIcon",
                            "props": {
                              "className": "absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground"
                            },
                            "allowsChildren": true,
                            "children": [],
                            icon: undefined
                          },
                          {
                            "id": "o45ieo3ps",
                            "name": "Input",
                            "type": "Input",
                            "props": {
                              "type": "search",
                              "placeholder": "Search",
                              "className": "w-full bg-background shadow-none appearance-none pl-8 md:w-2/3 lg:w-1/3"
                            },
                            "allowsChildren": true,
                            "children": [],
                            icon: undefined
                          }
                        ],
                        icon: undefined
                      }
                    ],
                    icon: undefined
                  }
                ],
                icon: undefined
              },
              {
                "id": "0zvn0rfy8",
                "name": "DropdownMenu",
                "type": "DropdownMenu",
                "props": {},
                "allowsChildren": true,
                "children": [
                  {
                    "id": "tzk2eoc0w",
                    "name": "DropdownMenuTrigger",
                    "type": "DropdownMenuTrigger",
                    "props": {
                      "asChild": true
                    },
                    "allowsChildren": true,
                    "children": [
                      {
                        "id": "ibxl5ho5a",
                        "name": "Button",
                        "type": "Button",
                        "props": {
                          "variant": "ghost",
                          "size": "icon",
                          "className": "rounded-full border w-8 h-8"
                        },
                        "allowsChildren": true,
                        "children": [
                          {
                            "id": "dwur0uki3",
                            "name": "img",
                            "type": "img",
                            "props": {
                              "src": "/placeholder.svg",
                              "width": "32",
                              "height": "32",
                              "className": "rounded-full",
                              "alt": "Avatar",
                              "style": null
                            },
                            "allowsChildren": true,
                            "children": [],
                            icon: undefined
                          },
                          {
                            "id": "t0t1sumtf",
                            "name": "span",
                            "type": "span",
                            "props": {
                              "className": "sr-only"
                            },
                            "allowsChildren": true,
                            "children": [
                              {
                                "id": "17272214215459es1ky7y3",
                                "name": "Text",
                                "type": "text",
                                "allowsChildren": false,
                                "children": [],
                                "props": {
                                  "content": "Toggle user menu"
                                },
                                icon: undefined
                              }
                            ],
                            icon: undefined
                          }
                        ],
                        icon: undefined
                      }
                    ],
                    icon: undefined
                  },
                  {
                    "id": "poqlxag7f",
                    "name": "DropdownMenuContent",
                    "type": "DropdownMenuContent",
                    "props": {
                      "align": "end"
                    },
                    "allowsChildren": true,
                    "children": [
                      {
                        "id": "xqshjibsy",
                        "name": "DropdownMenuLabel",
                        "type": "DropdownMenuLabel",
                        "props": {},
                        "allowsChildren": true,
                        "children": [
                          {
                            "id": "1727221421547u1a7da6fy",
                            "name": "Text",
                            "type": "text",
                            "allowsChildren": false,
                            "children": [],
                            "props": {
                              "content": "My Account"
                            },
                            icon: undefined
                          }
                        ],
                        icon: undefined
                      },
                      {
                        "id": "ywk6p3j70",
                        "name": "DropdownMenuSeparator",
                        "type": "DropdownMenuSeparator",
                        "props": {},
                        "allowsChildren": true,
                        "children": [],
                        icon: undefined
                      },
                      {
                        "id": "fnjl20ev0",
                        "name": "DropdownMenuItem",
                        "type": "DropdownMenuItem",
                        "props": {},
                        "allowsChildren": true,
                        "children": [
                          {
                            "id": "1727221421548v2nzprwo9",
                            "name": "Text",
                            "type": "text",
                            "allowsChildren": false,
                            "children": [],
                            "props": {
                              "content": "Settings"
                            },
                            icon: undefined
                          }
                        ],
                        icon: undefined
                      },
                      {
                        "id": "ukdr6psw1",
                        "name": "DropdownMenuItem",
                        "type": "DropdownMenuItem",
                        "props": {},
                        "allowsChildren": true,
                        "children": [
                          {
                            "id": "1727221421549xo0ldqc3e",
                            "name": "Text",
                            "type": "text",
                            "allowsChildren": false,
                            "children": [],
                            "props": {
                              "content": "Support"
                            },
                            icon: undefined
                          }
                        ],
                        icon: undefined
                      },
                      {
                        "id": "4qumvs0bq",
                        "name": "DropdownMenuSeparator",
                        "type": "DropdownMenuSeparator",
                        "props": {},
                        "allowsChildren": true,
                        "children": [],
                        icon: undefined
                      },
                      {
                        "id": "zd028yzpr",
                        "name": "DropdownMenuItem",
                        "type": "DropdownMenuItem",
                        "props": {},
                        "allowsChildren": true,
                        "children": [
                          {
                            "id": "1727221421549w6dnwu4ef",
                            "name": "Text",
                            "type": "text",
                            "allowsChildren": false,
                            "children": [],
                            "props": {
                              "content": "Logout"
                            },
                            icon: undefined
                          }
                        ],
                        icon: undefined
                      }
                    ],
                    icon: undefined
                  }
                ],
                icon: undefined
              }
            ],
            icon: undefined
          },
          {
            "id": "sqdbx1my3",
            "name": "main",
            "type": "main",
            "props": {
              "className": "flex-1 p-6"
            },
            "allowsChildren": true,
            "children": [
              {
                "id": "zrh6tprxp",
                "name": "div",
                "type": "div",
                "props": {
                  "className": "grid gap-6"
                },
                "allowsChildren": true,
                "children": [
                  {
                    "id": "0ozvc8937",
                    "name": "div",
                    "type": "div",
                    "props": {
                      "className": "grid md:grid-cols-2 lg:grid-cols-3 gap-6"
                    },
                    "allowsChildren": true,
                    "children": [
                      {
                        "id": "i9ux02rgg",
                        "name": "Card",
                        "type": "Card",
                        "props": {},
                        "allowsChildren": true,
                        "children": [
                          {
                            "id": "l893ddpho",
                            "name": "CardHeader",
                            "type": "CardHeader",
                            "props": {},
                            "allowsChildren": true,
                            "children": [
                              {
                                "id": "14m6gjquz",
                                "name": "CardTitle",
                                "type": "CardTitle",
                                "props": {},
                                "allowsChildren": true,
                                "children": [
                                  {
                                    "id": "1727221421579xsozx1o0h",
                                    "name": "Text",
                                    "type": "text",
                                    "allowsChildren": false,
                                    "children": [],
                                    "props": {
                                      "content": "Overview"
                                    },
                                    icon: undefined
                                  }
                                ],
                                icon: undefined
                              },
                              {
                                "id": "qbt377roj",
                                "name": "CardDescription",
                                "type": "CardDescription",
                                "props": {},
                                "allowsChildren": true,
                                "children": [
                                  {
                                    "id": "172722142158032c0gua71",
                                    "name": "Text",
                                    "type": "text",
                                    "allowsChildren": false,
                                    "children": [],
                                    "props": {
                                      "content": "Get a high-level view of your data analytics."
                                    },
                                    icon: undefined
                                  }
                                ],
                                icon: undefined
                              }
                            ],
                            icon: undefined
                          },
                          {
                            "id": "cv081vmz3",
                            "name": "CardContent",
                            "type": "CardContent",
                            "props": {},
                            "allowsChildren": true,
                            "children": [
                              {
                                "id": "63bqmq48h",
                                "name": "LineChart",
                                "type": "LineChart",
                                "props": {
                                  "className": "aspect-[4/3]"
                                },
                                "allowsChildren": true,
                                "children": [],
                                icon: undefined
                              }
                            ],
                            icon: undefined
                          }
                        ],
                        icon: undefined
                      },
                      {
                        "id": "gq4pfmwgj",
                        "name": "Card",
                        "type": "Card",
                        "props": {},
                        "allowsChildren": true,
                        "children": [
                          {
                            "id": "89g3ljveq",
                            "name": "CardHeader",
                            "type": "CardHeader",
                            "props": {},
                            "allowsChildren": true,
                            "children": [
                              {
                                "id": "ce7h5rkr1",
                                "name": "CardTitle",
                                "type": "CardTitle",
                                "props": {},
                                "allowsChildren": true,
                                "children": [
                                  {
                                    "id": "1727221421584u8vkdtl29",
                                    "name": "Text",
                                    "type": "text",
                                    "allowsChildren": false,
                                    "children": [],
                                    "props": {
                                      "content": "Analytics Tools"
                                    },
                                    icon: undefined
                                  }
                                ],
                                icon: undefined
                              },
                              {
                                "id": "s3m8x3fl1",
                                "name": "CardDescription",
                                "type": "CardDescription",
                                "props": {},
                                "allowsChildren": true,
                                "children": [
                                  {
                                    "id": "17272214215848nh1u3t2k",
                                    "name": "Text",
                                    "type": "text",
                                    "allowsChildren": false,
                                    "children": [],
                                    "props": {
                                      "content": "Leverage our suite of data analysis tools."
                                    },
                                    icon: undefined
                                  }
                                ],
                                icon: undefined
                              }
                            ],
                            icon: undefined
                          },
                          {
                            "id": "qazpfwfio",
                            "name": "CardContent",
                            "type": "CardContent",
                            "props": {},
                            "allowsChildren": true,
                            "children": [
                              {
                                "id": "0fr3za602",
                                "name": "div",
                                "type": "div",
                                "props": {
                                  "className": "grid gap-4"
                                },
                                "allowsChildren": true,
                                "children": [
                                  {
                                    "id": "cstufbwz1",
                                    "name": "Link",
                                    "type": "Link",
                                    "props": {
                                      "href": "#",
                                      "className": "flex items-center gap-3 rounded-lg bg-muted px-4 py-3 text-muted-foreground transition-colors hover:bg-accent hover:text-accent-foreground",
                                      "prefetch": null
                                    },
                                    "allowsChildren": true,
                                    "children": [
                                      {
                                        "id": "fpvqkv4v0",
                                        "name": "BarChartIcon",
                                        "type": "BarChartIcon",
                                        "props": {
                                          "className": "h-5 w-5"
                                        },
                                        "allowsChildren": true,
                                        "children": [],
                                        icon: undefined
                                      },
                                      {
                                        "id": "q3kp57pdw",
                                        "name": "span",
                                        "type": "span",
                                        "props": {},
                                        "allowsChildren": true,
                                        "children": [
                                          {
                                            "id": "17272214215929zuftprt2",
                                            "name": "Text",
                                            "type": "text",
                                            "allowsChildren": false,
                                            "children": [],
                                            "props": {
                                              "content": "Visualizations"
                                            },
                                            icon: undefined
                                          }
                                        ],
                                        icon: undefined
                                      }
                                    ],
                                    icon: undefined
                                  },
                                  {
                                    "id": "j4d6k3b96",
                                    "name": "Link",
                                    "type": "Link",
                                    "props": {
                                      "href": "#",
                                      "className": "flex items-center gap-3 rounded-lg bg-muted px-4 py-3 text-muted-foreground transition-colors hover:bg-accent hover:text-accent-foreground",
                                      "prefetch": null
                                    },
                                    "allowsChildren": true,
                                    "children": [
                                      {
                                        "id": "wytp0vpg2",
                                        "name": "PieChartIcon",
                                        "type": "PieChartIcon",
                                        "props": {
                                          "className": "h-5 w-5"
                                        },
                                        "allowsChildren": true,
                                        "children": [],
                                        icon: undefined
                                      },
                                      {
                                        "id": "azlw7f9hy",
                                        "name": "span",
                                        "type": "span",
                                        "props": {},
                                        "allowsChildren": true,
                                        "children": [
                                          {
                                            "id": "172722142159469d7y1l24",
                                            "name": "Text",
                                            "type": "text",
                                            "allowsChildren": false,
                                            "children": [],
                                            "props": {
                                              "content": "Reporting"
                                            },
                                            icon: undefined
                                          }
                                        ],
                                        icon: undefined
                                      }
                                    ],
                                    icon: undefined
                                  },
                                  {
                                    "id": "no3juzz78",
                                    "name": "Link",
                                    "type": "Link",
                                    "props": {
                                      "href": "#",
                                      "className": "flex items-center gap-3 rounded-lg bg-muted px-4 py-3 text-muted-foreground transition-colors hover:bg-accent hover:text-accent-foreground",
                                      "prefetch": null
                                    },
                                    "allowsChildren": true,
                                    "children": [
                                      {
                                        "id": "hmjhi6awk",
                                        "name": "PenToolIcon",
                                        "type": "PenToolIcon",
                                        "props": {
                                          "className": "h-5 w-5"
                                        },
                                        "allowsChildren": true,
                                        "children": [],
                                        icon: undefined
                                      },
                                      {
                                        "id": "cbwy7w3tf",
                                        "name": "span",
                                        "type": "span",
                                        "props": {},
                                        "allowsChildren": true,
                                        "children": [
                                          {
                                            "id": "17272214215977869dw98r",
                                            "name": "Text",
                                            "type": "text",
                                            "allowsChildren": false,
                                            "children": [],
                                            "props": {
                                              "content": "Dashboards"
                                            },
                                            icon: undefined
                                          }
                                        ],
                                        icon: undefined
                                      }
                                    ],
                                    icon: undefined
                                  }
                                ],
                                icon: undefined
                              }
                            ],
                            icon: undefined
                          }
                        ],
                        icon: undefined
                      },
                      {
                        "id": "y1auk35u4",
                        "name": "Card",
                        "type": "Card",
                        "props": {},
                        "allowsChildren": true,
                        "children": [
                          {
                            "id": "am1w0oe8l",
                            "name": "CardHeader",
                            "type": "CardHeader",
                            "props": {},
                            "allowsChildren": true,
                            "children": [
                              {
                                "id": "fh0h2h1pc",
                                "name": "CardTitle",
                                "type": "CardTitle",
                                "props": {},
                                "allowsChildren": true,
                                "children": [
                                  {
                                    "id": "1727221421628q5ztodld8",
                                    "name": "Text",
                                    "type": "text",
                                    "allowsChildren": false,
                                    "children": [],
                                    "props": {
                                      "content": "Reports"
                                    },
                                    icon: undefined
                                  }
                                ],
                                icon: undefined
                              },
                              {
                                "id": "003bh9mkh",
                                "name": "CardDescription",
                                "type": "CardDescription",
                                "props": {},
                                "allowsChildren": true,
                                "children": [
                                  {
                                    "id": "17272214216298z7axg4yl",
                                    "name": "Text",
                                    "type": "text",
                                    "allowsChildren": false,
                                    "children": [],
                                    "props": {
                                      "content": "Access your latest data reports and insights."
                                    },
                                    icon: undefined
                                  }
                                ],
                                icon: undefined
                              }
                            ],
                            icon: undefined
                          },
                          {
                            "id": "k8ypgtnf6",
                            "name": "CardContent",
                            "type": "CardContent",
                            "props": {},
                            "allowsChildren": true,
                            "children": [
                              {
                                "id": "cdjmy3vwi",
                                "name": "div",
                                "type": "div",
                                "props": {
                                  "className": "grid gap-4"
                                },
                                "allowsChildren": true,
                                "children": [
                                  {
                                    "id": "7nl5hq9t1",
                                    "name": "Link",
                                    "type": "Link",
                                    "props": {
                                      "href": "#",
                                      "className": "flex items-center gap-3 rounded-lg bg-muted px-4 py-3 text-muted-foreground transition-colors hover:bg-accent hover:text-accent-foreground",
                                      "prefetch": null
                                    },
                                    "allowsChildren": true,
                                    "children": [
                                      {
                                        "id": "0hcfhgr7c",
                                        "name": "FileTextIcon",
                                        "type": "FileTextIcon",
                                        "props": {
                                          "className": "h-5 w-5"
                                        },
                                        "allowsChildren": true,
                                        "children": [],
                                        icon: undefined
                                      },
                                      {
                                        "id": "l20vmkae2",
                                        "name": "span",
                                        "type": "span",
                                        "props": {},
                                        "allowsChildren": true,
                                        "children": [
                                          {
                                            "id": "1727221421633xlia30o02",
                                            "name": "Text",
                                            "type": "text",
                                            "allowsChildren": false,
                                            "children": [],
                                            "props": {
                                              "content": "Monthly Report"
                                            },
                                            icon: undefined
                                          }
                                        ],
                                        icon: undefined
                                      }
                                    ],
                                    icon: undefined
                                  },
                                  {
                                    "id": "xj9u1dap5",
                                    "name": "Link",
                                    "type": "Link",
                                    "props": {
                                      "href": "#",
                                      "className": "flex items-center gap-3 rounded-lg bg-muted px-4 py-3 text-muted-foreground transition-colors hover:bg-accent hover:text-accent-foreground",
                                      "prefetch": null
                                    },
                                    "allowsChildren": true,
                                    "children": [
                                      {
                                        "id": "msgds1uxo",
                                        "name": "FileTextIcon",
                                        "type": "FileTextIcon",
                                        "props": {
                                          "className": "h-5 w-5"
                                        },
                                        "allowsChildren": true,
                                        "children": [],
                                        icon: undefined
                                      },
                                      {
                                        "id": "9vbajpyqh",
                                        "name": "span",
                                        "type": "span",
                                        "props": {},
                                        "allowsChildren": true,
                                        "children": [
                                          {
                                            "id": "17272214216347ngxe0jop",
                                            "name": "Text",
                                            "type": "text",
                                            "allowsChildren": false,
                                            "children": [],
                                            "props": {
                                              "content": "Quarterly Report"
                                            },
                                            icon: undefined
                                          }
                                        ],
                                        icon: undefined
                                      }
                                    ],
                                    icon: undefined
                                  },
                                  {
                                    "id": "je0j23m01",
                                    "name": "Link",
                                    "type": "Link",
                                    "props": {
                                      "href": "#",
                                      "className": "flex items-center gap-3 rounded-lg bg-muted px-4 py-3 text-muted-foreground transition-colors hover:bg-accent hover:text-accent-foreground",
                                      "prefetch": null
                                    },
                                    "allowsChildren": true,
                                    "children": [
                                      {
                                        "id": "ixahlzme0",
                                        "name": "FileTextIcon",
                                        "type": "FileTextIcon",
                                        "props": {
                                          "className": "h-5 w-5"
                                        },
                                        "allowsChildren": true,
                                        "children": [],
                                        icon: undefined
                                      },
                                      {
                                        "id": "qmjofrgm4",
                                        "name": "span",
                                        "type": "span",
                                        "props": {},
                                        "allowsChildren": true,
                                        "children": [
                                          {
                                            "id": "17272214216370305r15ca",
                                            "name": "Text",
                                            "type": "text",
                                            "allowsChildren": false,
                                            "children": [],
                                            "props": {
                                              "content": "Annual Report"
                                            },
                                            icon: undefined
                                          }
                                        ],
                                        icon: undefined
                                      }
                                    ],
                                    icon: undefined
                                  }
                                ],
                                icon: undefined
                              }
                            ],
                            icon: undefined
                          }
                        ],
                        icon: undefined
                      }
                    ],
                    icon: undefined
                  },
                  {
                    "id": "c6vhhddtq",
                    "name": "div",
                    "type": "div",
                    "props": {
                      "className": "grid md:grid-cols-2 lg:grid-cols-3 gap-6"
                    },
                    "allowsChildren": true,
                    "children": [
                      {
                        "id": "ty9dn7xex",
                        "name": "Card",
                        "type": "Card",
                        "props": {},
                        "allowsChildren": true,
                        "children": [
                          {
                            "id": "ofm2kjqcn",
                            "name": "CardHeader",
                            "type": "CardHeader",
                            "props": {},
                            "allowsChildren": true,
                            "children": [
                              {
                                "id": "k6tpidios",
                                "name": "CardTitle",
                                "type": "CardTitle",
                                "props": {},
                                "allowsChildren": true,
                                "children": [
                                  {
                                    "id": "1727221421646kmo6m2o11",
                                    "name": "Text",
                                    "type": "text",
                                    "allowsChildren": false,
                                    "children": [],
                                    "props": {
                                      "content": "Upcoming Events"
                                    },
                                    icon: undefined
                                  }
                                ],
                                icon: undefined
                              },
                              {
                                "id": "ubeu403mh",
                                "name": "CardDescription",
                                "type": "CardDescription",
                                "props": {},
                                "allowsChildren": true,
                                "children": [
                                  {
                                    "id": "17272214216473nzyrcydr",
                                    "name": "Text",
                                    "type": "text",
                                    "allowsChildren": false,
                                    "children": [],
                                    "props": {
                                      "content": "Stay up-to-date with our upcoming data analytics events."
                                    },
                                    icon: undefined
                                  }
                                ],
                                icon: undefined
                              }
                            ],
                            icon: undefined
                          },
                          {
                            "id": "pfo5acfwa",
                            "name": "CardContent",
                            "type": "CardContent",
                            "props": {},
                            "allowsChildren": true,
                            "children": [
                              {
                                "id": "f21es7mrh",
                                "name": "div",
                                "type": "div",
                                "props": {
                                  "className": "grid gap-4"
                                },
                                "allowsChildren": true,
                                "children": [
                                  {
                                    "id": "u87073hv3",
                                    "name": "div",
                                    "type": "div",
                                    "props": {
                                      "className": "flex items-center gap-3"
                                    },
                                    "allowsChildren": true,
                                    "children": [
                                      {
                                        "id": "wnn9mq8fw",
                                        "name": "div",
                                        "type": "div",
                                        "props": {
                                          "className": "flex h-10 w-10 items-center justify-center rounded-full bg-muted"
                                        },
                                        "allowsChildren": true,
                                        "children": [
                                          {
                                            "id": "nqer80081",
                                            "name": "CalendarIcon",
                                            "type": "CalendarIcon",
                                            "props": {
                                              "className": "h-5 w-5 text-muted-foreground"
                                            },
                                            "allowsChildren": true,
                                            "children": [],
                                            icon: undefined
                                          }
                                        ],
                                        icon: undefined
                                      },
                                      {
                                        "id": "sm2k44cdq",
                                        "name": "div",
                                        "type": "div",
                                        "props": {},
                                        "allowsChildren": true,
                                        "children": [
                                          {
                                            "id": "n4wlmjlau",
                                            "name": "div",
                                            "type": "div",
                                            "props": {
                                              "className": "font-medium"
                                            },
                                            "allowsChildren": true,
                                            "children": [
                                              {
                                                "id": "1727221421657rogrdzxh6",
                                                "name": "Text",
                                                "type": "text",
                                                "allowsChildren": false,
                                                "children": [],
                                                "props": {
                                                  "content": "Data Analytics Summit"
                                                },
                                                icon: undefined
                                              }
                                            ],
                                            icon: undefined
                                          },
                                          {
                                            "id": "mfycqb6qw",
                                            "name": "div",
                                            "type": "div",
                                            "props": {
                                              "className": "text-sm text-muted-foreground"
                                            },
                                            "allowsChildren": true,
                                            "children": [
                                              {
                                                "id": "17272214216591837eg79y",
                                                "name": "Text",
                                                "type": "text",
                                                "allowsChildren": false,
                                                "children": [],
                                                "props": {
                                                  "content": "June 15, 2023"
                                                },
                                                icon: undefined
                                              }
                                            ],
                                            icon: undefined
                                          }
                                        ],
                                        icon: undefined
                                      }
                                    ],
                                    icon: undefined
                                  },
                                  {
                                    "id": "64xp2xsq5",
                                    "name": "div",
                                    "type": "div",
                                    "props": {
                                      "className": "flex items-center gap-3"
                                    },
                                    "allowsChildren": true,
                                    "children": [
                                      {
                                        "id": "f81jmg4nf",
                                        "name": "div",
                                        "type": "div",
                                        "props": {
                                          "className": "flex h-10 w-10 items-center justify-center rounded-full bg-muted"
                                        },
                                        "allowsChildren": true,
                                        "children": [
                                          {
                                            "id": "75jv3ra6s",
                                            "name": "CalendarIcon",
                                            "type": "CalendarIcon",
                                            "props": {
                                              "className": "h-5 w-5 text-muted-foreground"
                                            },
                                            "allowsChildren": true,
                                            "children": [],
                                            icon: undefined
                                          }
                                        ],
                                        icon: undefined
                                      },
                                      {
                                        "id": "tvsbqta3g",
                                        "name": "div",
                                        "type": "div",
                                        "props": {},
                                        "allowsChildren": true,
                                        "children": [
                                          {
                                            "id": "p9r3813bp",
                                            "name": "div",
                                            "type": "div",
                                            "props": {
                                              "className": "font-medium"
                                            },
                                            "allowsChildren": true,
                                            "children": [
                                              {
                                                "id": "1727221421665xjxlo3j9p",
                                                "name": "Text",
                                                "type": "text",
                                                "allowsChildren": false,
                                                "children": [],
                                                "props": {
                                                  "content": "Data Visualization Workshop"
                                                },
                                                icon: undefined
                                              }
                                            ],
                                            icon: undefined
                                          },
                                          {
                                            "id": "08bdtlpt5",
                                            "name": "div",
                                            "type": "div",
                                            "props": {
                                              "className": "text-sm text-muted-foreground"
                                            },
                                            "allowsChildren": true,
                                            "children": [
                                              {
                                                "id": "1727221421666rpv1304rx",
                                                "name": "Text",
                                                "type": "text",
                                                "allowsChildren": false,
                                                "children": [],
                                                "props": {
                                                  "content": "July 20, 2023"
                                                },
                                                icon: undefined
                                              }
                                            ],
                                            icon: undefined
                                          }
                                        ],
                                        icon: undefined
                                      }
                                    ],
                                    icon: undefined
                                  },
                                  {
                                    "id": "76l4vp0z2",
                                    "name": "div",
                                    "type": "div",
                                    "props": {
                                      "className": "flex items-center gap-3"
                                    },
                                    "allowsChildren": true,
                                    "children": [
                                      {
                                        "id": "08a04oly3",
                                        "name": "div",
                                        "type": "div",
                                        "props": {
                                          "className": "flex h-10 w-10 items-center justify-center rounded-full bg-muted"
                                        },
                                        "allowsChildren": true,
                                        "children": [
                                          {
                                            "id": "isknucmx3",
                                            "name": "CalendarIcon",
                                            "type": "CalendarIcon",
                                            "props": {
                                              "className": "h-5 w-5 text-muted-foreground"
                                            },
                                            "allowsChildren": true,
                                            "children": [],
                                            icon: undefined
                                          }
                                        ],
                                        icon: undefined
                                      },
                                      {
                                        "id": "l5dd4oslq",
                                        "name": "div",
                                        "type": "div",
                                        "props": {},
                                        "allowsChildren": true,
                                        "children": [
                                          {
                                            "id": "re6de4glu",
                                            "name": "div",
                                            "type": "div",
                                            "props": {
                                              "className": "font-medium"
                                            },
                                            "allowsChildren": true,
                                            "children": [
                                              {
                                                "id": "17272214216723wb73lloy",
                                                "name": "Text",
                                                "type": "text",
                                                "allowsChildren": false,
                                                "children": [],
                                                "props": {
                                                  "content": "Data Storytelling Webinar"
                                                },
                                                icon: undefined
                                              }
                                            ],
                                            icon: undefined
                                          },
                                          {
                                            "id": "rw8qstya7",
                                            "name": "div",
                                            "type": "div",
                                            "props": {
                                              "className": "text-sm text-muted-foreground"
                                            },
                                            "allowsChildren": true,
                                            "children": [
                                              {
                                                "id": "17272214216724n0my2sv0",
                                                "name": "Text",
                                                "type": "text",
                                                "allowsChildren": false,
                                                "children": [],
                                                "props": {
                                                  "content": "August 10, 2023"
                                                },
                                                icon: undefined
                                              }
                                            ],
                                            icon: undefined
                                          }
                                        ],
                                        icon: undefined
                                      }
                                    ],
                                    icon: undefined
                                  }
                                ],
                                icon: undefined
                              }
                            ],
                            icon: undefined
                          }
                        ],
                        icon: undefined
                      },
                      {
                        "id": "f3ui8vzeu",
                        "name": "Card",
                        "type": "Card",
                        "props": {},
                        "allowsChildren": true,
                        "children": [
                          {
                            "id": "ahbv5u4os",
                            "name": "CardHeader",
                            "type": "CardHeader",
                            "props": {},
                            "allowsChildren": true,
                            "children": [
                              {
                                "id": "bx1gbu9b4",
                                "name": "CardTitle",
                                "type": "CardTitle",
                                "props": {},
                                "allowsChildren": true,
                                "children": [
                                  {
                                    "id": "17272214216798sh24yog2",
                                    "name": "Text",
                                    "type": "text",
                                    "allowsChildren": false,
                                    "children": [],
                                    "props": {
                                      "content": "Related Resources"
                                    },
                                    icon: undefined
                                  }
                                ],
                                icon: undefined
                              },
                              {
                                "id": "htasvk690",
                                "name": "CardDescription",
                                "type": "CardDescription",
                                "props": {},
                                "allowsChildren": true,
                                "children": [
                                  {
                                    "id": "1727221421679rj8x7zs6x",
                                    "name": "Text",
                                    "type": "text",
                                    "allowsChildren": false,
                                    "children": [],
                                    "props": {
                                      "content": "Explore our collection of data analytics resources."
                                    },
                                    icon: undefined
                                  }
                                ],
                                icon: undefined
                              }
                            ],
                            icon: undefined
                          },
                          {
                            "id": "ksp82ktdd",
                            "name": "CardContent",
                            "type": "CardContent",
                            "props": {},
                            "allowsChildren": true,
                            "children": [
                              {
                                "id": "4sb9ok02o",
                                "name": "div",
                                "type": "div",
                                "props": {
                                  "className": "grid gap-4"
                                },
                                "allowsChildren": true,
                                "children": [
                                  {
                                    "id": "dj1nsb35r",
                                    "name": "Link",
                                    "type": "Link",
                                    "props": {
                                      "href": "#",
                                      "className": "flex items-center gap-3 rounded-lg bg-muted px-4 py-3 text-muted-foreground transition-colors hover:bg-accent hover:text-accent-foreground",
                                      "prefetch": null
                                    },
                                    "allowsChildren": true,
                                    "children": [
                                      {
                                        "id": "wfy4yk199",
                                        "name": "BookIcon",
                                        "type": "BookIcon",
                                        "props": {
                                          "className": "h-5 w-5"
                                        },
                                        "allowsChildren": true,
                                        "children": [],
                                        icon: undefined
                                      },
                                      {
                                        "id": "gz6ypeywh",
                                        "name": "span",
                                        "type": "span",
                                        "props": {},
                                        "allowsChildren": true,
                                        "children": [
                                          {
                                            "id": "1727221421683otcgn9p47",
                                            "name": "Text",
                                            "type": "text",
                                            "allowsChildren": false,
                                            "children": [],
                                            "props": {
                                              "content": "Data Analytics Guides"
                                            },
                                            icon: undefined
                                          }
                                        ],
                                        icon: undefined
                                      }
                                    ],
                                    icon: undefined
                                  },
                                  {
                                    "id": "nai0gprpw",
                                    "name": "Link",
                                    "type": "Link",
                                    "props": {
                                      "href": "#",
                                      "className": "flex items-center gap-3 rounded-lg bg-muted px-4 py-3 text-muted-foreground transition-colors hover:bg-accent hover:text-accent-foreground",
                                      "prefetch": null
                                    },
                                    "allowsChildren": true,
                                    "children": [
                                      {
                                        "id": "3o9jk6coy",
                                        "name": "VideoIcon",
                                        "type": "VideoIcon",
                                        "props": {
                                          "className": "h-5 w-5"
                                        },
                                        "allowsChildren": true,
                                        "children": [],
                                        icon: undefined
                                      },
                                      {
                                        "id": "6fqvnlclf",
                                        "name": "span",
                                        "type": "span",
                                        "props": {},
                                        "allowsChildren": true,
                                        "children": [
                                          {
                                            "id": "17272214216855eflc1s5a",
                                            "name": "Text",
                                            "type": "text",
                                            "allowsChildren": false,
                                            "children": [],
                                            "props": {
                                              "content": "Data Analytics Tutorials"
                                            },
                                            icon: undefined
                                          }
                                        ],
                                        icon: undefined
                                      }
                                    ],
                                    icon: undefined
                                  },
                                  {
                                    "id": "4ef7i7wzc",
                                    "name": "Link",
                                    "type": "Link",
                                    "props": {
                                      "href": "#",
                                      "className": "flex items-center gap-3 rounded-lg bg-muted px-4 py-3 text-muted-foreground transition-colors hover:bg-accent hover:text-accent-foreground",
                                      "prefetch": null
                                    },
                                    "allowsChildren": true,
                                    "children": [
                                      {
                                        "id": "3xl0po88k",
                                        "name": "LinkIcon",
                                        "type": "LinkIcon",
                                        "props": {
                                          "className": "h-5 w-5"
                                        },
                                        "allowsChildren": true,
                                        "children": [],
                                        icon: undefined
                                      },
                                      {
                                        "id": "eagd9fxs1",
                                        "name": "span",
                                        "type": "span",
                                        "props": {},
                                        "allowsChildren": true,
                                        "children": [
                                          {
                                            "id": "1727221421688o171c6psg",
                                            "name": "Text",
                                            "type": "text",
                                            "allowsChildren": false,
                                            "children": [],
                                            "props": {
                                              "content": "Data Analytics Blogs"
                                            },
                                            icon: undefined
                                          }
                                        ],
                                        icon: undefined
                                      }
                                    ],
                                    icon: undefined
                                  }
                                ],
                                icon: undefined
                              }
                            ],
                            icon: undefined
                          }
                        ],
                        icon: undefined
                      },
                      {
                        "id": "j5gmue5kh",
                        "name": "Card",
                        "type": "Card",
                        "props": {},
                        "allowsChildren": true,
                        "children": [
                          {
                            "id": "v80bk442q",
                            "name": "CardHeader",
                            "type": "CardHeader",
                            "props": {},
                            "allowsChildren": true,
                            "children": [
                              {
                                "id": "guhkjeb3b",
                                "name": "CardTitle",
                                "type": "CardTitle",
                                "props": {},
                                "allowsChildren": true,
                                "children": [
                                  {
                                    "id": "1727221421693gdc87z8jj",
                                    "name": "Text",
                                    "type": "text",
                                    "allowsChildren": false,
                                    "children": [],
                                    "props": {
                                      "content": "Announcements"
                                    },
                                    icon: undefined
                                  }
                                ],
                                icon: undefined
                              },
                              {
                                "id": "bg3tha4wx",
                                "name": "CardDescription",
                                "type": "CardDescription",
                                "props": {},
                                "allowsChildren": true,
                                "children": [
                                  {
                                    "id": "17272214216934ogi6itia",
                                    "name": "Text",
                                    "type": "text",
                                    "allowsChildren": false,
                                    "children": [],
                                    "props": {
                                      "content": "Stay informed about the latest data analytics updates."
                                    },
                                    icon: undefined
                                  }
                                ],
                                icon: undefined
                              }
                            ],
                            icon: undefined
                          },
                          {
                            "id": "pckqfs3a5",
                            "name": "CardContent",
                            "type": "CardContent",
                            "props": {},
                            "allowsChildren": true,
                            "children": [
                              {
                                "id": "7h3ujza0p",
                                "name": "div",
                                "type": "div",
                                "props": {
                                  "className": "grid gap-4"
                                },
                                "allowsChildren": true,
                                "children": [
                                  {
                                    "id": "hgs0qcdjn",
                                    "name": "div",
                                    "type": "div",
                                    "props": {
                                      "className": "flex items-start gap-3"
                                    },
                                    "allowsChildren": true,
                                    "children": [
                                      {
                                        "id": "6viz7ae50",
                                        "name": "div",
                                        "type": "div",
                                        "props": {
                                          "className": "flex h-10 w-10 items-center justify-center rounded-full bg-muted"
                                        },
                                        "allowsChildren": true,
                                        "children": [
                                          {
                                            "id": "4h4thmrnj",
                                            "name": "MegaphoneIcon",
                                            "type": "MegaphoneIcon",
                                            "props": {
                                              "className": "h-5 w-5 text-muted-foreground"
                                            },
                                            "allowsChildren": true,
                                            "children": [],
                                            icon: undefined
                                          }
                                        ],
                                        icon: undefined
                                      },
                                      {
                                        "id": "0uyg1xs35",
                                        "name": "div",
                                        "type": "div",
                                        "props": {},
                                        "allowsChildren": true,
                                        "children": [
                                          {
                                            "id": "9u4qabnop",
                                            "name": "div",
                                            "type": "div",
                                            "props": {
                                              "className": "font-medium"
                                            },
                                            "allowsChildren": true,
                                            "children": [
                                              {
                                                "id": "1727221421699sgxojv8hm",
                                                "name": "Text",
                                                "type": "text",
                                                "allowsChildren": false,
                                                "children": [],
                                                "props": {
                                                  "content": "New Data Visualization Features Released"
                                                },
                                                icon: undefined
                                              }
                                            ],
                                            icon: undefined
                                          },
                                          {
                                            "id": "1us4im5vx",
                                            "name": "div",
                                            "type": "div",
                                            "props": {
                                              "className": "text-sm text-muted-foreground"
                                            },
                                            "allowsChildren": true,
                                            "children": [
                                              {
                                                "id": "17272214216993vp4m7m8t",
                                                "name": "Text",
                                                "type": "text",
                                                "allowsChildren": false,
                                                "children": [],
                                                "props": {
                                                  "content": "Check out our latest updates to our data visualization tools."
                                                },
                                                icon: undefined
                                              }
                                            ],
                                            icon: undefined
                                          }
                                        ],
                                        icon: undefined
                                      }
                                    ],
                                    icon: undefined
                                  },
                                  {
                                    "id": "runcygm41",
                                    "name": "div",
                                    "type": "div",
                                    "props": {
                                      "className": "flex items-start gap-3"
                                    },
                                    "allowsChildren": true,
                                    "children": [
                                      {
                                        "id": "wfjt6iewb",
                                        "name": "div",
                                        "type": "div",
                                        "props": {
                                          "className": "flex h-10 w-10 items-center justify-center rounded-full bg-muted"
                                        },
                                        "allowsChildren": true,
                                        "children": [
                                          {
                                            "id": "cmk9fy87f",
                                            "name": "MegaphoneIcon",
                                            "type": "MegaphoneIcon",
                                            "props": {
                                              "className": "h-5 w-5 text-muted-foreground"
                                            },
                                            "allowsChildren": true,
                                            "children": [],
                                            icon: undefined
                                          }
                                        ],
                                        icon: undefined
                                      },
                                      {
                                        "id": "aqs5mz26i",
                                        "name": "div",
                                        "type": "div",
                                        "props": {},
                                        "allowsChildren": true,
                                        "children": [
                                          {
                                            "id": "br05njbui",
                                            "name": "div",
                                            "type": "div",
                                            "props": {
                                              "className": "font-medium"
                                            },
                                            "allowsChildren": true,
                                            "children": [
                                              {
                                                "id": "1727221421702j5fvg65sv",
                                                "name": "Text",
                                                "type": "text",
                                                "allowsChildren": false,
                                                "children": [],
                                                "props": {
                                                  "content": "Upcoming Data Analytics Webinar"
                                                },
                                                icon: undefined
                                              }
                                            ],
                                            icon: undefined
                                          },
                                          {
                                            "id": "erukzu17w",
                                            "name": "div",
                                            "type": "div",
                                            "props": {
                                              "className": "text-sm text-muted-foreground"
                                            },
                                            "allowsChildren": true,
                                            "children": [
                                              {
                                                "id": "17272214217036ahclbiqk",
                                                "name": "Text",
                                                "type": "text",
                                                "allowsChildren": false,
                                                "children": [],
                                                "props": {
                                                  "content": "Join our experts for a deep dive into data analytics best practices."
                                                },
                                                icon: undefined
                                              }
                                            ],
                                            icon: undefined
                                          }
                                        ],
                                        icon: undefined
                                      }
                                    ],
                                    icon: undefined
                                  },
                                  {
                                    "id": "rljrg8i8v",
                                    "name": "div",
                                    "type": "div",
                                    "props": {
                                      "className": "flex items-start gap-3"
                                    },
                                    "allowsChildren": true,
                                    "children": [
                                      {
                                        "id": "9k4wcunu1",
                                        "name": "div",
                                        "type": "div",
                                        "props": {
                                          "className": "flex h-10 w-10 items-center justify-center rounded-full bg-muted"
                                        },
                                        "allowsChildren": true,
                                        "children": [
                                          {
                                            "id": "tjcyvkd9o",
                                            "name": "MegaphoneIcon",
                                            "type": "MegaphoneIcon",
                                            "props": {
                                              "className": "h-5 w-5 text-muted-foreground"
                                            },
                                            "allowsChildren": true,
                                            "children": [],
                                            icon: undefined
                                          }
                                        ],
                                        icon: undefined
                                      },
                                      {
                                        "id": "kfxv59ri7",
                                        "name": "div",
                                        "type": "div",
                                        "props": {},
                                        "allowsChildren": true,
                                        "children": [
                                          {
                                            "id": "wue0lrya4",
                                            "name": "div",
                                            "type": "div",
                                            "props": {
                                              "className": "font-medium"
                                            },
                                            "allowsChildren": true,
                                            "children": [
                                              {
                                                "id": "1727221421708sf0h6tgwf",
                                                "name": "Text",
                                                "type": "text",
                                                "allowsChildren": false,
                                                "children": [],
                                                "props": {
                                                  "content": "New Data Connectors Added"
                                                },
                                                icon: undefined
                                              }
                                            ],
                                            icon: undefined
                                          },
                                          {
                                            "id": "h5y96zaju",
                                            "name": "div",
                                            "type": "div",
                                            "props": {
                                              "className": "text-sm text-muted-foreground"
                                            },
                                            "allowsChildren": true,
                                            "children": [
                                              {
                                                "id": "17272214217089tiw2o1dm",
                                                "name": "Text",
                                                "type": "text",
                                                "allowsChildren": false,
                                                "children": [],
                                                "props": {
                                                  "content": "Integrate your data from more sources with our latest connectors."
                                                },
                                                icon: undefined
                                              }
                                            ],
                                            icon: undefined
                                          }
                                        ],
                                        icon: undefined
                                      }
                                    ],
                                    icon: undefined
                                  }
                                ],
                                icon: undefined
                              }
                            ],
                            icon: undefined
                          }
                        ],
                        icon: undefined
                      }
                    ],
                    icon: undefined
                  }
                ],
                icon: undefined
              }
            ],
            icon: undefined
          }
        ],
        icon: undefined
      },
      {
        "id": "t1jk6y2ju",
        "name": "div",
        "type": "div",
        "props": {
          "className": "flex flex-col gap-4 border-l bg-muted/40 p-4"
        },
        "allowsChildren": true,
        "children": [
          {
            "id": "gyrtsi75h",
            "name": "div",
            "type": "div",
            "props": {
              "className": "flex h-[60px] items-center border-b"
            },
            "allowsChildren": true,
            "children": [
              {
                "id": "f23nce0oq",
                "name": "h2",
                "type": "h2",
                "props": {
                  "className": "font-semibold"
                },
                "allowsChildren": true,
                "children": [
                  {
                    "id": "17272214217366ylso0k8h",
                    "name": "Text",
                    "type": "text",
                    "allowsChildren": false,
                    "children": [],
                    "props": {
                      "content": "Quick Links"
                    },
                    icon: undefined
                  }
                ],
                icon: undefined
              }
            ],
            icon: undefined
          },
          {
            "id": "m1gjwx1qt",
            "name": "nav",
            "type": "nav",
            "props": {
              "className": "grid gap-2 text-sm font-medium"
            },
            "allowsChildren": true,
            "children": [
              {
                "id": "3m23nrlzq",
                "name": "Link",
                "type": "Link",
                "props": {
                  "href": "#",
                  "className": "flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-colors hover:bg-accent hover:text-accent-foreground",
                  "prefetch": null
                },
                "allowsChildren": true,
                "children": [
                  {
                    "id": "cqzwrgh4y",
                    "name": "LinkIcon",
                    "type": "LinkIcon",
                    "props": {
                      "className": "h-4 w-4"
                    },
                    "allowsChildren": true,
                    "children": [],
                    icon: undefined
                  },
                  {
                    "id": "1727221421740vfevkx4ld",
                    "name": "Text",
                    "type": "text",
                    "allowsChildren": false,
                    "children": [],
                    "props": {
                      "content": "Data Analytics Blog"
                    },
                    icon: undefined
                  }
                ],
                icon: undefined
              },
              {
                "id": "atz2bgtk4",
                "name": "Link",
                "type": "Link",
                "props": {
                  "href": "#",
                  "className": "flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-colors hover:bg-accent hover:text-accent-foreground",
                  "prefetch": null
                },
                "allowsChildren": true,
                "children": [
                  {
                    "id": "wn3b7i142",
                    "name": "LinkIcon",
                    "type": "LinkIcon",
                    "props": {
                      "className": "h-4 w-4"
                    },
                    "allowsChildren": true,
                    "children": [],
                    icon: undefined
                  },
                  {
                    "id": "17272214217411xepuu2o7",
                    "name": "Text",
                    "type": "text",
                    "allowsChildren": false,
                    "children": [],
                    "props": {
                      "content": "Data Visualization Tools"
                    },
                    icon: undefined
                  }
                ],
                icon: undefined
              },
              {
                "id": "c0cpct6ok",
                "name": "Link",
                "type": "Link",
                "props": {
                  "href": "#",
                  "className": "flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-colors hover:bg-accent hover:text-accent-foreground",
                  "prefetch": null
                },
                "allowsChildren": true,
                "children": [
                  {
                    "id": "8zb9s9oru",
                    "name": "LinkIcon",
                    "type": "LinkIcon",
                    "props": {
                      "className": "h-4 w-4"
                    },
                    "allowsChildren": true,
                    "children": [],
                    icon: undefined
                  },
                  {
                    "id": "1727221421741j9ma1htac",
                    "name": "Text",
                    "type": "text",
                    "allowsChildren": false,
                    "children": [],
                    "props": {
                      "content": "Data Analytics Courses"
                    },
                    icon: undefined
                  }
                ],
                icon: undefined
              },
              {
                "id": "krohqykma",
                "name": "Link",
                "type": "Link",
                "props": {
                  "href": "#",
                  "className": "flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-colors hover:bg-accent hover:text-accent-foreground",
                  "prefetch": null
                },
                "allowsChildren": true,
                "children": [],
                icon: undefined
              }
            ],
            icon: undefined
          }
        ],
        icon: undefined
      }
    ]
  }
]

const singlePageSection: TreeItem[] = [
  {
    "id": "z5ew1ftna",
    "name": "Single Page Section",
    "type": "div",
    "props": {
      "className": "grid md:grid-cols-2 gap-6 lg:gap-12 items-start max-w-6xl px-4 mx-auto py-6"
    },
    "allowsChildren": true,
    "children": [
      {
        "id": "bjraa5ppt",
        "name": "div",
        "type": "div",
        "props": {
          "className": "grid gap-4 md:gap-10 items-start"
        },
        "allowsChildren": true,
        "children": [
          {
            "id": "1sc38qxq0",
            "name": "img",
            "type": "img",
            "props": {
              "src": "/placeholder.svg",
              "alt": "Product Image",
              "width": null,
              "height": null,
              "className": "aspect-[2/3] object-cover border w-full rounded-lg overflow-hidden"
            },
            "allowsChildren": true,
            "children": [],
            icon: undefined
          },
          {
            "id": "2q6mohpru",
            "name": "div",
            "type": "div",
            "props": {
              "className": "grid grid-cols-4 gap-3"
            },
            "allowsChildren": true,
            "children": [
              {
                "id": "lualxwhik",
                "name": "button",
                "type": "button",
                "props": {
                  "className": "border hover:border-primary rounded-lg overflow-hidden transition-colors"
                },
                "allowsChildren": true,
                "children": [
                  {
                    "id": "tj6e32elh",
                    "name": "img",
                    "type": "img",
                    "props": {
                      "src": "/placeholder.svg",
                      "alt": "Preview thumbnail",
                      "width": null,
                      "height": null,
                      "className": "aspect-[5/6] object-cover"
                    },
                    "allowsChildren": true,
                    "children": [],
                    icon: undefined
                  },
                  {
                    "id": "z406uz84o",
                    "name": "span",
                    "type": "span",
                    "props": {
                      "className": "sr-only"
                    },
                    "allowsChildren": true,
                    "children": [
                      {
                        "id": "1727221250399rovponu7b",
                        "name": "Text",
                        "type": "text",
                        "allowsChildren": false,
                        "children": [],
                        "props": {
                          "content": "View Image 1"
                        },
                        icon: undefined
                      }
                    ],
                    icon: undefined
                  }
                ],
                icon: undefined
              },
              {
                "id": "e7ezxyrt5",
                "name": "button",
                "type": "button",
                "props": {
                  "className": "border hover:border-primary rounded-lg overflow-hidden transition-colors"
                },
                "allowsChildren": true,
                "children": [
                  {
                    "id": "7nk2h44yx",
                    "name": "img",
                    "type": "img",
                    "props": {
                      "src": "/placeholder.svg",
                      "alt": "Preview thumbnail",
                      "width": null,
                      "height": null,
                      "className": "aspect-[5/6] object-cover"
                    },
                    "allowsChildren": true,
                    "children": [],
                    icon: undefined
                  },
                  {
                    "id": "4ye2cgvys",
                    "name": "span",
                    "type": "span",
                    "props": {
                      "className": "sr-only"
                    },
                    "allowsChildren": true,
                    "children": [
                      {
                        "id": "1727221250403o6z8y1iw7",
                        "name": "Text",
                        "type": "text",
                        "allowsChildren": false,
                        "children": [],
                        "props": {
                          "content": "View Image 2"
                        },
                        icon: undefined
                      }
                    ],
                    icon: undefined
                  }
                ],
                icon: undefined
              },
              {
                "id": "d7bjyustp",
                "name": "button",
                "type": "button",
                "props": {
                  "className": "border hover:border-primary rounded-lg overflow-hidden transition-colors"
                },
                "allowsChildren": true,
                "children": [
                  {
                    "id": "2klml2rn1",
                    "name": "img",
                    "type": "img",
                    "props": {
                      "src": "/placeholder.svg",
                      "alt": "Preview thumbnail",
                      "width": null,
                      "height": null,
                      "className": "aspect-[5/6] object-cover"
                    },
                    "allowsChildren": true,
                    "children": [],
                    icon: undefined
                  },
                  {
                    "id": "uzw7lhxgq",
                    "name": "span",
                    "type": "span",
                    "props": {
                      "className": "sr-only"
                    },
                    "allowsChildren": true,
                    "children": [
                      {
                        "id": "1727221250408pdf7ijhvl",
                        "name": "Text",
                        "type": "text",
                        "allowsChildren": false,
                        "children": [],
                        "props": {
                          "content": "View Image 3"
                        },
                        icon: undefined
                      }
                    ],
                    icon: undefined
                  }
                ],
                icon: undefined
              },
              {
                "id": "rqa47s7f1",
                "name": "button",
                "type": "button",
                "props": {
                  "className": "border hover:border-primary rounded-lg overflow-hidden transition-colors"
                },
                "allowsChildren": true,
                "children": [
                  {
                    "id": "t8ympzy0s",
                    "name": "img",
                    "type": "img",
                    "props": {
                      "src": "/placeholder.svg",
                      "alt": "Preview thumbnail",
                      "width": null,
                      "height": null,
                      "className": "aspect-[5/6] object-cover"
                    },
                    "allowsChildren": true,
                    "children": [],
                    icon: undefined
                  },
                  {
                    "id": "md5iu4hag",
                    "name": "span",
                    "type": "span",
                    "props": {
                      "className": "sr-only"
                    },
                    "allowsChildren": true,
                    "children": [
                      {
                        "id": "1727221250410fza2x62ax",
                        "name": "Text",
                        "type": "text",
                        "allowsChildren": false,
                        "children": [],
                        "props": {
                          "content": "View Image 4"
                        },
                        icon: undefined
                      }
                    ],
                    icon: undefined
                  }
                ],
                icon: undefined
              }
            ],
            icon: undefined
          }
        ],
        icon: undefined
      },
      {
        "id": "i74g77qnd",
        "name": "div",
        "type": "div",
        "props": {
          "className": "grid gap-4 md:gap-10 items-start"
        },
        "allowsChildren": true,
        "children": [
          {
            "id": "q6898lhi4",
            "name": "div",
            "type": "div",
            "props": {
              "className": "grid gap-4"
            },
            "allowsChildren": true,
            "children": [
              {
                "id": "2ug5olkas",
                "name": "h1",
                "type": "h1",
                "props": {
                  "className": "font-bold text-3xl lg:text-4xl"
                },
                "allowsChildren": true,
                "children": [
                  {
                    "id": "1727221250419238svj36b",
                    "name": "Text",
                    "type": "text",
                    "allowsChildren": false,
                    "children": [],
                    "props": {
                      "content": "Camiseta de Algodón Esculpida"
                    },
                    icon: undefined
                  }
                ],
                icon: undefined
              },
              {
                "id": "lbtm6sbqu",
                "name": "div",
                "type": "div",
                "props": {},
                "allowsChildren": true,
                "children": [
                  {
                    "id": "9emcflp2o",
                    "name": "p",
                    "type": "p",
                    "props": {},
                    "allowsChildren": true,
                    "children": [
                      {
                        "id": "1727221250421p8l4ikcxv",
                        "name": "Text",
                        "type": "text",
                        "allowsChildren": false,
                        "children": [],
                        "props": {
                          "content": "60% algodón peinado/40% poliéster jersey."
                        },
                        icon: undefined
                      }
                    ],
                    icon: undefined
                  }
                ],
                icon: undefined
              },
              {
                "id": "6z8p4e5kg",
                "name": "div",
                "type": "div",
                "props": {
                  "className": "flex items-center gap-4"
                },
                "allowsChildren": true,
                "children": [
                  {
                    "id": "9s5ziufel",
                    "name": "div",
                    "type": "div",
                    "props": {
                      "className": "flex items-center gap-0.5"
                    },
                    "allowsChildren": true,
                    "children": [
                      {
                        "id": "5ckago8kl",
                        "name": "StarIcon",
                        "type": "StarIcon",
                        "props": {
                          "className": "w-5 h-5 fill-primary"
                        },
                        "allowsChildren": true,
                        "children": [],
                        icon: undefined
                      },
                      {
                        "id": "bhpnytmu2",
                        "name": "StarIcon",
                        "type": "StarIcon",
                        "props": {
                          "className": "w-5 h-5 fill-primary"
                        },
                        "allowsChildren": true,
                        "children": [],
                        icon: undefined
                      },
                      {
                        "id": "425emsjvg",
                        "name": "StarIcon",
                        "type": "StarIcon",
                        "props": {
                          "className": "w-5 h-5 fill-primary"
                        },
                        "allowsChildren": true,
                        "children": [],
                        icon: undefined
                      },
                      {
                        "id": "wbkjhyy78",
                        "name": "StarIcon",
                        "type": "StarIcon",
                        "props": {
                          "className": "w-5 h-5 fill-muted stroke-muted-foreground"
                        },
                        "allowsChildren": true,
                        "children": [],
                        icon: undefined
                      },
                      {
                        "id": "sb6dpn7nq",
                        "name": "StarIcon",
                        "type": "StarIcon",
                        "props": {
                          "className": "w-5 h-5 fill-muted stroke-muted-foreground"
                        },
                        "allowsChildren": true,
                        "children": [],
                        icon: undefined
                      }
                    ],
                    icon: undefined
                  }
                ],
                icon: undefined
              },
              {
                "id": "tzwvnizbe",
                "name": "div",
                "type": "div",
                "props": {
                  "className": "text-4xl font-bold"
                },
                "allowsChildren": true,
                "children": [
                  {
                    "id": "1727221250425njrba6gh2",
                    "name": "Text",
                    "type": "text",
                    "allowsChildren": false,
                    "children": [],
                    "props": {
                      "content": "$49.99"
                    },
                    icon: undefined
                  }
                ],
                icon: undefined
              }
            ],
            icon: undefined
          },
          {
            "id": "267eeny1s",
            "name": "form",
            "type": "form",
            "props": {
              "className": "grid gap-4 md:gap-10"
            },
            "allowsChildren": true,
            "children": [
              {
                "id": "awnwcp612",
                "name": "div",
                "type": "div",
                "props": {
                  "className": "grid gap-2"
                },
                "allowsChildren": true,
                "children": [
                  {
                    "id": "53pgn4n8z",
                    "name": "Label",
                    "type": "Label",
                    "props": {
                      "htmlFor": "color",
                      "className": "text-base"
                    },
                    "allowsChildren": true,
                    "children": [
                      {
                        "id": "1727221250430ckpl6dz6n",
                        "name": "Text",
                        "type": "text",
                        "allowsChildren": false,
                        "children": [],
                        "props": {
                          "content": "Color"
                        },
                        icon: undefined
                      }
                    ],
                    icon: undefined
                  },
                  {
                    "id": "rqnzichlq",
                    "name": "RadioGroup",
                    "type": "RadioGroup",
                    "props": {
                      "id": "color",
                      "defaultValue": "black",
                      "className": "flex items-center gap-2"
                    },
                    "allowsChildren": true,
                    "children": [
                      {
                        "id": "wille4787",
                        "name": "Label",
                        "type": "Label",
                        "props": {
                          "htmlFor": "color-black",
                          "className": "border cursor-pointer rounded-md p-2 flex items-center gap-2 [&:has(:checked)]:bg-muted"
                        },
                        "allowsChildren": true,
                        "children": [
                          {
                            "id": "3rx5jnlfx",
                            "name": "RadioGroupItem",
                            "type": "RadioGroupItem",
                            "props": {
                              "id": "color-black",
                              "value": "black"
                            },
                            "allowsChildren": true,
                            "children": [],
                            icon: undefined
                          },
                          {
                            "id": "1727221250432noemiyd57",
                            "name": "Text",
                            "type": "text",
                            "allowsChildren": false,
                            "children": [],
                            "props": {
                              "content": "Negro"
                            },
                            icon: undefined
                          }
                        ],
                        icon: undefined
                      },
                      {
                        "id": "quo0mmu4x",
                        "name": "Label",
                        "type": "Label",
                        "props": {
                          "htmlFor": "color-white",
                          "className": "border cursor-pointer rounded-md p-2 flex items-center gap-2 [&:has(:checked)]:bg-muted"
                        },
                        "allowsChildren": true,
                        "children": [
                          {
                            "id": "hcoiuinoh",
                            "name": "RadioGroupItem",
                            "type": "RadioGroupItem",
                            "props": {
                              "id": "color-white",
                              "value": "white"
                            },
                            "allowsChildren": true,
                            "children": [],
                            icon: undefined
                          },
                          {
                            "id": "17272212504321v4n0bfbt",
                            "name": "Text",
                            "type": "text",
                            "allowsChildren": false,
                            "children": [],
                            "props": {
                              "content": "Blanco"
                            },
                            icon: undefined
                          }
                        ],
                        icon: undefined
                      },
                      {
                        "id": "r1i71jvr4",
                        "name": "Label",
                        "type": "Label",
                        "props": {
                          "htmlFor": "color-blue",
                          "className": "border cursor-pointer rounded-md p-2 flex items-center gap-2 [&:has(:checked)]:bg-muted"
                        },
                        "allowsChildren": true,
                        "children": [
                          {
                            "id": "9etop1l5j",
                            "name": "RadioGroupItem",
                            "type": "RadioGroupItem",
                            "props": {
                              "id": "color-blue",
                              "value": "blue"
                            },
                            "allowsChildren": true,
                            "children": [],
                            icon: undefined
                          },
                          {
                            "id": "1727221250433vyq86o2ik",
                            "name": "Text",
                            "type": "text",
                            "allowsChildren": false,
                            "children": [],
                            "props": {
                              "content": "Azul"
                            },
                            icon: undefined
                          }
                        ],
                        icon: undefined
                      }
                    ],
                    icon: undefined
                  }
                ],
                icon: undefined
              },
              {
                "id": "guru2e4qv",
                "name": "div",
                "type": "div",
                "props": {
                  "className": "grid gap-2"
                },
                "allowsChildren": true,
                "children": [
                  {
                    "id": "021hl2cu4",
                    "name": "Label",
                    "type": "Label",
                    "props": {
                      "htmlFor": "size",
                      "className": "text-base"
                    },
                    "allowsChildren": true,
                    "children": [
                      {
                        "id": "1727221250436vqwms81t6",
                        "name": "Text",
                        "type": "text",
                        "allowsChildren": false,
                        "children": [],
                        "props": {
                          "content": "Talla"
                        },
                        icon: undefined
                      }
                    ],
                    icon: undefined
                  },
                  {
                    "id": "63idaujnw",
                    "name": "RadioGroup",
                    "type": "RadioGroup",
                    "props": {
                      "id": "size",
                      "defaultValue": "m",
                      "className": "flex items-center gap-2"
                    },
                    "allowsChildren": true,
                    "children": [
                      {
                        "id": "ob4qdrvmy",
                        "name": "Label",
                        "type": "Label",
                        "props": {
                          "htmlFor": "size-xs",
                          "className": "border cursor-pointer rounded-md p-2 flex items-center gap-2 [&:has(:checked)]:bg-muted"
                        },
                        "allowsChildren": true,
                        "children": [
                          {
                            "id": "a6ktx23xc",
                            "name": "RadioGroupItem",
                            "type": "RadioGroupItem",
                            "props": {
                              "id": "size-xs",
                              "value": "xs"
                            },
                            "allowsChildren": true,
                            "children": [],
                            icon: undefined
                          },
                          {
                            "id": "1727221250438a2eltnf0z",
                            "name": "Text",
                            "type": "text",
                            "allowsChildren": false,
                            "children": [],
                            "props": {
                              "content": "XS"
                            },
                            icon: undefined
                          }
                        ],
                        icon: undefined
                      },
                      {
                        "id": "n2lrwndit",
                        "name": "Label",
                        "type": "Label",
                        "props": {
                          "htmlFor": "size-s",
                          "className": "border cursor-pointer rounded-md p-2 flex items-center gap-2 [&:has(:checked)]:bg-muted"
                        },
                        "allowsChildren": true,
                        "children": [
                          {
                            "id": "xslfd67sw",
                            "name": "RadioGroupItem",
                            "type": "RadioGroupItem",
                            "props": {
                              "id": "size-s",
                              "value": "s"
                            },
                            "allowsChildren": true,
                            "children": [],
                            icon: undefined
                          },
                          {
                            "id": "17272212504398tnjv1sz5",
                            "name": "Text",
                            "type": "text",
                            "allowsChildren": false,
                            "children": [],
                            "props": {
                              "content": "S"
                            },
                            icon: undefined
                          }
                        ],
                        icon: undefined
                      },
                      {
                        "id": "6q64txgy5",
                        "name": "Label",
                        "type": "Label",
                        "props": {
                          "htmlFor": "size-m",
                          "className": "border cursor-pointer rounded-md p-2 flex items-center gap-2 [&:has(:checked)]:bg-muted"
                        },
                        "allowsChildren": true,
                        "children": [
                          {
                            "id": "79ze64xyo",
                            "name": "RadioGroupItem",
                            "type": "RadioGroupItem",
                            "props": {
                              "id": "size-m",
                              "value": "m"
                            },
                            "allowsChildren": true,
                            "children": [],
                            icon: undefined
                          },
                          {
                            "id": "1727221250440hpauins0v",
                            "name": "Text",
                            "type": "text",
                            "allowsChildren": false,
                            "children": [],
                            "props": {
                              "content": "M"
                            },
                            icon: undefined
                          }
                        ],
                        icon: undefined
                      },
                      {
                        "id": "rwdb3ltm3",
                        "name": "Label",
                        "type": "Label",
                        "props": {
                          "htmlFor": "size-l",
                          "className": "border cursor-pointer rounded-md p-2 flex items-center gap-2 [&:has(:checked)]:bg-muted"
                        },
                        "allowsChildren": true,
                        "children": [
                          {
                            "id": "jd2kgfngz",
                            "name": "RadioGroupItem",
                            "type": "RadioGroupItem",
                            "props": {
                              "id": "size-l",
                              "value": "l"
                            },
                            "allowsChildren": true,
                            "children": [],
                            icon: undefined
                          },
                          {
                            "id": "17272212504412n4o87u5d",
                            "name": "Text",
                            "type": "text",
                            "allowsChildren": false,
                            "children": [],
                            "props": {
                              "content": "L"
                            },
                            icon: undefined
                          }
                        ],
                        icon: undefined
                      },
                      {
                        "id": "brs4z7x7z",
                        "name": "Label",
                        "type": "Label",
                        "props": {
                          "htmlFor": "size-xl",
                          "className": "border cursor-pointer rounded-md p-2 flex items-center gap-2 [&:has(:checked)]:bg-muted"
                        },
                        "allowsChildren": true,
                        "children": [
                          {
                            "id": "tvs3ugbfp",
                            "name": "RadioGroupItem",
                            "type": "RadioGroupItem",
                            "props": {
                              "id": "size-xl",
                              "value": "xl"
                            },
                            "allowsChildren": true,
                            "children": [],
                            icon: undefined
                          },
                          {
                            "id": "1727221250442xczhkfieg",
                            "name": "Text",
                            "type": "text",
                            "allowsChildren": false,
                            "children": [],
                            "props": {
                              "content": "XL"
                            },
                            icon: undefined
                          }
                        ],
                        icon: undefined
                      }
                    ],
                    icon: undefined
                  }
                ],
                icon: undefined
              },
              {
                "id": "fags399xi",
                "name": "div",
                "type": "div",
                "props": {
                  "className": "grid gap-2"
                },
                "allowsChildren": true,
                "children": [
                  {
                    "id": "ul1ucqftp",
                    "name": "Label",
                    "type": "Label",
                    "props": {
                      "htmlFor": "quantity",
                      "className": "text-base"
                    },
                    "allowsChildren": true,
                    "children": [
                      {
                        "id": "1727221250443z7knbuqun",
                        "name": "Text",
                        "type": "text",
                        "allowsChildren": false,
                        "children": [],
                        "props": {
                          "content": "Cantidad"
                        },
                        icon: undefined
                      }
                    ],
                    icon: undefined
                  },
                  {
                    "id": "zw58t07so",
                    "name": "Select",
                    "type": "Select",
                    "props": {
                      "defaultValue": "1"
                    },
                    "allowsChildren": true,
                    "children": [
                      {
                        "id": "56zodpp9w",
                        "name": "SelectTrigger",
                        "type": "SelectTrigger",
                        "props": {
                          "className": "w-24"
                        },
                        "allowsChildren": true,
                        "children": [
                          {
                            "id": "gbm1k40v2",
                            "name": "SelectValue",
                            "type": "SelectValue",
                            "props": {
                              "placeholder": "Seleccionar"
                            },
                            "allowsChildren": true,
                            "children": [],
                            icon: undefined
                          }
                        ],
                        icon: undefined
                      },
                      {
                        "id": "a7v4rv0mk",
                        "name": "SelectContent",
                        "type": "SelectContent",
                        "props": {},
                        "allowsChildren": true,
                        "children": [
                          {
                            "id": "w6iwxfx6r",
                            "name": "SelectItem",
                            "type": "SelectItem",
                            "props": {
                              "value": "1"
                            },
                            "allowsChildren": true,
                            "children": [
                              {
                                "id": "1727221250446ssm83yon8",
                                "name": "Text",
                                "type": "text",
                                "allowsChildren": false,
                                "children": [],
                                "props": {
                                  "content": "1"
                                },
                                icon: undefined
                              }
                            ],
                            icon: undefined
                          },
                          {
                            "id": "uiyr1sufs",
                            "name": "SelectItem",
                            "type": "SelectItem",
                            "props": {
                              "value": "2"
                            },
                            "allowsChildren": true,
                            "children": [
                              {
                                "id": "1727221250446vdu16ghc1",
                                "name": "Text",
                                "type": "text",
                                "allowsChildren": false,
                                "children": [],
                                "props": {
                                  "content": "2"
                                },
                                icon: undefined
                              }
                            ],
                            icon: undefined
                          },
                          {
                            "id": "17k2cbzlr",
                            "name": "SelectItem",
                            "type": "SelectItem",
                            "props": {
                              "value": "3"
                            },
                            "allowsChildren": true,
                            "children": [
                              {
                                "id": "172722125044729nz359ja",
                                "name": "Text",
                                "type": "text",
                                "allowsChildren": false,
                                "children": [],
                                "props": {
                                  "content": "3"
                                },
                                icon: undefined
                              }
                            ],
                            icon: undefined
                          },
                          {
                            "id": "3qrzbpxp8",
                            "name": "SelectItem",
                            "type": "SelectItem",
                            "props": {
                              "value": "4"
                            },
                            "allowsChildren": true,
                            "children": [
                              {
                                "id": "1727221250447isazvvzrq",
                                "name": "Text",
                                "type": "text",
                                "allowsChildren": false,
                                "children": [],
                                "props": {
                                  "content": "4"
                                },
                                icon: undefined
                              }
                            ],
                            icon: undefined
                          },
                          {
                            "id": "iez6qjlwk",
                            "name": "SelectItem",
                            "type": "SelectItem",
                            "props": {
                              "value": "5"
                            },
                            "allowsChildren": true,
                            "children": [
                              {
                                "id": "17272212504489zqmtvxtt",
                                "name": "Text",
                                "type": "text",
                                "allowsChildren": false,
                                "children": [],
                                "props": {
                                  "content": "5"
                                },
                                icon: undefined
                              }
                            ],
                            icon: undefined
                          }
                        ],
                        icon: undefined
                      }
                    ],
                    icon: undefined
                  }
                ],
                icon: undefined
              },
              {
                "id": "5kcl3zsqd",
                "name": "Button",
                "type": "Button",
                "props": {
                  "size": "lg"
                },
                "allowsChildren": true,
                "children": [
                  {
                    "id": "1727221250449mo2kjz9zb",
                    "name": "Text",
                    "type": "text",
                    "allowsChildren": false,
                    "children": [],
                    "props": {
                      "content": "Agregar al carrito"
                    },
                    icon: undefined
                  }
                ],
                icon: undefined
              }
            ],
            icon: undefined
          }
        ],
        icon: undefined
      }
    ],
    icon: undefined
  }
]

const presetSections: TreeItem[] = [
  headerSection[0],
  heroSection[0],
  heroSection2[0],
  heroSection3[0],
  featureSection[0],
  featureSection2[0],
  testimonialSection[0],
  testimonialSection2[0],
  pricingSection[0],
  callToActionSection[0],
  faqSection[0],
  faqSection2[0],
  teamSection[0],
  teamSection2[0],
  newsletterSection[0],
  newsletterSection2[0],
  footerSection[0],
  signUpSection[0],
  checkOutSection[0],
  contactSection[0],
  landingPageSection[0],
  miniAppSection[0],
  kanbanSection[0],
  reservationSection[0],
  profileSection[0],
  cardProfileSection[0],
  cookieSection[0],
  faqSection3[0],
  tweetSection[0],
  contactUsSection[0],
  musicAppSection[0],
  dashboardSection[0],
  dashboardSection2[0],
  singlePageSection[0],
]


export default function EnhancedTailwindEditor() {
  const [pages, setPages] = useState(["Home"]);
  const [currentPage, setCurrentPage] = useState("Home");
  const [pageContent, setPageContent] = useState<Record<string, TreeItem[]>>({
    Home: initialTree,
  });
  const [tree, setTree] = useState(initialTree);
  const [selectedItem, setSelectedItem] = useState<TreeItem | null>(null);
  const [history, setHistory] = useState<Record<string, TreeItem[][]>>({
    Home: [initialTree],
  });
  const [historyIndex, setHistoryIndex] = useState<Record<string, number>>({
    Home: 0,
  });
  const [previewMode, setPreviewMode] = useState<
    "desktop" | "tablet" | "mobile"
  >("desktop");
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const [generatedCode, setGeneratedCode] = useState("");
  const [rawCode, setRawCode] = useState("");
  const [rawCodeTsx, setRawCodeTsx] = useState("");

  const { theme, setTheme } = useTheme()

  const handleSelect = useCallback((item: TreeItem) => {
    setSelectedItem(item);
  }, []);

  const handleMove = useCallback(
    (draggedId: string, targetId: string) => {
      const newTree = JSON.parse(JSON.stringify(pageContent[currentPage]));
      const findAndRemove = (items: TreeItem[]): TreeItem | null => {
        for (let i = 0; i < items.length; i++) {
          if (items[i].id === draggedId) {
            return items.splice(i, 1)[0];
          }
          if (items[i].children) {
            const found = findAndRemove(items[i].children!);
            if (found) return found;
          }
        }
        return null;
      };
      const draggedItem = findAndRemove(newTree);
      if (!draggedItem) return;

      const findAndInsert = (items: TreeItem[]) => {
        for (let i = 0; i < items.length; i++) {
          const currentItem = items[i] ?? { allowsChildren: false, children: [] };
          if (currentItem.id === targetId) {
            if (currentItem.allowsChildren) {
              if (!currentItem.children) currentItem.children = [];
              currentItem.children.push(draggedItem);
            } else {
              items.splice(i + 1, 0, draggedItem);
            }
            return true;
          }
          if (currentItem.children && findAndInsert(currentItem.children)) {
            return true;
          }
        }
        return false;
      };
      findAndInsert(newTree);
      setPageContent((prev) => ({ ...prev, [currentPage]: newTree }));
      setTree(newTree);
      addToHistory(newTree);
    },
    [currentPage, pageContent],
  );

  const handleRemove = useCallback(
    (id: string) => {
      const newTree = JSON.parse(JSON.stringify(pageContent[currentPage]));
      const removeItem = (items: TreeItem[]) => {
        for (let i = 0; i < items.length; i++) {
          if (items[i].id === id) {
            items.splice(i, 1);
            return true;
          }
          if (items[i].children && removeItem(items[i].children!)) {
            return true;
          }
        }
        return false;
      };
      removeItem(newTree);
      setPageContent((prev) => ({ ...prev, [currentPage]: newTree }));
      setTree(newTree);
      addToHistory(newTree);
    },
    [currentPage, pageContent],
  );

  const handleRename = useCallback(
    (id: string, newName: string) => {
      const newTree = JSON.parse(JSON.stringify(pageContent[currentPage]));
      const renameItem = (items: TreeItem[]) => {
        for (let i = 0; i < items.length; i++) {
          if (items[i].id === id) {
            items[i].name = newName;
            return true;
          }
          if (items[i].children && renameItem(items[i].children!)) {
            return true;
          }
        }
        return false;
      };
      renameItem(newTree);
      setPageContent((prev) => ({ ...prev, [currentPage]: newTree }));
      setTree(newTree);
      addToHistory(newTree);
    },
    [currentPage, pageContent],
  );

  const addToHistory = (newTree: TreeItem[]) => {
    setHistory((prev) => {
      const newHistory = { ...prev };
      if (!newHistory[currentPage]) {
        newHistory[currentPage] = [];
      }
      newHistory[currentPage] = [
        ...newHistory[currentPage].slice(0, historyIndex[currentPage] + 1),
        newTree,
      ];
      return newHistory;
    });
    setHistoryIndex((prev) => ({
      ...prev,
      [currentPage]: (prev[currentPage] || 0) + 1,
    }));
  };

  const handleUpdate = useCallback(
    (id: string, updates: Partial<TreeItem>) => {
      const newTree = JSON.parse(JSON.stringify(pageContent[currentPage]));
      const updateItem = (items: TreeItem[]) => {
        for (let i = 0; i < items.length; i++) {
          let currentItem = items[i] ?? { allowsChildren: false, children: [] };
          if (currentItem.id === id) {
            currentItem = { ...currentItem, ...updates };
            return true;
          }
          if (currentItem.children && updateItem(currentItem.children)) {
            return true;
          }
        }
        return false;
      };
      updateItem(newTree);
      setPageContent((prev) => ({ ...prev, [currentPage]: newTree }));
      setTree(newTree);
      addToHistory(newTree);
    },
    [currentPage, pageContent, addToHistory],
  );

  const undo = () => {
    if (historyIndex[currentPage] > 0) {
      setHistoryIndex((prev) => ({
        ...prev,
        [currentPage]: prev[currentPage] - 1,
      }));
      const newTree = history[currentPage][historyIndex[currentPage] - 1];
      setPageContent((prev) => ({ ...prev, [currentPage]: newTree }));
      setTree(newTree);
    }
  };

  const redo = () => {
    if (historyIndex[currentPage] < history[currentPage].length - 1) {
      setHistoryIndex((prev) => ({
        ...prev,
        [currentPage]: prev[currentPage] + 1,
      }));
      const newTree = history[currentPage][historyIndex[currentPage] + 1];
      setPageContent((prev) => ({ ...prev, [currentPage]: newTree }));
      setTree(newTree);
    }
  };

  const exportJSON = () => {
    const json = JSON.stringify(pageContent, null, 2);
    const blob = new Blob([json], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "layout.json";
    a.click();
    URL.revokeObjectURL(url);
    setToastMessage("Layout exported successfully");
    setShowToast(true);
  };

  const importJSON = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        try {
          const json = JSON.parse(event.target?.result as string);
          setPageContent(json);
          setPages(Object.keys(json));
          setCurrentPage(Object.keys(json)[0]);
          setTree(json[Object.keys(json)[0]]);
          setHistory(
            Object.fromEntries(
              Object.entries(json).map(([page, content]) => [page, [content]])
            ) as Record<string, TreeItem[][]>
          );
          setHistoryIndex(
            Object.fromEntries(Object.keys(json).map((page) => [page, 0])),
          );
          setToastMessage("Layout imported successfully");
          setShowToast(true);
        } catch (error) {
          console.error("Error parsing JSON:", error);
          setToastMessage("Error importing layout");
          setShowToast(true);
        }
      };
      reader.readAsText(file);
    }
  };

  const addComponent = (component: TreeItem, parentId?: string) => {
    const newTree = JSON.parse(JSON.stringify(pageContent[currentPage]));
    const newComponent = { ...component, id: Date.now().toString() };

    if (parentId) {
      const addToParent = (items: TreeItem[]) => {
        for (let i = 0; i < items.length; i++) {
          const currentItem = items[i] ?? { allowsChildren: false, children: [] };
          if (currentItem.id === parentId) {
            if (!currentItem.children) currentItem.children = [];
            currentItem.children.push(newComponent);
            return true;
          }
          if (currentItem.children && addToParent(currentItem.children)) {
            return true;
          }
        }
        return false;
      };
      addToParent(newTree);
    } else {
      newTree.push(newComponent);
    }

    setPageContent((prev) => ({ ...prev, [currentPage]: newTree }));
    setTree(newTree);
    addToHistory(newTree);
    setToastMessage("Component added successfully");
    setShowToast(true);
  };

  const addPresetSection = (section: TreeItem) => {
    const newTree = JSON.parse(JSON.stringify(pageContent[currentPage]));
    const newSection = JSON.parse(JSON.stringify(section));
    newSection.id = Date.now().toString();
    const updateIds = (item: TreeItem) => {
      item.id = Date.now().toString() + Math.random().toString(36).substr(2, 9);
      if (item.children) {
        item.children.forEach(updateIds);
      }
    };
    updateIds(newSection);
    newTree.push(newSection);
    setPageContent((prev) => ({ ...prev, [currentPage]: newTree }));
    setTree(newTree);
    addToHistory(newTree);
    setToastMessage("Preset section added successfully");
    setShowToast(true);
  };

  const handleRawCodeTsxChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setRawCodeTsx(e?.target.value);
  };

  const handleRawCodeTsxClear = () => {
    setRawCodeTsx('');
    const newTree = initialTree
    setPageContent((prev) => ({ ...prev, [currentPage]: newTree }));
    setTree(newTree);
    addToHistory(newTree);
    setToastMessage("Preset section added successfully");
    setShowToast(true);
  }

  const handleRawCodeChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setRawCode(e.target.value);
  };

  // function tsxToJson(): TreeItem[] {
  //   let idCounter = 0;
  
  //   function parseElement(element: string): TreeItem | null {
  //     const selfClosingTagMatch = element.match(/^<(\w+)([^>]*?)\/>/s);
  //     const tagMatch = element.match(/^<(\w+)([^>]*?)>/s);
  
  //     if (!tagMatch && !selfClosingTagMatch) return null;
  
  //     const tagName = (selfClosingTagMatch || tagMatch)![1];
  //     const attributesString = (selfClosingTagMatch || tagMatch)![2];
  
  //     const item: TreeItem = {
  //       id: `item-${idCounter++}`,
  //       name: tagName,
  //       type: tagName,
  //       props: parseAttributes(attributesString),
  //       children: [],
  //       content: '',
  //       allowsChildren: !selfClosingTagMatch,  // Se for self-closing, não permite filhos
  //     };
  
  //     if (selfClosingTagMatch) {
  //       console.log("selfClosingTagMatch", selfClosingTagMatch)
  //       return item; // Self-closing tags são retornadas para serem tratadas como filhos
  //     }
  
  //     // Lida com tags normais (não self-closing)
  //     let remaining = element.slice(tagMatch![0].length);
  //     const closeTagIndex = findClosingTag(remaining, tagName);
  
  //     if (closeTagIndex !== -1) {
  //       const content = remaining.slice(0, closeTagIndex);
  //       const [parsedChildren, remainingText] = parseChildren(content);
  
  //       // Atribui os filhos corretamente
  //       item.children = parsedChildren;
  
  //       // Define o conteúdo textual, caso não haja filhos
  //       if (!parsedChildren.length) {
  //         item.content = content.replace(/<.*?>/gs, '').trim();
  //       } else {
  //         item.content = remainingText.replace(/.*?>/gs, '').trim();
  //       }
  //     }
  
  //     return item;
  //   }
  
  //   function findClosingTag(content: string, tagName: string): number {
  //     let depth = 1;
  //     let index = 0;
  //     const openRegex = new RegExp(`<${tagName}[\\s>]`, 'g');
  //     const closeRegex = new RegExp(`</${tagName}>`, 'g');
  
  //     while (depth > 0 && index < content.length) {
  //       openRegex.lastIndex = closeRegex.lastIndex = index;
  //       const openMatch = openRegex.exec(content);
  //       const closeMatch = closeRegex.exec(content);
  
  //       if (!closeMatch) return -1;
  
  //       if (openMatch && openMatch.index < closeMatch.index) {
  //         depth++;
  //         index = openMatch.index + 1;
  //       } else {
  //         depth--;
  //         if (depth === 0) return closeMatch.index;
  //         index = closeMatch.index + 1;
  //       }
  //     }
  
  //     return -1;
  //   }
  
  //   function parseAttributes(attributesString: string): Record<string, any> {
  //     const attributes: Record<string, any> = {};
  //     const attrRegex = /(\w+)=["']([^"']*?)["']/g;
  //     let attrMatch: RegExpExecArray | null;
  
  //     while ((attrMatch = attrRegex.exec(attributesString)) !== null) {
  //       attributes[attrMatch[1]] = attrMatch[2] || true;
  //     }
  
  //     return attributes;
  //   }
  
  //   function parseChildren(content: string): [TreeItem[], string] {
  //     const children: TreeItem[] = [];
  //     let remaining = content.trim();
  //     let remainingText = '';
  
  //     while (remaining.length > 0) {
  //       if (remaining.startsWith('<')) {
  //         const parsed = parseElement(remaining);
  //         if (parsed) {
  //           children.push(parsed);
  //           if (!parsed.allowsChildren) {
  //             // Se a tag não permite filhos, avançamos para o próximo
  //             const nextTagStart = remaining.indexOf('<', 1);
  //             remaining = nextTagStart !== -1 ? remaining.slice(nextTagStart).trim() : '';
  //           } else {
  //             const endIndex = findClosingTag(remaining.slice(parsed.name.length + 2), parsed.name);
  //             if (endIndex !== -1) {
  //               remaining = remaining.slice(endIndex + parsed.name.length + 3).trim();
  //             } else {
  //               break;
  //             }
  //           }
  //         } else {
  //           const nextTagStart = remaining.indexOf('<', 1);
  //           remaining = nextTagStart !== -1 ? remaining.slice(nextTagStart).trim() : '';
  //         }
  //       } else {
  //         const nextTagStart = remaining.indexOf('<');
  //         if (nextTagStart !== -1) {
  //           remainingText = remaining.slice(0, nextTagStart).trim();
  //           remaining = remaining.slice(nextTagStart).trim();
  //         } else {
  //           remainingText = remaining.trim();
  //           break;
  //         }
  //       }
  //     }
  
  //     return [children, remainingText];
  //   }
  
  //   const [parsedTree, _] = parseChildren(rawCodeTsx);
  //   return setTree(parsedTree);
  // }
  
  function tsxToJson() {
    function parseTsx(tsxCode: string): string {
     let coooo = 0
     
      function tsxStringToJson(tsxString: string): object {
        if (typeof tsxString !== 'string') {
          throw new TypeError('Input must be a string');
        }
      
        // console.log("tsxString", tsxString)
        const ast = parse(tsxString, {
          sourceType: 'module',
          plugins: ['jsx', 'typescript'],
        });
      
        const result: any = [];
      
        let level = 0
        
        traverse(ast, {
          JSXElement(path: any) {
            level = level + 1
            if (level > 1) {
              return false
            }
            const { openingElement, children } = path.node;
            const type = openingElement.name.name;
            const props: Record<string, any> = {};
      
            // Captura os atributos do elemento
            openingElement.attributes.forEach((attr: any) => {
              if (attr.type === 'JSXAttribute') {
                props[attr.name.name] = attr.value
                  ? attr.value.type === 'StringLiteral'
                    ? attr.value.value
                    : null
                  : true;
              }
            });
      
            // Captura todos os filhos
            const childElements = children.map((child: any) => {
              if (child.type === 'JSXText') {
                const contentNew = child.value.trim()
                if (contentNew != "") {
                  return [{
                    id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
                    name: "Text",
                    type: "text",
                    allowsChildren: false,
                    children: [],
                    props: {
                      content: contentNew,
                    }
                  }]; //child.value.trim(); // Captura texto
                }
                return null
              } else if (child.type === 'JSXElement') {
                console.log("child", child.openingElement.name.name)
                if( child.openingElement.name.name == "h2") {
                  console.log(child)
                }
                return tsxStringToJson(generator(child).code); // Gera o código do elemento filho
              }
              return null; // Ignore outros tipos, se necessário
            }).filter(Boolean); // Remove valores nulos

            const childElementsAdd: TreeItem[] = []

            childElements.map((el: any) => {
              childElementsAdd.push(el[0])
            })

            if(type == "code") {
              props["content"] = tsxString.substring(8, tsxString.length - 9)
              console.log("AAA", props)
            }
      
            result.push({
              id: Math.random().toString(36).substr(2, 9), // Gera um ID aleatório
              name: type,
              type,
              props,
              allowsChildren: true,
              children: childElementsAdd,
            });
          },
        });
      
        return result;
      }
      
      const jsonString = JSON.stringify(tsxStringToJson(tsxCode), null, 2);
      return jsonString ?? '[]';

    }

    const newTree = JSON.parse(parseTsx(rawCodeTsx))
    setPageContent((prev) => ({ ...prev, [currentPage]: newTree }));
    setTree(newTree);
    addToHistory(newTree);
    setToastMessage("Preset section added successfully");
    setShowToast(true);
    
  }
  
  const applyRawCode = () => {
    try {
      const parsedCode = JSON.parse(rawCode);
      setPageContent((prev) => ({ ...prev, [currentPage]: parsedCode }));
      setTree(parsedCode);
      addToHistory(parsedCode);
      setToastMessage("Raw code applied successfully");
      setShowToast(true);
    } catch (error) {
      console.error("Error parsing raw code:", error);
      setToastMessage("Error applying raw code");
      setShowToast(true);
    }
  };

  const handleAddPage = (pageName: string) => {
    if (!pages.includes(pageName)) {
      setPages((prev) => [...prev, pageName]);
      setPageContent((prev) => ({
        ...prev,
        [pageName]: [
          {
            id: "1",
            name: "Page Container",
            type: "div",
            allowsChildren: true,
            children: [],
          },
        ],
      }));
      setHistory((prev) => ({
        ...prev,
        [pageName]: [
          [
            {
              id: "1",
              name: "Page Container",
              type: "div",
              allowsChildren: true,
              children: [],
            },
          ],
        ],
      }));
      setHistoryIndex((prev) => ({ ...prev, [pageName]: 0 }));
      setCurrentPage(pageName);
    }
  };

  const handleSelectPage = (pageName: string) => {
    setCurrentPage(pageName);
    setTree(pageContent[pageName]);
  };

  useEffect(() => {
    setGeneratedCode(JSON.stringify(tree, null, 2));
  }, [tree]);

  const [levelHovered, setLevelHovered] = useState(0)

  return (
    <DndProvider backend={HTML5Backend}>
      <div className="flex h-screen flex-col">
        <header className="flex items-center justify-between p-4">
          <div className="flex items-center space-x-2">
            <Button variant="outline" size="icon">
              <Code className="h-4 w-4" />
            </Button>
            <Button variant="outline" size="icon" onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}>
              {theme === 'dark' ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
            </Button>
            <Button
              variant="outline"
              size="icon"
              onClick={() => setPreviewMode("desktop")}
            >
              <Monitor className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              size="icon"
              onClick={() => setPreviewMode("tablet")}
            >
              <Tablet className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              size="icon"
              onClick={() => setPreviewMode("mobile")}
            >
              <Smartphone className="h-4 w-4" />
            </Button>
            <Dialog>
              <DialogTrigger asChild>
                <Button variant="secondary">Add Preset Section</Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Add Preset Section</DialogTitle>
                  <DialogDescription>
                    Choose a preset section to add to your layout.
                  </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4 grid-cols-3">
                  {presetSections.map((section) => (
                    <Button
                      key={section.id}
                      onClick={() => addPresetSection(section)}
                    >
                      {section.name}
                    </Button>
                  ))}
                </div>
              </DialogContent>
            </Dialog>
            <label htmlFor="import-json">
              <Button variant="secondary">
                Import JSON
              </Button>
              <input
                id="import-json"
                type="file"
                accept=".json"
                className="hidden"
                onChange={importJSON}
              />
            </label>
          </div>
          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              size="icon"
              onClick={undo}
              disabled={historyIndex[currentPage] === 0}
            >
              <Undo className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              size="icon"
              onClick={redo}
              disabled={
                historyIndex[currentPage] === history[currentPage].length - 1
              }
            >
              <Redo className="h-4 w-4" />
            </Button>
            <Button variant="outline" size="icon">
              <Eye className="h-4 w-4" />
            </Button>
            <Button variant="default" onClick={exportJSON}>
              Export JSON
            </Button>
          </div>
        </header>
        <div className="flex flex-1 overflow-hidden">
          <LeftSidebar
            tree={tree}
            componentLibrary={componentLibrary}
            onSelect={handleSelect}
            onMove={handleMove}
            onRemove={handleRemove}
            onRename={handleRename}
            selectedItemId={selectedItem?.id || null}
            addComponent={addComponent}
            pages={pages}
            currentPage={currentPage}
            onAddPage={handleAddPage}
            onSelectPage={handleSelectPage}
          />
          <MainEditor
            tree={tree}
            selectedItemId={selectedItem?.id || null}
            onSelect={handleSelect}
            onMove={handleMove}
            onRemove={handleRemove}
            onUpdate={handleUpdate}
            previewMode={previewMode}
            generatedCode={generatedCode}
            rawCode={rawCode}
            handleRawCodeChange={handleRawCodeChange}
            rawCodeTsx={rawCodeTsx}
            handleRawCodeTsxChange={handleRawCodeTsxChange}
            handleRawCodeTsxClear={handleRawCodeTsxClear}
            applyRawCode={applyRawCode}
            tsxToJson={tsxToJson}
            addComponent={addComponent}
            levelHovered={levelHovered}
            setLevelHovered={setLevelHovered}
          />
          <RightSidebar selectedItem={selectedItem} onUpdate={handleUpdate} />
        </div>
      </div>
      {showToast && (
        <Toast>
          <p className="text-sm font-medium">{toastMessage}</p>
        </Toast>
      )}
    </DndProvider>
  );
}
