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
import { useAuthActions } from '@convex-dev/auth/react'

import { SignInFlow } from '@/features/auth/types'

interface SignInCardProps {
	setState: (state: SignInFlow) => void
}

export const SignInCard = ({ setState }: SignInCardProps) => {
	const { signIn } = useAuthActions()

	const [error, setError] = useState<string>('')
	const [email, setEmail] = useState<string>('')
	const [password, setPassword] = useState<string>('')
	const [pending, setPending] = useState<boolean>(false)

	const onPasswordSignIn = (e: FormEvent<HTMLFormElement>) => {
		e.preventDefault()

		setPending(true)

		signIn('password', { email, password, flow: 'signIn' })
			.catch(() => setError('Invalid email or password'))
			.finally(() => setPending(false))
	}

	const onProviderSignIn = (value: 'github' | 'google') => {
		setPending(true)

		signIn(value).finally(() => setPending(false))
	}

	return (
		<Card className='size-full p-8'>
			<CardHeader className='px-0 pt-0'>
				<CardTitle>Login to continue</CardTitle>

				<CardDescription>Use your email or another service to continue</CardDescription>
			</CardHeader>

			{!!error && (
				<div className='mb-6 flex items-center gap-x-2 rounded-md bg-destructive/15 p-3 text-sm text-destructive'>
					<TriangleAlertIcon size={16} />

					<p>{error}</p>
				</div>
			)}

			<CardContent className='space-y-5 px-0 pb-0'>
				<form onSubmit={onPasswordSignIn} className='space-y-2.5'>
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
						onClick={() => onProviderSignIn('google')}
						className='relative w-full'
					>
						<FcGoogle size={20} className='absolute top-1/2 left-2.5 size-5! -translate-y-1/2 transform' />
						Continue with Google
					</Button>

					<Button
						type='button'
						size='lg'
						variant='outline'
						disabled={pending}
						onClick={() => onProviderSignIn('github')}
						className='relative w-full'
					>
						<FaGithub size={20} className='absolute top-1/2 left-2.5 size-5! -translate-y-1/2 transform' />
						Continue with GitHub
					</Button>
				</div>

				<p className='text-xs text-muted-foreground'>
					Don&apos;t have an account?{' '}
					<span onClick={() => setState('signUp')} className='cursor-pointer text-sky-700 hover:underline'>
						Sign up
					</span>
				</p>
			</CardContent>
		</Card>
	)
}
