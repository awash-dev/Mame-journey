import React from "react";
import Link from "next/link";
import {
  FaLinkedin,
  FaTelegram,
  FaXTwitter,
  FaGithub,
  FaInstagram,
} from "react-icons/fa6";

export default function Footer() {
  const socialLinks = [
    {
      icon: <FaLinkedin size={24} />,
      href: "https://www.linkedin.com/in/mohammed-hussen-mohammed-70981b299/",
      label: "LinkedIn",
    },
    {
      icon: <FaTelegram size={24} />,
      href: "https://t.me/m0h4mm3d_hu553n",
      label: "Telegram",
    },
    {
      icon: <FaXTwitter size={24} />,
      href: "https://twitter.com/awash_dev",
      label: "X",
    },
    {
      icon: <FaGithub size={24} />,
      href: "https://github.com/Awash_dev",
      label: "GitHub",
    },
    {
      icon: <FaInstagram size={24} />,
      href: "https://www.instagram.com/awash_dev",
      label: "Instagram",
    },
  ];

  return (
    <footer className="bg-gray-100 dark:bg-gray-800 py-10 text-center text-gray-600 dark:text-gray-400">
      <div className="container mx-auto mb-6">
        <ul className="flex justify-center space-x-8">
          {socialLinks.map((link) => (
            <li key={link.label}>
              <Link
                href={link.href}
                target="_blank"
                rel="noopener noreferrer"
                className="hover:opacity-75 transition-opacity"
                aria-label={`Follow me on ${link.label}`}
              >
                {link.icon}
              </Link>
            </li>
          ))}
        </ul>
      </div>
      <p className="text-sm mb-2 text-[18px]">
        &copy; 2025 All rights reserved, Designed by{" "}
        <Link
          href="https://github.com/awash-dev"
          target="_blank"
          rel="noopener noreferrer"
          className="font-semibold hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
        >
          awash-dev
        </Link>
      </p>
    </footer>
  );
}
