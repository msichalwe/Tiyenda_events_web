const { PrismaClient } = require('@prisma/client')

const db = new PrismaClient()

async function main() {
	// categories for events
	try {
		await db.category.createMany({
			data: [
				{
					name: 'Food',
				},
				{
					name: 'Music',
				},
				{
					name: 'Business',
				},
				{
					name: 'Art',
				},
				{
					name: 'Film',
				},
				{
					name: 'Science & Tech',
				},
				{
					name: 'Sports & Fitness',
				},
				{
					name: 'Health',
				},
				{
					name: 'Travel & Outdoor',
				},
				{
					name: 'Charity & Causes',
				},
				{
					name: 'Spirituality',
				},
				{
					name: 'Family & Education',
				},
				{
					name: 'Holiday',
				},
				{
					name: 'Government',
				},
				{
					name: 'Fashion',
				},
				{
					name: 'Home & Lifestyle',
				},
				{
					name: 'Auto, Boat & Air',
				},
				{
					name: 'Hobbies',
				},
				{
					name: 'School Activities',
				},
				{
					name: 'Other',
				},
			],
		})

		console.log('Categories seeded')
	} catch (error) {
		console.log('Error seeding database: ', error)
	} finally {
		await db.$disconnect()
	}
}

main()
