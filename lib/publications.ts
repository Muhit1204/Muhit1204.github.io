/*
 * Publication and dataset content, lifted out of the retired /publications
 * route. The home page carries the full detail now — a summary section plus
 * a separate page was the same material twice.
 */

export type Publication = {
  title: string;
  link: string;
  doi: string;
  authors: string;
  venue: string;
  location?: string;
  date: string;
  abstract: string;
  keywords: string[];
  outcome?: string;
};

export const publications: Publication[] = [
  {
    title: 'Predictive Model for Starlink Maritime Performance Using Multi-Horizon RandomForest',
    link: 'https://ieeexplore.ieee.org/document/11393745',
    doi: '10.1109/CCWC67433.2026.11393745',
    authors: 'Md Muntasir Hossain, Xingya Liu, Helen H. Lou, Ruhai Wang, Kazi Fazlee Rabbi',
    venue: '2026 IEEE 16th Annual Computing and Communication Workshop and Conference (CCWC)',
    date: '2026',
    abstract:
      'Low Earth orbit (LEO) satellite systems have become a crucial enabler of broadband access for maritime industries. However, the high mobility of LEO constellations and constantly changing weather conditions result in unpredictable link fluctuations. This paper proposes a data-driven forecasting model that predicts future downlink throughput using multi-horizon RandomForest regression. The model is trained using real experimental coastal measurement data incorporating recent throughput history, network-layer indicators, and environmental variables. The proposed approach reduces mean absolute error by approximately 31% compared to a persistence baseline for 15-minute horizons.',
    keywords: ['Starlink', 'LEO satellite networks', 'Maritime communication', 'Throughput Prediction', 'RandomForest regression', 'Experimental Data'],
    outcome: 'Approximately 31% lower MAE at the 15-minute horizon versus the persistence baseline.',
  },
  {
    title: 'A Dual-task Prediction Model for Starlink Maritime Performance',
    link: 'https://ieeexplore.ieee.org/document/11395767',
    doi: '10.1109/ICAIC67076.2026.11395767',
    authors: 'Richard Li, Md Muntasir Hossain, Xingya Liu, Ruhai Wang',
    venue: '5th IEEE International Conference on AI in Cybersecurity (ICAIC)',
    location: 'University of Houston, Houston, United States',
    date: '18–20 February 2026',
    abstract:
      'While LEO satellite systems have revolutionized broadband access for maritime industries, the dual challenges of high orbital mobility and dynamic weather lead to unpredictable signal instability. To address this issue, this work developed a short-term, dual-task prediction model to predict future downlink throughput and latency simultaneously using a 15-minute prediction horizon. The model is trained using real-world experimental data. By utilizing a shared backbone for simultaneous downlink throughput and latency forecasting, this dual-task approach outperforms single-task models.',
    keywords: ['LEO satellite networks', 'Starlink', 'Throughput Prediction', 'latency Prediction', 'multi-task learning', 'RandomForest regression', 'Maritime communication'],
  },
];

export type Dataset = {
  title: string;
  link: string;
  date: string;
  description: string;
  keywords: string[];
  outcome?: string;
};

export const datasets: Dataset[] = [
  {
    title: 'Maritime Starlink Performance Dataset',
    link: 'https://figshare.com/articles/dataset/Experimental_Dataset_of_Starlink_Performance_Across_Different_Weather_Conditions_in_Southeast_Texas_Coastal_Areas/30929588',
    date: '2026',
    description:
      'A real-world experimental coastal measurement dataset containing network-layer indicators, environmental variables, and throughput/latency history for predicting Starlink LEO satellite performance in maritime environments.',
    keywords: ['Dataset', 'Starlink', 'Maritime', 'Figshare', 'Throughput', 'Latency'],
  },
];
