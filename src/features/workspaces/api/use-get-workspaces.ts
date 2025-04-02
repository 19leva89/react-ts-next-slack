import { useQuery } from 'convex/react'

import { api } from '../../../../convex/_generated/api'

export const useGetWorkspaces = () => {
	const data = useQuery(api.models.workspaces.get)
	const isLoading = data === undefined

	return { data, isLoading }
}
