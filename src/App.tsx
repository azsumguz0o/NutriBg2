import React, { useEffect, useMemo, useRef, useState } from "react";
import { Apple, Search, Sparkles, Wifi, WifiOff } from "lucide-react";

const STORAGE_KEYS = {
  products: "nutrition_app_products_v6",
  tracker: "nutrition_app_tracker_v6",
};

type Product = {
  barcode: string;
  name: string;
  brand?: string;
  caloriesPer100g: number;
  proteinPer100g: number;
  carbsPer100g: number;
  fatPer100g: number;
  fiberPer100g: number;
  sugarPer100g: number;
  notes?: string;
  nutritionGrade?: string;
  nutrition_grades?: string;
};

type TrackerEntry = {
  id: string;
  name: string;
  calories: number;
  time: string;
};

const SAMPLE_PRODUCTS: Product[] = [
  { barcode: "5449000000996", name: "Coca-Cola Original Taste 330ml", brand: "Coca-Cola", caloriesPer100g: 42, proteinPer100g: 0, carbsPer100g: 10.6, fatPer100g: 0, fiberPer100g: 0, sugarPer100g: 10.6, notes: "Carbonated soft drink" },
  { barcode: "5000159457236", name: "Snickers Bar 50g", brand: "Snickers", caloriesPer100g: 488, proteinPer100g: 8.4, carbsPer100g: 61.5, fatPer100g: 23.7, fiberPer100g: 2.2, sugarPer100g: 49.2, notes: "Chocolate bar" },
  { barcode: "3800200641990", name: "Greek Yogurt 2%", brand: "Sample Dairy", caloriesPer100g: 73, proteinPer100g: 9.0, carbsPer100g: 3.6, fatPer100g: 2.0, fiberPer100g: 0, sugarPer100g: 3.6, notes: "High protein dairy" },
  { barcode: "5449000133324", name: "Monster Ultra White", brand: "Monster Energy", caloriesPer100g: 4, proteinPer100g: 0, carbsPer100g: 1.0, fatPer100g: 0, fiberPer100g: 0, sugarPer100g: 0, notes: "Sugar-free energy drink" },
  { barcode: "5060767270274", name: "Monster Ultra Rosa", brand: "Monster Energy", caloriesPer100g: 4, proteinPer100g: 0, carbsPer100g: 1.0, fatPer100g: 0, fiberPer100g: 0, sugarPer100g: 0, notes: "Sugar-free energy drink" },
  { barcode: "5060767270014", name: "Monster Full Throttle", brand: "Monster Energy", caloriesPer100g: 45, proteinPer100g: 0, carbsPer100g: 11.0, fatPer100g: 0, fiberPer100g: 0, sugarPer100g: 11.0, notes: "Citrus energy drink" },
  { barcode: "4012852026400", name: "Rice Cakes", brand: "Sample Snack", caloriesPer100g: 387, proteinPer100g: 8.0, carbsPer100g: 81.0, fatPer100g: 2.8, fiberPer100g: 3.0, sugarPer100g: 0.9, notes: "Light crisp snack" },
  { barcode: "0000000000101", name: "Banana", brand: "Fresh Fruit", caloriesPer100g: 89, proteinPer100g: 1.1, carbsPer100g: 22.8, fatPer100g: 0.3, fiberPer100g: 2.6, sugarPer100g: 12.2, notes: "Fresh fruit" },
  { barcode: "0000000000102", name: "Egg", brand: "Fresh Food", caloriesPer100g: 155, proteinPer100g: 13.0, carbsPer100g: 1.1, fatPer100g: 11.0, fiberPer100g: 0, sugarPer100g: 1.1, notes: "Whole egg" },
  { barcode: "0000000000103", name: "Rice (cooked)", brand: "Fresh Food", caloriesPer100g: 130, proteinPer100g: 2.7, carbsPer100g: 28.0, fatPer100g: 0.3, fiberPer100g: 0.4, sugarPer100g: 0.1, notes: "Cooked white rice" },
  { barcode: "0000000000104", name: "Bread Slice", brand: "Fresh Bakery", caloriesPer100g: 265, proteinPer100g: 9.0, carbsPer100g: 49.0, fatPer100g: 3.2, fiberPer100g: 2.7, sugarPer100g: 5.0, notes: "One bread slice equivalent" },
  { barcode: "0000000000105", name: "Apple", brand: "Fresh Fruit", caloriesPer100g: 52, proteinPer100g: 0.3, carbsPer100g: 13.8, fatPer100g: 0.2, fiberPer100g: 2.4, sugarPer100g: 10.4, notes: "Fresh fruit" },
  { barcode: "0000000000106", name: "Orange", brand: "Fresh Fruit", caloriesPer100g: 47, proteinPer100g: 0.9, carbsPer100g: 11.8, fatPer100g: 0.1, fiberPer100g: 2.4, sugarPer100g: 9.4, notes: "Fresh fruit" },
  { barcode: "0000000000107", name: "Chicken Breast", brand: "Fresh Meat", caloriesPer100g: 165, proteinPer100g: 31.0, carbsPer100g: 0, fatPer100g: 3.6, fiberPer100g: 0, sugarPer100g: 0, notes: "Cooked chicken breast" },
  { barcode: "0000000000108", name: "Milk", brand: "Fresh Dairy", caloriesPer100g: 61, proteinPer100g: 3.2, carbsPer100g: 4.8, fatPer100g: 3.3, fiberPer100g: 0, sugarPer100g: 4.8, notes: "Whole milk" },
  { barcode: "0000000000109", name: "Yogurt", brand: "Fresh Dairy", caloriesPer100g: 59, proteinPer100g: 10.0, carbsPer100g: 3.6, fatPer100g: 0.4, fiberPer100g: 0, sugarPer100g: 3.6, notes: "Plain yogurt" },
  { barcode: "0000000000110", name: "Protein Pudding", brand: "Sample Protein", caloriesPer100g: 88, proteinPer100g: 10.0, carbsPer100g: 7.0, fatPer100g: 2.0, fiberPer100g: 0, sugarPer100g: 4.0, notes: "High protein dessert" },
  { barcode: "0000000000111", name: "Chocolate Bar", brand: "Sample Chocolate", caloriesPer100g: 535, proteinPer100g: 7.0, carbsPer100g: 56.0, fatPer100g: 31.0, fiberPer100g: 3.0, sugarPer100g: 53.0, notes: "Classic chocolate bar" },
  { barcode: "0000000000112", name: "Cookies", brand: "Sample Bakery", caloriesPer100g: 460, proteinPer100g: 6.0, carbsPer100g: 66.0, fatPer100g: 19.0, fiberPer100g: 3.0, sugarPer100g: 28.0, notes: "Sweet baked snack" },
  { barcode: "0000000000113", name: "Chips", brand: "Sample Snacks", caloriesPer100g: 536, proteinPer100g: 7.0, carbsPer100g: 52.0, fatPer100g: 34.0, fiberPer100g: 4.0, sugarPer100g: 1.0, notes: "Salty snack" },
  { barcode: "0000000000114", name: "Pizza Slice", brand: "Sample Food", caloriesPer100g: 266, proteinPer100g: 11.0, carbsPer100g: 33.0, fatPer100g: 10.0, fiberPer100g: 2.3, sugarPer100g: 3.6, notes: "Cheese pizza slice" },
  { barcode: "0000000000115", name: "Burger", brand: "Sample Food", caloriesPer100g: 295, proteinPer100g: 17.0, carbsPer100g: 29.0, fatPer100g: 12.0, fiberPer100g: 1.6, sugarPer100g: 5.0, notes: "Beef burger" },
  { barcode: "0000000000116", name: "Fries", brand: "Sample Food", caloriesPer100g: 312, proteinPer100g: 3.4, carbsPer100g: 41.0, fatPer100g: 15.0, fiberPer100g: 3.8, sugarPer100g: 0.3, notes: "French fries" },
  { barcode: "0000000000117", name: "Cereal", brand: "Sample Breakfast", caloriesPer100g: 378, proteinPer100g: 8.0, carbsPer100g: 84.0, fatPer100g: 2.0, fiberPer100g: 6.0, sugarPer100g: 20.0, notes: "Breakfast cereal" },
  { barcode: "0000000000118", name: "Pasta", brand: "Sample Pantry", caloriesPer100g: 131, proteinPer100g: 5.0, carbsPer100g: 25.0, fatPer100g: 1.1, fiberPer100g: 1.8, sugarPer100g: 0.6, notes: "Cooked pasta" },
  { barcode: "0000000000119", name: "Cheese", brand: "Sample Dairy", caloriesPer100g: 402, proteinPer100g: 25.0, carbsPer100g: 1.3, fatPer100g: 33.0, fiberPer100g: 0, sugarPer100g: 0.5, notes: "Cheddar style cheese" },
  { barcode: "0000000000120", name: "Ham", brand: "Sample Meat", caloriesPer100g: 145, proteinPer100g: 20.9, carbsPer100g: 1.5, fatPer100g: 6.0, fiberPer100g: 0, sugarPer100g: 1.0, notes: "Cold cut ham" },
];

const OFFLINE_HELPER = [
  { keys: ["banana", "bananas", "банан", "банани"], name: "Banana", calories: 105, protein: 1.3, source: "1 medium banana" },
  { keys: ["egg", "eggs", "яйце", "яйца"], name: "Egg", calories: 72, protein: 6.3, source: "1 large egg" },
  { keys: ["apple", "apples", "ябълка", "ябълки"], name: "Apple", calories: 95, protein: 0.5, source: "1 medium apple" },
  { keys: ["milk", "мляко"], name: "Milk", calories: 122, protein: 8, source: "1 cup (250 ml) milk" },
  { keys: ["rice", "ориз"], name: "Rice", calories: 205, protein: 4.3, source: "1 cup cooked rice" },
  { keys: ["chicken", "пиле"], name: "Chicken breast", calories: 165, protein: 31, source: "100 g cooked chicken breast" },
  { keys: ["yogurt", "кисело мляко"], name: "Yogurt", calories: 100, protein: 8, source: "1 small serving" },
  { keys: ["bread", "хляб"], name: "Bread slice", calories: 80, protein: 3, source: "1 slice bread" },
  { keys: ["potato", "картоф"], name: "Potato", calories: 161, protein: 4, source: "1 medium baked potato" },
  { keys: ["orange", "портокал"], name: "Orange", calories: 62, protein: 1.2, source: "1 medium orange" },
  { keys: ["rice cake", "rice cakes", "оризовки"], name: "Rice cakes", calories: 35, protein: 0.7, source: "1 rice cake" },
  { keys: ["monster", "white monster", "monster ultra white", "ultra white", "бял monster", "бял монстър"], name: "Monster Ultra White", calories: 10, protein: 0, source: "1 can" },
  { keys: ["pink monster", "monster ultra rosa", "ultra rosa", "pink ultra", "розов monster", "розов монстър"], name: "Monster Ultra Rosa", calories: 10, protein: 0, source: "1 can" },
  { keys: ["full throttle", "фул тротъл"], name: "Monster Full Throttle", calories: 190, protein: 0, source: "1 can" },
  { keys: ["banitsa", "banitza", "баница"], name: "Banitsa", calories: 320, protein: 9, source: "1 piece banitsa" },
  { keys: ["boza", "боза"], name: "Boza", calories: 60, protein: 1, source: "1 cup boza" },
  { keys: ["ayran", "airan", "айрян"], name: "Ayran", calories: 40, protein: 2.5, source: "1 cup ayran" },
  { keys: ["salty sticks", "солети", "pretzels"], name: "Salty sticks", calories: 430, protein: 10, source: "100 g" },
  { keys: ["muffin", "muffins", "мафини"], name: "Muffin", calories: 370, protein: 5, source: "1 muffin" },
  { keys: ["croissant", "кроасан"], name: "Croissant", calories: 406, protein: 8, source: "1 croissant" },
  { keys: ["kifla", "кифла"], name: "Kifla", calories: 290, protein: 8, source: "1 kifla" },
  { keys: ["water"], name: "Water", calories: 0, protein: 0, source: "0 kcal" },
];

const EMPTY_PRODUCT = { barcode: "", name: "", brand: "", caloriesPer100g: "", proteinPer100g: "", carbsPer100g: "", fatPer100g: "", fiberPer100g: "", sugarPer100g: "", notes: "" };
const NUMBER_WORDS: Record<string, number> = { one: 1, two: 2, three: 3, four: 4, five: 5, six: 6, seven: 7, eight: 8, nine: 9, ten: 10, half: 0.5 };

function normalizeText(value: string) {
  return String(value || "")
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9а-яёіїъь\s]/gi, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function tokenSet(value: string) {
  return new Set(normalizeText(value).split(" ").filter(Boolean));
}

function overlapScore(a: string, b: string) {
  const ta = tokenSet(a);
  const tb = tokenSet(b);
  let shared = 0;
  ta.forEach((t) => {
    if (tb.has(t)) shared += 1;
  });
  return shared / Math.max(ta.size, tb.size, 1);
}

function nutritionRating(product: Product) {
  const gradeRaw = String(product.nutritionGrade || product.nutrition_grades || "").trim().toLowerCase();
  const grade = gradeRaw ? gradeRaw[0] : "";
  if (grade === "a") return { letter: "A", className: "bg-green-500 text-black" };
  if (grade === "b") return { letter: "B", className: "bg-green-800 text-white" };
  if (grade === "c") return { letter: "C", className: "bg-yellow-400 text-black" };
  if (grade === "d") return { letter: "D", className: "bg-red-900 text-white" };
  if (grade === "e") return { letter: "E", className: "bg-red-500 text-white" };

  const name = normalizeText(product.name);
  if (name.includes("monster ultra white") || name.includes("monster ultra rosa") || name.includes("monster ultra rose")) {
    return { letter: "C", className: "bg-yellow-400 text-black" };
  }
  if (name.includes("monster") && product.caloriesPer100g <= 15 && product.sugarPer100g <= 2) {
    return { letter: "C", className: "bg-yellow-400 text-black" };
  }

  let score = 0;
  score += product.proteinPer100g * 1.15;
  score += product.fiberPer100g * 0.9;
  score -= product.caloriesPer100g / 65;
  score -= product.sugarPer100g / 8;
  score -= product.fatPer100g / 22;

  if (score >= 12) return { letter: "A", className: "bg-green-500 text-black" };
  if (score >= 7) return { letter: "B", className: "bg-green-800 text-white" };
  if (score >= 2) return { letter: "C", className: "bg-yellow-400 text-black" };
  if (score >= -3) return { letter: "D", className: "bg-red-900 text-white" };
  return { letter: "E", className: "bg-red-500 text-white" };
}

function ringColor(progress: number) {
  if (progress < 50) return "#22c55e";
  if (progress < 80) return "#eab308";
  return "#ef4444";
}

function guessAmount(query: string) {
  const normalized = normalizeText(query);
  const numeric = normalized.match(/\b(\d+(?:[.,]\d+)?)\b/);
  if (numeric) return Number(numeric[1].replace(",", "."));
  const word = Object.entries(NUMBER_WORDS).find(([k]) => normalized.includes(` ${k} `) || normalized.startsWith(`${k} `) || normalized.endsWith(` ${k}`));
  if (word) return word[1];
  if (/\b(double|two)\b/.test(normalized)) return 2;
  return 1;
}

function detectUnitMultiplier(query: string) {
  const q = normalizeText(query);
  if (/\b(can|cans|bottle|bottles|pack|packs|packet|packets|slice|slices|egg|eggs|banana|bananas)\b/.test(q)) return 1;
  return 1;
}

function findBestOfflineMatch(query: string, items: Array<any>) {
  const q = normalizeText(query);
  let best = null;
  let bestScore = 0;
  for (const item of items) {
    const candidateNames = [item.name, item.brand, ...(item.keys || [])];
    for (const candidate of candidateNames) {
      const cand = normalizeText(candidate);
      let score = 0;
      if (cand === q) score = 1;
      else if (q.includes(cand) || cand.includes(q)) score = 0.95;
      else score = overlapScore(q, cand);
      if (score > bestScore) {
        bestScore = score;
        best = item;
      }
    }
  }
  return bestScore >= 0.25 ? best : null;
}

export default function App() {
  const [catalog, setCatalog] = useState<Product[]>([]);
  const [tracker, setTracker] = useState<{ target: number; entries: TrackerEntry[] }>(() =>
    JSON.parse(localStorage.getItem(STORAGE_KEYS.tracker) || '{"target":2200,"entries":[]}')
  );
  const [message, setMessage] = useState("Ready to scan.");
  const [manualBarcode, setManualBarcode] = useState("");
  const [productForm, setProductForm] = useState(EMPTY_PRODUCT);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [showAddPrompt, setShowAddPrompt] = useState(false);
  const [mealCalories, setMealCalories] = useState("");
  const [mealName, setMealName] = useState("");
  const [search, setSearch] = useState("");
  const [cameraOn, setCameraOn] = useState(false);
  const [scanError, setScanError] = useState("");
  const [foodQuery, setFoodQuery] = useState("");
  const [foodResult, setFoodResult] = useState<any>(null);
  const [aiReply, setAiReply] = useState("");
  const [activeSaved, setActiveSaved] = useState<string | null>(null);
  const [isOnline, setIsOnline] = useState(typeof navigator !== "undefined" ? navigator.onLine : false);
  const [lookupBusy, setLookupBusy] = useState(false);
  const [quickTips, setQuickTips] = useState<string[]>([]);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const rafRef = useRef<number | null>(null);
  const lastScanRef = useRef("");

  useEffect(() => {
    const stored = JSON.parse(localStorage.getItem(STORAGE_KEYS.products) || "[]");
    const merged = [...SAMPLE_PRODUCTS, ...stored];
    const unique = Array.from(new Map(merged.map((item) => [item.barcode, item])).values());
    setCatalog(unique);
  }, []);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.products, JSON.stringify(catalog.filter((p) => !SAMPLE_PRODUCTS.some((s) => s.barcode === p.barcode))));
  }, [catalog]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.tracker, JSON.stringify(tracker));
  }, [tracker]);

  useEffect(() => {
    const on = () => setIsOnline(true);
    const off = () => setIsOnline(false);
    window.addEventListener("online", on);
    window.addEventListener("offline", off);
    setIsOnline(navigator.onLine);
    return () => {
      window.removeEventListener("online", on);
      window.removeEventListener("offline", off);
    };
  }, []);

  useEffect(() => {
    const q = normalizeText(foodQuery);
    if (!q) {
      setQuickTips([]);
      return;
    }
    const matches = OFFLINE_HELPER.filter((item) => item.keys.some((k) => normalizeText(k).includes(q) || q.includes(normalizeText(k)))).slice(0, 4);
    setQuickTips(matches.map((m) => m.name));
  }, [foodQuery]);

  const totalCalories = useMemo(() => tracker.entries.reduce((sum, item) => sum + Number(item.calories), 0), [tracker.entries]);
  const progress = Math.min(100, (totalCalories / Math.max(1, Number(tracker.target))) * 100);
  const remaining = Math.max(0, Number(tracker.target) - totalCalories);
  const ringDash = 2 * Math.PI * 54;
  const ringOffset = ringDash - (progress / 100) * ringDash;
  const currentRingColor = ringColor(progress);

  const filteredCatalog = useMemo(() => {
    const q = normalizeText(search);
    if (!q) return catalog;
    return catalog.filter((p) => normalizeText([p.name, p.brand, p.barcode, p.notes].join(" ")).includes(q));
  }, [catalog, search]);

  const addEntry = (name: string, calories: number) => {
    setTracker((prev) => ({
      ...prev,
      entries: [
        { id: Date.now().toString(), name, calories, time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }) },
        ...prev.entries,
      ],
    }));
  };

  const fetchOpenFoodFactsProduct = async (barcode: string) => {
    const url = `https://world.openfoodfacts.org/api/v2/product/${encodeURIComponent(barcode)}.json?fields=code,product_name,brands,nutriments,nutrition_grades,ingredients_text,quantity,serving_size`;
    const res = await fetch(url);
    if (!res.ok) throw new Error("Open Food Facts request failed");
    const data = await res.json();
    const p = data?.product;
    if (!p) return null;
    return {
      barcode: String(p.code || barcode),
      name: p.product_name || "Unknown product",
      brand: p.brands || "",
      caloriesPer100g: Number(p?.nutriments?.["energy-kcal_100g"] ?? p?.nutriments?.["energy-kcal"] ?? 0),
      proteinPer100g: Number(p?.nutriments?.proteins_100g ?? 0),
      carbsPer100g: Number(p?.nutriments?.carbohydrates_100g ?? 0),
      fatPer100g: Number(p?.nutriments?.fat_100g ?? 0),
      fiberPer100g: Number(p?.nutriments?.fiber_100g ?? 0),
      sugarPer100g: Number(p?.nutriments?.sugars_100g ?? 0),
      notes: [p.ingredients_text, p.quantity, p.serving_size, p.nutrition_grades ? `Nutri-Score: ${String(p.nutrition_grades).toUpperCase()}` : null].filter(Boolean).join(" • ") || "Live web result from Open Food Facts.",
      nutrition_grades: p.nutrition_grades,
      nutritionGrade: p.nutrition_grades,
    };
  };

  const searchOpenFoodFactsByName = async (query: string) => {
    const url = `https://world.openfoodfacts.org/api/v2/search?search_terms=${encodeURIComponent(query)}&page_size=3&fields=code,product_name,brands,nutriments,nutrition_grades,ingredients_text,quantity,serving_size`;
    const res = await fetch(url);
    if (!res.ok) throw new Error("Open Food Facts search failed");
    const data = await res.json();
    const products = Array.isArray(data?.products) ? data.products : [];
    const pick = products[0];
    if (!pick) return null;
    return {
      barcode: String(pick.code || "").trim(),
      name: pick.product_name || query,
      brand: pick.brands || "",
      caloriesPer100g: Number(pick?.nutriments?.["energy-kcal_100g"] ?? pick?.nutriments?.["energy-kcal"] ?? 0),
      proteinPer100g: Number(pick?.nutriments?.proteins_100g ?? 0),
      carbsPer100g: Number(pick?.nutriments?.carbohydrates_100g ?? 0),
      fatPer100g: Number(pick?.nutriments?.fat_100g ?? 0),
      fiberPer100g: Number(pick?.nutriments?.fiber_100g ?? 0),
      sugarPer100g: Number(pick?.nutriments?.sugars_100g ?? 0),
      notes: [pick.ingredients_text, pick.quantity, pick.serving_size, pick.nutrition_grades ? `Nutri-Score: ${String(pick.nutrition_grades).toUpperCase()}` : null].filter(Boolean).join(" • ") || "Live web result from Open Food Facts.",
      nutrition_grades: pick.nutrition_grades,
      nutritionGrade: pick.nutrition_grades,
    };
  };

  const addLiveOrLocalProduct = async (barcode: string) => {
    if (!barcode || barcode === lastScanRef.current) return;
    lastScanRef.current = barcode;
    setManualBarcode(barcode);
    setLookupBusy(true);
    try {
      let product = catalog.find((p) => p.barcode === barcode) || null;
      if (isOnline) {
        const live = await
