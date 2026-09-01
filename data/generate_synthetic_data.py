#!/usr/bin/env python3
"""
Synthetic Data Generator for Campus Twin
Generates realistic, interconnected campus datasets across 8 core domains plus graph relationships.
"""

import csv
import json
import os
import random

DATA_DIR = os.path.dirname(os.path.abspath(__file__))

def generate_all():
    print("Generating synthetic datasets for Campus Twin...")

    # 1. SKILLS (50+)
    skills = [
        # AI / ML / CS
        ("SKILL_01", "Python", "Technical", "Core programming language for data science and web", "Basic syntax, loops, functions", "Pandas, NumPy, OOP", "Async, Metaprogramming, C-Extensions"),
        ("SKILL_02", "Machine Learning", "Technical", "Supervised and unsupervised learning techniques", "Linear regression, Decision Trees", "Scikit-Learn, Random Forests, XGBoost", "Custom neural networks, Model Tuning"),
        ("SKILL_03", "Deep Learning", "Technical", "Neural networks and deep learning architectures", "MLP, Activation functions", "PyTorch, Convolutional Networks", "Transformers, Diffusion Models, GANs"),
        ("SKILL_04", "Computer Vision", "Technical", "Image processing and pattern recognition", "OpenCV basics, edge detection", "YOLO, Image Segmentation", "3D Vision, Neural Radiance Fields"),
        ("SKILL_05", "Natural Language Processing", "Technical", "Text processing and language models", "Regex, NLTK, TF-IDF", "SpaCy, Embeddings, Sentiment Analysis", "LLM Fine-tuning, RAG, Databricks Genie"),
        ("SKILL_06", "SQL & Relational DBs", "Technical", "Querying structured databases", "SELECT, WHERE, JOINs", "Subqueries, Aggregations, Indexing", "Databricks SQL, Window Functions, Query Optimization"),
        ("SKILL_07", "Data Analysis", "Technical", "Extracting insights from raw data", "Data cleaning, Summary statistics", "Pandas, Seaborn, Hypothesis testing", "A/B Testing, Time Series, Statistical Modeling"),
        ("SKILL_08", "FastAPI", "Technical", "Building high-performance Python web APIs", "Routing, Pydantic basics", "Async endpoints, CORS, Dependency Injection", "Custom Middleware, WebSockets, OAuth2"),
        ("SKILL_09", "Next.js & React", "Technical", "Modern full-stack web application development", "JSX, Props, useState", "App Router, Server Components, Tailwind", "Performance Optimization, Custom Hooks"),
        ("SKILL_10", "TypeScript", "Technical", "Typed JavaScript development", "Basic interfaces, type annotations", "Generics, Union types, Type Guards", "Advanced conditional types, AST transforms"),
        ("SKILL_11", "Docker & Containers", "Technical", "Containerization and local infrastructure", "Dockerfile creation, docker run", "docker-compose multi-container setup", "Multi-stage builds, Container orchestration"),
        ("SKILL_12", "Git & GitHub", "Technical", "Distributed version control and collaboration", "commit, push, pull, branching", "Merge conflicts, PR reviews, Rebasing", "Git Hooks, GitHub Actions CI/CD"),
        ("SKILL_13", "Databricks Unity Catalog", "Data Engineering", "Unified data governance and schema management", "Catalog concepts, Grants", "Schema design, Lineage tracking", "Cross-workspace governance, Delta Lake integration"),
        ("SKILL_14", "Spark & Distributed Data", "Data Engineering", "Large scale data processing", "DataFrames, Transformations", "Spark SQL, Catalyst Optimizer", "PySpark tuning, Streaming architectures"),
        ("SKILL_15", "Cybersecurity Basics", "Security", "Information security and safe coding", "OWASP Top 10, Encryption basics", "Penetration testing, Auth protocols", "Zero trust architecture, Cryptographic protocols"),
        ("SKILL_16", "Cloud Computing (AWS/Azure)", "Infrastructure", "Cloud infrastructure services", "S3, EC2 basics", "IAM roles, Serverless functions", "Terraform IaC, Multi-region deployment"),
        ("SKILL_17", "Robotics & Embedded Systems", "Hardware", "Hardware and microcontroller programming", "Arduino, basic circuits", "ROS (Robot Operating System), C++", "Autonomous navigation, Sensor fusion"),
        ("SKILL_18", "Bioinformatics", "Interdisciplinary", "Computational biology and genomics", "Sequence alignment", "Biopython, Gene expression analysis", "CRISPR modeling, Protein folding prediction"),
        ("SKILL_19", "Quantitative Finance", "Finance", "Mathematical modeling for financial markets", "Time series, Stock indicators", "Black-Scholes, Monte Carlo simulation", "High-frequency trading algorithms"),
        ("SKILL_20", "UI/UX Design", "Design", "User interface and user experience design", "Wireframing, Color theory", "Figma prototyping, Usability testing", "Design Systems, Motion graphics design"),
        
        # Soft / Leadership / Professional Skills
        ("SKILL_21", "Public Speaking", "Soft Skills", "Presenting ideas clearly to large audiences", "Delivering short lightning talks", "Structuring pitch decks, Q&A handling", "Keynote address, Persuasive storytelling"),
        ("SKILL_22", "Project Management", "Management", "Organizing teams and timelines", "Task lists, Trello/Jira", "Agile/Scrum, Milestone planning", "Budget allocation, Risk mitigation"),
        ("SKILL_23", "Leadership", "Management", "Guiding and motivating teams", "Team participation", "Club executive, Delegation", "Organization president, Vision alignment"),
        ("SKILL_24", "Technical Writing", "Communication", "Creating documentation and research papers", "Markdown basics, Readme drafting", "API documentation, LaTeX papers", "Grant proposals, Peer-review publishing"),
        ("SKILL_25", "Networking", "Professional", "Building authentic professional relationships", "Attending career events", "Informational interviews, LinkedIn", "Industry mentorship, Strategic partnerships"),
        ("SKILL_26", "Entrepreneurship", "Business", "Building products and launching ventures", "Ideation, Business canvas", "Customer discovery, MVP building", "Venture pitching, Fundraising"),
        ("SKILL_27", "Problem Solving", "Core", "Algorithmic and structured thinking", "Breaking down complex problems", "Optimization techniques", "System architecture design"),
        ("SKILL_28", "Teamwork & Collaboration", "Soft Skills", "Working effectively in multidisciplinary teams", "Group assignment contribution", "Cross-functional team lead", "Conflict resolution, Team culture"),
        ("SKILL_29", "Research Methods", "Academic", "Academic research methodology and literature review", "Finding papers on arXiv/IEEE", "Experiment design, Comparative analysis", "Novel hypothesis formulation, Publication"),
        ("SKILL_30", "Product Management", "Business", "Translating user needs into product features", "User stories, Feature prioritization", "Roadmapping, Metric tracking", "Go-to-market strategy, Product analytics"),
        
        # Domain Specific Skills
        ("SKILL_31", "Reinforcement Learning", "Technical", "Agent-based decision making", "Q-Learning, Policy iteration", "DQN, PPO, OpenAI Gym/Farama", "Multi-agent RL, Sim-to-Real transfer"),
        ("SKILL_32", "Generative AI", "Technical", "Prompting and building LLM applications", "Prompt engineering, ChatGPT API", "LangChain, LlamaIndex, Vector DBs", "Fine-tuning Llama, Custom Agentic Systems"),
        ("SKILL_33", "MLOps", "Engineering", "Productionizing machine learning models", "Model saving, Flask serve", "MLflow, Feature Stores, Dockerization", "CI/CD pipelines for ML, Drift monitoring"),
        ("SKILL_34", "Linear Algebra", "Math", "Vector spaces, matrices, and transformations", "Matrix multiplication, Systems of equations", "Eigenvalues, Singular Value Decomposition", "Tensor decomposition, Convex optimization"),
        ("SKILL_35", "Probability & Statistics", "Math", "Statistical inference and probability distributions", "Mean, variance, Bayes theorem", "Hypothesis testing, Regression, Maximum likelihood", "Bayesian inference, Stochastic processes"),
        ("SKILL_36", "Calculus & Optimization", "Math", "Multivariate calculus and optimization algorithms", "Derivatives, Gradients", "Partial derivatives, Gradient Descent", "Lagrange multipliers, Hessian matrices"),
        ("SKILL_37", "Algorithm Design", "Technical", "Data structures and algorithm analysis", "Arrays, Linked Lists, Big-O", "Trees, Graphs, Dynamic Programming", "NP-completeness, Advanced Graph algorithms"),
        ("SKILL_38", "Web Frontend (HTML/CSS/JS)", "Technical", "Web fundamentals", "HTML tags, CSS styling", "DOM manipulation, Flexbox, Grid", "Modern Web APIs, Canvas, WebGL"),
        ("SKILL_39", "Backend Architecture", "Technical", "Scalable backend service design", "Single server APIs", "Database indexing, Caching (Redis)", "Microservices, Load Balancing, Event Queues"),
        ("SKILL_40", "DevOps & CI/CD", "Infrastructure", "Automated building, testing, and deployment", "Basic shell scripting", "GitHub Actions workflows, Automated testing", "Kubernetes, Infrastructure as Code"),
        ("SKILL_41", "Ethics in AI", "Humanities", "Responsible AI and bias mitigation", "Understanding bias in datasets", "Fairness metrics, Explainability (SHAP/LIME)", "AI Policy, Governance frameworks"),
        ("SKILL_42", "Signal Processing", "Engineering", "Processing discrete and continuous signals", "Fourier transform, Filtering", "FFT, Spectral Analysis, Audio processing", "Wavelets, Image filtering algorithms"),
        ("SKILL_43", "Cloud Data Pipelines", "Data Engineering", "ETL/ELT pipeline creation", "Cron jobs, CSV ingestion", "Airflow, Databricks Jobs, Delta Live Tables", "Real-time streaming pipelines (Kafka)"),
        ("SKILL_44", "Human-Computer Interaction", "Design", "Designing interfaces based on human cognition", "Heuristic evaluation", "User personas, Card sorting", "Usability labs, Accessibility compliance (WCAG)"),
        ("SKILL_45", "Competitive Programming", "Technical", "Speed problem solving under constraints", "Basic LeetCode easy", "LeetCode hard, Codeforces Division 2", "ACM-ICPC finalist problem solving"),
        ("SKILL_46", "Grant Writing", "Academic", "Securing funding for research projects", "Outline drafting", "Proposal budgeting, Narrative structuring", "NSF/NIH proposal principal authorship"),
        ("SKILL_47", "Venture Pitching", "Business", "Presenting business ideas to investors", "Pitch deck creation", "Elevator pitch, Q&A defense", "Term sheet negotiation, Angel investor relations"),
        ("SKILL_48", "Data Visualization", "Design", "Communicating complex data visually", "Bar charts, Line graphs", "Recharts, D3.js, Tableau", "Interactive dashboard design, Visual analytics"),
        ("SKILL_49", "Edge Computing", "Hardware", "Running ML models on low-power devices", "Raspberry Pi, Coral TPU", "TensorFlow Lite, Model Pruning", "Quantization, ONNX Runtime Edge"),
        ("SKILL_50", "Quantum Computing Basics", "Advanced Physics", "Fundamentals of quantum information", "Qubits, Quantum gates", "Qiskit, Quantum superposition algorithms", "Shor's algorithm simulation, VQE")
    ]

    with open(os.path.join(DATA_DIR, 'skills.csv'), 'w', newline='') as f:
        writer = csv.writer(f)
        writer.writerow(['skill_id', 'skill_name', 'category', 'description', 'beginner_description', 'intermediate_description', 'advanced_description'])
        writer.writerows(skills)

    # 2. COURSES (50+)
    courses = [
        # Computer Science / AI
        ("CS101", "Programming Fundamentals", "Computer Science", "Introduction to Python programming, variables, loops, and functions.", 3, "Beginner", "Python|Problem Solving", "None", 4, "Fall & Spring", "Undergraduate", "FAC_01"),
        ("CS102", "Data Structures & Algorithms", "Computer Science", "Arrays, linked lists, trees, graphs, sorting, and algorithmic complexity.", 4, "Intermediate", "Algorithm Design|Problem Solving", "CS101", 5, "Fall & Spring", "Undergraduate", "FAC_01"),
        ("AI101", "Introduction to Artificial Intelligence", "Computer Science", "Fundamental concepts of AI, search algorithms, logic, and intro to ML.", 4, "Intermediate", "Python|Machine Learning|Algorithm Design", "CS101", 4, "Fall & Spring", "Undergraduate", "FAC_02"),
        ("AI201", "Applied Machine Learning", "Computer Science", "Supervised, unsupervised learning, model evaluation, scikit-learn, and feature engineering.", 4, "Intermediate", "Python|Machine Learning|Probability & Statistics|Data Analysis", "AI101", 5, "Fall", "Undergraduate", "FAC_02"),
        ("AI301", "Deep Learning & Neural Networks", "Computer Science", "Deep architectures, PyTorch, CNNs, Transformers, and optimization methods.", 4, "Advanced", "Deep Learning|Python|Calculus & Optimization|Linear Algebra", "AI201", 6, "Spring", "Undergraduate", "FAC_02"),
        ("AI302", "Computer Vision & Visual Reasoning", "Computer Science", "Image processing, object detection, segmentation, and 3D vision.", 3, "Advanced", "Computer Vision|Deep Learning|Python", "AI301", 5, "Spring", "Undergraduate", "FAC_03"),
        ("AI303", "Natural Language Processing & LLMs", "Computer Science", "Text processing, sequence models, Transformers, RAG, and LLM fine-tuning.", 4, "Advanced", "Natural Language Processing|Generative AI|Deep Learning|Python", "AI301", 6, "Fall", "Graduate/Senior", "FAC_02"),
        ("AI401", "Reinforcement Learning & Decision Making", "Computer Science", "Markov decision processes, Q-learning, policy gradients, and multi-agent systems.", 4, "Advanced", "Reinforcement Learning|Python|Probability & Statistics", "AI201", 6, "Spring", "Graduate/Senior", "FAC_04"),
        ("CS205", "Database Systems & SQL Processing", "Computer Science", "Relational algebra, SQL, indexing, transaction processing, and query planning.", 3, "Intermediate", "SQL & Relational DBs|Backend Architecture", "CS102", 4, "Fall", "Undergraduate", "FAC_05"),
        ("CS310", "Full-Stack Web Development", "Computer Science", "Building modern web apps using Next.js, React, TypeScript, and FastAPI.", 3, "Intermediate", "Next.js & React|TypeScript|FastAPI|UI/UX Design", "CS101", 5, "Fall & Spring", "Undergraduate", "FAC_06"),
        ("CS320", "Cloud Computing & MLOps", "Computer Science", "Cloud architectures, Docker containerization, CI/CD pipelines, and MLflow.", 3, "Intermediate", "Docker & Containers|MLOps|Cloud Computing (AWS/Azure)", "CS102", 4, "Spring", "Undergraduate", "FAC_06"),
        ("CS400", "Cybersecurity & Network Defense", "Computer Science", "Network security protocols, cryptography, web security, and threat analysis.", 3, "Intermediate", "Cybersecurity Basics|Problem Solving", "CS102", 4, "Fall", "Undergraduate", "FAC_07"),
        ("DE101", "Data Engineering Fundamentals", "Data Science", "ETL pipelines, Databricks Unity Catalog, Spark DataFrames, and Delta Lake.", 4, "Intermediate", "Databricks Unity Catalog|Spark & Distributed Data|SQL & Relational DBs|Python", "CS205", 5, "Fall", "Undergraduate", "FAC_05"),
        ("DS202", "Applied Probability & Statistics for Data Science", "Data Science", "Statistical modeling, probability distributions, hypothesis testing, and regression.", 4, "Intermediate", "Probability & Statistics|Data Analysis|Python", "CS101", 4, "Fall & Spring", "Undergraduate", "FAC_08"),
        ("MATH201", "Linear Algebra for Machine Learning", "Mathematics", "Vector spaces, matrices, SVD, eigenvalues, and applications in AI.", 4, "Intermediate", "Linear Algebra|Math", "CS101", 4, "Fall & Spring", "Undergraduate", "FAC_08"),
        ("MATH202", "Multivariable Calculus & Optimization", "Mathematics", "Gradients, partial derivatives, Hessian matrices, and convex optimization.", 4, "Intermediate", "Calculus & Optimization|Math", "MATH201", 4, "Fall & Spring", "Undergraduate", "FAC_08"),
        
        # Engineering / Robotics
        ("ROB201", "Introduction to Robotics & Control", "Robotics", "Kinematics, sensors, microcontrollers, ROS, and motion planning.", 4, "Intermediate", "Robotics & Embedded Systems|C++|Problem Solving", "CS101", 5, "Fall", "Undergraduate", "FAC_09"),
        ("ROB301", "Autonomous Systems & Edge AI", "Robotics", "Sensor fusion, SLAM, edge neural network deployment, and embedded vision.", 4, "Advanced", "Edge Computing|Robotics & Embedded Systems|Computer Vision", "ROB201", 6, "Spring", "Senior", "FAC_09"),
        ("ECE210", "Digital Signal Processing", "Electrical Eng", "Continuous and discrete signals, Fourier transform, and digital filters.", 3, "Intermediate", "Signal Processing|Linear Algebra", "MATH201", 4, "Fall", "Undergraduate", "FAC_10"),
        
        # Business / Entrepreneurship / Ethics
        ("BUS101", "Introduction to Tech Entrepreneurship", "Business", "Opportunity discovery, business canvas, pitching, and launching tech MVPs.", 3, "Beginner", "Entrepreneurship|Venture Pitching|Leadership", "None", 3, "Fall & Spring", "Undergraduate", "FAC_11"),
        ("BUS202", "Product Management for Software", "Business", "Product roadmapping, user personas, sprint planning, and product analytics.", 3, "Intermediate", "Product Management|UI/UX Design|Technical Writing", "BUS101", 3, "Spring", "Undergraduate", "FAC_11"),
        ("ETH301", "Ethics, Bias & Policy in AI", "Humanities", "Social impact of automated systems, algorithmic bias, privacy, and governance.", 3, "Intermediate", "Ethics in AI|Technical Writing|Public Speaking", "None", 3, "Spring", "Undergraduate", "FAC_12"),
        ("FIN201", "Quantitative Finance & Trading Systems", "Finance", "Financial time series, Black-Scholes model, algorithmic trading strategies.", 3, "Intermediate", "Quantitative Finance|Probability & Statistics|Python", "DS202", 4, "Fall", "Undergraduate", "FAC_13"),
        ("BIO210", "Computational Genomics & Bioinformatics", "Bioinformatics", "DNA sequencing algorithms, protein structure prediction, and biological datasets.", 4, "Intermediate", "Bioinformatics|Python|Data Analysis", "CS101", 5, "Spring", "Undergraduate", "FAC_14"),
        
        # Add 25 more courses to exceed 50 total courses
        ("CS103", "Object-Oriented Design in C++", "Computer Science", "Classes, inheritance, polymorphism, and memory management.", 3, "Intermediate", "Problem Solving|Algorithm Design", "CS101", 4, "Spring", "Undergraduate", "FAC_01"),
        ("CS210", "Operating Systems Architecture", "Computer Science", "Processes, threads, memory management, file systems, and concurrency.", 4, "Intermediate", "Problem Solving|Backend Architecture", "CS102", 5, "Fall", "Undergraduate", "FAC_07"),
        ("CS220", "Computer Networks & Protocols", "Computer Science", "TCP/IP, routing algorithms, HTTP/2, and socket programming.", 3, "Intermediate", "Backend Architecture|Networking", "CS102", 4, "Spring", "Undergraduate", "FAC_07"),
        ("CS330", "Compiler Design & Program Analysis", "Computer Science", "Lexical analysis, parsing, AST generation, and code optimization.", 4, "Advanced", "Algorithm Design|TypeScript", "CS102", 5, "Fall", "Senior", "FAC_01"),
        ("CS340", "Distributed Systems & Microservices", "Computer Science", "Consensus algorithms, Raft, gRPC, load balancing, and fault tolerance.", 4, "Advanced", "Backend Architecture|Cloud Computing (AWS/Azure)", "CS210", 6, "Spring", "Senior", "FAC_06"),
        ("DS101", "Introduction to Data Science", "Data Science", "Data manipulation with Pandas, exploratory data analysis, and visualization.", 3, "Beginner", "Python|Data Analysis|Data Visualization", "None", 3, "Fall & Spring", "Undergraduate", "FAC_08"),
        ("DS301", "Big Data Analytics with Apache Spark", "Data Science", "Distributed dataframes, PySpark, streaming analytics, and Delta Lake.", 4, "Advanced", "Spark & Distributed Data|Databricks Unity Catalog|Cloud Data Pipelines", "DE101", 5, "Spring", "Graduate/Senior", "FAC_05"),
        ("DS302", "Time Series Analysis & Forecasting", "Data Science", "ARIMA models, Prophet, LSTM networks for sequential data forecasting.", 3, "Intermediate", "Data Analysis|Machine Learning|Probability & Statistics", "DS202", 4, "Fall", "Undergraduate", "FAC_08"),
        ("AI402", "Generative AI Systems & Agentic Workflows", "Computer Science", "Building autonomous agents, tool calling, multi-agent frameworks, and vector search.", 4, "Advanced", "Generative AI|Natural Language Processing|Python|FastAPI", "AI303", 6, "Spring", "Graduate/Senior", "FAC_02"),
        ("AI403", "AI for Healthcare & Medical Imaging", "Computer Science", "3D medical image segmentation, clinical NLP, and diagnostic prediction models.", 4, "Advanced", "Computer Vision|Deep Learning|Bioinformatics", "AI302", 5, "Fall", "Graduate/Senior", "FAC_03"),
        ("DES101", "Human-Centered Design & Prototyping", "Design", "User research, wireframing in Figma, and usability testing.", 3, "Beginner", "UI/UX Design|Human-Computer Interaction", "None", 3, "Fall & Spring", "Undergraduate", "FAC_15"),
        ("DES201", "Advanced Interactive Prototyping", "Design", "Micro-interactions, animation design, and component design systems.", 3, "Intermediate", "UI/UX Design|Next.js & React|Human-Computer Interaction", "DES101", 4, "Spring", "Undergraduate", "FAC_15"),
        ("BUS201", "Tech Startup Finance & Valuation", "Business", "Cap tables, seed funding, venture capital metrics, and financial modeling.", 3, "Intermediate", "Venture Pitching|Entrepreneurship", "BUS101", 3, "Fall", "Undergraduate", "FAC_11"),
        ("BUS301", "Go-To-Market & Growth Hacking", "Business", "Customer acquisition, SEO, viral marketing loops, and analytics.", 3, "Intermediate", "Product Management|Data Analysis", "BUS101", 3, "Spring", "Undergraduate", "FAC_11"),
        ("CYB201", "Ethical Hacking & Penetration Testing", "Security", "Vulnerability assessment, network sniffing, exploit payloads, and web security.", 4, "Intermediate", "Cybersecurity Basics|Python", "CS400", 5, "Spring", "Undergraduate", "FAC_07"),
        ("CYB301", "Applied Cryptography & Zero-Knowledge", "Security", "RSA, Elliptic Curves, ZK-SNARKs, and cryptographic protocols.", 4, "Advanced", "Cybersecurity Basics|Linear Algebra|Math", "CS400", 5, "Fall", "Senior", "FAC_07"),
        ("PHYS201", "Quantum Information Science Fundamentals", "Physics", "Qubits, quantum gates, entanglement, and quantum circuit design.", 4, "Advanced", "Quantum Computing Basics|Linear Algebra", "MATH201", 5, "Fall", "Senior", "FAC_16"),
        ("ENG101", "Academic & Technical Writing Excellence", "Humanities", "Structuring scientific articles, literature reviews, and grant proposals.", 2, "Beginner", "Technical Writing|Research Methods", "None", 2, "Fall & Spring", "Undergraduate", "FAC_12"),
        ("ENG201", "Persuasive Public Speaking & Debate", "Humanities", "Speech delivery, argumentation, audience engagement, and debate tactics.", 2, "Beginner", "Public Speaking|Leadership", "None", 2, "Fall & Spring", "Undergraduate", "FAC_12"),
        ("ROB202", "Embedded Systems & IoT Networks", "Robotics", "Microcontroller programming, MQTT, wireless sensor networks.", 3, "Intermediate", "Robotics & Embedded Systems|Docker & Containers", "CS101", 4, "Fall", "Undergraduate", "FAC_09"),
        ("MATH301", "Bayesian Statistics & Inference", "Mathematics", "Prior distributions, MCMC sampling, PyMC, and Bayesian modeling.", 4, "Advanced", "Probability & Statistics|Python|Data Analysis", "DS202", 5, "Spring", "Senior", "FAC_08"),
        ("MATH302", "Convex Optimization for Engineering", "Mathematics", "Convex sets, duality, interior-point methods, and solver libraries.", 4, "Advanced", "Calculus & Optimization|Linear Algebra", "MATH202", 5, "Fall", "Graduate/Senior", "FAC_08"),
        ("CS450", "Parallel Computing & GPU Programming", "Computer Science", "CUDA programming, OpenMP, MPI, and GPU kernel optimization.", 4, "Advanced", "Problem Solving|Algorithm Design", "CS102", 6, "Spring", "Senior", "FAC_01"),
        ("CS460", "Advanced Distributed Storage & Consensus", "Computer Science", "Distributed hash tables, Paxos, Raft, and distributed file systems.", 4, "Advanced", "Backend Architecture|Algorithm Design", "CS340", 5, "Fall", "Senior", "FAC_01"),
        ("AI460", "Multi-Agent Systems & Swarm Intelligence", "Computer Science", "Cooperative AI, emergent behavior, and distributed multi-agent RL.", 4, "Advanced", "Reinforcement Learning|Generative AI", "AI401", 5, "Spring", "Graduate/Senior", "FAC_02"),
        ("AI450", "AI Safety, Alignment & Robustness", "Computer Science", "Adversarial attacks, red-teaming LLMs, reward modeling, and RLHF.", 4, "Advanced", "Ethics in AI|Generative AI|Reinforcement Learning", "AI303", 5, "Spring", "Graduate/Senior", "FAC_02"),
        ("DS450", "Applied Spatial Data Science & GIS", "Data Science", "Geospatial data analysis, QGIS, Folium, and spatial statistics.", 3, "Intermediate", "Data Analysis|Python", "DS101", 4, "Fall", "Undergraduate", "FAC_08")
    ]

    with open(os.path.join(DATA_DIR, 'courses.csv'), 'w', newline='') as f:
        writer = csv.writer(f)
        writer.writerow(['course_id', 'course_name', 'department', 'description', 'credits', 'difficulty', 'skills', 'prerequisites', 'hours_per_week', 'semester', 'level', 'faculty_id'])
        writer.writerows(courses)

    # 3. CLUBS (20+)
    clubs = [
        ("CLUB_01", "Artificial Intelligence Student Society", "Technology", "Premier student organization for AI enthusiasts, hosting workshops, guest talks, and projects.", "AI|Machine Learning|Deep Learning|Python", "Python|Machine Learning|Deep Learning|Public Speaking", 3, "Tuesday", "18:00", "Open to All", "EVT_01|EVT_02|EVT_05"),
        ("CLUB_02", "Competitive Programming & Algorithmic Club", "Technology", "Train for ACM-ICPC, LeetCode contests, and technical interview preparation.", "Algorithmic Thinking|Coding|Problem Solving", "Algorithm Design|Competitive Programming|Problem Solving", 3, "Wednesday", "17:00", "Open to All", "EVT_03|EVT_04"),
        ("CLUB_03", "Data Science & Analytics League", "Technology", "Hands-on data analysis projects, Databricks challenges, and Kaggle competitions.", "Data Science|Big Data|Data Viz", "Data Analysis|SQL & Relational DBs|Python|Data Visualization", 2, "Thursday", "18:30", "Open to All", "EVT_06|EVT_07"),
        ("CLUB_04", "Robotics & Autonomous Hardware Lab Club", "Engineering", "Build autonomous drones, rover bots, and micro-robotics for regional competitions.", "Robotics|Hardware|Embedded Systems", "Robotics & Embedded Systems|Edge Computing|Teamwork & Collaboration", 4, "Saturday", "13:00", "Active Member", "EVT_08|EVT_09"),
        ("CLUB_05", "Campus Student Startup Incubator", "Entrepreneurship", "Connect aspiring founders, form hackathon teams, and pitch to venture capital mentors.", "Startups|Venture Capital|Product", "Entrepreneurship|Venture Pitching|Leadership|Product Management", 3, "Monday", "18:00", "Open to All", "EVT_10|EVT_11"),
        ("CLUB_06", "Web3 & Distributed Systems Developers", "Technology", "Explore blockchain, decentralized applications, and microservice architectures.", "Web3|Distributed Systems|Cloud", "Backend Architecture|TypeScript|Cybersecurity Basics", 2, "Friday", "16:00", "Open to All", "EVT_12"),
        ("CLUB_07", "Cybersecurity & Ethical Hacking Guild", "Security", "Participate in Capture-The-Flag (CTF) competitions and network penetration labs.", "Cybersecurity|Hacking|Networking", "Cybersecurity Basics|Python|Problem Solving", 3, "Thursday", "17:30", "Open to All", "EVT_13|EVT_14"),
        ("CLUB_08", "UI/UX & Product Design Collective", "Design", "Critique user interfaces, participate in design sprints, and build design portfolios.", "Design|Figma|User Experience", "UI/UX Design|Human-Computer Interaction|Data Visualization", 2, "Wednesday", "16:30", "Open to All", "EVT_15"),
        ("CLUB_09", "Undergraduate Research Association", "Academic", "Mentorship for undergraduates seeking lab positions, paper writing, and grant applications.", "Research|Academia|Grants", "Research Methods|Technical Writing|Public Speaking", 2, "Bi-weekly Tuesday", "17:00", "Open to All", "EVT_16|EVT_17"),
        ("CLUB_10", "Women in Computer Science & Engineering", "Diversity & Tech", "Empowering women in technology through mentorship, tech talks, and career networking.", "Community|Mentorship|Tech Career", "Leadership|Networking|Public Speaking|Python", 2, "Bi-weekly Monday", "17:30", "Open to All", "EVT_18|EVT_19"),
        ("CLUB_11", "Quantitative Trading & Fintech Association", "Finance & Tech", "Build algorithmic trading bots, backtest strategies, and learn market microstructure.", "Fintech|Quant|Algorithmic Trading", "Quantitative Finance|Probability & Statistics|Python", 3, "Wednesday", "18:00", "Open to All", "EVT_20"),
        ("CLUB_12", "Open Source Software Contributors Club", "Technology", "Contribute to popular open-source projects, learn Git workflows, and build public dev profiles.", "Open Source|Git|GitHub", "Git & GitHub|TypeScript|Python|Docker & Containers", 2, "Friday", "17:00", "Open to All", "EVT_21"),
        ("CLUB_13", "Cloud & DevOps Practitioners Student Chapter", "Technology", "Learn Docker, Kubernetes, AWS, and modern cloud deployment practices.", "Cloud|DevOps|AWS", "Docker & Containers|DevOps & CI/CD|Cloud Computing (AWS/Azure)", 2, "Thursday", "16:00", "Open to All", "EVT_22"),
        ("CLUB_14", "Bioinformatics & Computational Biology Society", "Interdisciplinary", "Analyze genetic datasets, simulate protein interactions, and present interdisciplinary research.", "Genomics|Bioinformatics|Science", "Bioinformatics|Data Analysis|Python", 2, "Monday", "16:30", "Open to All", "EVT_23"),
        ("CLUB_15", "Student Game Developers Guild", "Media & Tech", "Create indie games using Unity, Unreal Engine, and custom graphics pipelines.", "Game Dev|Graphics|3D", "UI/UX Design|Computer Vision|Algorithm Design", 3, "Saturday", "14:00", "Open to All", "EVT_24"),
        ("CLUB_16", "Ethics in Technology & AI Policy Forum", "Humanities & Tech", "Debate AI governance, privacy laws, and algorithm transparency with faculty.", "Ethics|Policy|AI Governance", "Ethics in AI|Public Speaking|Technical Writing", 2, "Bi-weekly Wednesday", "17:00", "Open to All", "EVT_25"),
        ("CLUB_17", "Quantum Computing Enthusiasts Group", "Advanced Tech", "Study quantum algorithms, run simulations on Qiskit, and host guest speaker events.", "Quantum|Physics|Advanced Math", "Quantum Computing Basics|Linear Algebra", 2, "Friday", "15:00", "Open to All", "EVT_26"),
        ("CLUB_18", "Full-Stack Web Developers Alliance", "Technology", "Build end-to-end web apps for campus organizations and non-profits.", "Web Dev|Next.js|APIs", "Next.js & React|TypeScript|FastAPI|UI/UX Design", 3, "Tuesday", "17:30", "Open to All", "EVT_27"),
        ("CLUB_19", "Toastmasters Campus Public Speaking Club", "Soft Skills", "Practice impromptu speaking, formal presentations, and leadership evaluation.", "Public Speaking|Communication|Leadership", "Public Speaking|Leadership|Networking", 2, "Thursday", "18:00", "Open to All", "EVT_28"),
        ("CLUB_20", "CleanTech & Environmental Data Initiative", "Sustainability", "Apply data science and sensor networks to monitor energy consumption on campus.", "Sustainability|Data|Clean Energy", "Data Analysis|Python|Data Visualization", 2, "Wednesday", "16:00", "Open to All", "EVT_29"),
        ("CLUB_21", "Product Management Student Network", "Business & Tech", "Work on real case studies, feature specs, and prepare for APM interview loops.", "Product|Strategy|UX", "Product Management|UI/UX Design|Data Analysis", 2, "Monday", "18:30", "Open to All", "EVT_30")
    ]

    with open(os.path.join(DATA_DIR, 'clubs.csv'), 'w', newline='') as f:
        writer = csv.writer(f)
        writer.writerow(['club_id', 'club_name', 'category', 'description', 'interests', 'skills', 'hours_per_week', 'meeting_day', 'meeting_time', 'membership_level', 'related_events'])
        writer.writerows(clubs)

    # 4. EVENTS (50+)
    events = [
        # AI / ML Workshops & Hackathons
        ("EVT_01", "Annual Campus AI Hackathon 2026", "Hackathon", "48-hour intensive building competition to create innovative AI applications.", "2026-10-15", 48, "Innovation Center Makerspace", "AI Student Society & Databricks", "Python|Machine Learning|Generative AI|FastAPI|Teamwork & Collaboration", "CLUB_01", "AI101|AI201", "Yes"),
        ("EVT_02", "Hands-On Deep Learning with PyTorch Workshop", "Workshop", "Practical tutorial on building CNNs and Transformers from scratch.", "2026-09-20", 3, "Computer Science Lab 3", "AI Student Society", "Deep Learning|Python", "CLUB_01", "AI301", "Yes"),
        ("EVT_03", "Algorithmic Speed Challenge & Contest", "Competition", "Timed coding contest featuring data structures and dynamic programming.", "2026-09-28", 4, "Online / HackerRank", "Competitive Programming Club", "Algorithm Design|Competitive Programming|Problem Solving", "CLUB_02", "CS102", "No"),
        ("EVT_04", "Tech Interview Code Sprint", "Workshop", "Mock interview sessions focusing on system design and LeetCode hard problems.", "2026-10-02", 2, "CS Auditorium", "Competitive Programming Club", "Algorithm Design|Public Speaking|Problem Solving", "CLUB_02", "CS102", "No"),
        ("EVT_05", "Databricks & LLM Fine-Tuning Masterclass", "Tech Talk", "Guest lecture by industry engineers on Databricks Genie, Delta Lake, and RAG.", "2026-10-10", 2, "Engineering Quad Hall A", "AI Student Society", "Generative AI|Databricks Unity Catalog|Natural Language Processing", "CLUB_01", "AI303|DE101", "Yes"),
        ("EVT_06", "Data Analytics Sprint with Databricks SQL", "Workshop", "Learn to query large scale datasets and build interactive dashboards.", "2026-09-25", 3, "Data Science Lab 101", "Data Science League", "SQL & Relational DBs|Databricks Unity Catalog|Data Visualization", "CLUB_03", "CS205|DE101", "Yes"),
        ("EVT_07", "Kaggle Grandmaster Fireside Chat", "Seminar", "Insights into winning machine learning competitions and feature engineering.", "2026-10-05", 2, "Virtual Zoom", "Data Science League", "Machine Learning|Data Analysis", "CLUB_03", "AI201", "No"),
        ("EVT_08", "Robotics Autonomy Field Demo", "Tech Talk", "Live outdoor demo of autonomous rover obstacle avoidance and vision SLAM.", "2026-10-18", 3, "Campus Athletic Field", "Robotics Lab Club", "Robotics & Embedded Systems|Computer Vision", "CLUB_04", "ROB201", "No"),
        ("EVT_09", "Micro-Drone Building & Soldering Workshop", "Workshop", "Assemble your own FPV drone hardware and program flight controllers.", "2026-10-22", 4, "Makerspace Hardware Hub", "Robotics Lab Club", "Robotics & Embedded Systems|Edge Computing", "CLUB_04", "ROB201", "Yes"),
        ("EVT_10", "Campus Venture Pitch Night", "Competition", "Student startup teams present pitch decks to local angel investors for $10k prizes.", "2026-11-01", 3, "Business School Auditorium", "Student Startup Incubator", "Venture Pitching|Entrepreneurship|Public Speaking", "CLUB_05", "BUS101", "Yes"),
        
        # Add 40 more events to reach 50+ total events
        ("EVT_11", "Startup Co-Founder Speed Dating", "Networking Event", "Match with technical co-founders or business leads for upcoming hackathons.", "2026-09-15", 2, "Student Union Lounge", "Student Startup Incubator", "Entrepreneurship|Leadership|Networking", "CLUB_05", "BUS101", "No"),
        ("EVT_12", "Web3 Microservices Architecture Seminar", "Tech Talk", "Understanding gRPC, Event Sourcing, and decentralized APIs.", "2026-09-22", 2, "CS Seminar Room B", "Web3 Developers", "Backend Architecture|TypeScript", "CLUB_06", "CS310", "No"),
        ("EVT_13", "Campus Capture-The-Flag (CTF) Tournament", "Competition", "24-hour security competition finding flags in web apps and binary targets.", "2026-10-12", 24, "CS Cyber Lab", "Cybersecurity Guild", "Cybersecurity Basics|Python|Problem Solving", "CLUB_07", "CS400", "Yes"),
        ("EVT_14", "Web Application Security Audit Workshop", "Workshop", "Hands-on testing of SQL injection, XSS, and CSRF vulnerabilities.", "2026-09-29", 3, "CS Cyber Lab", "Cybersecurity Guild", "Cybersecurity Basics|FastAPI", "CLUB_07", "CS400", "Yes"),
        ("EVT_15", "Figma Design System Masterclass", "Workshop", "Create reusable tokenized component libraries for Next.js web applications.", "2026-09-18", 2, "Design Studio 204", "UI/UX Collective", "UI/UX Design|Human-Computer Interaction", "CLUB_08", "DES101", "No"),
        ("EVT_16", "How to Secure an Undergraduate Research Position", "Seminar", "Faculty panel discussion on emailing professors and applying for REUs.", "2026-09-12", 2, "Science Library Auditorium", "Undergraduate Research Assoc", "Research Methods|Networking|Technical Writing", "CLUB_09", "ENG101", "No"),
        ("EVT_17", "LaTeX Academic Paper Formatting Workshop", "Workshop", "Learn to write crisp IEEE/ACM double-column papers and manage BibTeX.", "2026-10-08", 2, "Science Library Computer Room", "Undergraduate Research Assoc", "Technical Writing|Research Methods", "CLUB_09", "ENG101", "No"),
        ("EVT_18", "Women in Tech Annual Mentorship Kickoff", "Networking Event", "Pairing undergraduate students with industry engineering mentors from Big Tech.", "2026-09-21", 2, "Faculty Club Ballroom", "Women in CS & Engineering", "Networking|Leadership|Public Speaking", "CLUB_10", "None", "Yes"),
        ("EVT_19", "Grace Hopper Conference Prep & Resume Review", "Workshop", "Resume feedback and elevator pitch refinement for national career fairs.", "2026-09-30", 2, "Student Center Room 301", "Women in CS & Engineering", "Public Speaking|Networking|Technical Writing", "CLUB_10", "None", "No"),
        ("EVT_20", "High-Frequency Trading Algorithm Challenge", "Competition", "Simulated stock exchange challenge optimizing trade latency in Python.", "2026-10-25", 5, "Finance Lab", "Quant Trading Assoc", "Quantitative Finance|Python|Probability & Statistics", "CLUB_11", "FIN201", "Yes"),
        ("EVT_21", "Git Rebasing & Open Source PR Sprint", "Workshop", "Learn upstream git workflows and submit your first Pull Request to OSS.", "2026-09-23", 3, "CS Student Lounge", "Open Source Developers", "Git & GitHub|Python|TypeScript", "CLUB_12", "CS101", "No"),
        ("EVT_22", "Deploying Next.js & FastAPI to Cloud Docker", "Workshop", "Containerize full-stack apps and deploy to AWS ECS / Fly.io.", "2026-10-14", 3, "CS Lab 1", "DevOps Chapter", "Docker & Containers|DevOps & CI/CD|FastAPI", "CLUB_13", "CS320", "Yes"),
        ("EVT_23", "Genomic Sequence Alignment Hackathon", "Hackathon", "Build fast string alignment algorithms for modern DNA sequencing data.", "2026-10-28", 12, "Biotech Building 3rd Floor", "Bioinformatics Society", "Bioinformatics|Python|Algorithm Design", "CLUB_14", "BIO210", "Yes"),
        ("EVT_24", "48-Hour Indie Game Jam", "Competition", "Design and build a playable video game theme revealed at kickoff.", "2026-11-05", 48, "Makerspace Media Lab", "Game Dev Guild", "UI/UX Design|Algorithm Design", "CLUB_15", "None", "Yes"),
        ("EVT_25", "AI Alignment & Autonomous Weapons Debate", "Seminar", "Structured debate between ethics professors and AI lab researchers.", "2026-10-16", 2, "Humanities Hall 101", "Ethics in Tech Forum", "Ethics in AI|Public Speaking", "CLUB_16", "ETH301", "No"),
        ("EVT_26", "Intro to Qiskit & Quantum Gates Workshop", "Workshop", "Program your first quantum circuit on IBM Quantum hardware.", "2026-10-03", 3, "Physics Lab 4", "Quantum Computing Group", "Quantum Computing Basics|Linear Algebra", "CLUB_17", "PHYS201", "Yes"),
        ("EVT_27", "Campus Non-Profit Website Buildathon", "Hackathon", "Spend 12 hours building live Next.js websites for local community non-profits.", "2026-10-20", 12, "Student Union Multi-Purpose Room", "Web Dev Alliance", "Next.js & React|TypeScript|FastAPI", "CLUB_18", "CS310", "Yes"),
        ("EVT_28", "Impromptu Speech Championship", "Competition", "Test your spontaneous presentation skills in 2-minute randomized topics.", "2026-10-07", 2, "Student Union Theater", "Toastmasters Speaking Club", "Public Speaking|Leadership", "CLUB_19", "ENG201", "No"),
        ("EVT_29", "Campus Energy Data Visualization Sprint", "Competition", "Analyze real-time IoT energy sensors and build interactive dashboards.", "2026-10-24", 6, "Environmental Science Center", "CleanTech Initiative", "Data Analysis|Data Visualization|Python", "CLUB_20", "DS101", "No"),
        ("EVT_30", "Product Case Study Breakdown: Databricks Genie", "Workshop", "Deconstruct Databricks Genie product architecture and competitive strategy.", "2026-10-11", 2, "Business School Room 102", "Product Network", "Product Management|Databricks Unity Catalog", "CLUB_21", "BUS202", "No"),
        ("EVT_31", "Big Tech Fall Career Fair 2026", "Career Fair", "Meet recruiters from Databricks, Google, Meta, Microsoft, and top startups.", "2026-09-24", 6, "Campus Recreation Center Gymnasium", "Engineering Career Services", "Networking|Public Speaking", "None", "None", "Yes"),
        ("EVT_32", "Undergraduate Research Opportunities Fair", "Career Fair", "Discover active faculty research openings across AI, Robotics, and Biotech.", "2026-09-17", 4, "Science Quad Plaza", "Undergraduate Research Office", "Research Methods|Networking", "CLUB_09", "None", "No"),
        ("EVT_33", "FastAPI & Async Python Architecture Tech Talk", "Tech Talk", "Deep dive into ASGI, asyncio event loops, and high-concurrency Python.", "2026-10-19", 2, "CS Auditorium", "Web Dev Alliance", "FastAPI|Python|Backend Architecture", "CLUB_18", "CS310", "No"),
        ("EVT_34", "Reinforcement Learning from Human Feedback (RLHF) Lecture", "Tech Talk", "How modern LLMs are aligned using PPO and Reward Models.", "2026-10-27", 2, "AI Research Institute", "AI Student Society", "Reinforcement Learning|Generative AI|Deep Learning", "CLUB_01", "AI401", "No"),
        ("EVT_35", "Container Orchestration with Kubernetes Workshop", "Workshop", "Hands-on tutorial creating Kubernetes clusters and deploying microservices.", "2026-11-02", 3, "Cloud Lab 202", "DevOps Chapter", "Docker & Containers|DevOps & CI/CD", "CLUB_13", "CS320", "Yes"),
        ("EVT_36", "Computer Vision for Autonomous Driving Lecture", "Tech Talk", "Guest lecture by Tesla Autopilot engineers on camera perception.", "2026-10-29", 2, "Engineering Auditorium", "Robotics Lab Club", "Computer Vision|Deep Learning", "CLUB_04", "AI302", "No"),
        ("EVT_37", "Data Science Resume & Portfolio Clinic", "Workshop", "Get your GitHub, Databricks projects, and Kaggle profiles reviewed.", "2026-09-26", 2, "CS Lounge", "Data Science League", "Data Visualization|Technical Writing|Networking", "CLUB_03", "DS101", "No"),
        ("EVT_38", "Startup Seed Funding & Pitch Deck Masterclass", "Workshop", "Learn what VCs look for in early-stage seed pitch decks.", "2026-10-17", 2, "Incubator Hub", "Student Startup Incubator", "Venture Pitching|Entrepreneurship", "CLUB_05", "BUS201", "No"),
        ("EVT_39", "Mobile App UI Micro-Animations with Framer Motion", "Workshop", "Add fluid spring physics animations and visual polish to React apps.", "2026-10-06", 2, "Design Studio 101", "UI/UX Collective", "Next.js & React|UI/UX Design", "CLUB_08", "CS310", "No"),
        ("EVT_40", "Natural Language RAG & Vector DB Workshop", "Workshop", "Build a retrieval-augmented generation app using Pinecone and LlamaIndex.", "2026-10-21", 3, "CS Lab 4", "AI Student Society", "Generative AI|Natural Language Processing|Python", "CLUB_01", "AI303", "Yes"),
        ("EVT_41", "Cybersecurity Penetration Testing Live CTF", "Competition", "Live red team vs blue team defense simulation.", "2026-11-08", 6, "Cybersecurity Hub", "Cybersecurity Guild", "Cybersecurity Basics|Problem Solving", "CLUB_07", "CYB201", "Yes"),
        ("EVT_42", "Quantitative Risk & Monte Carlo Simulation Tutorial", "Workshop", "Implement Monte Carlo portfolio simulation models in Python.", "2026-10-13", 2, "Finance Lab", "Quant Trading Assoc", "Quantitative Finance|Probability & Statistics", "CLUB_11", "FIN201", "No"),
        ("EVT_43", "Databricks Unity Catalog Lineage & Security Seminar", "Tech Talk", "Enterprise data governance, column-level security, and audit logging.", "2026-10-23", 2, "Databricks Innovation Lab", "Data Science League", "Databricks Unity Catalog|SQL & Relational DBs", "CLUB_03", "DE101", "No"),
        ("EVT_44", "Bioinformatics Protein Folding (AlphaFold) Talk", "Tech Talk", "Understanding structural biology advancements powered by deep learning.", "2026-10-30", 2, "Biotech Auditorium", "Bioinformatics Society", "Bioinformatics|Deep Learning", "CLUB_14", "BIO210", "No"),
        ("EVT_45", "Open Source Hacktoberfest Kickoff", "Hackathon", "Celebrate open source by completing 4 accepted pull requests in October.", "2026-10-01", 4, "Student Union Ballroom", "Open Source Developers", "Git & GitHub|Python|TypeScript", "CLUB_12", "CS101", "No"),
        ("EVT_46", "Clean Energy IoT Hardware Hack", "Hackathon", "Build micro-controller environmental monitors for smart buildings.", "2026-11-04", 12, "Environmental Science Lab", "CleanTech Initiative", "Robotics & Embedded Systems|Data Analysis", "CLUB_20", "ROB202", "Yes"),
        ("EVT_47", "Student Entrepreneur Fireside Chat with YC Founder", "Seminar", "Q&A session with a Y Combinator alumni founder on scaling product-market fit.", "2026-10-14", 2, "Business Center 201", "Student Startup Incubator", "Entrepreneurship|Product Management", "CLUB_05", "BUS101", "No"),
        ("EVT_48", "AI Ethics & Algorithmic Governance Workshop", "Workshop", "Analyze case studies of hiring algorithm bias and facial recognition regulation.", "2026-10-26", 2, "Humanities Room 202", "Ethics in Tech Forum", "Ethics in AI|Technical Writing", "CLUB_16", "ETH301", "No"),
        ("EVT_49", "Next.js 15 App Router & Server Components Tutorial", "Tech Talk", "Deep dive into React Server Components, Server Actions, and streaming SSR.", "2026-09-27", 2, "CS Auditorium", "Web Dev Alliance", "Next.js & React|TypeScript", "CLUB_18", "CS310", "No"),
        ("EVT_50", "Undergraduate Research Poster Showcase", "Conference", "Present your semester research project findings to university faculty judges.", "2026-11-15", 4, "Campus Center Atrium", "Undergraduate Research Assoc", "Research Methods|Public Speaking|Technical Writing", "CLUB_09", "ENG101", "Yes")
    ]

    with open(os.path.join(DATA_DIR, 'events.csv'), 'w', newline='') as f:
        writer = csv.writer(f)
        writer.writerow(['event_id', 'event_name', 'event_type', 'description', 'date', 'duration_hours', 'location', 'organizer', 'skills', 'related_clubs', 'related_courses', 'registration_required'])
        writer.writerows(events)

    # 5. RESEARCH PROJECTS (30+)
    research_projects = [
        # AI / ML Research
        ("RES_01", "Autonomous Navigation & Perception for Edge Robotics", "Developing real-time vision SLAM and lightweight neural net models for autonomous drone navigation.", "Artificial Intelligence & Robotics", "Prof. Aris Thorne", "Computer Science", "Computer Vision|Deep Learning|Robotics & Embedded Systems|Python", "AI302|ROB201", "Advanced", 6, "1 Semester (15 weeks)", "FACIL_01", "Open", "AI302|ROB301"),
        ("RES_02", "Databricks Genie Agentic Workflow Optimization", "Investigating natural language text-to-SQL translation reliability and multi-agent intent routing.", "AI & Data Engineering", "Prof. Elena Vance", "Computer Science", "Generative AI|Databricks Unity Catalog|Natural Language Processing|Python|SQL & Relational DBs", "AI303|DE101", "Advanced", 6, "1 Year", "FACIL_02", "Open", "AI402|DE101"),
        ("RES_03", "Self-Supervised Vision Transformers for Bio-Medical Imaging", "Designing self-supervised transformer backbones for high-resolution MRI diagnostic segmentation.", "Medical AI", "Prof. Marcus Lin", "Computer Science", "Deep Learning|Computer Vision|Bioinformatics|Python", "AI301", "Advanced", 5, "2 Semesters", "FACIL_01", "Open", "AI403|AI302"),
        ("RES_04", "Reinforcement Learning for Multi-Agent Logistics Scheduling", "Developing scalable PPO algorithms for dynamic fleet management and supply chain routing.", "Artificial Intelligence", "Prof. Aris Thorne", "Computer Science", "Reinforcement Learning|Python|Probability & Statistics|Algorithm Design", "AI401", "Advanced", 6, "1 Semester", "FACIL_01", "Open", "AI401"),
        ("RES_05", "Fairness & Bias Mitigation in Algorithmic Credit Scoring", "Auditing commercial financial ML models for demographic disparity and implementing SHAP explainability.", "AI Ethics & Finance", "Prof. Sarah Jenkins", "Humanities & Business", "Ethics in AI|Data Analysis|Python|Probability & Statistics", "ETH301|DS202", "Intermediate", 4, "1 Semester", "FACIL_04", "Open", "ETH301|FIN201"),
        ("RES_06", "LLM Hallucination Detection via Knowledge Graph Verification", "Building continuous validation pipelines that verify LLM responses against structured Databricks Delta graphs.", "Natural Language Processing", "Prof. Elena Vance", "Computer Science", "Natural Language Processing|Generative AI|Python|SQL & Relational DBs", "AI303", "Advanced", 6, "1 Year", "FACIL_02", "Open", "AI402|CS205"),
        ("RES_07", "Low-Power Neuromorphic Edge Computing Architectures", "Benchmarking spiking neural networks on micro-watt embedded hardware for IoT sensors.", "Hardware & AI", "Prof. David Kova", "Electrical Eng", "Edge Computing|Robotics & Embedded Systems|Signal Processing", "ROB202", "Advanced", 5, "1 Semester", "FACIL_05", "Open", "ROB301"),
        ("RES_08", "Quantitative High-Frequency Market Microstructure Dynamics", "Modeling order book dynamics and latency arbitrage strategies using high-dimensional limit order data.", "Quantitative Finance", "Prof. Victor Sterling", "Finance", "Quantitative Finance|Probability & Statistics|Python", "FIN201|DS202", "Advanced", 5, "2 Semesters", "FACIL_04", "Open", "FIN201"),
        ("RES_09", "Deep Reinforcement Learning for Protein Folding Simulation", "Accelerating molecular dynamics simulations using graph neural networks and deep RL.", "Computational Biology", "Prof. Clara Moreau", "Bioinformatics", "Bioinformatics|Deep Learning|Python|Reinforcement Learning", "BIO210|AI301", "Advanced", 6, "1 Year", "FACIL_03", "Open", "BIO210|AI401"),
        ("RES_10", "Zero-Knowledge Proof Systems for Decentralized Identity", "Implementing scalable zk-SNARK protocols to enable privacy-preserving academic credential verification.", "Cybersecurity & Blockchain", "Prof. Alan Turing-Smith", "Computer Science", "Cybersecurity Basics|Linear Algebra|TypeScript", "CYB301", "Advanced", 5, "1 Semester", "FACIL_06", "Open", "CYB301"),
        
        # Add 20 more research projects to reach 30+ total
        ("RES_11", "Autonomous Driving Perception under Adverse Weather", "Training robust camera-radar fusion networks for fog and heavy snow navigation.", "Computer Vision", "Prof. Aris Thorne", "Computer Science", "Computer Vision|Deep Learning|Python", "AI302", "Advanced", 6, "1 Year", "FACIL_01", "Open", "AI302"),
        ("RES_12", "Databricks Delta Live Streaming for Smart Campus IoT", "Building sub-second real-time streaming architectures using Spark Streaming and Delta Lake.", "Data Engineering", "Prof. Elena Vance", "Computer Science", "Databricks Unity Catalog|Spark & Distributed Data|Python", "DE101", "Intermediate", 5, "1 Semester", "FACIL_02", "Open", "DS301"),
        ("RES_13", "Human-Robot Interaction & Intent Recognition", "Using computer vision and gesture analysis for collaborative assembly tasks.", "Robotics", "Prof. David Kova", "Mechanical Eng", "Robotics & Embedded Systems|Computer Vision|Human-Computer Interaction", "ROB201", "Intermediate", 4, "1 Semester", "FACIL_05", "Open", "ROB201"),
        ("RES_14", "Privacy-Preserving Federated Learning for Hospital Data", "Training shared diagnostic models across hospital networks without centralized data pooling.", "AI & Security", "Prof. Marcus Lin", "Computer Science", "Deep Learning|Cybersecurity Basics|Python", "AI301", "Advanced", 6, "1 Year", "FACIL_01", "Open", "AI301|CYB201"),
        ("RES_15", "Quantum Circuit Optimization for Variational Algorithms", "Reducing gate depth and noise error in VQE quantum chemical simulations.", "Quantum Information", "Prof. Richard Feynman-Lee", "Physics", "Quantum Computing Basics|Linear Algebra|Python", "PHYS201", "Advanced", 5, "2 Semesters", "FACIL_07", "Open", "PHYS201"),
        ("RES_16", "Interactive User Interfaces for Explainable AI (XAI)", "Designing visual analytics dashboards that communicate model uncertainty to non-expert users.", "HCI & AI", "Prof. Sarah Jenkins", "Design & CS", "UI/UX Design|Human-Computer Interaction|Data Visualization|Next.js & React", "DES201", "Intermediate", 4, "1 Semester", "FACIL_04", "Open", "DES201|CS310"),
        ("RES_17", "Generative AI Code Synthesis & Vulnerability Analysis", "Evaluating security vulnerabilities introduced by LLM-generated code snippets in production.", "Software Engineering & Security", "Prof. Alan Turing-Smith", "Computer Science", "Generative AI|Cybersecurity Basics|Python|FastAPI", "AI303|CS400", "Advanced", 5, "1 Semester", "FACIL_06", "Open", "AI402|CYB201"),
        ("RES_18", "Urban Micro-Climate Modeling via IoT Sensor Networks", "Deploying sensor arrays to model heat islands and energy consumption in campus quadrangles.", "Environmental Data Science", "Prof. Clara Moreau", "Environmental Sci", "Data Analysis|Python|Data Visualization", "DS101", "Intermediate", 4, "1 Semester", "FACIL_03", "Open", "DS450"),
        ("RES_19", "Causal Inference Methods for Educational Interventions", "Using observational student pathway data to infer the causal impact of mentorship on graduation.", "Data Science & Education", "Prof. Victor Sterling", "Data Science", "Probability & Statistics|Data Analysis|Python", "DS202", "Intermediate", 4, "1 Semester", "FACIL_04", "Open", "DS202|MATH301"),
        ("RES_20", "Large-Scale Graph Neural Networks for Drug Discovery", "Accelerating small-molecule screening using PyTorch Geometric on GPU clusters.", "Bioinformatics & AI", "Prof. Marcus Lin", "Computer Science", "Deep Learning|Bioinformatics|Python", "AI301|BIO210", "Advanced", 6, "1 Year", "FACIL_01", "Open", "AI301|BIO210"),
        ("RES_21", "Speech Recognition & NLP for Low-Resource Languages", "Building multilingual speech-to-text models using cross-lingual transfer learning.", "NLP", "Prof. Elena Vance", "Computer Science", "Natural Language Processing|Deep Learning|Python", "AI303", "Advanced", 5, "1 Semester", "FACIL_02", "Open", "AI303"),
        ("RES_22", "High-Throughput Algorithmic Execution in Crypto Markets", "Analyzing liquidity dynamics and order slippage in decentralized automated market makers (AMMs).", "Fintech", "Prof. Victor Sterling", "Finance", "Quantitative Finance|Backend Architecture|Python", "FIN201", "Intermediate", 4, "1 Semester", "FACIL_04", "Open", "FIN201"),
        ("RES_23", "3D Gaussian Splatting for Fast Scene Reconstruction", "Reconstructing photorealistic 3D campus spaces from smartphone video capture.", "Computer Vision", "Prof. Aris Thorne", "Computer Science", "Computer Vision|Deep Learning|Python", "AI302", "Advanced", 6, "1 Year", "FACIL_01", "Open", "AI302"),
        ("RES_24", "Automated Cap Table & Valuation Modeling for Tech Ventures", "Creating algorithmic forecasting models for early-stage startup dilution.", "Entrepreneurship", "Prof. Sarah Jenkins", "Business", "Entrepreneurship|Product Management|Data Analysis", "BUS201", "Intermediate", 3, "1 Semester", "FACIL_04", "Open", "BUS201"),
        ("RES_25", "Hardware-Security Side-Channel Attack Mitigation", "Measuring electromagnetic radiation from processors to prevent cryptographic key extraction.", "Hardware Security", "Prof. David Kova", "Electrical Eng", "Cybersecurity Basics|Robotics & Embedded Systems|Signal Processing", "CS400", "Advanced", 5, "1 Semester", "FACIL_05", "Open", "CS400"),
        ("RES_26", "Event-Driven Microservices Benchmarking on Cloud", "Comparing latency overhead of FastAPI, Rust, and Go backends under heavy load.", "Software Engineering", "Prof. Alan Turing-Smith", "Computer Science", "FastAPI|Docker & Containers|Backend Architecture", "CS310", "Intermediate", 4, "1 Semester", "FACIL_06", "Open", "CS340"),
        ("RES_27", "Multi-Modal Sentiment Analysis in Video Lectures", "Fusing audio, facial expression, and transcript text for automated student engagement scoring.", "AI & Education", "Prof. Marcus Lin", "Computer Science", "Natural Language Processing|Computer Vision|Deep Learning", "AI302|AI303", "Advanced", 5, "1 Semester", "FACIL_01", "Open", "AI302|AI303"),
        ("RES_28", "Autonomous Drone Swarm Communication Protocols", "Developing decentralized ad-hoc mesh networking for drone flock formation.", "Robotics", "Prof. David Kova", "Electrical Eng", "Robotics & Embedded Systems|Algorithm Design|Networking", "ROB201", "Advanced", 6, "1 Year", "FACIL_05", "Open", "ROB301"),
        ("RES_29", "Databricks Delta Sharing for Open Academic Data", "Building secure zero-copy data exchange pipelines across university research consortia.", "Data Engineering", "Prof. Elena Vance", "Computer Science", "Databricks Unity Catalog|Spark & Distributed Data|Cloud Data Pipelines", "DE101", "Intermediate", 4, "1 Semester", "FACIL_02", "Open", "DE101"),
        ("RES_30", "LLM-Powered Interactive Coding Tutor Evaluation", "Measuring learning outcomes when students pair-program with agentic AI feedback tools.", "AI & Education", "Prof. Sarah Jenkins", "Computer Science", "Generative AI|Natural Language Processing|Human-Computer Interaction", "AI402", "Intermediate", 4, "1 Semester", "FACIL_04", "Open", "AI402|CS101")
    ]

    with open(os.path.join(DATA_DIR, 'research_projects.csv'), 'w', newline='') as f:
        writer = csv.writer(f)
        writer.writerow(['research_id', 'title', 'description', 'domain', 'faculty', 'department', 'skills', 'prerequisites', 'difficulty', 'hours_per_week', 'duration', 'lab', 'availability', 'related_courses'])
        writer.writerows(research_projects)

    # 6. OPPORTUNITIES (30+)
    opportunities = [
        # Internships / Fellowships / Competitions
        ("OPP_01", "Databricks Summer AI & Data Engineering Fellowship", "Industry Fellowship", "Databricks University Team", "3-month paid summer fellowship building GenAI pipelines and Delta Lake architectures.", "Databricks Unity Catalog|Python|Generative AI|SQL & Relational DBs", "Junior or Senior status", "DE101|AI201", 10, "12 weeks summer", "2026-11-30", "San Francisco, CA / Remote", "AI Engineering|Data Engineering"),
        ("OPP_02", "OpenAI Undergraduate Research Residency", "Fellowship", "OpenAI Institute", "Mentored research position working directly with OpenAI scientists on alignment and reasoning.", "Deep Learning|Generative AI|Python|Research Methods", "Proven AI research experience", "AI301|AI303", 15, "6 months", "2026-11-15", "San Francisco, CA", "AI Research|Machine Learning"),
        ("OPP_03", "Google Summer of Code (GSoC) Developer", "Industry Program", "Google / Open Source Org", "Paid global program writing code for major open-source software organizations.", "Python|TypeScript|Git & GitHub|Docker & Containers", "Enrolled student", "CS101|CS102", 20, "12 weeks", "2027-01-15", "Remote", "Software Engineering|Open Source"),
        ("OPP_04", "Meta AI Computer Vision Internship", "Internship", "Meta Reality Labs", "Build next-generation perception and 3D reconstruction models for AR/VR hardware.", "Computer Vision|Deep Learning|Python", "Enrolled CS/ECE student", "AI302", 40, "12 weeks summer", "2026-12-01", "Menlo Park, CA", "Computer Vision|AI Engineering"),
        ("OPP_05", "National Science Foundation (NSF) REU Fellowship", "Scholarship", "NSF / University AI Lab", "Paid summer undergraduate research experience in autonomous robotics and AI safety.", "Research Methods|Technical Writing|Python|Public Speaking", "US Citizen / Permanent Resident", "None", 35, "10 weeks", "2027-01-30", "On-Campus Lab", "Academic Research|Robotics"),
        ("OPP_06", "Campus Student Startup Seed Grant ($25,000)", "Startup Program", "Campus Venture Fund", "Non-dilutive seed capital, office space, and mentor network for promising student founders.", "Entrepreneurship|Venture Pitching|Leadership|Product Management", "Active student team", "BUS101", 10, "1 Academic Year", "2026-10-31", "Campus Innovation Hub", "Entrepreneurship|Venture Capital"),
        ("OPP_07", "Goldman Sachs Quantitative Engineering Internship", "Internship", "Goldman Sachs Technology", "Develop high-frequency trading models and risk analysis systems on distributed clusters.", "Quantitative Finance|Probability & Statistics|Python|SQL & Relational DBs", "Strong math/CS background", "FIN201|DS202", 40, "10 weeks summer", "2026-11-01", "New York, NY", "Quantitative Finance|Fintech"),
        ("OPP_08", "Microsoft Quantum Computing Summer Internship", "Internship", "Microsoft Quantum", "Implement quantum algorithms and error mitigation on Azure Quantum simulation hardware.", "Quantum Computing Basics|Linear Algebra|Python", "Physics or CS major", "PHYS201", 40, "12 weeks summer", "2026-12-15", "Redmond, WA", "Quantum Computing|Physics"),
        ("OPP_09", "Tesla Autopilot Perception Software Internship", "Internship", "Tesla Motors", "Work on real-time neural network inference and camera perception for self-driving vehicles.", "Computer Vision|Deep Learning|C++|Python", "Senior or Grad student", "AI302|ROB301", 40, "12 weeks", "2026-11-20", "Palo Alto, CA", "Autonomous Vehicles|Robotics"),
        ("OPP_10", "Databricks Hackathon Challenge Winner Prize", "Competition", "Databricks & Campus AI Club", "$5,000 cash prize and guaranteed final round interview for Databricks engineering.", "Databricks Unity Catalog|Generative AI|FastAPI|Next.js & React", "Participate in EVT_01", "AI101", 5, "1 Weekend", "2026-10-15", "Campus Innovation Center", "AI Engineering|Software Engineering"),
        
        # Add 20 more opportunities to reach 30+ total
        ("OPP_11", "Apple Software Engineering Internship (iOS/Full-Stack)", "Internship", "Apple Inc.", "Develop customer-facing features for Apple platforms using Swift, TypeScript, and modern APIs.", "TypeScript|Next.js & React|Backend Architecture", "Enrolled CS student", "CS310", 40, "12 weeks summer", "2026-12-05", "Cupertino, CA", "Software Engineering"),
        ("OPP_12", "NVIDIA Deep Learning Institute Fellowship", "Fellowship", "NVIDIA Developer Program", "Access to GPU clusters, hands-on CUDA training, and mentorship from NVIDIA AI scientists.", "Deep Learning|Python|Algorithm Design", "AI background", "AI301", 10, "6 months", "2026-11-10", "Remote", "AI Engineering|High-Performance Computing"),
        ("OPP_13", "Amazon Web Services (AWS) Cloud Architecture Internship", "Internship", "Amazon.com", "Architect resilient cloud infrastructures, microservices, and automated CI/CD pipelines.", "Cloud Computing (AWS/Azure)|Docker & Containers|DevOps & CI/CD", "CS/DE student", "CS320", 40, "12 weeks", "2026-11-25", "Seattle, WA", "Cloud Engineering|DevOps"),
        ("OPP_14", "DeepMind AI Safety Research Grant", "Grant", "Google DeepMind", "Funding for student-led research on LLM alignment, RLHF, and red-teaming.", "Ethics in AI|Generative AI|Research Methods", "Proposal submission", "ETH301|AI303", 8, "1 Academic Year", "2026-12-20", "On-Campus / Remote", "AI Research|AI Safety"),
        ("OPP_15", "Palantir Forward Deployed Software Engineer Internship", "Internship", "Palantir Technologies", "Deploy big data analytics platforms to solve complex operational challenges for enterprise clients.", "SQL & Relational DBs|Python|Data Analysis|Public Speaking", "CS or Data Science major", "CS205|DE101", 40, "12 weeks", "2026-11-12", "Denver, CO", "Data Engineering|Solutions Engineering"),
        ("OPP_16", "Scale AI Data Annotation & ML Engineering Internship", "Internship", "Scale AI", "Build data pipelines, quality evaluation benchmarks, and active learning loops for LLMs.", "Machine Learning|Python|Data Analysis", "CS student", "AI201", 40, "12 weeks", "2026-12-10", "San Francisco, CA", "AI Engineering|Data Engineering"),
        ("OPP_17", "Y Combinator Founder Fellowship (Summer Cohort)", "Startup Program", "Y Combinator", "$500k investment for accepted student startup teams to build and launch their venture.", "Entrepreneurship|Venture Pitching|Product Management|Leadership", "Working MVP", "BUS101|BUS202", 50, "3 months", "2027-03-01", "San Francisco, CA", "Entrepreneurship|Venture Capital"),
        ("OPP_18", "Jane Street Quantitative Research Internship", "Internship", "Jane Street Capital", "Apply mathematical modeling, machine learning, and probability theory to competitive financial markets.", "Quantitative Finance|Probability & Statistics|Linear Algebra|Problem Solving", "Top math/CS student", "MATH201|FIN201", 40, "10 weeks", "2026-10-30", "New York, NY", "Quantitative Research|Finance"),
        ("OPP_19", "CERN Summer Student Programme", "International Program", "CERN Switzerland", "Spend the summer in Geneva working on large-scale distributed computing for particle physics.", "Spark & Distributed Data|Python|Docker & Containers", "Enrolled Physics/CS student", "DS301|CS102", 40, "9 weeks", "2027-01-31", "Geneva, Switzerland", "High Energy Physics|Distributed Systems"),
        ("OPP_20", "Stripe Full-Stack Web Engineering Internship", "Internship", "Stripe", "Build global financial infrastructure, payment APIs, and developer dashboards.", "Next.js & React|TypeScript|FastAPI|Backend Architecture", "CS student", "CS310", 40, "12 weeks", "2026-11-18", "San Francisco, CA", "Software Engineering"),
        ("OPP_21", "Undergraduate Teaching Assistantship (CS101 / AI101)", "Campus Job", "Department of Computer Science", "Hold office hours, grade coding assignments, and mentor junior students in Python & AI.", "Python|Public Speaking|Leadership|Problem Solving", "Grade A in target course", "CS101|AI101", 8, "1 Semester", "2026-08-25", "CS Department", "Academic Teaching|Mentorship"),
        ("OPP_22", "Bioinformatics Research Fellowship at Broad Institute", "Fellowship", "Broad Institute of MIT and Harvard", "Apply machine learning to single-cell RNA sequencing datasets.", "Bioinformatics|Python|Machine Learning", "Bio/CS interdisciplinary background", "BIO210|AI201", 35, "10 weeks", "2027-01-10", "Cambridge, MA", "Bioinformatics|Genomics"),
        ("OPP_23", "Cybersecurity Red Team Internship at CrowdStrike", "Internship", "CrowdStrike", "Conduct threat hunting, malware reverse engineering, and cloud security audits.", "Cybersecurity Basics|Python|Problem Solving", "Cybersecurity background", "CS400|CYB201", 40, "12 weeks", "2026-12-01", "Austin, TX / Remote", "Cybersecurity"),
        ("OPP_24", "Figma UI/UX Product Design Internship", "Internship", "Figma", "Design new canvas tools, interactive component features, and design system templates.", "UI/UX Design|Human-Computer Interaction|Data Visualization", "Portfolio submission", "DES101|DES201", 40, "12 weeks", "2026-11-28", "San Francisco, CA", "Product Design|UI/UX"),
        ("OPP_25", "CleanTech Venture Accelerator Grant ($10,000)", "Grant", "CleanEnergy Foundation", "Funding for campus clean energy IoT hardware startups.", "Entrepreneurship|Robotics & Embedded Systems|Data Analysis", "CleanTech focus", "CLUB_20", 10, "6 months", "2026-11-15", "Campus Innovation Center", "CleanTech|Sustainability"),
        ("OPP_26", "Robotics Autonomy Fellowship at Boston Dynamics", "Fellowship", "Boston Dynamics", "Develop perception and balance control algorithms for legged robots.", "Robotics & Embedded Systems|Computer Vision|Edge Computing", "Robotics student", "ROB201|ROB301", 40, "12 weeks", "2026-12-08", "Waltham, MA", "Robotics"),
        ("OPP_27", "ACM Student Research Competition (SRC) Finalist", "Competition", "Association for Computing Machinery", "Present undergraduate research poster at international ACM conference with published proceedings.", "Research Methods|Public Speaking|Technical Writing", "Accepted research poster", "ENG101|RES_01", 5, "1 Conference", "2026-10-01", "Varies / International", "Academic Research"),
        ("OPP_28", "Databricks Delta Lake Open Source Contributor Grant", "Grant", "Databricks Community", "Paid grant to contribute core features or integrations to Delta Lake open-source repo.", "Databricks Unity Catalog|Spark & Distributed Data|Git & GitHub", "Demonstrated git skills", "DE101|CLUB_12", 10, "3 months", "2026-11-05", "Remote", "Open Source|Data Engineering"),
        ("OPP_29", "Ethics in AI Policy Student Fellowship", "Fellowship", "Stanford HAI / Campus Ethics Center", "Publish policy briefs on AI transparency regulations for congressional staffers.", "Ethics in AI|Technical Writing|Public Speaking", "Humanities/CS background", "ETH301", 10, "1 Academic Year", "2026-11-30", "Washington, DC / Remote", "AI Policy|Ethics"),
        ("OPP_30", "Product Management Associate Program Internship", "Internship", "Uber Product Team", "Lead cross-functional engineering and design sprints for new rider features.", "Product Management|Data Analysis|UI/UX Design|Public Speaking", "Enrolled Junior", "BUS202", 40, "12 weeks", "2026-11-15", "San Francisco, CA", "Product Management")
    ]

    with open(os.path.join(DATA_DIR, 'opportunities.csv'), 'w', newline='') as f:
        writer = csv.writer(f)
        writer.writerow(['opportunity_id', 'title', 'type', 'organization', 'description', 'skills', 'eligibility', 'prerequisites', 'hours_per_week', 'duration', 'deadline', 'location', 'career_domains'])
        writer.writerows(opportunities)

    # 7. FACILITIES (15+)
    facilities = [
        ("FACIL_01", "Campus Artificial Intelligence Research Lab", "Research Facility", "High-performance GPU cluster lab with 64x NVIDIA A100 GPUs for deep learning research.", "Computer Science Building 4th Floor", "24/7 Access for approved researchers", "NVIDIA A100 GPUs|PyTorch Cluster|High-speed InfiniBand", "Deep Learning|Computer Vision|Natural Language Processing|Python", "AI301|AI302|AI303", "CLUB_01", "RES_01|RES_03|RES_04|RES_11|RES_14|RES_20"),
        ("FACIL_02", "Databricks & Data Engineering Innovation Center", "Data Hub", "Dedicated center for distributed data processing, Delta Lake streaming, and Databricks Genie experimentation.", "Data Science Building Room 201", "08:00 - 22:00 Daily", "Databricks Workspace Access|Spark Cluster|Interactive Touch Displays", "Databricks Unity Catalog|Spark & Distributed Data|SQL & Relational DBs", "DE101|DS301", "CLUB_03", "RES_02|RES_06|RES_12|RES_29"),
        ("FACIL_03", "Interdisciplinary Biotechnology & Genomics Center", "Biological Lab", "DNA sequencers, fluorescence microscopes, and high-throughput compute nodes.", "Biotech Complex Building B", "09:00 - 20:00 Weekdays", "Illumina Sequencers|Bioinformatics Workstations|Clean Room", "Bioinformatics|Data Analysis|Python", "BIO210", "CLUB_14", "RES_09|RES_18"),
        ("FACIL_04", "Quantitative Finance & Financial Technology Hub", "Finance Lab", "Dual-monitor trading terminals with Bloomberg Professional and real-time exchange data feeds.", "Business School 3rd Floor", "07:30 - 21:00 Weekdays", "Bloomberg Terminals|Refinitiv Eikon|Python Quant Libraries", "Quantitative Finance|Probability & Statistics|Python", "FIN201", "CLUB_11", "RES_05|RES_08|RES_16|RES_19|RES_22|RES_24|RES_30"),
        ("FACIL_05", "Robotics, Autonomy & Hardware Makerspace", "Robotics Lab", "3D printers, laser cutters, soldering stations, motion capture arena, and drone test cage.", "Engineering Quad Building 1", "24/7 Keycard Access", "OptiTrack Motion Capture|CNC Mill|3D Printers|Oscilloscopes", "Robotics & Embedded Systems|Edge Computing|C++", "ROB201|ROB301", "CLUB_04", "RES_07|RES_13|RES_25|RES_28"),
        ("FACIL_06", "Cybersecurity & Network Operations Security Center", "Cyber Lab", "Isolated network testing lab with hardware firewalls and air-gapped target virtual machines.", "Computer Science Building Basement", "08:00 - 23:00 Daily", "Air-gapped Cyber Range|Wireshark Hardware Probes|Blade Servers", "Cybersecurity Basics|Python|FastAPI", "CS400|CYB201|CYB301", "CLUB_07", "RES_10|RES_17|RES_26"),
        ("FACIL_07", "Quantum Computing & Advanced Physics Simulator Lab", "Physics Lab", "Cryogenic hardware interface and quantum circuit simulation workstation cluster.", "Physics Hall Room 105", "09:00 - 19:00 Weekdays", "Qiskit Quantum Workstations|Dilution Refrigerator Interface", "Quantum Computing Basics|Linear Algebra", "PHYS201", "CLUB_17", "RES_15"),
        ("FACIL_08", "Human-Computer Interaction & Usability Lab", "Design Studio", "Eye-tracking headsets, one-way observation mirrors, and mobile device usability testing rigs.", "Design Center 2nd Floor", "09:00 - 18:00 Weekdays", "Tobii Eye Trackers|Figma Pro Workstations|User Testing Sound Booth", "UI/UX Design|Human-Computer Interaction|Data Visualization", "DES101|DES201", "CLUB_08", "RES_16"),
        ("FACIL_09", "Student Startup Incubation Hub", "Co-Working Space", "Open co-working desks, private pitch presentation rooms, and prototype display area.", "Student Union Annex 3rd Floor", "24/7 Access", "Pitch Presentation Displays|Podcasting Studio|Mentor Meeting Rooms", "Entrepreneurship|Venture Pitching|Product Management", "BUS101|BUS202", "CLUB_05", "RES_24"),
        ("FACIL_10", "Main University Science & Engineering Library", "Study & Resource Hub", "Quiet study zones, research literature databases, and high-speed scanner stations.", "Central Campus Library", "24/7 Daily", "ArXiv / IEEE Full Text Access|Quiet Study Pods|Bookable Team Rooms", "Research Methods|Technical Writing|Public Speaking", "ENG101|ENG201", "CLUB_09", "RES_01|RES_02"),
        ("FACIL_11", "Cloud DevOps & Distributed Systems Lab", "Server Room", "Rack-mounted servers for hosting student web services and Kubernetes test clusters.", "CS Building Room 302", "08:00 - 22:00 Daily", "Dell PowerEdge Rack Servers|10Gbps Ethernet Switch", "Docker & Containers|DevOps & CI/CD|Backend Architecture", "CS320|CS340", "CLUB_13", "RES_26"),
        ("FACIL_12", "Open Source Software Community Lounge", "Collaboration Space", "Casual lounge with whiteboards, beanbags, and monitor stations for pair programming.", "Student Center 2nd Floor", "08:00 - 24:00 Daily", "Dual Monitor Workstations|Whiteboard Walls|Free Coffee", "Git & GitHub|Python|TypeScript", "CS101|CS310", "CLUB_12", "RES_26"),
        ("FACIL_13", "Clean Energy & Environmental IoT Field Station", "Field Station", "Rooftop solar monitoring array and weather sensor stations connected via LoRaWAN.", "Environmental Science Roof", "08:00 - 18:00 Weekdays", "LoRaWAN Gateway|Solar Pyranometers|Weather Stations", "Data Analysis|Python|Robotics & Embedded Systems", "DS450", "CLUB_20", "RES_18"),
        ("FACIL_14", "Toastmasters Speech & Media Recording Studio", "Media Studio", "Acoustic treated studio with teleprompter and high-definition video recording cameras.", "Student Center Room 104", "09:00 - 20:00 Weekdays", "Teleprompter|4K Cameras|Studio Lighting", "Public Speaking|Leadership", "ENG201", "CLUB_19", "None"),
        ("FACIL_15", "Competitive Coding Arena", "Computer Lab", "Dual-screen computers loaded with competitive programming IDEs and offline documentation.", "CS Building Room 101", "08:00 - 23:00 Daily", "High Refresh Rate Monitors|Mechanical Keyboards|Local Judge Server", "Algorithm Design|Competitive Programming|Problem Solving", "CS102", "CLUB_02", "None")
    ]

    with open(os.path.join(DATA_DIR, 'facilities.csv'), 'w', newline='') as f:
        writer = csv.writer(f)
        writer.writerow(['facility_id', 'name', 'type', 'description', 'location', 'available_hours', 'equipment', 'skills_supported', 'related_courses', 'related_clubs', 'related_research'])
        writer.writerows(facilities)

    # 8. CITY EVENTS (30+)
    city_events = [
        ("CITY_01", "Metro Tech Summit 2026", "Conference", "Annual city tech conference featuring keynotes from industry CTOs and startup founders.", "2026-10-22", "Downtown Convention Center", "Public Speaking|Networking|Leadership", "Metro Tech Council", 2.5, "https://metrotechsummit.example.com"),
        ("CITY_02", "City AI & ML Developer Meetup", "Meetup", "Monthly informal gathering for local machine learning engineers and researchers.", "2026-09-18", "TechHub Downtown Coworking", "Machine Learning|Python|Generative AI", "City AI Group", 3.0, "https://cityaimeetup.example.com"),
        ("CITY_03", "Downtown Civic Hackathon: Open Data Challenge", "Hackathon", "36-hour hackathon utilizing city open data to improve public transit and urban sustainability.", "2026-10-09", "City Hall Innovation Lab", "Data Analysis|Python|Next.js & React|SQL & Relational DBs", "City Digital Office", 1.8, "https://civichack.example.com"),
        ("CITY_04", "Databricks User Group Regional Meetup", "Meetup", "Local Databricks community meetup presenting real-world Delta Lake case studies.", "2026-10-04", "Databricks Regional Office", "Databricks Unity Catalog|Spark & Distributed Data|SQL & Relational DBs", "Databricks Community", 4.2, "https://databricksusergroup.example.com"),
        ("CITY_05", "Venture Capital & Angel Investor Showcase", "Career Event", "Pitching event matching local tech startups with accredited angel investors.", "2026-11-12", "Financial District Club", "Venture Pitching|Entrepreneurship|Networking", "Metro Angels Network", 3.5, "https://metroangels.example.com"),
        ("CITY_06", "Cybersecurity Professionals Networking Night", "Networking Event", "After-hours mixer for CISOs, security analysts, and aspiring ethical hackers.", "2026-09-29", "The Speakeasy Lounge Downtown", "Cybersecurity Basics|Networking", "ISSA Local Chapter", 2.8, "https://issacity.example.com"),
        ("CITY_07", "Python Developer Guild Monthly Workshop", "Meetup", "Hands-on coding session covering async FastAPI and Python 3.12 features.", "2026-10-13", "Innovation Warehouse", "Python|FastAPI|Backend Architecture", "Python Guild", 2.0, "https://pythonguildcity.example.com"),
        ("CITY_08", "UI/UX Product Design Expo", "Conference", "Showcasing modern design systems, accessibility tools, and interactive prototypes.", "2026-10-27", "Design Museum Gallery", "UI/UX Design|Human-Computer Interaction", "Designers Guild", 1.5, "https://uxdesignexpo.example.com"),
        ("CITY_09", "CleanTech Innovation Pitch Forum", "Innovation Event", "Presenting renewable energy prototypes to municipal sustainability leaders.", "2026-11-03", "Green Energy Building", "Entrepreneurship|Data Visualization", "CleanTech Metro", 4.0, "https://cleantechmetro.example.com"),
        ("CITY_10", "Women in Data Science (WiDS) Regional Conference", "Conference", "Inspiring conference featuring women leaders in data science, AI, and analytics.", "2026-10-16", "University Grand Ballroom", "Data Analysis|Machine Learning|Leadership|Networking", "WiDS Ambassador Team", 0.5, "https://widscity.example.com"),
        
        # Add 20 more city events to reach 30+ total
        ("CITY_11", "Full-Stack JavaScript & React User Group", "Meetup", "Discussions on Next.js 15 Server Actions, Tailwind CSS, and TypeScript performance.", "2026-09-22", "Dev Space Downtown", "Next.js & React|TypeScript|UI/UX Design", "JS User Group", 2.5, "https://jsmeetup.example.com"),
        ("CITY_12", "Robotics & Hardware Engineers Demo Night", "Tech Talk", "Show-and-tell event for custom 3D printed bots, autonomous rovers, and IoT gear.", "2026-10-07", "Makerspace Downtown", "Robotics & Embedded Systems|Edge Computing", "Hardware Guild", 3.2, "https://hardwaremeetup.example.com"),
        ("CITY_13", "Fintech & Algorithmic Trading Symposium", "Conference", "Panel sessions on AI quantitative models, high-frequency execution, and crypto regulation.", "2026-11-09", "Bank Tower Auditorium", "Quantitative Finance|Probability & Statistics", "Fintech Forum", 2.1, "https://fintechsymposium.example.com"),
        ("CITY_14", "Open Source Software Hack-and-Tell", "Meetup", "5-minute lightning demos of open source tools created by local developers.", "2026-10-19", "Local Brewery Taproom", "Git & GitHub|Python|TypeScript", "Open Source City", 3.0, "https://hackandtell.example.com"),
        ("CITY_15", "Quantum Computing Industry Summit", "Conference", "Exploring commercial quantum hardware readiness with IBM, Google, and Microsoft speakers.", "2026-11-18", "Tech Park Auditorium", "Quantum Computing Basics|Linear Algebra", "Quantum Council", 5.0, "https://quantumsummit.example.com"),
        ("CITY_16", "Generative AI Hackathon: Building with Agents", "Hackathon", "24-hour citywide hackathon creating autonomous AI agents for real business tasks.", "2026-10-24", "Scale Up Incubator", "Generative AI|Natural Language Processing|Python|FastAPI", "AI Hackers Guild", 2.2, "https://genaihackathon.example.com"),
        ("CITY_17", "Game Developers Expo & Indie Showcase", "Exhibition", "Playtest indie video games built by regional studio developers.", "2026-11-14", "Indie Arcade Center", "UI/UX Design|Algorithm Design", "Game Dev Alliance", 4.5, "https://gamedevcity.example.com"),
        ("CITY_18", "BioTech & Digital Health Investor Forum", "Conference", "Connecting computational biology startups with healthcare venture funds.", "2026-11-06", "Medical Research Center", "Bioinformatics|Venture Pitching", "BioHealth Capital", 3.8, "https://biohealthforum.example.com"),
        ("CITY_19", "DevOps & Cloud Native Meetup", "Meetup", "Sessions on Kubernetes multi-cloud management, Terraform, and Prometheus monitoring.", "2026-10-01", "Cloud Office 4th Floor", "Docker & Containers|DevOps & CI/CD|Cloud Computing (AWS/Azure)", "DevOps Community", 2.7, "https://devopsmeetup.example.com"),
        ("CITY_20", "AI Ethics & Public Policy Roundtable", "Seminar", "Discussion with city council members on algorithmic transparency in municipal hiring.", "2026-10-29", "City Library Main Branch", "Ethics in AI|Public Speaking", "Ethics Forum", 1.2, "https://aiethicsroundtable.example.com"),
        ("CITY_21", "Product Management Breakfast Club", "Networking Event", "Casual morning coffee for PMs discussing roadmaps, OKRs, and metric dashboards.", "2026-09-25", "Coffee Roasters Main St", "Product Management|Networking", "Product Club", 1.9, "https://pmbreakfast.example.com"),
        ("CITY_22", "High-Performance Computing & GPU Architecture Workshop", "Workshop", "Optimizing CUDA C++ code for enterprise NVIDIA GPU clusters.", "2026-11-02", "Supercomputing Center", "Algorithm Design|Problem Solving", "HPC User Group", 3.0, "https://hpcworkshop.example.com"),
        ("CITY_23", "Startup Legal & Cap Table Workshop", "Workshop", "Law firm partners explaining IP assignment, SAFEs, and cap table management.", "2026-10-15", "Incubator Hub Room 101", "Entrepreneurship|Leadership", "Startup Legal Guild", 2.0, "https://startuplegal.example.com"),
        ("CITY_24", "Spatial Data Science & GIS Mapping Night", "Tech Talk", "Visualizing urban mobility and satellite imagery using Python spatial libraries.", "2026-10-08", "Urban Planning Office", "Data Analysis|Python|Data Visualization", "GIS User Group", 2.3, "https://spatialdatascience.example.com"),
        ("CITY_25", "Toastmasters City Speech Contest", "Competition", "Regional public speaking competition featuring district champion speakers.", "2026-11-10", "Civic Center Theater", "Public Speaking|Leadership", "Toastmasters District", 3.1, "https://toastmastersdistrict.example.com"),
        ("CITY_26", "Open Robotics Hardware Exchange", "Meetup", "Swap electronic parts, motor drivers, and microcontrollers with local robotics makers.", "2026-10-17", "Community Workshop Hub", "Robotics & Embedded Systems|Edge Computing", "Robotics Exchange", 4.0, "https://roboticsexchange.example.com"),
        ("CITY_27", "Data Engineering Career Fair", "Career Fair", "Meet hiring managers for Data Engineer, Databricks Architect, and ETL Developer roles.", "2026-09-30", "Downtown Hotel Expo Center", "Databricks Unity Catalog|Spark & Distributed Data|SQL & Relational DBs|Networking", "Data Career Network", 2.0, "https://datacareerfair.example.com"),
        ("CITY_28", "Women in AI Hackathon & Pitch Competition", "Hackathon", "All-female team hackathon building AI solutions for social impact.", "2026-11-07", "Innovation Hub", "Machine Learning|Python|Public Speaking|Teamwork & Collaboration", "Women in AI Org", 2.0, "https://womeninaihack.example.com"),
        ("CITY_29", "Edge Computing & 5G IoT Summit", "Conference", "Panel discussions on real-time video analytics deployed on 5G edge towers.", "2026-11-16", "Telecom Plaza", "Edge Computing|Computer Vision|Signal Processing", "Telecom Innovation", 3.5, "https://edgeiotsummit.example.com"),
        ("CITY_30", "Angel Pitch Night & Demo Day", "Exhibition", "10 selected regional startups present 5-minute pitches to venture capital partners.", "2026-11-20", "Grand Hotel Ballroom", "Venture Pitching|Entrepreneurship|Public Speaking", "Angel Network", 2.5, "https://angelpitchnight.example.com")
    ]

    with open(os.path.join(DATA_DIR, 'city_events.csv'), 'w', newline='') as f:
        writer = csv.writer(f)
        writer.writerow(['city_event_id', 'name', 'type', 'description', 'date', 'location', 'skills', 'organization', 'distance_from_campus', 'registration_url'])
        writer.writerows(city_events)

    # 9. RELATIONSHIPS (Connected Graph Edges)
    relationships = []
    rel_id = 1

    # Courses teach skills
    course_skills_map = [
        ("CS101", ["SKILL_01", "SKILL_27"]),
        ("CS102", ["SKILL_37", "SKILL_27"]),
        ("AI101", ["SKILL_01", "SKILL_02", "SKILL_37"]),
        ("AI201", ["SKILL_01", "SKILL_02", "SKILL_07", "SKILL_35"]),
        ("AI301", ["SKILL_03", "SKILL_01", "SKILL_34", "SKILL_36"]),
        ("AI302", ["SKILL_04", "SKILL_03", "SKILL_01"]),
        ("AI303", ["SKILL_05", "SKILL_32", "SKILL_03", "SKILL_01"]),
        ("AI401", ["SKILL_31", "SKILL_01", "SKILL_35"]),
        ("CS205", ["SKILL_06", "SKILL_39"]),
        ("CS310", ["SKILL_09", "SKILL_10", "SKILL_08", "SKILL_20"]),
        ("CS320", ["SKILL_11", "SKILL_33", "SKILL_16"]),
        ("CS400", ["SKILL_15", "SKILL_27"]),
        ("DE101", ["SKILL_13", "SKILL_14", "SKILL_06", "SKILL_01"]),
        ("DS202", ["SKILL_35", "SKILL_07", "SKILL_01"]),
        ("MATH201", ["SKILL_34"]),
        ("MATH202", ["SKILL_36"]),
        ("ROB201", ["SKILL_17", "SKILL_27"]),
        ("ROB301", ["SKILL_49", "SKILL_17", "SKILL_04"]),
        ("BUS101", ["SKILL_26", "SKILL_47", "SKILL_23"]),
        ("BUS202", ["SKILL_30", "SKILL_20", "SKILL_24"]),
        ("ETH301", ["SKILL_41", "SKILL_24", "SKILL_21"]),
        ("FIN201", ["SKILL_19", "SKILL_35", "SKILL_01"]),
        ("BIO210", ["SKILL_18", "SKILL_01", "SKILL_07"])
    ]

    for cid, sk_list in course_skills_map:
        for sk in sk_list:
            relationships.append((f"REL_{rel_id:04d}", "COURSE", cid, "TEACHES", "SKILL", sk, 1.0))
            rel_id += 1

    # Course requires Course
    course_prereqs = [
        ("CS102", "CS101"),
        ("AI101", "CS101"),
        ("AI201", "AI101"),
        ("AI301", "AI201"),
        ("AI302", "AI301"),
        ("AI303", "AI301"),
        ("AI401", "AI201"),
        ("CS205", "CS102"),
        ("CS310", "CS101"),
        ("CS320", "CS102"),
        ("DE101", "CS205"),
        ("ROB301", "ROB201")
    ]
    for target, source in course_prereqs:
        relationships.append((f"REL_{rel_id:04d}", "COURSE", target, "REQUIRES", "COURSE", source, 0.9))
        rel_id += 1

    # Club develops Skill
    club_skills = [
        ("CLUB_01", ["SKILL_01", "SKILL_02", "SKILL_03", "SKILL_21"]),
        ("CLUB_02", ["SKILL_37", "SKILL_45", "SKILL_27"]),
        ("CLUB_03", ["SKILL_07", "SKILL_06", "SKILL_01", "SKILL_48"]),
        ("CLUB_04", ["SKILL_17", "SKILL_49", "SKILL_28"]),
        ("CLUB_05", ["SKILL_26", "SKILL_47", "SKILL_23", "SKILL_30"]),
        ("CLUB_07", ["SKILL_15", "SKILL_01", "SKILL_27"]),
        ("CLUB_08", ["SKILL_20", "SKILL_44", "SKILL_48"]),
        ("CLUB_09", ["SKILL_29", "SKILL_24", "SKILL_21"]),
        ("CLUB_11", ["SKILL_19", "SKILL_35", "SKILL_01"]),
        ("CLUB_12", ["SKILL_12", "SKILL_10", "SKILL_01", "SKILL_11"]),
        ("CLUB_13", ["SKILL_11", "SKILL_40", "SKILL_16"]),
        ("CLUB_18", ["SKILL_09", "SKILL_10", "SKILL_08", "SKILL_20"])
    ]
    for clb, sk_list in club_skills:
        for sk in sk_list:
            relationships.append((f"REL_{rel_id:04d}", "CLUB", clb, "DEVELOPS", "SKILL", sk, 0.8))
            rel_id += 1

    # Club organizes Event
    club_events = [
        ("CLUB_01", "EVT_01"),
        ("CLUB_01", "EVT_02"),
        ("CLUB_01", "EVT_05"),
        ("CLUB_02", "EVT_03"),
        ("CLUB_02", "EVT_04"),
        ("CLUB_03", "EVT_06"),
        ("CLUB_03", "EVT_07"),
        ("CLUB_04", "EVT_08"),
        ("CLUB_04", "EVT_09"),
        ("CLUB_05", "EVT_10"),
        ("CLUB_05", "EVT_11"),
        ("CLUB_07", "EVT_13"),
        ("CLUB_08", "EVT_15"),
        ("CLUB_09", "EVT_16"),
        ("CLUB_11", "EVT_20"),
        ("CLUB_18", "EVT_27")
    ]
    for clb, evt in club_events:
        relationships.append((f"REL_{rel_id:04d}", "CLUB", clb, "ORGANIZES", "EVENT", evt, 1.0))
        rel_id += 1

    # Event develops Skill
    event_skills = [
        ("EVT_01", ["SKILL_01", "SKILL_02", "SKILL_32", "SKILL_08", "SKILL_28"]),
        ("EVT_02", ["SKILL_03", "SKILL_01"]),
        ("EVT_03", ["SKILL_37", "SKILL_45"]),
        ("EVT_05", ["SKILL_32", "SKILL_13", "SKILL_05"]),
        ("EVT_06", ["SKILL_06", "SKILL_13", "SKILL_48"]),
        ("EVT_10", ["SKILL_47", "SKILL_26", "SKILL_21"]),
        ("EVT_13", ["SKILL_15", "SKILL_01"]),
        ("EVT_20", ["SKILL_19", "SKILL_35", "SKILL_01"]),
        ("EVT_27", ["SKILL_09", "SKILL_10", "SKILL_08"])
    ]
    for evt, sk_list in event_skills:
        for sk in sk_list:
            relationships.append((f"REL_{rel_id:04d}", "EVENT", evt, "DEVELOPS", "SKILL", sk, 0.7))
            rel_id += 1

    # Research requires Skill / occurs in Facility / follows Course
    research_rel = [
        ("RES_01", "SKILL_04", "REQUIRES", "SKILL"),
        ("RES_01", "SKILL_03", "REQUIRES", "SKILL"),
        ("RES_01", "FACIL_01", "HOSTED_AT", "FACILITY"),
        ("RES_01", "AI302", "PREPARES_FOR", "COURSE"),
        ("RES_02", "SKILL_13", "REQUIRES", "SKILL"),
        ("RES_02", "SKILL_32", "REQUIRES", "SKILL"),
        ("RES_02", "FACIL_02", "HOSTED_AT", "FACILITY"),
        ("RES_02", "DE101", "PREPARES_FOR", "COURSE"),
        ("RES_03", "SKILL_03", "REQUIRES", "SKILL"),
        ("RES_03", "FACIL_01", "HOSTED_AT", "FACILITY"),
        ("RES_04", "SKILL_31", "REQUIRES", "SKILL"),
        ("RES_04", "FACIL_01", "HOSTED_AT", "FACILITY"),
        ("RES_05", "SKILL_41", "REQUIRES", "SKILL"),
        ("RES_05", "FACIL_04", "HOSTED_AT", "FACILITY"),
        ("RES_08", "SKILL_19", "REQUIRES", "SKILL"),
        ("RES_08", "FACIL_04", "HOSTED_AT", "FACILITY")
    ]
    for res, target, rtype, ttype in research_rel:
        relationships.append((f"REL_{rel_id:04d}", "RESEARCH", res, rtype, ttype, target, 0.9))
        rel_id += 1

    # Opportunity requires Skill / follows Course / leads to Career
    opp_rel = [
        ("OPP_01", "SKILL_13", "REQUIRES", "SKILL"),
        ("OPP_01", "SKILL_32", "REQUIRES", "SKILL"),
        ("OPP_01", "DE101", "FOLLOWS_FROM", "COURSE"),
        ("OPP_02", "SKILL_03", "REQUIRES", "SKILL"),
        ("OPP_02", "SKILL_32", "REQUIRES", "SKILL"),
        ("OPP_02", "AI301", "FOLLOWS_FROM", "COURSE"),
        ("OPP_04", "SKILL_04", "REQUIRES", "SKILL"),
        ("OPP_04", "AI302", "FOLLOWS_FROM", "COURSE"),
        ("OPP_06", "SKILL_26", "REQUIRES", "SKILL"),
        ("OPP_06", "BUS101", "FOLLOWS_FROM", "COURSE"),
        ("OPP_07", "SKILL_19", "REQUIRES", "SKILL"),
        ("OPP_07", "FIN201", "FOLLOWS_FROM", "COURSE"),
        ("OPP_10", "SKILL_32", "REQUIRES", "SKILL"),
        ("OPP_10", "EVT_01", "FOLLOWS_FROM", "EVENT")
    ]
    for opp, target, rtype, ttype in opp_rel:
        relationships.append((f"REL_{rel_id:04d}", "OPPORTUNITY", opp, rtype, ttype, target, 1.0))
        rel_id += 1

    with open(os.path.join(DATA_DIR, 'relationships.csv'), 'w', newline='') as f:
        writer = csv.writer(f)
        writer.writerow(['relationship_id', 'source_type', 'source_id', 'relationship_type', 'target_type', 'target_id', 'weight'])
        writer.writerows(relationships)

    print("Synthetic dataset generation completed successfully!")
    print(f"Generated: {len(courses)} Courses, {len(clubs)} Clubs, {len(events)} Events, {len(research_projects)} Research Projects, {len(opportunities)} Opportunities, {len(facilities)} Facilities, {len(skills)} Skills, {len(city_events)} City Events, {len(relationships)} Graph Relationships.")

if __name__ == "__main__":
    generate_all()
