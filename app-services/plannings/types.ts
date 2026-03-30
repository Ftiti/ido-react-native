// ─── Primitives ─────────────────────────────────────────────────────────────

export type PhotoUrls = {
  url: string | null;
  thumb: string | null;
};

// ─── Pointing ────────────────────────────────────────────────────────────────

export type PointingInternalState =
  | "created"
  | "started"
  | "finished"
  | "validated";

export type PointingInternal = {
  id: number;
  state: PointingInternalState;
  started_on: string | null;
  finished_on: string | null;
  rate_lunch: number | null;
};

// ─── Agent ───────────────────────────────────────────────────────────────────

export type Agent = {
  id: number;
  first_name: string;
  last_name: string;
  full_name: string;
  email: string;
  phone: string;
  job: string | null;
  type: string;
  role: string;
  active: boolean;
  is_driver: boolean;
  is_teamleader: boolean;
  photo_urls: PhotoUrls;
};

// ─── Vehicle ─────────────────────────────────────────────────────────────────

export type Vehicle = {
  id: number;
  designation: string;
  state: string | number;
};

// ─── Planning Agent ──────────────────────────────────────────────────────────

export type PlanningAgent = {
  id: number;
  schedule_id: number;
  start_at: string | null;
  finish_at: string | null;
  agent: Agent | null;
  vehicle: Vehicle | null;
  pointing_internal: PointingInternal | null;
};

// ─── Subcontractor ───────────────────────────────────────────────────────────

export type SubcontractorAgent = {
  id: number;
  first_name: string;
  last_name: string;
  phone: string;
  email: string;
  post: string | null;
  subcontractor_id: number;
  sms_status: string | null;
  sms_delivered: boolean;
};

export type PlanningSubcontractor = {
  id: number;
  subcontractor_id: number;
  company_name: string;
  manager: string | null;
  email: string | null;
  phone: string | null;
  color: string | null;
  siret: string | null;
  active: boolean;
  agent_needed: number | null;
  rate_mission: number | null;
  canceled: boolean | null;
  cancel_reason: string | null;
  needs: string | null;
  note: string | null;
  remark: string | null;
  send_sms: boolean | null;
  send_email: boolean | null;
  agents: SubcontractorAgent[];
};

// ─── Contact ─────────────────────────────────────────────────────────────────

export type PlanningContact = {
  id: number;
  first_name: string;
  last_name: string;
  email: string | null;
  phone: string | null;
  job: string | null;
  contact_type: string | null;
};

// ─── Supervisor ──────────────────────────────────────────────────────────────

export type Supervisor = {
  id: number;
  first_name: string;
  last_name: string;
  email: string | null;
  phone: string | null;
};

// ─── Address ─────────────────────────────────────────────────────────────────

export type Address = {
  id: number;
  full: string;
  latitude: number | null;
  longitude: number | null;
};

// ─── Intervention ────────────────────────────────────────────────────────────

export type Intervention = {
  id: number;
  heading_id: number | null;
  note: string | null;
  is_closed: boolean;
  address: Address | null;
  contacts: PlanningContact[];
  client_name: string | null;
};

// ─── Schedule ────────────────────────────────────────────────────────────────

export type Schedule = {
  id: number;
  planning_id: number;
  date: string;
  started_at: string | null;
  finished_at: string | null;
  planning_agents: PlanningAgent[];
  subcontractors: PlanningSubcontractor[];
};

// ─── Planning (main) ─────────────────────────────────────────────────────────

export type PlanningType = "Punctual" | "Regular" | "FlatRate";

export type Planning = {
  id: number;
  type: PlanningType;
  intervention_id: number;
  agent_needed: number | null;
  truck_needed: number | null;
  partial: boolean;
  include_vehicle: boolean | null;
  needs: string | null;
  remark: string | null;
  start_on: string | null;
  finish_on: string | null;
  state: string | null;
  supervisors: Supervisor[];
  intervention: Intervention | null;
  schedule: Schedule | null;
  prestation: string;
};

// ─── API Response ────────────────────────────────────────────────────────────

export type PlanningsApiResponse = Planning[];
