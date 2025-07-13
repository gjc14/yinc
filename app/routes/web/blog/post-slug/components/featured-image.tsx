export const FeaturedImage = ({
	src,
	alt,
	description,
}: {
	src: string
	alt: string
	description: string
}) => {
	return (
		<div className="mb-10 flex w-full flex-col">
			<img src={src || 'https://placehold.co/600x400'} alt={alt} />
			<p className="text-muted-foreground pt-3 text-center">{description}</p>
		</div>
	)
}
