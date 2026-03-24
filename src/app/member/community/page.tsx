import Link from 'next/link'
import { ExternalLink, MessageCircle, Users } from 'lucide-react'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'

export const metadata = {
  title: 'Community | SuperAIcoach',
  description: 'Join the SuperAIcoach community',
}

export default function CommunityPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-foreground">
          Community
        </h1>
        <p className="mt-2 text-muted-foreground">
          Connect with other members, share your setup, and get help building
          your AI stack.
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MessageCircle className="h-5 w-5 text-accent" />
              Discord Community
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="mb-4 text-sm text-muted-foreground">
              Join our Discord server for real-time discussions, skill sharing,
              and support from other members and the team.
            </p>
            <Button asChild className="w-full">
              <a
                href="https://discord.com/invite/clawd"
                target="_blank"
                rel="noopener noreferrer"
              >
                Join Discord
                <ExternalLink className="ml-2 h-4 w-4" />
              </a>
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5 text-accent" />
              Skill Hub
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="mb-4 text-sm text-muted-foreground">
              Browse community-contributed skills, share your own, and discover
              new ways to extend your AI agent.
            </p>
            <Button asChild variant="outline" className="w-full">
              <a
                href="https://clawhub.com"
                target="_blank"
                rel="noopener noreferrer"
              >
                Browse ClawHub
                <ExternalLink className="ml-2 h-4 w-4" />
              </a>
            </Button>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardContent className="p-6">
          <h3 className="mb-2 font-semibold text-foreground">
            Getting Started Tips
          </h3>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li className="flex items-start gap-2">
              <span className="font-bold text-accent">1.</span>
              Start with a Starter Config that matches your workflow
            </li>
            <li className="flex items-start gap-2">
              <span className="font-bold text-accent">2.</span>
              Add individual skills as you discover new needs
            </li>
            <li className="flex items-start gap-2">
              <span className="font-bold text-accent">3.</span>
              Share your setup in Discord to get feedback and ideas
            </li>
            <li className="flex items-start gap-2">
              <span className="font-bold text-accent">4.</span>
              Contribute your own skills to ClawHub for others to use
            </li>
          </ul>
        </CardContent>
      </Card>
    </div>
  )
}
