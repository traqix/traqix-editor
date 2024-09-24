import React, { useState } from "react";
import { useDrag, useDrop } from "react-dnd";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Switch } from "@/components/ui/switch";
import { Slider } from "@/components/ui/slider";
import { Trash2, Plus, Move, ArrowLeftRightIcon, ArrowRightIcon, PlusIcon, MinusIcon, SquareDivideIcon, DivideIcon, SmileIcon, PencilIcon, CheckIcon, ExpandIcon, ConstructionIcon, MenuIcon, ArrowLeftIcon, PlayIcon, HomeIcon, WalletIcon, UsersIcon, TrashIcon, DownloadIcon, TicketIcon, MessageCircleIcon, LayersIcon, InboxIcon, ShareIcon, ChevronRightIcon, ChevronLeftIcon, FolderIcon, StickyNoteIcon, CameraIcon, SendIcon, SearchIcon, HeartIcon, ReplyIcon, BookmarkIcon, KanbanIcon, BackpackIcon, ListTodoIcon, ActivityIcon, MergeIcon, LockIcon, SettingsIcon, CombineIcon, RepeatIcon, TwitterIcon, CookieIcon, AlignRightIcon, AlignLeftIcon, UnderlineIcon, ItalicIcon, BoldIcon, AlignCenterIcon, ListIcon, ImageIcon, LinkIcon, LayoutDashboardIcon, MegaphoneIcon, GaugeIcon, ComputerIcon, ComponentIcon, BarChartIcon, CreativeCommonsIcon, FileTextIcon, BellIcon, UserIcon, MailIcon, CircleCheckIcon, FilterIcon, DoorClosedIcon, FlaskConical, FlaskConicalIcon, NewspaperIcon, InfoIcon, MicVocalIcon, DollarSignIcon, TagIcon, Package2Icon, CreditCardIcon, ArrowUpIcon, ArrowDownIcon, Trash2Icon, ForwardIcon, FileIcon, LightbulbIcon, FileTypeIcon, SunDimIcon, PauseIcon, ScanIcon, AirplayIcon, PaperclipIcon, MoveVerticalIcon, PhoneIcon, VideoIcon, MoveHorizontalIcon, ClockIcon, ArrowUpRightIcon, CoinsIcon, BlocksIcon, FuelIcon, MoveUpIcon, KeyIcon, ShuffleIcon, SandwichIcon, BotIcon, TriangleIcon, Tally1Icon, ClipboardIcon, VoteIcon, ChevronDownIcon, XIcon, AppleIcon, ChromeIcon, TextIcon, BrushIcon, CodeIcon, MapPinIcon, NotebookIcon, CalendarIcon, DatabaseIcon, BookIcon, HashIcon, SlackIcon, StarIcon, SpeakerIcon, BatteryIcon, BluetoothIcon, BedIcon, StepBackIcon, SmartphoneIcon, WifiIcon, ThermometerIcon, MountainIcon, FacebookIcon, InstagramIcon } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { TreeItem } from "../types";
import Link from "next/link";
import Image from "next/image";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { Table, TableBody, TableCaption, TableCell, TableFooter, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Pagination } from "@/components/ui/pagination";
import { Sheet, SheetClose, SheetContent, SheetDescription, SheetFooter, SheetHeader, SheetOverlay, SheetPortal, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Menubar, MenubarCheckboxItem, MenubarContent, MenubarItem, MenubarMenu, MenubarSeparator, MenubarTrigger } from "@/components/ui/menubar";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Carousel, CarouselContent, CarouselItem } from "@/components/ui/carousel";

interface MainEditorProps {
  tree: TreeItem[];
  selectedItemId: string | null;
  onSelect: (item: TreeItem) => void;
  onMove: (
    draggedId: string,
    targetId: string,
    position: "before" | "after" | "inside"
  ) => void;
  onRemove: (id: string) => void;
  onUpdate: (id: string, updates: Partial<TreeItem>) => void;
  previewMode: "desktop" | "tablet" | "mobile";
  generatedCode: string;
  rawCode: string;
  handleRawCodeChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  rawCodeTsx: string;
  handleRawCodeTsxChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  handleRawCodeTsxClear: () => void;
  applyRawCode: () => void;
  tsxToJson: () => void
  addComponent: (component: Partial<TreeItem>, parentId?: string) => void;
}

const PreviewComponent: React.FC<{
  item: TreeItem;
  selectedItemId: string | null;
  onSelect: (item: TreeItem) => void;
  onMove: (
    draggedId: string,
    targetId: string,
    position: "before" | "after" | "inside"
  ) => void;
  onRemove: (id: string) => void;
  onUpdate: (id: string, updates: Partial<TreeItem>) => void;
  addComponent: (component: Partial<TreeItem>, parentId?: string) => void;
  level: number;
}> = ({
  item,
  selectedItemId,
  onSelect,
  onMove,
  onRemove,
  onUpdate,
  addComponent,
  level,
}) => {
  const [isHovered, setIsHovered] = useState(false);
  const [{ isDragging }, drag, preview] = useDrag({
    type: "COMPONENT",
    item: { id: item.id, type: item.type },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  });

  const [{ isOver, canDrop }, drop] = useDrop({
    accept: ["COMPONENT", "NEW_COMPONENT"],
    drop: (droppedItem: { id?: string; type: string }, monitor) => {
      if (!monitor.didDrop()) {
        const clientOffset = monitor.getClientOffset();
        const hoverBoundingRect = ref.current?.getBoundingClientRect();
        if (clientOffset && hoverBoundingRect) {
          const hoverMiddleY =
            (hoverBoundingRect.bottom - hoverBoundingRect.top) / 2;
          const hoverClientY = clientOffset.y - hoverBoundingRect.top;
          if (droppedItem.id) {
            if (hoverClientY < hoverMiddleY) {
              onMove(droppedItem.id, item.id, "before");
            } else if (hoverClientY > hoverMiddleY) {
              onMove(droppedItem.id, item.id, "after");
            }
          } else {
            addComponent(
              { type: droppedItem.type, props: { content: `New ${droppedItem.type}` }},
              item.id
            );
          }
        }
      }
    },
    collect: (monitor) => ({
      isOver: monitor.isOver({ shallow: true }),
      canDrop: monitor.canDrop(),
    }),
  });

  const ref = React.useRef<HTMLDivElement>(null);
  drag(drop(ref));

  // const handleContentChange = (e: React.ChangeEvent<HTMLInputElement>) => {
  //   onUpdate(item.id, { content: e.target.value })
  // }

  // const handleClassChange = (e: React.ChangeEvent<HTMLInputElement>) => {
  //   onUpdate(item.id, { props: { ...item.props, className: e.target.value } })
  // }

  // const handleBackgroundChange = (e: React.ChangeEvent<HTMLInputElement>) => {
  //   onUpdate(item.id, { props: { ...item.props, style: { background: e.target.value } } })
  // }

  const renderComponent = () => {
    // const background = `${item.background}`

    let newStyle = item.props?.style ?? {}
    
    if (item.props?.background) {
      newStyle = {
        ...newStyle,
        background: `${item.props?.background ?? ""}`,
      }
    }

    if(!item.props?.width) {
      if (item.props?.className) {
        if(!(item.props?.className.includes(' w-') || item.props?.className.startsWith('w-') || item.type.endsWith("Icon"))){
          newStyle = {
            ...newStyle,
            width: '100%',
          }
        }
      } else {
        newStyle = {
          ...newStyle,
          width: '100%',
        }
      }
    }

    const commonProps: any = {
      ...item.props,
      className: `${item.props?.className || ""} ${
        selectedItemId === item.id ? "ring-2 ring-blue-500" : ""
      } ${isOver ? "bg-blue-100" : ""}`,
      onClick: (e: React.MouseEvent) => {
        e.stopPropagation();
        onSelect(item);
      },
      style: newStyle,
    };

    switch (item.type) {
      case "div":
      case "aside":
      case "header":
      case "footer":
      case "nav":
      case "main":
      case "section":
        return (
          <div {...commonProps} ref={ref}>
            {item.props?.content ?? ''}
            {item.children &&
              item.children.map((child) => (
                <PreviewComponent
                  key={child.id}
                  item={child}
                  selectedItemId={selectedItemId}
                  onSelect={onSelect}
                  onMove={onMove}
                  onRemove={onRemove}
                  onUpdate={onUpdate}
                  addComponent={addComponent}
                  level={level + 1}
                />
              ))}
          </div>
        );
      case "h1":
        return (
          <h1 {...commonProps} ref={ref}>
            {item.children &&
              item.children.map((child) => (
                <PreviewComponent
                  key={child.id}
                  item={child}
                  selectedItemId={selectedItemId}
                  onSelect={onSelect}
                  onMove={onMove}
                  onRemove={onRemove}
                  onUpdate={onUpdate}
                  addComponent={addComponent}
                  level={level + 1}
                />
              ))}
            {item.props?.content}
          </h1>
        );
      case "h2":
        return (
          <h2 {...commonProps} ref={ref}>
            {item.children &&
              item.children.map((child) => (
                <PreviewComponent
                  key={child.id}
                  item={child}
                  selectedItemId={selectedItemId}
                  onSelect={onSelect}
                  onMove={onMove}
                  onRemove={onRemove}
                  onUpdate={onUpdate}
                  addComponent={addComponent}
                  level={level + 1}
                />
              ))}
            {item.props?.content}
          </h2>
        );
      case "h3":
        return (
          <h3 {...commonProps} ref={ref}>
            {item.children &&
              item.children.map((child) => (
                <PreviewComponent
                  key={child.id}
                  item={child}
                  selectedItemId={selectedItemId}
                  onSelect={onSelect}
                  onMove={onMove}
                  onRemove={onRemove}
                  onUpdate={onUpdate}
                  addComponent={addComponent}
                  level={level + 1}
                />
              ))}
            {item.props?.content}
          </h3>
        );
      case "h4":
        return (
          <h4 {...commonProps} ref={ref}>
            {item.children &&
              item.children.map((child) => (
                <PreviewComponent
                  key={child.id}
                  item={child}
                  selectedItemId={selectedItemId}
                  onSelect={onSelect}
                  onMove={onMove}
                  onRemove={onRemove}
                  onUpdate={onUpdate}
                  addComponent={addComponent}
                  level={level + 1}
                />
              ))}
            {item.props?.content}
          </h4>
        );
      case "h5":
        return (
          <h5 {...commonProps} ref={ref}>
            {item.children &&
              item.children.map((child) => (
                <PreviewComponent
                  key={child.id}
                  item={child}
                  selectedItemId={selectedItemId}
                  onSelect={onSelect}
                  onMove={onMove}
                  onRemove={onRemove}
                  onUpdate={onUpdate}
                  addComponent={addComponent}
                  level={level + 1}
                />
              ))}
            {item.props?.content}
          </h5>
        );
      case "h6":
        return (
          <h6 {...commonProps} ref={ref}>
            {item.children &&
              item.children.map((child) => (
                <PreviewComponent
                  key={child.id}
                  item={child}
                  selectedItemId={selectedItemId}
                  onSelect={onSelect}
                  onMove={onMove}
                  onRemove={onRemove}
                  onUpdate={onUpdate}
                  addComponent={addComponent}
                  level={level + 1}
                />
              ))}
            {item.props?.content}
          </h6>
        );

      case "ScrollArea":
        return (
          <ScrollArea {...commonProps} ref={ref}>
            {item.children &&
              item.children.map((child) => (
                <PreviewComponent
                  key={child.id}
                  item={child}
                  selectedItemId={selectedItemId}
                  onSelect={onSelect}
                  onMove={onMove}
                  onRemove={onRemove}
                  onUpdate={onUpdate}
                  addComponent={addComponent}
                  level={level + 1}
                />
              ))}
            {item.props?.content}
          </ScrollArea>
        );

      case "p":
        return (
          <p {...commonProps} ref={ref}>
            {item.children &&
              item.children.map((child) => (
                <PreviewComponent
                  key={child.id}
                  item={child}
                  selectedItemId={selectedItemId}
                  onSelect={onSelect}
                  onMove={onMove}
                  onRemove={onRemove}
                  onUpdate={onUpdate}
                  addComponent={addComponent}
                  level={level + 1}
                />
              ))}
            {item.props?.content}
          </p>
        );
      case "Button":
      case "button":
        return (
          <Button {...commonProps} ref={ref}>
            {item.children &&
              item.children.map((child) => (
                <PreviewComponent
                  key={child.id}
                  item={child}
                  selectedItemId={selectedItemId}
                  onSelect={onSelect}
                  onMove={onMove}
                  onRemove={onRemove}
                  onUpdate={onUpdate}
                  addComponent={addComponent}
                  level={level + 1}
                />
              ))}
            {item.props?.content}
          </Button>
        );

      case "Input":
      case "input":
        return (
          <Input {...commonProps} ref={ref} />
        );

      case "form":
        return (
          <form {...commonProps} ref={ref} placeholder={item.props?.content}>
            {item.children &&
              item.children.map((child) => (
                <PreviewComponent
                  key={child.id}
                  item={child}
                  selectedItemId={selectedItemId}
                  onSelect={onSelect}
                  onMove={onMove}
                  onRemove={onRemove}
                  onUpdate={onUpdate}
                  addComponent={addComponent}
                  level={level + 1}
                />
              ))}
            {item.props?.content}
        </form>);

      case "hr":
        return (
          <hr {...commonProps} ref={ref} />);
        
      case "ol":
        return (
          <ol {...commonProps} ref={ref} placeholder={item.props?.content}>
            {item.children &&
              item.children.map((child) => (
                <PreviewComponent
                  key={child.id}
                  item={child}
                  selectedItemId={selectedItemId}
                  onSelect={onSelect}
                  onMove={onMove}
                  onRemove={onRemove}
                  onUpdate={onUpdate}
                  addComponent={addComponent}
                  level={level + 1}
                />
              ))}
            {item.props?.content}
        </ol>);
      case "ul":
        return (
          <ul {...commonProps} ref={ref} placeholder={item.props?.content}>
            {item.children &&
              item.children.map((child) => (
                <PreviewComponent
                  key={child.id}
                  item={child}
                  selectedItemId={selectedItemId}
                  onSelect={onSelect}
                  onMove={onMove}
                  onRemove={onRemove}
                  onUpdate={onUpdate}
                  addComponent={addComponent}
                  level={level + 1}
                />
              ))}
            {item.props?.content}
        </ul>);
      case "li":
        return (
          <li {...commonProps} ref={ref} >
            {item.children &&
              item.children.map((child) => (
                <PreviewComponent
                  key={child.id}
                  item={child}
                  selectedItemId={selectedItemId}
                  onSelect={onSelect}
                  onMove={onMove}
                  onRemove={onRemove}
                  onUpdate={onUpdate}
                  addComponent={addComponent}
                  level={level + 1}
                />
              ))}
        </li>);
        
    
      case "code":
        return (
          <code {...commonProps} ref={ref} >
            {item.children &&
              item.children.map((child) => (
                <PreviewComponent
                  key={child.id}
                  item={child}
                  selectedItemId={selectedItemId}
                  onSelect={onSelect}
                  onMove={onMove}
                  onRemove={onRemove}
                  onUpdate={onUpdate}
                  addComponent={addComponent}
                  level={level + 1}
                />
              ))}
            {item.props?.content}
        </code>);
      case "pre":
        return (
          <pre {...commonProps} ref={ref} >
            {item.children &&
              item.children.map((child) => (
                <PreviewComponent
                  key={child.id}
                  item={child}
                  selectedItemId={selectedItemId}
                  onSelect={onSelect}
                  onMove={onMove}
                  onRemove={onRemove}
                  onUpdate={onUpdate}
                  addComponent={addComponent}
                  level={level + 1}
                />
              ))}
            {item.props?.content}
        </pre>);

      case "strong":
        return (
          <strong {...commonProps} ref={ref} >
            {item.children &&
              item.children.map((child) => (
                <PreviewComponent
                  key={child.id}
                  item={child}
                  selectedItemId={selectedItemId}
                  onSelect={onSelect}
                  onMove={onMove}
                  onRemove={onRemove}
                  onUpdate={onUpdate}
                  addComponent={addComponent}
                  level={level + 1}
                />
              ))}
            {item.props?.content}
          </strong>
        );
      case "label":
      case "Label":
        return (
          <Label {...commonProps} ref={ref} >
            {item.children &&
              item.children.map((child) => (
                <PreviewComponent
                  key={child.id}
                  item={child}
                  selectedItemId={selectedItemId}
                  onSelect={onSelect}
                  onMove={onMove}
                  onRemove={onRemove}
                  onUpdate={onUpdate}
                  addComponent={addComponent}
                  level={level + 1}
                />
              ))}
            {item.props?.content}
          </Label>
        );
      case "Text":
      case "text":
      case "span":
        return (
          <span {...commonProps} ref={ref} >
            {item.children &&
              item.children.map((child) => (
                <PreviewComponent
                  key={child.id}
                  item={child}
                  selectedItemId={selectedItemId}
                  onSelect={onSelect}
                  onMove={onMove}
                  onRemove={onRemove}
                  onUpdate={onUpdate}
                  addComponent={addComponent}
                  level={level + 1}
                />
              ))}
            {item.props?.content}
          </span>
        );

      case "a":

      case "Link":
            return (<Link {...commonProps} href={ref} >
                {item.children &&
                item.children.map((child) => (
                    <PreviewComponent
                    key={child.id}
                    item={child}
                    selectedItemId={selectedItemId}
                    onSelect={onSelect}
                    onMove={onMove}
                    onRemove={onRemove}
                    onUpdate={onUpdate}
                    addComponent={addComponent}
                    level={level + 1}
                    />
                ))}
                {item.props?.content}
            </Link>);

      case "Textarea":
      case "textarea":
        return (
          <Textarea {...commonProps} ref={ref}>
            {item.props?.content}
          </Textarea>
        );

      case "Card":
      case "card":
        return (
          <Card {...commonProps} ref={ref}>
            {item.props?.content ?? ''}
            {item.children &&
              item.children.map((child) => (
                <PreviewComponent
                  key={child.id}
                  item={child}
                  selectedItemId={selectedItemId}
                  onSelect={onSelect}
                  onMove={onMove}
                  onRemove={onRemove}
                  onUpdate={onUpdate}
                  addComponent={addComponent}
                  level={level + 1}
                />
              ))}
          </Card>
        );
      case "CardHeader":
        return (
          <CardHeader {...commonProps} ref={ref}>
            {item.props?.content ?? ''}
            {item.children &&
              item.children.map((child) => (
                <PreviewComponent
                  key={child.id}
                  item={child}
                  selectedItemId={selectedItemId}
                  onSelect={onSelect}
                  onMove={onMove}
                  onRemove={onRemove}
                  onUpdate={onUpdate}
                  addComponent={addComponent}
                  level={level + 1}
                />
              ))}
          </CardHeader>
        );
      case "CardTitle":
        return (
          <CardTitle {...commonProps} ref={ref}>
            {item.props?.content ?? ''}
            {item.children &&
              item.children.map((child) => (
                <PreviewComponent
                  key={child.id}
                  item={child}
                  selectedItemId={selectedItemId}
                  onSelect={onSelect}
                  onMove={onMove}
                  onRemove={onRemove}
                  onUpdate={onUpdate}
                  addComponent={addComponent}
                  level={level + 1}
                />
              ))}
          </CardTitle>
        );
      case "CardContent":
        return (
          <CardContent {...commonProps} ref={ref}>
            {item.props?.content ?? ''}
            {item.children &&
              item.children.map((child) => (
                <PreviewComponent
                  key={child.id}
                  item={child}
                  selectedItemId={selectedItemId}
                  onSelect={onSelect}
                  onMove={onMove}
                  onRemove={onRemove}
                  onUpdate={onUpdate}
                  addComponent={addComponent}
                  level={level + 1}
                />
              ))}
          </CardContent>
        );
      case "CardDescription":
        return (
          <CardDescription {...commonProps} ref={ref}>
            {item.props?.content ?? ''}
            {item.children &&
              item.children.map((child) => (
                <PreviewComponent
                  key={child.id}
                  item={child}
                  selectedItemId={selectedItemId}
                  onSelect={onSelect}
                  onMove={onMove}
                  onRemove={onRemove}
                  onUpdate={onUpdate}
                  addComponent={addComponent}
                  level={level + 1}
                />
              ))}
          </CardDescription>
        );
      case "CardFooter":
        return (
          <CardFooter {...commonProps} ref={ref}>
            {item.props?.content ?? ''}
            {item.children &&
              item.children.map((child) => (
                <PreviewComponent
                  key={child.id}
                  item={child}
                  selectedItemId={selectedItemId}
                  onSelect={onSelect}
                  onMove={onMove}
                  onRemove={onRemove}
                  onUpdate={onUpdate}
                  addComponent={addComponent}
                  level={level + 1}
                />
              ))}
          </CardFooter>
        );


      case "Accordion":
        return (
          <Accordion type="single" collapsible {...commonProps} ref={ref}>
            {item.props?.content ?? ''}
            {item.children &&
              item.children.map((child) => (
                <PreviewComponent
                  key={child.id}
                  item={child}
                  selectedItemId={selectedItemId}
                  onSelect={onSelect}
                  onMove={onMove}
                  onRemove={onRemove}
                  onUpdate={onUpdate}
                  addComponent={addComponent}
                  level={level + 1}
                />
              ))}
          </Accordion>
        );
      case "AccordionItem":
        return (
          <AccordionItem type="single" collapsible {...commonProps} ref={ref}>
            {item.props?.content ?? ''}
            {item.children &&
              item.children.map((child) => (
                <PreviewComponent
                  key={child.id}
                  item={child}
                  selectedItemId={selectedItemId}
                  onSelect={onSelect}
                  onMove={onMove}
                  onRemove={onRemove}
                  onUpdate={onUpdate}
                  addComponent={addComponent}
                  level={level + 1}
                />
              ))}
          </AccordionItem>
        );
      case "AccordionTrigger":
        return (
          <AccordionTrigger {...commonProps} ref={ref}>
            {item.props?.content ?? ''}
            {item.children &&
              item.children.map((child) => (
                <PreviewComponent
                  key={child.id}
                  item={child}
                  selectedItemId={selectedItemId}
                  onSelect={onSelect}
                  onMove={onMove}
                  onRemove={onRemove}
                  onUpdate={onUpdate}
                  addComponent={addComponent}
                  level={level + 1}
                />
              ))}
          </AccordionTrigger>
        );
      case "AccordionContent":
        return (
          <AccordionContent {...commonProps} ref={ref}>
            {item.props?.content ?? ''}
            {item.children &&
              item.children.map((child) => (
                <PreviewComponent
                  key={child.id}
                  item={child}
                  selectedItemId={selectedItemId}
                  onSelect={onSelect}
                  onMove={onMove}
                  onRemove={onRemove}
                  onUpdate={onUpdate}
                  addComponent={addComponent}
                  level={level + 1}
                />
              ))}
          </AccordionContent>
        );


      case "Tabs":
        return (
          <Tabs {...commonProps} ref={ref}>
            {item.props?.content ?? ''}
            {item.children &&
              item.children.map((child) => (
                <PreviewComponent
                  key={child.id}
                  item={child}
                  selectedItemId={selectedItemId}
                  onSelect={onSelect}
                  onMove={onMove}
                  onRemove={onRemove}
                  onUpdate={onUpdate}
                  addComponent={addComponent}
                  level={level + 1}
                />
              ))}
          </Tabs>
        );
      case "TabsList":
        return (
          <TabsList {...commonProps} ref={ref}>
            {item.props?.content ?? ''}
            {item.children &&
              item.children.map((child) => (
                <PreviewComponent
                  key={child.id}
                  item={child}
                  selectedItemId={selectedItemId}
                  onSelect={onSelect}
                  onMove={onMove}
                  onRemove={onRemove}
                  onUpdate={onUpdate}
                  addComponent={addComponent}
                  level={level + 1}
                />
              ))}
          </TabsList>
        );
      case "TabsTrigger":
        return (
          <TabsTrigger {...commonProps} value={item.props?.value}>
            {item.props?.content ?? ''}
            {item.children &&
              item.children.map((child) => (
                <PreviewComponent
                  key={child.id}
                  item={child}
                  selectedItemId={selectedItemId}
                  onSelect={onSelect}
                  onMove={onMove}
                  onRemove={onRemove}
                  onUpdate={onUpdate}
                  addComponent={addComponent}
                  level={level + 1}
                />
              ))}
          </TabsTrigger>
        );
      case "TabsContent":
        return (
          <TabsContent {...commonProps} value={item.props?.value}>
            {item.props?.content ?? ''}
            {item.children &&
              item.children.map((child) => (
                <PreviewComponent
                  key={child.id}
                  item={child}
                  selectedItemId={selectedItemId}
                  onSelect={onSelect}
                  onMove={onMove}
                  onRemove={onRemove}
                  onUpdate={onUpdate}
                  addComponent={addComponent}
                  level={level + 1}
                />
              ))}
          </TabsContent>
        );

      case "svg":
        return (
          <svg {...commonProps} ref={ref}>
            {item.children &&
              item.children.map((child) => {
                switch (child.name) {
                  case "path":
                    return (
                      <path
                        key={child.id}
                        {...child.props}
                      />
                    );
                  case "circle":
                    return (
                      <circle
                        key={child.id}
                        {...child.props}
                      />
                    );
                  case "rect":
                    return (
                      <rect
                        key={child.id}
                        {...child.props}
                      />
                    );
                  case "line":
                    return (
                      <line
                        key={child.id}
                        {...child.props}
                      />
                    );
                  case "polyline":
                    return (
                      <polyline
                        key={child.id}
                        {...child.props}
                      />
                    );
                  case "polygon":
                    return (
                      <polygon
                        key={child.id}
                        {...child.props}
                      />
                    );
                  case "ellipse":
                    return (
                      <ellipse
                        key={child.id}
                        {...child.props}
                      />
                    );
                  // Se houver outros componentes SVG especiais, você pode mapeá-los aqui
                  default:
                    // Caso não seja um componente SVG específico, continua a recursão com PreviewComponent
                    return (
                      <PreviewComponent
                        key={child.id}
                        item={child}
                        selectedItemId={selectedItemId}
                        onSelect={onSelect}
                        onMove={onMove}
                        onRemove={onRemove}
                        onUpdate={onUpdate}
                        addComponent={addComponent}
                        level={level + 1}
                      />
                    );
                }
              })}
          </svg>
        );
        
      case "Select":
      case "select":
        return (
          <Select {...commonProps} ref={ref}>
            {item.props?.content ?? ''}
            {item.children &&
              item.children.map((child) => (
                <PreviewComponent
                  key={child.id}
                  item={child}
                  selectedItemId={selectedItemId}
                  onSelect={onSelect}
                  onMove={onMove}
                  onRemove={onRemove}
                  onUpdate={onUpdate}
                  addComponent={addComponent}
                  level={level + 1}
                />
              ))}
          </Select>
        );
      case "SelectTrigger":
        return (
          <SelectTrigger {...commonProps} ref={ref}>
            {item.props?.content ?? ''}
            {item.children &&
              item.children.map((child) => (
                <PreviewComponent
                  key={child.id}
                  item={child}
                  selectedItemId={selectedItemId}
                  onSelect={onSelect}
                  onMove={onMove}
                  onRemove={onRemove}
                  onUpdate={onUpdate}
                  addComponent={addComponent}
                  level={level + 1}
                />
              ))}
          </SelectTrigger>
        );
      case "SelectLabel":
        return (
          <SelectLabel {...commonProps} ref={ref}>
            {item.props?.content ?? ''}
            {item.children &&
              item.children.map((child) => (
                <PreviewComponent
                  key={child.id}
                  item={child}
                  selectedItemId={selectedItemId}
                  onSelect={onSelect}
                  onMove={onMove}
                  onRemove={onRemove}
                  onUpdate={onUpdate}
                  addComponent={addComponent}
                  level={level + 1}
                />
              ))}
          </SelectLabel>
        );
      case "SelectValue":
        return <SelectValue {...commonProps} />;
      case "SelectContent":
        return (
          <SelectContent {...commonProps} ref={ref}>
            {item.props?.content ?? ''}
            {item.children &&
              item.children.map((child) => (
                <PreviewComponent
                  key={child.id}
                  item={child}
                  selectedItemId={selectedItemId}
                  onSelect={onSelect}
                  onMove={onMove}
                  onRemove={onRemove}
                  onUpdate={onUpdate}
                  addComponent={addComponent}
                  level={level + 1}
                />
              ))}
          </SelectContent>
        );
      case "SelectGroup":
        return (
          <SelectGroup {...commonProps} ref={ref}>
            {item.props?.content ?? ''}
            {item.children &&
              item.children.map((child) => (
                <PreviewComponent
                  key={child.id}
                  item={child}
                  selectedItemId={selectedItemId}
                  onSelect={onSelect}
                  onMove={onMove}
                  onRemove={onRemove}
                  onUpdate={onUpdate}
                  addComponent={addComponent}
                  level={level + 1}
                />
              ))}
          </SelectGroup>
        );
      case "SelectItem":
        return (
          <SelectItem {...commonProps} value={item.props?.value} ref={ref}>
            {item.props?.content ?? ''}
            {item.children &&
              item.children.map((child) => (
                <PreviewComponent
                  key={child.id}
                  item={child}
                  selectedItemId={selectedItemId}
                  onSelect={onSelect}
                  onMove={onMove}
                  onRemove={onRemove}
                  onUpdate={onUpdate}
                  addComponent={addComponent}
                  level={level + 1}
                />
              ))}
          </SelectItem>
        );

      case "article":
        return (
          <article {...commonProps} ref={ref}>
            {item.props?.content ?? ''}
            {item.children &&
              item.children.map((child) => (
                <PreviewComponent
                  key={child.id}
                  item={child}
                  selectedItemId={selectedItemId}
                  onSelect={onSelect}
                  onMove={onMove}
                  onRemove={onRemove}
                  onUpdate={onUpdate}
                  addComponent={addComponent}
                  level={level + 1}
                />
              ))}
          </article>
        );
        
      case "Table":
        return (
          <Table {...commonProps}>
            {item.children &&
              item.children.map((child) => {
                switch (child.name) {
                  case "TableHeader":
                    return (
                      <TableHeader key={child.id}>
                        {child.children && child.children.map((headerChild) => {
                          switch (headerChild.name) {
                            case "TableRow":
                              return (
                                <TableRow key={headerChild.id}>
                                  {headerChild.children && headerChild.children.map((cellChild) => {
                                    if (cellChild.name === "TableCell") {
                                      return (
                                        <TableCell key={cellChild.id} {...cellChild.props}>
                                          {cellChild.children && cellChild.children.map((cellContent) => (
                                            <PreviewComponent
                                              key={cellContent.id}
                                              item={cellContent}
                                              selectedItemId={selectedItemId}
                                              onSelect={onSelect}
                                              onMove={onMove}
                                              onRemove={onRemove}
                                              onUpdate={onUpdate}
                                              addComponent={addComponent}
                                              level={level + 1}
                                            />
                                          ))}
                                        </TableCell>
                                      );
                                    }
                                    if (cellChild.name === "TableHead") {
                                      return (
                                        <TableHead key={cellChild.id} {...cellChild.props}>
                                          {cellChild.children && cellChild.children.map((cellContent) => (
                                            <PreviewComponent
                                              key={cellContent.id}
                                              item={cellContent}
                                              selectedItemId={selectedItemId}
                                              onSelect={onSelect}
                                              onMove={onMove}
                                              onRemove={onRemove}
                                              onUpdate={onUpdate}
                                              addComponent={addComponent}
                                              level={level + 1}
                                            />
                                          ))}
                                        </TableHead>
                                      );
                                    }
                                    return cellChild.name; // Retorna null se não for TableCell
                                  })}
                                </TableRow>
                              );
                            default:
                              return headerChild.name; // Lida com outros casos, se necessário
                          }
                          
                        })}
                      </TableHeader>
                    );
                  case "TableBody":
                    return (
                      <TableBody key={child.id}>
                        {child.children && child.children.map((bodyChild) => {
                          switch (bodyChild.name) {
                            case "TableRow":
                              return (
                                <TableRow key={bodyChild.id}>
                                  {bodyChild.children && bodyChild.children.map((cellChild) => {
                                    if (cellChild.name === "TableCell") {
                                      return (
                                        <TableCell key={cellChild.id} {...cellChild.props}>
                                          {cellChild.children && cellChild.children.map((cellContent) => (
                                            <PreviewComponent
                                              key={cellContent.id}
                                              item={cellContent}
                                              selectedItemId={selectedItemId}
                                              onSelect={onSelect}
                                              onMove={onMove}
                                              onRemove={onRemove}
                                              onUpdate={onUpdate}
                                              addComponent={addComponent}
                                              level={level + 1}
                                            />
                                          ))}
                                        </TableCell>
                                      );
                                    }
                                    return cellChild.name; // Retorna null se não for TableCell
                                  })}
                                </TableRow>
                              );
                            default:
                              return bodyChild.name; // Lida com outros casos, se necessário
                          }
                        })}
                      </TableBody>
                    );
                  case "TableFooter":
                    return (
                      <TableFooter key={child.id}>
                        {child.children && child.children.map((footerChild) => (
                          <PreviewComponent
                            key={footerChild.id}
                            item={footerChild}
                            selectedItemId={selectedItemId}
                            onSelect={onSelect}
                            onMove={onMove}
                            onRemove={onRemove}
                            onUpdate={onUpdate}
                            addComponent={addComponent}
                            level={level + 1}
                          />
                        ))}
                      </TableFooter>
                    );
                  case "TableHead":
                    return (
                      <TableHead key={child.id}>
                        {child.children && child.children.map((headChild) => (
                          <PreviewComponent
                            key={headChild.id}
                            item={headChild}
                            selectedItemId={selectedItemId}
                            onSelect={onSelect}
                            onMove={onMove}
                            onRemove={onRemove}
                            onUpdate={onUpdate}
                            addComponent={addComponent}
                            level={level + 1}
                          />
                        ))}
                      </TableHead>
                    );
                  case "TableCaption":
                    return (
                      <TableCaption key={child.id} {...child.props}>
                        {child.children && child.children.map((captionChild) => (
                          <PreviewComponent
                            key={captionChild.id}
                            item={captionChild}
                            selectedItemId={selectedItemId}
                            onSelect={onSelect}
                            onMove={onMove}
                            onRemove={onRemove}
                            onUpdate={onUpdate}
                            addComponent={addComponent}
                            level={level + 1}
                          />
                        ))}
                      </TableCaption>
                    );
                  default:
                    return null; // ou lidar com outros casos, se necessário
                }
              })}
          </Table>
        );

      
      case "Collapsible":
        return (
          <Collapsible {...commonProps}>
            {item.children &&
              item.children.map((child) => {
                switch (child.name) {
                  case "CollapsibleTrigger":
                    return (
                      <CollapsibleTrigger key={child.id} {...child.props}>
                        {child.children && child.children.map((triggerChild) => (
                          <PreviewComponent
                            key={triggerChild.id}
                            item={triggerChild}
                            selectedItemId={selectedItemId}
                            onSelect={onSelect}
                            onMove={onMove}
                            onRemove={onRemove}
                            onUpdate={onUpdate}
                            addComponent={addComponent}
                            level={level + 1}
                          />
                        ))}
                      </CollapsibleTrigger>
                    );
                  case "CollapsibleContent":
                    return (
                      <CollapsibleContent key={child.id} {...child.props}>
                        {child.children && child.children.map((contentChild) => (
                          <PreviewComponent
                            key={contentChild.id}
                            item={contentChild}
                            selectedItemId={selectedItemId}
                            onSelect={onSelect}
                            onMove={onMove}
                            onRemove={onRemove}
                            onUpdate={onUpdate}
                            addComponent={addComponent}
                            level={level + 1}
                          />
                        ))}
                      </CollapsibleContent>
                    );
                  default:
                    return null; // ou lidar com outros casos, se necessário
                }
              })}
          </Collapsible>
        );
        
      case "radio-group":
      case "RadioGroup":
        return (
          <RadioGroup {...commonProps}>
            {item.children &&
              item.children.map((child) => {
                switch (child.name) {
                  case "RadioGroupItem":
                    return (
                      <RadioGroupItem key={child.id} value={child.props?.value} {...child.props}>
                        {child.children && child.children.map((itemChild) => (
                          <PreviewComponent
                            key={itemChild.id}
                            item={itemChild}
                            selectedItemId={selectedItemId}
                            onSelect={onSelect}
                            onMove={onMove}
                            onRemove={onRemove}
                            onUpdate={onUpdate}
                            addComponent={addComponent}
                            level={level + 1}
                          />
                        ))}
                      </RadioGroupItem>
                    );
                  // Adicione outros casos para filhos específicos, se necessário
                  default:
                    return (
                      <PreviewComponent
                        key={child.id}
                        item={child}
                        selectedItemId={selectedItemId}
                        onSelect={onSelect}
                        onMove={onMove}
                        onRemove={onRemove}
                        onUpdate={onUpdate}
                        addComponent={addComponent}
                        level={level + 1}
                      />
                    );
                }
              })}
          </RadioGroup>
        );

      case "table":
        return (
          <table {...commonProps}>
            {item.children &&
              item.children.map((child) => {
                switch (child.name) {
                  case "thead":
                    return (
                      <thead key={child.id}>
                        {child.children &&
                          child.children.map((theadChild) => {
                            switch (theadChild.name) {
                              case "tr":
                                return (
                                  <tr key={theadChild.id}>
                                    {theadChild.children &&
                                      theadChild.children.map((tdChild) => {
                                        switch (tdChild.name) {
                                          case "th":
                                            return (
                                              <th key={tdChild.id} {...tdChild.props}>
                                                {tdChild.children && tdChild.children.map(child => (
                                                  <PreviewComponent
                                                    key={child.id}
                                                    item={child}
                                                    selectedItemId={selectedItemId}
                                                    onSelect={onSelect}
                                                    onMove={onMove}
                                                    onRemove={onRemove}
                                                    onUpdate={onUpdate}
                                                    addComponent={addComponent}
                                                    level={level + 1}
                                                  />
                                                ))}
                                              </th>
                                            );
                                          default:
                                            return null; // ou você pode lidar com outros casos, se necessário
                                        }
                                      })}
                                  </tr>
                                );
                              default:
                                return null; // ou lidar com outros casos
                            }
                          })}
                      </thead>
                    );
                  case "tbody":
                    return (
                      <tbody key={child.id}>
                        {child.children &&
                          child.children.map((tbodyChild) => {
                            switch (tbodyChild.name) {
                              case "tr":
                                return (
                                  <tr key={tbodyChild.id}>
                                    {tbodyChild.children &&
                                      tbodyChild.children.map((tdChild) => {
                                        switch (tdChild.name) {
                                          case "td":
                                            return (
                                              <td key={tdChild.id} {...tdChild.props}>
                                                {tdChild.children && tdChild.children.map(child => (
                                                  <PreviewComponent
                                                    key={child.id}
                                                    item={child}
                                                    selectedItemId={selectedItemId}
                                                    onSelect={onSelect}
                                                    onMove={onMove}
                                                    onRemove={onRemove}
                                                    onUpdate={onUpdate}
                                                    addComponent={addComponent}
                                                    level={level + 1}
                                                  />
                                                ))}
                                              </td>
                                            );
                                          default:
                                            return null; // ou lidar com outros casos
                                        }
                                      })}
                                  </tr>
                                );
                              default:
                                return null; // ou lidar com outros casos
                            }
                          })}
                      </tbody>
                    );
                  default:
                    return null; // ou lidar com outros casos
                }
              })}
          </table>
        );
        
      case "Pagination":
        return <Pagination {...commonProps} ref={ref} />;

      case "Sheet":
        return (
          <Sheet {...commonProps}>
            {item.children &&
              item.children.map((child) => {
                switch (child.name) {
                  case "SheetPortal":
                    return (
                      <SheetPortal key={child.id}>
                        {child.children && child.children.map((portalChild) => {
                          switch (portalChild.name) {
                            case "SheetOverlay":
                              return (
                                <SheetOverlay key={portalChild.id} {...portalChild.props}>
                                  {portalChild.children && portalChild.children.map((overlayChild) => (
                                    <PreviewComponent
                                      key={overlayChild.id}
                                      item={overlayChild}
                                      selectedItemId={selectedItemId}
                                      onSelect={onSelect}
                                      onMove={onMove}
                                      onRemove={onRemove}
                                      onUpdate={onUpdate}
                                      addComponent={addComponent}
                                      level={level + 1}
                                    />
                                  ))}
                                </SheetOverlay>
                              );
                            case "SheetContent":
                              return (
                                <SheetContent key={portalChild.id} {...portalChild.props}>
                                  {portalChild.children && portalChild.children.map((contentChild) => {
                                    switch (contentChild.name) {
                                      case "SheetHeader":
                                        return (
                                          <SheetHeader key={contentChild.id}>
                                            {contentChild.children && contentChild.children.map((headerChild) => (
                                              <PreviewComponent
                                                key={headerChild.id}
                                                item={headerChild}
                                                selectedItemId={selectedItemId}
                                                onSelect={onSelect}
                                                onMove={onMove}
                                                onRemove={onRemove}
                                                onUpdate={onUpdate}
                                                addComponent={addComponent}
                                                level={level + 1}
                                              />
                                            ))}
                                          </SheetHeader>
                                        );
                                      case "SheetFooter":
                                        return (
                                          <SheetFooter key={contentChild.id}>
                                            {contentChild.children && contentChild.children.map((footerChild) => (
                                              <PreviewComponent
                                                key={footerChild.id}
                                                item={footerChild}
                                                selectedItemId={selectedItemId}
                                                onSelect={onSelect}
                                                onMove={onMove}
                                                onRemove={onRemove}
                                                onUpdate={onUpdate}
                                                addComponent={addComponent}
                                                level={level + 1}
                                              />
                                            ))}
                                          </SheetFooter>
                                        );
                                      case "SheetClose":
                                        return (
                                          <SheetClose key={contentChild.id} {...contentChild.props} />
                                        );
                                      case "SheetTitle":
                                        return (
                                          <SheetTitle key={contentChild.id} {...contentChild.props}>
                                            {contentChild.children && contentChild.children.map((titleChild) => (
                                              <PreviewComponent
                                                key={titleChild.id}
                                                item={titleChild}
                                                selectedItemId={selectedItemId}
                                                onSelect={onSelect}
                                                onMove={onMove}
                                                onRemove={onRemove}
                                                onUpdate={onUpdate}
                                                addComponent={addComponent}
                                                level={level + 1}
                                              />
                                            ))}
                                          </SheetTitle>
                                        );
                                      case "SheetDescription":
                                        return (
                                          <SheetDescription key={contentChild.id} {...contentChild.props}>
                                            {contentChild.children && contentChild.children.map((descriptionChild) => (
                                              <PreviewComponent
                                                key={descriptionChild.id}
                                                item={descriptionChild}
                                                selectedItemId={selectedItemId}
                                                onSelect={onSelect}
                                                onMove={onMove}
                                                onRemove={onRemove}
                                                onUpdate={onUpdate}
                                                addComponent={addComponent}
                                                level={level + 1}
                                              />
                                            ))}
                                          </SheetDescription>
                                        );
                                      default:
                                        return contentChild.name;
                                    }
                                  })}
                                </SheetContent>
                              );
                            default:
                              return portalChild.name;
                          }
                        })}
                      </SheetPortal>
                    );
                  case "SheetTrigger":
                    return (
                      <SheetTrigger key={child.id} {...child.props}>
                        {child.children && child.children.map((triggerChild) => (
                          <PreviewComponent
                            key={triggerChild.id}
                            item={triggerChild}
                            selectedItemId={selectedItemId}
                            onSelect={onSelect}
                            onMove={onMove}
                            onRemove={onRemove}
                            onUpdate={onUpdate}
                            addComponent={addComponent}
                            level={level + 1}
                          />
                        ))}
                      </SheetTrigger>
                    );
                  case "SheetContent":
                    return (
                      <SheetContent key={child.id} {...child.props}>
                        {child.children && child.children.map((contentChild) => {
                          switch (contentChild.name) {
                            case "SheetHeader":
                              return (
                                <SheetHeader key={contentChild.id}>
                                  {contentChild.children && contentChild.children.map((headerChild) => (
                                    <PreviewComponent
                                      key={headerChild.id}
                                      item={headerChild}
                                      selectedItemId={selectedItemId}
                                      onSelect={onSelect}
                                      onMove={onMove}
                                      onRemove={onRemove}
                                      onUpdate={onUpdate}
                                      addComponent={addComponent}
                                      level={level + 1}
                                    />
                                  ))}
                                </SheetHeader>
                              );
                            case "SheetFooter":
                              return (
                                <SheetFooter key={contentChild.id}>
                                  {contentChild.children && contentChild.children.map((footerChild) => (
                                    <PreviewComponent
                                      key={footerChild.id}
                                      item={footerChild}
                                      selectedItemId={selectedItemId}
                                      onSelect={onSelect}
                                      onMove={onMove}
                                      onRemove={onRemove}
                                      onUpdate={onUpdate}
                                      addComponent={addComponent}
                                      level={level + 1}
                                    />
                                  ))}
                                </SheetFooter>
                              );
                            case "SheetClose":
                              return (
                                <SheetClose key={contentChild.id} {...contentChild.props} />
                              );
                            case "SheetTitle":
                              return (
                                <SheetTitle key={contentChild.id} {...contentChild.props}>
                                  {contentChild.children && contentChild.children.map((titleChild) => (
                                    <PreviewComponent
                                      key={titleChild.id}
                                      item={titleChild}
                                      selectedItemId={selectedItemId}
                                      onSelect={onSelect}
                                      onMove={onMove}
                                      onRemove={onRemove}
                                      onUpdate={onUpdate}
                                      addComponent={addComponent}
                                      level={level + 1}
                                    />
                                  ))}
                                </SheetTitle>
                              );
                            case "SheetDescription":
                              return (
                                <SheetDescription key={contentChild.id} {...contentChild.props}>
                                  {contentChild.children && contentChild.children.map((descriptionChild) => (
                                    <PreviewComponent
                                      key={descriptionChild.id}
                                      item={descriptionChild}
                                      selectedItemId={selectedItemId}
                                      onSelect={onSelect}
                                      onMove={onMove}
                                      onRemove={onRemove}
                                      onUpdate={onUpdate}
                                      addComponent={addComponent}
                                      level={level + 1}
                                    />
                                  ))}
                                </SheetDescription>
                              );
                            default:
                              return contentChild.name;
                          }
                        })}
                      </SheetContent>
                    );
                  default:
                    return child.name;
                }
              })}
          </Sheet>
        );
        
        case "br":
          return <br {...commonProps} ref={ref} />;

        case "hr":
          return <hr {...commonProps} ref={ref} />;

        case "Progress":
          return <Progress {...commonProps} ref={ref} />;

        case "checkbox":
        case "Checkbox":
          return <Checkbox {...commonProps} ref={ref} />;

        case "Badge":
          return (
            <Badge {...commonProps} ref={ref}>
              {item.props?.content}
              {item.children &&
                item.children.map((child) => (
                  <PreviewComponent
                    key={child.id}
                    item={child}
                    selectedItemId={selectedItemId}
                    onSelect={onSelect}
                    onMove={onMove}
                    onRemove={onRemove}
                    onUpdate={onUpdate}
                    addComponent={addComponent}
                    level={level + 1}
                  />
                ))}
            </Badge>
          );

        case "Menubar":
          return (
            <Menubar {...commonProps}>
              {item.children &&
                item.children.map((child) => {
                  switch (child.name) {
                    case "MenubarMenu":
                      return (
                        <MenubarMenu key={child.id} {...child.props}>
                          {child.children && child.children.map((menuChild) => {
                            switch (menuChild.name) {
                              case "MenubarTrigger":
                                return (
                                  <MenubarTrigger key={menuChild.id} {...menuChild.props}>
                                    {menuChild.children && menuChild.children.map((triggerChild) => (
                                      <PreviewComponent
                                        key={triggerChild.id}
                                        item={triggerChild}
                                        selectedItemId={selectedItemId}
                                        onSelect={onSelect}
                                        onMove={onMove}
                                        onRemove={onRemove}
                                        onUpdate={onUpdate}
                                        addComponent={addComponent}
                                        level={level + 1}
                                      />
                                    ))}
                                  </MenubarTrigger>
                                );
                              case "MenubarContent":
                                return (
                                  <MenubarContent key={menuChild.id} {...menuChild.props}>
                                    {menuChild.children && menuChild.children.map((contentChild) => {
                                      switch (contentChild.name) {
                                        case "MenubarItem":
                                          return (
                                            <MenubarItem key={contentChild.id} {...contentChild.props}>
                                              {contentChild.children && contentChild.children.map((itemChild) => (
                                                <PreviewComponent
                                                  key={itemChild.id}
                                                  item={itemChild}
                                                  selectedItemId={selectedItemId}
                                                  onSelect={onSelect}
                                                  onMove={onMove}
                                                  onRemove={onRemove}
                                                  onUpdate={onUpdate}
                                                  addComponent={addComponent}
                                                  level={level + 1}
                                                />
                                              ))}
                                            </MenubarItem>
                                          );
                                        case "MenubarSeparator":
                                          return (
                                            <MenubarSeparator key={contentChild.id} {...contentChild.props} />
                                          );
                                        case "MenubarCheckboxItem":
                                          return (
                                            <MenubarCheckboxItem key={contentChild.id} {...contentChild.props} />
                                          );
                                        default:
                                          return contentChild.name;
                                      }
                                    })}
                                  </MenubarContent>
                                );
                              default:
                                return menuChild.name;
                            }
                          })}
                        </MenubarMenu>
                      );
                    default:
                      return child.name;
                  }
                })}
            </Menubar>
          );

        case "DropdownMenu":
          return (
            <DropdownMenu {...commonProps}>
              {item.children &&
                item.children.map((child) => {
                  switch (child.name) {
                    case "DropdownMenuTrigger":
                      return (
                        <DropdownMenuTrigger key={child.id} {...child.props}>
                          {child.children && child.children.map((triggerChild) => (
                            <PreviewComponent
                              key={triggerChild.id}
                              item={triggerChild}
                              selectedItemId={selectedItemId}
                              onSelect={onSelect}
                              onMove={onMove}
                              onRemove={onRemove}
                              onUpdate={onUpdate}
                              addComponent={addComponent}
                              level={level + 1}
                            />
                          ))}
                        </DropdownMenuTrigger>
                      );
                    case "DropdownMenuContent":
                      return (
                        <DropdownMenuContent key={child.id} {...child.props}>
                          {child.children && child.children.map((contentChild) => {
                            switch (contentChild.name) {
                              case "DropdownMenuItem":
                                return (
                                  <DropdownMenuItem key={contentChild.id} {...contentChild.props}>
                                    {contentChild.children && contentChild.children.map((itemChild) => (
                                      <PreviewComponent
                                        key={itemChild.id}
                                        item={itemChild}
                                        selectedItemId={selectedItemId}
                                        onSelect={onSelect}
                                        onMove={onMove}
                                        onRemove={onRemove}
                                        onUpdate={onUpdate}
                                        addComponent={addComponent}
                                        level={level + 1}
                                      />
                                    ))}
                                  </DropdownMenuItem>
                                );
                              case "DropdownMenuLabel":
                                return (
                                  <DropdownMenuLabel key={contentChild.id} {...contentChild.props} />
                                );
                              case "DropdownMenuSeparator":
                                return (
                                  <DropdownMenuSeparator key={contentChild.id} {...contentChild.props} />
                                );
                              default:
                                return contentChild.name;
                            }
                          })}
                        </DropdownMenuContent>
                      );
                    default:
                      return child.name;
                  }
                })}
            </DropdownMenu>
          );
          
        case "Popover":
          return (
            <Popover>
              {item.children &&
                item.children.map((child) => {
                  switch (child.name) {
                    case "PopoverTrigger":
                      return (
                        <PopoverTrigger  key={child.id} {...child.props} >
                          {child.children && child.children.map((triggerChild) => (
                            <PreviewComponent
                              key={triggerChild.id}
                              item={triggerChild}
                              selectedItemId={selectedItemId}
                              onSelect={onSelect}
                              onMove={onMove}
                              onRemove={onRemove}
                              onUpdate={onUpdate}
                              addComponent={addComponent}
                              level={level + 1}
                            />
                          ))}
                        </PopoverTrigger>
                      );
                    case "PopoverContent":
                      return (
                        <PopoverContent key={child.id} {...child.props}>
                          {child.children && child.children.map((contentChild) => (
                            <PreviewComponent
                              key={contentChild.id}
                              item={contentChild}
                              selectedItemId={selectedItemId}
                              onSelect={onSelect}
                              onMove={onMove}
                              onRemove={onRemove}
                              onUpdate={onUpdate}
                              addComponent={addComponent}
                              level={level + 1}
                            />
                          ))}
                        </PopoverContent>
                      );
                    default:
                      return child.name;
                  }
                })}
            </Popover>
          );

        case "Carousel":
          return (
            <Carousel {...item.props}>
              {item.children &&
                item.children.map((child) => {
                  switch (child.name) {
                    case "CarouselContent":
                      return (
                        <CarouselContent key={child.id} {...child.props}>
                          {child.children &&
                            child.children.map((contentChild) => {
                              switch (contentChild.name) {
                                case "CarouselItem":
                                  return (
                                    <CarouselItem key={contentChild.id} {...contentChild.props}>
                                      {contentChild.children && contentChild.children.map((itemChild) => (
                                        <PreviewComponent
                                          key={itemChild.id}
                                          item={itemChild}
                                          selectedItemId={selectedItemId}
                                          onSelect={onSelect}
                                          onMove={onMove}
                                          onRemove={onRemove}
                                          onUpdate={onUpdate}
                                          addComponent={addComponent}
                                          level={level + 1}
                                        />
                                      ))}
                                    </CarouselItem>
                                  );
                                default:
                                  return contentChild.name;
                              }
                            })}
                        </CarouselContent>
                      );
                    default:
                      return null;
                  }
                })}
            </Carousel>
          );


        case "InstagramIcon":
          return <InstagramIcon {...commonProps} ref={ref} />;
        case "FacebookIcon":
          return <FacebookIcon {...commonProps} ref={ref} />;
        case "MountainIcon":
          return <MountainIcon {...commonProps} ref={ref} />;
        case "StepBackIcon":
          return <StepBackIcon {...commonProps} ref={ref} />;
        case "ThermometerIcon":
          return <ThermometerIcon {...commonProps} ref={ref} />;
        case "WifiIcon":
          return <WifiIcon {...commonProps} ref={ref} />;
        case "SmartphoneIcon":
          return <SmartphoneIcon {...commonProps} ref={ref} />;
        case "BedIcon":
          return <BedIcon {...commonProps} ref={ref} />;
        case "BatteryIcon":
          return <BatteryIcon {...commonProps} ref={ref} />;
        case "BluetoothIcon":
          return <BluetoothIcon {...commonProps} ref={ref} />;
        case "SpeakerIcon":
          return <SpeakerIcon {...commonProps} ref={ref} />;
        case "StarIcon":
          return <StarIcon {...commonProps} ref={ref} />;
        case "SlackIcon":
          return <SlackIcon {...commonProps} ref={ref} />;
        case "HashIcon":
          return <HashIcon {...commonProps} ref={ref} />;
        case "BookIcon":
          return <BookIcon {...commonProps} ref={ref} />;
        case "DatabaseIcon":
          return <DatabaseIcon {...commonProps} ref={ref} />;
        case "CalendarIcon":
          return <CalendarIcon {...commonProps} ref={ref} />;
        case "NotebookIcon":
          return <NotebookIcon {...commonProps} ref={ref} />;
        case "MapPinIcon":
          return <MapPinIcon {...commonProps} ref={ref} />;
        case "BrushIcon":
          return <BrushIcon {...commonProps} ref={ref} />;
        case "CodeIcon":
          return <CodeIcon {...commonProps} ref={ref} />;
        case "TextIcon":
          return <TextIcon {...commonProps} ref={ref} />;
        case "AppleIcon":
          return <AppleIcon {...commonProps} ref={ref} />;
        case "ChromeIcon":
          return <ChromeIcon {...commonProps} ref={ref} />;
        case "XIcon":
          return <XIcon {...commonProps} ref={ref} />;
        case "Tally1Icon":
          return <Tally1Icon {...commonProps} ref={ref} />;
        case "ClipboardIcon":
          return <ClipboardIcon {...commonProps} ref={ref} />;
        case "VoteIcon":
          return <VoteIcon {...commonProps} ref={ref} />;
        case "ChevronDownIcon":
          return <ChevronDownIcon {...commonProps} ref={ref} />;
        case "TriangleIcon":
          return <TriangleIcon {...commonProps} ref={ref} />;
        case "BotIcon":
          return <BotIcon {...commonProps} ref={ref} />;
        case "SandwichIcon":
          return <SandwichIcon {...commonProps} ref={ref} />;
        case "ShuffleIcon":
          return <ShuffleIcon {...commonProps} ref={ref} />;
        case "KeyIcon":
          return <KeyIcon {...commonProps} ref={ref} />;
        case "CoinsIcon":
          return <CoinsIcon {...commonProps} ref={ref} />;
        case "BlocksIcon":
          return <BlocksIcon {...commonProps} ref={ref} />;
        case "FuelIcon":
          return <FuelIcon {...commonProps} ref={ref} />;
        case "MoveUpIcon":
          return <MoveUpIcon {...commonProps} ref={ref} />;
        case "ClockIcon":
          return <ClockIcon {...commonProps} ref={ref} />;
        case "ArrowUpRightIcon":
          return <ArrowUpRightIcon {...commonProps} ref={ref} />;
        case "MoveHorizontalIcon":
          return <MoveHorizontalIcon {...commonProps} ref={ref} />;
        case "MoveVerticalIcon":
          return <MoveVerticalIcon {...commonProps} ref={ref} />;
        case "PhoneIcon":
          return <PhoneIcon {...commonProps} ref={ref} />;
        case "VideoIcon":
          return <VideoIcon {...commonProps} ref={ref} />;
        case "PaperclipIcon":
          return <PaperclipIcon {...commonProps} ref={ref} />;
        case "AirplayIcon":
          return <AirplayIcon {...commonProps} ref={ref} />;
        case "ScanIcon":
          return <ScanIcon {...commonProps} ref={ref} />;
        case "PauseIcon":
          return <PauseIcon {...commonProps} ref={ref} />;
        case "FileTypeIcon":
          return <FileTypeIcon {...commonProps} ref={ref} />;
        case "LightbulbIcon":
          return <LightbulbIcon {...commonProps} ref={ref} />;
        case "SunDimIcon":
          return <SunDimIcon {...commonProps} ref={ref} />;
        case "ForwardIcon":
          return <ForwardIcon {...commonProps} ref={ref} />;
        case "FileIcon":
          return <FileIcon {...commonProps} ref={ref} />;
        case "Trash2Icon":
          return <Trash2Icon {...commonProps} ref={ref} />;
        case "ArrowDownIcon":
          return <ArrowDownIcon {...commonProps} ref={ref} />;
        case "ArrowUpIcon":
          return <ArrowUpIcon {...commonProps} ref={ref} />;
      case "Package2Icon":
        return <Package2Icon {...commonProps} ref={ref} />;
      case "CreditCardIcon":
        return <CreditCardIcon {...commonProps} ref={ref} />;
      case "TagIcon":
        return <TagIcon {...commonProps} ref={ref} />;
      case "DollarSignIcon":
        return <DollarSignIcon {...commonProps} ref={ref} />;
      case "MicVocalIcon":
        return <MicVocalIcon {...commonProps} ref={ref} />;
      case "InfoIcon":
        return <InfoIcon {...commonProps} ref={ref} />;
      case "DoorClosedIcon":
        return <DoorClosedIcon {...commonProps} ref={ref} />;
      case "FlaskConicalIcon":
        return <FlaskConicalIcon {...commonProps} ref={ref} />;
      case "NewspaperIcon":
        return <NewspaperIcon {...commonProps} ref={ref} />;
      case "FilterIcon":
        return <FilterIcon {...commonProps} ref={ref} />;
      case "UserIcon":
        return <UserIcon {...commonProps} ref={ref} />;
      case "MailIcon":
        return <MailIcon {...commonProps} ref={ref} />;
      case "CircleCheckIcon":
        return <CircleCheckIcon {...commonProps} ref={ref} />;
      case "BellIcon":
        return <BellIcon {...commonProps} ref={ref} />;
      case "GaugeIcon":
        return <GaugeIcon {...commonProps} ref={ref} />;
      case "ComputerIcon":
        return <ComputerIcon {...commonProps} ref={ref} />;
      case "ComponentIcon":
        return <ComponentIcon {...commonProps} ref={ref} />;
      case "BarChartIcon":
        return <BarChartIcon {...commonProps} ref={ref} />;
      case "CreativeCommonsIcon":
        return <CreativeCommonsIcon {...commonProps} ref={ref} />;
      case "FileTextIcon":
        return <FileTextIcon {...commonProps} ref={ref} />;
      case "MegaphoneIcon":
        return <MegaphoneIcon {...commonProps} ref={ref} />;
      case "LayoutDashboardIcon":
        return <LayoutDashboardIcon {...commonProps} ref={ref} />;
      case "LinkIcon":
        return <LinkIcon {...commonProps} ref={ref} />;
      case "ImageIcon":
        return <ImageIcon {...commonProps} ref={ref} />;
      case "ListIcon":
        return <ListIcon {...commonProps} ref={ref} />;
      case "AlignCenterIcon":
        return <AlignCenterIcon {...commonProps} ref={ref} />;
      case "BoldIcon":
        return <BoldIcon {...commonProps} ref={ref} />;
      case "ItalicIcon":
        return <ItalicIcon {...commonProps} ref={ref} />;
      case "UnderlineIcon":
        return <UnderlineIcon {...commonProps} ref={ref} />;
      case "AlignLeftIcon":
        return <AlignLeftIcon {...commonProps} ref={ref} />;
      case "AlignRightIcon":
        return <AlignRightIcon {...commonProps} ref={ref} />;
      case "SmileIcon":
        return <SmileIcon {...commonProps} ref={ref} />;
      case "CookieIcon":
        return <CookieIcon {...commonProps} ref={ref} />;
      case "RepeatIcon":
        return <RepeatIcon {...commonProps} ref={ref} />;
      case "TwitterIcon":
        return <TwitterIcon {...commonProps} ref={ref} />;
      case "MergeIcon":
        return <MergeIcon {...commonProps} ref={ref} />;
      case "LockIcon":
        return <LockIcon {...commonProps} ref={ref} />;
      case "SettingsIcon":
        return <SettingsIcon {...commonProps} ref={ref} />;
      case "CombineIcon":
        return <CombineIcon {...commonProps} ref={ref} />;
      case "BackpackIcon":
        return <BackpackIcon {...commonProps} ref={ref} />;
      case "BackpackIcon":
        return <BackpackIcon {...commonProps} ref={ref} />;
      case "ListTodoIcon":
        return <ListTodoIcon {...commonProps} ref={ref} />;
      case "ActivityIcon":
        return <ActivityIcon {...commonProps} ref={ref} />;
      case "KanbanIcon":
        return <KanbanIcon {...commonProps} ref={ref} />;
      case "ReplyIcon":
        return <ReplyIcon {...commonProps} ref={ref} />;
      case "BookmarkIcon":
        return <BookmarkIcon {...commonProps} ref={ref} />;
      case "CameraIcon":
        return <CameraIcon {...commonProps} ref={ref} />;
      case "SendIcon":
        return <SendIcon {...commonProps} ref={ref} />;
      case "SearchIcon":
        return <SearchIcon {...commonProps} ref={ref} />;
      case "HeartIcon":
        return <HeartIcon {...commonProps} ref={ref} />;
      case "StickyNoteIcon":
        return <StickyNoteIcon {...commonProps} ref={ref} />;
      case "FolderIcon":
        return <FolderIcon {...commonProps} ref={ref} />;
      case "ChevronLeftIcon":
        return <ChevronLeftIcon {...commonProps} ref={ref} />;
      case "ChevronRightIcon":
        return <ChevronRightIcon {...commonProps} ref={ref} />;
      case "MessageCircleIcon":
        return <MessageCircleIcon {...commonProps} ref={ref} />;
      case "LayersIcon":
        return <LayersIcon {...commonProps} ref={ref} />;
      case "InboxIcon":
        return <InboxIcon {...commonProps} ref={ref} />;
      case "ShareIcon":
        return <ShareIcon {...commonProps} ref={ref} />;
      case "TrashIcon":
        return <TrashIcon {...commonProps} ref={ref} />;
      case "DownloadIcon":
        return <DownloadIcon {...commonProps} ref={ref} />;
      case "TicketIcon":
        return <TicketIcon {...commonProps} ref={ref} />;
      case "HomeIcon":
        return <HomeIcon {...commonProps} ref={ref} />;
      case "WalletIcon":
        return <WalletIcon {...commonProps} ref={ref} />;
      case "UsersIcon":
        return <UsersIcon {...commonProps} ref={ref} />;
      case "ArrowLeftIcon":
        return <ArrowLeftIcon {...commonProps} ref={ref} />;
      case "ArrowRightIcon":
        return <ArrowRightIcon {...commonProps} ref={ref} />;
      case "PlayIcon":
        return <PlayIcon {...commonProps} ref={ref} />;
      case "ExpandIcon":
        return <ExpandIcon {...commonProps} ref={ref} />;
      case "ConstructionIcon":
        return <ConstructionIcon {...commonProps} ref={ref} />;
      case "MenuIcon":
        return <MenuIcon {...commonProps} ref={ref} />;
      case "ExpandIcon":
        return <CheckIcon {...commonProps} ref={ref} />;
      case "CheckIcon":
        return <CheckIcon {...commonProps} ref={ref} />;
      case "SmileIcon":
        return <SmileIcon {...commonProps} ref={ref} />;
      case "SmileIcon":
        return <SmileIcon {...commonProps} ref={ref} />;
      case "PencilIcon":
        return <PencilIcon {...commonProps} ref={ref} />;
      case "PlusIcon":
        return <PlusIcon {...commonProps} ref={ref} />;
      case "MinusIcon":
        return <MinusIcon {...commonProps} ref={ref} />;
      case "SquareDivideIcon":
        return <SquareDivideIcon {...commonProps} ref={ref} />;
      case "DivideIcon":
        return <DivideIcon {...commonProps} ref={ref} />;

      case "switch":
      case "Switch":
        return <Switch {...commonProps} ref={ref} />;

      case "Avatar":
        return (
          <Avatar {...commonProps} ref={ref}>
            <AvatarImage src={item.props?.src} alt="@tqx" />
            <AvatarFallback>TQX</AvatarFallback>
          </Avatar>
        );

      case "img":
      case "Image":
      case "image":
        const width = item.props?.width ?? 10
        const height = item.props?.height ?? 10

        return <Image {...commonProps} width={width} height={height} ref={ref} />;

      case "Slider":
      case "slider":
        return (
          <Slider
            // {...commonProps}
            ref={ref}
            defaultValue={[50]}
            max={100}
            step={1}
          />
        );

      default:
        return (
          <div {...commonProps} ref={ref}>
            {item.props?.content || item.type}
          </div>
        );
    }
  };

  const containsColSpan = item.props?.className?.includes('col-span-2') ? 'col-span-2' : '';

  return (
    <motion.div
      className={`relative group mml-${level * 1} ${containsColSpan}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.2 }}
    >
      <div className="w-full h-full" draggable="true">
        <div className="">
          {renderComponent()}
        </div>
      </div>
      <AnimatePresence>
        {isHovered && (
          <motion.div
            className="absolute -top-7 left-[calc(50%-40px)] flex space-x-1 p-1 bg-orange-200 rounded-md"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            transition={{ duration: 0.1 }}
          >
            <Button
              variant="ghost"
              size="icon"
              className="w-6 h-6"
              onClick={(e) => {
                e.stopPropagation();
                addComponent(
                  { type: "div", props: { content: "New Component" } },
                  item.id
                );
              }}
            >
              <Plus className="w-4 h-4" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="w-6 h-6"
              onClick={(e) => {
                e.stopPropagation();
                onRemove(item.id);
              }}
            >
              <Trash2 className="w-4 h-4" />
            </Button>
            <div className="cursor-move" ref={drag}>
              <Button
                variant="ghost"
                size="icon"
                className="w-6 h-6"
              >
                <Move className="w-4 h-4" />
              </Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      {/* {selectedItemId === item.id && (
        <div className="mt-2 space-y-2">
          <Label>Content</Label>
          <Input value={item.props?.content} onChange={handleContentChange} />
          <Label>Classes</Label>
          <Input value={item.props?.className || ''} onChange={handleClassChange} />
        </div>
      )} */}
    </motion.div>
  );
};

const MainEditor: React.FC<MainEditorProps> = ({
  tree,
  selectedItemId,
  onSelect,
  onMove,
  onRemove,
  onUpdate,
  previewMode,
  generatedCode,
  rawCode,
  handleRawCodeChange,
  rawCodeTsx,
  handleRawCodeTsxChange,
  handleRawCodeTsxClear,
  applyRawCode,
  tsxToJson,
  addComponent,
}) => {
  const [, drop] = useDrop({
    accept: ["COMPONENT", "NEW_COMPONENT"],
    drop: (item: { id?: string; type: string }, monitor) => {
      if (!monitor.didDrop()) {
        if (item.id) {
          onMove(item.id, "root", "inside");
        } else {
          addComponent({ type: item.type, props: { content: `New ${item.type}` } });
        }
      }
    },
  });

  return (
    <main className="flex-1 p-4 bg-gray-100/10 overflow-y-auto" ref={drop}>
      <Tabs defaultValue="preview">
        <TabsList>
          <TabsTrigger value="preview">Preview</TabsTrigger>
          <TabsTrigger value="code">Generated Code</TabsTrigger>
          <TabsTrigger value="raw">Raw Code</TabsTrigger>
          <TabsTrigger value="rawTsx">Raw TSX</TabsTrigger>
        </TabsList>
        <ScrollArea className="h-[calc(100vh-12rem)]">
        <TabsContent value="preview">
          <div
            className={`w-full mx-auto bg-white min-h-[240px] rounded-lg shadow-md p-0.5 transition-all duration-300 ease-in-out ${
              previewMode === "desktop"
                ? "max-w-full"
                : previewMode === "tablet"
                ? "max-w-2xl"
                : "max-w-sm"
            }`}
          >
            <AnimatePresence>
              {tree.map((item) => (
                <PreviewComponent
                  key={item.id}
                  item={item}
                  selectedItemId={selectedItemId}
                  onSelect={onSelect}
                  onMove={onMove}
                  onRemove={onRemove}
                  onUpdate={onUpdate}
                  addComponent={addComponent}
                  level={0}
                />
              ))}
            </AnimatePresence>
          </div>
        </TabsContent>
        <TabsContent value="code">
          <pre className="p-4 bg-gray-800 text-white rounded-lg overflow-x-auto">
            <code>{generatedCode}</code>
          </pre>
        </TabsContent>
        <TabsContent value="raw">
          <div className="space-y-4">
            <Textarea
              value={rawCode}
              onChange={handleRawCodeChange}
              placeholder="Paste your raw JSON code here..."
              className="h-64"
            />
            <Button onClick={applyRawCode}>Apply Raw Code</Button>
          </div>
        </TabsContent>
        <TabsContent value="rawTsx">
          <div className="space-y-4">
            <Textarea
              value={rawCodeTsx}
              onChange={handleRawCodeTsxChange}
              placeholder="Paste your raw JSON code here..."
              className="min-h-96 h-[748px]"
            />
            <div className="flex gap-2">
              <Button variant={"destructive"} onClick={handleRawCodeTsxClear}>Clear</Button>
              <Button onClick={tsxToJson}>Apply Raw Code</Button>
            </div>
          </div>
        </TabsContent>
        </ScrollArea>
      </Tabs>
    </main>
  );
};

export default MainEditor;
