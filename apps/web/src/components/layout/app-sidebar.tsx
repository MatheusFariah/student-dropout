"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";

import {
  BrainCircuit,
  ChartNoAxesCombined,
  Database,
  FlaskConical,
  LayoutDashboard,
  ScanSearch,
} from "lucide-react";

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";

const navigationGroups = [
  {
    label: "Visão geral",
    items: [
      {
        title: "Dashboard",
        href: "/",
        icon: LayoutDashboard,
      },
    ],
  },
  {
    label: "Dados",
    items: [
      {
        title: "Exploração",
        href: "/exploration",
        icon: Database,
      },
    ],
  },
  {
    label: "Machine Learning",
    items: [
      {
        title: "Modelos",
        href: "/models",
        icon: BrainCircuit,
      },
      {
        title: "Avaliação",
        href: "/evaluation",
        icon: ChartNoAxesCombined,
      },
    ],
  },
  {
    label: "Análise",
    items: [
      {
        title: "Explicabilidade",
        href: "/explainability",
        icon: ScanSearch,
      },
      {
        title: "Simulação",
        href: "/simulation",
        icon: FlaskConical,
      },
    ],
  },
];

export function AppSidebar() {
  const pathname = usePathname();

  return (
    <Sidebar className="border-r border-slate-200 bg-white">
      <SidebarHeader className="border-b border-slate-200 bg-white px-5 py-5">
        <Link
          href="/"
          prefetch={false}
          className="block"
        >
          <Image
            src="/logoofc.png"
            alt="noChurn"
            width={220}
            height={70}
            priority
            className="h-auto w-[190px] object-contain"
          />

          <p className="mt-2 text-[11px] font-medium tracking-wide text-slate-500">
            Inteligência contra evasão acadêmica
          </p>
        </Link>
      </SidebarHeader>

      <SidebarContent className="bg-white px-2 py-4">
        {navigationGroups.map((navigationGroup) => (
          <SidebarGroup
            key={navigationGroup.label}
            className="py-2"
          >
            <SidebarGroupLabel className="mb-1 px-3 text-[10px] font-semibold uppercase tracking-[0.16em] text-slate-400">
              {navigationGroup.label}
            </SidebarGroupLabel>

            <SidebarGroupContent>
              <SidebarMenu className="gap-1">
                {navigationGroup.items.map((navigationItem) => {
                  const NavigationIcon =
                    navigationItem.icon;

                  const isActive =
                    navigationItem.href === "/"
                      ? pathname === "/"
                      : pathname.startsWith(
                          navigationItem.href,
                        );

                  return (
                    <SidebarMenuItem
                      key={navigationItem.href}
                    >
                      <SidebarMenuButton
                        render={
                          <Link
                            href={navigationItem.href}
                            prefetch={false}
                          />
                        }
                        isActive={isActive}
                        className={`relative h-11 rounded-xl px-3 transition-all duration-200 ${
                          isActive
                            ? "bg-slate-100 font-semibold text-slate-950"
                            : "text-slate-600 hover:bg-slate-50 hover:text-slate-950"
                        }`}
                      >
                        {isActive && (
                          <span className="absolute left-0 top-1/2 h-5 w-[3px] -translate-y-1/2 rounded-r-full bg-[#16a34a]" />
                        )}

                        <NavigationIcon
                          className={`size-4 ${
                            isActive
                              ? "text-[#16a34a]"
                              : "text-slate-500"
                          }`}
                        />

                        <span>
                          {navigationItem.title}
                        </span>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  );
                })}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        ))}
      </SidebarContent>
    </Sidebar>
  );
}