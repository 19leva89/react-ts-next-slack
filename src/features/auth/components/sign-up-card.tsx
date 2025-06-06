import {
	Button,
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
	Input,
	Separator,
} from '@/components/ui'
import { FaGithub } from 'react-icons/fa'
import { FcGoogle } from 'react-icons/fc'
import { FormEvent, useState } from 'react'
import { TriangleAlertIcon } from 'lucide-react'

import { SignInFlow } from '@/features/auth/types'
import { useAuthActions } from '@convex-dev/auth/react'

interface SignUpCardProps {
	setState: (state: SignInFlow) => void
}

export const SignUpCard = ({ setState }: SignUpCardProps) => {
	const { signIn } = useAuthActions()

	const [name, setName] = useState<string>('')
	const [email, setEmail] = useState<string>('')
	const [password, setPassword] = useState<string>('')
	const [confirmPassword, setConfirmPassword] = useState<string>('')

	const [error, setError] = useState<string>('')
	const [pending, setPending] = useState<boolean>(false)

	const onPasswordSignUp = (e: FormEvent<HTMLFormElement>) => {
		e.preventDefault()

		if (password !== confirmPassword) {
			setError("Passwords don't match")

			return
		}

		setPending(true)

		signIn('password', { name, email, password, flow: 'signUp' })
			.catch(() => setError('Something went wrong'))
			.finally(() => setPending(false))
	}

	const onProviderSignUp = (value: 'github' | 'google') => {
		setPending(true)

		signIn(value).finally(() => setPending(false))
	}

	return (
		<Card className='size-full p-8'>
			<CardHeader className='px-0 pt-0'>
				<CardTitle>Sign up to continue</CardTitle>

				<CardDescription>Use your email or another service to continue</CardDescription>
			</CardHeader>

			{!!error && (
				<div className='mb-6 flex items-center gap-x-2 rounded-md bg-destructive/15 p-3 text-sm text-destructive'>
					<TriangleAlertIcon size={16} />

					<p>{error}</p>
				</div>
			)}

			<CardContent className='space-y-5 px-0 pb-0'>
				<form onSubmit={onPasswordSignUp} className='space-y-2.5'>
					<Input
						type='text'
						placeholder='Full name'
						disabled={pending}
						value={name}
						onChange={(e) => setName(e.target.value)}
						required
					/>

					<Input
						type='email'
						placeholder='Email'
						disabled={pending}
						value={email}
						onChange={(e) => setEmail(e.target.value)}
						required
					/>

					<Input
						type='password'
						placeholder='Password'
						disabled={pending}
						value={password}
						onChange={(e) => setPassword(e.target.value)}
						required
					/>

					<Input
						type='password'
						placeholder='Confirm password'
						disabled={pending}
						value={confirmPassword}
						onChange={(e) => setConfirmPassword(e.target.value)}
						required
					/>

					<Button type='submit' size='lg' disabled={pending} className='w-full'>
						Continue
					</Button>
				</form>

				<Separator />

				<div className='flex flex-col gap-y-2.5'>
					<Button
						type='button'
						size='lg'
						variant='outline'
						disabled={pending}
						onClick={() => onProviderSignUp('google')}
						className='relative w-full'
					>
						<FcGoogle className='absolute top-1/2 left-2.5 size-5! -translate-y-1/2 transform' />
						Continue with Google
					</Button>

					<Button
						type='button'
						size='lg'
						variant='outline'
						disabled={pending}
						onClick={() => onProviderSignUp('github')}
						className='relative w-full'
					>
						<FaGithub className='absolute top-1/2 left-2.5 size-5! -translate-y-1/2 transform' />
						Continue with GitHub
					</Button>
				</div>

				<p className='text-xs text-muted-foreground'>
					Already have an account?{' '}
					<span onClick={() => setState('signIn')} className='cursor-pointer text-sky-700 hover:underline'>
						Sign in
					</span>
				</p>
			</CardContent>
		</Card>
	)
}
