// 1
export const TREE_DIV_ACCEPTED_COMPONENTS = {
  // Elementos de Bloco
  HEADER: "TREE_HEADER",
  SECTION: "TREE_SECTION",
  ARTICLE: "TREE_ARTICLE",
  ASIDE: "TREE_ASIDE",
  FOOTER: "TREE_FOOTER",
  NAV: "TREE_NAV",
  DIV: "TREE_DIV",
  FORM: "TREE_FORM",
  MAIN: "TREE_MAIN",
  P: "TREE_P",
  BLOCKQUOTE: "TREE_BLOCKQUOTE",
  PRE: "TREE_PRE",
  HR: "TREE_HR",
  TABLE: "TREE_TABLE",
  // THEAD: "TREE_THEAD",
  // TBODY: "TREE_TBODY",
  // TR: "TREE_TR",
  // TD: "TREE_TD",
  // TH: "TREE_TH",
  UL: "TREE_UL",
  OL: "TREE_OL",
  // LI: "TREE_LI",
  FIGURE: "TREE_FIGURE",
  FIGCAPTION: "TREE_FIGCAPTION",
  DETAILS: "TREE_DETAILS",
  SUMMARY: "TREE_SUMMARY",

  // Cabeçalhos
  H1: "TREE_H1",
  H2: "TREE_H2",
  H3: "TREE_H3",
  H4: "TREE_H4",
  H5: "TREE_H5",
  H6: "TREE_H6",

  // Elementos Inline
  SPAN: "TREE_SPAN",
  A: "TREE_A",
  IMG: "TREE_IMG",
  STRONG: "TREE_STRONG",
  EM: "TREE_EM",
  BR: "TREE_BR",
  CODE: "TREE_CODE",
  KBD: "TREE_KBD",
  SMALL: "TREE_SMALL",
  MARK: "TREE_MARK",
  SUP: "TREE_SUP",
  SUB: "TREE_SUB",
  TIME: "TREE_TIME",
  B: "TREE_B",
  I: "TREE_I",

  // Elementos de Formulário
  BUTTON: "TREE_BUTTON",
  INPUT: "TREE_INPUT",
  TEXTAREA: "TREE_TEXTAREA",
  SELECT: "TREE_SELECT",
  OPTION: "TREE_OPTION",
  LABEL: "TREE_LABEL",
  FIELDSET: "TREE_FIELDSET",
  LEGEND: "TREE_LEGEND",
  DATALIST: "TREE_DATALIST",
  OUTPUT: "TREE_OUTPUT",
  PROGRESS: "TREE_PROGRESS",
  METER: "TREE_METER",

  // Elementos de Mídia
  AUDIO: "TREE_AUDIO",
  VIDEO: "TREE_VIDEO",
  SOURCE: "TREE_SOURCE",
  TRACK: "TREE_TRACK",
  PICTURE: "TREE_PICTURE",
  CANVAS: "TREE_CANVAS",
  SVG: "TREE_SVG",

  // Elementos Semânticos
  ADDRESS: "TREE_ADDRESS",

  // Elementos de Script
  SCRIPT: "TREE_SCRIPT",
  NOSCRIPT: "TREE_NOSCRIPT",

  // Outros
  IFRAME: "TREE_IFRAME",
  STYLE: "TREE_STYLE",
  
  // // Traqix
  // CUSTOM: "TREE_CUSTOM",
  // TEXT: "TREE_TEXT",
} as const;

// 2
export const TREE_HEADER_ACCEPTED_COMPONENTS = {
  H1: "TREE_H1",
  H2: "TREE_H2",
  H3: "TREE_H3",
  H4: "TREE_H4",
  H5: "TREE_H5",
  H6: "TREE_H6",
  P: "TREE_P",
  DIV: "TREE_DIV",
  SPAN: "TREE_SPAN",
  A: "TREE_A",
  IMG: "TREE_IMG",
  STRONG: "TREE_STRONG",
  EM: "TREE_EM",
  BR: "TREE_BR",
  SMALL: "TREE_SMALL",
} as const;

// 3
export const TREE_SECTION_ACCEPTED_COMPONENTS = {
  HEADER: "TREE_HEADER",
  H1: "TREE_H1",
  H2: "TREE_H2",
  H3: "TREE_H3",
  H4: "TREE_H4",
  H5: "TREE_H5",
  H6: "TREE_H6",
  P: "TREE_P",
  DIV: "TREE_DIV",
  ARTICLE: "TREE_ARTICLE",
  ASIDE: "TREE_ASIDE",
} as const;

// 4
export const TREE_ARTICLE_ACCEPTED_COMPONENTS = {
  HEADER: "TREE_HEADER",
  H1: "TREE_H1",
  H2: "TREE_H2",
  H3: "TREE_H3",
  H4: "TREE_H4",
  H5: "TREE_H5",
  H6: "TREE_H6",
  P: "TREE_P",
  DIV: "TREE_DIV",
  FIGURE: "TREE_FIGURE",
  FOOTER: "TREE_FOOTER",
} as const;

// 5
export const TREE_ASIDE_ACCEPTED_COMPONENTS = {
  H1: "TREE_H1",
  H2: "TREE_H2",
  H3: "TREE_H3",
  H4: "TREE_H4",
  H5: "TREE_H5",
  H6: "TREE_H6",
  P: "TREE_P",
  DIV: "TREE_DIV",
  SPAN: "TREE_SPAN",
  A: "TREE_A",
  IMG: "TREE_IMG",
} as const;

// 6
export const TREE_FOOTER_ACCEPTED_COMPONENTS = {
  H1: "TREE_H1",
  H2: "TREE_H2",
  H3: "TREE_H3",
  H4: "TREE_H4",
  H5: "TREE_H5",
  H6: "TREE_H6",
  P: "TREE_P",
  DIV: "TREE_DIV",
  SPAN: "TREE_SPAN",
} as const;

// 7
export const TREE_NAV_ACCEPTED_COMPONENTS = {
  UL: "TREE_UL",
  OL: "TREE_OL",
  // LI: "TREE_LI",
  A: "TREE_A",
  BUTTON: "TREE_BUTTON",
  SPAN: "TREE_SPAN",
} as const;

// 8
export const TREE_FORM_ACCEPTED_COMPONENTS = {
  INPUT: "TREE_INPUT",
  TEXTAREA: "TREE_TEXTAREA",
  BUTTON: "TREE_BUTTON",
  SELECT: "TREE_SELECT",
  LABEL: "TREE_LABEL",
  DATALIST: "TREE_DATALIST",
  OUTPUT: "TREE_OUTPUT",
} as const;

// 9
export const TREE_MAIN_ACCEPTED_COMPONENTS = {
  HEADER: "TREE_HEADER",
  SECTION: "TREE_SECTION",
  ARTICLE: "TREE_ARTICLE",
  ASIDE: "TREE_ASIDE",
  P: "TREE_P",
  DIV: "TREE_DIV",
} as const;

// 10
export const TREE_P_ACCEPTED_COMPONENTS = {
  SPAN: "TREE_SPAN",
  STRONG: "TREE_STRONG",
  EM: "TREE_EM",
  A: "TREE_A",
  BR: "TREE_BR",
  IMG: "TREE_IMG",

  // Traqix
  CUSTOM: "TREE_CUSTOM",
  TEXT: "TREE_TEXT",
} as const;

// 11
export const TREE_BLOCKQUOTE_ACCEPTED_COMPONENTS = {
  P: "TREE_P",
  CITE: "TREE_CITE",
  DIV: "TREE_DIV",
} as const;

// 12
export const TREE_PRE_ACCEPTED_COMPONENTS = {
  CODE: "TREE_CODE",
  SPAN: "TREE_SPAN",
  A: "TREE_A",
  BR: "TREE_BR",
} as const;

// 13
export const TREE_HR_ACCEPTED_COMPONENTS = {
  SPAN: "TREE_SPAN",
} as const;

// 14
export const TREE_TABLE_ACCEPTED_COMPONENTS = {
  THEAD: "TREE_THEAD",
  TBODY: "TREE_TBODY",
  TR: "TREE_TR",
  TD: "TREE_TD",
  TH: "TREE_TH",
} as const;

// 15
export const TREE_UL_ACCEPTED_COMPONENTS = {
  LI: "TREE_LI",
  SPAN: "TREE_SPAN",
} as const;

// 16
export const TREE_OL_ACCEPTED_COMPONENTS = {
  LI: "TREE_LI",
  SPAN: "TREE_SPAN",
} as const;

// 17
export const TREE_LI_ACCEPTED_COMPONENTS = {
  SPAN: "TREE_SPAN",
  A: "TREE_A",

  // Traqix
  CUSTOM: "TREE_CUSTOM",
  TEXT: "TREE_TEXT",
} as const;

// 18
export const TREE_FIGURE_ACCEPTED_COMPONENTS = {
  IMG: "TREE_IMG",
  FIGCAPTION: "TREE_FIGCAPTION",
} as const;

// 19
export const TREE_FIGCAPTION_ACCEPTED_COMPONENTS = {
  P: "TREE_P",
  SPAN: "TREE_SPAN",
} as const;

// 20
export const TREE_DETAILS_ACCEPTED_COMPONENTS = {
  SUMMARY: "TREE_SUMMARY",
  P: "TREE_P",
  DIV: "TREE_DIV",
} as const;

// 21
export const TREE_SUMMARY_ACCEPTED_COMPONENTS = {
  SPAN: "TREE_SPAN",
  A: "TREE_A",
} as const;

// 22
export const TREE_H1_ACCEPTED_COMPONENTS = {
  SPAN: "TREE_SPAN",
  A: "TREE_A",
  STRONG: "TREE_STRONG",
  EM: "TREE_EM",
} as const;

// 23
export const TREE_H2_ACCEPTED_COMPONENTS = {
  SPAN: "TREE_SPAN",
  A: "TREE_A",
  STRONG: "TREE_STRONG",
  EM: "TREE_EM",
} as const;

// 24
export const TREE_H3_ACCEPTED_COMPONENTS = {
  SPAN: "TREE_SPAN",
  A: "TREE_A",
  STRONG: "TREE_STRONG",
  EM: "TREE_EM",
} as const;

// 25
export const TREE_H4_ACCEPTED_COMPONENTS = {
  SPAN: "TREE_SPAN",
  A: "TREE_A",
  STRONG: "TREE_STRONG",
  EM: "TREE_EM",
} as const;

// 26
export const TREE_H5_ACCEPTED_COMPONENTS = {
  SPAN: "TREE_SPAN",
  A: "TREE_A",
  STRONG: "TREE_STRONG",
  EM: "TREE_EM",
} as const;

// 27
export const TREE_H6_ACCEPTED_COMPONENTS = {
  SPAN: "TREE_SPAN",
  A: "TREE_A",
  STRONG: "TREE_STRONG",
  EM: "TREE_EM",
} as const;

// 28
export const TREE_SPAN_ACCEPTED_COMPONENTS = {
  STRONG: "TREE_STRONG",
  EM: "TREE_EM",
  A: "TREE_A",

  // Traqix
  CUSTOM: "TREE_CUSTOM",
  TEXT: "TREE_TEXT",
} as const;

// 29
export const TREE_A_ACCEPTED_COMPONENTS = {
  SPAN: "TREE_SPAN",
  STRONG: "TREE_STRONG",
  EM: "TREE_EM",
} as const;

// 30
export const TREE_IMG_ACCEPTED_COMPONENTS = {
  FIGURE: "TREE_FIGURE",
  P: "TREE_P",
} as const;

// 31
export const TREE_STRONG_ACCEPTED_COMPONENTS = {
  SPAN: "TREE_SPAN",
  EM: "TREE_EM",
} as const;

// 32
export const TREE_EM_ACCEPTED_COMPONENTS = {
  SPAN: "TREE_SPAN",
  STRONG: "TREE_STRONG",
} as const;

// 33
export const TREE_BR_ACCEPTED_COMPONENTS = {
  SPAN: "TREE_SPAN",
} as const;

// 34
export const TREE_CODE_ACCEPTED_COMPONENTS = {
  SPAN: "TREE_SPAN",
} as const;

// 35
export const TREE_KBD_ACCEPTED_COMPONENTS = {
  SPAN: "TREE_SPAN",
} as const;

// 36
export const TREE_SMALL_ACCEPTED_COMPONENTS = {
  SPAN: "TREE_SPAN",
} as const;

// 37
export const TREE_MARK_ACCEPTED_COMPONENTS = {
  SPAN: "TREE_SPAN",
} as const;

// 38
export const TREE_SUP_ACCEPTED_COMPONENTS = {
  SPAN: "TREE_SPAN",
} as const;

// 39
export const TREE_SUB_ACCEPTED_COMPONENTS = {
  SPAN: "TREE_SPAN",
} as const;

// 40
export const TREE_TIME_ACCEPTED_COMPONENTS = {
  SPAN: "TREE_SPAN",
} as const;

// 41
export const TREE_B_ACCEPTED_COMPONENTS = {
  SPAN: "TREE_SPAN",
} as const;

// 42
export const TREE_I_ACCEPTED_COMPONENTS = {
  SPAN: "TREE_SPAN",
} as const;

// 43
export const TREE_BUTTON_ACCEPTED_COMPONENTS = {
  SPAN: "TREE_SPAN",
  STRONG: "TREE_STRONG",

  // Traqix
  CUSTOM: "TREE_CUSTOM",
  TEXT: "TREE_TEXT",
} as const;

// 44
export const TREE_INPUT_ACCEPTED_COMPONENTS = {
  SPAN: "TREE_SPAN",
  LABEL: "TREE_LABEL",
} as const;

// 45
export const TREE_TEXTAREA_ACCEPTED_COMPONENTS = {
  SPAN: "TREE_SPAN",
} as const;

// 46
export const TREE_SELECT_ACCEPTED_COMPONENTS = {
  OPTION: "TREE_OPTION",
  SPAN: "TREE_SPAN",
} as const;

// 47
export const TREE_LABEL_ACCEPTED_COMPONENTS = {
  SPAN: "TREE_SPAN",
} as const;

// 48
export const TREE_DATALIST_ACCEPTED_COMPONENTS = {
  OPTION: "TREE_OPTION",
} as const;

// 49
export const TREE_OUTPUT_ACCEPTED_COMPONENTS = {
  SPAN: "TREE_SPAN",
} as const;

// 50
export const TREE_PROGRESS_ACCEPTED_COMPONENTS = {
  SPAN: "TREE_SPAN",
} as const;

// 51
export const TREE_METER_ACCEPTED_COMPONENTS = {
  SPAN: "TREE_SPAN",
} as const;

// 52
export const TREE_AUDIO_ACCEPTED_COMPONENTS = {
  SOURCE: "TREE_SOURCE",
  TRACK: "TREE_TRACK",
} as const;

// 53
export const TREE_VIDEO_ACCEPTED_COMPONENTS = {
  SOURCE: "TREE_SOURCE",
  TRACK: "TREE_TRACK",
} as const;

// 54
export const TREE_SOURCE_ACCEPTED_COMPONENTS = {
  SPAN: "TREE_SPAN",
} as const;

// 55
export const TREE_TRACK_ACCEPTED_COMPONENTS = {
  SPAN: "TREE_SPAN",
} as const;

// 56
export const TREE_PICTURE_ACCEPTED_COMPONENTS = {
  IMG: "TREE_IMG",
} as const;

// 57
export const TREE_CANVAS_ACCEPTED_COMPONENTS = {
  SPAN: "TREE_SPAN",
} as const;

// 58
export const TREE_SVG_ACCEPTED_COMPONENTS = {
  SPAN: "TREE_SPAN",
} as const;

// 59
export const TREE_ADDRESS_ACCEPTED_COMPONENTS = {
  P: "TREE_P",
  SPAN: "TREE_SPAN",
} as const;

// 60
export const TREE_SCRIPT_ACCEPTED_COMPONENTS = {
  SPAN: "TREE_SPAN",
} as const;

// 61
export const TREE_NOSCRIPT_ACCEPTED_COMPONENTS = {
  SPAN: "TREE_SPAN",
} as const;

// 62
export const TREE_IFRAME_ACCEPTED_COMPONENTS = {
  SPAN: "TREE_SPAN",
} as const;

// 63
export const TREE_STYLE_ACCEPTED_COMPONENTS = {
  SPAN: "TREE_SPAN",
} as const;
