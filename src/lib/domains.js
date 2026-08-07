import { Lock, Book, Wrench, DollarSign, Globe } from "lucide-react";

export const domainTypes = [
  { name: "Trust", icon: Lock },
  { name: "Knowledge", icon: Book },
  { name: "Tools", icon: Wrench },
  { name: "Exchange", icon: DollarSign },
];

export const defaultParticles = {
  Trust: ["Security Protocol", "Identity Verification", "Trust Score"],
  Knowledge: ["Learning Path", "Webinar", "Information Sharing"],
  Tools: ["Task Management", "Timeline", "Resource Allocation"],
  Exchange: ["Payment Processing", "Service Listing", "Reviews"],
};

export const DEFAULT_PERSPECTIVE = "Default";

/** Description is stored as "A <Type> domain" — read the type back out safely. */
export const getDomainType = (domain) => {
  const match = /^A\s+(\w+)\s+domain$/i.exec(domain?.description ?? "");
  const candidate = match?.[1];
  return domainTypes.some((t) => t.name === candidate) ? candidate : null;
};

export const getDomainIcon = (domain) =>
  domainTypes.find((t) => t.name === getDomainType(domain))?.icon ?? Globe;

export const getParticles = (domain) =>
  defaultParticles[getDomainType(domain)] ?? [];

export const buildDescription = (type) => `A ${type} domain`;
