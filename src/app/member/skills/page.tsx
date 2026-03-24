'use client'

import { useState } from 'react'
import { Bot, Search } from 'lucide-react'

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
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-foreground">Skills Catalog</h1>
        <p className="mt-2 text-muted-foreground">
          Discover and install AI skills for your stack. Each skill adds new capabilities to your
          agent.
        </p>
      </div>

      {/* Search and filter */}
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search skills..."
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

      {/* Skills grid */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {filtered.map((skill) => (
          <SkillCard key={skill.slug} skill={skill} />
        ))}
      </div>

      {filtered.length === 0 && (
        <div className="py-12 text-center">
          <Bot className="mx-auto h-12 w-12 text-muted-foreground" />
          <h3 className="mt-4 text-lg font-medium text-foreground">No skills found</h3>
          <p className="mt-2 text-muted-foreground">Try adjusting your search or filter.</p>
        </div>
      )}
    </div>
  )
}
