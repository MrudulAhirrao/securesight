// src/components/layout/Navbar.tsx
import {
  LayoutDashboard,
  Clapperboard,
  Users,
  ChevronDown,
  Cctv,
  TriangleAlert,
  User,
  Settings,
  LogOut,
} from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

export default function Navbar() {
  const navLinks = [
    { name: 'Dashboard', icon: LayoutDashboard, href: '#' },
    { name: 'Cameras', icon: Cctv, href: '#' },
    { name: 'Scenes', icon: Clapperboard, href: '#' },
    { name: 'Incidents', icon: TriangleAlert, href: '#' },
    { name: 'Users', icon: Users, href: '#' },
  ];

  return (
    // Responsive padding
    <header className="flex items-center justify-between h-16 px-4 md:px-8 bg-slate-900 border-b border-slate-800 text-slate-300 sticky top-0 z-50">
      <div className="flex items-center">
        <h1 className="text-xl font-semibold tracking-tighter text-white">
          MANDLAC<span className="text-blue-400">X</span>
        </h1>
      </div>

      {/* Center Nav: Hidden on small screens, visible on large screens (lg) and up */}
      <nav className="hidden lg:flex flex-1 items-center justify-center">
        <ul className="flex items-center space-x-4">
          {navLinks.map((link) => {
            const isActive = link.name === 'Dashboard';
            return (
              <li key={link.name}>
                <a
                  href={link.href}
                  className={`flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium transition-colors duration-200 ${
                    isActive ? 'bg-slate-800 text-white' : 'text-slate-400 hover:text-slate-100'
                  }`}
                >
                  <link.icon className={`h-4 w-4 transition-colors ${isActive ? 'text-blue-400' : 'text-slate-500'}`} />
                  <span>{link.name}</span>
                </a>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* User Dropdown */}
      <div className="flex items-center">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className="flex items-center gap-3 rounded-full p-1 hover:bg-slate-800 transition-colors">
              <Avatar className="h-8 w-8 border-2 border-slate-700">
                <AvatarImage src="" alt="@mohamedajnas" />
                <AvatarFallback className="bg-slate-700 text-xs">MA</AvatarFallback>
              </Avatar>
              {/* Hide user name on small screens, visible on medium (md) and up */}
              <div className="hidden md:block text-sm text-left">
                <p className="font-medium text-slate-200">Mohamed Ajnas</p>
              </div>
              <ChevronDown className="hidden md:block h-4 w-4 text-slate-600" />
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-56 bg-slate-900 border-slate-700 text-slate-300" align="end">
            <DropdownMenuLabel className="font-normal">
              <div className="flex flex-col space-y-1 py-1">
                <p className="text-sm font-semibold leading-none text-white">Mohamed Ajnas</p>
                <p className="text-xs leading-none text-slate-400">ajnas@mandlacx.com</p>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator className="bg-slate-700" />
            <DropdownMenuItem className="focus:bg-slate-800 focus:text-white"><User className="mr-2 h-4 w-4" /><span>Profile</span></DropdownMenuItem>
            <DropdownMenuItem className="focus:bg-slate-800 focus:text-white"><Settings className="mr-2 h-4 w-4" /><span>Settings</span></DropdownMenuItem>
            <DropdownMenuSeparator className="bg-slate-700" />
            <DropdownMenuItem className="focus:bg-slate-800 focus:text-white"><LogOut className="mr-2 h-4 w-4" /><span>Log out</span></DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}