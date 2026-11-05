const fs = require('fs');
const path = require('path');
const { parseResumeDeterministically } = require('../src/services/deterministicParser');
const { isTechnologyLine } = require('../src/services/projectExtractionService');

describe('Golden Reference Resume Accuracy Suite (Requirement 1)', () => {
  const fixturePath = path.resolve(__dirname, '../fixtures/golden-reference-resume.txt');
  const fixtureText = fs.readFileSync(fixturePath, 'utf-8');

  it('correctly classifies comma-separated technologies lines without misidentifying as titles', () => {
    expect(isTechnologyLine('Python, FastAPI, React.js, OpenStreetMap, Scikit-learn')).toBe(true);
    expect(isTechnologyLine('Node.js, Express.js, WebRTC, OpenCV, MongoDB')).toBe(true);
    expect(isTechnologyLine('Next.js, LangChain, Tailwind CSS, PostgreSQL')).toBe(true);
    expect(isTechnologyLine('AI-Powered Smart Travel Planner and Budget Optimizer')).toBe(false);
    expect(isTechnologyLine('Online Examination and AI Proctoring System')).toBe(false);
  });

  it('parses the golden reference resume with >= 95% precision and recall', () => {
    const parsed = parseResumeDeterministically(fixtureText);

    // 1. Header Information
    expect(parsed.personalInfo.fullName).toBe('ROHIT SHARMA');
    expect(parsed.personalInfo.email).toBe('rohit.sharma@example.com');
    expect(parsed.personalInfo.phone).toBe('+91 98765 43210');
    expect(parsed.personalInfo.location).toMatch(/Pune/i);
    expect(parsed.personalInfo.linkedin).toMatch(/linkedin\.com\/in\/rohit-sharma/);
    expect(parsed.personalInfo.github).toMatch(/github\.com\/rohitsharma/);

    // 2. Summary
    expect(parsed.summary).toBeTruthy();
    expect(parsed.summary).toContain('Information Technology undergraduate');
    expect(parsed.summary).toContain('scalable web applications');

    // 3. Skills — Exactly 5 Categories
    expect(parsed.skills).toBeDefined();
    expect(parsed.skills.length).toBe(5);

    const categories = parsed.skills.map((s) => s.category);
    expect(categories).toContain('Programming Languages');
    expect(categories).toContain('Web Technologies');
    expect(categories).toContain('Databases');
    expect(categories).toContain('Tools & Platforms');
    expect(categories).toContain('Core Concepts');

    // Check skills within categories
    const progLang = parsed.skills.find((s) => s.category === 'Programming Languages');
    expect(progLang.items).toEqual(expect.arrayContaining(['Java', 'Python', 'JavaScript', 'C']));

    const webTech = parsed.skills.find((s) => s.category === 'Web Technologies');
    expect(webTech.items).toEqual(expect.arrayContaining(['HTML5', 'CSS3', 'React.js', 'Node.js', 'Express.js']));

    const databases = parsed.skills.find((s) => s.category === 'Databases');
    expect(databases.items).toEqual(expect.arrayContaining(['MongoDB', 'SQL (MySQL)']));

    const tools = parsed.skills.find((s) => s.category === 'Tools & Platforms');
    expect(tools.items).toEqual(expect.arrayContaining(['Git', 'GitHub', 'VS Code', 'Postman']));

    const coreConcepts = parsed.skills.find((s) => s.category === 'Core Concepts');
    expect(coreConcepts.items).toEqual(expect.arrayContaining([
      'Data Structures & Algorithms',
      'OOP',
      'DBMS',
      'Operating Systems',
      'Computer Networks',
    ]));

    // 4. Projects — EXACTLY 3 Projects (No hallucinated, split, or merged projects)
    expect(parsed.projects).toBeDefined();
    expect(parsed.projects.length).toBe(3);

    const titles = parsed.projects.map((p) => p.title);
    expect(titles[0]).toBe('AI-Powered Smart Travel Planner and Budget Optimizer');
    expect(titles[1]).toBe('Online Examination and AI Proctoring System');
    expect(titles[2]).toBe('AI Career Copilot');

    // Check Project 1 details & technologies
    const p1 = parsed.projects[0];
    expect(p1.technologies).toEqual(expect.arrayContaining(['Python', 'FastAPI', 'React.js', 'OpenStreetMap', 'Scikit-learn']));
    expect(p1.highlights.length).toBeGreaterThanOrEqual(2);
    expect(p1.highlights[0]).toContain('itinerary');
    expect(p1.confidence).toBeGreaterThanOrEqual(0.85);
    expect(p1.verificationStatus).toBe('verified');
    expect(p1.sourceEvidence.length).toBeGreaterThan(0);

    // Check Project 2 details & technologies
    const p2 = parsed.projects[1];
    expect(p2.technologies).toEqual(expect.arrayContaining(['Node.js', 'Express.js', 'WebRTC', 'OpenCV', 'MongoDB']));
    expect(p2.highlights.length).toBeGreaterThanOrEqual(2);
    expect(p2.highlights[0]).toContain('browser lockdown');
    expect(p2.confidence).toBeGreaterThanOrEqual(0.85);
    expect(p2.verificationStatus).toBe('verified');

    // Check Project 3 details & technologies
    const p3 = parsed.projects[2];
    expect(p3.technologies).toEqual(expect.arrayContaining(['Next.js', 'LangChain', 'Tailwind CSS', 'PostgreSQL']));
    expect(p3.highlights.length).toBeGreaterThanOrEqual(2);
    expect(p3.highlights[0]).toContain('resume analyzer');
    expect(p3.confidence).toBeGreaterThanOrEqual(0.85);
    expect(p3.verificationStatus).toBe('verified');

    // 5. Certifications — EXACTLY 2 Certifications
    expect(parsed.certifications).toBeDefined();
    expect(parsed.certifications.length).toBe(2);

    const cert1 = parsed.certifications[0];
    expect(cert1.name).toContain('Soft Skills Development Workshop');
    expect(cert1.issueDate).toBe('2024');

    const cert2 = parsed.certifications[1];
    expect(cert2.name).toContain('Oracle Cloud Infrastructure 2025 Certified Foundations Associate');
    expect(cert2.issueDate).toBe('2025');

    // 6. Education — EXACTLY 3 Qualifications
    expect(parsed.education).toBeDefined();
    expect(parsed.education.length).toBe(3);

    const edu1 = parsed.education[0];
    expect(edu1.degree).toContain('B.Tech in Information Technology');
    expect(edu1.institution).toContain('Pune Institute of Computer Technology');
    expect(edu1.graduationDate).toContain('2021');
    expect(edu1.gpa).toContain('8.9');

    const edu2 = parsed.education[1];
    expect(edu2.degree).toContain('Higher Secondary Certificate');
    expect(edu2.institution).toContain('Modern College');
    expect(edu2.graduationDate).toContain('2021');
    expect(edu2.gpa).toContain('91.4%');

    const edu3 = parsed.education[2];
    expect(edu3.degree).toContain('Secondary School Certificate');
    expect(edu3.institution).toContain('St. Vincent High School');
    expect(edu3.graduationDate).toContain('2019');
    expect(edu3.gpa).toContain('94.2%');
  });
});

