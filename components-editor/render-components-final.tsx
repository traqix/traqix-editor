import { TreeItem } from "@/app/(main)/(editor)/types";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardDescription,
  CardFooter,
} from "@/components/ui/card";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel";
import {
  Collapsible,
  CollapsibleTrigger,
  CollapsibleContent,
} from "@/components/ui/collapsible";
import { Pagination } from "@/components/ui/pagination";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Sheet,
  SheetPortal,
  SheetOverlay,
  SheetContent,
  SheetHeader,
  SheetFooter,
  SheetClose,
  SheetTitle,
  SheetDescription,
  SheetTrigger,
} from "@/components/ui/sheet";
import {
  TableHeader,
  TableRow,
  TableCell,
  TableHead,
  TableBody,
  TableFooter,
  TableCaption,
  Table,
} from "@/components/ui/table";
import { Textarea } from "@/components/ui/textarea";
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from "@/components/ui/accordion";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Checkbox } from "@/components/ui/checkbox";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import {
  Menubar,
  MenubarMenu,
  MenubarTrigger,
  MenubarContent,
  MenubarItem,
  MenubarSeparator,
  MenubarCheckboxItem,
} from "@/components/ui/menubar";
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "@/components/ui/popover";
import { Progress } from "@/components/ui/progress";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  SelectTrigger,
  SelectLabel,
  SelectValue,
  SelectContent,
  SelectGroup,
  SelectItem,
  Select,
} from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Image from "next/image";
import Link from "next/link";
import { PreviewComponentFinal } from "@/app/preview/preview-component-final";
import Icon from "./icon";
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { NavigationMenu, NavigationMenuList, NavigationMenuLink } from "@/components/ui/navigation-menu"
import { Badge } from "@/components/ui/badge";

const componentMap = {
  label: Label,
  table: Table,
  tableheader: TableHeader,
  tablehead: TableHead,
  tablebody: TableBody,
  tablefooter: TableFooter,
  tablerow: TableRow,
  tablecell: TableCell,
  tablecaption: TableCaption,
  card: Card,
  cardheader: CardHeader,
  cardtitle: CardTitle,
  cardcontent: CardContent,
  carddescription: CardDescription,
  cardfooter: CardFooter,
  carousel: Carousel,
  carouselcontent: CarouselContent,
  carouselitem: CarouselItem,
  collapsible: Collapsible,
  collapsibletrigger: CollapsibleTrigger,
  collapsiblecontent: CollapsibleContent,
  pagination: Pagination,
  scrollarea: ScrollArea,
  sheet: Sheet,
  sheetportal: SheetPortal,
  sheetoverlay: SheetOverlay,
  sheetcontent: SheetContent,
  sheetheader: SheetHeader,
  sheetfooter: SheetFooter,
  sheetclose: SheetClose,
  sheettitle: SheetTitle,
  sheetdescription: SheetDescription,
  sheettrigger: SheetTrigger,
  textarea: Textarea,
  accordion: Accordion,
  accordionitem: AccordionItem,
  accordiontrigger: AccordionTrigger,
  accordioncontent: AccordionContent,
  avatar: Avatar,
  avatarimage: AvatarImage,
  avatarfallback: AvatarFallback,
  checkbox: Checkbox,
  dropdownmenu: DropdownMenu,
  dropdownmenutrigger: DropdownMenuTrigger,
  dropdownmenucontent: DropdownMenuContent,
  dropdownmenuitem: DropdownMenuItem,
  dropdownmenulabel: DropdownMenuLabel,
  dropdownmenuseparator: DropdownMenuSeparator,
  menubar: Menubar,
  menubarmenu: MenubarMenu,
  menubartrigger: MenubarTrigger,
  menubarcontent: MenubarContent,
  menubaritem: MenubarItem,
  menubarseparator: MenubarSeparator,
  menubarcheckboxitem: MenubarCheckboxItem,
  popover: Popover,
  popovertrigger: PopoverTrigger,
  popovercontent: PopoverContent,
  progress: Progress,
  radiogroup: RadioGroup,
  radiogroupitem: RadioGroupItem,
  selecttrigger: SelectTrigger,
  selectlabel: SelectLabel,
  selectvalue: SelectValue,
  selectcontent: SelectContent,
  selectgroup: SelectGroup,
  selectitem: SelectItem,
  select: Select,
  slider: Slider,
  switch: Switch,
  tabs: Tabs,
  tabslist: TabsList,
  tabstrigger: TabsTrigger,
  tabscontent: TabsContent,
  badge: Badge,
  button: Button,
  input: Input,
  image: Image,
  link: Link,
  icon: Icon,
  code: "code",
  pre: "pre",
  dialog: Dialog,
  dialogtrigger: DialogTrigger,
  dialogcontent: DialogContent,
  dialogclose: DialogClose,
  dialogheader: DialogHeader,
  dialogfooter: DialogFooter,
  dialogtitle: DialogTitle,
  dialogdescription: DialogDescription,
  navigationmenu: NavigationMenu, 
  navigationmenulist: NavigationMenuList, 
  navigationmenulink: NavigationMenuLink,
};


export const renderComponentFinal = (
  itemId: string,
  selectedItemId?: string,
  isOver?: boolean,
  ref: any,
  item?: TreeItem,
  onSelect: any,
  onMove: any,
  onRemove: any,
  onUpdate: any,
  addComponent: any,
  levelHovered: any,
  setLevelHovered: any,
  level: number,
  getTree: any,
) => {
  // const background = `${item.background}`

  let newStyle = item?.props?.style ?? {};

  if (item?.props?.background) {
    newStyle = {
      ...newStyle,
      background: `${item?.props?.background ?? ""}`,
    };
  }

  const dontWidth = [
    "svg",
    "img",
    "image",
    "table",
    "tableheader",
    "tablebody",
    "tablefooter",
    "tablehead",
    "tablecaption",
    "tablerow",
    "tablecell",
    "th",
    "tr",
    "td",
  ]

  let childClasses = item?.props?.className?.split(" ") ?? [''];


  //   alert('AAAAAAA');
  // console.log(e)
  // var oldValue = JSON.parse(window.localStorage.getItem('traqix_mem_city'))
  // var dataSave = JSON.stringify({...oldValue, value: e.target.value})
  // window.localStorage.setItem('traqix_mem_city', dataSave);

  // var newValue = '0'
  // var dataSave = JSON.stringify({type:"string",value: newValue})
  // window.localStorage.setItem('traqix_mem_ddddd', dataSave);

  const handleClick = (e: any, passFn: string) => {
    try {
      // Avalia o código passado como string
      console.log('FN', `${passFn}`)
      eval(`${passFn}`);
    } catch (error) {
      console.error('Erro ao executar a função:', error);
    }
  };


  const handleChangeValue = (e: any, passFn: string) => {
    try {
      // Avalia o código passado como string
      console.log('FN', `${passFn}`)
      eval(`${passFn}`);
    } catch (error) {
      console.error('Erro ao executar a função:', error);
    }
  };


  // if (item?.props?.onclick && item?.props?.onclick != undefined) {

  //   try {
  //     item.props.onClick = handleClick(item.props.onclick);
  //     console.log("AAAAAAAAA 11111", item.props.onclick);
  //   } catch (e) {
  //     item.props.onclick = eval(`() => { alert('EEEE'); console.log("EEEEEEEEEEEEEEEEE"); }`)
  //     console.log("AAAAAAAAA errr2", item?.props?.onclick, e);
  //   }
  // }


  // if (!item?.props?.width) {
  //   if (item?.props?.className) {
  //     const existWidth = matchTailwindClassesWidth(
  //       item?.props?.className ?? ""
  //     );
  //     if (existWidth.length || parentClasses.length || item?.type == "Button" || item?.type == "button") {
  //       newStyle = {
  //         ...newStyle,
  //         width: "100%",
  //       };
  //     }
  //   } else {
  //     newStyle = {
  //       ...newStyle,
  //       width: "100%",
  //     };
  //   }
  // }

  // if (childClasses.includes("flex")) {
  //   newStyle = {
  //     ...newStyle,
  //     height: "100%",
  //   };
  // }

  const commonProps: any = {
    ...item?.props,
    className: `${childClasses.join(" ") || ""}`,
    onClick: (e: MouseEvent) => {
      e.stopPropagation();
      onSelect(item);
    },
    style: newStyle,
  };

  if (item?.type.toLowerCase().endsWith('icon')) {
    return <Icon name={item.type} ref={ref} {...commonProps} />
  }

  switch (item?.type.toLowerCase()) {

    case "navigationmenulink":
    case "sheettrigger":
    case "dropdownmenutrigger":
    case "popovertrigger":
      const DynamicComponentSpecial1 = componentMap[item?.type?.toLowerCase()] || item?.type;
      return (
        <DynamicComponentSpecial1 {...commonProps} ref={ref}>
          <>
            {item?.children?.length ? "" : item?.props?.content}
            {item?.children &&
              item?.children.map((childId) => {
                return (
                  <PreviewComponentFinal
                    key={`${childId}-${item.id}`}
                    itemId={childId}
                    selectedItemId={selectedItemId}
                    onSelect={onSelect}
                    onMove={onMove}
                    onRemove={onRemove}
                    onUpdate={onUpdate}
                    addComponent={addComponent}
                    levelHovered={levelHovered}
                    setLevelHovered={setLevelHovered}
                    level={level + 1}
                  />
                )
            })}
          </>
        </DynamicComponentSpecial1>
      )

    // specials
    case "button":
      return (
        <Button {...commonProps} ref={ref} onClick={(e) => handleClick(e, item?.props?.onclick)}>
          {item.children?.length ? "" : item?.props?.content}
          {item.children &&
            item.children.map((childId) => {
              return (
                <PreviewComponentFinal
                  key={`${childId}-${item.id}`}
                  itemId={childId}
                  selectedItemId={selectedItemId}
                  onSelect={onSelect}
                  onMove={onMove}
                  onRemove={onRemove}
                  onUpdate={onUpdate}
                  addComponent={addComponent}
                  levelHovered={levelHovered}
                  setLevelHovered={setLevelHovered}
                  level={level + 1}
                />
              )
          })}
        </Button>
      );

    case "textarea":
      return <Textarea {...commonProps} ref={ref} onChange={(e) => handleChangeValue(e, item?.props?.onchange)} />;

    case "input":
      return <Input {...commonProps} ref={ref} onChange={(e) => handleChangeValue(e, item?.props?.onchange)} />;

    case "hr":
      return <hr {...commonProps} ref={ref} />;


    case "text":
      return (
        <span {...commonProps} ref={ref}>
          {item.children?.length ? "" : item?.props?.content}
        </span>
      );

    case "link":
    case "a":
      return (
        <Link {...commonProps} href={ref}>
          {item.children?.length ? "" : item?.props?.content}
          {item.children &&
            item.children.map((childId) => {
              return (
                <PreviewComponentFinal
                  key={`${childId}-${item.id}`}
                  itemId={childId}
                  selectedItemId={selectedItemId}
                  onSelect={onSelect}
                  onMove={onMove}
                  onRemove={onRemove}
                  onUpdate={onUpdate}
                  addComponent={addComponent}
                  levelHovered={levelHovered}
                  setLevelHovered={setLevelHovered}
                  level={level + 1}
                />
              )
          })}
        </Link>
      );


    case "svg":
      return (
        <svg {...commonProps} ref={ref}>
          {item.children &&
            item.children.map((childName) => {
              const child = getTree(childName)
              switch (child.name) {
                case "path":
                  return <path key={`${child}-${itemId}`} {...child.props} />;
                case "circle":
                  return <circle key={`${child}-${itemId}`} {...child.props} />;
                case "rect":
                  return <rect key={`${child}-${itemId}`} {...child.props} />;
                case "line":
                  return <line key={`${child}-${itemId}`} {...child.props} />;
                case "polyline":
                  return (
                    <polyline key={`${child}-${itemId}`} {...child.props} />
                  );
                case "polygon":
                  return (
                    <polygon key={`${child}-${itemId}`} {...child.props} />
                  );
                case "ellipse":
                  return (
                    <ellipse key={`${child}-${itemId}`} {...child.props} />
                  );
                // Se houver outros componentes SVG especiais, você pode mapeá-los aqui
                default:
                  return (JSON.stringify(child))
                //   // Caso não seja um componente SVG específico, continua a recursão com PreviewComponentFinal
                //   return (
                //     <PreviewComponentFinal
                //       key={`${child}-${itemId}`}
                //       itemId={child}
                //       selectedItemId={selectedItemId}
                //       onSelect={onSelect}
                //       onMove={onMove}
                //       onRemove={onRemove}
                //       onUpdate={onUpdate}
                //       addComponent={addComponent}
                //       levelHovered={levelHovered}
                //       setLevelHovered={setLevelHovered}
                //       level={level + 1}
                //     />
                //   );
              }
            })}
        </svg>
      );

    case "selectvalue":
      return <SelectValue {...commonProps} />;

    case "pagination":
      return <Pagination {...commonProps} ref={ref} />;

    case "slider":
      return <Slider {...commonProps} ref={ref} />;

    case "br":
      return <br {...commonProps} ref={ref} />;

    case "hr":
      return <hr {...commonProps} ref={ref} />;

    case "progress":
      return <Progress {...commonProps} ref={ref} />;

    case "checkbox":
      return <Checkbox {...commonProps} ref={ref} />;

    case "switch":
      return <Switch {...commonProps} ref={ref} />;


    case "img":
    case "image":
      const width = item?.props?.width ?? 10;
      const height = item?.props?.height ?? 10;

      return <Image {...commonProps} width={width} height={height} ref={ref} />;

    case "table":
    case "tableheader":
    case "tablebody":
    case "tablefooter":
    case "tablehead":
    case "tablecaption":
    case "tablerow":
    case "tablecell":
      const DynamicComponentSpecial = componentMap[item?.type?.toLowerCase()] || item?.type;
      return (
        <DynamicComponentSpecial {...commonProps} ref={ref}>
          {item?.children?.length ? "" : item?.props?.content}
          {item?.children &&
            item?.children.map((childId) => {
              return (
                <PreviewComponentFinal
                  key={`${childId}-${item.id}`}
                  itemId={childId}
                  selectedItemId={selectedItemId}
                  onSelect={onSelect}
                  onMove={onMove}
                  onRemove={onRemove}
                  onUpdate={onUpdate}
                  addComponent={addComponent}
                  levelHovered={levelHovered}
                  setLevelHovered={setLevelHovered}
                  level={level + 1}
                />
              )
          })}
        </DynamicComponentSpecial>
      )

    case "avatarimage":
      const DynamicComponentSpecial2 = componentMap[item?.type?.toLowerCase()] || item?.type;
      return (
        <DynamicComponentSpecial2 {...commonProps} ref={ref} />
      );

    // defaults
    case "h1":
    case "h2":
    case "h3":
    case "h4":
    case "h5":
    case "h6":
    case "scrollarea":
    case "p":

    case "form":
    
    case "ol":
    case "ul":
    case "li":

    case "code":
    case "pre":

    case "strong":
    case "label":
    case "span":


    case "selectcontent":
    case "selectgroup":
    case "selectitem":

    case "article":

    case "textarea":
    case "card":
    case "cardheader":
    case "cardtitle":
    case "cardcontent":
    case "carddescription":
    case "cardfooter":

    case "accordion":
    case "accordionitem":
    case "accordiontrigger":
    case "accordioncontent":

    case "tabs":
    case "tabslist":
    case "tabstrigger":
    case "tabscontent":


    case "collapsible":
    case "collapsibletrigger":
    case "collapsiblecontent":

    case "select":
    case "selecttrigger":
    case "selectlabel":

    case "sheet":
    case "badge":
    case "menubar":
    case "dropdownmenu":
    case "popover":
    case "carousel":
    case "avatar":
    case "radiogroup":
    case "radiogroupitem":

    case "div":
    case "aside":
    case "header":
    case "footer":
    case "nav":
    case "main":
    case "section":
    default:
      const DynamicComponent = componentMap[item?.type?.toLowerCase()] || item?.type;
      return (
        <DynamicComponent {...commonProps} ref={ref}>
          {item?.children?.length || !item?.allowsChildren ? "" : item?.props?.content}
          {item?.allowsChildren && item?.children &&
            item?.children.map((childId) => {
              return (
                <PreviewComponentFinal
                  key={`${childId}-${item.id}`}
                  itemId={childId}
                  selectedItemId={selectedItemId}
                  onSelect={onSelect}
                  onMove={onMove}
                  onRemove={onRemove}
                  onUpdate={onUpdate}
                  addComponent={addComponent}
                  levelHovered={levelHovered}
                  setLevelHovered={setLevelHovered}
                  level={level + 1}
                />
              )
          })}
        </DynamicComponent>
      );

    // default:
    //   return (
    //     <div {...commonProps} ref={ref}>
    //       {(item?.props?.content || item?.type) ?? ""}
    //     </div>
    //   );
  }
};
