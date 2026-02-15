let transactions = JSON.parse(localStorage.getItem("transactions")) || [];
let budget = localStorage.getItem("budget") || 0;
let chart;

document.getElementById("budget").innerText = budget;

function setBudget(){
  budget = document.getElementById("budgetInput").value;
  if(budget === "") return;
  localStorage.setItem("budget", budget);
  document.getElementById("budget").innerText = budget;
  updateRemaining();
}

function addTransaction() {
  let desc = document.getElementById("desc").value;
  let amount = document.getElementById("amount").value;

  if(desc === "" || amount === ""){
    alert("Enter details");
    return;
  }

  let transaction = {
    id: Date.now(),
    desc: desc,
    amount: Number(amount)
  };

  transactions.push(transaction);
  saveAndUpdate();
}

function deleteTransaction(id){
  transactions = transactions.filter(t => t.id !== id);
  saveAndUpdate();
}

function saveAndUpdate(){
  localStorage.setItem("transactions", JSON.stringify(transactions));
  document.getElementById("desc").value = "";
  document.getElementById("amount").value = "";
  showTransactions();
  updateBalance();
  updateChart();
  updateRemaining();
}

function showTransactions(){
  let list = document.getElementById("list");
  list.innerHTML = "";

  transactions.forEach(t => {
    let li = document.createElement("li");

    li.classList.add(t.amount > 0 ? "income" : "expense");

    li.innerHTML = `
      <span>${t.desc} : ₹${t.amount}</span>
      <button class="delete-btn" onclick="deleteTransaction(${t.id})">X</button>
    `;
    list.appendChild(li);
  });
}

function updateBalance(){
  let total = 0;
  transactions.forEach(t => total += t.amount);
  document.getElementById("balance").innerText = total;
}

function updateRemaining(){
  let spent = 0;
  transactions.forEach(t => spent += t.amount);
  let remaining = budget - spent;
  document.getElementById("remaining").innerText = remaining;
}

function updateChart(){
  let expense = transactions
    .filter(t => t.amount < 0)
    .map(t => Math.abs(t.amount));

  let labels = transactions
    .filter(t => t.amount < 0)
    .map(t => t.desc);

  if(chart) chart.destroy();

  chart = new Chart(document.getElementById("expenseChart"), {
    type: "pie",
    data: {
      labels: labels,
      datasets: [{
        data: expense,
        backgroundColor: [
          "#ff6384","#ff9f40","#ffcd56","#4bc0c0","#36a2eb","#9966ff"
        ]
      }]
    }
  });
}

showTransactions();
updateBalance();
updateChart();
updateRemaining();
