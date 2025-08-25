const createBtn = document.getElementById('createSubjectsBtn');
const subjectsForm = document.getElementById('subjectsForm');
const sgpaResult = document.getElementById('sgpaResult');
const exportBtn = document.getElementById('exportBtn');

// Letter grades mapping
const gradeMap = { "S": 10, "A": 9, "B": 8, "C": 7, "D": 6, "E": 5, "F": 0 };

let subjects = [];

// Create input fields
createBtn.addEventListener('click', () => {
    subjectsForm.innerHTML = '';
    sgpaResult.textContent = "SGPA: 0.00";
    subjects = [];

    const num = parseInt(document.getElementById('numSubjects').value);
    if (!num || num < 1) {
        alert('Enter a valid number of subjects!');
        return;
    }

    for (let i = 0; i < num; i++) {
        const div = document.createElement('div');

        const gradeSelect = document.createElement('select');
        gradeSelect.innerHTML = `
      <option value="">Grade for Subject ${i + 1}</option>
      <option value="S">S</option>
      <option value="A">A</option>
      <option value="B">B</option>
      <option value="C">C</option>
      <option value="D">D</option>
      <option value="E">E</option>
      <option value="F">F</option>
    `;

        const creditInput = document.createElement('input');
        creditInput.type = 'number';
        creditInput.placeholder = `Credits for Subject ${i + 1}`;
        creditInput.min = 1;

        div.appendChild(gradeSelect);
        div.appendChild(creditInput);
        subjectsForm.appendChild(div);

        subjects.push({ gradeSelect, creditInput });
    }
});

// Calculate SGPA
subjectsForm.addEventListener('input', () => {
    let totalPoints = 0;
    let totalCredits = 0;

    subjects.forEach(sub => {
        const grade = gradeMap[sub.gradeSelect.value];
        const credit = parseFloat(sub.creditInput.value);

        if (grade !== undefined && !isNaN(credit)) {
            totalPoints += grade * credit;
            totalCredits += credit;
        }
    });

    const sgpa = totalCredits ? (totalPoints / totalCredits).toFixed(2) : "0.00";
    sgpaResult.textContent = `SGPA: ${sgpa}`;
});

// Export PDF with table
exportBtn.addEventListener('click', () => {
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();

    doc.setFontSize(16);
    doc.text("SGPA Result", 105, 20, { align: "center" });

    // Prepare table data
    const tableData = subjects.map((sub, idx) => [
        `Subject ${idx + 1}`,
        sub.gradeSelect.value || "-",
        sub.creditInput.value || "-"
    ]);

    doc.autoTable({
        head: [['Subject', 'Grade', 'Credits']],
        body: tableData,
        startY: 35,
        theme: 'grid',
        headStyles: { fillColor: [100, 149, 237] }, // Cornflower blue header
        styles: { fontSize: 12 }
    });

    // SGPA at the bottom
    const finalY = doc.lastAutoTable.finalY + 10;
    doc.setFontSize(14);
    doc.text(`${sgpaResult.textContent}`, 105, finalY, { align: "center" });

    doc.save("SGPA_Result.pdf");
});
