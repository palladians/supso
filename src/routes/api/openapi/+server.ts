import type { RequestHandler } from './$types';
import swaggerJsdoc from 'swagger-jsdoc';

const options = {
	definition: {
		openapi: '3.0.0',
		info: {
			title: 'Supso',
			version: '1.0.0'
		}
	},
	apis: ['src/routes/api/**/+server.ts']
};

export const GET: RequestHandler = async () => {
	const openapiSpecification = swaggerJsdoc(options);
	return Response.json(openapiSpecification);
};
