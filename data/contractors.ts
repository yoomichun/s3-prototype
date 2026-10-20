export type Contractor = {
  company: string;
  contact: string;
  phone: string;
  email: string;
};

// Made-up contractors for the prototype. Phone numbers use the reserved 555-01xx range and email addresses use example.com.
// Each answer shows 3 of these at random; "View more" reveals the other 3.
export const squatterContractors: Contractor[] = [
  { company: "Peachtree Eviction & Recovery", contact: "Marcus Bell", phone: "(404) 555-0142", email: "marcus.bell@peachtree-recovery.example.com" },
  { company: "Southern Property Solutions", contact: "Danielle Reeves", phone: "(678) 555-0187", email: "danielle@southern-property.example.com" },
  { company: "Fulton County Turnover Pros", contact: "Andre Whitfield", phone: "(470) 555-0119", email: "andre@fulton-turnover.example.com" },
  { company: "Midtown Legal & Lockout Services", contact: "Priya Nair", phone: "(404) 555-0163", email: "priya@midtown-lockout.example.com" },
  { company: "Dixie Secure Property Group", contact: "Walter Gaines", phone: "(770) 555-0174", email: "walter@dixie-secure.example.com" },
  { company: "Buckhead Reclaim Co.", contact: "Tanya Morrison", phone: "(678) 555-0126", email: "tanya@buckhead-reclaim.example.com" },
];
