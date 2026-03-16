import "dotenv/config";
import app from "./config/app";

const PORT = process.env.PORT ?? 5000;

app.listen(PORT, () => {
  console.log(`Backend running at http://localhost:${PORT}`);
});
