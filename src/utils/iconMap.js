import {
  Home, User, Folder, FolderOpen, FlaskConical, Wrench, Briefcase, Image, Heart,
  FileText, Mail, Settings, Keyboard, Info, Lock, Sparkles, Coffee, Clapperboard,
  Gamepad2, Palette, Camera, Sunset, Lightbulb, Compass, Search, Bug, Globe,
  ChevronLeft, ChevronRight, X, Minus, Maximize2, Wifi, Sun, Moon, Copy,
  Send, RotateCcw, Grid2x2, List, Filter, ArrowUpDown, Download, ExternalLink,
  ZoomIn, ZoomOut, ChevronDown, Check, AlertCircle, CircleAlert, Clock, MapPin,
  GraduationCap, Award, Quote, Workflow, FileCode, Link2, ShieldCheck, Beaker,
  ClipboardList, Terminal, Eye, EyeOff, Plus, Loader2, ImageOff, Star, StarOff,
  Database, Code2, Users, PenTool, BookOpen,
} from "lucide-react";
// Brand marks (GitHub / LinkedIn) were dropped from lucide-react — react-icons
// carries the actual brand glyphs instead.
import { FaGithub, FaLinkedin, FaDiscord } from "react-icons/fa";

export const ICONS = {
  home: Home, user: User, folder: Folder, "folder-open": FolderOpen,
  "flask-conical": FlaskConical, wrench: Wrench, briefcase: Briefcase, image: Image,
  heart: Heart, "file-text": FileText, mail: Mail, settings: Settings,
  keyboard: Keyboard, info: Info, lock: Lock, sparkles: Sparkles, coffee: Coffee,
  clapperboard: Clapperboard, gamepad: Gamepad2, palette: Palette, camera: Camera,
  sunset: Sunset, lightbulb: Lightbulb, compass: Compass, search: Search, bug: Bug,
  globe: Globe, "chevron-left": ChevronLeft, "chevron-right": ChevronRight, x: X,
  minus: Minus, maximize: Maximize2, wifi: Wifi, sun: Sun, moon: Moon, copy: Copy,
  linkedin: FaLinkedin, github: FaGithub, discord: FaDiscord, send: Send, "rotate-ccw": RotateCcw,
  grid: Grid2x2, list: List, filter: Filter, sort: ArrowUpDown, download: Download,
  "external-link": ExternalLink, "zoom-in": ZoomIn, "zoom-out": ZoomOut,
  "chevron-down": ChevronDown, check: Check, "alert-circle": AlertCircle,
  "circle-alert": CircleAlert, clock: Clock, "map-pin": MapPin, cap: GraduationCap,
  award: Award, quote: Quote, workflow: Workflow, code: FileCode, link: Link2,
  shield: ShieldCheck, beaker: Beaker, clipboard: ClipboardList, terminal: Terminal,
  eye: Eye, "eye-off": EyeOff, plus: Plus, loader: Loader2, "image-off": ImageOff,
  star: Star, "star-off": StarOff, database: Database, code2: Code2, users: Users,
  pen: PenTool, book: BookOpen,
};

export function getIcon(name) {
  return ICONS[name] || Folder;
}
