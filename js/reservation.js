const STORAGE_KEY = "reservations";
const ADMIN_PASSWORD = "admin123"; // 관리자 삭제용 비밀번호

function loadReservations() {
  const data = JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];
  const tbody = document.querySelector("#reservationTable tbody");
  tbody.innerHTML = "";

  data.forEach((res, index) => {
    const row = document.createElement("tr");
    row.innerHTML = `
      <td>${res.name}</td>
      <td>${res.date}</td>
      <td>${res.time}</td>
      <td>${res.phone}</td>
      <td><button class="btn btn-danger btn-sm" onclick="deleteReservation(${index})">삭제</button></td>
    `;
    tbody.appendChild(row);
  });
}

function addReservation() {
  const name = document.getElementById("name").value.trim();
  const date = document.getElementById("date").value;
  const time = document.getElementById("time").value;
  const phone = document.getElementById("phone").value.trim();

  if (!name || !date || !time || !phone) {
    alert("모든 필드를 입력하세요.");
    return;
  }

  const reservations = JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];
  reservations.push({ name, date, time, phone });
  localStorage.setItem(STORAGE_KEY, JSON.stringify(reservations));

  document.getElementById("name").value = "";
  document.getElementById("date").value = "";
  document.getElementById("time").value = "";
  document.getElementById("phone").value = "";

  loadReservations();
}


function deleteReservation(index) {
const password = prompt("관리자 비밀번호를 입력하세요:");
if (!password) return;

fetch("./mentalist_hash")
  .then(res => res.json())
  .then(data => {
    const hashedInput = CryptoJS.SHA256(password).toString();

    if (hashedInput !== data.hashedPassword) {
      alert("비밀번호가 틀렸습니다.");
      return;
    }

    const reservations = JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];
    reservations.splice(index, 1);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(reservations));
    loadReservations();
  })
  .catch(err => {
    alert("비밀번호 파일을 불러오지 못했습니다.");
    console.error(err);
  });
}    

document.addEventListener("DOMContentLoaded", () => {
  fetch("navbar.html")
    .then(response => response.text())
    .then(data => {
      document.getElementById("navbar").innerHTML = data;
    });

  loadReservations();
});

