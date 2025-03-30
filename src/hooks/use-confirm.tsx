import { JSX, useState } from 'react'

import {
	AlertDialog,
	AlertDialogAction,
	AlertDialogCancel,
	AlertDialogContent,
	AlertDialogDescription,
	AlertDialogFooter,
	AlertDialogHeader,
	AlertDialogTitle,
} from '@/components/ui'

export const useConfirm = (title: string, message: string): [() => JSX.Element, () => Promise<unknown>] => {
	const [promise, setPromise] = useState<{ resolve: (value: boolean) => void } | null>(null)

	const confirm = () => new Promise((resolve, reject) => setPromise({ resolve }))

	const handleClose = () => {
		setPromise(null)
	}

	const handleCancel = () => {
		promise?.resolve(false)
		handleClose()
	}

	const handleConfirm = () => {
		promise?.resolve(true)
		handleClose()
	}

	const ConfirmDialog = () => (
		<AlertDialog open={promise !== null} onOpenChange={handleClose}>
			<AlertDialogContent>
				<AlertDialogHeader>
					<AlertDialogTitle>{title}</AlertDialogTitle>

					<AlertDialogDescription>{message}</AlertDialogDescription>
				</AlertDialogHeader>

				<AlertDialogFooter className="pt-2">
					<AlertDialogCancel onClick={handleCancel}>Cancel</AlertDialogCancel>

					<AlertDialogAction onClick={handleConfirm}>Confirm</AlertDialogAction>
				</AlertDialogFooter>
			</AlertDialogContent>
		</AlertDialog>
	)

	return [ConfirmDialog, confirm]
}
