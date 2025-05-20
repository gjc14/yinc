import { FerrisWheel, Terminal } from 'lucide-react'

import { Badge } from '~/components/ui/badge'

import Reveal from '../util/Reveal'

export const Skills = () => {
	return (
		<div className="relative">
			<Reveal>
				<div>
					<h4 className="flex items-center mb-6">
						<Terminal className="text-accent-foreground text-2xl" />
						<span className="font-bold ml-2">Use at work</span>
					</h4>
					<div className="flex flex-wrap gap-2 mb-12">
						<Badge variant="secondary">TypeScript</Badge>
						<Badge variant="secondary">Python</Badge>
						<Badge variant="secondary">SQL</Badge>
						<Badge variant="secondary">Google Cloud</Badge>
						<Badge variant="secondary">(GCP) Cloud Run</Badge>
						<Badge variant="secondary">(GCP) Compute Engine</Badge>
						<Badge variant="secondary">Cloudflare</Badge>
						<Badge variant="secondary">Vercel</Badge>
						<Badge variant="secondary">React Router v7</Badge>
						<Badge variant="secondary">Tailwind</Badge>
						<Badge variant="secondary">Flask</Badge>
						<Badge variant="secondary">PostgreSQL</Badge>
						<Badge variant="secondary">MongoDB Atlas</Badge>
						<Badge variant="secondary">Github</Badge>
						<Badge variant="secondary">Prisma</Badge>
						<Badge variant="secondary">Zod</Badge>
						<Badge variant="secondary">Resend</Badge>
						<Badge variant="secondary">VS Code w/ Copilot</Badge>
						<Badge variant="secondary">SSH</Badge>
						<Badge variant="secondary">Docker</Badge>
						<Badge variant="secondary">LINE Message API</Badge>
						<Badge variant="secondary">LINE Pay</Badge>
						<Badge variant="secondary">LINE LIFF</Badge>
						<Badge variant="secondary">WordPress</Badge>
						<Badge variant="secondary">Elementor</Badge>
						<Badge variant="secondary">VIM</Badge>
					</div>
				</div>
			</Reveal>
			<Reveal>
				<div>
					<h4 className="flex items-center mb-6">
						<FerrisWheel className="text-accent-foreground text-2xl" />
						<span className="font-bold ml-2">Use for fun</span>
					</h4>
					<div className="flex flex-wrap gap-2 mb-12">
						<Badge variant="secondary">Go</Badge>
						<Badge variant="secondary">MQTT</Badge>
						<Badge variant="secondary">Supabase</Badge>
						<Badge variant="secondary">Firebase</Badge>
						<Badge variant="secondary">AWS</Badge>
						<Badge variant="secondary">Azure</Badge>
						<Badge variant="secondary">Gitlab</Badge>
						<Badge variant="secondary">NGINX</Badge>
						<Badge variant="secondary">Apache</Badge>
						<Badge variant="secondary">Let's Encrypt</Badge>
						<Badge variant="secondary">SYSTEMD</Badge>
						<Badge variant="secondary">Gunicorn</Badge>
						<Badge variant="secondary">Framer Motion</Badge>
						<Badge variant="secondary">Tiptap</Badge>
						<Badge variant="secondary">TapPay</Badge>
						<Badge variant="secondary">Ragic</Badge>
						<Badge variant="secondary">SAP S/4HANA ERP</Badge>
						<Badge variant="secondary">ACL</Badge>
					</div>
				</div>
			</Reveal>
		</div>
	)
}
