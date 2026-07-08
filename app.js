const storageKey = "rudPortalStudents";
const noticeKey = "rudPortalNotices";
const adminSessionKey = "rudAdminLoggedIn";

if (sessionStorage.getItem(adminSessionKey) !== "true" && localStorage.getItem(adminSessionKey) !== "true") {
  window.location.href = "admin-login.html";
}

const seedStudents = [
  {
    id: "2203383239",
    name: "Safol Hasan",
    status: "Completed Study",
    program: "B.Sc in Computer Science & Engineering (CSE)",
    department: "Computer Science & Engineering",
    batch: "22",
    section: "A",
    studyYear: "2022",
    admissionDate: "2022-01-12",
    cgpa: "3.72",
    email: "hasansafol2000@gmail.com",
    key: "RUD2203",
    mobile: "01700000001",
    guardianPhone: "01800000001",
    bloodGroup: "B+",
    religion: "Islam",
    fatherName: "Md. Hasan",
    motherName: "Mst. Hasan",
    presentAddress: "Dhaka, Bangladesh",
    permanentAddress: "Dhaka, Bangladesh",
    photo: "",
    education: [
      { exam: "S.S.C", group: "Science", institute: "Model School", year: "2016", division: "GPA 5.00", marks: "A+" },
      { exam: "H.S.C", group: "Science", institute: "City College", year: "2018", division: "GPA 4.80", marks: "A" }
    ],
    results: "Spring 2026: GPA 3.70",
    payment: "Paid"
  },
  {
    id: "1801120299",
    name: "JOY KUMAR DEY",
    status: "Completed Study",
    program: "B.Sc in Computer Science And Engineering (CSE)",
    department: "Computer Science & Engineering",
    batch: "18",
    section: "B",
    studyYear: "2018",
    admissionDate: "2018-02-10",
    cgpa: "3.45",
    email: "kumaarjoy@gmail.com",
    key: "RUD1801",
    mobile: "01700000002",
    guardianPhone: "01800000002",
    bloodGroup: "O+",
    religion: "Hinduism",
    fatherName: "",
    motherName: "",
    presentAddress: "Dhaka, Bangladesh",
    permanentAddress: "Dhaka, Bangladesh",
    photo: "",
    education: [
      { exam: "S.S.C", group: "Science", institute: "High School", year: "2014", division: "GPA 4.60", marks: "A" },
      { exam: "H.S.C", group: "Science", institute: "College", year: "2016", division: "GPA 4.50", marks: "A" }
    ],
    results: "Final CGPA: 3.45",
    payment: "Due"
  },
  {
    id: "1501504145",
    name: "Md. Shohel Rana",
    status: "Completed Study",
    program: "M.Sc in Library Management and Information Science",
    department: "Library Management and Information Science",
    batch: "15",
    section: "A",
    studyYear: "2015",
    admissionDate: "2015-03-16",
    cgpa: "3.66",
    email: "shohelrana1986@gmail.com",
    key: "RUD1501",
    mobile: "01700000003",
    guardianPhone: "01800000003",
    bloodGroup: "A+",
    religion: "Islam",
    fatherName: "",
    motherName: "",
    presentAddress: "Dhaka, Bangladesh",
    permanentAddress: "Dhaka, Bangladesh",
    photo: "",
    education: [
      { exam: "S.S.C", group: "Humanities", institute: "School", year: "2002", division: "First", marks: "70%" },
      { exam: "H.S.C", group: "Humanities", institute: "College", year: "2004", division: "First", marks: "68%" }
    ],
    results: "Final CGPA: 3.66",
    payment: "Paid"
  }
];

const seedNotices = [
  { title: "Semester Final Result Published", body: "Students can check demo result information from the portal." },
  { title: "Payment Reminder", body: "Please clear due payments before registration." }
];

let photoData = "";
let currentStudents = [];
let currentNotices = [];

const $ = (selector) => document.querySelector(selector);

function localStudents() {
  const saved = localStorage.getItem(storageKey);
  if (saved) return JSON.parse(saved);
  localStorage.setItem(storageKey, JSON.stringify(seedStudents));
  return seedStudents;
}

function getStudents() {
  return currentStudents;
}

function saveStudents(students) {
  currentStudents = students;
  localStorage.setItem(storageKey, JSON.stringify(students));
}

function localNotices() {
  const saved = localStorage.getItem(noticeKey);
  if (saved) return JSON.parse(saved);
  localStorage.setItem(noticeKey, JSON.stringify(seedNotices));
  return seedNotices;
}

function getNotices() {
  return currentNotices;
}

function saveNotices(notices) {
  currentNotices = notices;
  localStorage.setItem(noticeKey, JSON.stringify(notices));
}

async function loadPortalData() {
  currentStudents = localStudents();
  currentNotices = localNotices();

  if (!window.RudBackend?.enabled) return;

  try {
    const [remoteStudents, remoteNotices] = await Promise.all([
      window.RudBackend.listStudents(),
      window.RudBackend.listNotices()
    ]);
    if (remoteStudents && remoteStudents.length) saveStudents(remoteStudents);
    if (remoteNotices && remoteNotices.length) saveNotices(remoteNotices);
  } catch (error) {
    showToast("Supabase connection failed. Local data loaded.");
    console.error(error);
  }
}

function showToast(message) {
  const toast = $("#toast");
  toast.textContent = message;
  toast.classList.add("show");
  window.setTimeout(() => toast.classList.remove("show"), 2200);
}

function initials(name) {
  return name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0])
    .join("")
    .toUpperCase();
}

function avatar(student) {
  if (student.photo) {
    return `<span class="avatar"><img src="${student.photo}" alt="${student.name}"></span>`;
  }
  return `<span class="avatar">${initials(student.name)}</span>`;
}

function setView(viewId) {
  document.querySelectorAll(".view").forEach((view) => view.classList.remove("active"));
  document.querySelectorAll(".nav-item").forEach((item) => item.classList.remove("active"));
  $(`#${viewId}`).classList.add("active");
  document.querySelectorAll(`[data-view="${viewId}"]`).forEach((item) => item.classList.add("active"));
  const titles = {
    adminDashboard: "Dashboard",
    studentDirectory: "Student Directory",
    studentForm: "Add Student",
    phaseTwo: "Phase 2 Modules"
  };
  $("#pageTitle").textContent = titles[viewId] || "RUD Portal";
  if (viewId === "studentForm" && !$("#editingId").value) resetForm();
}

function renderDashboard() {
  const students = getStudents();
  $("#totalStudents").textContent = students.length;
  $("#enrolledStudents").textContent = students.filter((student) => student.status === "Enrolled").length;
  $("#completedStudents").textContent = students.filter((student) => student.status === "Completed Study").length;
  $("#dueStudents").textContent = students.filter((student) => student.payment === "Due").length;

  $("#recentStudents").innerHTML = students.slice(0, 5).map((student) => `
    <div class="mini-item">
      <div class="mini-profile">
        ${avatar(student)}
        <div>
          <strong>${student.name}</strong>
          <span>${student.program}</span>
        </div>
      </div>
      <span>Batch ${student.batch}</span>
    </div>
  `).join("");

  renderNotices();
}

function renderNotices() {
  const notices = getNotices();
  $("#noticeList").innerHTML = notices.map((notice) => `
    <div class="notice-item">
      <div>
        <strong>${notice.title}</strong>
        <span>${notice.body}</span>
      </div>
    </div>
  `).join("");
}

function renderStudentTable() {
  const students = getStudents();
  const query = $("#studentSearch").value.trim().toLowerCase();
  const status = $("#statusFilter").value;
  const filtered = students.filter((student) => {
    const matchesQuery = [student.id, student.name, student.email, student.program]
      .join(" ")
      .toLowerCase()
      .includes(query);
    const matchesStatus = status === "All" || student.status === status;
    return matchesQuery && matchesStatus;
  });

  $("#studentTable").innerHTML = filtered.map((student) => `
    <tr>
      <td><strong>${student.id}</strong></td>
      <td>
        <div class="profile-cell">
          ${avatar(student)}
          <div>
            <strong>${student.name}</strong>
            <span>${student.status}</span>
          </div>
        </div>
      </td>
      <td class="program-cell">
        <strong>${student.program}</strong>
        <span>Batch ${student.batch}</span>
      </td>
      <td>${student.email}</td>
      <td><button class="key-pill key-visible" type="button" data-copy="${student.key || ""}" title="Click to copy">${student.key || "No key"}</button></td>
      <td><button class="ghost-button qr-login-button" type="button" data-qr="${student.id}">QR</button></td>
      <td>
        <div class="action-row">
          <button class="ghost-button" type="button" data-edit="${student.id}">Edit</button>
          <button class="danger-button" type="button" data-delete="${student.id}">Delete</button>
        </div>
      </td>
    </tr>
  `).join("");
}

function educationRow(row = {}) {
  const tr = document.createElement("tr");
  tr.innerHTML = `
    <td><input value="${row.exam || ""}" placeholder="S.S.C"></td>
    <td><input value="${row.group || ""}" placeholder="Science"></td>
    <td><input value="${row.institute || ""}" placeholder="Institute"></td>
    <td><input value="${row.year || ""}" placeholder="2020"></td>
    <td><input value="${row.division || ""}" placeholder="GPA 5.00"></td>
    <td><input value="${row.marks || ""}" placeholder="A+"></td>
    <td><button class="danger-button" type="button" data-remove-row>Remove</button></td>
  `;
  $("#educationRows").appendChild(tr);
}

function collectEducation() {
  return [...$("#educationRows").querySelectorAll("tr")].map((tr) => {
    const inputs = tr.querySelectorAll("input");
    return {
      exam: inputs[0].value,
      group: inputs[1].value,
      institute: inputs[2].value,
      year: inputs[3].value,
      division: inputs[4].value,
      marks: inputs[5].value
    };
  });
}

function generateKey(id) {
  return `RUD${String(id).slice(0, 4)}${Math.floor(10 + Math.random() * 89)}`;
}

function resetForm() {
  $("#studentFormEl").reset();
  $("#editingId").value = "";
  $("#formTitle").textContent = "Add New Student";
  $("#educationRows").innerHTML = "";
  photoData = "";
  $("#photoPreview").innerHTML = "No Image";
  educationRow({ exam: "S.S.C" });
  educationRow({ exam: "H.S.C" });
}

function fillForm(student) {
  $("#editingId").value = student.id;
  $("#formTitle").textContent = "Edit Student";
  $("#studentId").value = student.id;
  $("#fullName").value = student.name;
  $("#dob").value = student.dob || "";
  $("#birthPlace").value = student.birthPlace || "";
  $("#bloodGroup").value = student.bloodGroup || "";
  $("#nationalId").value = student.nationalId || "";
  $("#religion").value = student.religion || "";
  $("#fatherName").value = student.fatherName || "";
  $("#motherName").value = student.motherName || "";
  $("#program").value = student.program || "";
  $("#department").value = student.department || "";
  $("#batch").value = student.batch || "";
  $("#section").value = student.section || "";
  $("#studyYear").value = student.studyYear || "";
  $("#admissionDate").value = student.admissionDate || "";
  $("#status").value = student.status || "Enrolled";
  $("#cgpa").value = student.cgpa || "";
  $("#presentAddress").value = student.presentAddress || "";
  $("#permanentAddress").value = student.permanentAddress || "";
  $("#mobile").value = student.mobile || "";
  $("#guardianPhone").value = student.guardianPhone || "";
  $("#email").value = student.email || "";
  $("#accessKey").value = student.key || "";
  photoData = student.photo || "";
  $("#photoPreview").innerHTML = photoData ? `<img src="${photoData}" alt="${student.name}">` : "No Image";
  $("#educationRows").innerHTML = "";
  (student.education || []).forEach((row) => educationRow(row));
  if (!student.education || !student.education.length) {
    educationRow({ exam: "S.S.C" });
    educationRow({ exam: "H.S.C" });
  }
  setView("studentForm");
}

async function saveForm(event) {
  event.preventDefault();
  const students = getStudents();
  const originalId = $("#editingId").value;
  const id = $("#studentId").value.trim();
  const duplicate = students.find((student) => student.id === id && student.id !== originalId);
  if (duplicate) {
    showToast("Student ID already exists");
    return;
  }

  const record = {
    id,
    name: $("#fullName").value.trim(),
    dob: $("#dob").value,
    birthPlace: $("#birthPlace").value,
    bloodGroup: $("#bloodGroup").value,
    nationalId: $("#nationalId").value,
    religion: $("#religion").value,
    fatherName: $("#fatherName").value,
    motherName: $("#motherName").value,
    program: $("#program").value,
    department: $("#department").value,
    batch: $("#batch").value,
    section: $("#section").value,
    studyYear: $("#studyYear").value,
    admissionDate: $("#admissionDate").value,
    status: $("#status").value,
    cgpa: $("#cgpa").value,
    presentAddress: $("#presentAddress").value,
    permanentAddress: $("#permanentAddress").value,
    mobile: $("#mobile").value,
    guardianPhone: $("#guardianPhone").value,
    email: $("#email").value.trim(),
    key: $("#accessKey").value.trim() || generateKey(id),
    photo: photoData,
    education: collectEducation(),
    results: originalId ? students.find((student) => student.id === originalId)?.results || "No result added" : "No result added",
    payment: originalId ? students.find((student) => student.id === originalId)?.payment || "Due" : "Due"
  };

  const next = originalId
    ? students.map((student) => (student.id === originalId ? record : student))
    : [record, ...students];
  saveStudents(next);
  if (window.RudBackend?.enabled) {
    try {
      await window.RudBackend.upsertStudent(record);
    } catch (error) {
      showToast("Student saved locally. Supabase save failed.");
      console.error(error);
    }
  }
  resetForm();
  renderAll();
  setView("studentDirectory");
  showToast("Student saved successfully");
}

async function deleteStudent(id) {
  const students = getStudents().filter((student) => student.id !== id);
  saveStudents(students);
  if (window.RudBackend?.enabled) {
    try {
      await window.RudBackend.deleteStudent(id);
    } catch (error) {
      showToast("Deleted locally. Supabase delete failed.");
      console.error(error);
    }
  }
  renderAll();
  showToast("Student deleted");
}

function copyKey(key) {
  navigator.clipboard?.writeText(key);
  showToast(`Access key: ${key}`);
}

function autoLoginLink(student) {
  const url = new URL("student-login.html", window.location.href);
  url.searchParams.set("sid", student.id);
  url.searchParams.set("token", student.key || "");
  return url.toString();
}

function openQrModal(student) {
  const modal = $("#qrModal");
  const image = $("#qrImage");
  const input = $("#qrLink");
  const link = autoLoginLink(student);
  image.src = `https://api.qrserver.com/v1/create-qr-code/?size=240x240&margin=10&data=${encodeURIComponent(link)}`;
  input.value = link;
  modal.hidden = false;
}

function closeQrModal() {
  const modal = $("#qrModal");
  if (modal) modal.hidden = true;
}

function loginStudent(event) {
  event.preventDefault();
  const email = $("#loginEmail").value.trim().toLowerCase();
  const key = $("#loginKey").value.trim();
  const student = getStudents().find((item) => item.email.toLowerCase() === email && item.key === key);
  if (!student) {
    $("#loginHint").textContent = "Invalid email or access key.";
    return;
  }
  $("#loginHint").textContent = "";
  renderStudentProfile(student);
}

function renderStudentProfile(student) {
  const notices = getNotices();
  $("#studentProfile").innerHTML = `
    <div class="profile-head">
      ${avatar(student)}
      <div>
        <h2>${student.name}</h2>
        <p>${student.program} | Batch ${student.batch}</p>
      </div>
    </div>
    <div class="info-grid">
      <div class="info-box"><span>Student ID</span><strong>${student.id}</strong></div>
      <div class="info-box"><span>Status</span><strong>${student.status}</strong></div>
      <div class="info-box"><span>CGPA</span><strong>${student.cgpa || "N/A"}</strong></div>
      <div class="info-box"><span>Payment</span><strong>${student.payment || "Due"}</strong></div>
      <div class="info-box"><span>Mobile</span><strong>${student.mobile || "N/A"}</strong></div>
      <div class="info-box"><span>Email</span><strong>${student.email}</strong></div>
      <div class="info-box wide"><span>Result</span><strong>${student.results || "No result added"}</strong></div>
      <div class="info-box wide"><span>Latest Notice</span><strong>${notices[0]?.title || "No notice"}</strong></div>
    </div>
  `;
}

function renderAll() {
  renderDashboard();
  renderStudentTable();
}

document.addEventListener("click", (event) => {
  const viewButton = event.target.closest("[data-view]");
  if (viewButton) setView(viewButton.dataset.view);

  const editButton = event.target.closest("[data-edit]");
  if (editButton) {
    const student = getStudents().find((item) => item.id === editButton.dataset.edit);
    if (student) fillForm(student);
  }

  const deleteButton = event.target.closest("[data-delete]");
  if (deleteButton) deleteStudent(deleteButton.dataset.delete);

  const copyButton = event.target.closest("[data-copy]");
  if (copyButton) copyKey(copyButton.dataset.copy);

  const qrButton = event.target.closest("[data-qr]");
  if (qrButton) {
    const student = getStudents().find((item) => item.id === qrButton.dataset.qr);
    if (student) openQrModal(student);
  }

  if (event.target.matches("[data-remove-row]")) {
    event.target.closest("tr").remove();
  }
});

if ($("#studentSearch")) $("#studentSearch").addEventListener("input", renderStudentTable);
if ($("#statusFilter")) $("#statusFilter").addEventListener("change", renderStudentTable);
if ($("#studentFormEl")) $("#studentFormEl").addEventListener("submit", saveForm);
if ($("#loginForm")) $("#loginForm").addEventListener("submit", loginStudent);
if ($("#qrClose")) $("#qrClose").addEventListener("click", closeQrModal);
if ($("#qrModal")) {
  $("#qrModal").addEventListener("click", (event) => {
    if (event.target.id === "qrModal") closeQrModal();
  });
}
if ($("#copyQrLink")) {
  $("#copyQrLink").addEventListener("click", () => {
    navigator.clipboard?.writeText($("#qrLink").value);
    showToast("QR login link copied");
  });
}
if ($("#addEducationRow")) $("#addEducationRow").addEventListener("click", () => educationRow());

if ($("#noticeForm")) $("#noticeForm").addEventListener("submit", async (event) => {
  event.preventDefault();
  const notice = { title: $("#noticeTitle").value.trim(), body: $("#noticeBody").value.trim() };
  const notices = [notice, ...getNotices()];
  saveNotices(notices);
  if (window.RudBackend?.enabled) {
    try {
      await window.RudBackend.addNotice(notice);
    } catch (error) {
      showToast("Notice saved locally. Supabase save failed.");
      console.error(error);
    }
  }
  event.target.reset();
  renderNotices();
  showToast("Notice published");
});

if ($("#resetDemo")) {
  $("#resetDemo").addEventListener("click", () => {
    localStorage.removeItem(storageKey);
    localStorage.removeItem(noticeKey);
    resetForm();
    renderAll();
    showToast("Demo data reset");
  });
}

if ($("#adminLogout")) {
  $("#adminLogout").addEventListener("click", () => {
    sessionStorage.removeItem(adminSessionKey);
    localStorage.removeItem(adminSessionKey);
    window.location.href = "admin-login.html";
  });
}

if ($("#photoInput")) $("#photoInput").addEventListener("change", (event) => {
  const file = event.target.files[0];
  if (!file) return;
  if (file.size > 2 * 1024 * 1024) {
    showToast("Photo must be under 2MB");
    event.target.value = "";
    return;
  }
  const reader = new FileReader();
  reader.onload = () => {
    photoData = reader.result;
    $("#photoPreview").innerHTML = `<img src="${photoData}" alt="Student photo">`;
  };
  reader.readAsDataURL(file);
});

async function startAdminPortal() {
  resetForm();
  await loadPortalData();
  renderAll();
}

startAdminPortal();
