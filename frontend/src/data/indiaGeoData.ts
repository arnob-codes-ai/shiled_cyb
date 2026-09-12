// India Geographic Boundary & City Coordinates for 3D Tactical Map

export interface CityNode3D {
  name: string
  state: string
  lat: number
  lng: number
  riskTier: 'HIGH' | 'MEDIUM' | 'LOW'
  riskScore: number
  atmCount: number
  bankCount: number
  activeThreats: number
  clusterId: string
  expectedWindow: string
}

export interface TransactionFlowArc {
  from: string
  to: string
  channel: string
  amount: string
  isHighThreat?: boolean
}

// Major tactical cities and ATM clusters across India
export const INDIA_TACTICAL_CITIES: CityNode3D[] = [
  {
    name: "Kolkata",
    state: "West Bengal",
    lat: 22.5726,
    lng: 88.3639,
    riskTier: "HIGH",
    riskScore: 92,
    atmCount: 42,
    bankCount: 18,
    activeThreats: 14,
    clusterId: "CC-WB-KOL-01",
    expectedWindow: "6:00 PM – 9:00 PM"
  },
  {
    name: "Delhi",
    state: "Delhi",
    lat: 28.6139,
    lng: 77.2090,
    riskTier: "HIGH",
    riskScore: 87,
    atmCount: 56,
    bankCount: 24,
    activeThreats: 18,
    clusterId: "CC-DL-DEL-01",
    expectedWindow: "5:00 PM – 8:00 PM"
  },
  {
    name: "Bengaluru",
    state: "Karnataka",
    lat: 12.9716,
    lng: 77.5946,
    riskTier: "HIGH",
    riskScore: 81,
    atmCount: 48,
    bankCount: 22,
    activeThreats: 11,
    clusterId: "CC-KA-BLR-01",
    expectedWindow: "7:00 PM – 10:00 PM"
  },
  {
    name: "Mumbai",
    state: "Maharashtra",
    lat: 19.0760,
    lng: 72.8777,
    riskTier: "MEDIUM",
    riskScore: 78,
    atmCount: 64,
    bankCount: 30,
    activeThreats: 16,
    clusterId: "CC-MH-MUM-01",
    expectedWindow: "6:30 PM – 9:30 PM"
  },
  {
    name: "Lucknow",
    state: "Uttar Pradesh",
    lat: 26.8467,
    lng: 80.9462,
    riskTier: "HIGH",
    riskScore: 82,
    atmCount: 39,
    bankCount: 17,
    activeThreats: 7,
    clusterId: "CC-UP-LKO-01",
    expectedWindow: "4:30 PM – 7:30 PM"
  },
  {
    name: "Patna",
    state: "Bihar",
    lat: 25.5941,
    lng: 85.1376,
    riskTier: "HIGH",
    riskScore: 85,
    atmCount: 31,
    bankCount: 13,
    activeThreats: 9,
    clusterId: "CC-BR-PAT-01",
    expectedWindow: "5:30 PM – 8:30 PM"
  },
  {
    name: "Jaipur",
    state: "Rajasthan",
    lat: 26.9124,
    lng: 75.7873,
    riskTier: "MEDIUM",
    riskScore: 68,
    atmCount: 34,
    bankCount: 14,
    activeThreats: 6,
    clusterId: "CC-RJ-JAI-01",
    expectedWindow: "5:00 PM – 8:00 PM"
  },
  {
    name: "Chandigarh",
    state: "Chandigarh",
    lat: 30.7333,
    lng: 76.7794,
    riskTier: "MEDIUM",
    riskScore: 74,
    atmCount: 35,
    bankCount: 15,
    activeThreats: 8,
    clusterId: "CC-CH-CHD-01",
    expectedWindow: "4:00 PM – 7:00 PM"
  },
  {
    name: "Hyderabad",
    state: "Telangana",
    lat: 17.3850,
    lng: 78.4867,
    riskTier: "MEDIUM",
    riskScore: 76,
    atmCount: 44,
    bankCount: 20,
    activeThreats: 9,
    clusterId: "CC-TS-HYD-01",
    expectedWindow: "7:00 PM – 10:00 PM"
  },
  {
    name: "Ahmedabad",
    state: "Gujarat",
    lat: 23.0225,
    lng: 72.5714,
    riskTier: "MEDIUM",
    riskScore: 72,
    atmCount: 41,
    bankCount: 19,
    activeThreats: 7,
    clusterId: "CC-GJ-AHM-01",
    expectedWindow: "6:00 PM – 9:00 PM"
  },
  {
    name: "Ranchi",
    state: "Jharkhand",
    lat: 23.3441,
    lng: 85.3096,
    riskTier: "MEDIUM",
    riskScore: 71,
    atmCount: 26,
    bankCount: 11,
    activeThreats: 6,
    clusterId: "CC-JH-RAN-01",
    expectedWindow: "5:00 PM – 8:00 PM"
  },
  {
    name: "Bhopal",
    state: "Madhya Pradesh",
    lat: 23.2599,
    lng: 77.4126,
    riskTier: "MEDIUM",
    riskScore: 66,
    atmCount: 29,
    bankCount: 12,
    activeThreats: 5,
    clusterId: "CC-MP-BHO-01",
    expectedWindow: "4:00 PM – 7:00 PM"
  },
  {
    name: "Raipur",
    state: "Chhattisgarh",
    lat: 21.2514,
    lng: 81.6296,
    riskTier: "LOW",
    riskScore: 54,
    atmCount: 24,
    bankCount: 9,
    activeThreats: 3,
    clusterId: "CC-CG-RAI-01",
    expectedWindow: "4:00 PM – 7:00 PM"
  },
  {
    name: "Chennai",
    state: "Tamil Nadu",
    lat: 13.0827,
    lng: 80.2707,
    riskTier: "LOW",
    riskScore: 62,
    atmCount: 46,
    bankCount: 19,
    activeThreats: 5,
    clusterId: "CC-TN-CHE-01",
    expectedWindow: "5:00 PM – 8:00 PM"
  },
  {
    name: "Guwahati",
    state: "Assam",
    lat: 26.1445,
    lng: 91.7362,
    riskTier: "LOW",
    riskScore: 58,
    atmCount: 22,
    bankCount: 10,
    activeThreats: 3,
    clusterId: "CC-AS-GUW-01",
    expectedWindow: "3:00 PM – 6:00 PM"
  },
  {
    name: "Srinagar",
    state: "Jammu and Kashmir",
    lat: 34.0837,
    lng: 74.7973,
    riskTier: "LOW",
    riskScore: 48,
    atmCount: 18,
    bankCount: 8,
    activeThreats: 2,
    clusterId: "CC-JK-SRI-01",
    expectedWindow: "2:00 PM – 5:00 PM"
  },
  {
    name: "Pune",
    state: "Maharashtra",
    lat: 18.5204,
    lng: 73.8567,
    riskTier: "MEDIUM",
    riskScore: 70,
    atmCount: 38,
    bankCount: 16,
    activeThreats: 5,
    clusterId: "CC-MH-PUN-01",
    expectedWindow: "6:00 PM – 9:00 PM"
  },
  {
    name: "Kochi",
    state: "Kerala",
    lat: 9.9312,
    lng: 76.2673,
    riskTier: "LOW",
    riskScore: 52,
    atmCount: 25,
    bankCount: 12,
    activeThreats: 3,
    clusterId: "CC-KL-KOC-01",
    expectedWindow: "4:00 PM – 7:00 PM"
  },
  {
    name: "Bhubaneswar",
    state: "Odisha",
    lat: 20.2961,
    lng: 85.8245,
    riskTier: "LOW",
    riskScore: 59,
    atmCount: 28,
    bankCount: 13,
    activeThreats: 4,
    clusterId: "CC-OD-BHU-01",
    expectedWindow: "4:30 PM – 7:30 PM"
  },
  {
    name: "Indore",
    state: "Madhya Pradesh",
    lat: 22.7196,
    lng: 75.8577,
    riskTier: "MEDIUM",
    riskScore: 67,
    atmCount: 30,
    bankCount: 14,
    activeThreats: 5,
    clusterId: "CC-MP-IND-01",
    expectedWindow: "5:00 PM – 8:00 PM"
  },
  {
    name: "Surat",
    state: "Gujarat",
    lat: 21.1702,
    lng: 72.8311,
    riskTier: "MEDIUM",
    riskScore: 73,
    atmCount: 36,
    bankCount: 17,
    activeThreats: 6,
    clusterId: "CC-GJ-SUR-01",
    expectedWindow: "6:30 PM – 9:30 PM"
  },
  {
    name: "Nagpur",
    state: "Maharashtra",
    lat: 21.1458,
    lng: 79.0882,
    riskTier: "LOW",
    riskScore: 61,
    atmCount: 27,
    bankCount: 12,
    activeThreats: 4,
    clusterId: "CC-MH-NAG-01",
    expectedWindow: "4:00 PM – 7:00 PM"
  },
  {
    name: "Agra",
    state: "Uttar Pradesh",
    lat: 27.1767,
    lng: 78.0081,
    riskTier: "MEDIUM",
    riskScore: 69,
    atmCount: 24,
    bankCount: 11,
    activeThreats: 4,
    clusterId: "CC-UP-AGR-01",
    expectedWindow: "3:30 PM – 6:30 PM"
  },
  {
    name: "Varanasi",
    state: "Uttar Pradesh",
    lat: 25.3176,
    lng: 82.9739,
    riskTier: "MEDIUM",
    riskScore: 65,
    atmCount: 26,
    bankCount: 10,
    activeThreats: 4,
    clusterId: "CC-UP-VAR-01",
    expectedWindow: "4:00 PM – 7:00 PM"
  },
  {
    name: "Amritsar",
    state: "Punjab",
    lat: 31.6340,
    lng: 74.8723,
    riskTier: "LOW",
    riskScore: 56,
    atmCount: 23,
    bankCount: 10,
    activeThreats: 3,
    clusterId: "CC-PB-ASR-01",
    expectedWindow: "3:00 PM – 6:00 PM"
  },
  {
    name: "Dehradun",
    state: "Uttarakhand",
    lat: 30.3165,
    lng: 78.0322,
    riskTier: "LOW",
    riskScore: 49,
    atmCount: 20,
    bankCount: 9,
    activeThreats: 2,
    clusterId: "CC-UK-DDN-01",
    expectedWindow: "2:30 PM – 5:30 PM"
  }
]

// Animated curved transaction flows matching real cybercrime corridors
export const INDIA_TRANSACTION_FLOWS: TransactionFlowArc[] = [
  { from: "Delhi", to: "Jaipur", channel: "UPI Layer 1", amount: "₹2,00,000", isHighThreat: true },
  { from: "Jaipur", to: "Mumbai", channel: "IMPS Split", amount: "₹1,90,000", isHighThreat: true },
  { from: "Mumbai", to: "Kolkata", channel: "Target Liquidation", amount: "₹1,80,000", isHighThreat: true },
  { from: "Delhi", to: "Lucknow", channel: "UPI Immediate", amount: "₹85,000", isHighThreat: true },
  { from: "Lucknow", to: "Patna", channel: "Mule Batch", amount: "₹80,000", isHighThreat: true },
  { from: "Patna", to: "Kolkata", channel: "Cross-Border ATM", amount: "₹75,000", isHighThreat: true },
  { from: "Patna", to: "Guwahati", channel: "NEFT Layer", amount: "₹45,000" },
  { from: "Mumbai", to: "Hyderabad", channel: "IMPS Multi", amount: "₹1,50,000" },
  { from: "Hyderabad", to: "Bengaluru", channel: "UPI Rapid", amount: "₹1,40,000", isHighThreat: true },
  { from: "Bengaluru", to: "Chennai", channel: "ATM Dispersion", amount: "₹65,000" },
  { from: "Srinagar", to: "Chandigarh", channel: "UPI Relay", amount: "₹1,20,000" },
  { from: "Chandigarh", to: "Delhi", channel: "IMPS Bridge", amount: "₹1,15,000", isHighThreat: true },
  { from: "Ahmedabad", to: "Mumbai", channel: "UPI Swift", amount: "₹75,000" },
  { from: "Bhopal", to: "Raipur", channel: "NEFT Corridor", amount: "₹50,000" },
  { from: "Raipur", to: "Ranchi", channel: "IMPS Channel", amount: "₹48,000" },
  { from: "Ranchi", to: "Kolkata", channel: "ATM Cluster Feed", amount: "₹70,000", isHighThreat: true },
  { from: "Pune", to: "Bengaluru", channel: "IMPS Swift", amount: "₹95,000" },
  { from: "Indore", to: "Ahmedabad", channel: "UPI Immediate", amount: "₹60,000" },
  { from: "Surat", to: "Mumbai", channel: "Cardless Liquidation", amount: "₹1,10,000", isHighThreat: true },
  { from: "Varanasi", to: "Patna", channel: "Mule Cascade", amount: "₹55,000" }
]

// Accurate boundary polygon points of India in Longitude/Latitude
export const INDIA_BOUNDARY_COORDINATES: [number, number][] = [
  [74.79, 34.08], // Srinagar / J&K North
  [76.8, 32.5],
  [78.5, 30.5],
  [80.5, 28.5],
  [84.5, 27.2],
  [88.0, 27.5], // Sikkim
  [89.5, 26.5],
  [92.5, 27.8], // Arunachal
  [96.0, 28.2], // Easternmost tip
  [95.5, 26.0],
  [93.0, 24.5], // Manipur / Mizoram
  [92.0, 22.5],
  [89.0, 21.8], // Sundarbans / WB Coast
  [86.5, 20.0], // Odisha coast
  [83.0, 17.5], // Andhra coast
  [80.3, 13.1], // Chennai / TN Coast
  [79.8, 10.5],
  [77.5, 8.1],  // Kanyakumari (Southern tip)
  [76.5, 9.5],  // Kerala coast
  [74.8, 13.0], // Karnataka coast
  [73.8, 15.5], // Goa
  [72.8, 19.0], // Mumbai / Konkan
  [72.6, 21.5], // Gujarat Gulf of Khambhat
  [69.0, 22.5], // Kathiawar
  [68.2, 23.8], // Rann of Kutch (Western tip)
  [70.5, 25.5], // Rajasthan border
  [71.5, 27.5],
  [74.5, 30.5], // Punjab
  [74.8, 33.0],
  [74.79, 34.08] // Closed loop
]

// Coordinate conversion: converts Lat/Lng to 3D Map Plane [x, y, z]
export function latLngTo3D(lat: number, lng: number, scale = 0.55): [number, number, number] {
  // Center roughly at Central India: Lat 22.0, Lng 80.0
  const centerLat = 22.0
  const centerLng = 80.0

  const x = (lng - centerLng) * scale
  const z = -(lat - centerLat) * scale
  const y = 0.05 // slightly above map base plane

  return [x, y, z]
}
