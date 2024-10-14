// 1
export const DIV_ACCEPTED_COMPONENTS = {
  // Elementos de Bloco
  HEADER: "HEADER",
  SECTION: "SECTION",
  ARTICLE: "ARTICLE",
  ASIDE: "ASIDE",
  FOOTER: "FOOTER",
  NAV: "NAV",
  DIV: "DIV",
  FORM: "FORM",
  MAIN: "MAIN",
  P: "P",
  BLOCKQUOTE: "BLOCKQUOTE",
  PRE: "PRE",
  HR: "HR",
  TABLE: "TABLE",
  THEAD: "THEAD",
  TBODY: "TBODY",
  TR: "TR",
  TD: "TD",
  TH: "TH",
  UL: "UL",
  OL: "OL",
  LI: "LI",
  FIGURE: "FIGURE",
  FIGCAPTION: "FIGCAPTION",
  DETAILS: "DETAILS",
  SUMMARY: "SUMMARY",

  CARD: "CARD",
  
  // Cabeçalhos
  H1: "H1",
  H2: "H2",
  H3: "H3",
  H4: "H4",
  H5: "H5",
  H6: "H6",

  // Elementos Inline
  SPAN: "SPAN",
  A: "A",
  IMG: "IMG",
  STRONG: "STRONG",
  EM: "EM",
  BR: "BR",
  CODE: "CODE",
  KBD: "KBD",
  SMALL: "SMALL",
  MARK: "MARK",
  SUP: "SUP",
  SUB: "SUB",
  TIME: "TIME",
  B: "B",
  I: "I",

  // Elementos de Formulário
  BUTTON: "BUTTON",
  INPUT: "INPUT",
  TEXTAREA: "TEXTAREA",
  SELECT: "SELECT",
  OPTION: "OPTION",
  LABEL: "LABEL",
  FIELDSET: "FIELDSET",
  LEGEND: "LEGEND",
  DATALIST: "DATALIST",
  OUTPUT: "OUTPUT",
  PROGRESS: "PROGRESS",
  METER: "METER",

  // Elementos de Mídia
  AUDIO: "AUDIO",
  VIDEO: "VIDEO",
  SOURCE: "SOURCE",
  TRACK: "TRACK",
  PICTURE: "PICTURE",
  CANVAS: "CANVAS",
  SVG: "SVG",

  // Elementos Semânticos
  ADDRESS: "ADDRESS",

  // Elementos de Script
  SCRIPT: "SCRIPT",
  NOSCRIPT: "NOSCRIPT",

  // Outros
  IFRAME: "IFRAME",
  STYLE: "STYLE",
} as const;

// 2
export const HEADER_ACCEPTED_COMPONENTS = {
  H1: "H1",
  H2: "H2",
  H3: "H3",
  H4: "H4",
  H5: "H5",
  H6: "H6",
  P: "P",
  DIV: "DIV",
  SPAN: "SPAN",
  A: "A",
  IMG: "IMG",
  STRONG: "STRONG",
  EM: "EM",
  BR: "BR",
  SMALL: "SMALL",
} as const;

// 3
export const SECTION_ACCEPTED_COMPONENTS = {
  HEADER: "HEADER",
  H1: "H1",
  H2: "H2",
  H3: "H3",
  H4: "H4",
  H5: "H5",
  H6: "H6",
  P: "P",
  DIV: "DIV",
  ARTICLE: "ARTICLE",
  ASIDE: "ASIDE",
} as const;

// 4
export const ARTICLE_ACCEPTED_COMPONENTS = {
  HEADER: "HEADER",
  H1: "H1",
  H2: "H2",
  H3: "H3",
  H4: "H4",
  H5: "H5",
  H6: "H6",
  P: "P",
  DIV: "DIV",
  FIGURE: "FIGURE",
  FOOTER: "FOOTER",
} as const;

// 5
export const ASIDE_ACCEPTED_COMPONENTS = {
  H1: "H1",
  H2: "H2",
  H3: "H3",
  H4: "H4",
  H5: "H5",
  H6: "H6",
  P: "P",
  DIV: "DIV",
  SPAN: "SPAN",
  A: "A",
  IMG: "IMG",
} as const;

// 6
export const FOOTER_ACCEPTED_COMPONENTS = {
  H1: "H1",
  H2: "H2",
  H3: "H3",
  H4: "H4",
  H5: "H5",
  H6: "H6",
  P: "P",
  DIV: "DIV",
  SPAN: "SPAN",
} as const;

// 7
export const NAV_ACCEPTED_COMPONENTS = {
  UL: "UL",
  OL: "OL",
  LI: "LI",
  A: "A",
  BUTTON: "BUTTON",
  SPAN: "SPAN",
} as const;

// 8
export const FORM_ACCEPTED_COMPONENTS = {
  INPUT: "INPUT",
  TEXTAREA: "TEXTAREA",
  BUTTON: "BUTTON",
  SELECT: "SELECT",
  LABEL: "LABEL",
  DATALIST: "DATALIST",
  OUTPUT: "OUTPUT",
} as const;

// 9
export const MAIN_ACCEPTED_COMPONENTS = {
  HEADER: "HEADER",
  SECTION: "SECTION",
  ARTICLE: "ARTICLE",
  ASIDE: "ASIDE",
  P: "P",
  DIV: "DIV",
} as const;

// 10
export const P_ACCEPTED_COMPONENTS = {
  SPAN: "SPAN",
  STRONG: "STRONG",
  EM: "EM",
  A: "A",
  BR: "BR",
  IMG: "IMG",
} as const;

// 11
export const BLOCKQUOTE_ACCEPTED_COMPONENTS = {
  P: "P",
  CITE: "CITE",
  DIV: "DIV",
} as const;

// 12
export const PRE_ACCEPTED_COMPONENTS = {
  CODE: "CODE",
  SPAN: "SPAN",
  A: "A",
  BR: "BR",
} as const;

// 13
export const HR_ACCEPTED_COMPONENTS = {
  SPAN: "SPAN",
} as const;

// 14
export const TABLE_ACCEPTED_COMPONENTS = {
  THEAD: "THEAD",
  TBODY: "TBODY",
  TR: "TR",
  TD: "TD",
  TH: "TH",
} as const;

// 15
export const UL_ACCEPTED_COMPONENTS = {
  LI: "LI",
  SPAN: "SPAN",
} as const;

// 16
export const OL_ACCEPTED_COMPONENTS = {
  LI: "LI",
  SPAN: "SPAN",
} as const;

// 17
export const LI_ACCEPTED_COMPONENTS = {
  SPAN: "SPAN",
  A: "A",
} as const;

// 18
export const FIGURE_ACCEPTED_COMPONENTS = {
  IMG: "IMG",
  FIGCAPTION: "FIGCAPTION",
} as const;

// 19
export const FIGCAPTION_ACCEPTED_COMPONENTS = {
  P: "P",
  SPAN: "SPAN",
} as const;

// 20
export const DETAILS_ACCEPTED_COMPONENTS = {
  SUMMARY: "SUMMARY",
  P: "P",
  DIV: "DIV",
} as const;

// 21
export const SUMMARY_ACCEPTED_COMPONENTS = {
  SPAN: "SPAN",
  A: "A",
} as const;

// 22
export const H1_ACCEPTED_COMPONENTS = {
  SPAN: "SPAN",
  A: "A",
  STRONG: "STRONG",
  EM: "EM",
} as const;

// 23
export const H2_ACCEPTED_COMPONENTS = {
  SPAN: "SPAN",
  A: "A",
  STRONG: "STRONG",
  EM: "EM",
} as const;

// 24
export const H3_ACCEPTED_COMPONENTS = {
  SPAN: "SPAN",
  A: "A",
  STRONG: "STRONG",
  EM: "EM",
} as const;

// 25
export const H4_ACCEPTED_COMPONENTS = {
  SPAN: "SPAN",
  A: "A",
  STRONG: "STRONG",
  EM: "EM",
} as const;

// 26
export const H5_ACCEPTED_COMPONENTS = {
  SPAN: "SPAN",
  A: "A",
  STRONG: "STRONG",
  EM: "EM",
} as const;

// 27
export const H6_ACCEPTED_COMPONENTS = {
  SPAN: "SPAN",
  A: "A",
  STRONG: "STRONG",
  EM: "EM",
} as const;

// 28
export const SPAN_ACCEPTED_COMPONENTS = {
  STRONG: "STRONG",
  EM: "EM",
  A: "A",
} as const;

// 29
export const A_ACCEPTED_COMPONENTS = {
  SPAN: "SPAN",
  STRONG: "STRONG",
  EM: "EM",
} as const;

// 30
export const IMG_ACCEPTED_COMPONENTS = {
  FIGURE: "FIGURE",
  P: "P",
} as const;

// 31
export const STRONG_ACCEPTED_COMPONENTS = {
  SPAN: "SPAN",
  EM: "EM",
} as const;

// 32
export const EM_ACCEPTED_COMPONENTS = {
  SPAN: "SPAN",
  STRONG: "STRONG",
} as const;

// 33
export const BR_ACCEPTED_COMPONENTS = {
  SPAN: "SPAN",
} as const;

// 34
export const CODE_ACCEPTED_COMPONENTS = {
  SPAN: "SPAN",
} as const;

// 35
export const KBD_ACCEPTED_COMPONENTS = {
  SPAN: "SPAN",
} as const;

// 36
export const SMALL_ACCEPTED_COMPONENTS = {
  SPAN: "SPAN",
} as const;

// 37
export const MARK_ACCEPTED_COMPONENTS = {
  SPAN: "SPAN",
} as const;

// 38
export const SUP_ACCEPTED_COMPONENTS = {
  SPAN: "SPAN",
} as const;

// 39
export const SUB_ACCEPTED_COMPONENTS = {
  SPAN: "SPAN",
} as const;

// 40
export const TIME_ACCEPTED_COMPONENTS = {
  SPAN: "SPAN",
} as const;

// 41
export const B_ACCEPTED_COMPONENTS = {
  SPAN: "SPAN",
} as const;

// 42
export const I_ACCEPTED_COMPONENTS = {
  SPAN: "SPAN",
} as const;

// 43
export const BUTTON_ACCEPTED_COMPONENTS = {
  SPAN: "SPAN",
  STRONG: "STRONG",
} as const;

// 44
export const INPUT_ACCEPTED_COMPONENTS = {
  SPAN: "SPAN",
  LABEL: "LABEL",
} as const;

// 45
export const TEXTAREA_ACCEPTED_COMPONENTS = {
  SPAN: "SPAN",
} as const;

// 46
export const SELECT_ACCEPTED_COMPONENTS = {
  OPTION: "OPTION",
  SPAN: "SPAN",
} as const;

// 47
export const LABEL_ACCEPTED_COMPONENTS = {
  SPAN: "SPAN",
} as const;

// 48
export const DATALIST_ACCEPTED_COMPONENTS = {
  OPTION: "OPTION",
} as const;

// 49
export const OUTPUT_ACCEPTED_COMPONENTS = {
  SPAN: "SPAN",
} as const;

// 50
export const PROGRESS_ACCEPTED_COMPONENTS = {
  SPAN: "SPAN",
} as const;

// 51
export const METER_ACCEPTED_COMPONENTS = {
  SPAN: "SPAN",
} as const;

// 52
export const AUDIO_ACCEPTED_COMPONENTS = {
  SOURCE: "SOURCE",
  TRACK: "TRACK",
} as const;

// 53
export const VIDEO_ACCEPTED_COMPONENTS = {
  SOURCE: "SOURCE",
  TRACK: "TRACK",
} as const;

// 54
export const SOURCE_ACCEPTED_COMPONENTS = {
  SPAN: "SPAN",
} as const;

// 55
export const TRACK_ACCEPTED_COMPONENTS = {
  SPAN: "SPAN",
} as const;

// 56
export const PICTURE_ACCEPTED_COMPONENTS = {
  IMG: "IMG",
} as const;

// 57
export const CANVAS_ACCEPTED_COMPONENTS = {
  SPAN: "SPAN",
} as const;

// 58
export const SVG_ACCEPTED_COMPONENTS = {
  SPAN: "SPAN",
} as const;

// 59
export const ADDRESS_ACCEPTED_COMPONENTS = {
  P: "P",
  SPAN: "SPAN",
} as const;

// 60
export const SCRIPT_ACCEPTED_COMPONENTS = {
  SPAN: "SPAN",
} as const;

// 61
export const NOSCRIPT_ACCEPTED_COMPONENTS = {
  SPAN: "SPAN",
} as const;

// 62
export const IFRAME_ACCEPTED_COMPONENTS = {
  SPAN: "SPAN",
} as const;

// 63
export const STYLE_ACCEPTED_COMPONENTS = {
  SPAN: "SPAN",
} as const;
