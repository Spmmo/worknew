'use client';

import { useEffect, useState } from 'react'
import {
  UsersIcon, MessageSquareIcon, FileTextIcon, CalendarIcon,
  CheckSquareIcon, FolderIcon, Share2Icon, BellIcon,
  VideoIcon, MailIcon, ClipboardIcon, TargetIcon,
  BriefcaseIcon, PieChartIcon, SettingsIcon, ZapIcon,
} from './Icons.jsx'

const iconComponents = [
  UsersIcon, MessageSquareIcon, FileTextIcon, CalendarIcon,
  CheckSquareIcon, FolderIcon, Share2Icon, BellIcon,
  VideoIcon, MailIcon, ClipboardIcon, TargetIcon,
  BriefcaseIcon, PieChartIcon, SettingsIcon, ZapIcon,
]

function FloatingIcon({ icon: Icon, initialX, initialY, delay, duration }) {
  return (
    <div
      className="floating-icon"
      style={{
        left: `${initialX}%`,
        top: `${initialY}%`,
        animationDelay: `${delay}s`,
        animationDuration: `${duration}s`,
      }}
    >
      <Icon />
    </div>
  )
}

export default function AnimatedBackground() {
  const [floatingIcons, setFloatingIcons] = useState([])

  useEffect(() => {
    const generated = Array.from({ length: 25 }, (_, i) => ({
      id: i,
      icon: iconComponents[i % iconComponents.length],
      initialX: Math.random() * 100,
      initialY: Math.random() * 100,
      delay: Math.random() * 5,
      duration: 15 + Math.random() * 20,
    }))
    setFloatingIcons(generated)
  }, [])

  return (
    <div className="animated-bg">
      <div className="animated-bg__gradient" />

      <div className="animated-bg__orb animated-bg__orb--1" />
      <div className="animated-bg__orb animated-bg__orb--2" />
      <div className="animated-bg__orb animated-bg__orb--3" />

      <div className="animated-bg__grid" />

      {floatingIcons.map((item) => (
        <FloatingIcon key={item.id} {...item} />
      ))}

      <div>
        {Array.from({ length: 30 }).map((_, i) => (
          <div
            key={i}
            className="particle"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 5}s`,
              animationDuration: `${2 + Math.random() * 3}s`,
            }}
          />
        ))}
      </div>
    </div>
  )
}
