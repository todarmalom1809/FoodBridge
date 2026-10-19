# FoodBridge 🌿

A food donation platform connecting **Individual Donors → NGOs → Organizations in need**.

---

## Quick Start (Demo)

### Prerequisites
- Node.js 18+
- MongoDB running locally (`mongod`)
- A free [Cloudinary](https://cloudinary.com) account (for image uploads)

---

### 1. Configure Backend

Edit `server/.env` and fill in your Cloudinary credentials:

```
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```

---

### 2. Start the Backend

```bash
cd server
npm install
npm run seed      # loads demo accounts + sample data
npm start         # starts on http://localhost:5000
```

---

### 3. Start the Frontend

```bash
cd client
npm install
npm run dev       # starts on http://localhost:5173
```

---

## Demo Accounts (password: `demo1234`)

| Role | Email | Description |
|------|-------|-------------|
| 🟢 Individual Donor | donor@demo.com | Priya Sharma — has 3 donations |
| 🔵 NGO | ngo@demo.com | Aahar Foundation |
| 🟠 Human Org | orphanage@demo.com | Bal Ashram Orphanage (45 children) |
| 🟠 Animal Org | shelter@demo.com | Paws & Care Animal Shelter (80 animals) |

---

## Demo Workflow to Present

1. Login as **shelter@demo.com** → Post a food request for animal food
2. Login as **donor@demo.com** → Post a donation (select Animal Food type)
3. Login as **ngo@demo.com** → Claim the donation → Update status to Picked Up → Update to Distributed (upload proof, select shelter as recipient)
4. Login as **shelter@demo.com** → See the fulfilled request with distribution proof
5. Login as **donor@demo.com** → See donation history with NGO and delivery info

---

## Key Design Decisions

- **Food type separation**: Human and animal food are tracked separately. Organizations are locked to their type (human/animal) when posting requests. Donors explicitly tag their donation. NGOs see the tag clearly before claiming.
- **Role-based access**: JWT middleware enforces that donors can't claim, NGOs can't post requests, and organizations can't create donations.
- **Three distinct dashboards**: Each role sees only what's relevant to them after login.

---

## Tech Stack

| Layer | Tech |
|-------|------|
| Frontend | React + Vite + Tailwind CSS v4 |
| Backend | Node.js + Express.js |
| Database | MongoDB + Mongoose |
| Auth | JWT + bcryptjs |
| Images | Cloudinary |
