import { Suspense } from 'react'
import { getMemberSkills, getCategories, type SkillCategory } from '@/data/skills'
import { SkillCard } from '@/components/member/skill-card'
import { SkillFilter } from '@/components/member/skill-filter'

export default async function SkillsPage({
  searchParams,
}: {
  searchParams: Promise<{ category?: string }>
}) {
  const params = await searchParams
  const category = params.category as SkillCategory | undefined
  const allSkills = getMemberSkills()
  const categories = getCategories()

  const filtered = category
    ? allSkills.filter((s) => s.category === category)
    : allSkills

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-foreground">
          Skill Catalog
        </h1>
        <p className="mt-2 text-muted-foreground">
          Browse {allSkills.length} curated AI skills with install guides and
          setup instructions.
        </p>
      </div>

      <Suspense fallback={null}>
        <SkillFilter categories={categories} />
      </Suspense>

      <p className="text-sm text-muted-foreground">
        Showing {filtered.length} of {allSkills.length} skills
        {category ? ` in ${category}` : ''}
      </p>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {filtered.map((skill) => (
          <SkillCard key={skill.slug} skill={skill} />
        ))}
      </div>
    </div>
  )
}
