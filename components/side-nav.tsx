"use client";

import Image from "next/image";
import { Home, FileText } from "lucide-react";
import { cn } from "@/lib/utils";

const imgLogo = "http://localhost:3845/assets/3debc2d69be008bbd1ba53aef1aa35bb42421beb.svg";
const imgAvatar = "http://localhost:3845/assets/25354e78e6039d227adaac9113b16282deacc365.png";

interface NavItemProps {
  icon: React.ReactNode;
  isActive?: boolean;
}

function NavItem({ icon, isActive }: NavItemProps) {
  return (
    <div
      className={cn(
        "flex items-center justify-center p-2 rounded-lg transition-colors",
        isActive
          ? "bg-[#dcfce6] border-[1.5px] border-[#158039]"
          : "hover:bg-gray-100"
      )}
    >
      {icon}
    </div>
  );
}

export function SideNav() {
  return (
    <div className="fixed left-0 top-0 h-screen w-16 bg-white border-r border-[#d9dede] flex flex-col z-50">
      {/* Header with Logo */}
      <div className="flex flex-col items-center justify-center py-4 px-3">
        <div className="w-9 h-9 flex items-center justify-center">
          <div className="bg-[#00291b] flex items-center justify-center rounded-2xl w-6 h-6 overflow-hidden">
            <Image
              src={imgLogo}
              alt="Logo"
              width={24}
              height={24}
              className="w-full h-full object-contain"
              unoptimized
            />
          </div>
        </div>
      </div>

      {/* Navigation Items */}
      <div className="flex-1 flex flex-col items-center gap-2 py-2 px-4">
        <NavItem icon={<Home className="w-5 h-5 text-[#262b2b]" />} />
        <NavItem
          icon={<FileText className="w-5 h-5 text-[#262b2b]" />}
          isActive
        />
      </div>

      {/* Profile Section */}
      <div className="border-t border-[#d9dede] p-3">
        <div className="flex items-center justify-center">
          <div className="relative w-9 h-9">
            <Image
              src={imgAvatar}
              alt="Avatar"
              width={36}
              height={36}
              className="w-9 h-9 rounded-full object-cover"
              unoptimized
            />
            <div className="absolute -right-0.5 top-5 w-2.5 h-2.5 bg-[#158039] border-[0.5px] border-[#f1f2f3] rounded-full" />
          </div>
        </div>
      </div>
    </div>
  );
}

