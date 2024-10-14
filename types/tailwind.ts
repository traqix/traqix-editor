type TailwindLayoutClass =
  | "container"
  | "box-border"
  | "box-content"
  | "block"
  | "inline-block"
  | "inline"
  | "flex"
  | "inline-flex"
  | "grid"
  | "inline-grid"
  | "contents"
  | "float-left"
  | "float-right"
  | "float-none"
  | "clear-left"
  | "clear-right"
  | "static"
  | "fixed"
  | "absolute"
  | "relative"
  | "sticky";

type TailwindFlexGridClass =
  | "flex-row"
  | "flex-row-reverse"
  | "flex-col"
  | "flex-col-reverse"
  | "flex-wrap"
  | "flex-wrap-reverse"
  | "flex-nowrap"
  | "items-start"
  | "items-center"
  | "items-end"
  | "items-stretch"
  | "justify-start"
  | "justify-center"
  | "justify-end"
  | "justify-between";

type TailwindSpacingClass =
  | "p-0"
  | "p-1"
  | "p-2"
  | "px-0"
  | "px-1"
  | "px-2"
  | "m-0"
  | "m-1"
  | "m-2"
  | "mx-0"
  | "mx-1"
  | "mx-2"
  | "space-x-0"
  | "space-x-1"
  | "space-y-0"
  | "space-y-1";

type TailwindTypographyClass =
  | "text-xs"
  | "text-sm"
  | "text-base"
  | "text-lg"
  | "text-xl"
  | "font-thin"
  | "font-light"
  | "font-normal"
  | "font-semibold"
  | "font-bold"
  | "font-black"
  | "text-left"
  | "text-center"
  | "text-right"
  | "underline"
  | "line-through"
  | "no-underline"
  | "uppercase"
  | "lowercase"
  | "capitalize";

type TailwindBackgroundClass =
  | "bg-transparent"
  | "bg-black"
  | "bg-white"
  | "bg-gray-50"
  | "bg-blue-900"
  | "bg-opacity-0"
  | "bg-opacity-10"
  | "bg-auto"
  | "bg-cover"
  | "bg-contain"
  | "bg-bottom"
  | "bg-center";

type TailwindClass =
  | TailwindLayoutClass
  | TailwindFlexGridClass
  | TailwindSpacingClass
  | TailwindTypographyClass
  | TailwindBackgroundClass;
