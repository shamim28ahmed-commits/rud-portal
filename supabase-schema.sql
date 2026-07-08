(function () {
  const config = window.RUD_SUPABASE || {};
  const enabled = Boolean(config.url && config.anonKey && window.supabase);
  const client = enabled ? window.supabase.createClient(config.url, config.anonKey) : null;

  function toStudent(row) {
    return {
      id: row.id,
      name: row.name || "",
      status: row.status || "Enrolled",
      program: row.program || "",
      department: row.department || "",
      batch: row.batch || "",
      section: row.section || "",
      studyYear: row.study_year || "",
      admissionDate: row.admission_date || "",
      dob: row.dob || "",
      bloodGroup: row.blood_group || "",
      nationalId: row.national_id || "",
      religion: row.religion || "",
      fatherName: row.father_name || "",
      motherName: row.mother_name || "",
      presentAddress: row.present_address || "",
      permanentAddress: row.permanent_address || "",
      mobile: row.mobile || "",
      guardianPhone: row.guardian_phone || "",
      email: row.email || "",
      key: row.access_key || "",
      cgpa: row.cgpa || "",
      payment: row.payment || "Due",
      results: row.results || "",
      photo: row.photo || "",
      education: row.education || [],
      core: row.core || "",
      major: row.major || "",
      secondMajor: row.second_major || "",
      minor: row.minor || "",
      registeredCredits: row.registered_credits || "",
      completedCredits: row.completed_credits || "",
      curriculumCourses: row.curriculum_courses || []
    };
  }

  function fromStudent(student) {
    return {
      id: student.id,
      name: student.name || "",
      status: student.status || "Enrolled",
      program: student.program || "",
      department: student.department || "",
      batch: student.batch || "",
      section: student.section || "",
      study_year: student.studyYear || "",
      admission_date: student.admissionDate || null,
      dob: student.dob || null,
      blood_group: student.bloodGroup || "",
      national_id: student.nationalId || "",
      religion: student.religion || "",
      father_name: student.fatherName || "",
      mother_name: student.motherName || "",
      present_address: student.presentAddress || "",
      permanent_address: student.permanentAddress || "",
      mobile: student.mobile || "",
      guardian_phone: student.guardianPhone || "",
      email: student.email || "",
      access_key: student.key || "",
      cgpa: student.cgpa || "",
      payment: student.payment || "Due",
      results: student.results || "",
      photo: student.photo || "",
      education: student.education || [],
      core: student.core || "",
      major: student.major || "",
      second_major: student.secondMajor || "",
      minor: student.minor || "",
      registered_credits: student.registeredCredits || "",
      completed_credits: student.completedCredits || "",
      curriculum_courses: student.curriculumCourses || []
    };
  }

  async function listStudents() {
    if (!client) return null;
    const { data, error } = await client.from("students").select("*").order("created_at", { ascending: false });
    if (error) throw error;
    return data.map(toStudent);
  }

  async function upsertStudent(student) {
    if (!client) return null;
    const { error } = await client.from("students").upsert(fromStudent(student), { onConflict: "id" });
    if (error) throw error;
    return true;
  }

  async function deleteStudent(id) {
    if (!client) return null;
    const { error } = await client.from("students").delete().eq("id", id);
    if (error) throw error;
    return true;
  }

  async function listNotices() {
    if (!client) return null;
    const { data, error } = await client.from("notices").select("*").order("created_at", { ascending: false });
    if (error) throw error;
    return data.map((row) => ({ id: row.id, title: row.title || "", body: row.body || "" }));
  }

  async function addNotice(notice) {
    if (!client) return null;
    const { error } = await client.from("notices").insert({ title: notice.title, body: notice.body });
    if (error) throw error;
    return true;
  }

  window.RudBackend = {
    enabled,
    listStudents,
    upsertStudent,
    deleteStudent,
    listNotices,
    addNotice
  };
})();
