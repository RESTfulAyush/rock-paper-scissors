# ⚙️ CI/CD Pipeline for Rock-Paper-Scissors App

This project demonstrates a complete CI/CD workflow for containerizing and deploying a frontend application using **GitHub Actions**, **Docker**, **Trivy**, and **Kubernetes**.

## 🧩 Pipeline Overview

The CI/CD pipeline is triggered on every push to the `main` branch, excluding changes made solely to the `kubernetes/deployment.yaml` file to avoid infinite loops. It consists of the following stages:

### 🔹 1. **Unit Testing**
- Installs dependencies via `npm ci`
- Runs unit tests to ensure code quality

### 🔹 2. **Build**
- Builds the production-ready application
- Uploads the build artifacts for use in the next stage

### 🔹 3. **Docker Build, Scan & Push**
- Builds a Docker image using the Git commit SHA as the tag (`sha-<short_sha>`)
- Scans the image using [Trivy](https://github.com/aquasecurity/trivy) for critical and high-severity vulnerabilities
- Pushes the image to **GitHub Container Registry (GHCR)**

### 🔹 4. **Update Kubernetes Deployment**
- Automatically updates the `kubernetes/deployment.yaml` file with the new image tag
- Commits and pushes the updated file back to the repository

> ✅ The pipeline ensures every new deployment uses a clean, tested, and secure Docker image.

---

## 🔐 Security Scanning with Trivy

The image is scanned with Trivy before being pushed to the registry. The scan configuration includes:
- Vulnerability severity: `CRITICAL`, `HIGH`
- Scan types: `os`, `library`
- Custom ignore paths for build cache and `node_modules`

---

## 🚢 Docker & Kubernetes

- Docker images are built using **Buildx** for compatibility and performance.
- Images are stored in **GitHub Container Registry (ghcr.io)**
- Kubernetes deployment is updated via `sed` to reflect the latest image:
```

image: ghcr.io/RESTfulAyush/rock-paper-scissors\:sha-\<commit\_sha>

```

- `imagePullSecrets` is used for GHCR authentication inside Kubernetes.

---

## 📁 Project Structure

```

.
├── .github/workflows
│   └── main.yml            # GitHub Actions pipeline definition
├── kubernetes
│   └── deployment.yaml      # Kubernetes Deployment file (auto-updated)
├── Dockerfile               # Container build file
└── ...                      # Other project files

```

---

## 📦 Image Tagging Strategy

- The Docker image is tagged as: `ghcr.io/RESTfulAyush/rock-paper-scissors:sha-<short_commit_sha>`
- This ensures traceability between image versions and code commits

---

## 🚀 Technologies Used

- **GitHub Actions** – CI/CD automation
- **Docker & Buildx** – Containerization
- **Trivy** – Security scanning
- **Kubernetes** – Application deployment
- **GitHub Container Registry (GHCR)** – Image hosting

---

## 📌 Requirements for Production

- A Kubernetes cluster with access to GHCR
- ImagePullSecrets configured to pull from private GitHub registry
- Proper RBAC and deployment permissions for CI/CD bot (if deploying directly)

---

## 💡 Future Enhancements

- Integrate deployment to Kubernetes cluster via `kubectl apply`
- Add Slack/Discord notifications for build/deploy status
- Add GitHub Environment protection rules for staging/production

