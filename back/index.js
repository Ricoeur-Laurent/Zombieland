import cors from "cors";
import dotenv from "dotenv";
import express from "express";
import router from "./src/routers/router.js";

const app = express();

const corsOptions = {
	origin: [
		`${process.env.BASE_URL}:3001`,
		`${process.env.BASE_URL}:3000`,
		`${process.env.BASE_URL}`,
	],
	methods: ["GET", "POST", "PATCH", "DELETE", "PUT"],
};
app.use(cors(corsOptions));

dotenv.config();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(router);
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
	console.log(`Server running on http://localhost:${PORT}`);
});
