import { MainWrapper } from '~/components/wrappers'
import { SignInForm } from './signin-form'

// TODO: Add server side session check

export default function AdminAuth() {
    return (
        <MainWrapper className="justify-center">
            <SignInForm />
        </MainWrapper>
    )
}
