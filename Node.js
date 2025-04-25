
// مصفوفة لتخزين بيانات الطلاب
let students = JSON.parse(localStorage.getItem('students')) || [];

// دالة لإضافة أو تحديث طالب
function addStudent() {
    const name = document.getElementById('studentName').value.trim();
    const specialty = document.getElementById('specialty').value;
    const group = document.getElementById('group').value;
    const absences = parseInt(document.getElementById('absenceCount').value);
    const status = document.getElementById('status').value;
    const notes = document.getElementById('notes').value.trim();
    
    if (!name) {
        alert('الرجاء إدخال اسم الطالب كاملاً');
        return;
    }

    const now = new Date();
    const dateTime = now.toLocaleString('ar-EG');

    // التحقق مما إذا كان الطالب موجوداً بالفعل
    const existingIndex = students.findIndex(s => s.name === name && s.specialty === specialty && s.group === group);
    
    if (existingIndex >= 0) {
        // تحديث الطالب الموجود
        students[existingIndex] = {
            name,
            specialty,
            group,
            absences,
            status,
            dateTime,
            notes
        };
    } else {
        // إضافة طالب جديد
        students.push({
            name,
            specialty,
            group,
            absences,
            status,
            dateTime,
            notes
        });
    }

    // حفظ البيانات وتحديث الجدول
    saveData();
    renderTable();
    clearForm();
}

// دالة لتسجيل الحضور
function markPresent() {
    document.getElementById('status').value = 'حاضر';
    addStudent();
}

// دالة لتسجيل الغياب
function markAbsent() {
    document.getElementById('status').value = 'غائب';
    const absenceCount = document.getElementById('absenceCount');
    absenceCount.value = parseInt(absenceCount.value) + 1;
    addStudent();
}

// دالة لحذف طالب
function deleteStudent(index) {
    if (confirm('هل أنت متأكد من حذف هذا الطالب؟')) {
        students.splice(index, 1);
        saveData();
        renderTable();
    }
}

// دالة لتخفيض عدد الغيابات
function decreaseAbsence(index) {
    if (students[index].absences > 0) {
        students[index].absences -= 1;
        saveData();
        renderTable();
    }
}

// دالة لحفظ البيانات في localStorage
function saveData() {
    localStorage.setItem('students', JSON.stringify(students));
}

// دالة لعرض البيانات في الجدول
function renderTable() {
    const tableBody = document.getElementById('tableBody');
    tableBody.innerHTML = '';

    students.forEach((student, index) => {
        const row = document.createElement('tr');
        
        // إضافة خلايا الصف
        row.innerHTML = `
            <td>${student.name}</td>
            <td>${student.specialty}</td>
            <td>${student.group}</td>
            <td class="status-${student.status === 'حاضر' ? 'present' : 'absent'}">${student.status}</td>
            <td>${student.absences}</td>
            <td>${student.dateTime}</td>
            <td>${student.notes || '-'}</td>
            <td>
                <button class="btn-warning" onclick="decreaseAbsence(${index})">خفض غياب</button>
                <button class="btn-danger" onclick="deleteStudent(${index})">حذف</button>
            </td>
        `;
        
        tableBody.appendChild(row);
    });
}

// دالة لمسح حقول الإدخال
function clearForm() {
    document.getElementById('studentName').value = '';
    document.getElementById('absenceCount').value = '0';
    document.getElementById('notes').value = '';
    document.getElementById('status').value = 'حاضر';
}

// تحميل البيانات عند بدء التشغيل
document.addEventListener('DOMContentLoaded', renderTable);