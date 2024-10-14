export const matchTailwindClassesMargin = (classes: string): string[] => {
  const regex =
    /(min-|max-)?m[trblxy]?-auto$|^(min-|max-)?m[trblxy]?-([a-zA-Z0-9]+|\[[^\]]+\])$|^[a-z]+:(min-|max-)?m[trblxy]?-auto$|^[a-z]+:(min-|max-)?m[trblxy]?-([a-zA-Z0-9]+|\[[^\]]+\])/;
  const allClasses = classes.split(/\s+/);
  const matches: string[] = [];

  allClasses.forEach((cls: string) => {
    if (regex.test(cls)) {
      matches.push(cls);
    }
  });

  return matches;
};

export const matchTailwindClassesWidth = (classes: string): string[] => {
  const regex =
    /^(?:min-|max-)?(?:w-(?:\[\d+(\.\d+)?(px|vh|vw|%)\]|\d+|(?:sm|md|lg|xl|2xl|full|auto|screen))|max-w-(?:\[\d+(\.\d+)?(px|vh|vw|%)\]|\d+|(?:sm|md|lg|xl|2xl|full|auto|screen)))$/;
  const parts = classes.split(/\s+/);
  const matches = parts.filter((part) => regex.test(part));

  return matches;
};

export const matchTailwindClassesHeight = (classes: string): string[] => {
  const regex =
    /^(?:min-|max-)?(?:h-(?:\[\d+(\.\d+)?(px|vh|vw|%)\]|\d+|(?:sm|md|lg|xl|2xl|full|auto|screen))|max-h-(?:\[\d+(\.\d+)?(px|vh|vw|%)\]|\d+|(?:sm|md|lg|xl|2xl|full|auto|screen)))$/;
  const allClasses = classes.split(/\s+/);
  const matches: string[] = [];

  allClasses.forEach((cls: string) => {
    if (regex.test(cls)) {
      matches.push(cls);
    }
  });

  return matches;
};

export const modifyLayoutClassesChild = (
  classes: string
): { parentClasses: string[]; childClasses: string[] } => {
  const parentClasses: any[] = [];
  const childClasses: any[] = [];

  // Quebra a entrada em classes
  const allClasses = classes.split(/\s+/);

  const widthClasses =
    /^(?:min-|max-)?(?:w-(?:\[\d+(\.\d+)?(px|vh|vw|%)\]|\d+|(?:sm|md|lg|xl|2xl|full|auto|screen))|max-w-(?:\[\d+(\.\d+)?(px|vh|vw|%)\]|\d+|(?:sm|md|lg|xl|2xl|full|auto|screen)))$/;
  const heightClasses = /^(?:min-|max-)?(?:h-(?:\[\d+(\.\d+)?(px|vh|vw|%)\]|\d+|(?:sm|md|lg|xl|2xl|full|auto|screen))|max-h-(?:\[\d+(\.\d+)?(px|vh|vw|%)\]|\d+|(?:sm|md|lg|xl|2xl|full|auto|screen)))$/;
  const marginClasses =
    /(?:(?:min-|max-)?m[xy]-(?:auto|(?:\[\d+(\.\d+)?(px|%)\]|\d+|full)))/;
  const paddingClasses = /^(?:p[xy]-(?:auto|(?:min-|max-)?(?:\[\d+(\.\d+)?(px|%)\]|\d+|full)))$/;
  const borderClasses =
    /(?:border(?:-solid|-dashed|-dotted|-none)?(?:-(?:\[\d+(\.\d+)?(px|%)\]|\d+|(?:sm|md|lg|xl|2xl|full|auto)))?)/;
  const overflowClasses = /(?:overflow-(?:auto|hidden|scroll|visible))/;
  const colSpanClasses = /(?:col-span-\d+)/;
  const roundedClasses =
    /(?:rounded(?:-t(?:l|r|b)?|-b(?:l|r)?)?-\d+|rounded-\d+|rounded-full|rounded-lg|rounded-md|rounded-sm|rounded-none)/;
  const positioningClasses =
    /(?:^|\s)(?:\w+:(?:\w+:)*)?(?:absolute|relative|fixed|sticky|hidden|invisible|visible)(?:\s|$)/;
  const positioningFixedClasses =
    /(?:^|\s)(?:\w+:(?:\w+:)*)?(?:top|right|bottom|left)-(?:\d+|auto|full|px|-\d+)(?:\s|$)/;
  const positioningFlexClasses =
    /(?:^|\s)(?:\w+:(?:\w+:)*)?(?:flex-1)(?:\s|$)/;

  const backgroundClasses = /(?:bg-(?:\w+|transparent|current|inherit|none)|dark:bg-(?:\w+|transparent|current|inherit|none))/;

  let putBackground = false
  let capturedBackground = ''
  allClasses.forEach((cls: string) => {
    if (
      widthClasses.test(cls) ||
      // heightClasses.test(cls) ||
      marginClasses.test(cls) ||
      // paddingClasses.test(cls) ||
      // borderClasses.test(cls) ||
      overflowClasses.test(cls) ||
      colSpanClasses.test(cls) ||
      positioningClasses.test(cls) ||
      positioningFixedClasses.test(cls) ||
      positioningFlexClasses.test(cls)
    ) {
      parentClasses.push(cls); // Classes de largura vão para o pai
    } else {
      childClasses.push(cls); // Classes restantes ficam no filho
    }

    if (roundedClasses.test(cls)) {
      parentClasses.push(cls);
      childClasses.push(cls);
    }

    if (heightClasses.test(cls)) {
      putBackground = true
    }

    if (backgroundClasses.test(cls)) {
      capturedBackground = cls
    }
  });

  if(putBackground) {
    parentClasses.push(capturedBackground);
  }



  // Combina todas as expressões em uma única
  // const regex = new RegExp(
  //   `(?:${widthClasses.source})|` +
  //     `(?:${heightClasses.source})|` +
  //     `(?:${marginClasses.source})|` +
  //     `(?:${paddingClasses.source})|` +
  //     `(?:${borderClasses.source})|` +
  //     `(?:${overflowClasses.source})|` +
  //     `(?:${colSpanClasses.source})|` +
  //     `(?:${roundedClasses.source})|` +
  //     `(?:${positioningClasses.source})`,
  //   "g"
  // );
  // const layoutRegex =
  //   /(?:(sm:|md:|lg:|xl:|2xl:)?(container|box-border|box-content|flex2222|flex-1|inline-flex|grid222|block|inline|hidden|float-(left|right|none)|clear-(left|right|both)|gap222-\d+|gap222-x-\d+|col-span-\d+|gap-y-\d+|grid-cols22222-(\d+)|grid-cols-none22222))|(min-|max-)?w-(auto|full|screen|[a-zA-Z0-9]+|\[[^\]]+\])$|^[a-z]+:(min-|max-)?w-(auto|full|screen|[a-zA-Z0-9]+|\[[^\]]+\])|(min-|max-)?m[trblxy]?-auto$|^(min-|max-)?m[trblxy]?-([a-zA-Z0-9]+|\[[^\]]+\])$|^[a-z]+:(min-|max-)?m[trblxy]?-auto$|^[a-z]+:(min-|max-)?m[trblxy]?-([a-zA-Z0-9]+|\[[^\]]+\])/
  // const parentClasses: string[] = [];
  // const childClasses: string[] = [];
  // const allClasses = classes.split(/\s+/);

  // allClasses.forEach((cls: string) => {
  //   if (regex.test(cls.trim())) {
  //     parentClasses.push(cls);  // Classes que afetam layout vão para o pai
  //   } else {
  //     childClasses.push(cls);   // Classes restantes ficam no filho
  //   }
  // });

  // bg-white dark:bg-gray-900 rounded-lg shadow-lg overflow-hidden max-w-lg w-full

  return { parentClasses, childClasses };
};
