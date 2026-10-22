import type { Metadata } from 'next'

import { BookButton } from '@/components/book-button'
import { Button } from '@/components/button'
import { JsonLd } from '@/components/json-ld'
import { CopyPrompt } from '@/components/skills/copy-prompt'
import { PlainMarkdown } from '@/components/skills/plain-markdown'
import { SKILLS } from '@/content/skills'
import { breadcrumbSchema } from '@/lib/schema'
import { readSkillFiles } from '@/lib/skills'

const title = 'Free AI Skills for Business Owners'
const description =
  'Free AI skills for busy owners and executives: meeting prep, a weekly plan, decision memos, and call follow-ups. See an example, copy the prompt, or add the skill to Claude or ChatGPT.'

export const metadata: Metadata = {
  title,
  description,
  alternates: { canonical: '/skills' },
  openGraph: { title, description, url: '/skills', type: 'website' },
}

export default function SkillsPage() {
  const skills = SKILLS.map((s) => ({ ...s, files: readSkillFiles(s.slug) }))

  return (
    <>
      <JsonLd
        data={breadcrumbSchema([
          { name: 'Home', path: '/' },
          { name: 'Free AI skills', path: '/skills' },
        ])}
      />

      <section className="page-head">
        <p className="eyebrow">Free skills</p>
        <h1>
          AI skills for <em>your own week.</em>
        </h1>
        <p className="lede">
          Each one does a single job. See an example first, copy the prompt into any AI chat, or
          install the full skill in Claude or ChatGPT.
        </p>
        <p className="lede">
          Use a business account or one with model training turned off, and read what comes back
          before you send it anywhere.
        </p>
        <nav className="skill-index mono" aria-label="Skills on this page">
          {skills.map((s) => (
            <a key={s.slug} href={`#${s.slug}`}>
              {s.name}
            </a>
          ))}
        </nav>
      </section>

      <div className="page-body">
        {skills.map((s) => (
          <article className="skill" id={s.slug} key={s.slug} aria-labelledby={`${s.slug}-title`}>
            <header className="skill-head">
              <h2 id={`${s.slug}-title`}>{s.name}</h2>
              <p className="lede">{s.summary}</p>
            </header>

            <dl className="skill-facts">
              <div>
                <dt className="mono">Give it</dt>
                <dd>{s.giveIt}</dd>
              </div>
              <div>
                <dt className="mono">Keep out</dt>
                <dd>{s.dontPaste}</dd>
              </div>
            </dl>

            <details className="skill-example">
              <summary>See an example</summary>
              <p className="mono example-note">{s.files.example.note}</p>
              <div className="example-cols">
                <div>
                  <h3 className="mono">{s.files.example.inputTitle}</h3>
                  <div className="example-text">
                    <PlainMarkdown text={s.files.example.input} />
                  </div>
                </div>
                <div>
                  <h3 className="mono">{s.files.example.outputTitle}</h3>
                  <div className="example-text example-output">
                    <PlainMarkdown text={s.files.example.output} />
                  </div>
                </div>
              </div>
            </details>

            <div className="skill-ways">
              <div>
                <h3>Copy the prompt</h3>
                <p>Works in any AI chat, on any plan.</p>
                <CopyPrompt prompt={s.files.prompt} slug={s.slug} />
              </div>
              <div>
                <h3>Install the skill</h3>
                <p>One ZIP file. It works in both apps.</p>
                <div className="actions">
                  <Button href={`/skills/${s.slug}.zip`} arrow="↓" download track="skill_download_claude">
                    Add to Claude
                  </Button>
                  <Button
                    href={`/skills/${s.slug}.zip`}
                    arrow="↓"
                    variant="secondary"
                    download
                    track="skill_download_chatgpt"
                  >
                    Add to ChatGPT
                  </Button>
                </div>
                <details className="install-steps">
                  <summary className="mono">How to install it</summary>
                  <div className="install-cols">
                    <div>
                      <h4>Claude</h4>
                      <ol>
                        <li>Download the ZIP.</li>
                        <li>
                          In Claude, open Customize, then Skills. Press +, choose Create skill, then
                          Upload a skill.
                        </li>
                        <li>Pick the ZIP, then ask Claude for what the skill does.</li>
                      </ol>
                      <p className="mono">
                        Works on every Claude plan. “Code execution and file creation” must be on in
                        Settings.
                      </p>
                    </div>
                    <div>
                      <h4>ChatGPT</h4>
                      <ol>
                        <li>Download the ZIP.</li>
                        <li>
                          In ChatGPT, open Plugins, then the Skills tab. Choose Create, then Upload
                          from your computer.
                        </li>
                        <li>
                          In a chat, type <code>@{s.slug}</code> to use it.
                        </li>
                      </ol>
                      <p className="mono">
                        Needs a ChatGPT Business, Enterprise, or Edu account. On Plus, copy the prompt
                        into a Project instead. Using Codex? Unzip the folder into ~/.agents/skills.
                      </p>
                    </div>
                  </div>
                </details>
              </div>
            </div>
          </article>
        ))}

        <div className="skills-cta">
          <h2>
            Want help setting these up? <em>That’s the first session.</em>
          </h2>
          <BookButton light />
        </div>
      </div>
    </>
  )
}
