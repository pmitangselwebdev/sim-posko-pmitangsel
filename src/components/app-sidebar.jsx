"use client"

import * as React from "react"
import { useState, useEffect } from "react"
import {
  AudioWaveform,
  BookOpen,
  Bot,
  Command,
  Frame,
  GalleryVerticalEnd,
  Map,
  PieChart,
  Settings2,
  SquareTerminal,
  Users,
  UserCheck,
  Calendar,
} from "lucide-react"

import { NavMain } from "@/components/nav-main"
import { NavProjects } from "@/components/nav-projects"
import { NavUser } from "@/components/nav-user"
import { TeamSwitcher } from "@/components/team-switcher"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from "@/components/ui/sidebar"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { useUser } from "@clerk/nextjs"

// This is sample data.
const data = {
  user: {
    name: "Admin PMI",
    email: "admin@pmi-tangsel.go.id",
    avatar: "/avatars/shadcn.jpg",
  },
  teams: [
    {
      name: "",
      logo: GalleryVerticalEnd,
      plan: "",
    },
  ],
  navMain: [
    {
      title: "Dashboard",
      url: "/dashboard",
      icon: SquareTerminal,
      isActive: true,
    },
    {
      title: "Petugas Posko",
      url: "/dashboard/petugas-posko",
      icon: UserCheck,
    },
    {
      title: "Manajemen SDM",
      url: "/dashboard/manajemen-sdm",
      icon: Users,
    },
    {
      title: "Absensi",
      url: "/dashboard/absensi",
      icon: Calendar,
    },
    {
      title: "Statistik",
      url: "/dashboard/statistics",
      icon: PieChart,
    },
    {
      title: "Laporan",
      url: "/dashboard/laporan",
      icon: BookOpen,
    },
    {
      title: "Petugas Assessment",
      url: "/dashboard/assessment",
      icon: Settings2,
    },
    {
      title: "Petugas Ambulance",
      url: "/dashboard/ambulance",
      icon: AudioWaveform,
    },
    {
      title: "Manajemen Logistik",
      url: "/dashboard/logistik",
      icon: Frame,
    },
    {
      title: "Settings",
      url: "/dashboard/setting",
      icon: Settings2,
    },
  ],
  projects: [],
}

export function AppSidebar({ ...props }) {
  const { user: clerkUser } = useUser()
  const [userData, setUserData] = useState(null)

  useEffect(() => {
    const fetchUserData = async () => {
      if (clerkUser?.emailAddresses[0]?.emailAddress) {
        try {
          const response = await fetch(`/api/users/profile?email=${clerkUser.emailAddresses[0].emailAddress}`)
          if (response.ok) {
            const data = await response.json()
            setUserData(data)
            console.log('Fetched user data:', data)
          } else {
            console.log('Failed to fetch user data:', response.status)
          }
        } catch (error) {
          console.error('Error fetching user data:', error)
        }
      }
    }

    if (clerkUser) {
      fetchUserData()
    }
  }, [clerkUser])

  // Listen for profile updates from settings page
  useEffect(() => {
    const handleProfileUpdate = async () => {
      console.log('Profile updated, refreshing sidebar data')
      if (clerkUser?.emailAddresses[0]?.emailAddress) {
        try {
          const response = await fetch(`/api/users/profile?email=${clerkUser.emailAddresses[0].emailAddress}`)
          if (response.ok) {
            const data = await response.json()
            setUserData(data)
            console.log('Sidebar updated with new profile data:', data)
          } else {
            console.log('Failed to fetch updated profile data:', response.status)
          }
        } catch (error) {
          console.error('Error refreshing profile:', error)
        }
      }
    }

    window.addEventListener('profileUpdated', handleProfileUpdate)
    return () => {
      window.removeEventListener('profileUpdated', handleProfileUpdate)
    }
  }, [clerkUser])

  // Filter navigation items based on user role
  const getFilteredNavItems = () => {
    const userRole = userData?.role
    const isAdminOrKoordinator = userRole === 'Admin' || userRole === 'Koordinator'

    return data.navMain.filter(item => {
      // Hide "Manajemen SDM" from Petugas
      if (item.title === "Manajemen SDM" && !isAdminOrKoordinator) {
        return false
      }
      return true
    })
  }

  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <div className="flex flex-col items-center space-y-3 p-6 border-b border-sidebar-border">
          <Avatar className="h-20 w-20">
            <AvatarImage
              src={userData?.foto || "/images/default-profile-picture.png"}
              alt="Profile Picture"
            />
            <AvatarFallback className="text-xl">
              {userData?.namaLengkap?.charAt(0) || clerkUser?.firstName?.charAt(0) || "U"}
            </AvatarFallback>
          </Avatar>
          <div className="text-center">
            <p className="text-sm font-medium text-sidebar-foreground">
              Halo, {userData?.namaLengkap || clerkUser?.firstName || "User"}
            </p>
            <p className="text-xs text-sidebar-foreground/70">
              Selamat bertugas
            </p>
          </div>
        </div>
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={getFilteredNavItems()} />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={data.user} />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  )
}
