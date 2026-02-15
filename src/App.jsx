import { useState, useEffect, useCallback, useMemo, createContext, useContext } from "react";
import { loadPlants, savePlants, isConfigured } from "./storage.js";

// ===== TRANSLATION SYSTEM =====
const translations = {
  en: {
    // Header
    appTitle: "🌿 Garden Journal",
    subtitle: "Track your plantings, seasons & blooms",
    syncing: "⟳ syncing...",
    shared: "☁️ shared",
    dashboard: "📊 Dashboard",
    managePlants: "🌱 Manage Plants",

    // Filters
    year: "Year",
    section: "Section",
    allSections: "All Sections",
    addPlant: "+ Add Plant",

    // Dashboard summary cards
    totalPlants: "Total Plants",
    bloomingNow: "Blooming Now",
    bloomSoon: "Bloom Soon",
    season: "Season",
    spring: "Spring",
    summer: "Summer",
    autumn: "Autumn",
    winter: "Winter",

    // Monthly chart
    monthlyActivity: "Monthly Planting Activity",

    // Section overview
    plants: "plants",
    plant: "plant",
    noPlantsInYear: "No plants in",

    // Month detail
    detail: "Detail",
    expectedBloom: "🌸 Expected to bloom in",
    noPlantedIn: "No plants were planted in",

    // Status labels
    bloomingNowLabel: "Blooming Now",
    bloomSoonLabel: "Bloom Soon",
    dormant: "Dormant",
    unknown: "Unknown",

    // Plant info
    planted: "Planted",
    blooms: "Blooms",
    zone: "Zone",
    water: "Water",

    // Manage view
    editPlant: "✏️ Edit Plant",
    addNewPlant: "🌱 Add New Plant",
    plantName: "Plant Name",
    selectPlant: "Select a plant...",
    customName: "Custom Name",
    enterPlantName: "Enter plant name...",
    datePlanted: "Date Planted",
    notes: "Notes",
    notesPlaceholder: "Any notes about this planting...",
    bloomInfo: "📖 Bloom Information",
    updatePlant: "Update Plant",
    savePlant: "Save Plant",
    cancel: "Cancel",
    allPlants: "🌱 All Plants",
    noPlantsRecorded: "No plants recorded yet",
    clickAddPlant: 'Click "+ Add Plant" to start tracking your garden',
    edit: "Edit",
    delete: "Delete",
    confirm: "Confirm",
    no: "No",
    resetAllData: "Reset All Data",
    resetConfirm: "Are you sure you want to delete ALL plant data? This cannot be undone.",
    allDataCleared: "All data cleared.",
    plantUpdated: "Plant updated!",
    plantAdded: "Plant added!",
    plantRemoved: "Plant removed.",
    fillRequired: "Please fill in plant name and date planted.",
    loading: "Loading your garden...",

    // Setup banner
    setupTitle: "⚙️ Setup Required — JSONBin API Key",
    setupText: "To enable shared data between devices:",
    setupStep1: "Go to",
    setupStep1b: "and create a free account",
    setupStep2: "Copy your",
    setupStep2b: "from the API Keys page",
    setupStep3: "Open",
    setupStep3b: "and paste it in the API_KEY field",
    setupStep4: "Rebuild and deploy",
    setupNote: "Until configured, data saves locally in this browser only.",

    // Months
    months: ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"],
    fullMonths: ["January","February","March","April","May","June","July","August","September","October","November","December"],

    // Sections
    sections: ["Section A", "Section B", "Section C", "Section D"],
  },
  ja: {
    // Header
    appTitle: "🌿 ガーデンジャーナル",
    subtitle: "植栽・季節・開花を記録",
    syncing: "⟳ 同期中...",
    shared: "☁️ 共有",
    dashboard: "📊 ダッシュボード",
    managePlants: "🌱 植物管理",

    // Filters
    year: "年",
    section: "区画",
    allSections: "全区画",
    addPlant: "+ 植物を追加",

    // Dashboard summary cards
    totalPlants: "植物の総数",
    bloomingNow: "開花中",
    bloomSoon: "もうすぐ開花",
    season: "季節",
    spring: "春",
    summer: "夏",
    autumn: "秋",
    winter: "冬",

    // Monthly chart
    monthlyActivity: "月別の植栽状況",

    // Section overview
    plants: "本",
    plant: "本",
    noPlantsInYear: "の植物はありません",

    // Month detail
    detail: "の詳細",
    expectedBloom: "🌸 開花予定：",
    noPlantedIn: "に植えた植物はありません",

    // Status labels
    bloomingNowLabel: "開花中",
    bloomSoonLabel: "もうすぐ開花",
    dormant: "休眠中",
    unknown: "不明",

    // Plant info
    planted: "植栽日",
    blooms: "開花期",
    zone: "耐寒ゾーン",
    water: "水やり",

    // Manage view
    editPlant: "✏️ 植物を編集",
    addNewPlant: "🌱 新しい植物を追加",
    plantName: "植物名",
    selectPlant: "植物を選択...",
    customName: "カスタム名",
    enterPlantName: "植物名を入力...",
    datePlanted: "植栽日",
    notes: "メモ",
    notesPlaceholder: "この植栽に関するメモ...",
    bloomInfo: "📖 開花情報",
    updatePlant: "更新する",
    savePlant: "保存する",
    cancel: "キャンセル",
    allPlants: "🌱 全ての植物",
    noPlantsRecorded: "まだ植物が登録されていません",
    clickAddPlant: "「+ 植物を追加」をクリックして記録を始めましょう",
    edit: "編集",
    delete: "削除",
    confirm: "確認",
    no: "いいえ",
    resetAllData: "全データをリセット",
    resetConfirm: "全ての植物データを削除しますか？この操作は取り消せません。",
    allDataCleared: "全データを削除しました。",
    plantUpdated: "植物を更新しました！",
    plantAdded: "植物を追加しました！",
    plantRemoved: "植物を削除しました。",
    fillRequired: "植物名と植栽日を入力してください。",
    loading: "ガーデンを読み込み中...",

    // Setup banner
    setupTitle: "⚙️ 設定が必要です — JSONBin APIキー",
    setupText: "デバイス間でデータを共有するには：",
    setupStep1: "",
    setupStep1b: "にアクセスして無料アカウントを作成",
    setupStep2: "APIキーページから",
    setupStep2b: "をコピー",
    setupStep3: "",
    setupStep3b: "を開いてAPI_KEYフィールドに貼り付け",
    setupStep4: "再ビルドしてデプロイ",
    setupNote: "設定するまで、データはこのブラウザにのみ保存されます。",

    // Months
    months: ["1月","2月","3月","4月","5月","6月","7月","8月","9月","10月","11月","12月"],
    fullMonths: ["1月","2月","3月","4月","5月","6月","7月","8月","9月","10月","11月","12月"],

    // Sections
    sections: ["区画 A", "区画 B", "区画 C", "区画 D"],
  }
};

const LangContext = createContext({ lang: "en", t: translations.en, setLang: () => {} });
function useLang() { return useContext(LangContext); }

// ===== CONSTANTS =====
const SECTIONS = ["Section A", "Section B", "Section C", "Section D"];
const MONTHS = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];

const BLOOM_DATA = {
  "Rose": { bloomMonths: [5,6,7,8,9], zone: "3-11", sun: "Full Sun", sunJa: "日なた", water: "Moderate", waterJa: "普通", tip: "Prune in late winter. Deadhead spent blooms for continuous flowering.", tipJa: "冬の終わりに剪定。咲き終わった花を摘むと次々と咲きます。" },
  "Tulip": { bloomMonths: [3,4,5], zone: "3-8", sun: "Full Sun", sunJa: "日なた", water: "Moderate", waterJa: "普通", tip: "Plant bulbs in fall, 6-8 inches deep. Let foliage die back naturally.", tipJa: "秋に球根を15-20cm深く植えます。葉は自然に枯れるまで残しましょう。" },
  "Lavender": { bloomMonths: [5,6,7,8], zone: "5-9", sun: "Full Sun", sunJa: "日なた", water: "Low", waterJa: "少なめ", tip: "Thrives in well-drained soil. Prune after flowering to maintain shape.", tipJa: "水はけの良い土壌を好みます。開花後に剪定して形を整えましょう。" },
  "Sunflower": { bloomMonths: [6,7,8,9], zone: "2-11", sun: "Full Sun", sunJa: "日なた", water: "Moderate", waterJa: "普通", tip: "Direct sow after last frost. Stake tall varieties.", tipJa: "最後の霜の後に直まき。背の高い品種は支柱を立てましょう。" },
  "Daffodil": { bloomMonths: [2,3,4], zone: "3-9", sun: "Full/Partial Sun", sunJa: "日なた/半日陰", water: "Moderate", waterJa: "普通", tip: "Plant bulbs in fall. Naturalizes well — leave undisturbed.", tipJa: "秋に球根を植えます。自然に増えるので、そのままにしておきましょう。" },
  "Hydrangea": { bloomMonths: [5,6,7,8,9], zone: "3-9", sun: "Partial Sun", sunJa: "半日陰", water: "High", waterJa: "多め", tip: "Soil pH affects color: acidic = blue, alkaline = pink.", tipJa: "土壌のpHで色が変わります：酸性＝青、アルカリ性＝ピンク。" },
  "Peony": { bloomMonths: [4,5,6], zone: "3-8", sun: "Full Sun", sunJa: "日なた", water: "Moderate", waterJa: "普通", tip: "Plant eyes 1-2 inches below soil. Support heavy blooms with rings.", tipJa: "芽を土の表面から3-5cm下に植えます。重い花はリングで支えましょう。" },
  "Dahlia": { bloomMonths: [6,7,8,9,10], zone: "8-11", sun: "Full Sun", sunJa: "日なた", water: "Moderate", waterJa: "普通", tip: "Start tubers indoors in spring. Pinch for bushier growth.", tipJa: "春に室内で球根を育て始めます。摘芯するとこんもり育ちます。" },
  "Marigold": { bloomMonths: [5,6,7,8,9,10], zone: "2-11", sun: "Full Sun", sunJa: "日なた", water: "Low", waterJa: "少なめ", tip: "Great companion plant. Deadhead for continuous blooms.", tipJa: "コンパニオンプランツとして最適。花がら摘みで長く咲きます。" },
  "Iris": { bloomMonths: [4,5,6], zone: "3-9", sun: "Full Sun", sunJa: "日なた", water: "Low", waterJa: "少なめ", tip: "Plant rhizomes at soil surface. Divide every 3-4 years.", tipJa: "根茎を土の表面に植えます。3-4年ごとに株分けしましょう。" },
  "Chrysanthemum": { bloomMonths: [8,9,10,11], zone: "5-9", sun: "Full Sun", sunJa: "日なた", water: "Moderate", waterJa: "普通", tip: "Pinch stems in early summer for bushier plants and more blooms.", tipJa: "初夏に摘芯するとこんもり育ち、花数が増えます。" },
  "Lily": { bloomMonths: [5,6,7,8], zone: "3-9", sun: "Full/Partial Sun", sunJa: "日なた/半日陰", water: "Moderate", waterJa: "普通", tip: "Plant bulbs 6 inches deep in well-drained soil. Mulch in winter.", tipJa: "水はけの良い土に15cmの深さで植えます。冬はマルチングを。" },
  "Geranium": { bloomMonths: [4,5,6,7,8,9,10], zone: "10-11", sun: "Full Sun", sunJa: "日なた", water: "Moderate", waterJa: "普通", tip: "Deadhead regularly. Overwinter indoors in cold climates.", tipJa: "定期的に花がら摘みを。寒冷地では冬は室内に取り込みましょう。" },
  "Zinnia": { bloomMonths: [5,6,7,8,9,10], zone: "2-11", sun: "Full Sun", sunJa: "日なた", water: "Low", waterJa: "少なめ", tip: "Direct sow after frost. Excellent cut flower — cutting encourages more blooms.", tipJa: "霜の後に直まき。切り花に最適 — 切るほどたくさん咲きます。" },
  "Orchid": { bloomMonths: [1,2,3,4,5,10,11,12], zone: "9-12", sun: "Indirect Light", sunJa: "間接光", water: "Low", waterJa: "少なめ", tip: "Water weekly, let roots dry between. Bright indirect light is key.", tipJa: "週1回水やり、根が乾いてから。明るい間接光が大切です。" },
  "Cherry Blossom": { bloomMonths: [3,4], zone: "5-8", sun: "Full Sun", sunJa: "日なた", water: "Moderate", waterJa: "普通", tip: "Blooms last 1-2 weeks. Prune after flowering to shape.", tipJa: "開花は1-2週間。花後に剪定して形を整えましょう。" },
  "Maple Tree": { bloomMonths: [3,4], zone: "3-9", sun: "Full/Partial Sun", sunJa: "日なた/半日陰", water: "Moderate", waterJa: "普通", tip: "Fall foliage peaks in October. Prune in late summer to avoid sap bleeding.", tipJa: "紅葉は10月がピーク。樹液が出ないよう晩夏に剪定を。" },
  "Japanese Maple": { bloomMonths: [4,5], zone: "5-9", sun: "Partial Sun", sunJa: "半日陰", water: "Moderate", waterJa: "普通", tip: "Protect from harsh afternoon sun. Beautiful fall color.", tipJa: "強い西日から守りましょう。美しい紅葉が楽しめます。" },
  "Oak Tree": { bloomMonths: [3,4,5], zone: "3-9", sun: "Full Sun", sunJa: "日なた", water: "Low", waterJa: "少なめ", tip: "Slow-growing but long-lived. Acorns attract wildlife.", tipJa: "成長は遅いが長寿。どんぐりは野生動物を引き寄せます。" },
  "Wisteria": { bloomMonths: [4,5], zone: "5-9", sun: "Full Sun", sunJa: "日なた", water: "Moderate", waterJa: "普通", tip: "Prune twice yearly — summer and winter. Can take years to first bloom.", tipJa: "夏と冬に年2回剪定。初花まで数年かかることも。" },
  "Jasmine": { bloomMonths: [3,4,5,6,7,8], zone: "7-10", sun: "Full/Partial Sun", sunJa: "日なた/半日陰", water: "Moderate", waterJa: "普通", tip: "Fragrant evening bloomer. Train on trellises or arbors.", tipJa: "夕方に香る花。トレリスやアーバーに誘引しましょう。" },
  "Camellia": { bloomMonths: [1,2,3,10,11,12], zone: "7-9", sun: "Partial Sun", sunJa: "半日陰", water: "Moderate", waterJa: "普通", tip: "Evergreen with winter blooms. Protect from morning sun in cold areas.", tipJa: "常緑で冬に開花。寒冷地では朝日を避けましょう。" },
  "Azalea": { bloomMonths: [3,4,5], zone: "5-9", sun: "Partial Sun", sunJa: "半日陰", water: "Moderate", waterJa: "普通", tip: "Acidic soil preferred. Shallow roots — mulch heavily.", tipJa: "酸性土壌を好みます。根が浅いので厚くマルチングを。" },
  "Clematis": { bloomMonths: [5,6,7,8,9], zone: "4-9", sun: "Full Sun", sunJa: "日なた", water: "Moderate", waterJa: "普通", tip: "Roots like shade, tops like sun. Mulch base heavily.", tipJa: "根元は日陰、上部は日なたを好みます。根元にマルチングを。" },
  "Hibiscus": { bloomMonths: [6,7,8,9,10], zone: "5-11", sun: "Full Sun", sunJa: "日なた", water: "High", waterJa: "多め", tip: "Tropical varieties need winter protection. Prune in early spring.", tipJa: "熱帯品種は冬の保護が必要。早春に剪定しましょう。" },
  "Gardenia": { bloomMonths: [5,6,7,8], zone: "8-11", sun: "Partial Sun", sunJa: "半日陰", water: "Moderate", waterJa: "普通", tip: "Acidic soil essential. Intensely fragrant white blooms.", tipJa: "酸性土壌が必須。強い香りの白い花が咲きます。" },
  "Magnolia": { bloomMonths: [3,4,5], zone: "5-9", sun: "Full/Partial Sun", sunJa: "日なた/半日陰", water: "Moderate", waterJa: "普通", tip: "Avoid transplanting. Blooms before leaves emerge in spring.", tipJa: "移植を避けましょう。春に葉より先に花が咲きます。" },
  "Plum Tree": { bloomMonths: [2,3,4], zone: "4-9", sun: "Full Sun", sunJa: "日なた", water: "Moderate", waterJa: "普通", tip: "Beautiful early spring blossoms. Many varieties popular in Japan (ume).", tipJa: "美しい早春の花。日本では梅として多くの品種が親しまれています。" },
  "Camellia Sasanqua": { bloomMonths: [10,11,12], zone: "7-9", sun: "Partial Sun", sunJa: "半日陰", water: "Moderate", waterJa: "普通", tip: "Fall/winter bloomer. More sun-tolerant than C. japonica.", tipJa: "秋冬に開花。ツバキより日光に強い品種です。" },
  "Custom": { bloomMonths: [], zone: "Varies", sun: "Varies", sunJa: "不定", water: "Varies", waterJa: "不定", tip: "Add your own custom plant variety.", tipJa: "お好みの植物を追加できます。" },
};

const PLANT_NAMES = Object.keys(BLOOM_DATA);

const SECTION_COLORS = {
  "Section A": { bg: "#2d5a27", light: "#e8f5e3", accent: "#4a8c3f", badge: "#c8e6c0" },
  "Section B": { bg: "#1a4a6e", light: "#e0f0fa", accent: "#3a7cb8", badge: "#b8d9f0" },
  "Section C": { bg: "#7a4a1a", light: "#faf0e0", accent: "#b87a3a", badge: "#f0d9b0" },
  "Section D": { bg: "#5a1a5a", light: "#f5e0f5", accent: "#8c3f8c", badge: "#e0b8e0" },
};

function getSeason(month) {
  if (month >= 3 && month <= 5) return "spring";
  if (month >= 6 && month <= 8) return "summer";
  if (month >= 9 && month <= 11) return "autumn";
  return "winter";
}
const SEASON_ICONS = { spring: "🌱", summer: "☀️", autumn: "🍂", winter: "❄️" };

function getBloomStatus(plantName, currentMonth) {
  const data = BLOOM_DATA[plantName];
  if (!data || !data.bloomMonths.length) return "unknown";
  if (data.bloomMonths.includes(currentMonth + 1)) return "blooming";
  const nextBloom = data.bloomMonths.find(m => m > currentMonth + 1) || data.bloomMonths[0];
  const diff = nextBloom > currentMonth + 1 ? nextBloom - (currentMonth + 1) : 12 - (currentMonth + 1) + nextBloom;
  if (diff <= 2) return "upcoming";
  return "dormant";
}

function useStatusStyles() {
  const { t } = useLang();
  return {
    blooming: { color: "#2d7a2d", bg: "#d4f5d0", icon: "🌸", label: t.bloomingNowLabel },
    upcoming: { color: "#8a6d00", bg: "#fff8d0", icon: "🌿", label: t.bloomSoonLabel },
    dormant: { color: "#666", bg: "#eee", icon: "💤", label: t.dormant },
    unknown: { color: "#999", bg: "#f5f5f5", icon: "❓", label: t.unknown },
  };
}

// Language toggle button
function LangToggle() {
  const { lang, setLang } = useLang();
  return (
    <button
      onClick={() => setLang(lang === "en" ? "ja" : "en")}
      style={{
        padding: "6px 12px",
        background: "rgba(255,255,255,0.15)",
        border: "1px solid rgba(255,255,255,0.3)",
        borderRadius: 8,
        cursor: "pointer",
        fontSize: 13,
        fontWeight: 600,
        color: "white",
        fontFamily: "inherit",
        transition: "all 0.2s",
        display: "flex",
        alignItems: "center",
        gap: 6,
      }}
      title={lang === "en" ? "日本語に切替" : "Switch to English"}
    >
      {lang === "en" ? "🇯🇵 日本語" : "🇺🇸 English"}
    </button>
  );
}

// Setup banner component
function SetupBanner() {
  const [show, setShow] = useState(true);
  const { t } = useLang();
  if (!show) return null;
  return (
    <div style={{ background:"#fff8e0", border:"1px solid #f0d860", borderRadius:12, padding:"16px 20px", marginBottom:20, position:"relative" }}>
      <button onClick={() => setShow(false)} style={{ position:"absolute", top:8, right:12, background:"none", border:"none", fontSize:18, cursor:"pointer", color:"#999" }}>×</button>
      <div style={{ fontWeight:700, fontSize:14, color:"#8a6d00", marginBottom:6 }}>{t.setupTitle}</div>
      <div style={{ fontSize:13, color:"#6b5500", lineHeight:1.6 }}>
        {t.setupText}<br/>
        1. {t.setupStep1} <a href="https://jsonbin.io" target="_blank" rel="noopener" style={{ color:"#2d5a27", fontWeight:600 }}>jsonbin.io</a> {t.setupStep1b}<br/>
        2. {t.setupStep2} <strong>X-Master-Key</strong> {t.setupStep2b}<br/>
        3. {t.setupStep3} <code style={{ background:"#f0ede5", padding:"1px 6px", borderRadius:4 }}>src/storage.js</code> {t.setupStep3b}<br/>
        4. {t.setupStep4}<br/>
        <em style={{ fontSize:12, color:"#999" }}>{t.setupNote}</em>
      </div>
    </div>
  );
}

function AppContent() {
  const { lang, t } = useLang();
  const STATUS_STYLES = useStatusStyles();
  const [view, setView] = useState("dashboard");
  const [plants, setPlants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [syncing, setSyncing] = useState(false);
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [selectedSection, setSelectedSection] = useState("All");
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth());
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({
    name: "", section: "Section A", datePlanted: "", notes: "", customName: ""
  });
  const [toast, setToast] = useState(null);
  const [deleteConfirm, setDeleteConfirm] = useState(null);
  const configured = isConfigured();
  const currentMonth = new Date().getMonth();

  const getSectionLabel = (sectionKey) => {
    const idx = SECTIONS.indexOf(sectionKey);
    return idx >= 0 ? t.sections[idx] : sectionKey;
  };

  const getSeasonLabel = (seasonKey) => {
    const map = { spring: t.spring, summer: t.summer, autumn: t.autumn, winter: t.winter };
    return map[seasonKey] || seasonKey;
  };

  const getPlantSun = (plantData) => lang === "ja" && plantData.sunJa ? plantData.sunJa : plantData.sun;
  const getPlantWater = (plantData) => lang === "ja" && plantData.waterJa ? plantData.waterJa : plantData.water;
  const getPlantTip = (plantData) => lang === "ja" && plantData.tipJa ? plantData.tipJa : plantData.tip;

  useEffect(() => {
    (async () => {
      try {
        if (configured) {
          const data = await loadPlants();
          setPlants(data);
        } else {
          const local = localStorage.getItem('garden-plants-local');
          if (local) setPlants(JSON.parse(local));
        }
      } catch (e) {
        console.error("Load failed", e);
        const local = localStorage.getItem('garden-plants-local');
        if (local) setPlants(JSON.parse(local));
      }
      setLoading(false);
    })();
  }, [configured]);

  const saveAll = useCallback(async (updated) => {
    setPlants(updated);
    localStorage.setItem('garden-plants-local', JSON.stringify(updated));
    if (configured) {
      setSyncing(true);
      try {
        await savePlants(updated);
      } catch (e) {
        console.error("Sync failed", e);
      }
      setSyncing(false);
    }
  }, [configured]);

  const showToast = (msg) => {
    setToast(msg);
    setTimeout(() => setToast(null), 2500);
  };

  const handleSave = () => {
    const plantName = formData.name === "Custom" ? (formData.customName || "Custom Plant") : formData.name;
    if (!plantName || !formData.datePlanted) {
      showToast(t.fillRequired);
      return;
    }
    const entry = {
      id: editingId || Date.now().toString(),
      name: plantName,
      section: formData.section,
      datePlanted: formData.datePlanted,
      notes: formData.notes,
      bloomInfo: BLOOM_DATA[formData.name] || BLOOM_DATA["Custom"],
    };
    let updated;
    if (editingId) {
      updated = plants.map(p => p.id === editingId ? entry : p);
    } else {
      updated = [...plants, entry];
    }
    saveAll(updated);
    setShowForm(false);
    setEditingId(null);
    setFormData({ name: "", section: "Section A", datePlanted: "", notes: "", customName: "" });
    showToast(editingId ? t.plantUpdated : t.plantAdded);
  };

  const handleEdit = (plant) => {
    const isKnown = PLANT_NAMES.includes(plant.name);
    setFormData({
      name: isKnown ? plant.name : "Custom",
      customName: isKnown ? "" : plant.name,
      section: plant.section,
      datePlanted: plant.datePlanted,
      notes: plant.notes,
    });
    setEditingId(plant.id);
    setShowForm(true);
    setView("manage");
  };

  const handleDelete = (id) => {
    saveAll(plants.filter(p => p.id !== id));
    setDeleteConfirm(null);
    showToast(t.plantRemoved);
  };

  const filteredPlants = useMemo(() => {
    return plants.filter(p => {
      const d = new Date(p.datePlanted);
      const yearMatch = d.getFullYear() === selectedYear;
      const sectionMatch = selectedSection === "All" || p.section === selectedSection;
      return yearMatch && sectionMatch;
    });
  }, [plants, selectedYear, selectedSection]);

  const monthPlants = useMemo(() => {
    return filteredPlants.filter(p => new Date(p.datePlanted).getMonth() === selectedMonth);
  }, [filteredPlants, selectedMonth]);

  const years = useMemo(() => {
    const yrs = new Set(plants.map(p => new Date(p.datePlanted).getFullYear()));
    yrs.add(new Date().getFullYear());
    return [...yrs].sort((a,b) => b - a);
  }, [plants]);

  const stats = useMemo(() => {
    const bySection = {};
    SECTIONS.forEach(s => bySection[s] = filteredPlants.filter(p => p.section === s).length);
    const byMonth = {};
    MONTHS.forEach((m,i) => byMonth[i] = filteredPlants.filter(p => new Date(p.datePlanted).getMonth() === i).length);
    const bloomingNow = filteredPlants.filter(p => getBloomStatus(p.name, currentMonth) === "blooming").length;
    const upcomingSoon = filteredPlants.filter(p => getBloomStatus(p.name, currentMonth) === "upcoming").length;
    return { bySection, byMonth, bloomingNow, upcomingSoon, total: filteredPlants.length };
  }, [filteredPlants, currentMonth]);

  const maxMonthCount = Math.max(1, ...Object.values(stats.byMonth));

  const dateFmt = lang === "ja" ? "ja-JP" : "en-US";
  const dateOpts = lang === "ja"
    ? { year:"numeric", month:"long", day:"numeric" }
    : { month:"long", day:"numeric", year:"numeric" };

  if (loading) return (
    <div style={{ display:"flex", alignItems:"center", justifyContent:"center", height:"100vh", fontFamily:"'Playfair Display', Georgia, serif", fontSize:24, color:"#4a6741", background:"#f8faf5" }}>
      <div style={{ textAlign:"center" }}>
        <div style={{ fontSize:48, marginBottom:16 }}>🌿</div>
        {t.loading}
      </div>
    </div>
  );

  return (
    <div style={{ fontFamily:"'DM Sans', 'Segoe UI', sans-serif", background:"#f5f3ee", minHeight:"100vh", color:"#2a2a2a" }}>
      <link href="https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;600;700&family=DM+Sans:wght@400;500;600&display=swap" rel="stylesheet" />

      {/* Header */}
      <div style={{ background:"linear-gradient(135deg, #2d5a27 0%, #1a4a2e 50%, #0f3a22 100%)", padding:"28px 32px 20px", color:"white", position:"relative", overflow:"hidden" }}>
        <div style={{ position:"absolute", top:0, left:0, right:0, bottom:0, opacity:0.06, backgroundImage:"repeating-linear-gradient(45deg, transparent, transparent 20px, rgba(255,255,255,0.1) 20px, rgba(255,255,255,0.1) 40px)" }} />
        <div style={{ position:"relative", zIndex:1, maxWidth:1100, margin:"0 auto" }}>
          <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", flexWrap:"wrap", gap:16 }}>
            <div>
              <h1 style={{ fontFamily:"'Playfair Display', Georgia, serif", fontSize:30, fontWeight:700, margin:0, letterSpacing:"-0.5px" }}>
                {t.appTitle}
              </h1>
              <p style={{ margin:"4px 0 0", fontSize:14, opacity:0.75, fontWeight:400 }}>
                {t.subtitle}
                {syncing && <span style={{ marginLeft:8, fontSize:12, opacity:0.6 }}>{t.syncing}</span>}
                {configured && !syncing && <span style={{ marginLeft:8, fontSize:12, opacity:0.6 }}>{t.shared}</span>}
              </p>
            </div>
            <div style={{ display:"flex", gap:8, alignItems:"center", flexWrap:"wrap" }}>
              <LangToggle />
              <div style={{ display:"flex", gap:4, background:"rgba(255,255,255,0.12)", borderRadius:10, padding:4 }}>
                {["dashboard","manage"].map(v => (
                  <button key={v} onClick={() => { setView(v); setShowForm(false); }}
                    style={{ padding:"9px 22px", border:"none", borderRadius:8, cursor:"pointer", fontWeight:600, fontSize:13, fontFamily:"inherit", transition:"all 0.2s",
                      background: view === v ? "white" : "transparent",
                      color: view === v ? "#2d5a27" : "rgba(255,255,255,0.85)",
                      boxShadow: view === v ? "0 2px 8px rgba(0,0,0,0.15)" : "none"
                    }}>
                    {v === "dashboard" ? t.dashboard : t.managePlants}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div style={{ maxWidth:1100, margin:"0 auto", padding:"24px 24px 40px" }}>

        {!configured && <SetupBanner />}

        {/* Filters */}
        <div style={{ display:"flex", gap:12, marginBottom:24, flexWrap:"wrap", alignItems:"center" }}>
          <div style={{ display:"flex", alignItems:"center", gap:8, background:"white", padding:"8px 14px", borderRadius:10, border:"1px solid #e0ddd5", boxShadow:"0 1px 3px rgba(0,0,0,0.04)" }}>
            <span style={{ fontSize:13, fontWeight:600, color:"#888" }}>{t.year}</span>
            <select value={selectedYear} onChange={e => setSelectedYear(+e.target.value)}
              style={{ border:"none", background:"transparent", fontFamily:"inherit", fontSize:15, fontWeight:600, color:"#2d5a27", cursor:"pointer", outline:"none" }}>
              {years.map(y => <option key={y} value={y}>{y}</option>)}
            </select>
          </div>
          <div style={{ display:"flex", alignItems:"center", gap:8, background:"white", padding:"8px 14px", borderRadius:10, border:"1px solid #e0ddd5", boxShadow:"0 1px 3px rgba(0,0,0,0.04)" }}>
            <span style={{ fontSize:13, fontWeight:600, color:"#888" }}>{t.section}</span>
            <select value={selectedSection} onChange={e => setSelectedSection(e.target.value)}
              style={{ border:"none", background:"transparent", fontFamily:"inherit", fontSize:15, fontWeight:600, color:"#2d5a27", cursor:"pointer", outline:"none" }}>
              <option value="All">{t.allSections}</option>
              {SECTIONS.map((s, i) => <option key={s} value={s}>{t.sections[i]}</option>)}
            </select>
          </div>
          {view === "manage" && (
            <button onClick={() => { setShowForm(true); setEditingId(null); setFormData({ name:"", section:"Section A", datePlanted:"", notes:"", customName:"" }); }}
              style={{ marginLeft:"auto", padding:"10px 20px", background:"#2d5a27", color:"white", border:"none", borderRadius:10, cursor:"pointer", fontWeight:600, fontSize:14, fontFamily:"inherit", boxShadow:"0 2px 8px rgba(45,90,39,0.3)" }}>
              {t.addPlant}
            </button>
          )}
        </div>

        {/* ===== DASHBOARD VIEW ===== */}
        {view === "dashboard" && (
          <div>
            {/* Summary Cards */}
            <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fit, minmax(150px, 1fr))", gap:14, marginBottom:28 }}>
              {[
                { label: t.totalPlants, value: stats.total, icon:"🌱", color:"#2d5a27" },
                { label: t.bloomingNow, value: stats.bloomingNow, icon:"🌸", color:"#c44569" },
                { label: t.bloomSoon, value: stats.upcomingSoon, icon:"🌿", color:"#8a6d00" },
                { label: t.season, value: SEASON_ICONS[getSeason(currentMonth)], icon: "", color:"#4a6741", sub: getSeasonLabel(getSeason(currentMonth)) },
              ].map((c, i) => (
                <div key={i} style={{ background:"white", borderRadius:14, padding:"20px 18px", border:"1px solid #e8e5dd", boxShadow:"0 2px 8px rgba(0,0,0,0.04)" }}>
                  <div style={{ fontSize:12, fontWeight:600, color:"#999", textTransform:"uppercase", letterSpacing:"0.5px" }}>{c.label}</div>
                  <div style={{ fontSize: c.sub ? 32 : 28, fontWeight:700, color: c.color, fontFamily:"'Playfair Display', serif", marginTop:4 }}>
                    {c.icon && <span style={{ marginRight:4 }}>{c.icon}</span>}{c.value}
                  </div>
                  {c.sub && <div style={{ fontSize:13, color:"#888", marginTop:2 }}>{c.sub}</div>}
                </div>
              ))}
            </div>

            {/* Monthly Activity Chart */}
            <div style={{ background:"white", borderRadius:16, padding:"24px", border:"1px solid #e8e5dd", marginBottom:24, boxShadow:"0 2px 8px rgba(0,0,0,0.04)" }}>
              <h3 style={{ fontFamily:"'Playfair Display', serif", fontSize:18, margin:"0 0 18px", color:"#2d5a27" }}>
                {t.monthlyActivity} — {selectedYear}
              </h3>
              <div style={{ display:"flex", alignItems:"flex-end", gap:6, height:120 }}>
                {t.months.map((m, i) => {
                  const count = stats.byMonth[i] || 0;
                  const h = count ? Math.max(12, (count / maxMonthCount) * 100) : 4;
                  const isCurrentMonth = i === currentMonth && selectedYear === new Date().getFullYear();
                  return (
                    <div key={m} style={{ flex:1, textAlign:"center", cursor:"pointer" }} onClick={() => setSelectedMonth(i)}>
                      <div style={{ fontSize:11, fontWeight:600, color: count ? "#2d5a27" : "#ccc", marginBottom:4 }}>{count || ""}</div>
                      <div style={{
                        height: h, borderRadius:"6px 6px 4px 4px", transition:"all 0.3s",
                        background: isCurrentMonth ? "linear-gradient(180deg, #4a8c3f, #2d5a27)" : count ? "linear-gradient(180deg, #a8d5a0, #6bb863)" : "#eee",
                        border: isCurrentMonth ? "2px solid #1a3a15" : "none",
                        boxShadow: count ? "0 2px 4px rgba(0,0,0,0.1)" : "none",
                      }} />
                      <div style={{ fontSize:11, marginTop:6, fontWeight: isCurrentMonth ? 700 : 500, color: isCurrentMonth ? "#2d5a27" : "#888" }}>{m}</div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Section Overview */}
            <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fit, minmax(240px, 1fr))", gap:16, marginBottom:24 }}>
              {SECTIONS.map((section, sIdx) => {
                const sc = SECTION_COLORS[section];
                const sectionPlants = filteredPlants.filter(p => p.section === section);
                return (
                  <div key={section} style={{ background:"white", borderRadius:14, overflow:"hidden", border:"1px solid #e8e5dd", boxShadow:"0 2px 8px rgba(0,0,0,0.04)" }}>
                    <div style={{ background: sc.bg, padding:"14px 18px", display:"flex", justifyContent:"space-between", alignItems:"center" }}>
                      <span style={{ color:"white", fontWeight:700, fontFamily:"'Playfair Display', serif", fontSize:16 }}>{t.sections[sIdx]}</span>
                      <span style={{ background:"rgba(255,255,255,0.25)", color:"white", padding:"3px 10px", borderRadius:20, fontSize:12, fontWeight:600 }}>
                        {sectionPlants.length} {sectionPlants.length !== 1 ? t.plants : t.plant}
                      </span>
                    </div>
                    <div style={{ padding:"14px 18px", minHeight:60 }}>
                      {sectionPlants.length === 0 ? (
                        <p style={{ color:"#bbb", fontSize:13, fontStyle:"italic", margin:0 }}>
                          {lang === "ja" ? `${selectedYear}年${t.noPlantsInYear}` : `${t.noPlantsInYear} ${selectedYear}`}
                        </p>
                      ) : (
                        <div style={{ display:"flex", flexWrap:"wrap", gap:6 }}>
                          {sectionPlants.map(p => {
                            const status = getBloomStatus(p.name, currentMonth);
                            const s = STATUS_STYLES[status];
                            return (
                              <span key={p.id} onClick={() => handleEdit(p)}
                                style={{ display:"inline-flex", alignItems:"center", gap:4, padding:"4px 10px", borderRadius:20, fontSize:12, fontWeight:500, cursor:"pointer",
                                  background: s.bg, color: s.color, border:`1px solid ${s.color}22`, transition:"all 0.2s" }}>
                                {s.icon} {p.name}
                              </span>
                            );
                          })}
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Month Detail */}
            <div style={{ background:"white", borderRadius:16, padding:"24px", border:"1px solid #e8e5dd", boxShadow:"0 2px 8px rgba(0,0,0,0.04)" }}>
              <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:18 }}>
                <h3 style={{ fontFamily:"'Playfair Display', serif", fontSize:18, margin:0, color:"#2d5a27" }}>
                  {SEASON_ICONS[getSeason(selectedMonth)]} {t.fullMonths[selectedMonth]} {selectedYear} {t.detail}
                </h3>
                <div style={{ display:"flex", gap:4 }}>
                  <button onClick={() => setSelectedMonth((selectedMonth - 1 + 12) % 12)} style={{ border:"1px solid #ddd", background:"white", borderRadius:8, padding:"6px 12px", cursor:"pointer", fontFamily:"inherit", fontSize:14 }}>←</button>
                  <button onClick={() => setSelectedMonth((selectedMonth + 1) % 12)} style={{ border:"1px solid #ddd", background:"white", borderRadius:8, padding:"6px 12px", cursor:"pointer", fontFamily:"inherit", fontSize:14 }}>→</button>
                </div>
              </div>

              {(() => {
                const bloomingThisMonth = filteredPlants.filter(p => {
                  const info = BLOOM_DATA[p.name] || p.bloomInfo;
                  return info && info.bloomMonths && info.bloomMonths.includes(selectedMonth + 1);
                });
                return bloomingThisMonth.length > 0 && (
                  <div style={{ marginBottom:18, padding:"12px 16px", background:"#fdf8f0", borderRadius:10, border:"1px solid #f0e6d4" }}>
                    <div style={{ fontSize:13, fontWeight:600, color:"#8a6d00", marginBottom:8 }}>{t.expectedBloom} {t.fullMonths[selectedMonth]}:</div>
                    <div style={{ display:"flex", flexWrap:"wrap", gap:6 }}>
                      {bloomingThisMonth.map(p => (
                        <span key={p.id} style={{ padding:"4px 10px", background:"#fff8d0", color:"#6b5500", borderRadius:16, fontSize:12, fontWeight:500, border:"1px solid #f0e0a0" }}>
                          🌸 {p.name} ({getSectionLabel(p.section)})
                        </span>
                      ))}
                    </div>
                  </div>
                );
              })()}

              {monthPlants.length === 0 ? (
                <p style={{ color:"#bbb", fontSize:14, textAlign:"center", padding:20, fontStyle:"italic" }}>
                  {lang === "ja"
                    ? `${selectedYear}年${t.fullMonths[selectedMonth]}${t.noPlantedIn}`
                    : `${t.noPlantedIn} ${t.fullMonths[selectedMonth]} ${selectedYear}`
                  }
                </p>
              ) : (
                <div style={{ display:"flex", flexDirection:"column", gap:10 }}>
                  {monthPlants.map(p => {
                    const status = getBloomStatus(p.name, currentMonth);
                    const s = STATUS_STYLES[status];
                    const info = BLOOM_DATA[p.name] || p.bloomInfo;
                    const sc = SECTION_COLORS[p.section];
                    return (
                      <div key={p.id} style={{ display:"flex", gap:14, padding:"14px 16px", borderRadius:12, background:"#fafaf7", border:"1px solid #eee", alignItems:"flex-start" }}>
                        <div style={{ minWidth:36, height:36, borderRadius:10, background: sc.bg, display:"flex", alignItems:"center", justifyContent:"center", fontSize:18, color:"white", flexShrink:0 }}>
                          {s.icon}
                        </div>
                        <div style={{ flex:1, minWidth:0 }}>
                          <div style={{ display:"flex", alignItems:"center", gap:8, flexWrap:"wrap" }}>
                            <span style={{ fontWeight:600, fontSize:15 }}>{p.name}</span>
                            <span style={{ padding:"2px 8px", borderRadius:12, fontSize:11, fontWeight:600, background: sc.badge, color: sc.bg }}>{getSectionLabel(p.section)}</span>
                            <span style={{ padding:"2px 8px", borderRadius:12, fontSize:11, fontWeight:500, background: s.bg, color: s.color }}>{s.label}</span>
                          </div>
                          <div style={{ fontSize:12, color:"#888", marginTop:4 }}>
                            {t.planted}: {new Date(p.datePlanted).toLocaleDateString(dateFmt, dateOpts)}
                            {info && info.zone !== "Varies" && <> · {t.zone} {info.zone} · {getPlantSun(info)} · {t.water}: {getPlantWater(info)}</>}
                          </div>
                          {info && getPlantTip(info) && getPlantTip(info) !== getPlantTip(BLOOM_DATA["Custom"]) && (
                            <div style={{ fontSize:12, color:"#6b8a60", marginTop:4, fontStyle:"italic" }}>💡 {getPlantTip(info)}</div>
                          )}
                          {p.notes && <div style={{ fontSize:12, color:"#666", marginTop:4 }}>📝 {p.notes}</div>}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        )}

        {/* ===== MANAGE VIEW ===== */}
        {view === "manage" && (
          <div>
            {showForm && (
              <div style={{ background:"white", borderRadius:16, padding:"28px", border:"1px solid #e0ddd5", marginBottom:24, boxShadow:"0 4px 16px rgba(0,0,0,0.06)" }}>
                <h3 style={{ fontFamily:"'Playfair Display', serif", fontSize:20, margin:"0 0 20px", color:"#2d5a27" }}>
                  {editingId ? t.editPlant : t.addNewPlant}
                </h3>
                <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fit, minmax(220px, 1fr))", gap:16 }}>
                  <div>
                    <label style={{ display:"block", fontSize:12, fontWeight:600, color:"#888", marginBottom:6, textTransform:"uppercase", letterSpacing:"0.5px" }}>{t.plantName}</label>
                    <select value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})}
                      style={{ width:"100%", padding:"10px 12px", border:"1px solid #ddd", borderRadius:10, fontFamily:"inherit", fontSize:14, background:"#fafaf7", boxSizing:"border-box" }}>
                      <option value="">{t.selectPlant}</option>
                      {PLANT_NAMES.map(n => <option key={n} value={n}>{n}</option>)}
                    </select>
                  </div>
                  {formData.name === "Custom" && (
                    <div>
                      <label style={{ display:"block", fontSize:12, fontWeight:600, color:"#888", marginBottom:6, textTransform:"uppercase", letterSpacing:"0.5px" }}>{t.customName}</label>
                      <input type="text" value={formData.customName} onChange={e => setFormData({...formData, customName: e.target.value})}
                        placeholder={t.enterPlantName} style={{ width:"100%", padding:"10px 12px", border:"1px solid #ddd", borderRadius:10, fontFamily:"inherit", fontSize:14, background:"#fafaf7", boxSizing:"border-box" }} />
                    </div>
                  )}
                  <div>
                    <label style={{ display:"block", fontSize:12, fontWeight:600, color:"#888", marginBottom:6, textTransform:"uppercase", letterSpacing:"0.5px" }}>{t.section}</label>
                    <select value={formData.section} onChange={e => setFormData({...formData, section: e.target.value})}
                      style={{ width:"100%", padding:"10px 12px", border:"1px solid #ddd", borderRadius:10, fontFamily:"inherit", fontSize:14, background:"#fafaf7", boxSizing:"border-box" }}>
                      {SECTIONS.map((s, i) => <option key={s} value={s}>{t.sections[i]}</option>)}
                    </select>
                  </div>
                  <div>
                    <label style={{ display:"block", fontSize:12, fontWeight:600, color:"#888", marginBottom:6, textTransform:"uppercase", letterSpacing:"0.5px" }}>{t.datePlanted}</label>
                    <input type="date" value={formData.datePlanted} onChange={e => setFormData({...formData, datePlanted: e.target.value})}
                      style={{ width:"100%", padding:"10px 12px", border:"1px solid #ddd", borderRadius:10, fontFamily:"inherit", fontSize:14, background:"#fafaf7", boxSizing:"border-box" }} />
                  </div>
                  <div style={{ gridColumn:"1 / -1" }}>
                    <label style={{ display:"block", fontSize:12, fontWeight:600, color:"#888", marginBottom:6, textTransform:"uppercase", letterSpacing:"0.5px" }}>{t.notes}</label>
                    <input type="text" value={formData.notes} onChange={e => setFormData({...formData, notes: e.target.value})}
                      placeholder={t.notesPlaceholder} style={{ width:"100%", padding:"10px 12px", border:"1px solid #ddd", borderRadius:10, fontFamily:"inherit", fontSize:14, background:"#fafaf7", boxSizing:"border-box" }} />
                  </div>
                </div>

                {formData.name && formData.name !== "Custom" && BLOOM_DATA[formData.name] && (
                  <div style={{ marginTop:16, padding:"14px 16px", background:"#f0f8ed", borderRadius:10, border:"1px solid #d4e8cd" }}>
                    <div style={{ fontSize:13, fontWeight:600, color:"#2d5a27", marginBottom:8 }}>{t.bloomInfo}</div>
                    <div style={{ display:"flex", gap:16, flexWrap:"wrap", fontSize:13, color:"#4a6741" }}>
                      <span>🌡 {t.zone}: {BLOOM_DATA[formData.name].zone}</span>
                      <span>☀️ {getPlantSun(BLOOM_DATA[formData.name])}</span>
                      <span>💧 {t.water}: {getPlantWater(BLOOM_DATA[formData.name])}</span>
                    </div>
                    <div style={{ display:"flex", gap:3, marginTop:10 }}>
                      {t.months.map((m, i) => {
                        const blooms = BLOOM_DATA[formData.name].bloomMonths.includes(i + 1);
                        return (
                          <div key={m} style={{ flex:1, textAlign:"center" }}>
                            <div style={{ height:18, borderRadius:4, background: blooms ? "#4a8c3f" : "#e8e5dd", transition:"all 0.3s" }} />
                            <div style={{ fontSize:9, marginTop:3, color: blooms ? "#2d5a27" : "#bbb", fontWeight: blooms ? 700 : 400 }}>{m}</div>
                          </div>
                        );
                      })}
                    </div>
                    <div style={{ fontSize:12, color:"#6b8a60", marginTop:10, fontStyle:"italic" }}>💡 {getPlantTip(BLOOM_DATA[formData.name])}</div>
                  </div>
                )}

                <div style={{ display:"flex", gap:10, marginTop:20 }}>
                  <button onClick={handleSave}
                    style={{ padding:"10px 24px", background:"#2d5a27", color:"white", border:"none", borderRadius:10, cursor:"pointer", fontWeight:600, fontSize:14, fontFamily:"inherit", boxShadow:"0 2px 8px rgba(45,90,39,0.3)" }}>
                    {editingId ? t.updatePlant : t.savePlant}
                  </button>
                  <button onClick={() => { setShowForm(false); setEditingId(null); }}
                    style={{ padding:"10px 24px", background:"#f0ede5", color:"#666", border:"none", borderRadius:10, cursor:"pointer", fontWeight:600, fontSize:14, fontFamily:"inherit" }}>
                    {t.cancel}
                  </button>
                </div>
              </div>
            )}

            {/* Plant List */}
            <div style={{ background:"white", borderRadius:16, padding:"24px", border:"1px solid #e0ddd5", boxShadow:"0 2px 8px rgba(0,0,0,0.04)" }}>
              <h3 style={{ fontFamily:"'Playfair Display', serif", fontSize:18, margin:"0 0 18px", color:"#2d5a27" }}>
                {t.allPlants} — {selectedYear} {selectedSection !== "All" ? `· ${getSectionLabel(selectedSection)}` : ""}
              </h3>
              {filteredPlants.length === 0 ? (
                <div style={{ textAlign:"center", padding:"40px 20px", color:"#bbb" }}>
                  <div style={{ fontSize:40, marginBottom:12 }}>🌱</div>
                  <p style={{ fontSize:15, fontWeight:500 }}>{t.noPlantsRecorded}</p>
                  <p style={{ fontSize:13 }}>{t.clickAddPlant}</p>
                </div>
              ) : (
                <div style={{ display:"flex", flexDirection:"column", gap:8 }}>
                  {filteredPlants.sort((a,b) => new Date(a.datePlanted) - new Date(b.datePlanted)).map(p => {
                    const status = getBloomStatus(p.name, currentMonth);
                    const s = STATUS_STYLES[status];
                    const sc = SECTION_COLORS[p.section];
                    const info = BLOOM_DATA[p.name] || p.bloomInfo;
                    return (
                      <div key={p.id} style={{ display:"flex", gap:14, padding:"14px 16px", borderRadius:12, background:"#fafaf7", border:"1px solid #eee", alignItems:"center", transition:"all 0.2s" }}>
                        <div style={{ minWidth:40, height:40, borderRadius:10, background: sc.bg, display:"flex", alignItems:"center", justifyContent:"center", fontSize:20 }}>
                          {s.icon}
                        </div>
                        <div style={{ flex:1, minWidth:0 }}>
                          <div style={{ display:"flex", alignItems:"center", gap:8, flexWrap:"wrap" }}>
                            <span style={{ fontWeight:600, fontSize:15 }}>{p.name}</span>
                            <span style={{ padding:"2px 8px", borderRadius:12, fontSize:11, fontWeight:600, background: sc.badge, color: sc.bg }}>{getSectionLabel(p.section)}</span>
                            <span style={{ padding:"2px 8px", borderRadius:12, fontSize:11, fontWeight:500, background: s.bg, color: s.color }}>{s.label}</span>
                          </div>
                          <div style={{ fontSize:12, color:"#888", marginTop:3 }}>
                            {t.planted} {new Date(p.datePlanted).toLocaleDateString(dateFmt, dateOpts)}
                            {info && info.bloomMonths && info.bloomMonths.length > 0 && (
                              <> · {t.blooms}: {info.bloomMonths.map(m => t.months[m-1]).join(", ")}</>
                            )}
                          </div>
                          {p.notes && <div style={{ fontSize:12, color:"#888", marginTop:2 }}>📝 {p.notes}</div>}
                        </div>
                        <div style={{ display:"flex", gap:6, flexShrink:0 }}>
                          <button onClick={() => handleEdit(p)}
                            style={{ padding:"7px 14px", background:"#f0ede5", border:"none", borderRadius:8, cursor:"pointer", fontSize:12, fontWeight:600, fontFamily:"inherit", color:"#666" }}>
                            {t.edit}
                          </button>
                          {deleteConfirm === p.id ? (
                            <div style={{ display:"flex", gap:4 }}>
                              <button onClick={() => handleDelete(p.id)}
                                style={{ padding:"7px 12px", background:"#e74c3c", color:"white", border:"none", borderRadius:8, cursor:"pointer", fontSize:12, fontWeight:600, fontFamily:"inherit" }}>
                                {t.confirm}
                              </button>
                              <button onClick={() => setDeleteConfirm(null)}
                                style={{ padding:"7px 12px", background:"#eee", border:"none", borderRadius:8, cursor:"pointer", fontSize:12, fontWeight:600, fontFamily:"inherit", color:"#666" }}>
                                {t.no}
                              </button>
                            </div>
                          ) : (
                            <button onClick={() => setDeleteConfirm(p.id)}
                              style={{ padding:"7px 14px", background:"#fde8e8", border:"none", borderRadius:8, cursor:"pointer", fontSize:12, fontWeight:600, fontFamily:"inherit", color:"#c0392b" }}>
                              {t.delete}
                            </button>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            {plants.length > 0 && (
              <div style={{ marginTop:20, textAlign:"center" }}>
                <button onClick={async () => {
                  if (confirm(t.resetConfirm)) {
                    await saveAll([]);
                    showToast(t.allDataCleared);
                  }
                }} style={{ padding:"8px 16px", background:"transparent", border:"1px solid #ddd", borderRadius:8, cursor:"pointer", fontSize:12, color:"#999", fontFamily:"inherit" }}>
                  {t.resetAllData}
                </button>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Toast */}
      {toast && (
        <div style={{ position:"fixed", bottom:28, left:"50%", transform:"translateX(-50%)", background:"#2d5a27", color:"white", padding:"12px 24px", borderRadius:12, fontSize:14, fontWeight:600, fontFamily:"inherit", boxShadow:"0 4px 20px rgba(0,0,0,0.2)", zIndex:1000 }}>
          {toast}
        </div>
      )}

      <style>{`
        select:focus, input:focus { outline: 2px solid #4a8c3f; outline-offset: -1px; }
        button:hover { opacity: 0.9; }
        @media (max-width: 600px) {
          h1 { font-size: 24px !important; }
        }
      `}</style>
    </div>
  );
}

export default function App() {
  const [lang, setLang] = useState(() => {
    try {
      return localStorage.getItem('garden-lang') || "en";
    } catch {
      return "en";
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem('garden-lang', lang);
    } catch {}
  }, [lang]);

  const t = translations[lang];

  return (
    <LangContext.Provider value={{ lang, t, setLang }}>
      <AppContent />
    </LangContext.Provider>
  );
}
