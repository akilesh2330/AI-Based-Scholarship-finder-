/**
 * Scholarship Finder - Core Application Logic
 */

// Dataset of Scholarships in India with active deadlines
const scholarships = [
  {
    id: 1,
    Name: "First Graduate Scholarship",
    Category: "General",
    incomeLimit: 250000,
    minMarks: 60,
    state: "Tamil Nadu",
    requiredDocs: "Community Certificate, Income Certificate, First Graduate Certificate",
    explanation: "Provides tuition fee waiver and financial support for first-generation university graduates from Tamil Nadu families.",
    deadline: "2027-07-31"
  },
  {
    id: 2,
    Name: "BC/MBC Post Matric Scholarship",
    Category: "OBC",
    incomeLimit: 250000,
    minMarks: 60,
    state: "Tamil Nadu",
    requiredDocs: "Community Certificate, Income Certificate, Marksheet, Bank Passbook",
    explanation: "Aimed at students belonging to Backward Classes (BC) & Most Backward Classes (MBC) pursuing post-matric diploma & degree studies.",
    deadline: "2026-12-15"
  },
  {
    id: 3,
    Name: "SC/ST Post Matric Scholarship",
    Category: "SC",
    incomeLimit: 250000,
    minMarks: 50,
    state: "All",
    requiredDocs: "Caste Certificate, Income Certificate, Marksheet, Aadhaar Card",
    explanation: "Centrally sponsored scheme designed for SC/ST students to cover 100% compulsory non-refundable fees and maintenance allowance.",
    deadline: "2028-06-30"
  },
  {
    id: 4,
    Name: "Puthumai Penn / Moovalur Ramamirtham Scheme",
    Category: "General",
    incomeLimit: 500000,
    minMarks: 60,
    state: "Tamil Nadu",
    requiredDocs: "Bank Passbook, Aadhaar Card, College ID, 6th-12th Govt School Transfer Cert",
    explanation: "Provides ₹1,000 monthly financial assistance to girl students who studied 6th to 12th standard in Govt schools for higher education.",
    deadline: "2027-09-05"
  },
  {
    id: 5,
    Name: "EVR Nagammai Scholarship",
    Category: "OBC",
    incomeLimit: 200000,
    minMarks: 65,
    state: "Tamil Nadu",
    requiredDocs: "Community Certificate, Income Certificate, Marksheet",
    explanation: "Special scholarship support for OBC women post-graduate and degree students excelling in academic streams.",
    deadline: "2026-11-30"
  },
  {
    id: 6,
    Name: "National Means-cum-Merit Scholarship (NMMS)",
    Category: "General",
    incomeLimit: 350000,
    minMarks: 55,
    state: "All",
    requiredDocs: "Income Certificate, Class 8 Marksheet, Aadhaar Card, Caste Certificate (if applicable)",
    explanation: "National scheme to award scholarships to meritorious students of economically weaker sections to arrest dropout rate after Class VIII.",
    deadline: "2027-11-15"
  },
  {
    id: 7,
    Name: "Inspire Scholarship for Higher Education (SHE)",
    Category: "General",
    incomeLimit: 500000,
    minMarks: 85,
    state: "All",
    requiredDocs: "12th Board Marksheet, Income Certificate, College Admission Proof, Bank Details",
    explanation: "DST flagship scheme offering ₹80,000/year for top 1% meritorious students pursuing Natural & Basic Sciences (B.Sc, B.S, M.Sc).",
    deadline: "2026-10-20"
  },
  {
    id: 8,
    Name: "Tamil Nadu Free Education Scheme for Girls",
    Category: "General",
    incomeLimit: 300000,
    minMarks: 50,
    state: "Tamil Nadu",
    requiredDocs: "Community Certificate, Marksheet, College ID, Native Certificate",
    explanation: "Offers complete tuition fee waiver for eligible female candidates enrolled in undergraduate degree courses.",
    deadline: "2030-08-10"
  },
  {
    id: 9,
    Name: "Post Matric Scholarship for Minority Students",
    Category: "General",
    incomeLimit: 200000,
    minMarks: 50,
    state: "All",
    requiredDocs: "Minority Community Certificate, Marksheet, Income Certificate, Aadhaar",
    explanation: "Supports students belonging to notified minority communities (Muslims, Christians, Sikhs, Buddhists, Jains, Parsis) pursuing higher education.",
    deadline: "2026-12-31"
  },
  {
    id: 10,
    Name: "AICTE Pragati Scholarship for Girl Students",
    Category: "General",
    incomeLimit: 800000,
    minMarks: 60,
    state: "All",
    requiredDocs: "AICTE Portal Registration, Marksheet, Income Certificate, College Bonafide",
    explanation: "AICTE initiative awarding ₹50,000 per year for girl students admitted to technical degree and diploma programmes.",
    deadline: "2026-10-15"
  }
];

/**
 * Computes remaining days and deadline badge properties
 */
function getDeadlineStatus(deadlineStr) {
  const today = new Date();
  const deadlineDate = new Date(deadlineStr);

  today.setHours(0, 0, 0, 0);
  deadlineDate.setHours(0, 0, 0, 0);

  const diffTime = deadlineDate - today;
  const difference = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

  if (difference < 0) {
    return { text: "❌ Deadline Expired", colorClass: "red" };
  }
  if (difference === 0) {
    return { text: "🚨 Deadline is Today!", colorClass: "red" };
  }
  if (difference <= 14) {
    return { text: `⚠️ Hurry! ${difference} days remaining`, colorClass: "orange" };
  }
  return { text: `✅ ${difference} days remaining`, colorClass: "green" };
}

/**
 * Formats currency in INR format
 */
function formatCurrency(amount) {
  return new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(amount);
}

/**
 * Renders scholarship cards into #results container
 */
function displayScholarships(list, isFiltered = false, studentProfile = null) {
  const resultDiv = document.getElementById('results');
  const countBadge = document.getElementById('scholarshipCountBadge');
  const subtitle = document.getElementById('resultsSubtitle');

  resultDiv.innerHTML = "";

  if (countBadge) {
    countBadge.textContent = `${list.length} Found`;
  }

  if (subtitle) {
    if (isFiltered && studentProfile) {
      subtitle.textContent = `Eligible scholarships for ${studentProfile.name} (${studentProfile.marks}%, ${formatCurrency(studentProfile.income)})`;
    } else {
      subtitle.textContent = "Showing all available scholarship opportunities in India";
    }
  }

  if (list.length === 0) {
    resultDiv.innerHTML = `
      <div class="card" style="cursor: default; text-align: center; padding: 30px;">
        <strong style="color: #64748b; font-size: 18px;">No Matching Scholarships Found</strong>
        <p style="color: #94a3b8; font-size: 14px; margin-top: 8px;">
          Try adjusting your income or percentage criteria to view more opportunities.
        </p>
      </div>
    `;
    return;
  }

  // Sort by deadline closest first
  const sortedList = [...list].sort((a, b) => new Date(a.deadline) - new Date(b.deadline));

  // If user searched, render AI Recommendation card first
  if (isFiltered && studentProfile) {
    const aiCard = generateAISuggestionCard(studentProfile, list);
    resultDiv.appendChild(aiCard);
  }

  sortedList.forEach(sch => {
    const card = document.createElement('div');
    card.className = 'card';

    const deadlineFormatted = new Date(sch.deadline).toLocaleDateString('en-IN', {
      year: 'numeric', month: 'short', day: 'numeric'
    });
    const status = getDeadlineStatus(sch.deadline);

    card.innerHTML = `
      <div class="card-top">
        <div class="card-title">${sch.Name}</div>
        <span class="category-tag">${sch.Category}</span>
      </div>

      <div class="card-body">
        <div class="info-item">
          <strong>Max Income:</strong> ${formatCurrency(sch.incomeLimit)} / year
        </div>
        <div class="info-item">
          <strong>Min Marks Required:</strong> ${sch.minMarks}%
        </div>
        <div class="info-item">
          <strong>Required Documents:</strong> ${sch.requiredDocs}
        </div>
        <div class="info-item">
          <strong>State Eligibility:</strong> ${sch.state}
        </div>

        <div class="deadline-badge ${status.colorClass}">
          ${status.text} (${deadlineFormatted})
        </div>

        <div class="details">
          <p><strong>Overview & Benefits:</strong> ${sch.explanation}</p>
          <p style="margin-top: 6px;"><strong>Application Note:</strong> Keep your income certificate issued after April 1st ready before applying.</p>
        </div>

        <div class="card-hint">Click card to toggle complete details ▾</div>
      </div>
    `;

    card.addEventListener('click', () => {
      card.classList.toggle('active');
    });

    resultDiv.appendChild(card);
  });
}

/**
 * Generates dynamic Smart AI Recommendation Card based on student profile
 */
function generateAISuggestionCard(profile, matchedList) {
  const aiCard = document.createElement('div');
  aiCard.className = 'card ai-recommendation active';

  let insights = [];
  
  if (profile.marks >= 80) {
    insights.push(`🎯 <strong>High Academic Excellence (${profile.marks}%):</strong> You qualify for elite national merit scholarships like <em>Inspire SHE</em> and <em>AICTE Merit Schemes</em>.`);
  } else if (profile.marks >= 60) {
    insights.push(`👍 <strong>Solid Academic Score (${profile.marks}%):</strong> Meets eligibility for major State Post-Matric & General welfare schemes.`);
  }

  if (profile.income <= 250000) {
    insights.push(`💡 <strong>Economically Weaker Section (₹${profile.income.toLocaleString('en-IN')}):</strong> High priority candidate for 100% tuition waivers & maintenance subsidies.`);
  }

  if (profile.state === "Tamil Nadu") {
    insights.push(`🏛️ <strong>Tamil Nadu Native Benefit:</strong> Eligible for state schemes such as First Graduate and Moovalur Ramamirtham / Puthumai Penn assistance.`);
  }

  if (matchedList.length > 0) {
    insights.push(`✨ <strong>Matched Opportunities:</strong> Out of 10 major scholarships, your profile directly matches <strong>${matchedList.length} scholarship(s)</strong>.`);
  }

  aiCard.innerHTML = `
    <div class="card-top">
      <div class="card-title">AI Smart Recommendation Report for ${profile.name}</div>
      <span class="ai-tag">AI ANALYSIS</span>
    </div>
    <div class="card-body">
      <div class="ai-reasoning">
        <strong>Profile Insights & Advice:</strong>
        <ul>
          ${insights.map(item => `<li style="margin-bottom: 6px;">${item}</li>`).join('')}
        </ul>
      </div>

      <div class="details" style="max-height: none; margin-top: 10px; padding: 12px 14px;">
        <p><strong>📋 Required Checklist for Quick Approval:</strong></p>
        <span style="display: block; margin-top: 4px; font-size: 12px; color: #0369a1;">
          ✔ Community & Income Certificate (Issued within 1 year)<br>
          ✔ Mark Statements & Bonafide Certificate from ${profile.school}<br>
          ✔ Bank Account linked with Aadhaar Card
        </span>
      </div>
    </div>
  `;

  return aiCard;
}

// Event Listeners Initialization
window.addEventListener('DOMContentLoaded', () => {
  displayScholarships(scholarships);
});

// Form Submit Handler
document.getElementById('scholarshipForm').addEventListener('submit', function (e) {
  e.preventDefault();

  const name = document.getElementById('studentName').value.trim();
  const category = document.getElementById('category').value;
  const income = parseInt(document.getElementById('income').value);
  const marks = parseInt(document.getElementById('marks').value);
  const school = document.getElementById('school').value.trim();
  const district = document.getElementById('district').value.trim();
  const state = document.getElementById('state').value.trim();

  if (!category || isNaN(income) || isNaN(marks)) {
    alert("Please complete all required fields correctly.");
    return;
  }

  if (income < 24000) {
    alert("Minimum annual income must be ₹24,000 or more.");
    return;
  }

  // Improved Category Matching: SC & OBC applicants can also view General Category scholarships
  const matched = scholarships.filter(sch => {
    const isCategoryEligible = sch.Category === "General" || sch.Category === category;
    const isIncomeEligible = income <= sch.incomeLimit;
    const isMarksEligible = marks >= sch.minMarks;
    const isStateEligible = sch.state === "All" || sch.state === state;

    return isCategoryEligible && isIncomeEligible && isMarksEligible && isStateEligible;
  });

  const studentProfile = { name, category, income, marks, school, district, state };
  displayScholarships(matched, true, studentProfile);
});

// Form Reset Handler
document.getElementById('scholarshipForm').addEventListener('reset', function () {
  setTimeout(() => {
    displayScholarships(scholarships);
  }, 50);
});