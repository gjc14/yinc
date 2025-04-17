import { useRef } from 'react'

import { PopoverClose } from '@radix-ui/react-popover'
import { Editor } from '@tiptap/react'

import { Button } from '~/components/ui/button'
import { Input } from '~/components/ui/input'
import { Label } from '~/components/ui/label'
import {
	Popover,
	PopoverContent,
	PopoverTrigger,
} from '~/components/ui/popover'
import Youtube from '~/components/editor/components/asset/youtube'

import { ToggleButton } from '../components/toggle-button'

export const YoutubeButton = ({ editor }: { editor: Editor }) => {
	const urlInputRef = useRef<HTMLInputElement>(null)
	const widthInputRef = useRef<HTMLInputElement>(null)
	const heightInputRef = useRef<HTMLInputElement>(null)

	return (
		<Popover>
			<PopoverTrigger asChild>
				<ToggleButton disabled={false} tooltip="Insert Youtube">
					<Youtube />
				</ToggleButton>
			</PopoverTrigger>
			<PopoverContent className="w-96">
				<div className="grid gap-3">
					<div className="space-y-2">
						<h4>Youtube Link</h4>
						<p className="text-sm text-muted-foreground">
							Copy and paste the Youtube link you want to embed.
						</p>
					</div>

					<div className="grid gap-2">
						<div className="grid grid-cols-3 items-center gap-1">
							<Label htmlFor="url">URL</Label>
							<Input
								ref={urlInputRef}
								id="url"
								placeholder="https://www.youtube.com/watch?v=MgsdDfdGdHc"
								className="col-span-2 h-8"
							/>
						</div>
					</div>

					<footer>
						<PopoverClose asChild>
							<Button
								className="w-full"
								onClick={() => {
									const url = urlInputRef.current?.value
									const width = widthInputRef.current?.value
									const height = heightInputRef.current?.value

									if (url) {
										editor.commands.setYoutubeVideo({
											src: url,
										})
									}
								}}
							>
								Insert Youtube
							</Button>
						</PopoverClose>
					</footer>
				</div>
			</PopoverContent>
		</Popover>
	)
}
