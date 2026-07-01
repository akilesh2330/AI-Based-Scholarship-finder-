const scholarships = [
    {
      Name: "First Graduate Scholarship",
      Category: "General",
      incomeLimit: 200000,
      minMarks: 60,
      requiredDocs: "Community Certificate, Income Certificate, First Graduate Certificate",
      explanation: "This scholarship supports first generation graduates from economically weaker sections.",
      deadline: "2027-07-31"
    },
    {
      Name: "BC/MBC Post Matric Scholarship",
      Category: "OBC",
      incomeLimit: 250000,
      minMarks: 60,
      requiredDocs: "Community Certificate, Income Certificate, Marksheet",
      explanation: "Aimed at students belonging to BC and MBC categories pursuing post-matric studies.",
      deadline: "2026-08-15"
    },
    {
      Name: "SC/ST Post Matric Scholarship",
      Category: "SC",
      incomeLimit: 250000,
      minMarks: 50,
      requiredDocs: "Caste Certificate, Income Certificate, Marksheet",
      explanation: "Designed for SC/ST students to support their higher education expenses.",
      deadline: "2028-06-30"
    },
    {
      Name: "Moovalur Ramamirtham Scheme",
      Category: "General",
      incomeLimit: 500000,
      minMarks: 60,
      requiredDocs: "Bank Passbook, Aadhar Card, College ID",
      explanation: "Provides financial assistance to deserving students under the Moovalur Ramamirtham scheme.",
      deadline: "2032-09-05"
    },
    {
      Name: "EVR Nagammai Scholarship",
      Category: "OBC",
      incomeLimit: 200000,
      minMarks: 65,
      requiredDocs: "Community Certificate, Marksheet",
      explanation: "Scholarship for OBC students excelling in academics.",
      deadline: "2024-07-15"
    },
    {
      Name: "National Means-cum-Merit Scholarship (NMMS)",
      Category: "General",
      incomeLimit: 150000,
      minMarks: 55,
      requiredDocs: "Income Certificate, Marksheet, Caste Certificate (if applicable)",
      explanation: "Supports meritorious students from economically weaker sections to reduce dropout after class 8.",
      deadline: "2027-11-15"
    },
    {
      Name: "Inspire Scholarship for Higher Education (SHE)",
      Category: "General",
      incomeLimit: 500000,
      minMarks: 85,
      requiredDocs: "Marksheet, Income Certificate, Aadhar Card",
      explanation: "For students pursuing BSc, BS, and MSc courses in Natural and Basic Sciences.",
      deadline: "2026-10-20"
    },
    {
      Name: "Tamil Nadu Free Education Scheme for Girls",
      Category: "General",
      incomeLimit: 300000,
      minMarks: 50,
      requiredDocs: "Community Certificate, Marksheet, College ID",
      explanation: "Provides tuition fee waiver for girl students from Tamil Nadu.",
      deadline: "2030-08-10"
    },
    {
      Name: "Post Matric Scholarship for Minority Students",
      Category: "General",
      incomeLimit: 200000,
      minMarks: 50,
      requiredDocs: "Minority Certificate, Marksheet, Income Certificate",
      explanation: "Supports students belonging to minority communities at post-matric level.",
      deadline: "2025-09-30"
    },
    {
      Name: "Pragati Scholarship for Girl Students",
      Category: "General",
      incomeLimit: 800000,
      minMarks: 60,
      requiredDocs: "Aadhar Card, Marksheet, Income Certificate",
      explanation: "AICTE scheme for girl students pursuing technical education.",
      deadline: "2026-07-02"
    }
  ];
  function getDeadlineStatus(deadline) {

    const today = new Date();
    const deadlineDate = new Date(deadline);

    // Ignore time
    today.setHours(0, 0, 0, 0);
    deadlineDate.setHours(0, 0, 0, 0);

    const difference =
        Math.ceil((deadlineDate - today) / (1000 * 60 * 60 * 24));

    if (difference < 0) {
        return {
            text: "❌ Deadline Expired",
            color: "red"
        };
    }

    if (difference === 0) {
        return {
            text: "🚨 Deadline is Today",
            color: "red"
        };
    }

    if (difference <= 7) {
        return {
            text: "⚠️ Only " + difference + " day(s) left",
            color: "orange"
        };
    }

    return {
        text: "✅ " + difference + " days remaining",
        color: "green"
    };

}
  function displayScholarships(list) {
    const resultDiv = document.getElementById('results');
    resultDiv.innerHTML = "";
  
    if (list.length === 0) {
      resultDiv.innerHTML = "<p>No matching scholarships found.</p>";
      return;
    }
  
    list.sort((a, b) => new Date(a.deadline) - new Date(b.deadline));
  
    list.forEach(sch => {
      const card = document.createElement('div');
      card.className = 'card';
  
      const deadlineStr = new Date(sch.deadline).toLocaleDateString(undefined, {
        year: 'numeric', month: 'long', day: 'numeric'
      });
      const status = getDeadlineStatus(sch.deadline);
  
      card.innerHTML = `
    <strong>${sch.Name}</strong><br>

    <span><strong>Required Documents:</strong> ${sch.requiredDocs}</span><br>

    <span><strong>Deadline:</strong> ${deadlineStr}</span><br>

    <p style="color:${status.color}; font-weight:bold;">
        ${status.text}
    </p>

    <div class="details">
        <p><strong>Explanation:</strong> ${sch.explanation}</p>
    </div>
`;
  
      card.addEventListener('click', () => {
        card.classList.toggle('active');
      });
  
      resultDiv.appendChild(card);
    });
  }
  
  async function askDeepSeek(promptText) {
    try {
      const response = await fetch("https://api.deepseek.com/v1/chat/completions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": "Bearer sk-88d1c600ad2a4472940e9b268373413d"
        },
        body: JSON.stringify({
          model: "deepseek-chat",
          messages: [
            { role: "system", content: "You are an expert in Indian scholarships and student welfare." },
            { role: "user", content: promptText }
          ]
        })
      });
  
      const data = await response.json();
      if (data?.choices?.[0]?.message?.content) {
        return data.choices[0].message.content;
      } else {
        console.error("Unexpected response:", data);
        return "DeepSeek did not return a valid response.";
      }
    } catch (error) {
      console.error("DeepSeek API Error:", error);
      return "Something went wrong while contacting DeepSeek AI.";
    }
  }
  
  window.addEventListener('DOMContentLoaded', () => {
    displayScholarships(scholarships);
  });
  
  document.getElementById('scholarshipForm').addEventListener('submit', async function (e) {
    e.preventDefault();
  
    const name = document.getElementById('studentName').value.trim();
    const category = document.getElementById('category').value;
    const income = parseInt(document.getElementById('income').value);
    const marks = parseInt(document.getElementById('marks').value);
    const school = document.getElementById('school').value.trim();
    const district = document.getElementById('district').value.trim();
    const state = document.getElementById('state').value.trim();
  
    if (!category || isNaN(income) || isNaN(marks)) {
      alert("Please complete all fields correctly.");
      return;
    }
  
    if (income < 24000) {
      alert("Minimum annual income must be ₹24,000 or more.");
      return;
    }
  
    const matched = scholarships.filter(sch =>
      sch.Category === category &&
      income <= sch.incomeLimit &&
      marks >= sch.minMarks
    );
    console.log(matched);
    displayScholarships(matched);
  
    // Loading placeholder
    const resultDiv = document.getElementById('results');
    const loadingCard = document.createElement('div');
    loadingCard.className = 'card';
    loadingCard.innerHTML = `<strong>AI-Powered Suggestions</strong><p>Loading suggestions from DeepSeek AI...</p>`;
    resultDiv.appendChild(loadingCard);
  
    const prompt = `
      Name: ${name}
      Category: ${category}
      Marks: ${marks}%
      Income: ₹${income}
      School: ${school}
      District: ${district}
      State: ${state}
  
      Based on this student's profile, recommend the best scholarships in India.
      Be specific and helpful. Include government and private options if possible.
    `;
  
    loadingCard.innerHTML = `
    <strong>AI-Powered Suggestions</strong>
    <div class="details">
        <p>AI feature is temporarily disabled.</p>
    </div>
`;
  });