const storageKey = "rudPortalStudents";
const sessionKey = "rudPortalActiveStudentId";

const fallbackStudents = [
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
    bloodGroup: "B+",
    nationalId: "",
    dob: "",
    birthPlace: "",
    fatherName: "Md. Hasan",
    motherName: "Mst. Hasan",
    religion: "Islam",
    presentAddress: "Dhaka, Bangladesh",
    permanentAddress: "Dhaka, Bangladesh",
    mobile: "01700000001",
    guardianPhone: "01800000001",
    email: "hasansafol2000@gmail.com",
    key: "RUD2203",
    cgpa: "3.72",
    payment: "Paid",
    results: "Spring 2026: GPA 3.70",
    education: [
      { exam: "S.S.C", group: "Science", institute: "Model School", year: "2016", division: "GPA 5.00", marks: "A+" },
      { exam: "H.S.C", group: "Science", institute: "City College", year: "2018", division: "GPA 4.80", marks: "A" }
    ]
  }
];

let currentStudents = [];
let studentsReady = Promise.resolve();

function students() {
  return currentStudents;
}

function localStudents() {
  const saved = localStorage.getItem(storageKey);
  if (saved) return JSON.parse(saved);
  localStorage.setItem(storageKey, JSON.stringify(fallbackStudents));
  return fallbackStudents;
}

function saveStudents(nextStudents) {
  currentStudents = nextStudents;
  localStorage.setItem(storageKey, JSON.stringify(nextStudents));
}

async function loadStudents() {
  currentStudents = localStudents();

  if (!window.RudBackend?.enabled) {
    if (!handleAutoLogin()) restorePortalSession();
    return;
  }

  try {
    const remoteStudents = await window.RudBackend.listStudents();
    if (remoteStudents && remoteStudents.length) saveStudents(remoteStudents);
  } catch (error) {
    console.error(error);
  }
  if (!handleAutoLogin()) restorePortalSession();
}

function handleAutoLogin() {
  const params = new URLSearchParams(window.location.search);
  const studentId = params.get("sid") || params.get("student") || params.get("id");
  const token = params.get("token") || params.get("key") || params.get("password");
  if (!studentId && !token) return false;

  const student = students().find((item) => {
    return item.id === studentId && item.key === token;
  });

  if (!student) {
    localStorage.removeItem(sessionKey);
    document.querySelector("#classicError").textContent = "Invalid QR login link.";
    return true;
  }

  document.querySelector("#classicError").textContent = "";
  showProfile(student);
  window.history.replaceState({}, document.title, window.location.pathname);
  return true;
}

function restorePortalSession() {
  const activeId = localStorage.getItem(sessionKey);
  if (!activeId) return;
  const student = students().find((item) => item.id === activeId);
  if (student) {
    document.querySelector("#classicError").textContent = "";
    showProfile(student);
  } else {
    localStorage.removeItem(sessionKey);
  }
}

function showProfile(student) {
  const profile = document.querySelector("#classicProfile");
  document.body.classList.add("portal-open");
  document.querySelector("#classicLoginCard").hidden = true;
  document.querySelector(".student-alert").hidden = true;
  profile.hidden = false;
  localStorage.setItem(sessionKey, student.id);

  const photo = student.photo
    ? `<img src="${student.photo}" alt="${student.name}">`
    : `<span class="student-no-photo">No Image</span>`;

  window.currentPortalStudent = student;
  window.currentPortalPhoto = photo;

  profile.innerHTML = `
    <header class="portal-topbar">
      <div class="portal-logo-wrap">
        <img src="assets/rud-logo.png" alt="RUD logo">
        <div><strong>RUD</strong><span>PORTAL</span></div>
      </div>
      <button class="portal-round portal-quick-toggle" type="button" aria-label="Toggle quick menu">⌃</button>
      <button class="portal-round portal-side-toggle" type="button" aria-label="Toggle side menu">☰</button>
      <nav class="portal-menu">
        <button type="button" data-portal-view="courses">Courses & Results</button>
        <button type="button" data-portal-view="registration">Registration</button>
        <button type="button" data-portal-view="grade">Grade Report</button>
        <button type="button" data-portal-view="download">Download Form</button>
        <strong>Welcome ${student.name}</strong>
      </nav>
      <div class="portal-user-icons">
        <button class="bell" type="button" data-portal-view="notice">1</button>
        <button class="user-dot portal-account-toggle" type="button" aria-label="User menu">●</button>
        <div class="portal-account-menu">
          <button type="button" data-portal-view="personal">User Profile</button>
          <button type="button" data-portal-view="password">Change Password</button>
          <button type="button" data-portal-view="logout">LogOut</button>
        </div>
      </div>
    </header>

    <div class="portal-body">
      <aside class="portal-side">
        <button type="button" data-portal-view="courses">Academics <span>v</span></button>
        <button type="button" data-portal-view="grade">Grade Reports <span>v</span></button>
        <button type="button" data-portal-view="library">Library <span>v</span></button>
        <button type="button" data-portal-view="payment">Payment Information <span>v</span></button>
        <button class="active" type="button" data-portal-view="personal">Personal Information & Setting <span>^</span></button>
        <button class="side-link active-link" type="button" data-portal-view="personal">Personal Information</button>
        <button class="side-link" type="button" data-portal-view="password">Change Password</button>
      </aside>

      <main class="portal-content">
        <div class="portal-section-title">Student Information</div>
        <section class="student-info-card" id="portalContent"></section>
      </main>
    </div>
  `;

  bindPortalActions();
  renderPortalView("registration");
}

function bindPortalActions() {
  document.querySelector(".portal-quick-toggle")?.addEventListener("click", () => {
    document.body.classList.toggle("quick-open");
    document.body.classList.remove("side-open", "account-open");
  });

  document.querySelector(".portal-side-toggle")?.addEventListener("click", () => {
    document.body.classList.toggle("side-open");
    document.body.classList.remove("quick-open", "account-open");
  });

  document.querySelector(".portal-account-toggle")?.addEventListener("click", () => {
    document.body.classList.toggle("account-open");
    document.body.classList.remove("quick-open", "side-open");
  });

  const profileShell = document.querySelector("#classicProfile");
  if (profileShell && !profileShell.dataset.portalBound) {
    profileShell.dataset.portalBound = "true";
    profileShell.addEventListener("click", (event) => {
      const viewButton = event.target.closest("[data-portal-view]");
      const tabButton = event.target.closest("[data-tab]");

      if (viewButton) {
        const view = viewButton.dataset.portalView;
        if (view === "logout") {
          logoutPortal();
          return;
        }
        document.body.classList.remove("quick-open", "side-open", "account-open");
        renderPortalView(view);
        return;
      }

      if (tabButton) {
        document.body.classList.remove("quick-open", "side-open", "account-open");
        renderPortalView(tabButton.dataset.tab);
      }
    });
  }
}

function renderPortalView(view) {
  const student = window.currentPortalStudent;
  const content = document.querySelector("#portalContent");
  const portalContent = document.querySelector(".portal-content");
  const titles = {
    personal: "Student Information",
    education: "Education Information",
    courses: "Courses & Results",
    registration: "Registration",
    grade: "Grade Report",
    download: "Download Form",
    library: "Library",
    payment: "Payment Information",
    password: "Change Password",
    notice: "Notice"
  };

  document.querySelector(".portal-section-title").textContent = titles[view] || "Student Information";
  portalContent?.classList.toggle("registration-summary-view", view === "registration");
  document.querySelectorAll(".side-link").forEach((item) => {
    item.classList.toggle("active-link", item.dataset.portalView === view);
  });

  if (view === "personal") content.innerHTML = personalHtml(student, "general");
  if (view === "education") content.innerHTML = personalHtml(student, "education");
  if (view === "courses") {
    content.innerHTML = simplePanel("Courses & Results", [
      ["Course", "Principles of Management", "Completed"],
      ["Course", "Business Communication", "Completed"],
      ["Result", student.results || "Result not published yet", student.results ? "Published" : "Pending"]
    ]);
  }
  if (view === "registration") {
    content.innerHTML = `
      ${studentSummaryHtml(student)}
      ${registrationPanel()}
    `;
  }
  if (view === "grade") content.innerHTML = curriculumGradeReport(student);
  if (view === "download") content.innerHTML = downloadPanel();
  if (view === "library") content.innerHTML = simplePanel("Library", [
    ["Library ID", student.id, "Active"],
    ["Borrowed Books", "0", "Clear"]
  ]);
  if (view === "payment") content.innerHTML = simplePanel("Payment Information", [
    ["Payment Status", student.payment || "Due", "Current"],
    ["Last Update", "Demo data", "Local"]
  ]);
  if (view === "password") content.innerHTML = passwordPanel();
  if (view === "notice") content.innerHTML = simplePanel("Notice", [
    ["Notice", "Semester Final Result Published", "New"],
    ["Reminder", "Please clear due payments before registration.", "Info"]
  ]);

  const passwordForm = document.querySelector("#portalPasswordForm");
  if (passwordForm) passwordForm.addEventListener("submit", changePassword);

  const printButton = document.querySelector("#printCurriculum");
  if (printButton) printButton.addEventListener("click", () => window.print());

  const gradeForm = document.querySelector("#curriculumGradeForm");
  if (gradeForm) gradeForm.addEventListener("submit", saveCurriculumReport);

  const addCourseButton = document.querySelector("#addCurriculumCourse");
  if (addCourseButton) addCourseButton.addEventListener("click", addCurriculumCourseRow);

  document.querySelectorAll("[data-remove-course]").forEach((button) => {
    button.addEventListener("click", () => button.closest("tr").remove());
  });
}

function personalHtml(student, activeTab) {
  const educationRows = (student.education || []).map((row) => `
    <tr>
      <td>${row.exam || ""}</td>
      <td>${row.group || ""}</td>
      <td>${row.institute || ""}</td>
      <td>${row.year || ""}</td>
      <td>${row.division || ""}</td>
      <td>${row.marks || ""}</td>
    </tr>
  `).join("") || `<tr><td colspan="6">No education information added.</td></tr>`;

  return `
    <div class="student-photo">${window.currentPortalPhoto}</div>
    <div class="info-lines primary-info">
      ${line("Student ID", student.id)}
      ${line("Name", student.name)}
      ${line("Blood Group", student.bloodGroup)}
      ${line("National ID", student.nationalId)}
      ${line("Date of Birth", formatDate(student.dob))}
      ${line("Birth Place", student.birthPlace || student.birth_place || student.birthplace)}
    </div>

    <div class="detail-box detail-left">
      ${line("Father's Name", student.fatherName)}
      ${line("Mother's Name", student.motherName)}
      ${line("Religion", student.religion)}
      ${line("Program", student.program)}
    </div>

    <div class="detail-box detail-right">
      ${line("Study Year", student.studyYear)}
      ${line("Passing Year", student.passingYear || student.passing_year)}
      ${line("Batch No.", student.batch)}
      ${line("Section", student.section)}
      ${line("Status", student.status)}
      ${line("Admission Date", formatDate(student.admissionDate))}
    </div>

    <div class="portal-tabs">
      <button class="${activeTab === "general" ? "active" : ""}" type="button" data-tab="personal">General Info</button>
      <button class="${activeTab === "education" ? "active" : ""}" type="button" data-tab="education">Education</button>
    </div>

    ${activeTab === "general" ? `
      <div class="address-box">
        <h3>Present and Permanent Address</h3>
        ${line("Permanent Address", student.permanentAddress)}
        ${line("Present Address", student.presentAddress)}
        ${line("Mobile", student.mobile)}
        ${line("Guardian Phone", student.guardianPhone)}
        ${line("Email", student.email)}
      </div>
    ` : `
      <div class="address-box">
        <h3>Education History</h3>
        <table class="portal-table">
          <thead><tr><th>Exam</th><th>Group</th><th>Institute</th><th>Pass Year</th><th>Division</th><th>Marks</th></tr></thead>
          <tbody>${educationRows}</tbody>
        </table>
      </div>
    `}
  `;
}

function studentSummaryHtml(student) {
  return `
    <section class="student-summary-card">
      <div class="student-summary-title">
        <span>Student Summary</span>
        <button type="button" data-portal-view="personal"><span aria-hidden="true">&#9638;</span> View Details</button>
      </div>
      <div class="student-summary-body">
        <div class="student-summary-photo">${window.currentPortalPhoto}</div>
        <div class="student-summary-lines">
          ${line("Student ID", student.id)}
          ${line("Student Name", student.name)}
          ${line("Department", student.department || student.program)}
          ${line("Batch", student.batch)}
          ${line("Admission Date", formatDate(student.admissionDate))}
          ${line("Completed Credit", student.completedCredits || student.completedCredit)}
          ${line("CGPA", student.cgpa)}
        </div>
      </div>
    </section>
  `;
}

function registrationPanel() {
  return `
    <section class="student-registration-panel">
      <div class="student-registration-title">
        <span>Registration</span>
        <select aria-label="Select registration semester">
          <option value=""></option>
        </select>
      </div>
    </section>
  `;
}

function simplePanel(title, rows) {
  return `
    <div class="portal-wide-panel">
      <h3>${title}</h3>
      ${rows.map((row) => `
        <div class="portal-row-card">
          <b>${row[0]}</b>
          <span>${row[1]}</span>
          <em>${row[2]}</em>
        </div>
      `).join("")}
    </div>
  `;
}

function curriculumGradeReport(student) {
  const courses = student.curriculumCourses || [
    { code: "BUS-101", title: "Introduction to Business", credit: "3", grade: "A-", status: "Completed" },
    { code: "ENG-101", title: "Business English", credit: "3", grade: "B+", status: "Completed" },
    { code: "ACC-101", title: "Principles of Accounting", credit: "3", grade: "A", status: "Completed" }
  ];
  return `
    <form class="curriculum-report" id="curriculumGradeForm">
      <div class="curriculum-header">
        <h3>Curriculum Grade Report</h3>
        <div class="curriculum-actions">
          <button type="button" id="addCurriculumCourse">Add Row</button>
          <button type="submit">Save</button>
          <button type="button" id="printCurriculum">Print</button>
        </div>
      </div>
      <table class="curriculum-info-table">
        <tbody>
          <tr>
            <td>Student ID</td><td>:</td><td><input name="id" value="${student.id || ""}"></td>
            <td>Core</td><td>:</td><td><input name="core" value="${student.core || "BBA(EVE)"}"></td>
          </tr>
          <tr>
            <td>Student Name</td><td>:</td><td><input name="name" value="${student.name || ""}"></td>
            <td>Major</td><td>:</td><td><input name="major" value="${student.major || ""}"></td>
          </tr>
          <tr>
            <td>Registered Credits</td><td>:</td><td><input name="registeredCredits" value="${student.registeredCredits || "-"}"></td>
            <td>Second Major</td><td>:</td><td><input name="secondMajor" value="${student.secondMajor || ""}"></td>
          </tr>
          <tr>
            <td>Completed Credits</td><td>:</td><td><input name="completedCredits" value="${student.completedCredits || student.completedCredit || "-"}"></td>
            <td>Minor</td><td>:</td><td><input name="minor" value="${student.minor || ""}"></td>
          </tr>
          <tr>
            <td>CGPA</td><td>:</td><td><input name="cgpa" value="${student.cgpa || "-"}"></td>
            <td></td><td></td><td></td>
          </tr>
        </tbody>
      </table>

      <h4>Core Curriculum</h4>
      <table class="curriculum-course-table">
        <thead>
          <tr>
            <th>Course Code</th>
            <th>Course Title</th>
            <th>Credit</th>
            <th>Grade</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          ${courses.map((course) => curriculumCourseRow(course)).join("")}
        </tbody>
      </table>
      <p class="curriculum-save-message" id="curriculumSaveMessage"></p>
    </form>
  `;
}

function curriculumCourseRow(course = {}) {
  return `
    <tr>
      <td><input name="courseCode" value="${course.code || ""}" placeholder="BUS-101"></td>
      <td><input name="courseTitle" value="${course.title || ""}" placeholder="Course title"></td>
      <td><input name="courseCredit" value="${course.credit || ""}" placeholder="3"></td>
      <td><input name="courseGrade" value="${course.grade || ""}" placeholder="A"></td>
      <td>
        <input name="courseStatus" value="${course.status || ""}" placeholder="Completed">
        <button type="button" class="remove-course" data-remove-course>Remove</button>
      </td>
    </tr>
  `;
}

function addCurriculumCourseRow() {
  document.querySelector(".curriculum-course-table tbody").insertAdjacentHTML("beforeend", curriculumCourseRow());
  document.querySelectorAll("[data-remove-course]").forEach((button) => {
    button.onclick = () => button.closest("tr").remove();
  });
  const rows = document.querySelectorAll(".curriculum-course-table tbody tr");
  const lastRow = rows[rows.length - 1];
  lastRow?.querySelector("input")?.focus();
  const message = document.querySelector("#curriculumSaveMessage");
  if (message) {
    message.textContent = "New course row added. Fill the row and press Save.";
    message.classList.remove("error");
  }
}

async function saveCurriculumReport(event) {
  event.preventDefault();
  const form = event.currentTarget;
  const student = window.currentPortalStudent;
  if (!form.elements.id.value.trim() || !form.elements.name.value.trim()) {
    const message = document.querySelector("#curriculumSaveMessage");
    message.textContent = "Student ID and Student Name cannot be empty.";
    message.classList.add("error");
    return;
  }
  const courses = [...form.querySelectorAll(".curriculum-course-table tbody tr")].map((row) => ({
    code: row.querySelector('[name="courseCode"]').value.trim(),
    title: row.querySelector('[name="courseTitle"]').value.trim(),
    credit: row.querySelector('[name="courseCredit"]').value.trim(),
    grade: row.querySelector('[name="courseGrade"]').value.trim(),
    status: row.querySelector('[name="courseStatus"]').value.trim()
  }));
  const updated = {
    ...student,
    id: form.elements.id.value.trim(),
    name: form.elements.name.value.trim(),
    core: form.elements.core.value.trim(),
    major: form.elements.major.value.trim(),
    secondMajor: form.elements.secondMajor.value.trim(),
    registeredCredits: form.elements.registeredCredits.value.trim(),
    completedCredits: form.elements.completedCredits.value.trim(),
    minor: form.elements.minor.value.trim(),
    cgpa: form.elements.cgpa.value.trim(),
    curriculumCourses: courses
  };
  const allStudents = students().map((item) => item.id === student.id ? updated : item);
  saveStudents(allStudents);
  if (window.RudBackend?.enabled) {
    try {
      await window.RudBackend.upsertStudent(updated);
    } catch (error) {
      console.error(error);
      const errorMessage = document.querySelector("#curriculumSaveMessage");
      errorMessage.textContent = "Saved locally. Supabase save failed.";
      errorMessage.classList.add("error");
      return;
    }
  }
  window.currentPortalStudent = updated;
  const message = document.querySelector("#curriculumSaveMessage");
  message.textContent = "Curriculum Grade Report saved successfully.";
  message.classList.remove("error");
  alert("Curriculum Grade Report saved successfully.");
}

function downloadPanel() {
  return `
    <div class="portal-wide-panel">
      <h3>Download Form</h3>
      <button type="button" onclick="window.print()">Print Student Information</button>
      <button type="button" onclick="alert('Demo: Registration form download')">Registration Form</button>
      <button type="button" onclick="alert('Demo: Payment slip download')">Payment Slip</button>
    </div>
  `;
}

function passwordPanel() {
  return `
    <form class="portal-password-form" id="portalPasswordForm">
      <label>Current Password<input id="currentPassword" type="password" required></label>
      <label>New Password<input id="newPassword" type="password" required></label>
      <label>Confirm Password<input id="confirmPassword" type="password" required></label>
      <button type="submit">Change Password</button>
      <p id="passwordMessage"></p>
    </form>
  `;
}

async function changePassword(event) {
  event.preventDefault();
  const current = document.querySelector("#currentPassword").value.trim();
  const next = document.querySelector("#newPassword").value.trim();
  const confirm = document.querySelector("#confirmPassword").value.trim();
  const message = document.querySelector("#passwordMessage");
  const student = window.currentPortalStudent;

  if (current !== student.key) {
    message.textContent = "Current password is not correct.";
    return;
  }
  if (next !== confirm) {
    message.textContent = "New password and confirm password do not match.";
    return;
  }

  const updated = { ...student, key: next };
  const allStudents = students().map((item) => item.id === student.id ? updated : item);
  saveStudents(allStudents);
  if (window.RudBackend?.enabled) {
    try {
      await window.RudBackend.upsertStudent(updated);
    } catch (error) {
      console.error(error);
      message.textContent = "Password changed locally. Supabase save failed.";
      return;
    }
  }
  window.currentPortalStudent = updated;
  message.textContent = "Password changed successfully.";
}

function logoutPortal() {
  document.body.classList.remove("portal-open", "quick-open", "side-open", "account-open");
  localStorage.removeItem(sessionKey);
  window.currentPortalStudent = null;
  window.currentPortalPhoto = "";
  const alert = document.querySelector(".student-alert");
  const loginCard = document.querySelector("#classicLoginCard");
  const profile = document.querySelector("#classicProfile");
  const form = document.querySelector("#classicLoginForm");
  const error = document.querySelector("#classicError");
  if (alert) alert.hidden = false;
  if (loginCard) loginCard.hidden = false;
  if (profile) {
    profile.hidden = true;
    profile.innerHTML = "";
  }
  if (form) form.reset();
  if (error) error.textContent = "";
  window.scrollTo({ top: 0, behavior: "smooth" });
}

function line(label, value) {
  return `<p><b>${label}</b><span>:</span><em>${value || ""}</em></p>`;
}

function formatDate(value) {
  if (!value) return "";
  const date = new Date(`${value}T00:00:00`);
  if (Number.isNaN(date.getTime())) return value;
  return date.toLocaleDateString("en-GB");
}

document.querySelector("#classicLoginForm").addEventListener("submit", async (event) => {
  event.preventDefault();
  await studentsReady;
  const userId = document.querySelector("#classicUserId").value.trim();
  const password = document.querySelector("#classicPassword").value.trim();
  const student = students().find((item) => {
    return (item.id === userId || item.email?.toLowerCase() === userId.toLowerCase()) && item.key === password;
  });

  if (!student) {
    document.querySelector("#classicError").textContent = "Invalid User ID or Password.";
    return;
  }

  document.querySelector("#classicError").textContent = "";
  showProfile(student);
});

studentsReady = loadStudents();
