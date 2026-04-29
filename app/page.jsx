"use client";

import { useEffect, useMemo, useState } from "react";

const steps = ["Plan", "Days", "Live Food", "Payment", "Review"];

const fallbackRestaurants = [
  {
    id: "mock-fresh-bowl",
    name: "Fresh Bowl Co.",
    meta: "Healthy • Bowls • 25 mins",
    rating: "4.4",
    availabilityStatus: "OPEN",
    emoji: "🥗",
    dishes: [
      { id: "fb-1", name: "Paneer Rice Bowl", price: 219, emoji: "🥗" },
      { id: "fb-2", name: "Protein Veg Bowl", price: 249, emoji: "🥙" },
      { id: "fb-3", name: "Chole Quinoa Bowl", price: 229, emoji: "🍲" }
    ]
  },
  {
    id: "mock-biryani-house",
    name: "Biryani House",
    meta: "Biryani • North Indian • 32 mins",
    rating: "4.2",
    availabilityStatus: "OPEN",
    emoji: "🍛",
    dishes: [
      { id: "bh-1", name: "Chicken Biryani", price: 289, emoji: "🍛" },
      { id: "bh-2", name: "Veg Biryani", price: 229, emoji: "🥘" },
      { id: "bh-3", name: "Paneer Biryani", price: 259, emoji: "🍱" }
    ]
  },
  {
    id: "mock-homely-meals",
    name: "Homely Meals",
    meta: "Indian Meals • Thali • 20 mins",
    rating: "4.5",
    availabilityStatus: "OPEN",
    emoji: "🍚",
    dishes: [
      { id: "hm-1", name: "Rajma Chawal", price: 179, emoji: "🍚" },
      { id: "hm-2", name: "Dal Khichdi", price: 159, emoji: "🥘" },
      { id: "hm-3", name: "Veg Thali", price: 229, emoji: "🍽️" }
    ]
  }
];

const mayDays = Array.from({ length: 31 }, (_, index) => {
  const date = new Date(Date.UTC(2026, 4, index + 1));
  return {
    date: `2026-05-${String(index + 1).padStart(2, "0")}`,
    label: String(index + 1),
    day: ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"][date.getUTCDay()]
  };
});

const styles = {
  page: {
    minHeight: "100vh",
    background: "radial-gradient(circle at top left, #fff0dc 0, #f8fafc 34%, #eef2f7 100%)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    padding: 16
  },
  phoneOuter: {
    width: 390,
    minHeight: 820,
    borderRadius: 46,
    background: "linear-gradient(145deg, #18181b, #050505)",
    padding: 10,
    boxShadow: "0 26px 80px rgba(15, 23, 42, 0.28), 0 8px 22px rgba(249, 115, 22, 0.14)"
  },
  phoneInner: {
    height: 794,
    borderRadius: 38,
    background: "#fffaf4",
    overflow: "hidden",
    display: "flex",
    flexDirection: "column"
  },
  statusBar: {
    height: 28,
    padding: "8px 22px 0",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    color: "#27272a",
    fontSize: 12,
    fontWeight: 900
  },
  appHeader: {
    padding: "10px 20px 14px",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between"
  },
  brandLockup: {
    display: "flex",
    alignItems: "center",
    gap: 10
  },
  brandIcon: {
    width: 38,
    height: 38,
    borderRadius: 16,
    background: "linear-gradient(145deg, #fc8019, #ef4444)",
    color: "white",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontWeight: 950
  },
  headerChip: {
    border: "1px solid rgba(252, 128, 25, 0.22)",
    borderRadius: 999,
    background: "rgba(255, 255, 255, 0.74)",
    color: "#9a3412",
    fontSize: 12,
    fontWeight: 900,
    padding: "8px 11px"
  },
  content: {
    padding: "8px 20px 20px",
    height: 644,
    display: "flex",
    flexDirection: "column"
  },
  title: {
    fontSize: 25,
    lineHeight: "31px",
    margin: 0,
    fontWeight: 950,
    color: "#171717",
    letterSpacing: 0
  },
  subtitle: {
    fontSize: 14,
    lineHeight: "21px",
    margin: "8px 0 0",
    color: "#6b7280"
  },
  progressWrap: {
    padding: "0 20px 10px"
  },
  progressTrack: {
    display: "flex",
    gap: 6
  },
  progressItem: {
    height: 6,
    flex: 1,
    borderRadius: 999
  },
  stepText: {
    margin: "10px 0 0",
    fontSize: 12,
    color: "#78716c",
    fontWeight: 800
  },
  list: {
    display: "flex",
    flexDirection: "column",
    gap: 12,
    marginTop: 20
  },
  optionCard: {
    width: "100%",
    border: "1px solid rgba(231, 229, 228, 0.95)",
    background: "rgba(255, 255, 255, 0.92)",
    borderRadius: 18,
    padding: 16,
    textAlign: "left",
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    gap: 12,
    boxShadow: "0 10px 26px rgba(15, 23, 42, 0.055)"
  },
  selectedCard: {
    border: "1px solid rgba(252, 128, 25, 0.72)",
    background: "linear-gradient(135deg, #fff7ed, #ffffff)",
    boxShadow: "0 14px 30px rgba(252, 128, 25, 0.16)"
  },
  miniIcon: {
    height: 48,
    width: 48,
    borderRadius: 17,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: 25,
    flexShrink: 0
  },
  primaryButton: {
    border: 0,
    borderRadius: 16,
    background: "linear-gradient(135deg, #fc8019, #f97316)",
    color: "white",
    fontWeight: 950,
    padding: "15px 16px",
    cursor: "pointer",
    flex: 1,
    boxShadow: "0 14px 28px rgba(252, 128, 25, 0.26)"
  },
  secondaryButton: {
    border: "1px solid rgba(214, 211, 209, 0.9)",
    borderRadius: 16,
    background: "rgba(255, 255, 255, 0.86)",
    color: "#18181b",
    fontWeight: 900,
    padding: "14px 16px",
    cursor: "pointer",
    flex: 1
  },
  footer: {
    display: "flex",
    gap: 10,
    marginTop: "auto",
    paddingTop: 12
  },
  pill: {
    borderRadius: 999,
    padding: "5px 10px",
    fontSize: 12,
    fontWeight: 800
  },
  input: {
    width: "100%",
    border: "1px solid rgba(214, 211, 209, 0.95)",
    background: "rgba(255, 255, 255, 0.94)",
    borderRadius: 16,
    padding: "14px 15px",
    outline: "none",
    fontSize: 14,
    boxShadow: "0 10px 24px rgba(15, 23, 42, 0.045)"
  },
  scrollArea: {
    overflowY: "auto",
    flex: 1,
    minHeight: 0,
    paddingBottom: 12,
    WebkitOverflowScrolling: "touch"
  },
  glassPanel: {
    background: "rgba(255, 255, 255, 0.82)",
    border: "1px solid rgba(255, 237, 213, 0.9)",
    borderRadius: 24,
    boxShadow: "0 18px 42px rgba(15, 23, 42, 0.07)"
  }
};

function mergeStyles(...items) {
  return Object.assign({}, ...items.filter(Boolean));
}

function ScreenTitle({ kicker, title, subtitle }) {
  return (
    <div>
      {kicker ? (
        <p style={{ margin: "0 0 8px", color: "#fc8019", fontSize: 12, fontWeight: 950, textTransform: "uppercase" }}>
          {kicker}
        </p>
      ) : null}
      <h2 style={styles.title}>{title}</h2>
      {subtitle ? <p style={styles.subtitle}>{subtitle}</p> : null}
    </div>
  );
}

function PhoneFrame({ children, connected }) {
  return (
    <div style={styles.phoneOuter}>
      <div style={styles.phoneInner}>
        <div style={styles.statusBar}>
          <span>9:41</span>
          <span>5G 82%</span>
        </div>
        <div style={styles.appHeader}>
          <div style={styles.brandLockup}>
            <div style={styles.brandIcon}>S</div>
            <div>
              <p style={{ margin: 0, fontSize: 12, color: "#9a3412", fontWeight: 950 }}>SWIGGY</p>
              <p style={{ margin: "2px 0 0", fontSize: 15, color: "#171717", fontWeight: 950 }}>Meal Autopilot</p>
            </div>
          </div>
          <div style={styles.headerChip}>{connected ? "MCP live" : "Demo mode"}</div>
        </div>
        {children}
      </div>
    </div>
  );
}

function ProgressBar({ step }) {
  return (
    <div style={styles.progressWrap}>
      <div style={styles.progressTrack}>
        {steps.map((_, index) => (
          <div
            key={index}
            style={mergeStyles(styles.progressItem, {
              background: index <= step ? "linear-gradient(90deg, #fc8019, #ef4444)" : "rgba(231, 229, 228, 0.95)"
            })}
          />
        ))}
      </div>
      <p style={styles.stepText}>
        Step {step + 1} of {steps.length} • {steps[step]}
      </p>
    </div>
  );
}

function FooterActions({ prev, next, disabled, nextLabel = "Continue →" }) {
  return (
    <div style={styles.footer}>
      {prev ? (
        <button type="button" onClick={prev} style={styles.secondaryButton}>
          ← Back
        </button>
      ) : null}
      <button type="button" onClick={next} disabled={disabled} style={mergeStyles(styles.primaryButton, disabled ? { opacity: 0.42, cursor: "not-allowed" } : null)}>
        {nextLabel}
      </button>
    </div>
  );
}

async function apiPost(url, payload) {
  const response = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload)
  });
  const json = await response.json().catch(() => ({}));
  if (!response.ok) {
    throw new Error(json?.error?.message || "Request failed");
  }
  return json;
}

function extractArray(payload, keys) {
  const data = payload?.result?.data || payload?.data || payload?.result || payload;
  for (const key of keys) {
    if (Array.isArray(data?.[key])) return data[key];
  }
  if (Array.isArray(data)) return data;
  return [];
}

function StepPlanType({ data, setData, next }) {
  const choices = [
    { title: "Lunch", desc: "Fresh meals between 12 PM and 2 PM", icon: "🍱", tag: "Most used" },
    { title: "Dinner", desc: "Comfort food for evenings at home", icon: "🍽️", tag: "Easy nights" },
    { title: "Both", desc: "Plan lunch and dinner together", icon: "🍱🍽️", tag: "Full day" }
  ];

  return (
    <div style={styles.content}>
      <ScreenTitle
        kicker="Start here"
        title="Put your meals on autopilot"
        subtitle="Connect Swiggy MCP when credentials are ready, or explore the demo flow today."
      />
      <div style={styles.list}>
        {choices.map((choice) => {
          const selected = data.plan === choice.title;
          return (
            <button
              type="button"
              key={choice.title}
              onClick={() => {
                setData({ ...data, plan: choice.title });
                next();
              }}
              style={mergeStyles(styles.optionCard, selected ? styles.selectedCard : null)}
            >
              <span style={mergeStyles(styles.miniIcon, { background: selected ? "#ffedd5" : "#f5f5f4" })}>{choice.icon}</span>
              <span style={{ flex: 1 }}>
                <span style={{ display: "flex", justifyContent: "space-between", gap: 8, alignItems: "center" }}>
                  <span style={{ fontWeight: 950, color: "#18181b" }}>{choice.title}</span>
                  <span style={mergeStyles(styles.pill, { background: selected ? "#fc8019" : "#f5f5f4", color: selected ? "white" : "#78716c" })}>{choice.tag}</span>
                </span>
                <span style={{ display: "block", fontSize: 14, color: "#71717a", marginTop: 5 }}>{choice.desc}</span>
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}

function StepDays({ data, setData, prev, next }) {
  const selectedCount = data.selectedDates.length;

  function toggleDate(date) {
    const exists = data.selectedDates.includes(date);
    const selectedDates = exists ? data.selectedDates.filter((item) => item !== date) : data.selectedDates.concat(date);
    setData({ ...data, selectedDates });
  }

  function selectWeekdays() {
    setData({ ...data, selectedDates: mayDays.filter((item) => item.day !== "Sat" && item.day !== "Sun").map((item) => item.date) });
  }

  return (
    <div style={styles.content}>
      <ScreenTitle kicker="Schedule" title="Choose your delivery days" subtitle="This is the calendar your scheduler will use when building daily carts." />
      <div style={{ marginTop: 18, display: "flex", gap: 8 }}>
        <button type="button" onClick={selectWeekdays} style={mergeStyles(styles.secondaryButton, { padding: "10px 12px", fontSize: 13 })}>Weekdays</button>
        <button type="button" onClick={() => setData({ ...data, selectedDates: mayDays.map((item) => item.date) })} style={mergeStyles(styles.secondaryButton, { padding: "10px 12px", fontSize: 13 })}>All May</button>
        <button type="button" onClick={() => setData({ ...data, selectedDates: [] })} style={mergeStyles(styles.secondaryButton, { padding: "10px 12px", fontSize: 13 })}>Clear</button>
      </div>
      <div style={mergeStyles(styles.glassPanel, { marginTop: 16, padding: 14 })}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
          <div>
            <p style={{ margin: 0, fontSize: 16, fontWeight: 950, color: "#18181b" }}>May 2026</p>
            <p style={{ margin: "4px 0 0", fontSize: 12, color: "#71717a" }}>{selectedCount} days selected</p>
          </div>
          <span style={mergeStyles(styles.pill, { background: selectedCount ? "#fff7ed" : "#f5f5f4", color: selectedCount ? "#ea580c" : "#78716c" })}>
            {selectedCount ? `${selectedCount} orders` : "Tap dates"}
          </span>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(7, 1fr)", gap: 6, marginBottom: 7 }}>
          {["M", "T", "W", "T", "F", "S", "S"].map((day, index) => (
            <div key={`${day}-${index}`} style={{ textAlign: "center", fontSize: 11, color: "#71717a", fontWeight: 800 }}>{day}</div>
          ))}
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(7, 1fr)", gap: 6 }}>
          <div />
          <div />
          <div />
          <div />
          {mayDays.map((item) => {
            const selected = data.selectedDates.includes(item.date);
            return (
              <button
                type="button"
                key={item.date}
                onClick={() => toggleDate(item.date)}
                style={{
                  height: 36,
                  borderRadius: 12,
                  border: selected ? "1px solid #fc8019" : "1px solid #e7e5e4",
                  background: selected ? "linear-gradient(135deg, #fc8019, #ef4444)" : "#ffffff",
                  color: selected ? "white" : "#18181b",
                  fontWeight: 900,
                  cursor: "pointer"
                }}
              >
                {item.label}
              </button>
            );
          })}
        </div>
      </div>
      <FooterActions prev={prev} next={next} disabled={selectedCount === 0} />
    </div>
  );
}

function StepRestaurants({ auth, data, setData, prev, next }) {
  const [query, setQuery] = useState("biryani");
  const [addressId, setAddressId] = useState("");
  const [addresses, setAddresses] = useState([]);
  const [restaurants, setRestaurants] = useState(fallbackRestaurants);
  const [selectedRestaurantId, setSelectedRestaurantId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [notice, setNotice] = useState("");

  const selectedRestaurant = restaurants.find((restaurant) => String(restaurant.id || restaurant.restaurantId) === String(selectedRestaurantId));

  useEffect(() => {
    async function loadAddresses() {
      if (!auth.connected) return;
      try {
        const payload = await apiPost("/api/swiggy/tool", { tool: "get_addresses", arguments: {} });
        const found = extractArray(payload, ["addresses", "savedAddresses"]);
        setAddresses(found);
        const firstId = found[0]?.id || found[0]?.addressId;
        if (firstId) setAddressId(firstId);
      } catch (error) {
        setNotice(error.message);
      }
    }
    loadAddresses();
  }, [auth.connected]);

  async function searchRestaurants() {
    if (!auth.connected) {
      setNotice("Demo restaurants shown. Connect Swiggy MCP to search live nearby restaurants.");
      return;
    }
    if (!addressId) {
      setNotice("Pick a saved Swiggy address first.");
      return;
    }
    setLoading(true);
    setNotice("");
    try {
      const payload = await apiPost("/api/swiggy/tool", {
        tool: "search_restaurants",
        arguments: { addressId, query }
      });
      const found = extractArray(payload, ["restaurants", "results", "cards"]);
      const openOnly = found.filter((restaurant) => !restaurant.availabilityStatus || restaurant.availabilityStatus === "OPEN");
      setRestaurants(openOnly.length ? openOnly : found);
      if (!found.length) setNotice("No live results returned for that search.");
    } catch (error) {
      setNotice(error.message);
    } finally {
      setLoading(false);
    }
  }

  async function loadMenu(restaurant) {
    const id = restaurant.id || restaurant.restaurantId;
    setSelectedRestaurantId(id);
    if (!auth.connected || !addressId || String(id).startsWith("mock-")) return;

    setLoading(true);
    setNotice("");
    try {
      const payload = await apiPost("/api/swiggy/tool", {
        tool: "get_restaurant_menu",
        arguments: { addressId, restaurantId: id, page: 1, pageSize: 5 }
      });
      setNotice("Live menu metadata loaded. Search a dish to fetch orderable customization IDs.");
      setData({ ...data, lastMenuPayload: payload.result });
    } catch (error) {
      setNotice(error.message);
    } finally {
      setLoading(false);
    }
  }

  function toggleDish(dish, restaurant) {
    const exists = data.dishes.some((item) => item.id === dish.id);
    const updated = exists
      ? data.dishes.filter((item) => item.id !== dish.id)
      : data.dishes.length < 7
        ? data.dishes.concat({ ...dish, restaurant: restaurant.name, restaurantId: restaurant.id || restaurant.restaurantId })
        : data.dishes;
    setData({ ...data, dishes: updated, addressId });
  }

  return (
    <div style={styles.content}>
      <ScreenTitle
        kicker="Live Food"
        title={auth.connected ? "Search Swiggy restaurants" : "Demo now, MCP ready"}
        subtitle={auth.connected ? "Uses get_addresses and search_restaurants through our API wrapper." : "Add Swiggy credentials, then connect to replace mocks with live tools."}
      />
      <div style={{ marginTop: 14, display: "grid", gap: 10 }}>
        {auth.connected && addresses.length ? (
          <select value={addressId} onChange={(event) => setAddressId(event.target.value)} style={styles.input}>
            {addresses.map((address, index) => (
              <option key={address.id || address.addressId || index} value={address.id || address.addressId}>
                {address.label || address.name || address.addressLine || `Saved address ${index + 1}`}
              </option>
            ))}
          </select>
        ) : null}
        <div style={{ display: "flex", gap: 8 }}>
          <input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search cuisine or restaurant" style={styles.input} />
          <button type="button" onClick={searchRestaurants} style={mergeStyles(styles.primaryButton, { flex: "0 0 92px", padding: 12 })}>
            {loading ? "..." : "Search"}
          </button>
        </div>
        <p style={{ margin: 0, fontSize: 13, color: notice ? "#9a3412" : "#71717a", minHeight: 18 }}>
          {notice || `${data.dishes.length}/7 meals selected`}
        </p>
      </div>
      {!selectedRestaurant ? (
        <div style={mergeStyles(styles.scrollArea, { marginTop: 10 })}>
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            {restaurants.map((restaurant) => {
              const id = restaurant.id || restaurant.restaurantId;
              return (
                <button key={id} type="button" onClick={() => loadMenu(restaurant)} style={styles.optionCard}>
                  <div style={mergeStyles(styles.miniIcon, { height: 56, width: 56, background: "#ffedd5", fontSize: 30 })}>{restaurant.emoji || "🍽️"}</div>
                  <div style={{ flex: 1 }}>
                    <div style={{ display: "flex", justifyContent: "space-between", gap: 8 }}>
                      <p style={{ margin: 0, fontWeight: 950, color: "#18181b" }}>{restaurant.name || restaurant.restaurantName}</p>
                      <p style={{ margin: 0, fontSize: 12, fontWeight: 900, color: "#15803d" }}>★ {restaurant.rating || restaurant.avgRating || "4.3"}</p>
                    </div>
                    <p style={{ margin: "6px 0 0", fontSize: 14, color: "#71717a" }}>{restaurant.meta || restaurant.cuisines || restaurant.locality || "Open for delivery"}</p>
                    <p style={{ margin: "7px 0 0", fontSize: 12, color: "#ea580c", fontWeight: 950 }}>View menu →</p>
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      ) : (
        <div style={mergeStyles(styles.scrollArea, { marginTop: 10 })}>
          <button type="button" onClick={() => setSelectedRestaurantId(null)} style={{ border: 0, background: "transparent", color: "#ea580c", fontWeight: 900, fontSize: 14, marginBottom: 12, cursor: "pointer" }}>
            ← Back to all restaurants
          </button>
          <div style={mergeStyles(styles.glassPanel, { padding: 16, marginBottom: 12, background: "linear-gradient(135deg, #fff7ed, #ffffff)" })}>
            <p style={{ margin: 0, fontWeight: 950 }}>{selectedRestaurant.name || selectedRestaurant.restaurantName}</p>
            <p style={{ margin: "5px 0 0", fontSize: 13, color: "#71717a" }}>Search-menu support is wired through `/api/swiggy/tool` when live item IDs are available.</p>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            {(selectedRestaurant.dishes || []).map((dish) => {
              const added = data.dishes.some((item) => item.id === dish.id);
              return (
                <button key={dish.id} type="button" onClick={() => toggleDish(dish, selectedRestaurant)} style={mergeStyles(styles.optionCard, added ? styles.selectedCard : null)}>
                  <div style={mergeStyles(styles.miniIcon, { height: 56, width: 56, background: added ? "#ffedd5" : "#f4f4f5", fontSize: 30 })}>{dish.emoji || "🍽️"}</div>
                  <div style={{ flex: 1 }}>
                    <p style={{ margin: 0, fontWeight: 900, color: "#18181b" }}>{dish.name}</p>
                    <p style={{ margin: "5px 0 0", fontSize: 14, color: "#71717a" }}>₹{dish.price}</p>
                  </div>
                  <span style={mergeStyles(styles.pill, added ? { background: "#f97316", color: "white" } : { background: "#f4f4f5", color: "#3f3f46" })}>
                    {added ? "Added" : "Add"}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      )}
      <FooterActions prev={prev} next={next} disabled={data.dishes.length !== 7 && !auth.connected} />
    </div>
  );
}

function StepPreferences({ data, setData, prev, next }) {
  return (
    <div style={styles.content}>
      <ScreenTitle kicker="Payments" title="Set guardrails" subtitle="The backend blocks order placement unless the final review sends explicit confirmation." />
      <div style={mergeStyles(styles.scrollArea, { marginTop: 20 })}>
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          <div style={mergeStyles(styles.glassPanel, { padding: 16 })}>
            <p style={{ margin: 0, fontSize: 14, fontWeight: 900, color: "#18181b" }}>When should we order?</p>
            <input value={data.time} onChange={(event) => setData({ ...data, time: event.target.value })} style={mergeStyles(styles.input, { marginTop: 10 })} />
            <p style={{ margin: "8px 0 0", fontSize: 12, color: "#71717a" }}>Your scheduler should send a reminder 30 minutes before this time.</p>
          </div>
          <div style={mergeStyles(styles.glassPanel, { padding: 16, background: "linear-gradient(135deg, #ecfdf5, #ffffff)" })}>
            <p style={{ margin: 0, fontWeight: 950, color: "#166534" }}>Safety policy</p>
            <p style={{ margin: "8px 0 0", fontSize: 14, lineHeight: "20px", color: "#15803d" }}>
              `place_food_order` is only allowed after `get_food_cart`, payment methods are shown, cart value is under ₹1000, and the user confirms.
            </p>
          </div>
        </div>
      </div>
      <FooterActions prev={prev} next={next} disabled={!data.time} />
    </div>
  );
}

function StepReview({ data, prev, auth }) {
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");

  async function saveDraft() {
    setSaving(true);
    setMessage("");
    try {
      const payload = await apiPost("/api/autopilot", data);
      setMessage(payload.message || "Draft saved.");
    } catch (error) {
      setMessage(error.message);
    } finally {
      setSaving(false);
    }
  }

  return (
    <div style={styles.content}>
      <ScreenTitle kicker="Final check" title="MCP-ready autopilot" subtitle="This saves a draft today; production ordering needs durable storage and scheduler wiring." />
      <div style={mergeStyles(styles.scrollArea, { marginTop: 16 })}>
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          <div style={mergeStyles(styles.glassPanel, { padding: 16, background: "linear-gradient(135deg, #fff7ed, #ffffff)" })}>
            <p style={{ margin: 0, fontSize: 12, color: "#71717a" }}>Plan</p>
            <p style={{ margin: "5px 0 0", fontWeight: 950, color: "#18181b" }}>{data.plan} • {data.selectedDates.length} days • {data.time}</p>
          </div>
          <div style={mergeStyles(styles.glassPanel, { padding: 16 })}>
            <p style={{ margin: 0, fontSize: 12, color: "#71717a" }}>Swiggy MCP</p>
            <p style={{ margin: "5px 0 0", fontWeight: 950, color: "#18181b" }}>{auth.connected ? "Connected" : "Not connected yet"}</p>
            <p style={{ margin: "6px 0 0", fontSize: 12, color: "#71717a", lineHeight: "18px" }}>
              Backend routes are ready for OAuth, `get_addresses`, `search_restaurants`, cart tools, coupons, and guarded order placement.
            </p>
          </div>
          <div style={mergeStyles(styles.glassPanel, { padding: 16 })}>
            <p style={{ margin: "0 0 12px", fontSize: 12, color: "#71717a" }}>Selected meals</p>
            {data.dishes.length ? data.dishes.map((dish, index) => (
              <p key={`${dish.id}-${index}`} style={{ margin: "0 0 8px", fontSize: 14, fontWeight: 800 }}>{index + 1}. {dish.name} <span style={{ color: "#71717a", fontWeight: 600 }}>• {dish.restaurant}</span></p>
            )) : <p style={{ margin: 0, color: "#71717a", fontSize: 14 }}>Live MCP selection will fill this once connected.</p>}
          </div>
          {message ? (
            <div style={{ background: "#ecfdf5", border: "1px solid #bbf7d0", borderRadius: 20, padding: 16 }}>
              <p style={{ margin: 0, color: "#166534", fontWeight: 900 }}>{message}</p>
            </div>
          ) : null}
        </div>
      </div>
      <div style={styles.footer}>
        <button type="button" onClick={prev} style={styles.secondaryButton}>← Back</button>
        <button type="button" onClick={saveDraft} style={mergeStyles(styles.primaryButton, { background: "linear-gradient(135deg, #16a34a, #22c55e)" })}>
          {saving ? "Saving..." : "Save Autopilot Draft"}
        </button>
      </div>
    </div>
  );
}

export default function SetupFlowUI() {
  const [auth, setAuth] = useState({ connected: false });
  const [step, setStep] = useState(0);
  const [data, setData] = useState({
    plan: "",
    selectedDates: [],
    dishes: [],
    addressId: "",
    paymentMode: "mandate",
    paymentMethod: "Google Pay",
    time: "1:00 PM"
  });

  useEffect(() => {
    fetch("/api/auth/status")
      .then((response) => response.json())
      .then(setAuth)
      .catch((error) => setAuth({ connected: false, error: error.message }));
  }, []);

  const currentStep = useMemo(() => {
    if (step === 0) return <StepPlanType data={data} setData={setData} next={() => setStep(1)} />;
    if (step === 1) return <StepDays data={data} setData={setData} prev={() => setStep(0)} next={() => setStep(2)} />;
    if (step === 2) return <StepRestaurants auth={auth} data={data} setData={setData} prev={() => setStep(1)} next={() => setStep(3)} />;
    if (step === 3) return <StepPreferences data={data} setData={setData} prev={() => setStep(2)} next={() => setStep(4)} />;
    return <StepReview data={data} prev={() => setStep(3)} auth={auth} />;
  }, [auth, data, step]);

  return (
    <div style={styles.page}>
      <PhoneFrame connected={auth.connected}>
        <ProgressBar step={step} />
        {!auth.connected && auth.configured ? (
          <div style={{ padding: "0 20px 10px" }}>
            <a href="/api/auth/start" style={{ display: "block", textAlign: "center", borderRadius: 999, padding: "10px 12px", background: "#18181b", color: "white", textDecoration: "none", fontWeight: 950, fontSize: 13 }}>
              Connect Swiggy MCP
            </a>
          </div>
        ) : null}
        {!auth.connected && auth.configured === false ? (
          <div style={{ padding: "0 20px 10px" }}>
            <div style={{ textAlign: "center", borderRadius: 999, padding: "10px 12px", background: "#fff7ed", color: "#9a3412", fontWeight: 950, fontSize: 13 }}>
              Add Swiggy env vars to enable MCP login
            </div>
          </div>
        ) : null}
        {currentStep}
      </PhoneFrame>
    </div>
  );
}
