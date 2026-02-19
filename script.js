const STORAGE_KEY = "savingsTrackerEntries";

function money(n) {
  const num = Number(n) || 0;
  return num.toLocaleString(undefined, { style: "currency", currency: "USD" });
}

function loadEntries() {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];
  } catch {
    return [];
  }
}

function saveEntries(entries) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(entries));
}

function render() {
  const entries = loadEntries();

  // totals
  let totalIncome = 0;
  let totalExpenses = 0;

  for (const e of entries) {
    totalIncome += Number(e.income) || 0;
    totalExpenses += Number(e.expenses) || 0;
  }

  const totalSaved = totalIncome - totalExpenses;

  document.getElementById("totalIncome").textContent = money(totalIncome);
  document.getElementById("totalExpenses").textContent = money(totalExpenses);
  document.getElementById("totalSaved").textContent = money(totalSaved);

  // history
  const history = document.getElementById("history");
  history.innerHTML = "";

  if (entries.length === 0) {
    history.innerHTML = `<div class="small">No entries yet. Add your first one above.</div>`;
    return;
  }

  // newest first
  const sorted = [...entries].sort((a, b) => (b.createdAt || 0) - (a.createdAt || 0));

  for (const e of sorted) {
    const saved = (Number(e.income) || 0) - (Number(e.expenses) || 0);

    const div = document.createElement("div");
    div.className = "item";
    div.innerHTML = `
      <div><strong>${e.type.toUpperCase()}</strong> • ${e.date || "No date"}</div>
      <div class="small">Income: ${money(e.income)} | Expenses: ${money(e.expenses)}</div>
      <div><strong>Saved this entry:</strong> ${money(saved)}</div>
    `;
    history.appendChild(div);
  }
}

function setStatus(msg) {
  document.getElementById("status").textContent = msg;
}

document.getElementById("addEntry").addEventListener("click", () => {
  const type = document.getElementById("entryType").value;
  const date = document.getElementById("date").value;
  const income = document.getElementById("income").value;
  const expenses = document.getElementById("expenses").value;

  const incomeNum = Number(income);
  const expensesNum = Number(expenses);

  if (!income || Number.isNaN(incomeNum) || incomeNum < 0) {
    setStatus("Enter a valid paycheck amount.");
    return;
  }
  if (!expenses || Number.isNaN(expensesNum) || expensesNum < 0) {
    setStatus("Enter a valid expense amount.");
    return;
  }

  const entries = loadEntries();
  entries.push({
    type,
    date,
    income: incomeNum,
    expenses: expensesNum,
    createdAt: Date.now()
  });

  saveEntries(entries);

  document.getElementById("income").value = "";
  document.getElementById("expenses").value = "";
  setStatus("Saved ✅");
  render();
});

document.getElementById("clearAll").addEventListener("click", () => {
  localStorage.removeItem(STORAGE_KEY);
  setStatus("All entries cleared.");
  render();
});

// default date to today
document.getElementById("date").valueAsDate = new Date();

render();
