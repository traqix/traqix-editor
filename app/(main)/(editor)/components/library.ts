import { TreeItem } from "../types";

export const componentLibrary: TreeItem[] = [
  {
    id: "section",
    name: "Section",
    type: "section",
    icon: `<div className="h-4 w-4 rounded bg-gray-400" />`,
    allowsChildren: true,
    lastUpdate: 0
  },
  {
    id: "div",
    name: "Div",
    type: "div",
    icon: `<div className="h-4 w-4 rounded bg-gray-300" />`,
    allowsChildren: true,
    lastUpdate: 0
  },
  {
    id: "span",
    name: "Span",
    type: "span",
    icon: `<div className="h-4 w-4 rounded bg-gray-300" />`,
    allowsChildren: true,
    lastUpdate: 0
  },
  {
    id: "Link",
    name: "Link",
    type: "link",
    icon: `<div className="h-4 w-4 rounded bg-gray-300" />`,
    allowsChildren: true,
    lastUpdate: 0
  },
  {
    id: "h1",
    name: "Heading 1",
    type: "h1",
    icon: `<div className="h-4 w-4 rounded bg-blue-400" />`,
    props: { content: "Heading 1" },
    lastUpdate: 0
  },
  {
    id: "h2",
    name: "Heading 2",
    type: "h2",
    icon: `<div className="h-4 w-4 rounded bg-blue-300" />`,
    props: { content: "Heading 2" },
    lastUpdate: 0
  },
  {
    id: "h3",
    name: "Heading 3",
    type: "h3",
    icon: `<div className="h-4 w-4 rounded bg-blue-200" />`,
    props: { content: "Heading 3" },
    lastUpdate: 0
  },
  {
    id: "h4",
    name: "Heading 4",
    type: "h4",
    icon: `<div className="h-4 w-4 rounded bg-blue-100" />`,
    props: { content: "Heading 4" },
    lastUpdate: 0
  },
  {
    id: "p",
    name: "Paragraph",
    type: "p",
    icon: `<div className="h-4 w-4 rounded bg-green-400" />`,
    props: { content: "Paragraph text" },
    lastUpdate: 0
  },
  {
    id: "button",
    name: "Button",
    type: "button",
    icon: `<div className="h-4 w-4 rounded bg-purple-400" />`,
    props: { content: "Button" },
    allowsChildren: true,
    lastUpdate: 0
  },
  {
    id: "input",
    name: "Input",
    type: "input",
    icon: `<div className="h-4 w-4 rounded bg-yellow-400" />`,
    lastUpdate: 0
  },
  {
    id: "textarea",
    name: "Textarea",
    type: "textarea",
    icon: `<div className="h-4 w-4 rounded bg-yellow-300" />`,
    lastUpdate: 0
  },
  {
    id: "accordion",
    name: "Accordion",
    type: "accordion",
    icon: `<div className="h-4 w-4 rounded bg-indigo-400" />`,
    allowsChildren: true,
    lastUpdate: 0
  },
  {
    id: "card",
    name: "Card",
    type: "card",
    icon: `<div className="h-4 w-4 rounded bg-pink-400" />`,
    allowsChildren: true,
    lastUpdate: 0
  },
  {
    id: "checkbox",
    name: "Checkbox",
    type: "checkbox",
    icon: `<div className="h-4 w-4 rounded bg-green-300" />`,
    lastUpdate: 0
  },
  {
    id: "radio-group",
    name: "Radio Group",
    type: "radio-group",
    icon: `<div className="h-4 w-4 rounded bg-red-300" />`,
    lastUpdate: 0
  },
  {
    id: "switch",
    name: "Switch",
    type: "switch",
    icon: `<div className="h-4 w-4 rounded bg-blue-300" />`,
    lastUpdate: 0
  },
  {
    id: "slider",
    name: "Slider",
    type: "slider",
    icon: `<div className="h-4 w-4 rounded bg-purple-300" />`,
    lastUpdate: 0
  },
  {
    id: "select",
    name: "Select",
    type: "select",
    icon: `<div className="h-4 w-4 rounded bg-red-400" />`,
    lastUpdate: 0
  },
  {
    id: "progress",
    name: "Progress",
    type: "progress",
    icon: `<div className="h-4 w-4 rounded bg-indigo-400" />`,
    lastUpdate: 0
  },
  {
    id: "avatar",
    name: "Avatar",
    type: "avatar",
    icon: `<div className="h-4 w-4 rounded bg-pink-400" />`,
    lastUpdate: 0
  },
  {
    id: "toggle",
    name: "Toggle",
    type: "toggle",
    icon: `<div className="h-4 w-4 rounded bg-orange-400" />`,
    lastUpdate: 0
  },
  // Next.js components
  {
    id: "Image",
    name: "Image",
    type: "Image",
    icon: `<div className="h-4 w-4 rounded bg-teal-400" />`,
    lastUpdate: 0
  },
  {
    id: "Input",
    name: "Input (Next.js)",
    type: "Input",
    icon: `<div className="h-4 w-4 rounded bg-teal-300" />`,
    lastUpdate: 0
  },
  {
    id: "Script",
    name: "Script",
    type: "Script",
    icon: `<div className="h-4 w-4 rounded bg-teal-200" />`,
    lastUpdate: 0
  },
  {
    id: "Head",
    name: "Head",
    type: "Head",
    icon: `<div className="h-4 w-4 rounded bg-teal-100" />`,
    lastUpdate: 0
  },
];
