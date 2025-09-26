# Dashboard Route

## Global Navigating UI

Displaying when navigating using `useNavigation` hook. The UI is written in
[layout](./layout/route.tsx).

### Prevent Navigating UI

To prevent displaying the UI, utilize `useNavigationMetadata` hook. When
navigating over, `navMetadata.showGlobalLoader` will be set to true.

1. Manually set `showGlobalLoader` to false
   (`setNavMetadata({ showGlobalLoader: false })`)
2. Navigate starts
3. Navigate ends
4. `showGlobalLoader` is set to true automatically

```tsx
const Component = () => {
	const { navMetadata, setNavMetadata } = useNavigationMetadata()
	const navigate = useNavigate()
	const [, setSearchParams] = useSearchParams()

	const isNavigating = navMetadata.showGlobalLoader === false

	const goToSomewhere = () => {
		// Set showGlobalLoader to false first
		setNavMetadata({ showGlobalLoader: false })

		// a. navigate to destination
		navigate('/path/to/destination', { replace: true })

		// or
		// b. Update search params
		setSearchParams(params, { replace: true })
	}

	return <button onClick={goToSomewhere}>Go to Somewhere</button>
}
```
