'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Server, Database, Image as ImageIcon, X } from 'lucide-react';
import Image from 'next/image';

export default function Projects() {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  const projects = [
    {
      title: "Starlink Maritime Performance Prediction & Decision-Support Dashboard",
      isOngoing: true,
      icon: <Server className="w-6 h-6 text-indigo-400 group-hover:text-indigo-300 transition-colors" />,
      dashboardImage: "/starlink-dashboard.png",
      description: [
        <span key="0">Developed a real-time, predictive decision-support web application for maritime Starlink users, ingesting live network telemetry to forecast throughput and latency up to 15 minutes ahead.</span>,
        <span key="1"><strong>Predictive Forecasting & Confidence Intervals:</strong> Implemented a forecasting engine (based on Random Forest regression logic) that projects network throughput and latency across a 15-minute horizon, visualizing the trend curve alongside dynamic confidence intervals that expand with time.</span>,
        <span key="2"><strong>Early Warning & Anomaly Detection:</strong> Engineered an analytical system that monitors the relationship between latency and throughput to preemptively detect satellite handoffs and issue early warnings when rising latency indicates an impending drop in bandwidth.</span>,
        <span key="3"><strong>Actionable Decision Support:</strong> Designed a "Task Readiness" algorithm that translates raw network forecasts into practical recommendations, calculating the exact "Safe Duration" (in minutes) for specific operations like Video Calling, VoIP, and Large File Transfers.</span>,
        <span key="4"><strong>Real-Time Accuracy Tracking:</strong> Built a continuous feedback loop that stores short-term predictions and evaluates them against actual incoming telemetry, displaying a live Exponential Moving Average (EMA) of the model's accuracy.</span>,
        <span key="5"><strong>Live Data & Contextual Integration:</strong> Developed features for both live telemetry simulation and historical CSV data ingestion, alongside a REST API integration (Open-Meteo) to fetch real-time weather data for environmental context.</span>,
        <span key="6"><strong>Interactive Data Visualization:</strong> Created a responsive, dark-themed maritime UI using Next.js and Tailwind CSS, featuring complex Recharts visualizations that seamlessly combine historical data, future trend lines, and shaded uncertainty ranges.</span>
      ],
      techStack: ["React", "Next.js", "TypeScript", "Tailwind CSS", "Recharts", "PapaParse", "date-fns"],
      concepts: ["Time-series forecasting", "Anomaly Detection", "EMA", "REST API", "UI/UX Design"]
    },
    {
      title: "Banknote Authentication Using Machine Learning",
      link: "https://github.com/Muhit1204/BankNote-Authentication-Model",
      icon: <Database className="w-6 h-6 text-amber-400 group-hover:text-amber-300 transition-colors" />,
      description: [
        "Built a classification pipeline simulating edge-device scenarios (like ATMs) to detect counterfeit banknotes with 100% precision.",
        "Extracted 2-D Discrete Wavelet Transform textural features (Variance, Skewness, Kurtosis, Entropy) from high-resolution grayscale captures.",
        "Implemented and compared Decision Tree, KNN, Random Forest, and SVM (RBF) algorithms from scratch in Python to ensure transparency.",
        "Achieved perfect 1.000 F1-scores with KNN and SVM on the UCI held-out test set."
      ]
    },
    {
      title: "Multithreaded FTP Server",
      icon: <Server className="w-6 h-6 text-blue-400 group-hover:text-blue-300 transition-colors" />,
      description: [
        "Developed a multithreaded FTP server to support concurrent file operations using socket programming in C.",
        "Implemented core FTP functionalities: file download, deletion, and renaming, ensuring secure and efficient file handling.",
        "Enabled support for multiple clients to interact with the server simultaneously, evaluating the server's robustness and concurrency.",
        "Enhanced the server's architecture by incorporating thread management for handling multiple client requests."
      ]
    },
    {
      title: "Employee Salaries Analysis Project",
      icon: <Database className="w-6 h-6 text-rose-400 group-hover:text-rose-300 transition-colors" />,
      description: [
        "Analyzed employee salary data using Big Data tools to assess compensation structures.",
        "Built a linear regression model to identify significant gender pay disparities.",
        "Applied K-means clustering to reveal salary distribution patterns across departments.",
        "Conducted multivariate analysis with a correlation matrix to evaluate pay components.",
        "Provided actionable insights to improve pay equity and competitiveness."
      ]
    }
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } }
  };

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="space-y-8 md:space-y-16 max-w-5xl mx-auto pb-6 md:pb-12"
    >
      <motion.div variants={itemVariants} className="space-y-4 pt-4 md:pt-8">
        <h1 className="text-3xl md:text-5xl font-bold tracking-tight text-slate-900">Projects</h1>
        <p className="text-xl text-slate-600 font-light leading-relaxed max-w-3xl">
          A showcase of my technical projects spanning machine learning, networking, and data analysis.
        </p>
      </motion.div>

      <div className="grid grid-cols-1 gap-4 md:gap-8">
        {projects.map((project, index) => (
          <motion.div variants={itemVariants} key={index} className="interactive-card group bg-white p-6 md:p-8 rounded-3xl border border-slate-200 shadow-sm hover:border-indigo-300 flex flex-col h-full">
            <div className="flex flex-col sm:flex-row justify-between items-start gap-4 mb-6">
              <div className="flex flex-col sm:flex-row items-start gap-4">
                <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 group-hover:scale-110 group-hover:border-indigo-200 transition-all duration-300 shrink-0">
                  {project.icon}
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-slate-900 leading-tight pt-1 group-hover:text-indigo-600 transition-colors">
                    {project.title}
                  </h2>
                  {project.isOngoing && (
                    <span className="inline-block mt-2 px-3 py-1 bg-amber-50 text-amber-600 text-xs font-bold rounded-md border border-amber-200 uppercase tracking-wider">
                      Ongoing Project
                    </span>
                  )}
                </div>
              </div>

              {/* Optional Link Button */}
              <div className="flex flex-col sm:flex-row gap-2 mt-2 sm:mt-0">
                {project.link && (
                  <a
                    href={project.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 px-4 py-2 bg-slate-50 text-slate-700 text-sm font-bold rounded-xl border border-slate-200 hover:bg-slate-100 hover:border-slate-300 transition-all shrink-0"
                  >
                    <Database className="w-4 h-4" />
                    <span className="hidden sm:inline">View Project</span>
                  </a>
                )}
                {/* @ts-ignore - Ignore optional field dynamically */}
                {project.dashboardImage && (
                  <button
                    onClick={() => setSelectedImage((project as any).dashboardImage)}
                    className="flex items-center gap-2 px-4 py-2 bg-indigo-50 text-indigo-700 text-sm font-bold rounded-xl border border-indigo-100 hover:bg-indigo-100 hover:border-indigo-200 transition-all shrink-0"
                  >
                    <ImageIcon className="w-4 h-4" />
                    <span className="hidden sm:inline">View Dashboard</span>
                  </button>
                )}
              </div>
            </div>

            <ul className="space-y-3 text-slate-600 pl-2 flex-grow mb-8">
              {project.description.map((item, i) => (
                <li key={i} className="flex items-start gap-3">
                  <span className="text-slate-400 mt-1.5 group-hover:text-indigo-500 transition-colors">—</span>
                  <span className="leading-relaxed">{item}</span>
                </li>
              ))}
            </ul>

            {/* @ts-ignore */}
            {project.techStack && (
              <div className="mb-4">
                <h4 className="text-sm font-bold text-slate-900 uppercase tracking-wider mb-2">Tech Stack</h4>
                <div className="flex flex-wrap gap-2">
                  {/* @ts-ignore */}
                  {project.techStack.map(tech => (
                    <span key={tech} className="px-2.5 py-1 bg-slate-50 text-slate-600 text-xs font-semibold rounded border border-slate-200">
                      {tech}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* @ts-ignore */}
            {project.concepts && (
              <div>
                <h4 className="text-sm font-bold text-slate-900 uppercase tracking-wider mb-2">Concepts Applied</h4>
                <div className="flex flex-wrap gap-2">
                  {/* @ts-ignore */}
                  {project.concepts.map(concept => (
                    <span key={concept} className="px-2.5 py-1 bg-indigo-50 text-indigo-700 text-xs font-semibold rounded border border-indigo-100">
                      {concept}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </motion.div>
        ))}
      </div>

      {/* Image Modal overlay */}
      <AnimatePresence>
        {selectedImage && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSelectedImage(null)}
            className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/80 backdrop-blur-sm p-4 md:p-8"
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="relative w-full max-w-5xl max-h-full aspect-video bg-white rounded-2xl overflow-hidden shadow-2xl flex flex-col items-center justify-center p-8"
            >
              <button
                onClick={() => setSelectedImage(null)}
                className="absolute top-4 right-4 z-10 p-2 bg-slate-900/50 hover:bg-slate-900 text-white rounded-full transition-colors backdrop-blur-md"
              >
                <X className="w-5 h-5" />
              </button>
              <div className="w-full h-full relative">
                <Image
                  src={selectedImage}
                  alt="Dashboard Screenshot"
                  fill
                  className="object-contain"
                  quality={100}
                />
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
