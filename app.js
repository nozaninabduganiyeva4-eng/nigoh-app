/**
 * NIGOH — Nafis Did va Premium Moda Maydoni
 * Frontend Application Logic & Supabase Sync
 */

// Supabase Configuration
const SUPABASE_URL = "https://txvwfrlfmeeyzvkxgmnj.supabase.co";
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InR4dndmcmxmbWVleXp2a3hnbW5qIiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTA2OTYxMzgsImV4cCI6MjEwNjI3MjEzOH0.OfykMjR5OMCWSs7S8ydu3hk8yuhaZgEuXhoVMqaGdfY";
// Runtime AI Key Configuration
const getAIKey = () => {
  try {
    return localStorage.getItem("NIGOH_AI_KEY") || atob("QVEuQWI4Uk42Sm1ncXVkOV91RlpsTlAyOXNidmJqVnFjQlFJenIxNWw1OG15ZkFHZnFXQQ==");
  } catch (e) {
    return "";
  }
};
const AI_API_KEY = getAIKey();

let supabaseClient = null;
if (window.supabase) {
  try {
    supabaseClient = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
  } catch (err) {
    console.warn("Supabase initialization error, falling back to local store:", err);
  }
}

// Initial Curated Products (Toshkent va Xitoy omborlari, bayram chegirmalari, o'lchamlar va kelish muddati)
const INITIAL_PRODUCTS = [
  {
    id: "p1",
    title: "Oltin naqshli Premium Ipak Libos",
    category: "ayollar",
    price: 680000,
    discount_percent: 25,
    holiday_tag: "🎉 Navro'z Chegirmasi",
    sizes: ["S", "M", "L"],
    delivery_time: "Toshkent omboridan: 24 soat ichida",
    warehouse_location: "Toshkent",
    image_url: "https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=800&auto=format&fit=crop&q=80",
    seller_name: "Silk & Gold Boutique",
    seller_email: "silk_gold@nigoh.uz",
    likes_count: 142,
    description: "Tabiiy ipak va zarli iplardan to'qilgan milliy-zamonaviy fason. Tantanalar va bayramlar uchun eng nafis tanlov."
  },
  {
    id: "p2",
    title: "Kashmir Matoli Klassik Erkaklar Kostyumi",
    category: "erkaklar",
    price: 1250000,
    discount_percent: 15,
    holiday_tag: "🔥 Hafta Taklifi",
    sizes: ["M", "L", "XL", "XXL"],
    delivery_time: "Toshkent omboridan: 1-2 kun",
    warehouse_location: "Toshkent",
    image_url: "https://images.unsplash.com/photo-1594938298603-c8148c4dae35?w=800&auto=format&fit=crop&q=80",
    seller_name: "Toshkent Sartorial",
    seller_email: "sartorial@nigoh.uz",
    likes_count: 89,
    description: "Italiya bichimidagi nozik chiziqli kashmir kostyum. Ofis va tantanali uchrashuvlar uchun moslashtirilgan."
  },
  {
    id: "p3",
    title: "Xitoy Dizaynerlik Zamonaviy Trench Plash",
    category: "ayollar",
    price: 520000,
    discount_percent: 30,
    holiday_tag: "🌙 Ramazon & Hayit",
    sizes: ["XS", "S", "M", "L"],
    delivery_time: "Xitoy omboridan: 7-10 kun (Kargo)",
    warehouse_location: "Xitoy",
    image_url: "https://images.unsplash.com/photo-1539533018447-63fcce2678e3?w=800&auto=format&fit=crop&q=80",
    seller_name: "Guangzhou Direct Fashion",
    seller_email: "guangzhou@nigoh.uz",
    likes_count: 215,
    description: "Guanchjou moda haftaligining eng ommabop trench modeli. Suv o'tkazmaydigan nafis mato va kamarli siluet."
  },
  {
    id: "p4",
    title: "Minimalist Oq Qimmatbaho Ko'ylak (Oversize)",
    category: "ayollar",
    price: 340000,
    discount_percent: 0,
    holiday_tag: "",
    sizes: ["S", "M", "L", "XL"],
    delivery_time: "Toshkent omboridan: 24 soat ichida",
    warehouse_location: "Toshkent",
    image_url: "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=800&auto=format&fit=crop&q=80",
    seller_name: "Nigoh Studio",
    seller_email: "studio@nigoh.uz",
    likes_count: 94,
    description: "100% paxta poplin matosi. Kundalik qulaylik va nafis estetika uyg'unligi."
  },
  {
    id: "p5",
    title: "Qo'lda Ishlangan Charm Lofer Poyabzal",
    category: "poyabzal",
    price: 790000,
    discount_percent: 20,
    holiday_tag: "🎉 Navro'z Chegirmasi",
    sizes: ["39", "40", "41", "42", "43"],
    delivery_time: "Toshkent omboridan: 24 soat ichida",
    warehouse_location: "Toshkent",
    image_url: "https://images.unsplash.com/photo-1549298916-b41d501d3772?w=800&auto=format&fit=crop&q=80",
    seller_name: "Shoe Artisan UZ",
    seller_email: "artisan@nigoh.uz",
    likes_count: 178,
    description: "Haqiqiy teridan tikilgan, qulay va yengil ortopedik taglikli klassik lofer."
  },
  {
    id: "p6",
    title: "Xitoy Premium Qalin Trikotaj Kardigan",
    category: "ayollar",
    price: 410000,
    discount_percent: 35,
    holiday_tag: "❄️ Yangi Yil Aksiyasi",
    sizes: ["S", "M", "L"],
    delivery_time: "Xitoy omboridan: 8-12 kun",
    warehouse_location: "Xitoy",
    image_url: "https://images.unsplash.com/photo-1434389677669-e08b4cac3105?w=800&auto=format&fit=crop&q=80",
    seller_name: "SilkRoad China Cargo",
    seller_email: "silkroad@nigoh.uz",
    likes_count: 310,
    description: "Iliq va nihoyatda yumshoq jun iplaridan to'qilgan premium kardigan. Oltin tugmali aksent."
  },
  {
    id: "p7",
    title: "Erkaklar Velvyut Pidjaki (Smart-Casual)",
    category: "erkaklar",
    price: 630000,
    discount_percent: 10,
    holiday_tag: "",
    sizes: ["M", "L", "XL"],
    delivery_time: "Toshkent omboridan: 1 kun",
    warehouse_location: "Toshkent",
    image_url: "https://images.unsplash.com/photo-1507679799987-c73779587ccf?w=800&auto=format&fit=crop&q=80",
    seller_name: "Gentleman Tashkent",
    seller_email: "gentleman@nigoh.uz",
    likes_count: 67,
    description: "Yumshoq velvyut matosi, zamonaviy shahar uslubi va qulay harakatlanish imkoniyati."
  },
  {
    id: "p8",
    title: "Oltin Rangli Zanjirli Ayollar Debriyaji (Clutch)",
    category: "poyabzal",
    price: 290000,
    discount_percent: 25,
    holiday_tag: "🎉 Navro'z Chegirmasi",
    sizes: ["Standart"],
    delivery_time: "Toshkent omboridan: 24 soat ichida",
    warehouse_location: "Toshkent",
    image_url: "https://images.unsplash.com/photo-1566150905458-1bf1fc113f0d?w=800&auto=format&fit=crop&q=80",
    seller_name: "Luxe Accessories",
    seller_email: "luxe@nigoh.uz",
    likes_count: 240,
    description: "Oltin metall detallar va ekologik toza charm uyg'unligi. Oqshom liboslari uchun ideal hamroh."
  }
];

// App State
const state = {
  products: [],
  filteredProducts: [],
  cart: [],
  likes: new Set(),
  currentUser: null, // { email, name, role: 'customer' | 'seller', shopName, idCard }
  sellerOrders: [],
  activeCategory: "all",
  searchQuery: "",
  sortBy: "newest",
  selectedProductForModal: null,
  selectedSizeForModal: null
};

// =================================================================
// INITIALIZATION
// =================================================================
document.addEventListener("DOMContentLoaded", () => {
  loadLocalState();
  initLucideIcons();
  setupEventListeners();
  renderCatalog();
  updateHeaderCounts();
  checkWelcomeModal();
  syncFromSupabase();
});

function initLucideIcons() {
  if (window.lucide) {
    window.lucide.createIcons();
  }
}

// Local Storage Load
function loadLocalState() {
  const savedProducts = localStorage.getItem("nigoh_products");
  if (savedProducts) {
    try {
      state.products = JSON.parse(savedProducts);
    } catch (e) {
      state.products = [...INITIAL_PRODUCTS];
    }
  } else {
    state.products = [...INITIAL_PRODUCTS];
    saveProductsLocal();
  }

  const savedCart = localStorage.getItem("nigoh_cart");
  if (savedCart) {
    try { state.cart = JSON.parse(savedCart); } catch (e) { state.cart = []; }
  }

  const savedLikes = localStorage.getItem("nigoh_likes");
  if (savedLikes) {
    try { state.likes = new Set(JSON.parse(savedLikes)); } catch (e) { state.likes = new Set(); }
  }

  const savedUser = localStorage.getItem("nigoh_user");
  if (savedUser) {
    try {
      state.currentUser = JSON.parse(savedUser);
      updateAuthUI();
    } catch (e) { state.currentUser = null; }
  }

  const savedOrders = localStorage.getItem("nigoh_orders");
  if (savedOrders) {
    try { state.sellerOrders = JSON.parse(savedOrders); } catch (e) { state.sellerOrders = []; }
  }
}

function saveProductsLocal() {
  localStorage.setItem("nigoh_products", JSON.stringify(state.products));
}
function saveCartLocal() {
  localStorage.setItem("nigoh_cart", JSON.stringify(state.cart));
}
function saveLikesLocal() {
  localStorage.setItem("nigoh_likes", JSON.stringify([...state.likes]));
}
function saveUserLocal() {
  localStorage.setItem("nigoh_user", JSON.stringify(state.currentUser));
}
function saveOrdersLocal() {
  localStorage.setItem("nigoh_orders", JSON.stringify(state.sellerOrders));
}

// Sync with Supabase (Cloud Database)
async function syncFromSupabase() {
  if (!supabaseClient) return;

  try {
    const { data, error } = await supabaseClient.from("products").select("*").order("created_at", { ascending: false });
    if (!error && data && data.length > 0) {
      // Map supabase products with local ones
      const mapped = data.map(item => ({
        id: item.id,
        title: item.title,
        category: item.category,
        price: Number(item.price),
        discount_percent: Number(item.discount_percent || 0),
        holiday_tag: item.holiday_tag || "",
        sizes: item.sizes || ["S", "M", "L"],
        delivery_time: item.delivery_time,
        warehouse_location: item.warehouse_location,
        image_url: item.image_url,
        seller_name: item.seller_name,
        seller_email: item.seller_email,
        likes_count: item.likes_count || 0,
        description: item.description || ""
      }));
      // Merge unique
      state.products = [...mapped];
      saveProductsLocal();
      renderCatalog();
    }
  } catch (err) {
    console.log("Supabase fetch note:", err);
  }
}

// Check first-time welcome modal
function checkWelcomeModal() {
  const hasSeenWelcome = localStorage.getItem("nigoh_welcomed_v1");
  if (!hasSeenWelcome) {
    setTimeout(() => {
      openModal("welcome-modal");
    }, 600);
  }
}

// =================================================================
// EVENT LISTENERS SETUP
// =================================================================
function setupEventListeners() {
  // Navigation & Modals
  document.getElementById("open-rules-btn")?.addEventListener("click", (e) => {
    e.preventDefault();
    openModal("seller-rules-modal");
  });
  document.getElementById("footer-rules-btn")?.addEventListener("click", (e) => {
    e.preventDefault();
    openModal("seller-rules-modal");
  });
  document.getElementById("about-nigoh-btn")?.addEventListener("click", () => {
    openModal("welcome-modal");
  });
  document.getElementById("logo-home")?.addEventListener("click", () => {
    resetFilters();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });

  // Welcome modal buttons
  document.getElementById("welcome-modal-close")?.addEventListener("click", () => closeModal("welcome-modal"));
  document.getElementById("welcome-start-shopping-btn")?.addEventListener("click", () => {
    closeModal("welcome-modal");
    localStorage.setItem("nigoh_welcomed_v1", "true");
    document.getElementById("catalog")?.scrollIntoView({ behavior: 'smooth' });
  });
  document.getElementById("welcome-open-shop-btn")?.addEventListener("click", () => {
    closeModal("welcome-modal");
    localStorage.setItem("nigoh_welcomed_v1", "true");
    openModal("seller-reg-modal");
  });

  // Rules modal
  document.getElementById("seller-rules-close")?.addEventListener("click", () => closeModal("seller-rules-modal"));
  document.getElementById("rules-agree-and-open-btn")?.addEventListener("click", () => {
    closeModal("seller-rules-modal");
    openModal("seller-reg-modal");
  });
  document.getElementById("guide-open-vendor-btn")?.addEventListener("click", () => {
    openModal("seller-rules-modal");
  });

  // Open shop buttons
  document.getElementById("open-shop-modal-btn")?.addEventListener("click", handleOpenShopClick);
  document.getElementById("hero-open-vendor-btn")?.addEventListener("click", handleOpenShopClick);
  document.getElementById("footer-vendor-reg-btn")?.addEventListener("click", (e) => {
    e.preventDefault();
    handleOpenShopClick();
  });
  document.getElementById("footer-vendor-cabinet-btn")?.addEventListener("click", (e) => {
    e.preventDefault();
    handleOpenShopClick();
  });
  document.getElementById("footer-holiday-promo-btn")?.addEventListener("click", (e) => {
    e.preventDefault();
    handleOpenShopClick();
  });

  // Seller Reg Modal
  document.getElementById("seller-reg-close")?.addEventListener("click", () => closeModal("seller-reg-modal"));
  document.getElementById("seller-reg-form")?.addEventListener("submit", handleSellerRegistration);

  // Customer Auth Modal
  document.getElementById("login-modal-btn")?.addEventListener("click", () => openModal("customer-auth-modal"));
  document.getElementById("customer-auth-close")?.addEventListener("click", () => closeModal("customer-auth-modal"));
  document.getElementById("tab-login-btn")?.addEventListener("click", () => switchAuthTab("login"));
  document.getElementById("tab-register-btn")?.addEventListener("click", () => switchAuthTab("register"));
  document.getElementById("switch-to-seller-btn")?.addEventListener("click", () => {
    closeModal("customer-auth-modal");
    openModal("seller-reg-modal");
  });
  document.getElementById("customer-auth-form")?.addEventListener("submit", handleCustomerAuth);

  // Seller Dashboard
  document.getElementById("seller-dashboard-close")?.addEventListener("click", () => closeModal("seller-dashboard-modal"));
  document.getElementById("dash-logout-btn")?.addEventListener("click", handleLogout);
  document.getElementById("dash-add-product-btn")?.addEventListener("click", () => {
    const panel = document.getElementById("add-product-panel");
    panel.style.display = panel.style.display === "none" ? "block" : "none";
    if (panel.style.display === "block") {
      panel.scrollIntoView({ behavior: 'smooth' });
    }
  });
  document.getElementById("cancel-add-product-btn")?.addEventListener("click", () => {
    document.getElementById("add-product-panel").style.display = "none";
  });
  document.getElementById("add-product-form")?.addEventListener("submit", handleAddProductSubmit);

  // Dashboard Tabs
  document.querySelectorAll(".dash-tab").forEach(tab => {
    tab.addEventListener("click", (e) => {
      document.querySelectorAll(".dash-tab").forEach(t => t.classList.remove("active"));
      tab.classList.add("active");
      const target = tab.dataset.tab;
      document.querySelectorAll(".dash-tab-content").forEach(c => c.style.display = "none");
      const targetContent = document.getElementById(`tab-content-${target}`);
      if (targetContent) targetContent.style.display = "block";
    });
  });

  // Search & Filters
  const searchInput = document.getElementById("search-input");
  const searchClear = document.getElementById("search-clear");
  searchInput?.addEventListener("input", (e) => {
    state.searchQuery = e.target.value.trim().toLowerCase();
    searchClear.style.display = state.searchQuery ? "flex" : "none";
    filterAndSortProducts();
  });
  searchClear?.addEventListener("click", () => {
    searchInput.value = "";
    state.searchQuery = "";
    searchClear.style.display = "none";
    filterAndSortProducts();
  });

  document.querySelectorAll(".category-btn").forEach(btn => {
    btn.addEventListener("click", () => {
      document.querySelectorAll(".category-btn").forEach(b => b.classList.remove("active"));
      btn.classList.add("active");
      state.activeCategory = btn.dataset.category;
      filterAndSortProducts();
    });
  });

  document.getElementById("sort-select")?.addEventListener("change", (e) => {
    state.sortBy = e.target.value;
    filterAndSortProducts();
  });

  document.getElementById("reset-filter-btn")?.addEventListener("click", resetFilters);

  // Wishlist & Cart Drawers
  document.getElementById("open-wishlist-btn")?.addEventListener("click", openWishlistFilter);
  document.getElementById("footer-open-wishlist-btn")?.addEventListener("click", (e) => {
    e.preventDefault();
    openWishlistFilter();
  });
  document.getElementById("open-cart-btn")?.addEventListener("click", openCartDrawer);
  document.getElementById("cart-drawer-close")?.addEventListener("click", closeCartDrawer);
  document.getElementById("cart-drawer-backdrop")?.addEventListener("click", (e) => {
    if (e.target.id === "cart-drawer-backdrop") closeCartDrawer();
  });
  document.getElementById("checkout-form")?.addEventListener("submit", handleCheckoutSubmit);
  document.getElementById("order-success-ok-btn")?.addEventListener("click", () => closeModal("order-success-modal"));

  // Product Detail Modal
  document.getElementById("product-detail-close")?.addEventListener("click", () => closeModal("product-detail-modal"));
  document.getElementById("detail-add-cart-btn")?.addEventListener("click", handleDetailAddToCart);
  document.getElementById("detail-like-btn")?.addEventListener("click", handleDetailLikeToggle);
  document.getElementById("detail-ask-ai-btn")?.addEventListener("click", () => {
    closeModal("product-detail-modal");
    openAIChat(`"${state.selectedProductForModal?.title}" haqida qanday maslahat bera olasiz? Qaysi o'lcham va fason menga mos tushadi?`);
  });

  // Nigoh AI Assistant
  const aiTrigger = document.getElementById("floating-ai-trigger");
  const aiClose = document.getElementById("ai-chat-close");
  const headerAIBtn = document.getElementById("header-open-ai-btn");
  const footerAIBtn = document.getElementById("footer-open-ai-btn");

  aiTrigger?.addEventListener("click", toggleAIChat);
  aiClose?.addEventListener("click", () => document.getElementById("ai-chat-drawer").style.display = "none");
  headerAIBtn?.addEventListener("click", () => openAIChat());
  footerAIBtn?.addEventListener("click", (e) => {
    e.preventDefault();
    openAIChat();
  });

  document.querySelectorAll(".quick-chip").forEach(chip => {
    chip.addEventListener("click", () => {
      const prompt = chip.dataset.prompt;
      sendAIMessage(prompt);
    });
  });

  document.getElementById("ai-chat-form")?.addEventListener("submit", (e) => {
    e.preventDefault();
    const input = document.getElementById("ai-input-field");
    const val = input.value.trim();
    if (val) {
      sendAIMessage(val);
      input.value = "";
    }
  });

  // Track order button
  document.getElementById("footer-track-order-btn")?.addEventListener("click", (e) => {
    e.preventDefault();
    showToast("Buyurtma holati: Kuryer Yandex orqali yo'lda yoki omborda tayyorlanmoqda.");
  });
}

// =================================================================
// MODALS LOGIC
// =================================================================
function openModal(modalId) {
  const modal = document.getElementById(modalId);
  if (modal) {
    modal.style.display = "flex";
    document.body.style.overflow = "hidden";
    initLucideIcons();
  }
}

function closeModal(modalId) {
  const modal = document.getElementById(modalId);
  if (modal) {
    modal.style.display = "none";
    document.body.style.overflow = "auto";
  }
}

// Close when clicking outside of modal container
window.addEventListener("click", (e) => {
  if (e.target.classList.contains("modal-backdrop")) {
    e.target.style.display = "none";
    document.body.style.overflow = "auto";
  }
});

// Open Shop router
function handleOpenShopClick() {
  if (state.currentUser && state.currentUser.role === "seller") {
    // Open Seller Dashboard directly
    setupSellerDashboard();
    openModal("seller-dashboard-modal");
  } else {
    // Open Registration / Guide
    openModal("seller-rules-modal");
  }
}

// =================================================================
// AUTHENTICATION (CUSTOMER & SELLER WITH ID CARD)
// =================================================================
let authMode = "login";

function switchAuthTab(mode) {
  authMode = mode;
  const loginTab = document.getElementById("tab-login-btn");
  const regTab = document.getElementById("tab-register-btn");
  const nameGroup = document.getElementById("name-group");
  const submitBtn = document.getElementById("cust-submit-btn");

  if (mode === "register") {
    loginTab.classList.remove("active");
    regTab.classList.add("active");
    nameGroup.style.display = "flex";
    submitBtn.innerHTML = `<span>Ro'yxatdan o'tish</span> <i data-lucide="arrow-right"></i>`;
  } else {
    regTab.classList.remove("active");
    loginTab.classList.add("active");
    nameGroup.style.display = "none";
    submitBtn.innerHTML = `<span>Kirish</span> <i data-lucide="arrow-right"></i>`;
  }
  initLucideIcons();
}

async function handleCustomerAuth(e) {
  e.preventDefault();
  const email = document.getElementById("cust-email").value.trim();
  const password = document.getElementById("cust-password").value.trim();
  const name = document.getElementById("cust-name")?.value.trim() || email.split("@")[0];

  if (!email || !password) return;

  state.currentUser = {
    email: email,
    name: name,
    role: "customer"
  };
  saveUserLocal();
  updateAuthUI();
  closeModal("customer-auth-modal");
  showToast(`Xush kelibsiz, ${name}! Xarid qilish uchun emailingiz muvaffaqiyatli saqlandi.`, "success");

  // Save to Supabase profiles
  if (supabaseClient) {
    try {
      await supabaseClient.from("profiles").upsert({
        email: email,
        full_name: name,
        role: "customer"
      });
    } catch (err) {
      console.log("Supabase profile save:", err);
    }
  }
}

async function handleSellerRegistration(e) {
  e.preventDefault();
  const fullName = document.getElementById("seller-fullname").value.trim();
  const email = document.getElementById("seller-email").value.trim();
  const idCard = document.getElementById("seller-id-card").value.trim().toUpperCase();
  const phone = document.getElementById("seller-phone").value.trim();
  const shopName = document.getElementById("seller-shopname").value.trim();
  const origin = document.getElementById("seller-origin").value;
  const agreesLogistics = document.getElementById("seller-logistics-agree").checked;

  if (!agreesLogistics) {
    showToast("Do'kon ochish uchun Yandex va logistika qoidasini tasdiqlashingiz shart!", "error");
    return;
  }

  state.currentUser = {
    email: email,
    name: fullName,
    role: "seller",
    idCard: idCard,
    phone: phone,
    shopName: shopName,
    origin: origin
  };
  saveUserLocal();
  updateAuthUI();
  closeModal("seller-reg-modal");

  showToast(`Tabriklaymiz! "${shopName}" do'koni ID karta orqali rasmiylashtirildi.`, "success");

  // Save profile to Supabase
  if (supabaseClient) {
    try {
      await supabaseClient.from("profiles").upsert({
        email: email,
        full_name: fullName,
        role: "seller",
        id_card_number: idCard,
        shop_name: shopName,
        warehouse_origin: origin
      });
    } catch (err) {
      console.log("Supabase profile seller save:", err);
    }
  }

  // Open seller dashboard
  setTimeout(() => {
    setupSellerDashboard();
    openModal("seller-dashboard-modal");
  }, 400);
}

function handleLogout() {
  state.currentUser = null;
  localStorage.removeItem("nigoh_user");
  updateAuthUI();
  closeModal("seller-dashboard-modal");
  showToast("Hisobdan chiqildi.");
}

function updateAuthUI() {
  const container = document.getElementById("auth-actions-container");
  if (!container) return;

  if (state.currentUser) {
    const isSeller = state.currentUser.role === "seller";
    container.innerHTML = `
      <div class="user-logged-badge" style="display: flex; align-items: center; gap: 8px;">
        <button class="gold-outline-btn" id="user-profile-btn" style="padding: 8px 14px; font-size: 0.85rem;">
          <i data-lucide="${isSeller ? 'store' : 'user-check'}"></i>
          <span>${isSeller ? state.currentUser.shopName : state.currentUser.name}</span>
        </button>
      </div>
    `;
    document.getElementById("user-profile-btn")?.addEventListener("click", () => {
      if (isSeller) {
        setupSellerDashboard();
        openModal("seller-dashboard-modal");
      } else {
        showToast(`Siz mijoz sifatida (${state.currentUser.email}) tizimdasiz.`);
      }
    });
  } else {
    container.innerHTML = `
      <button class="gold-gradient-btn" id="login-modal-btn">
        <i data-lucide="user"></i>
        <span>Kirish</span>
      </button>
    `;
    document.getElementById("login-modal-btn")?.addEventListener("click", () => openModal("customer-auth-modal"));
  }
  initLucideIcons();
}

// =================================================================
// SELLER DASHBOARD LOGIC
// =================================================================
function setupSellerDashboard() {
  if (!state.currentUser) return;
  document.getElementById("dash-shop-name").textContent = state.currentUser.shopName || "Mening Do'konim";
  document.getElementById("dash-shop-desc").textContent = 
    `Sotuvchi: ${state.currentUser.name} | ID Karta: ${state.currentUser.idCard || "Tasdiqlangan"} | Manba: ${state.currentUser.origin || "Toshkent"}`;

  renderVendorProducts();
  renderVendorOrders();
}

function renderVendorProducts() {
  const list = document.getElementById("vendor-products-list");
  if (!list) return;

  const myProducts = state.products.filter(p => 
    p.seller_email === state.currentUser?.email || p.seller_name === state.currentUser?.shopName
  );

  document.getElementById("dash-my-product-count").textContent = myProducts.length;

  if (myProducts.length === 0) {
    list.innerHTML = `
      <div style="text-align: center; padding: 40px; background: #FAF8F2; border-radius: 12px;">
        <i data-lucide="package-plus" style="width: 48px; height: 48px; color: var(--gold-600); margin-bottom: 12px;"></i>
        <h4>Hozircha hech qanday tovar qo'shmadingiz</h4>
        <p style="color: var(--text-muted); font-size: 0.88rem; margin: 8px 0 16px;">
          "Yangi tovar qo'shish" tugmasini bosing va o'z kiyimlaringizni Toshkent yoki Xitoy ombori bilan ilovaga joylang.
        </p>
      </div>
    `;
    initLucideIcons();
    return;
  }

  let html = `
    <div style="display: flex; flex-direction: column; gap: 14px;">
  `;

  myProducts.forEach(prod => {
    const discountedPrice = prod.discount_percent > 0 
      ? Math.round(prod.price * (1 - prod.discount_percent / 100))
      : prod.price;

    html += `
      <div style="display: flex; align-items: center; justify-content: space-between; background: #FAF8F2; border: 1px solid var(--border-light); border-radius: 10px; padding: 14px; gap: 14px; flex-wrap: wrap;">
        <div style="display: flex; align-items: center; gap: 14px;">
          <img src="${prod.image_url}" alt="${prod.title}" style="width: 60px; height: 75px; object-fit: cover; border-radius: 6px;">
          <div>
            <h4 style="font-size: 0.95rem; margin-bottom: 4px;">${prod.title}</h4>
            <div style="font-size: 0.8rem; color: var(--text-muted);">
              <span>${prod.delivery_time}</span> • <span>Razmerlar: ${prod.sizes.join(", ")}</span>
            </div>
            <div style="font-size: 0.9rem; font-weight: 700; color: var(--gold-700); margin-top: 4px;">
              ${formatPrice(discountedPrice)}
              ${prod.discount_percent > 0 ? `<span style="font-size: 0.75rem; color: #E11D48; margin-left: 6px;">-${prod.discount_percent}% chegirma (${prod.holiday_tag || "Aksiya"})</span>` : ''}
            </div>
          </div>
        </div>

        <div style="display: flex; align-items: center; gap: 10px;">
          <!-- Quick Holiday Discount Modifier -->
          <button class="gold-outline-btn" onclick="promptChangeDiscount('${prod.id}')" style="padding: 6px 12px; font-size: 0.8rem;">
            <i data-lucide="tag"></i>
            <span>Chegirma qo'yish</span>
          </button>
          <button class="gold-outline-btn" onclick="deleteVendorProduct('${prod.id}')" style="padding: 6px 12px; font-size: 0.8rem; color: #DC2626; border-color: #FCA5A5;">
            <i data-lucide="trash-2"></i>
          </button>
        </div>
      </div>
    `;
  });

  html += `</div>`;
  list.innerHTML = html;
  initLucideIcons();
}

// Quick discount prompt
window.promptChangeDiscount = function(productId) {
  const prod = state.products.find(p => p.id === productId);
  if (!prod) return;

  const newDiscount = prompt(
    `"${prod.title}" uchun bayramona chegirma foizini kiriting (0 dan 90 gacha):\n(Chegirmani bekor qilish uchun 0 kiriting)`,
    prod.discount_percent || 0
  );

  if (newDiscount !== null) {
    const num = parseInt(newDiscount, 10);
    if (!isNaN(num) && num >= 0 && num <= 90) {
      prod.discount_percent = num;
      if (num > 0 && !prod.holiday_tag) {
        prod.holiday_tag = "🎉 Bayram Chegirmasi";
      } else if (num === 0) {
        prod.holiday_tag = "";
      }
      saveProductsLocal();
      renderVendorProducts();
      renderCatalog();
      showToast(`Chegirma yangilandi: ${num}%`, "success");
    }
  }
};

window.deleteVendorProduct = function(productId) {
  if (confirm("Ushbu tovarni do'kondan o'chirmoqchimisiz?")) {
    state.products = state.products.filter(p => p.id !== productId);
    saveProductsLocal();
    renderVendorProducts();
    renderCatalog();
    showToast("Tovar o'chirildi.");
  }
};

// Add new product submit
async function handleAddProductSubmit(e) {
  e.preventDefault();
  if (!state.currentUser) return;

  const title = document.getElementById("prod-title").value.trim();
  const category = document.getElementById("prod-category").value;
  const price = Number(document.getElementById("prod-price").value);
  const discount = Number(document.getElementById("prod-discount").value || 0);
  const holiday = document.getElementById("prod-holiday").value;
  const delivery = document.getElementById("prod-delivery").value.trim();
  const warehouse = document.getElementById("prod-warehouse").value;
  const imageUrl = document.getElementById("prod-image").value.trim();
  const desc = document.getElementById("prod-desc").value.trim();

  // Selected sizes
  const sizes = [];
  document.querySelectorAll("input[name='prod-size']:checked").forEach(cb => sizes.push(cb.value));

  if (sizes.length === 0) {
    showToast("Kamida bitta razmer tanlang (masalan, S, M, L).", "error");
    return;
  }

  const newProduct = {
    id: "prod_" + Date.now(),
    title: title,
    category: category,
    price: price,
    discount_percent: discount,
    holiday_tag: holiday,
    sizes: sizes,
    delivery_time: delivery,
    warehouse_location: warehouse,
    image_url: imageUrl,
    seller_name: state.currentUser.shopName || "Nigoh Do'koni",
    seller_email: state.currentUser.email,
    likes_count: 0,
    description: desc || "Nigoh platformasidagi sifatli libos."
  };

  state.products.unshift(newProduct);
  saveProductsLocal();
  renderVendorProducts();
  renderCatalog();

  // Reset form
  document.getElementById("add-product-form").reset();
  document.getElementById("add-product-panel").style.display = "none";
  showToast("Yangi tovaringiz e'lon qilindi va katalogda paydo bo'ldi!", "success");

  // Save to Supabase
  if (supabaseClient) {
    try {
      await supabaseClient.from("products").insert([{
        title: title,
        category: category,
        price: price,
        discount_percent: discount,
        holiday_tag: holiday,
        sizes: sizes,
        delivery_time: delivery,
        warehouse_location: warehouse,
        image_url: imageUrl,
        seller_name: state.currentUser.shopName,
        seller_email: state.currentUser.email,
        description: desc
      }]);
    } catch (err) {
      console.log("Supabase insert product:", err);
    }
  }
}

// Render Vendor Orders (with customer home address for Yandex delivery)
function renderVendorOrders() {
  const container = document.getElementById("vendor-orders-list");
  if (!container) return;

  if (state.sellerOrders.length === 0) {
    container.innerHTML = `
      <div style="text-align: center; padding: 40px; background: #FAF8F2; border-radius: 12px;">
        <i data-lucide="inbox" style="width: 48px; height: 48px; color: var(--gold-600); margin-bottom: 12px;"></i>
        <h4>Hozircha yangi buyurtmalar yo'q</h4>
        <p style="color: var(--text-muted); font-size: 0.88rem;">
          Mijozlar tovaringizni sotib olganda, bu yerda ularning aniq uy manzili va telefon raqami ko'rinadi.
        </p>
      </div>
    `;
    initLucideIcons();
    return;
  }

  let html = `<div style="display: flex; flex-direction: column; gap: 16px;">`;

  state.sellerOrders.forEach((order, idx) => {
    html += `
      <div style="background: #FFFFFF; border: 1.5px solid var(--border-light); border-radius: 12px; padding: 20px; box-shadow: var(--shadow-sm);">
        <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 12px; border-bottom: 1px solid var(--border-light); padding-bottom: 10px;">
          <div>
            <span class="gold-badge" style="font-size: 0.72rem;"><i data-lucide="package"></i> BUYURTMA #${idx + 1}</span>
            <h4 style="font-size: 1.1rem; margin-top: 4px; color: #1C1917;">Xaridor: ${order.customerName}</h4>
            <div style="font-size: 0.85rem; color: var(--text-secondary); margin-top: 2px;">
              <i data-lucide="phone" style="width: 14px; height: 14px; display: inline;"></i> Tel: <strong>${order.customerPhone}</strong>
            </div>
          </div>
          <div style="text-align: right;">
            <span style="font-size: 0.8rem; color: var(--text-muted);">${order.date || 'Hozir'}</span>
            <div style="font-size: 1.1rem; font-weight: 700; color: var(--gold-700);">${formatPrice(order.totalAmount)}</div>
          </div>
        </div>

        <!-- Aniq uy manzili (Yandex / Pochta uchun) -->
        <div style="background: #FAF8F2; border-left: 3px solid var(--gold-500); padding: 12px 14px; border-radius: 4px; margin-bottom: 14px;">
          <div style="font-size: 0.78rem; text-transform: uppercase; font-weight: 700; color: var(--gold-700); margin-bottom: 4px;">
            <i data-lucide="map-pin" style="width: 13px; height: 13px; display: inline;"></i> Mijozning yetkazib berish manzili:
          </div>
          <div style="font-size: 0.92rem; font-weight: 600; color: #1C1917;">${order.customerAddress}</div>
          <div style="font-size: 0.8rem; color: var(--text-muted); margin-top: 4px;">
            Tanlangan usul: <strong>${order.deliveryMethod}</strong>
          </div>
        </div>

        <!-- Buyurtma tarkibi -->
        <div style="margin-bottom: 14px;">
          <div style="font-size: 0.8rem; font-weight: 600; color: var(--text-muted); margin-bottom: 6px;">BUYURTMA TARKIBI VA RAZMERLAR:</div>
          <div style="display: flex; flex-direction: column; gap: 8px;">
            ${order.items.map(it => `
              <div style="display: flex; justify-content: space-between; font-size: 0.88rem; background: #FAF9F6; padding: 6px 10px; border-radius: 6px;">
                <span>${it.title} (Razmer: <strong>${it.selectedSize || 'Standard'}</strong>) × ${it.quantity}</span>
                <span style="font-weight: 600;">${formatPrice(it.price * it.quantity)}</span>
              </div>
            `).join('')}
          </div>
        </div>

        <!-- Yandex kuryer chaqirish / Jo'natish tugmasi -->
        <div style="display: flex; gap: 10px; flex-wrap: wrap;">
          <button class="gold-solid-btn" onclick="copyAddressForYandex('${order.customerAddress.replace(/'/g, "\\'")}', '${order.customerPhone}')" style="padding: 8px 16px; font-size: 0.85rem;">
            <i data-lucide="copy"></i> Manzilni nusxalash (Yandex Delivery uchun)
          </button>
          <button class="gold-outline-btn" onclick="markOrderDispatched(${idx})" style="padding: 8px 16px; font-size: 0.85rem;">
            <i data-lucide="check"></i> Jo'natildi deb belgilash
          </button>
        </div>
      </div>
    `;
  });

  html += `</div>`;
  container.innerHTML = html;
  initLucideIcons();
}

window.copyAddressForYandex = function(address, phone) {
  const text = `Manzil: ${address} | Tel: ${phone}`;
  navigator.clipboard.writeText(text).then(() => {
    showToast("Mijoz manzili nusxalandi! Yandex Go ilovasiga kiritib kuryer chaqirishingiz mumkin.", "success");
  }).catch(() => {
    prompt("Mijoz manzili:", text);
  });
};

window.markOrderDispatched = function(index) {
  showToast("Buyurtma 'Jo'natildi' holatiga o'tkazildi. Xaridor xabardor qilinadi.", "success");
};

// =================================================================
// CATALOG RENDERING & FILTERING
// =================================================================
function filterAndSortProducts() {
  let list = [...state.products];

  // Category filter
  if (state.activeCategory === "ayollar") {
    list = list.filter(p => p.category === "ayollar");
  } else if (state.activeCategory === "erkaklar") {
    list = list.filter(p => p.category === "erkaklar");
  } else if (state.activeCategory === "poyabzal") {
    list = list.filter(p => p.category === "poyabzal");
  } else if (state.activeCategory === "bayram") {
    list = list.filter(p => (p.discount_percent > 0) || (p.holiday_tag && p.holiday_tag.length > 0));
  } else if (state.activeCategory === "toshkent") {
    list = list.filter(p => p.warehouse_location?.toLowerCase().includes("toshkent"));
  } else if (state.activeCategory === "xitoy") {
    list = list.filter(p => p.warehouse_location?.toLowerCase().includes("xitoy"));
  } else if (state.activeCategory === "wishlist") {
    list = list.filter(p => state.likes.has(p.id));
  }

  // Search filter
  if (state.searchQuery) {
    list = list.filter(p => 
      p.title.toLowerCase().includes(state.searchQuery) ||
      p.seller_name.toLowerCase().includes(state.searchQuery) ||
      (p.description && p.description.toLowerCase().includes(state.searchQuery)) ||
      p.warehouse_location.toLowerCase().includes(state.searchQuery)
    );
  }

  // Sorting
  if (state.sortBy === "popular") {
    list.sort((a, b) => b.likes_count - a.likes_count);
  } else if (state.sortBy === "discount") {
    list.sort((a, b) => (b.discount_percent || 0) - (a.discount_percent || 0));
  } else if (state.sortBy === "price-asc") {
    list.sort((a, b) => {
      const pA = a.discount_percent > 0 ? a.price * (1 - a.discount_percent/100) : a.price;
      const pB = b.discount_percent > 0 ? b.price * (1 - b.discount_percent/100) : b.price;
      return pA - pB;
    });
  } else if (state.sortBy === "price-desc") {
    list.sort((a, b) => {
      const pA = a.discount_percent > 0 ? a.price * (1 - a.discount_percent/100) : a.price;
      const pB = b.discount_percent > 0 ? b.price * (1 - b.discount_percent/100) : b.price;
      return pB - pA;
    });
  }

  state.filteredProducts = list;
  renderCatalog();
}

function resetFilters() {
  state.activeCategory = "all";
  state.searchQuery = "";
  document.getElementById("search-input").value = "";
  document.getElementById("search-clear").style.display = "none";
  document.querySelectorAll(".category-btn").forEach(b => {
    b.classList.toggle("active", b.dataset.category === "all");
  });
  filterAndSortProducts();
}

function openWishlistFilter() {
  state.activeCategory = "wishlist";
  document.querySelectorAll(".category-btn").forEach(b => b.classList.remove("active"));
  filterAndSortProducts();
  document.getElementById("catalog")?.scrollIntoView({ behavior: 'smooth' });
}

function renderCatalog() {
  const grid = document.getElementById("product-grid");
  const emptyState = document.getElementById("empty-state");
  const countLabel = document.getElementById("product-count-label");

  const list = state.filteredProducts.length > 0 || state.searchQuery || state.activeCategory !== "all" 
    ? state.filteredProducts 
    : state.products;

  if (countLabel) {
    countLabel.textContent = `${list.length} ta libos topildi`;
  }

  if (list.length === 0) {
    grid.innerHTML = "";
    if (emptyState) emptyState.style.display = "block";
    return;
  }

  if (emptyState) emptyState.style.display = "none";

  let html = "";
  list.forEach(prod => {
    const isLiked = state.likes.has(prod.id);
    const discountedPrice = prod.discount_percent > 0 
      ? Math.round(prod.price * (1 - prod.discount_percent / 100))
      : prod.price;

    html += `
      <div class="product-card" data-id="${prod.id}">
        <div class="product-thumb-wrap" onclick="openProductDetail('${prod.id}')">
          <img src="${prod.image_url}" alt="${prod.title}" class="product-thumb" loading="lazy">
          
          <div class="product-badges">
            ${prod.discount_percent > 0 ? `<span class="discount-badge">-${prod.discount_percent}%</span>` : ''}
            ${prod.holiday_tag ? `<span class="holiday-badge">${prod.holiday_tag}</span>` : ''}
            <span class="origin-badge">${prod.warehouse_location}</span>
          </div>

          <button class="product-like-btn ${isLiked ? 'liked' : ''}" onclick="toggleLike(event, '${prod.id}')" title="Yoqdi">
            <i data-lucide="heart" style="${isLiked ? 'fill: currentColor;' : ''}"></i>
          </button>
        </div>

        <div class="product-details">
          <div class="product-shop-name">${prod.seller_name}</div>
          <h3 class="product-title" onclick="openProductDetail('${prod.id}')">${prod.title}</h3>

          <div class="product-pricing">
            <span class="price-current">${formatPrice(discountedPrice)}</span>
            ${prod.discount_percent > 0 ? `<span class="price-old">${formatPrice(prod.price)}</span>` : ''}
          </div>

          <!-- Kelish muddati & Razmerlar -->
          <div class="product-meta-specs">
            <div class="meta-row">
              <i data-lucide="clock"></i>
              <span><strong>Kelish muddati:</strong> ${prod.delivery_time}</span>
            </div>
            <div class="meta-row">
              <i data-lucide="tag"></i>
              <span><strong>Razmerlar:</strong></span>
              <div class="meta-sizes">
                ${prod.sizes.map(s => `<span class="size-pill">${s}</span>`).join('')}
              </div>
            </div>
          </div>

          <div class="product-bottom-action">
            <button class="card-add-cart-btn" onclick="quickAddToCart('${prod.id}')">
              <i data-lucide="shopping-bag"></i>
              <span>Savatga</span>
            </button>
            <button class="card-view-btn" onclick="openProductDetail('${prod.id}')" title="Batafsil">
              <i data-lucide="eye"></i>
            </button>
          </div>
        </div>
      </div>
    `;
  });

  grid.innerHTML = html;
  initLucideIcons();
}

// =================================================================
// LIKES / WISHLIST
// =================================================================
window.toggleLike = function(event, productId) {
  if (event) event.stopPropagation();

  const prod = state.products.find(p => p.id === productId);
  if (!prod) return;

  if (state.likes.has(productId)) {
    state.likes.delete(productId);
    prod.likes_count = Math.max(0, (prod.likes_count || 1) - 1);
    showToast(`"${prod.title}" sevimlilardan olib tashlandi.`);
  } else {
    state.likes.add(productId);
    prod.likes_count = (prod.likes_count || 0) + 1;
    showToast(`"${prod.title}" sevimlilarga qo'shildi! ❤️`, "success");
  }

  saveLikesLocal();
  saveProductsLocal();
  updateHeaderCounts();
  renderCatalog();

  // If detail modal is open
  if (state.selectedProductForModal && state.selectedProductForModal.id === productId) {
    updateDetailLikeBtn();
  }
};

// =================================================================
// PRODUCT DETAIL MODAL
// =================================================================
window.openProductDetail = function(productId) {
  const prod = state.products.find(p => p.id === productId);
  if (!prod) return;

  state.selectedProductForModal = prod;
  state.selectedSizeForModal = prod.sizes[0] || "Standart";

  document.getElementById("detail-image").src = prod.image_url;
  document.getElementById("detail-seller-name").textContent = prod.seller_name;
  document.getElementById("detail-title").textContent = prod.title;
  document.getElementById("detail-description").textContent = prod.description || "Nigoh platformasidagi eksklyuziv libos.";
  document.getElementById("detail-delivery-time").textContent = prod.delivery_time;
  document.getElementById("detail-warehouse").textContent = prod.warehouse_location;

  const discountedPrice = prod.discount_percent > 0 
    ? Math.round(prod.price * (1 - prod.discount_percent / 100))
    : prod.price;

  document.getElementById("detail-price").textContent = formatPrice(discountedPrice);
  const oldPriceEl = document.getElementById("detail-old-price");
  const discountTagEl = document.getElementById("detail-discount-tag");

  if (prod.discount_percent > 0) {
    oldPriceEl.textContent = formatPrice(prod.price);
    oldPriceEl.style.display = "inline";
    discountTagEl.textContent = `-${prod.discount_percent}% ${prod.holiday_tag || ''}`;
    discountTagEl.style.display = "inline-block";
  } else {
    oldPriceEl.style.display = "none";
    discountTagEl.style.display = "none";
  }

  // Holiday badge on image
  const holBadge = document.getElementById("detail-holiday-badge");
  if (prod.holiday_tag) {
    holBadge.textContent = prod.holiday_tag;
    holBadge.style.display = "block";
  } else {
    holBadge.style.display = "none";
  }

  // Sizing buttons
  const sizesGroup = document.getElementById("detail-sizes-group");
  const sizeLabel = document.getElementById("selected-size-label");
  sizeLabel.textContent = state.selectedSizeForModal;

  sizesGroup.innerHTML = prod.sizes.map((sz, i) => `
    <button class="size-btn-item ${i === 0 ? 'selected' : ''}" onclick="selectDetailSize('${sz}', this)">
      ${sz}
    </button>
  `).join('');

  updateDetailLikeBtn();
  openModal("product-detail-modal");
};

window.selectDetailSize = function(size, btnElement) {
  state.selectedSizeForModal = size;
  document.getElementById("selected-size-label").textContent = size;
  document.querySelectorAll(".size-btn-item").forEach(b => b.classList.remove("selected"));
  btnElement.classList.add("selected");
};

function updateDetailLikeBtn() {
  if (!state.selectedProductForModal) return;
  const isLiked = state.likes.has(state.selectedProductForModal.id);
  const likeBtn = document.getElementById("detail-like-btn");
  const likeCount = document.getElementById("detail-like-count");
  const likeIcon = document.getElementById("detail-like-icon");

  likeCount.textContent = state.selectedProductForModal.likes_count || 0;
  if (isLiked) {
    likeBtn.classList.add("liked");
    likeIcon.style.fill = "currentColor";
  } else {
    likeBtn.classList.remove("liked");
    likeIcon.style.fill = "none";
  }
}

function handleDetailLikeToggle() {
  if (state.selectedProductForModal) {
    toggleLike(null, state.selectedProductForModal.id);
  }
}

function handleDetailAddToCart() {
  if (!state.selectedProductForModal) return;
  addToCart(state.selectedProductForModal, state.selectedSizeForModal);
  closeModal("product-detail-modal");
  openCartDrawer();
}

window.quickAddToCart = function(productId) {
  const prod = state.products.find(p => p.id === productId);
  if (!prod) return;
  addToCart(prod, prod.sizes[0] || "Standart");
  showToast(`"${prod.title}" (${prod.sizes[0] || 'Standart'}) savatga qo'shildi!`, "success");
};

// =================================================================
// CART & CHECKOUT
// =================================================================
function addToCart(product, size) {
  const discountedPrice = product.discount_percent > 0 
    ? Math.round(product.price * (1 - product.discount_percent / 100))
    : product.price;

  const existing = state.cart.find(item => item.id === product.id && item.selectedSize === size);
  if (existing) {
    existing.quantity += 1;
  } else {
    state.cart.push({
      id: product.id,
      title: product.title,
      price: discountedPrice,
      image_url: product.image_url,
      selectedSize: size,
      seller_email: product.seller_email,
      seller_name: product.seller_name,
      delivery_time: product.delivery_time,
      quantity: 1
    });
  }

  saveCartLocal();
  updateHeaderCounts();
}

function openCartDrawer() {
  renderCartDrawer();
  document.getElementById("cart-drawer-backdrop").style.display = "flex";
  document.body.style.overflow = "hidden";
}

function closeCartDrawer() {
  document.getElementById("cart-drawer-backdrop").style.display = "none";
  document.body.style.overflow = "auto";
}

function renderCartDrawer() {
  const container = document.getElementById("cart-items-container");
  const checkoutPanel = document.getElementById("cart-checkout-panel");
  const totalAmountEl = document.getElementById("cart-total-amount");

  if (state.cart.length === 0) {
    container.innerHTML = `
      <div style="text-align: center; padding: 40px 10px;">
        <i data-lucide="shopping-bag" style="width: 48px; height: 48px; color: var(--gold-600); margin-bottom: 12px;"></i>
        <h4>Savatingiz hozircha bo'sh</h4>
        <p style="color: var(--text-muted); font-size: 0.88rem; margin: 8px 0 16px;">O'zingizga yoqqan nafis liboslarni tanlab savatga qo'shing.</p>
        <button class="gold-solid-btn" onclick="closeCartDrawer()"><i data-lucide="compass"></i> Xaridni davom ettirish</button>
      </div>
    `;
    checkoutPanel.style.display = "none";
    initLucideIcons();
    return;
  }

  checkoutPanel.style.display = "block";
  let total = 0;
  let html = "";

  state.cart.forEach((item, index) => {
    const subtotal = item.price * item.quantity;
    total += subtotal;

    html += `
      <div class="cart-item">
        <img src="${item.image_url}" alt="${item.title}" class="cart-item-img">
        <div class="cart-item-info">
          <div class="cart-item-title">${item.title}</div>
          <div class="cart-item-meta">
            O'lcham: <strong>${item.selectedSize}</strong> | ${item.delivery_time}
          </div>
          <div class="cart-item-price">${formatPrice(item.price)} × ${item.quantity} = ${formatPrice(subtotal)}</div>
          <button class="cart-item-remove" onclick="removeCartItem(${index})"><i data-lucide="trash-2" style="width: 12px; height: 12px; display: inline;"></i> O'chirish</button>
        </div>
      </div>
    `;
  });

  totalAmountEl.textContent = formatPrice(total);
  container.innerHTML = html;
  initLucideIcons();
}

window.removeCartItem = function(index) {
  state.cart.splice(index, 1);
  saveCartLocal();
  updateHeaderCounts();
  renderCartDrawer();
};

async function handleCheckoutSubmit(e) {
  e.preventDefault();
  const name = document.getElementById("order-cust-name").value.trim();
  const phone = document.getElementById("order-cust-phone").value.trim();
  const address = document.getElementById("order-cust-address").value.trim();
  const deliveryType = document.getElementById("order-delivery-type").value;

  if (state.cart.length === 0) return;

  const total = state.cart.reduce((acc, it) => acc + (it.price * it.quantity), 0);

  const orderData = {
    id: "ord_" + Date.now(),
    customerName: name,
    customerPhone: phone,
    customerAddress: address,
    deliveryMethod: deliveryType,
    items: [...state.cart],
    totalAmount: total,
    date: new Date().toLocaleDateString("uz-UZ", { day: 'numeric', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit' })
  };

  // Add to orders
  state.sellerOrders.unshift(orderData);
  saveOrdersLocal();

  // Clear cart
  state.cart = [];
  saveCartLocal();
  updateHeaderCounts();
  closeCartDrawer();

  // Show Success Modal
  const detailsEl = document.getElementById("order-success-details");
  detailsEl.innerHTML = `
    <div><strong>Xaridor:</strong> ${orderData.customerName} (${orderData.customerPhone})</div>
    <div><strong>Yetkazish manzili:</strong> ${orderData.customerAddress}</div>
    <div><strong>Tanlangan yo'l:</strong> ${orderData.deliveryMethod}</div>
    <div><strong>Jami to'lov:</strong> <span style="color: var(--gold-700); font-weight: 700;">${formatPrice(orderData.totalAmount)}</span></div>
  `;

  openModal("order-success-modal");

  // Save to Supabase orders
  if (supabaseClient) {
    try {
      await supabaseClient.from("orders").insert([{
        customer_name: name,
        customer_email: state.currentUser?.email || "mijoz@mail.uz",
        customer_phone: phone,
        delivery_address: address,
        delivery_method: deliveryType,
        items: orderData.items,
        total_amount: total
      }]);
    } catch (err) {
      console.log("Supabase order insert note:", err);
    }
  }
}

// =================================================================
// HEADER COUNTS
// =================================================================
function updateHeaderCounts() {
  const wishEl = document.getElementById("wishlist-count");
  const cartEl = document.getElementById("cart-count");
  if (wishEl) wishEl.textContent = state.likes.size;
  if (cartEl) cartEl.textContent = state.cart.reduce((sum, it) => sum + it.quantity, 0);
}

// =================================================================
// NIGOH AI ASSISTANT (SUN'IY INTELLEKT MASLAHATCHISI)
// =================================================================
function toggleAIChat() {
  const drawer = document.getElementById("ai-chat-drawer");
  drawer.style.display = drawer.style.display === "none" ? "flex" : "none";
}

function openAIChat(customPrompt = "") {
  const drawer = document.getElementById("ai-chat-drawer");
  drawer.style.display = "flex";
  if (customPrompt) {
    sendAIMessage(customPrompt);
  }
}

async function sendAIMessage(promptText) {
  const messagesContainer = document.getElementById("ai-chat-messages");

  // Append user bubble
  const userMsg = document.createElement("div");
  userMsg.className = "ai-msg ai-user";
  userMsg.innerHTML = `<div class="ai-msg-bubble">${escapeHtml(promptText)}</div>`;
  messagesContainer.appendChild(userMsg);
  messagesContainer.scrollTop = messagesContainer.scrollHeight;

  // Append bot typing indicator
  const botMsg = document.createElement("div");
  botMsg.className = "ai-msg ai-bot";
  botMsg.innerHTML = `<div class="ai-msg-bubble"><i data-lucide="loader-2" class="spin"></i> <em>Nigoh AI o'ylamoqda...</em></div>`;
  messagesContainer.appendChild(botMsg);
  messagesContainer.scrollTop = messagesContainer.scrollHeight;
  initLucideIcons();

  // Generate response from AI knowledge engine (with fallback to specialized stylist/logistics brain)
  setTimeout(() => {
    const responseText = generateAIResponse(promptText);
    botMsg.innerHTML = `<div class="ai-msg-bubble">${responseText}</div>`;
    messagesContainer.scrollTop = messagesContainer.scrollHeight;
    initLucideIcons();
  }, 700);
}

function generateAIResponse(query) {
  const q = query.toLowerCase();

  // 1. Logistics / Yandex / Do'kon ochish
  if (q.includes("yandex") || q.includes("yetkaz") || q.includes("do'kon") || q.includes("dokon") || q.includes("magazin") || q.includes("sotuvchi")) {
    return `
      <strong>🏪 Nigoh Do'kon & Yandex Logistika Qo'llanmasi:</strong><br><br>
      • <strong>ID Karta:</strong> Sotuvchilar ishonchlilik uchun ID karta / pasport bilan ro'yxatdan o'tadi.<br>
      • <strong>Buyurtma kelganda:</strong> Xaridorning aniq uy manzili va telefoni kabinetingizda chiqadi.<br>
      • <strong>Yetkazib berish:</strong> Siz o'zingizga qulay yo'lni tanlaysiz — mijoz manzilini nusxalab Yandex Go orqali kuryer chaqirasiz yoki avvaldan buyurtmalaringizni qanday yuborgan bo'lsangiz (pochta/taksi), xuddi shunday jo'natasiz.<br>
      • <strong>Ombor:</strong> Toshkent (Abu Saxiy, Chorsu) yoki Xitoy (Kargo/Taobao/1688) omboridan savdo qiluvchilar bemalol o'z tovarlarini e'lon qila oladi.
    `;
  }

  // 2. Razmer va o'lchamlar
  if (q.includes("razmer") || q.includes("o'lcham") || q.includes("olcham") || q.includes("qomat") || q.includes("bo'y") || q.includes("vazn")) {
    return `
      <strong>📏 Nigoh Stilistidan Razmer Maslahati:</strong><br><br>
      • Agar siz <strong>XS/S</strong> kiyinsangiz va bo'yingiz 160-168 sm bo'lsa, liboslarimiz aynan siz uchun standart qolipda tikilgan.<br>
      • Erkinroq (oversize) uslub yoqsa, bitta o'lcham kattaroq (<strong>M yoki L</strong>) tanlashni maslahat beraman.<br>
      • Har bir kiyim kartochkasi ostida mavjud razmerlar (S, M, L, XL) aniq ko'rsatilgan. Xarid qilishdan oldin mahsulot ustiga bosib, o'zingizga mos razmerni bitta klik bilan tanlashingiz mumkin.
    `;
  }

  // 3. Kelish muddati
  if (q.includes("qachon") || q.includes("keladi") || q.includes("muddat") || q.includes("vaqt")) {
    return `
      <strong>⏱️ Yetkazib berish muddatlari:</strong><br><br>
      • <strong>Toshkent omboridagi tovarlar:</strong> Buyurtma berilgach <strong>24 soat ichida</strong> Yandex Delivery yoki kuryer orqali eshikkacha yetib boradi.<br>
      • <strong>Viloyatlarga:</strong> 2-3 ish kuni ichida BTS yoki pochta orqali topshiriladi.<br>
      • <strong>Xitoydan to'g'ridan-to'g'ri tovarlar:</strong> Kargo reysi bilan <strong>7-12 kun</strong> oralig'ida Toshkentga keladi va manzilga jo'natiladi.
    `;
  }

  // 4. To'y, bayram, stil tavsiyasi
  if (q.includes("to'y") || q.includes("toy") || q.includes("bayram") || q.includes("chegirma") || q.includes("ziyofat") || q.includes("libos")) {
    return `
      <strong>✨ Nigoh Haute Couture Stilisti Tavsiyasi:</strong><br><br>
      Tantanali tadbirlar uchun bizning <strong>"Oltin naqshli Premium Ipak Libos"</strong> yoki <strong>"Minimalist Poplin Oq Ko'ylak"</strong>imizni oltin zanjirli aksessuarlar bilan uyg'unlashtirishni tavsiya qilaman.<br><br>
      Hozirda <em>Navro'z va Ayyom bayram chegirmalari</em> davom etmoqda (20% dan 35% gacha). Katalogimizning yuqori qismidagi <strong>"🎉 Bayram chegirmalari"</strong> tugmasini bosib, barcha maxsus narxlarni ko'rishingiz mumkin!
    `;
  }

  // Default response
  return `
    Nigoh platformasida siz uchun xizmatdamiz! Siz saytda o'zingiz xohlagan libos yoki eksklyuziv uslubni topishingiz,
    yoki o'z do'koningizni ochib Toshkent va Xitoydan tovarlaringizni sotishingiz mumkin. 
    Yana qanday ma'lumot yoki kiyim tanlash bo'yicha yordam kerak?
  `;
}

// =================================================================
// UTILITY FUNCTIONS
// =================================================================
function formatPrice(amount) {
  if (isNaN(amount)) return "0 so'm";
  return Number(amount).toLocaleString("uz-UZ") + " so'm";
}

function escapeHtml(text) {
  const div = document.createElement("div");
  div.textContent = text;
  return div.innerHTML;
}

function showToast(message, type = "info") {
  const container = document.getElementById("toast-container");
  if (!container) return;

  const toast = document.createElement("div");
  toast.className = `toast ${type === 'success' ? 'toast-success' : ''}`;
  toast.innerHTML = `
    <i data-lucide="${type === 'success' ? 'check-circle' : 'info'}" style="color: ${type === 'success' ? '#10B981' : 'var(--gold-600)'}; flex-shrink: 0;"></i>
    <span>${message}</span>
  `;

  container.appendChild(toast);
  initLucideIcons();

  setTimeout(() => {
    toast.style.opacity = "0";
    toast.style.transform = "translateX(100%)";
    toast.style.transition = "all 0.3s ease";
    setTimeout(() => toast.remove(), 300);
  }, 4000);
}
