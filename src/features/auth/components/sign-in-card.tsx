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
import { useState } from 'react'
import { FaGithub } from 'react-icons/fa'
import { FcGoogle } from 'react-icons/fc'

import { SignInFlow } from '@/features/auth/types'

interface SignInCardProps {
	setState: (state: SignInFlow) => void
}

export const SignInCard = ({ setState }: SignInCardProps) => {
	const [email, setEmail] = useState('')
	const [password, setPassword] = useState('')

	return (
		<Card className="w-full h-full p-8">
			<CardHeader className="px-0 pt-0">
				<CardTitle>Login to continue</CardTitle>

				<CardDescription>Use your email or another service to continue</CardDescription>
			</CardHeader>

			<CardContent className="space-y-5 px-0 pb-0">
				<form action="" className="space-y-2.5">
					<Input
						type="email"
						placeholder="Email"
						disabled={false}
						value={email}
						onChange={(e) => setEmail(e.target.value)}
						required
					/>

					<Input
						type="password"
						placeholder="Password"
						disabled={false}
						value={password}
						onChange={(e) => setPassword(e.target.value)}
						required
					/>

					<Button type="submit" size="lg" disabled={false} className="w-full">
						Continue
					</Button>
				</form>

				<Separator />

				<div className="flex flex-col gap-y-2.5">
					<Button
						type="button"
						size="lg"
						variant="outline"
						disabled={false}
						onClick={() => {}}
						className="w-full relative"
					>
						<FcGoogle className="!size-5 absolute left-2.5 top-1/2 transform -translate-y-1/2" />
						Continue with Google
					</Button>

					<Button
						type="button"
						size="lg"
						variant="outline"
						disabled={false}
						onClick={() => {}}
						className="w-full relative"
					>
						<FaGithub className="!size-5 absolute left-2.5 top-1/2 transform -translate-y-1/2" />
						Continue with GitHub
					</Button>
				</div>

				<p className="text-xs text-muted-foreground">
					Don&apos;t have an account?{' '}
					<span onClick={() => setState('signUp')} className="text-sky-700 hover:underline cursor-pointer">
						Sign up
					</span>
				</p>
			</CardContent>
		</Card>
	)
}
