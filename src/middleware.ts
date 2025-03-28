import {
	convexAuthNextjsMiddleware,
	createRouteMatcher,
	nextjsMiddlewareRedirect,
} from '@convex-dev/auth/nextjs/server'

const isPublicPage = createRouteMatcher(['/auth'])

export default convexAuthNextjsMiddleware(async (request, { convexAuth }) => {
	if (!isPublicPage(request) && !(await convexAuth.isAuthenticated())) {
		return nextjsMiddlewareRedirect(request, '/auth')
	}

	if (isPublicPage(request) && (await convexAuth.isAuthenticated())) {
		return nextjsMiddlewareRedirect(request, '/')
	}

	//TODO: redirect user away from '/auth' if authenticated
})

export const config = { matcher: ['/((?!.*\\..*|_next).*)', '/', '/(api|trpc)(.*)'] }
