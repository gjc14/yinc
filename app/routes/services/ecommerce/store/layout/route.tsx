import { Outlet } from 'react-router'

import { Provider } from 'jotai'

import { MainWrapper } from '~/components/wrappers'

import { Header } from './components/header'

export default function StoreLayout() {
	return (
		<Provider>
			<MainWrapper className="@container">
				<Header />
				<Outlet />
			</MainWrapper>
		</Provider>
	)
}
