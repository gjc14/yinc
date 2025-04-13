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
		<div className="w-full flex flex-col mb-10">
			<img src={src || 'https://placehold.co/600x400'} alt={alt} />
			<p className="text-center text-muted-foreground pt-3">{description}</p>
		</div>
	)
}
