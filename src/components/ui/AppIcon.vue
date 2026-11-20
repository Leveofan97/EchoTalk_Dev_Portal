<template>
  <component
    :is="iconComponents[name]"
    class="app-icon"
    :size="size"
    :stroke-width="strokeWidth"
    :absolute-stroke-width="absoluteStrokeWidth"
    aria-hidden="true"
    focusable="false"
  />
</template>

<script setup lang="ts">
import type { Component } from 'vue'
import {
  Activity,
  AlertTriangle,
  ArrowLeft,
  ArrowRight,
  BookOpen,
  Check,
  ChevronLeft,
  ChevronRight,
  DoorOpen,
  Folder,
  Globe,
  House,
  Inbox,
  KeyRound,
  LayoutDashboard,
  Link2,
  ListChecks,
  Mail,
  Menu,
  MessageCircle,
  Package,
  Pin,
  PlugZap,
  Plus,
  RadioTower,
  Rocket,
  ScrollText,
  Search,
  Server,
  Settings,
  ShieldCheck,
  Terminal,
  Trash2,
  Users,
  X,
} from '@lucide/vue'
import type { AppIconName } from '@/utils/appIcons'

// Статические импорты: в бандл попадают только используемые иконки Lucide.
// Публичные имена AppIcon сохраняем, чтобы не менять вызовы по всему проекту.
const iconComponents: Record<AppIconName, Component> = {
  'arrow-left': ArrowLeft,
  'arrow-right': ArrowRight,
  'chevron-right': ChevronRight,
  'chevron-left': ChevronLeft,
  rocket: Rocket,
  'alert-triangle': AlertTriangle,
  'key-round': KeyRound,
  terminal: Terminal,
  server: Server,
  'plug-zap': PlugZap,
  'list-checks': ListChecks,
  'scroll-text': ScrollText,
  'shield-check': ShieldCheck,
  'trash-2': Trash2,
  'layout-dashboard': LayoutDashboard,
  'link-2': Link2,
  'message-circle': MessageCircle,
  pin: Pin,
  mail: Mail,
  users: Users,
  'door-open': DoorOpen,
  house: House,
  folder: Folder,
  settings: Settings,
  'radio-tower': RadioTower,
  check: Check,
  package: Package,
  inbox: Inbox,
  activity: Activity,
  menu: Menu,
  x: X,
  plus: Plus,
  'chevron-right': ChevronRight,
  search: Search,
  'book-open': BookOpen,
  globe: Globe,
}

withDefaults(
  defineProps<{
    name: AppIconName
    size?: number
    strokeWidth?: number
    absoluteStrokeWidth?: boolean
  }>(),
  {
    size: 22,
    strokeWidth: 2,
    absoluteStrokeWidth: true,
  },
)
</script>

<style scoped>
.app-icon {
  display: inline-block;
  flex: 0 0 auto;
  vertical-align: middle;
}
</style>
