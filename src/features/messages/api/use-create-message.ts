import { useMutation } from 'convex/react'
import { useCallback, useMemo, useState } from 'react'

import { api } from '../../../../convex/_generated/api'
import { Id } from '../../../../convex/_generated/dataModel'

type RequestType = {
	body: string
	image?: Id<'_storage'>
	workspaceId: Id<'workspaces'>
	channelId?: Id<'channels'>
	conversationId?: Id<'conversations'>
	parentMessageId?: Id<'messages'>
}

type ResponseType = Id<'messages'> | null

type Options = {
	onSuccess?: (data: ResponseType) => void
	onError?: (error: Error) => void
	onSettled?: () => void
	throwOnError?: boolean
}

export const useCreateMessage = () => {
	const [error, setError] = useState<Error | null>(null)
	const [data, setData] = useState<ResponseType | null>(null)
	const [status, setStatus] = useState<'success' | 'error' | 'settled' | 'pending' | null>(null)

	const isPending = useMemo(() => status === 'pending', [status])
	const isSuccess = useMemo(() => status === 'success', [status])
	const isError = useMemo(() => status === 'error', [status])
	const isSettled = useMemo(() => status === 'settled', [status])

	const mutation = useMutation(api.models.messages.create)

	const mutate = useCallback(
		async (values: RequestType, options?: Options) => {
			try {
				setData(null)
				setError(null)
				setStatus('pending')

				const response = await mutation(values)

				options?.onSuccess?.(response)

				return response
			} catch (error) {
				setStatus('error')

				options?.onError?.(error as Error)

				if (options?.throwOnError) {
					throw error
				}
			} finally {
				setStatus('settled')
				options?.onSettled?.()
			}
		},
		[mutation],
	)

	return { mutate, data, error, isPending, isSuccess, isError, isSettled }
}
