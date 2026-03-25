'use client'

import Link from 'next/link'
import { useState } from 'react'
import { ArrowRight, Bot, Search } from 'lucide-react'

import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { SkillCard } from '@/components/member/skill-card'
import skills from '@/data/skills.json'

const categories = ['All', ...Array.from(new Set(skills.map((s) => s.category)))]

export default function SkillsCatalog() {
  const [search, setSearch] = useState('')
  const [activeCategory, setActiveCategory] = useState('All')

  const filtered = skills.filter((skill) => {
    const matchesCategory = activeCategory === 'All' || skill.category === activeCategory
    const matchesSearch =
      !search ||
      skill.name.toLowerCase().includes(search.toLowerCase()) ||
      skill.oneLiner.toLowerCase().includes(search.toLowerCase()) ||
      skill.description.toLowerCase().includes(search.toLowerCase())
    return matchesCategory && matchesSearch
  })

  return (
    <div className="mx-auto max-w-6xl px-6 py-8">
      <div className="mb-8 space-y-4">
        <div>
          <p className="text-sm font-medium text-accent">Secondary library</p>
          <h1 className="text-3xl font-bold text-foreground">Tool library</h1>
          <p className="mt-2 max-w-3xl text-muted-foreground">
            Browse every tool in the stack when you want to go deeper. If you want the quickest
            recommendation, start on the profession-first page and come back here only when you
            need more control.
          </p>
        </div>

        <div className="rounded-2xl border border-dashed border-border/70 bg-muted/30 p-4">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 className="font-medium text-foreground">Want the simplest starting point?</h2>
              <p className="text-sm text-muted-foreground">
                Use the starter page to get a profession + platform recommendation first.
              </p>
            </div>
            <Button asChild variant="outline" className="rounded-full">
              <Link href="/member">
                Go to Start here
                <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
          </div>
        </div>
      </div>

      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search tools..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-10"
          />
        </div>
        <div className="flex flex-wrap gap-2">
          {categories.map((cat) => (
            <Button
              key={cat}
              variant={activeCategory === cat ? 'default' : 'outline'}
              size="sm"
              onClick={() => setActiveCategory(cat)}
            >
              {cat}
            </Button>
          ))}
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {filtered.map((skill) => (
          <SkillCard key={skill.slug} skill={skill} />
        ))}
      </div>

      {filtered.length === 0 && (
        <div className="py-12 text-center">
          <Bot className="mx-auto h-12 w-12 text-muted-foreground" />
          <h3 className="mt-4 text-lg font-medium text-foreground">No tools found</h3>
          <p className="mt-2 text-muted-foreground">Try adjusting your search or filter.</p>
        </div>
      )}
    </div>
  )
}
