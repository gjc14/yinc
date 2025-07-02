import type { Config } from 'tailwindcss'

export default {
	darkMode: 'class',
	content: ['./app/**/{**,.client,.server}/**/*.{ts,tsx}'],
	theme: {
		extend: {
			fontFamily: {
				'serif-tw': ['"Noto Serif TC"', 'serif'],
			},
			screens: {
				xs: '480px',
			},
			typography: {
				DEFAULT: {
					// Remove inline code "`" from the default styles
					css: {
						'code::before': {
							content: 'none',
						},
						'code::after': {
							content: 'none',
						},
						'blockquote p::before': {
							content: 'none',
						},
						'blockquote p::after': {
							content: 'none',
						},
						maxWidth: 'var(--prose-max-width)',
					},
				},
			},
			maxWidth: {
				prose: 'var(--prose-max-width)',
			},
			borderRadius: {
				lg: 'var(--radius)',
				md: 'calc(var(--radius) - 2px)',
				sm: 'calc(var(--radius) - 4px)',
			},
			colors: {
				background: 'var(--background)',
				foreground: 'var(--foreground)',
				brand: {
					DEFAULT: 'var(--brand)',
					foreground: 'var(--brand-foreground)',
				},
				card: {
					DEFAULT: 'var(--card)',
					foreground: 'var(--card-foreground)',
				},
				popover: {
					DEFAULT: 'var(--popover)',
					foreground: 'var(--popover-foreground)',
				},
				primary: {
					DEFAULT: 'var(--primary)',
					foreground: 'var(--primary-foreground)',
				},
				secondary: {
					DEFAULT: 'var(--secondary)',
					foreground: 'var(--secondary-foreground)',
				},
				muted: {
					DEFAULT: 'var(--muted)',
					foreground: 'var(--muted-foreground)',
				},
				accent: {
					DEFAULT: 'var(--accent)',
					foreground: 'var(--accent-foreground)',
				},
				destructive: {
					DEFAULT: 'var(--destructive)',
				},
				border: 'var(--border)',
				input: 'var(--input)',
				ring: 'var(--ring)',
				chart: {
					'1': 'var(--chart-1)',
					'2': 'var(--chart-2)',
					'3': 'var(--chart-3)',
					'4': 'var(--chart-4)',
					'5': 'var(--chart-5)',
				},
				sidebar: {
					DEFAULT: 'var(--sidebar-background)',
					foreground: 'var(--sidebar-foreground)',
					primary: 'var(--sidebar-primary)',
					'primary-foreground': 'var(--sidebar-primary-foreground)',
					accent: 'var(--sidebar-accent)',
					'accent-foreground': 'var(--sidebar-accent-foreground)',
					border: 'var(--sidebar-border)',
					ring: 'var(--sidebar-ring)',
				},
			},
			keyframes: {
				'accordion-down': {
					from: {
						height: '0',
					},
					to: {
						height: 'var(--radix-accordion-content-height)',
					},
				},
				'accordion-up': {
					from: {
						height: 'var(--radix-accordion-content-height)',
					},
					to: {
						height: '0',
					},
				},
			},
			animation: {
				'accordion-down': 'accordion-down 0.2s ease-out',
				'accordion-up': 'accordion-up 0.2s ease-out',
				'spin-slow': 'spin 2s linear infinite',
				'spin-very-slow': 'spin 3s linear infinite',
			},
		},
	},
	plugins: [require('tailwindcss-animate'), require('@tailwindcss/typography')],
} satisfies Config
