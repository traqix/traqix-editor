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
                ]
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
            ]
          }
        ]
      }
    ]
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
                    ]
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
                ]
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
                    ]
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
                ]
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
                    ]
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
                ]
              }
            ]
          }
        ]
      }
    ]
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
            ]
          }
        ]
      }
    ]
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
          if (items[i].id === targetId) {
            if (items[i].allowsChildren) {
              if (!items[i].children) items[i].children = [];
              items[i].children.push(draggedItem);
            } else {
              items.splice(i + 1, 0, draggedItem);
            }
            return true;
          }
          if (items[i].children && findAndInsert(items[i].children)) {
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
          if (items[i].id === id) {
            items[i] = { ...items[i], ...updates };
            return true;
          }
          if (items[i].children && updateItem(items[i].children)) {
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
              Object.entries(json).map(([page, content]) => [page, [content]]),
            ),
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
          if (items[i].id === parentId) {
            if (!items[i].children) items[i].children = [];
            items[i].children.push(newComponent);
            return true;
          }
          if (items[i].children && addToParent(items[i].children)) {
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
    function parseTsx(tsxCode: string): TreeItem | null {
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
      return jsonString;

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

  return (
    <DndProvider backend={HTML5Backend}>
      <div className="flex h-screen flex-col">
        <header className="flex items-center justify-between p-4 shadow-sm">
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
                <div className="grid gap-4 py-4">
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
              <Button variant="secondary" as="span">
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
            <Button variant="primary" onClick={exportJSON}>
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
