let transactions = JSON.parse(localStorage.getItem("transactions")) || [];
let budget = Number(localStorage.getItem("budget")) || 0;
let chart;

document.getElementById("budget").innerText = budget;

// set budget
function setBudget(){
  budget = Number(document.getElementById("budgetInput").value);
  if(!budget) return;

  localStorage.setItem("budget", budget);
  document.getElementById("budget").innerText = budget;
  updateRemaining();
}

// add transaction
function addTransaction() {
  let desc = document.getElementById("desc").value;
  let amount = Number(document.getElementById("amount").value);

  if(desc === "" || amount === 0){
    alert("Enter valid details");
    return;
  }

  let transaction = {
    id: Date.now(),
    desc,
    amount
  };

  transactions.push(transaction);
  saveAndUpdate();
}

// delete
function deleteTransaction(id){
  transactions = transactions.filter(t => t.id !== id);
  saveAndUpdate();
}

// save + refresh UI
function saveAndUpdate(){
  localStorage.setItem("transactions", JSON.stringify(transactions));
  document.getElementById("desc").value = "";
  document.getElementById("amount").value = "";

  showTransactions();
  updateBalance();
  updateRemaining();
  updateChart();
}

// show list
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

// balance = income + expense
function updateBalance(){
  let balance = transactions.reduce((sum, t) => sum + t.amount, 0);
  document.getElementById("balance").innerText = balance;
}

// remaining = budget − expenses only
function updateRemaining(){
  let totalExpense = transactions
    .filter(t => t.amount < 0)
    .reduce((sum, t) => sum + Math.abs(t.amount), 0);

  let remaining = budget - totalExpense;
  document.getElementById("remaining").innerText = remaining;
}

// pie chart
function updateChart(){
  let expenseData = transactions
    .filter(t => t.amount < 0)
    .map(t => Math.abs(t.amount));

  let labels = transactions
    .filter(t => t.amount < 0)
    .map(t => t.desc);

  if(chart) chart.destroy();

  chart = new Chart(document.getElementById("expenseChart"), {
    type: "pie",
    data: {
      labels,
      datasets: [{
        data: expenseData,
        backgroundColor: [
          "#ff6384","#ff9f40","#ffcd56","#4bc0c0","#36a2eb","#9966ff"
        ]
      }]
    }
  });
}

// initial load
showTransactions();
updateBalance();
updateRemaining();
updateChart();
