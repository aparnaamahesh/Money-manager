let transactions = JSON.parse(localStorage.getItem("transactions")) || [];

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
  localStorage.setItem("transactions", JSON.stringify(transactions));

  document.getElementById("desc").value = "";
  document.getElementById("amount").value = "";

  showTransactions();
  updateBalance();
}

function showTransactions(){
  let list = document.getElementById("list");
  list.innerHTML = "";

  transactions.forEach(t => {
    let li = document.createElement("li");
    li.innerText = `${t.desc} : ₹${t.amount}`;
    list.appendChild(li);
  });
}

function updateBalance(){
  let total = 0;
  transactions.forEach(t => total += t.amount);
  document.getElementById("balance").innerText = total;
}

showTransactions();
updateBalance();
