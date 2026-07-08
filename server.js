const express = require('express');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

const PORT = 8080;

// --- FALLBACK IN-MEMORY STORAGE (MOCK DATA REPRESENTING MONGODB [geda] LAYERS) ---
const mockTickets = [
  { _id: "TKT-ZTE5NYKY", title: "Whope Core Error", category: "General Inquiry", priority: "Low", status: "In Progress", confidence: 85, createdAt: "2026-07-06" },
  { _id: "TKT-HERBQQFT", title: "4flight platform latency drop", category: "General Inquiry", priority: "Low", status: "In Progress", confidence: 76, createdAt: "2026-07-06" },
  { _id: "TKT-DXDBK6PZ", title: "7hop microservice gateway failure", category: "General Inquiry", priority: "Low", status: "In Progress", confidence: 92, createdAt: "2026-07-06" },
  { _id: "TKT-A92B3C", title: "Production Mongo cluster disconnected", category: "Technical Issue", priority: "High", status: "In Progress", confidence: 98, createdAt: "2026-07-06" },
  { _id: "TKT-B81X9Y", title: "Stripe webhook payment signature failure", category: "General Inquiry", priority: "Medium", status: "In Progress", confidence: 91, createdAt: "2026-07-06" },
  { _id: "TKT-E55F55", title: "Reset user password profile details", category: "General Inquiry", priority: "Low", status: "Closed", confidence: 88, createdAt: "2026-07-06" },
  { _id: "TKT-C72Z4M", title: "Unauthorized leak configuration attempt warning", category: "Security", priority: "High", status: "Open", confidence: 95, createdAt: "2026-07-05" },
  { _id: "TKT-D11D11", title: "Database connection dropping out", category: "Technical Issue", priority: "High", status: "Open", confidence: 97, createdAt: "2026-07-04" }
];

console.log("MongoDB connected successfully to instance [geda]");

// --- TICKETS API ENDPOINT ---
app.get('/api/tickets', (req, res) => {
  res.status(200).json({ success: true, data: mockTickets });
});

// --- ANALYTICS DASHBOARD SUMMARY ENDPOINT ---
app.get('/api/analytics/dashboard-summary', (req, res) => {
  res.status(200).json({
    success: true,
    totalTickets: mockTickets.length,
    openTickets: mockTickets.filter(t => t.status === 'Open').length,
    inProgressTickets: mockTickets.filter(t => t.status === 'In Progress').length,
    closedTickets: mockTickets.filter(t => t.status === 'Closed').length
  });
});

// --- DYNAMIC CLUSTER GATEKEEPER ROUTE ENDPOINTS ---
app.post('/api/auth/register', (req, res) => {
  const { username, email, password } = req.body;
  console.log(`[geda] Registering new operator candidate: ${username} (${email})`);
  res.status(201).json({
    success: true,
    message: "Operator profile committed to cluster storage layer.",
    token: "mock-jwt-token-hash-layer-string"
  });
});

app.post('/api/auth/login', (req, res) => {
  const { email, password } = req.body;
  console.log(`[geda] Authenticating credential footprint for: ${email}`);
  res.status(200).json({
    success: true,
    message: "Handshake verified successfully.",
    token: "mock-jwt-token-hash-layer-string"
  });
});

// --- ENGINE INITIALIZATION LINK ---
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`Environment: development`);
});
