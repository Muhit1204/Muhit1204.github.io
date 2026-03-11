'use client';

import { motion } from 'motion/react';
import { FileText, Calendar, Users, MapPin, ExternalLink, GraduationCap, Database } from 'lucide-react';

export default function Publications() {

  const publications = [
    {
      title: "Predictive Model for Starlink Maritime Performance Using Multi-Horizon RandomForest",
      link: "https://ieeexplore.ieee.org/document/11395767",
      authors: "Md Muntasir Hossain, Xingya Liu, Helen H. Lou, Ruhai Wang, Kazi Fazlee Rabbi",
      venue: "2026 IEEE 16th Annual Computing and Communication Workshop and Conference (CCWC)",
      date: "2026",
      abstract: "Low Earth orbit (LEO) satellite systems have become a crucial enabler of broadband access for maritime industries. However, the high mobility of LEO constellations and constantly changing weather conditions result in unpredictable link fluctuations. This paper proposes a data-driven forecasting model that predicts future downlink throughput using multi-horizon RandomForest regression. The model is trained using real experimental coastal measurement data incorporating recent throughput history, network-layer indicators, and environmental variables. The proposed approach reduces mean absolute error by approximately 31% compared to a persistence baseline for 15-minute horizons.",
      keywords: ["Starlink", "LEO satellite networks", "Maritime communication", "Throughput Prediction", "RandomForest regression", "Experimental Data"]
    },
    {
      title: "A Dual-task Prediction Model for Starlink Maritime Performance",
      link: "https://ieeexplore.ieee.org/document/11393745",
      authors: "Richard Li, Md Muntasir Hossain, Xingya Liu, Ruhai Wang",
      venue: "5th IEEE International Conference on AI in Cybersecurity (ICAIC)",
      location: "University of Houston, Houston, United States",
      date: "18-20 February 2026",
      abstract: "While LEO satellite systems have revolutionized broadband access for maritime industries, the dual challenges of high orbital mobility and dynamic weather lead to unpredictable signal instability. To address this issue, this work developed a short-term, dual-task prediction model to predict future downlink throughput and latency simultaneously using a 15-minute prediction horizon. The model is trained using real-world experimental data. By utilizing a shared backbone for simultaneous downlink throughput and latency forecasting, this dual-task approach outperforms single-task models.",
      keywords: ["LEO satellite networks", "Starlink", "Throughput Prediction", "latency Prediction", "multi-task learning", "RandomForest regression", "Maritime communication"]
    }
  ];

  const datasets = [
    {
      title: "Maritime Starlink Performance Dataset",
      link: "https://figshare.com/articles/dataset/Experimental_Dataset_of_Starlink_Performance_Across_Different_Weather_Conditions_in_Southeast_Texas_Coastal_Areas/30929588",
      date: "2026",
      description: "A real-world experimental coastal measurement dataset containing network-layer indicators, environmental variables, and throughput/latency history for predicting Starlink LEO satellite performance in maritime environments.",
      keywords: ["Dataset", "Starlink", "Maritime", "Figshare", "Throughput", "Latency"]
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
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="space-y-4">
            <h1 className="text-3xl md:text-5xl font-bold tracking-tight text-slate-900">Research & Publications</h1>
            <p className="text-xl text-slate-600 font-light leading-relaxed max-w-3xl">
              A collection of my academic research, conference proceedings, and thesis work focused on satellite communications and network resilience.
            </p>
          </div>
          <a
            href="https://scholar.google.com/citations?view_op=list_works&hl=en&user=guXY-gQAAAAJ"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 bg-slate-900 text-white px-6 py-3 rounded-xl font-medium hover:bg-slate-800 transition-colors shadow-sm hover:shadow-md shrink-0 w-fit"
          >
            <ExternalLink className="w-4 h-4" />
            View Google Scholar
          </a>
        </div>
      </motion.div>


      <motion.section variants={itemVariants} className="space-y-4 md:space-y-8">
        <div className="flex items-center gap-3 border-b border-slate-200 pb-4">
          <FileText className="w-8 h-8 text-indigo-600" />
          <h2 className="text-3xl font-bold tracking-tight text-slate-900">Published Papers</h2>
        </div>
        <div className="space-y-4 md:space-y-8">
          {publications.map((pub, index) => (
            <article key={index} className="interactive-card group bg-white p-6 md:p-8 rounded-3xl border border-slate-200 shadow-sm hover:border-indigo-300">
              <div className="flex flex-col sm:flex-row justify-between items-start gap-4 mb-4">
                <h3 className="text-2xl font-bold text-slate-900 leading-tight group-hover:text-indigo-700 transition-colors">
                  {pub.title}
                </h3>
                <div className="flex flex-col sm:flex-row gap-3 mt-4 sm:mt-0">
                  {pub.link && (
                    <a
                      href={pub.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 px-4 py-2 bg-indigo-50 text-indigo-700 text-sm font-bold rounded-xl border border-indigo-100 hover:bg-indigo-100 hover:border-indigo-200 transition-all shrink-0 uppercase tracking-wider"
                    >
                      <ExternalLink className="w-4 h-4" />
                      <span className="hidden sm:inline">View Paper</span>
                    </a>
                  )}
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-y-2 gap-x-6 text-sm text-slate-500 mb-6 font-medium">
                <div className="flex items-center gap-2">
                  <Users className="w-4 h-4 text-slate-400 group-hover:text-indigo-500 transition-colors" />
                  <span className="text-slate-700">{pub.authors}</span>
                </div>
                <div className="flex items-center gap-2">
                  <FileText className="w-4 h-4 text-slate-400 group-hover:text-indigo-500 transition-colors" />
                  <span className="italic">{pub.venue}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-slate-400 group-hover:text-indigo-500 transition-colors" />
                  <span>{pub.date}</span>
                </div>
                {pub.location && (
                  <div className="flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-slate-400 group-hover:text-indigo-500 transition-colors" />
                    <span>{pub.location}</span>
                  </div>
                )}
              </div>

              <div className="space-y-4">
                <div>
                  <h4 className="text-sm font-bold text-slate-900 uppercase tracking-wider mb-2">Abstract</h4>
                  <p className="text-slate-600 leading-relaxed">
                    {pub.abstract}
                  </p>
                </div>

                <div>
                  <h4 className="text-sm font-bold text-slate-900 uppercase tracking-wider mb-2">Keywords</h4>
                  <div className="flex flex-wrap gap-2">
                    {pub.keywords.map(keyword => (
                      <span key={keyword} className="px-3 py-1 bg-slate-50 text-slate-600 text-xs font-bold rounded-md border border-slate-200 group-hover:border-indigo-200 group-hover:text-indigo-700 transition-colors">
                        {keyword}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </article>
          ))}
        </div>
      </motion.section>

      {/* Datasets Section */}
      <motion.section variants={itemVariants} className="space-y-4 md:space-y-8">
        <div className="flex items-center gap-3 border-b border-slate-200 pb-4">
          <Database className="w-8 h-8 text-emerald-600" />
          <h2 className="text-3xl font-bold tracking-tight text-slate-900">Datasets</h2>
        </div>
        <div className="space-y-4 md:space-y-8">
          {datasets.map((dataset, index) => (
            <article key={index} className="interactive-card group bg-white p-6 md:p-8 rounded-3xl border border-slate-200 shadow-sm hover:border-emerald-300">
              <div className="flex flex-col sm:flex-row justify-between items-start gap-4 mb-4">
                <h3 className="text-2xl font-bold text-slate-900 leading-tight group-hover:text-emerald-700 transition-colors">
                  {dataset.title}
                </h3>
                <a
                  href={dataset.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 px-4 py-2 bg-emerald-50 text-emerald-700 text-sm font-bold rounded-xl border border-emerald-100 hover:bg-emerald-100 hover:border-emerald-200 transition-all shrink-0 uppercase tracking-wider"
                >
                  <Database className="w-4 h-4" />
                  <span className="hidden sm:inline">View Dataset</span>
                </a>
              </div>

              <div className="flex flex-wrap items-center gap-y-2 gap-x-6 text-sm text-slate-500 mb-6 font-medium">
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-slate-400 group-hover:text-emerald-500 transition-colors" />
                  <span>{dataset.date}</span>
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <h4 className="text-sm font-bold text-slate-900 uppercase tracking-wider mb-2">Description</h4>
                  <p className="text-slate-600 leading-relaxed">
                    {dataset.description}
                  </p>
                </div>

                <div>
                  <h4 className="text-sm font-bold text-slate-900 uppercase tracking-wider mb-2">Keywords</h4>
                  <div className="flex flex-wrap gap-2">
                    {dataset.keywords.map(keyword => (
                      <span key={keyword} className="px-3 py-1 bg-slate-50 text-slate-600 text-xs font-bold rounded-md border border-slate-200 group-hover:border-emerald-200 group-hover:text-emerald-700 transition-colors">
                        {keyword}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </article>
          ))}
        </div>
      </motion.section>
    </motion.div>
  );
}
