'use client';
import React, { useState } from 'react';
import { ChevronDown, ChevronRight } from 'lucide-react';
import Link from 'next/link';
import { cn } from '@leetcode-insights/ui/lib/utils';
import { usePathname } from 'next/navigation';

const Sidebar = () => {
  const path = usePathname();
  const [expandedSections, setExpandedSections] = useState<
    Record<string, boolean>
  >({
    'getting-started': true,
    components: false,
    api: false,
    guides: false
  });

  const navigationItems = [
    {
      id: 'getting-started',
      title: 'Getting Started',
      href: '/docs/getting-started'
    },
    {
      id: 'components',
      title: 'Components',
      children: [
        { id: 'button', title: 'Button', href: '#button' },
        { id: 'card', title: 'Card', href: '#card' },
        { id: 'modal', title: 'Modal', href: '#modal' },
        { id: 'dropdown', title: 'Dropdown', href: '#dropdown' }
      ]
    }
  ];

  const toggleSection = (sectionId: string) => {
    setExpandedSections((prev) => ({
      ...prev,
      [sectionId]: !prev[sectionId]
    }));
  };

  return (
    <div className='h-[calc(100vh-7rem)] overflow-y-auto'>
      <nav className=''>
        <ul className='space-y-3'>
          {navigationItems.map((item) => (
            <li key={item.id}>
              {item.children ? (
                // Section with children
                <div>
                  <button
                    onClick={() => toggleSection(item.id)}
                    className={cn(
                      'flex w-full items-center justify-between px-3 py-2 text-sm font-medium transition-colors hover:text-orange-500 dark:text-gray-400 dark:hover:text-orange-500',
                      path === item.href &&
                        'text-orange-500 dark:text-orange-500'
                    )}
                  >
                    <div className='flex items-center gap-2'>
                      <span>{item.title}</span>
                    </div>
                    {expandedSections[item.id] ? (
                      <ChevronDown
                        size={16}
                        className='text-gray-400'
                      />
                    ) : (
                      <ChevronRight
                        size={16}
                        className='text-gray-400'
                      />
                    )}
                  </button>

                  {/* Children */}
                  {expandedSections[item.id] && (
                    <ul className='mt-1 ml-7 space-y-1'>
                      {item.children.map((child) => (
                        <li key={child.id}>
                          <Link
                            href={child.href}
                            className='block px-3 py-2 text-sm transition-colors hover:text-orange-500 dark:text-gray-400 dark:hover:text-orange-500'
                          >
                            {child.title}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              ) : (
                <Link
                  href={item.href}
                  className={cn(
                    'flex px-3 py-2 text-sm font-medium transition-colors hover:text-orange-500 dark:text-gray-400 dark:hover:text-orange-500',
                    path === item.href && 'text-orange-500 dark:text-orange-500'
                  )}
                >
                  <span>{item.title}</span>
                </Link>
              )}
            </li>
          ))}
        </ul>
      </nav>
    </div>
  );
};

export default Sidebar;
