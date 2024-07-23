import { createSwaggerSpec } from 'next-swagger-doc'

export const getApiDoc = async () => {
	const spec = createSwaggerSpec({
		apiFolder: 'app/api',
		definition: {
			openapi: '3.0.0',
			info: {
				title: 'Tiyenda API Documentation ',
				version: '1.0',
			},

			security: [],
		},
	})
	return spec
}
