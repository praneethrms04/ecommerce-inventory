import mongoose from "mongoose";
import app from "./app";
import config from "./app/config";

async function main() {
	await mongoose.connect(config.db_url as string);

	app.listen(config.port, () => {
		console.log(`Ecommerce Inventory Server listening on ${config.port}`);
	});
}

main()
	.then(() => {
		console.log("mongodb connected successfully");
	})
	.catch((err) => console.log(err));
