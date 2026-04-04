import { Request, Response, NextFunction } from "express";

const USDA_KEY = process.env.USDA_API_KEY!;
const USDA_URL = "https://api.nal.usda.gov/fdc/v1/foods/search";

/**
 * GET /api/v1/nutrition/food-search?q=chicken
 * Proxies the USDA FoodData Central API so the API key is never exposed
 * to the browser client.
 */
export const foodSearch = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const q = (req.query.q as string)?.trim();
    if (!q) {
      return res.status(400).json({ message: "Query param ?q is required." });
    }

    const upstream = await fetch(
      `${USDA_URL}?query=${encodeURIComponent(q)}&api_key=${USDA_KEY}`,
    );

    if (!upstream.ok) {
      return res
        .status(502)
        .json({ message: "USDA API unavailable. Try again later." });
    }

    const data = await upstream.json();

    const results = (data.foods ?? []).slice(0, 6).map((food: any) => {
      const nutrients = food.foodNutrients ?? [];
      const get = (name: string) =>
        nutrients.find((n: any) => n.nutrientName === name)?.value ?? 0;

      return {
        name: food.description,
        baseQty: food.servingSize ?? 100,
        calories: get("Energy"),
        protein: get("Protein"),
        carbs: get("Carbohydrate, by difference"),
        fats: get("Total lipid (fat)"),
      };
    });

    res.json({ results });
  } catch (err) {
    next(err);
  }
};
