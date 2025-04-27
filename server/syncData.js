import fetch from "node-fetch";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { dirname } from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const externalApiUrl = "https://dummyjson.com/products";

async function syncData() {
  try {
    const response = await fetch(externalApiUrl);
    if (!response.ok) {
      throw new Error("Network response was not ok");
    }

    const data = await response.json();
    const products = data.products;

    // Group by category
    const grouped = {};
    products.forEach(item => {
      if (!grouped[item.category]) {
        grouped[item.category] = [];
      }
      grouped[item.category].push(item);
    });

    const dbPath = path.join(__dirname, "db.json");
    fs.writeFileSync(dbPath, JSON.stringify(grouped, null, 2));
    console.log("✅ Data synced and saved in db.json");
  } catch (error) {
    console.error("❌ Error syncing data:", error);
  }
}

syncData();
