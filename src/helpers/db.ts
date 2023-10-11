import { Schema } from "mongoose";
import { ModelProduct } from "../models/index.js";

export async function calculateTotalImport(
	productsWithQuantity: Array<{
		productId: Schema.Types.ObjectId;
		quantity: number;
	}>,
) {
	try {
		const productIds = productsWithQuantity.map((product) => product.productId);

		// Find the products in the database based on their IDs
		const products = await ModelProduct.find({ _id: { $in: productIds } });

		// Calculate the total cost and update the available quantity
		let totalCost = 0;

		for (const productWithQuantity of productsWithQuantity) {
			const product = products.find(
				(p) => p._id.toString() === productWithQuantity.productId.toString(),
			);

			if (product) {
				const quantity = productWithQuantity.quantity;
				totalCost += product.price * quantity;

				// Update the available quantity
				product.aviableQuantity -= quantity;
				await product.save();
			}
		}

		return totalCost;
	} catch (error) {
		console.error(
			"Error updating available quantity and calculating total cost:",
			error,
		);
		throw error;
	}
}
