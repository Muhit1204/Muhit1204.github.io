'use client';

import { motion } from 'motion/react';
import { Briefcase } from 'lucide-react';

export default function Experience() {
  const experiences = [
    {
      title: "Graduate Research Assistant",
      company: "Lamar University, Center for Data Analytics and Cybersecurity",
      link: "https://www.lamar.edu/center-data-analytics-cybersecurity/",
      location: "Beaumont, United States",
      date: "Oct 2024 – Present",
      description: [
        "Working under a federally funded project in collaboration with the Port of Beaumont to improve the reliability and resilience of Maritime Satellite Communications and intelligent networking systems.",
        "Conducting research on performance evaluation and adaptive optimization of satellite based and Delay tolerant Networks, emphasizing reliability under variable environmental and mobility conditions.",
        "Developing NS-3 simulation models to analyze link stability, routing efficiency and communication latency across heterogenous network topologies.",
        "Investigating cybersecurity risks in intelligent maritime systems, including signal manipulation, spoofing and data integrity threats.",
        "Delivered data-driven insights adopted by project stakeholders to strengthen connectivity and operational security for port activities."
      ]
    },
    {
      title: "Graduate Teaching Assistant",
      company: "Lamar University",
      link: "https://www.lamar.edu/arts-sciences/computer-science/",
      location: "Beaumont, United States",
      date: "Sep 2025 – Present",
      description: [
        "Assisting in undergraduate courses: Computer Networks (COSC 5328), Multimedia Processing (COSC 4330), and Introduction to Computer Architecture (COSC 4310).",
        "Supporting 50+ students per course through lab instruction, grading, and one-on-one academic guidance.",
        "Demonstrating tools such as Wireshark, NS-3, and Python-based network analysis to bridge theoretical and practical learning.",
        "Managing course operations via Blackboard and OneDrive, ensuring timely feedback, and maintaining academic integrity."
      ]
    },
    {
      title: "IT Student Assistant",
      company: "Lamar University",
      link: "https://www.lamar.edu/it-services-and-support/index.html",
      location: "Beaumont, United States",
      date: "Feb 2024 – Sep 2024",
      description: [
        "Delivered technical support to 500+ students, faculty, and staff, resolving hardware/software issues with a 95% success rate across on-site and remote requests.",
        "Managed inventory of 1,000+ IT assets and optimized databases, boosting performance by 20% and reducing troubleshooting time by 30%.",
        "Installed, configured, and maintained 200+ workstations, ensuring consistent system reliability and high availability for daily operations."
      ]
    },
    {
      title: "Web Developer",
      company: "RPSI Limited: Tech Team",
      link: "https://www.linkedin.com/company/rpsiltd/?originalSubdomain=uk",
      location: "Dhaka, Bangladesh",
      date: "Sep 2021 – Jan 2023",
      description: [
        "Designed and deployed 3+ e-commerce and NGO websites using JavaScript, React, PHP, and Laravel, cutting development costs by 15% and reducing deployment time by 20%.",
        "Collaborated with a 4-person development team, improving coordination and reducing delivery delays by 25% through better task allocation.",
        "Contributed to a logistics management system that streamlined order tracking, reduced manual processing time by 30%, and provided full-stack support and maintenance to ensure high availability, performance, and security."
      ]
    }
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.15 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: { opacity: 1, x: 0, transition: { duration: 0.5 } }
  };

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="space-y-16 max-w-5xl mx-auto pb-12"
    >
      <motion.div variants={itemVariants} className="space-y-4 pt-8">
        <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-slate-900 font-mono">Professional Experience</h1>
        <p className="text-xl text-slate-600 font-light leading-relaxed max-w-3xl">
          My academic and industry work experience.
        </p>
      </motion.div>

      <div className="space-y-12 relative">
        {/* Glowing Timeline Line */}
        <div className="hidden md:block absolute left-[20%] top-2 bottom-2 w-px bg-gradient-to-b from-indigo-200 via-emerald-200 to-transparent" />

        {experiences.map((exp, index) => (
          <motion.div variants={itemVariants} key={index} className="relative pl-8 md:pl-0">
            <div className="md:grid md:grid-cols-5 md:gap-8 items-start">
              <div className="hidden md:block col-span-1 pt-1 text-right pr-8">
                <p className="text-sm font-bold text-indigo-600 uppercase tracking-wider">{exp.date}</p>
              </div>
              <div className="col-span-4 relative group">
                {/* Timeline dot */}
                <div className="absolute -left-8 md:-left-[2.4rem] top-1.5 w-3 h-3 bg-indigo-500 rounded-full ring-4 ring-white group-hover:scale-150 group-hover:bg-emerald-500 transition-all duration-300 z-10" />

                <div className="interactive-card bg-white p-6 md:p-8 rounded-3xl border border-slate-200 shadow-sm hover:border-indigo-300">
                  <h3 className="text-2xl font-bold text-slate-900 mb-2 group-hover:text-indigo-600 transition-colors">{exp.title}</h3>
                  <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 text-slate-500 mb-6">
                    <span className="font-medium flex items-center gap-2 text-slate-700">
                      <Briefcase className="w-4 h-4" />
                      {exp.link ? (
                        <a href={exp.link} target="_blank" rel="noopener noreferrer" className="hover:text-indigo-600 hover:underline transition-colors">
                          {exp.company}
                        </a>
                      ) : (
                        exp.company
                      )}
                    </span>
                    <span className="hidden sm:inline text-slate-300">•</span>
                    <span className="text-sm font-medium">{exp.location}</span>
                  </div>
                  <p className="md:hidden text-sm font-bold text-indigo-600 mb-4 uppercase tracking-wider">{exp.date}</p>

                  <ul className="space-y-3 text-slate-600">
                    {exp.description.map((item, i) => (
                      <li key={i} className="flex items-start gap-3">
                        <span className="text-indigo-500 mt-1.5">•</span>
                        <span className="leading-relaxed">{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}
