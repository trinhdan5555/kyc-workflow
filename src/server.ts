import express from "express";
import routes from "./routes";

const app = express();

app.use(express.json());

app.use(routes);

app.get("/health", (_, res) => {
  res.json({ status: "ok" });
});

app.listen(3000, () => {
  console.log("Server running on port 3000");
})

export default app;
