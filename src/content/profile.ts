export type Project = {
  title: string
  description: string
  technologies: string[]
  link?: string
}

export type Publication = {
  title: string
  description: string
  link: string
  platform: string
  date?: string
}

export const profile = {
  name: "Pawan Aggarwal",
  role: "Data Engineering & AI Expert",
  experienceYears: 19,
  location: "San Francisco, CA",
  email: "pawanik2003@gmail.com",
  linkedin: "https://www.linkedin.com/in/pawan-aggarwal-3113a19",
  github: "https://github.com/pawanik2003",
  summary:
    "Seasoned leader specializing in building high-scale data platforms, machine learning systems, and teams. I design robust architectures, automate data workflows, and translate business challenges into data-driven solutions.",
  skills: [
    "Python",
    "SQL",
    "Apache Spark",
    "Airflow",
    "TensorFlow",
    "PyTorch",
    "AWS",
    "GCP",
    "Databricks",
    "Docker",
    "Kubernetes",
    "Kafka",
    "Snowflake",
    "dbt",
    "Terraform",
  ],
  projects: [
    {
      title: "Real-time Streaming Data Platform",
      description:
        "Designed and led a Kafka + Spark Streaming platform processing billions of events/day with sub-second SLAs, powering fraud detection and personalization.",
      technologies: ["Kafka", "Spark Streaming", "AWS Kinesis", "Scala", "Terraform"],
    },
    {
      title: "MLOps Pipeline for Demand Forecasting",
      description:
        "Productionized an end-to-end ML workflow with feature store, model registry, CI/CD, and automated retraining; improved forecast MAE by 18%.",
      technologies: ["TensorFlow", "MLflow", "Airflow", "Docker", "Kubernetes"],
    },
    {
      title: "Cloud Data Lakehouse Modernization",
      description:
        "Migrated on-prem DW to a modern lakehouse on Databricks + Delta, reducing cost by 40% and cutting ETL durations from hours to minutes.",
      technologies: ["Databricks", "Delta Lake", "dbt", "AWS S3", "Glue"],
    },
    {
      title: "Batch + CDC Data Pipelines",
      description:
        "Implemented scalable ingestion (batch + CDC) and governance with lineage/observability supporting 200+ downstream analytics use cases.",
      technologies: ["Airbyte", "Debezium", "Snowflake", "Great Expectations", "OpenLineage"],
    },
  ] as Project[],
  publications: [
    {
      title: "Building Real-Time Data Platforms: What Most Architects Miss",
      description: "Explores the critical architectural decisions and often-overlooked aspects of building scalable real-time data platforms.",
      link: "https://medium.com/@pawanik2003/building-real-time-data-platforms-what-most-architects-miss-e6ae6db1bad8",
      platform: "Medium",
      date: "2025"
    },
    {
      title: "Beyond the Hype: A Pragmatic Look at Data Mesh and Data Fabric at Scale",
      description: "An in-depth analysis of data mesh and data fabric architectures, examining their practical implementation challenges and benefits for large-scale data platforms.",
      link: "https://medium.com/@pawanik2003/beyond-the-hype-a-pragmatic-look-at-data-mesh-and-data-fabric-at-scale-719fcb18ed3c",
      platform: "Medium",
      date: "2024"
    },
  ] as Publication[],
}
