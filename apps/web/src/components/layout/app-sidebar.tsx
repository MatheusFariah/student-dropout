"use client";

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
    <Sidebar className="border-r border-slate-200">
      <SidebarHeader className="border-b border-slate-200 bg-white px-5 py-6">
     <Link
  href="/"
  prefetch={false}
  className="block"
>
  <div className="flex items-end">
    <span className="text-[29px] font-bold leading-none tracking-[-0.06em] text-[#087b15]">
      no
    </span>

    <span className="text-[29px] font-normal leading-none tracking-[-0.06em] text-slate-950">
      churn
    </span>
  </div>

  <p className="mt-2 text-[11px] font-medium tracking-wide text-slate-500">
    Inteligência contra evasão acadêmica
  </p>
</Link>
      </SidebarHeader>

      <SidebarContent className="bg-white px-2 py-3">
        {navigationGroups.map((navigationGroup) => (
          <SidebarGroup key={navigationGroup.label}>
            <SidebarGroupLabel className="px-3 text-[10px] font-bold uppercase tracking-[0.16em] text-slate-400">
              {navigationGroup.label}
            </SidebarGroupLabel>

            <SidebarGroupContent>
              <SidebarMenu>
                {navigationGroup.items.map((navigationItem) => {
                  const NavigationIcon = navigationItem.icon;

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
                        className="h-10 rounded-lg px-3 text-slate-600 transition-colors hover:bg-slate-100 hover:text-slate-950 data-[active=true]:bg-green-50 data-[active=true]:font-semibold data-[active=true]:text-[#087b15]"
                      >
                        <NavigationIcon className="size-4" />

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