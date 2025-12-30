import React, { useState, useEffect, useMemo, useLayoutEffect, useRef, useCallback } from 'react';
import { useLocation, useSearch } from 'wouter';
import { cn } from "@/lib/utils";
import { useLayout } from '@/components/Layout';
import MilestoneCompletionModal from '@/components/MilestoneCompletionModal';
import StatusPipelineWidget from '@/components/StatusPipelineWidget';
import { 
  ArrowLeft,
  Snowflake,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  RefreshCw,
  Globe,
  Edit,
  MessagesSquare,
  MessageSquare,
  Lightbulb,
  Plus,
  Mic,
  Map,
  LayoutGrid,
  List,
  Filter,
  MapPin,
  Pencil,
  Hand,
  Check,
  Sparkles,
  X,
  Mail,
  Phone,
  Building2,
  ExternalLink,
  Home,
  Target,
  Brain
} from 'lucide-react';

type PropertyCondition =
  | "Fixer"
  | "As-Is"
  | "Standard High"
  | "Standard Low"
  | "Flip"
  | "Standard Flip"
  | "High Flip"
  | "Low Flip & Staged"
  | "Standard Flip & Staged"
  | "High Flip & Staged";

type InfluenceCategory =
  | "Additions"
  | "Bed/Bath"
  | "Busy Street"
  | "Check Notes"
  | "Design"
  | "Freeway"
  | "Garage"
  | "Guest/AUD"
  | "Location"
  | "Lot"
  | "Lot Usable Area"
  | "Obsolescence Adjacent"
  | "Parking"
  | "Pool"
  | "Power Lines"
  | "Railroad Tracks"
  | "View"
  | "Zoning";

interface Influence {
  category: InfluenceCategory;
  type: "positive" | "negative";
  note: string;
}

type CompBucket = "Premium" | "High" | "Mid" | "Low";

interface CompProperty {
  id: string;
  address: string;
  price: number;
  pricePerSqft: number;
  size: number;
  lotSize: number;
  bedBath: string;
  yearBuilt: number;
  garage: string;
  domCdom: string;
  pool: string;
  financeType: string;
  distance: string;
  closingDate: string;
  lastUpdate: string;
  listingId: string;
  listingStatus: string;
  type: string;
  conditions: string;
  agent: {
    name: string;
    email: string;
    id: string;
    phone: string;
    office: string;
  };
  agentRemarks: string;
  publicRemarks: string;
  imageUrl: string;
  color: 'green' | 'red' | 'blue';
  keep: boolean;
  whyKeep: string[];
  whyRemove: string[];
  condition: PropertyCondition;
  influences: Influence[];
  bucket: CompBucket;
  isValueCeiling?: boolean;
}

const initialComps: CompProperty[] = [
  {
    id: '1',
    address: '84426 Ponte Court',
    price: 1195000,
    pricePerSqft: 515.84,
    size: 2317,
    lotSize: 8712,
    bedBath: '4/3',
    yearBuilt: 2009,
    garage: '2 cars',
    domCdom: '41/-',
    pool: 'In Ground, Salt Water',
    financeType: 'Conventional',
    distance: '0.32 mi',
    closingDate: '3/21/2025',
    lastUpdate: '2025-03-21T00:00:00',
    listingId: '1',
    listingStatus: 'Closed',
    type: 'Single Family',
    conditions: 'Standard High',
    agent: { name: 'Terra Lago Realty', email: 'info@terralagorealty.com', id: 'CDAR-001', phone: '(760) 555-0001', office: 'Terra Lago Realty' },
    agentRemarks: 'Guard gated community.',
    publicRemarks: 'Beautiful home in Terra Lago.',
    imageUrl: '',
    color: 'green',
    keep: true,
    whyKeep: ['Best comp - same tract, closest match', 'Pool match with subject', 'Recent closed sale'],
    whyRemove: [],
    condition: 'High Flip & Staged',
    influences: [
      { category: 'Lot', type: 'positive', note: 'Oversized 8,712 sqft lot - larger than subject.' },
      { category: 'Pool', type: 'positive', note: 'Salt water pool with upgraded finishes.' },
      { category: 'Design', type: 'positive', note: 'High-end staging and modern finishes.' }
    ],
    bucket: 'Premium'
  },
  {
    id: '2',
    address: '42871 Beato Drive',
    price: 1060000,
    pricePerSqft: 453.38,
    size: 2338,
    lotSize: 12000,
    bedBath: '4/2.5',
    yearBuilt: 2006,
    garage: '2 cars',
    domCdom: '180/-',
    pool: 'Association, In Ground, Heated, Community',
    financeType: 'Conventional',
    distance: '0.37 mi',
    closingDate: '10/8/2025',
    lastUpdate: '2025-10-08T00:00:00',
    listingId: '2',
    listingStatus: 'Closed',
    type: 'Single Family',
    conditions: 'Standard',
    agent: { name: 'Beato Realty', email: 'info@beatorealty.com', id: 'CDAR-002', phone: '(760) 555-0002', office: 'Beato Realty' },
    agentRemarks: 'HOA community with pool.',
    publicRemarks: 'Spacious home with community amenities.',
    imageUrl: '',
    color: 'green',
    keep: true,
    whyKeep: ['Same tract', 'Pool match', 'Similar bed/bath configuration'],
    whyRemove: [],
    condition: 'Standard High',
    influences: [
      { category: 'Lot', type: 'positive', note: 'Oversized 12,000 sqft lot - larger than subject.' },
      { category: 'Location', type: 'positive', note: 'Prime location in desirable tract.' }
    ],
    bucket: 'High',
    isValueCeiling: true
  },
  {
    id: '3',
    address: '42745 Ponte Court',
    price: 1050000,
    pricePerSqft: 399.70,
    size: 2627,
    lotSize: 12632,
    bedBath: '5/3.5',
    yearBuilt: 2005,
    garage: '2 cars',
    domCdom: '87/-',
    pool: 'Pebble, In Ground, Private',
    financeType: 'Conventional',
    distance: '0.35 mi',
    closingDate: '5/1/2025',
    lastUpdate: '2025-05-01T00:00:00',
    listingId: '3',
    listingStatus: 'Closed',
    type: 'Single Family',
    conditions: 'Standard High',
    agent: { name: 'Ponte Realty', email: 'info@ponterealty.com', id: 'CDAR-003', phone: '(760) 555-0003', office: 'Ponte Realty' },
    agentRemarks: 'Large lot with private pool.',
    publicRemarks: 'Stunning 5 bedroom home.',
    imageUrl: '',
    color: 'blue',
    keep: true,
    whyKeep: ['Same street', 'Pool match', 'Close proximity'],
    whyRemove: ['5BR vs 4BR - different buyer pool'],
    condition: 'High Flip & Staged',
    influences: [
      { category: 'Pool', type: 'positive', note: 'Pebble finish private pool.' },
      { category: 'Lot', type: 'positive', note: 'Oversized 12,632 sqft lot - largest in area.' },
      { category: 'Bed/Bath', type: 'negative', note: '5BR vs 4BR - different buyer pool.' }
    ],
    bucket: 'Premium'
  },
  {
    id: '4',
    address: '43173 Bacino Court',
    price: 1015000,
    pricePerSqft: 446.35,
    size: 2274,
    lotSize: 3920,
    bedBath: '3/2.5',
    yearBuilt: 2005,
    garage: '2 cars',
    domCdom: '74/-',
    pool: 'In Ground, Electric Heat',
    financeType: 'Conventional',
    distance: '0.28 mi',
    closingDate: '11/19/2025',
    lastUpdate: '2025-11-19T00:00:00',
    listingId: '4',
    listingStatus: 'Closed',
    type: 'Single Family',
    conditions: 'Standard',
    agent: { name: 'Bacino Realty', email: 'info@bacinorealty.com', id: 'CDAR-004', phone: '(760) 555-0004', office: 'Bacino Realty' },
    agentRemarks: 'Well maintained.',
    publicRemarks: 'Great family home.',
    imageUrl: '',
    color: 'green',
    keep: true,
    whyKeep: ['Close distance', 'Pool match', 'Similar sqft'],
    whyRemove: ['3BR vs 4BR'],
    condition: 'High Flip & Staged',
    influences: [
      { category: 'Guest/AUD', type: 'positive', note: 'Detached ADU adds significant value.' },
      { category: 'Pool', type: 'positive', note: 'Heated in-ground pool.' },
      { category: 'Bed/Bath', type: 'negative', note: '3BR vs subject 4BR.' }
    ],
    bucket: 'Premium'
  },
  {
    id: '5',
    address: '42776 Del Lago Court',
    price: 915000,
    pricePerSqft: 376.39,
    size: 2431,
    lotSize: 7405,
    bedBath: '5/3',
    yearBuilt: 2005,
    garage: '2 cars',
    domCdom: '142/-',
    pool: 'Gunite, Fenced, Private',
    financeType: 'Cash',
    distance: '0.22 mi',
    closingDate: '12/17/2025',
    lastUpdate: '2025-12-17T00:00:00',
    listingId: '5',
    listingStatus: 'Closed',
    type: 'Single Family',
    conditions: 'Standard',
    agent: { name: 'Del Lago Realty', email: 'info@dellagorealty.com', id: 'CDAR-005', phone: '(760) 555-0005', office: 'Del Lago Realty' },
    agentRemarks: 'Private pool.',
    publicRemarks: 'Beautiful Del Lago home.',
    imageUrl: '',
    color: 'green',
    keep: true,
    whyKeep: ['Closest distance', 'Pool match', 'Same tract'],
    whyRemove: ['5BR vs 4BR'],
    condition: 'Standard High',
    influences: [
      { category: 'Pool', type: 'positive', note: 'Gunite pool with fencing.' },
      { category: 'Location', type: 'positive', note: 'Close proximity at 0.22 mi.' },
      { category: 'Bed/Bath', type: 'negative', note: '5BR vs subject 4BR.' }
    ],
    bucket: 'High'
  },
  {
    id: '6',
    address: '43118 Fiore Street',
    price: 800000,
    pricePerSqft: 296.63,
    size: 2697,
    lotSize: 7841,
    bedBath: '5/2.5',
    yearBuilt: 2008,
    garage: '3 cars',
    domCdom: '26/-',
    pool: 'Private, Gas Heat, In Ground',
    financeType: 'Conventional',
    distance: '0.40 mi',
    closingDate: '7/23/2025',
    lastUpdate: '2025-07-23T00:00:00',
    listingId: '6',
    listingStatus: 'Closed',
    type: 'Single Family',
    conditions: 'Standard',
    agent: { name: 'Fiore Realty', email: 'info@fiorerealty.com', id: 'CDAR-006', phone: '(760) 555-0006', office: 'Fiore Realty' },
    agentRemarks: '3 car garage.',
    publicRemarks: 'Large family home.',
    imageUrl: '',
    color: 'blue',
    keep: false,
    whyKeep: ['Pool match', '3 car garage'],
    whyRemove: ['5BR vs 4BR - different buyer pool', 'Larger sqft affects comparison'],
    condition: 'Standard High',
    influences: [
      { category: 'Garage', type: 'positive', note: '3-car garage.' },
      { category: 'Pool', type: 'positive', note: 'Gas heated private pool.' },
      { category: 'Bed/Bath', type: 'negative', note: '5BR vs 4BR - different buyer pool.' }
    ],
    bucket: 'Mid'
  },
  {
    id: '7',
    address: '43955 Campo Place',
    price: 800000,
    pricePerSqft: 296.63,
    size: 2697,
    lotSize: 8276,
    bedBath: '6/2.5',
    yearBuilt: 2005,
    garage: '2 cars',
    domCdom: '26/-',
    pool: 'Private, Gas Heat, In Ground',
    financeType: 'Conventional',
    distance: '0.47 mi',
    closingDate: '7/23/2025',
    lastUpdate: '2025-07-23T00:00:00',
    listingId: '7',
    listingStatus: 'Closed',
    type: 'Single Family',
    conditions: 'Standard',
    agent: { name: 'Campo Realty', email: 'info@camporealty.com', id: 'CDAR-007', phone: '(760) 555-0007', office: 'Campo Realty' },
    agentRemarks: 'Large home.',
    publicRemarks: '6 bedroom home.',
    imageUrl: '',
    color: 'red',
    keep: false,
    whyKeep: ['Pool match', 'Same year built'],
    whyRemove: ['6BR vs 4BR - very different buyer pool', 'Much larger sqft'],
    condition: 'Standard Low',
    influences: [
      { category: 'Pool', type: 'positive', note: 'Private gas heated pool.' },
      { category: 'Bed/Bath', type: 'negative', note: '6BR vs 4BR - very different buyer pool.' },
      { category: 'Check Notes', type: 'negative', note: 'Larger sqft affects direct comparison.' }
    ],
    bucket: 'Mid'
  },
  {
    id: '8',
    address: '43703 Campo Place',
    price: 785000,
    pricePerSqft: 291.06,
    size: 2697,
    lotSize: 7841,
    bedBath: '5/2.5',
    yearBuilt: 2005,
    garage: '2 cars',
    domCdom: '12/-',
    pool: 'Private, Heated, In Ground',
    financeType: 'Conventional',
    distance: '0.38 mi',
    closingDate: '4/30/2025',
    lastUpdate: '2025-04-30T00:00:00',
    listingId: '8',
    listingStatus: 'Closed',
    type: 'Single Family',
    conditions: 'Standard',
    agent: { name: 'Campo Realty', email: 'info@camporealty.com', id: 'CDAR-008', phone: '(760) 555-0008', office: 'Campo Realty' },
    agentRemarks: 'Quick sale.',
    publicRemarks: 'Well maintained home.',
    imageUrl: '',
    color: 'blue',
    keep: false,
    whyKeep: ['Pool match', 'Fast DOM'],
    whyRemove: ['5BR vs 4BR', 'Larger sqft'],
    condition: 'Standard Flip & Staged',
    influences: [
      { category: 'Pool', type: 'positive', note: 'Private heated pool.' },
      { category: 'Bed/Bath', type: 'negative', note: '5BR vs 4BR.' },
      { category: 'Lot Usable Area', type: 'positive', note: 'Good lot size at 7,841 sqft.' }
    ],
    bucket: 'High'
  },
  {
    id: '9',
    address: '43451 Sentiero Drive',
    price: 750000,
    pricePerSqft: 289.02,
    size: 2595,
    lotSize: 9148,
    bedBath: '3/3',
    yearBuilt: 2005,
    garage: '3 cars',
    domCdom: '9/-',
    pool: 'Private, In Ground, Waterfall',
    financeType: 'Conventional',
    distance: '0.22 mi',
    closingDate: '5/30/2025',
    lastUpdate: '2025-05-30T00:00:00',
    listingId: '9',
    listingStatus: 'Closed',
    type: 'Single Family',
    conditions: 'Standard High',
    agent: { name: 'Sentiero Realty', email: 'info@sentierorealty.com', id: 'CDAR-009', phone: '(760) 555-0009', office: 'Sentiero Realty' },
    agentRemarks: 'Waterfall pool.',
    publicRemarks: 'Beautiful home with waterfall pool.',
    imageUrl: '',
    color: 'green',
    keep: true,
    whyKeep: ['Close distance', 'Pool with waterfall', '3 car garage', 'Fast DOM'],
    whyRemove: ['3BR vs 4BR'],
    condition: 'High Flip & Staged',
    influences: [
      { category: 'Pool', type: 'positive', note: 'Luxury waterfall pool feature.' },
      { category: 'Garage', type: 'positive', note: '3-car garage.' },
      { category: 'Bed/Bath', type: 'negative', note: '3BR vs subject 4BR.' }
    ],
    bucket: 'High'
  },
  {
    id: '10',
    address: '84637 Pavone Way',
    price: 699900,
    pricePerSqft: 295.19,
    size: 2371,
    lotSize: 6098,
    bedBath: '4/3',
    yearBuilt: 2008,
    garage: '3 cars',
    domCdom: '38/-',
    pool: 'In Ground, Salt Water',
    financeType: 'Conventional',
    distance: '0.06 mi',
    closingDate: '3/21/2025',
    lastUpdate: '2025-03-21T00:00:00',
    listingId: '10',
    listingStatus: 'Closed',
    type: 'Single Family',
    conditions: 'Standard',
    agent: { name: 'Pavone Realty', email: 'info@pavonerealty.com', id: 'CDAR-010', phone: '(760) 555-0010', office: 'Pavone Realty' },
    agentRemarks: 'Closest comp.',
    publicRemarks: 'Great location.',
    imageUrl: '',
    color: 'green',
    keep: true,
    whyKeep: ['Closest distance at 0.06 mi', 'Exact bed/bath match 4/3', '3 car garage', 'Salt water pool'],
    whyRemove: [],
    condition: 'High Flip',
    influences: [
      { category: 'Location', type: 'positive', note: 'Closest comp at 0.06 mi.' },
      { category: 'Bed/Bath', type: 'positive', note: 'Exact 4/3 bed/bath match.' },
      { category: 'Garage', type: 'positive', note: '3-car garage.' },
      { category: 'Pool', type: 'positive', note: 'Salt water pool.' }
    ],
    bucket: 'High'
  },
  {
    id: '11',
    address: '43128 Sentiero Drive',
    price: 655000,
    pricePerSqft: 252.50,
    size: 2595,
    lotSize: 8276,
    bedBath: '4/3',
    yearBuilt: 2005,
    garage: '3 cars',
    domCdom: '87/-',
    pool: 'In Ground, Electric Heat',
    financeType: 'Conventional',
    distance: '0.08 mi',
    closingDate: '8/22/2025',
    lastUpdate: '2025-08-22T00:00:00',
    listingId: '11',
    listingStatus: 'Closed',
    type: 'Single Family',
    conditions: 'Standard',
    agent: { name: 'Sentiero Realty', email: 'info@sentierorealty.com', id: 'CDAR-011', phone: '(760) 555-0011', office: 'Sentiero Realty' },
    agentRemarks: 'Electric heat pool.',
    publicRemarks: 'Spacious home.',
    imageUrl: '',
    color: 'green',
    keep: true,
    whyKeep: ['Very close at 0.08 mi', 'Exact bed/bath match', '3 car garage', 'Pool match'],
    whyRemove: [],
    condition: 'Standard High',
    influences: [
      { category: 'Location', type: 'positive', note: 'Very close at 0.08 mi.' },
      { category: 'Bed/Bath', type: 'positive', note: 'Exact 4/3 bed/bath match.' },
      { category: 'Garage', type: 'positive', note: '3-car garage.' }
    ],
    bucket: 'High'
  },
  {
    id: '12',
    address: '84317 Falco Court',
    price: 610000,
    pricePerSqft: 267.08,
    size: 2284,
    lotSize: 9148,
    bedBath: '4/3',
    yearBuilt: 2013,
    garage: '2 cars',
    domCdom: '10/-',
    pool: 'Unknown',
    financeType: 'Conventional',
    distance: '0.55 mi',
    closingDate: '12/19/2025',
    lastUpdate: '2025-12-19T00:00:00',
    listingId: '12',
    listingStatus: 'Closed',
    type: 'Single Family',
    conditions: 'Standard',
    agent: { name: 'Falco Realty', email: 'info@falcorealty.com', id: 'CDAR-012', phone: '(760) 555-0012', office: 'Falco Realty' },
    agentRemarks: 'Newer build.',
    publicRemarks: '2013 built home.',
    imageUrl: '',
    color: 'blue',
    keep: false,
    whyKeep: ['Exact bed/bath match', 'Fast DOM'],
    whyRemove: ['Pool status unknown', 'Newer year built affects comparison'],
    condition: 'Standard High',
    influences: [
      { category: 'Bed/Bath', type: 'positive', note: 'Exact 4/3 bed/bath match.' },
      { category: 'Check Notes', type: 'negative', note: 'Pool status unknown - verify.' },
      { category: 'Design', type: 'negative', note: 'Newer 2013 build affects comparison.' }
    ],
    bucket: 'Mid'
  },
  {
    id: '13',
    address: '83898 Carolina Court',
    price: 565000,
    pricePerSqft: 223.41,
    size: 2529,
    lotSize: 7405,
    bedBath: '4/3',
    yearBuilt: 2003,
    garage: '3 cars',
    domCdom: '74/-',
    pool: 'None',
    financeType: 'Conventional',
    distance: '0.80 mi',
    closingDate: '10/8/2025',
    lastUpdate: '2025-10-08T00:00:00',
    listingId: '13',
    listingStatus: 'Closed',
    type: 'Single Family',
    conditions: 'Standard Low',
    agent: { name: 'Carolina Realty', email: 'info@carolinarealty.com', id: 'CDAR-013', phone: '(760) 555-0013', office: 'Carolina Realty' },
    agentRemarks: 'No pool.',
    publicRemarks: 'Good family home.',
    imageUrl: '',
    color: 'red',
    keep: false,
    whyKeep: ['Exact bed/bath match', '3 car garage'],
    whyRemove: ['NO POOL - Subject has pool', 'Farther distance', 'Lower condition'],
    condition: 'Standard Low',
    influences: [
      { category: 'Garage', type: 'positive', note: '3-car garage.' },
      { category: 'Pool', type: 'negative', note: 'No pool - subject has pool.' },
      { category: 'Check Notes', type: 'negative', note: 'Lower condition noted.' }
    ],
    bucket: 'Low'
  },
  {
    id: '14',
    address: '42269 Whisper Rock Street',
    price: 550000,
    pricePerSqft: 265.44,
    size: 2072,
    lotSize: 7405,
    bedBath: '3/2.5',
    yearBuilt: 2005,
    garage: '3 cars',
    domCdom: '37/-',
    pool: 'Unknown',
    financeType: 'Conventional',
    distance: '0.88 mi',
    closingDate: '11/14/2025',
    lastUpdate: '2025-11-14T00:00:00',
    listingId: '14',
    listingStatus: 'Closed',
    type: 'Single Family',
    conditions: 'Standard',
    agent: { name: 'Whisper Rock Realty', email: 'info@whisperrockrealty.com', id: 'CDAR-014', phone: '(760) 555-0014', office: 'Whisper Rock Realty' },
    agentRemarks: 'Pool unknown.',
    publicRemarks: 'Nice street.',
    imageUrl: '',
    color: 'red',
    keep: false,
    whyKeep: ['3 car garage', 'Same year built'],
    whyRemove: ['Pool status unknown', '3BR vs 4BR', 'Farther distance'],
    condition: 'Standard Low',
    influences: [
      { category: 'Garage', type: 'positive', note: '3-car garage.' },
      { category: 'Check Notes', type: 'negative', note: 'Pool status unknown.' },
      { category: 'Bed/Bath', type: 'negative', note: '3BR vs 4BR.' },
      { category: 'Location', type: 'negative', note: 'Farther distance at 0.88 mi.' }
    ],
    bucket: 'Low'
  },
  {
    id: '15',
    address: '84186 Canzone Drive',
    price: 525000,
    pricePerSqft: 224.55,
    size: 2338,
    lotSize: 5227,
    bedBath: '4/2.5',
    yearBuilt: 2006,
    garage: '2 cars',
    domCdom: '103/-',
    pool: 'In Ground, Community',
    financeType: 'Conventional',
    distance: '0.53 mi',
    closingDate: '11/3/2025',
    lastUpdate: '2025-11-03T00:00:00',
    listingId: '15',
    listingStatus: 'Closed',
    type: 'Single Family',
    conditions: 'Standard',
    agent: { name: 'Canzone Realty', email: 'info@canzonerealty.com', id: 'CDAR-015', phone: '(760) 555-0015', office: 'Canzone Realty' },
    agentRemarks: 'Community pool.',
    publicRemarks: 'Well maintained.',
    imageUrl: '',
    color: 'blue',
    keep: false,
    whyKeep: ['Similar bed/bath', 'Pool available'],
    whyRemove: ['Community pool vs private', 'High DOM'],
    condition: 'Standard Low',
    influences: [
      { category: 'Bed/Bath', type: 'positive', note: 'Similar 4/2.5 configuration.' },
      { category: 'Pool', type: 'negative', note: 'Community pool vs private.' },
      { category: 'Check Notes', type: 'negative', note: 'High DOM at 103 days.' }
    ],
    bucket: 'Mid'
  },
  {
    id: '16',
    address: '42730 Del Lago Court',
    price: 520000,
    pricePerSqft: 231.21,
    size: 2249,
    lotSize: 7405,
    bedBath: '4/3',
    yearBuilt: 2005,
    garage: '2 cars',
    domCdom: '78/-',
    pool: 'In Ground, Community',
    financeType: 'FHA',
    distance: '0.23 mi',
    closingDate: '4/2/2025',
    lastUpdate: '2025-04-02T00:00:00',
    listingId: '16',
    listingStatus: 'Closed',
    type: 'Single Family',
    conditions: 'Standard',
    agent: { name: 'Del Lago Realty', email: 'info@dellagorealty.com', id: 'CDAR-016', phone: '(760) 555-0016', office: 'Del Lago Realty' },
    agentRemarks: 'Community pool access.',
    publicRemarks: 'Del Lago community home.',
    imageUrl: '',
    color: 'blue',
    keep: false,
    whyKeep: ['Exact bed/bath match', 'Close distance'],
    whyRemove: ['Community pool vs private', 'High DOM'],
    condition: 'Standard Low',
    influences: [
      { category: 'Bed/Bath', type: 'positive', note: 'Exact 4/3 bed/bath match.' },
      { category: 'Location', type: 'positive', note: 'Close distance at 0.23 mi.' },
      { category: 'Pool', type: 'negative', note: 'Community pool vs private.' }
    ],
    bucket: 'Mid'
  }
];

function PIQContent() {
  const [, setLocation] = useLocation();
  const searchString = useSearch();
  const fromNewAgent = searchString.includes('from=new-agent');
  
  const [activeTab, setActiveTab] = useState('piq');
  const [activeRightTab, setActiveRightTab] = useState(fromNewAgent ? 'iq' : 'notes');
  const [showIQPanel, setShowIQPanel] = useState(fromNewAgent);
  const [iQViewMode, setIQViewMode] = useState<'stats' | 'description'>('stats');
  
  const [compsMapView, setCompsMapView] = useState<'map' | 'matrix' | 'list'>('map');
  const [compsMapType, setCompsMapType] = useState<'map' | 'street' | 'aerial' | 'draw' | 'freehand'>('map');
  const [showCompsIQReport, setShowCompsIQReport] = useState(false);
  const [isCompsIQLoading, setIsCompsIQLoading] = useState(false);
  const [selectedComp, setSelectedComp] = useState<CompProperty | null>(null);
  const [selectedCompIndex, setSelectedCompIndex] = useState(0);
  const [comps, setComps] = useState<CompProperty[]>(initialComps);
  const [selectedKeepIds, setSelectedKeepIds] = useState<Set<string>>(new Set());
  const [selectedRemoveIds, setSelectedRemoveIds] = useState<Set<string>>(new Set());
  const [selectedListIds, setSelectedListIds] = useState<Set<string>>(new Set());
  const [estimatedARV, setEstimatedARV] = useState(765000);
  const [arvPosition, setArvPosition] = useState(4);
  const [arvPixelY, setArvPixelY] = useState<number | null>(null);
  const [isDraggingARV, setIsDraggingARV] = useState(false);
  const [warningDismissed, setWarningDismissed] = useState(false);
  const [isEditingARV, setIsEditingARV] = useState(false);
  const [arvInputValue, setArvInputValue] = useState('');
  const tableRef = useRef<HTMLTableElement>(null);
  const tableWrapperRef = useRef<HTMLDivElement>(null);

  const allCompsFlat = useMemo(() => {
    const bucketOrder = ['Premium', 'High', 'Mid', 'Low'] as const;
    const result: { comp: CompProperty; globalIndex: number; bucket: string }[] = [];
    let globalIdx = 0;
    bucketOrder.forEach(bucket => {
      comps.filter(c => c.bucket === bucket).forEach(comp => {
        result.push({ comp, globalIndex: globalIdx, bucket });
        globalIdx++;
      });
    });
    return result;
  }, [comps]);

  const valueCeilingGlobalIndex = useMemo(() => {
    return allCompsFlat.findIndex(item => item.comp.isValueCeiling);
  }, [allCompsFlat]);

  const isAboveValueCeiling = arvPosition <= valueCeilingGlobalIndex + 0.5;

  const calculateARVFromPosition = useCallback((pos: number) => {
    if (allCompsFlat.length === 0) return 750000;
    const clampedPos = Math.max(0, Math.min(pos, allCompsFlat.length));
    
    // Position represents where we are between row centers
    // pos = 0 means at the center of first row (comp[0].price)
    // pos = 0.5 means halfway between comp[0] and comp[1]
    // pos = 1 means at center of second row (comp[1].price)
    const lowerIdx = Math.floor(clampedPos);
    const upperIdx = Math.ceil(clampedPos);
    const fraction = clampedPos - lowerIdx;
    
    const lowerComp = allCompsFlat[lowerIdx]?.comp;
    const upperComp = allCompsFlat[upperIdx]?.comp;
    
    if (lowerComp && upperComp && lowerIdx !== upperIdx) {
      // Interpolate between the two prices
      const interpolated = lowerComp.price + (upperComp.price - lowerComp.price) * fraction;
      return Math.round(interpolated / 1000) * 1000;
    }
    if (lowerComp) {
      return lowerComp.price;
    }
    if (upperComp) {
      return upperComp.price;
    }
    return 750000;
  }, [allCompsFlat]);

  const handleARVManualUpdate = (value: string) => {
    const numValue = parseInt(value.replace(/[^0-9]/g, ''), 10);
    if (!isNaN(numValue) && numValue > 0) {
      setEstimatedARV(numValue);
      let bestPos = arvPosition;
      let bestDiff = Infinity;
      for (let p = 0; p <= allCompsFlat.length; p += 0.5) {
        const calcValue = calculateARVFromPosition(p);
        const diff = Math.abs(calcValue - numValue);
        if (diff < bestDiff) {
          bestDiff = diff;
          bestPos = p;
        }
      }
      setArvPosition(bestPos);
    }
    setIsEditingARV(false);
  };

  useEffect(() => {
    setEstimatedARV(calculateARVFromPosition(arvPosition));
  }, [arvPosition, calculateARVFromPosition]);

  useEffect(() => {
    if (!isAboveValueCeiling) {
      setWarningDismissed(false);
    }
  }, [isAboveValueCeiling]);

  const getArvOverlayY = useCallback(() => {
    if (isDraggingARV && arvPixelY !== null) return arvPixelY;
    if (!tableRef.current || !tableWrapperRef.current) return 100;
    const rows = tableRef.current.querySelectorAll('tr[data-comp-index]');
    if (rows.length === 0) return 100;
    
    const lowerIdx = Math.floor(arvPosition);
    const upperIdx = Math.ceil(arvPosition);
    const fraction = arvPosition - lowerIdx;
    const wrapperRect = tableWrapperRef.current.getBoundingClientRect();
    
    // Build row center positions
    const rowCenters: { idx: number; center: number }[] = [];
    for (let i = 0; i < rows.length; i++) {
      const row = rows[i];
      const idx = parseInt(row.getAttribute('data-comp-index') || '0', 10);
      const rowRect = row.getBoundingClientRect();
      const rowCenter = rowRect.top + rowRect.height / 2 - wrapperRect.top + tableWrapperRef.current.scrollTop;
      rowCenters.push({ idx, center: rowCenter });
    }
    
    const lowerRowData = rowCenters.find(r => r.idx === lowerIdx);
    const upperRowData = rowCenters.find(r => r.idx === upperIdx);
    
    if (lowerRowData && upperRowData && lowerIdx !== upperIdx) {
      return lowerRowData.center + (upperRowData.center - lowerRowData.center) * fraction;
    }
    
    if (lowerRowData) {
      return lowerRowData.center;
    }
    
    const lastRowData = rowCenters[rowCenters.length - 1];
    if (lastRowData) {
      return lastRowData.center;
    }
    return 100;
  }, [arvPosition, arvPixelY, isDraggingARV]);

  const keepComps = comps.filter(c => c.keep);
  
  const toggleListSelection = (compId: string) => {
    setSelectedListIds(prev => {
      const next = new Set(prev);
      if (next.has(compId)) {
        next.delete(compId);
      } else {
        next.add(compId);
      }
      return next;
    });
  };

  const toggleBucketSelection = (bucket: CompBucket) => {
    const bucketComps = comps.filter(c => c.bucket === bucket);
    const allSelected = bucketComps.every(c => selectedListIds.has(c.id));
    setSelectedListIds(prev => {
      const next = new Set(prev);
      if (allSelected) {
        bucketComps.forEach(c => next.delete(c.id));
      } else {
        bucketComps.forEach(c => next.add(c.id));
      }
      return next;
    });
  };

  const removeSelectedListComps = () => {
    setComps(prev => prev.filter(c => !selectedListIds.has(c.id)));
    setSelectedListIds(new Set());
  };
  const removeComps = comps.filter(c => !c.keep);

  const handleCompClick = (comp: CompProperty, index: number) => {
    setSelectedComp(comp);
    setSelectedCompIndex(index);
  };

  const handlePrevComp = () => {
    if (selectedCompIndex > 0) {
      setSelectedCompIndex(selectedCompIndex - 1);
      setSelectedComp(comps[selectedCompIndex - 1]);
    }
  };

  const handleNextComp = () => {
    if (selectedCompIndex < comps.length - 1) {
      setSelectedCompIndex(selectedCompIndex + 1);
      setSelectedComp(comps[selectedCompIndex + 1]);
    }
  };

  const toggleCompKeep = (compId: string) => {
    setComps(prev => prev.map(c => 
      c.id === compId ? { ...c, keep: !c.keep } : c
    ));
    if (selectedComp && selectedComp.id === compId) {
      setSelectedComp(prev => prev ? { ...prev, keep: !prev.keep } : null);
    }
  };

  const moveSelectedToRemove = () => {
    setComps(prev => prev.map(c => 
      selectedKeepIds.has(c.id) ? { ...c, keep: false } : c
    ));
    setSelectedKeepIds(new Set());
  };

  const moveSelectedToKeep = () => {
    setComps(prev => prev.map(c => 
      selectedRemoveIds.has(c.id) ? { ...c, keep: true } : c
    ));
    setSelectedRemoveIds(new Set());
  };

  const toggleSelectKeep = (id: string) => {
    setSelectedKeepIds(prev => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const toggleSelectRemove = (id: string) => {
    setSelectedRemoveIds(prev => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const selectAllKeep = () => {
    if (selectedKeepIds.size === keepComps.length) {
      setSelectedKeepIds(new Set());
    } else {
      setSelectedKeepIds(new Set(keepComps.map(c => c.id)));
    }
  };

  const selectAllRemove = () => {
    if (selectedRemoveIds.size === removeComps.length) {
      setSelectedRemoveIds(new Set());
    } else {
      setSelectedRemoveIds(new Set(removeComps.map(c => c.id)));
    }
  };
  const [isIQAnalyzed, setIsIQAnalyzed] = useState(fromNewAgent);
  const [isIQAnalyzing, setIsIQAnalyzing] = useState(false);
  const [piqIQRevealKey, setPiqIQRevealKey] = useState(0);
  const [showPiqCompletionState, setShowPiqCompletionState] = useState(false);
  const [showMapValueIQ, setShowMapValueIQ] = useState(false);
  const [isMapValueIQLoading, setIsMapValueIQLoading] = useState(false);
  const [mapValueIQRevealKey, setMapValueIQRevealKey] = useState(0);
  const [showMapValueIQCompletion, setShowMapValueIQCompletion] = useState(false);
  const [showCelebration, setShowCelebration] = useState(false);
  const [loanProgram, setLoanProgram] = useState('Cash');
  const [otherCosts, setOtherCosts] = useState<{id: number, type: string, customName: string, amount: string}[]>([]);
  const [nextCostId, setNextCostId] = useState(1);
  
  const addOtherCost = () => {
    setOtherCosts([...otherCosts, { id: nextCostId, type: '', customName: '', amount: '' }]);
    setNextCostId(nextCostId + 1);
  };
  
  const removeOtherCost = (id: number) => {
    setOtherCosts(otherCosts.filter(c => c.id !== id));
  };
  
  const updateOtherCost = (id: number, field: 'type' | 'amount' | 'customName', value: string) => {
    setOtherCosts(otherCosts.map(c => c.id === id ? { ...c, [field]: value } : c));
  };
  
  const totalOtherCosts = otherCosts.reduce((sum, c) => sum + parseInt(c.amount || '0'), 0);
  
  const { openIQ } = useLayout();

  const handleCelebrationComplete = () => {
    setShowCelebration(false);
    openIQ();
  };

  const handleCelebrationTrigger = () => {
    setShowCelebration(true);
  };

  useEffect(() => {
    if (fromNewAgent) {
      setShowIQPanel(true);
      setIsIQAnalyzed(true);
    }
  }, [fromNewAgent]);

  const handleIQClick = () => {
    if (isIQAnalyzed || isIQAnalyzing) return;
    
    setIsIQAnalyzing(true);
    setShowIQPanel(true);
    
    setTimeout(() => {
      setIsIQAnalyzing(false);
      setIsIQAnalyzed(true);
    }, 1500);
  };

  const handleCompsIQClick = () => {
    setIsCompsIQLoading(true);
    setShowCompsIQReport(true);
    setTimeout(() => {
      setIsCompsIQLoading(false);
    }, 750);
  };

  const leftTabs = [
    { id: 'piq', label: 'PIQ' },
    { id: 'comps', label: 'Comps' },
    { id: 'investment', label: 'Investment Analysis' },
    { id: 'agent', label: 'Agent' },
    { id: 'offer', label: 'Offer Terms' },
  ];

  const rightTabs = [
    { id: 'notes', label: 'Notes' },
    { id: 'reminders', label: 'Reminders' },
    { id: 'activity', label: 'Activity' },
    { id: 'tax-data', label: 'Tax Data' },
  ];

  const highlightKeywords = (text: string) => {
    const keywords = [
      { word: 'potential', color: 'bg-blue-200' },
    ];
    
    let result = text;
    keywords.forEach(({ word, color }) => {
      const regex = new RegExp(`(${word})`, 'gi');
      result = result.replace(regex, `<span class="${color} px-1 rounded">${word}</span>`);
    });
    return result;
  };

  interface StreamingLine {
    type: 'stat' | 'header' | 'bullet' | 'action';
    label?: string;
    value?: string;
    isLink?: boolean;
    linkUrl?: string;
    color?: string;
  }

  const useTypingEffect = (lines: StreamingLine[], triggerKey: number) => {
    const [displayedLines, setDisplayedLines] = useState<Record<number, string>>({});
    const [currentLineIndex, setCurrentLineIndex] = useState(0);
    const [currentCharIndex, setCurrentCharIndex] = useState(0);
    const [isComplete, setIsComplete] = useState(false);
    const [cursorVisible, setCursorVisible] = useState(true);

    useLayoutEffect(() => {
      setDisplayedLines({});
      setCurrentLineIndex(0);
      setCurrentCharIndex(0);
      setIsComplete(false);
      setCursorVisible(true);
    }, [triggerKey]);

    useEffect(() => {
      if (isComplete) return;
      const cursorInterval = setInterval(() => {
        setCursorVisible(prev => !prev);
      }, 530);
      return () => clearInterval(cursorInterval);
    }, [isComplete]);

    useEffect(() => {
      if (currentLineIndex >= lines.length) {
        setIsComplete(true);
        setCursorVisible(false);
        return;
      }

      const currentLine = lines[currentLineIndex];
      let fullText = '';
      
      if (currentLine.type === 'stat' && currentLine.label && currentLine.value) {
        fullText = `${currentLine.label}: ${currentLine.value}`;
      } else if (currentLine.type === 'header' && currentLine.value) {
        fullText = currentLine.value;
      } else if (currentLine.type === 'bullet' && currentLine.value) {
        fullText = currentLine.value;
      } else if (currentLine.type === 'action' && currentLine.value) {
        fullText = currentLine.value;
      }

      if (currentCharIndex >= fullText.length) {
        const pauseTime = currentLine.type === 'header' ? 400 : 150;
        const timeout = setTimeout(() => {
          setCurrentLineIndex(prev => prev + 1);
          setCurrentCharIndex(0);
        }, pauseTime);
        return () => clearTimeout(timeout);
      }

      const randomDelay = Math.floor(Math.random() * 6) + 4;
      const timeout = setTimeout(() => {
        setDisplayedLines(prev => ({
          ...prev,
          [currentLineIndex]: fullText.slice(0, currentCharIndex + 1)
        }));
        setCurrentCharIndex(prev => prev + 1);
      }, randomDelay);

      return () => clearTimeout(timeout);
    }, [currentLineIndex, currentCharIndex, lines, triggerKey]);

    const showCursor = cursorVisible && !isComplete;

    return { displayedLines, currentLineIndex, isComplete, showCursor };
  };

  const piqStreamingLines: StreamingLine[] = useMemo(() => [
    { type: 'stat', label: 'Status', value: 'Active' },
    { type: 'stat', label: 'Days on Market', value: '45' },
    { type: 'stat', label: 'Price to Future Value', value: '82%' },
    { type: 'stat', label: 'Propensity Score', value: '0 / 8' },
    { type: 'stat', label: 'Agent', value: 'Sarah Johnson (Unassigned)' },
    { type: 'stat', label: 'Relationship Status', value: 'Warm' },
    { type: 'stat', label: 'Investor Source Count', value: '[View Agent]', isLink: true, linkUrl: 'https://nextjs-flipiq-agent.vercel.app/agents/AaronMills' },
    { type: 'stat', label: 'Last Communication Date', value: '11/15/2025' },
    { type: 'stat', label: 'Last Address Discussed', value: '1234 Oak Street, Phoenix AZ' },
    { type: 'header', value: 'Why this Property' },
    { type: 'bullet', value: 'No propensity indicators detected for this property.' },
    { type: 'bullet', value: 'Aged listing (≥70 DOM) with strong discount potential.' },
    { type: 'bullet', value: 'Price-to-value ratio suggests room for negotiation.' },
    { type: 'action', value: 'Would you like me to run a detailed AI report?' },
  ], [piqIQRevealKey]);

  const { displayedLines: piqDisplayedLines, currentLineIndex: piqCurrentLineIndex, isComplete: piqIsTypingComplete, showCursor: piqShowCursor } = useTypingEffect(piqStreamingLines, piqIQRevealKey);

  useEffect(() => {
    if (piqIsTypingComplete) {
      const timer = setTimeout(() => {
        setShowPiqCompletionState(true);
      }, 300);
      return () => clearTimeout(timer);
    } else {
      setShowPiqCompletionState(false);
    }
  }, [piqIsTypingComplete]);

  return (
      <>
      <MilestoneCompletionModal 
        isOpen={showCelebration} 
        userName="Tony"
        onComplete={handleCelebrationComplete}
      />
      <div className="flex-1 flex flex-col overflow-hidden bg-gray-50">
        
        <header className="bg-white border-b border-gray-200 py-3 px-6 flex justify-between items-center">
          <div>
            <div className="text-sm text-gray-500 font-medium">Thursday, November 27</div>
            <h1 className="text-lg font-bold text-gray-900">Welcome, Tony!</h1>
          </div>
          <button className="p-2 hover:bg-gray-100 rounded-lg">
            <Globe className="w-5 h-5 text-gray-500" />
          </button>
        </header>

        <main className="flex-1 overflow-y-auto bg-white">
          
          <div className="border-b border-gray-200 px-6 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <button 
                  onClick={() => setLocation('/daily-outreach')}
                  className="p-2 hover:bg-gray-100 rounded-lg"
                  data-testid="button-back"
                >
                  <ArrowLeft className="w-5 h-5 text-gray-600" />
                </button>
                
                <div className="flex items-center gap-2">
                  <h2 className="text-lg font-semibold text-gray-900">10573 Larch , Bloomington , CA 92316</h2>
                  <Globe className="w-4 h-4 text-gray-400" />
                  <Edit className="w-4 h-4 text-gray-400" />
                </div>
              </div>

              <div className="flex items-center gap-3">
                <StatusPipelineWidget 
                  currentPercent={10}
                  currentLabel="Initial Contact Started"
                />
                <button className="p-2 hover:bg-gray-100 rounded-lg">
                  <MessagesSquare className="w-5 h-5 text-gray-500" />
                </button>
              </div>
            </div>

            <div className="flex items-center gap-4 mt-3 text-sm">
              <div className="relative group/priority">
                <div className="flex items-center gap-1 px-2 py-1 bg-blue-100 text-blue-700 rounded text-xs font-medium cursor-help">
                  <Snowflake className="w-3 h-3" />
                  <span>Low</span>
                  <ChevronDown className="w-3 h-3" />
                </div>
                <div className="absolute bottom-full left-0 mb-2 w-72 bg-gray-900 text-white text-xs p-3 rounded shadow-xl opacity-0 group-hover/priority:opacity-100 transition pointer-events-none z-50 normal-case font-normal leading-relaxed">
                  <div className="font-bold text-white mb-2">Property Priority</div>
                  
                  <div className="p-2 rounded mb-2">
                    <div className="font-bold text-red-400 mb-1">🔥 High Priority (Work First)</div>
                    <div className="text-gray-300 text-[10px]">High probability to close. Agent is responsive or in active negotiations. Focus here first.</div>
                  </div>
                  
                  <div className="p-2 rounded mb-2">
                    <div className="font-bold text-amber-400 mb-1">🌡️ Medium Priority (Work Second)</div>
                    <div className="text-gray-300 text-[10px]">Viable potential. Agent is engaged but deal requires nurturing. Focus after High Priority.</div>
                  </div>
                  
                  <div className="p-2 rounded mb-2 bg-blue-900/50 border border-blue-500">
                    <div className="font-bold text-blue-400 mb-1">❄️ Low Priority (Work Last)</div>
                    <div className="text-gray-300 text-[10px]">Low probability right now. Agent unresponsive or wide price gap. Focus here last.</div>
                  </div>
                  
                  <div className="p-2 rounded">
                    <div className="font-bold text-gray-400 mb-1">🆕 New (Needs Review)</div>
                    <div className="text-gray-300 text-[10px]">New deal that needs to be reviewed and assigned a priority level.</div>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-2 text-gray-500">
                <input type="checkbox" className="w-4 h-4 rounded border-gray-300" />
                <span>To do: Not set</span>
                <ChevronDown className="w-3 h-3" />
              </div>
              <div className="flex items-center gap-1 text-gray-500">
                <RefreshCw className="w-4 h-4" />
              </div>
              <span className="text-gray-400">•</span>
              <span className="text-gray-500">0 Critical</span>
              <span className="text-gray-400">•</span>
              <span className="text-gray-500">0 Reminders</span>
            </div>
          </div>

          <div className="grid grid-cols-5 border-b border-gray-200 text-sm">
            <div className="p-4 border-r border-gray-200">
              <div className="text-gray-500 text-xs mb-1">Property Details</div>
              <div className="font-medium text-gray-900 text-xs leading-relaxed">
                Single Family / 2 Br / 1 Ba / 4 Gar / 1940 / 1,951 ft² / 36,600 ft² / Pool: None
              </div>
            </div>
            <div className="p-4 border-r border-gray-200">
              <div className="text-gray-500 text-xs mb-1">List Price</div>
              <div className="font-bold text-gray-900">$975,000</div>
              <div className="text-xs text-gray-500">Owned over 15 years, Trust owned</div>
            </div>
            <div className="p-4 border-r border-gray-200">
              <div className="text-gray-500 text-xs mb-1">Market Info</div>
              <div className="font-medium text-blue-600">0 Days / Active</div>
              <div className="text-xs text-gray-500">DOM: 0 / CDOM: 0</div>
              <div className="text-xs text-gray-500">Sale Type: Standard</div>
            </div>
            <div className="p-4 border-r border-gray-200">
              <div className="text-gray-500 text-xs mb-1">Evaluation Metrics</div>
              <div className="text-xs">Asking VS ARV: <span className="text-red-500 font-medium">151.59%</span></div>
              <div className="text-xs">ARV: <span className="text-green-600 font-medium">$643,184</span></div>
              <div className="text-xs text-gray-500">Comp Data: A1, P0, B0, C2</div>
            </div>
            <div className="p-4">
              <div className="text-gray-500 text-xs mb-1">Last Open / Last Communication</div>
              <div className="text-xs">LOD: <span className="font-medium">11/27/2025</span></div>
              <div className="text-xs">LCD: <span className="font-medium">11/24/2025</span></div>
            </div>
          </div>

          <div className="flex">
            <div className="flex-1 p-6">
              
              <div className="flex items-center justify-between mb-6">
                <div className="flex gap-1">
                  {leftTabs.map((tab) => (
                    <button
                      key={tab.id}
                      onClick={() => {
                        if (tab.id === 'agent') {
                          setLocation('/agent/12');
                        } else {
                          setActiveTab(tab.id);
                        }
                      }}
                      className={cn(
                        "px-4 py-2 text-sm font-medium rounded-lg transition",
                        activeTab === tab.id
                          ? "bg-blue-600 text-white"
                          : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                      )}
                      data-testid={`tab-${tab.id}`}
                    >
                      {tab.label}
                    </button>
                  ))}
                </div>

                <div className="flex gap-1 items-center">
                  <button
                    onClick={handleCelebrationTrigger}
                    className="flex items-center gap-1.5 px-3 py-1.5 bg-[#FF6600] hover:bg-[#e55c00] text-white text-xs font-bold rounded-lg transition shadow-sm mr-2"
                    data-testid="button-piq-iq-celebration"
                  >
                    <Lightbulb className="w-4 h-4" />
                    iQ
                  </button>
                  {rightTabs.map((tab) => (
                    <button
                      key={tab.id}
                      onClick={() => setActiveRightTab(tab.id)}
                      className={cn(
                        "px-3 py-1.5 text-xs font-medium rounded-lg border transition",
                        activeRightTab === tab.id
                          ? "bg-white border-gray-300 text-gray-900"
                          : "bg-white border-gray-200 text-gray-500 hover:bg-gray-50"
                      )}
                      data-testid={`tab-right-${tab.id}`}
                    >
                      {tab.label}
                    </button>
                  ))}
                </div>
              </div>

              {activeTab === 'piq' && (
              <>
              <div className="flex gap-6">
                <div className="flex-1">
                  
                  <div className="mb-8">
                    <h3 className="text-sm font-bold text-gray-900 mb-4 uppercase tracking-wide">Basic Information</h3>
                    <div className="space-y-3 text-sm">
                      <div className="flex">
                        <span className="w-32 text-gray-500">Offer Negotiator</span>
                        <span className="text-gray-900 flex items-center gap-1">
                          Tony Fletcher
                          <Edit className="w-3 h-3 text-gray-400" />
                        </span>
                      </div>
                      <div className="flex">
                        <span className="w-32 text-gray-500">Record Created</span>
                        <span className="text-gray-900">11/25/2025</span>
                      </div>
                      <div className="flex">
                        <span className="w-32 text-gray-500">Listing Date</span>
                        <span className="text-gray-900">11/24/2025</span>
                      </div>
                      <div className="flex">
                        <span className="w-32 text-gray-500">IDX</span>
                        <span className="text-gray-900">CCMA-CRMLS</span>
                      </div>
                      <div className="flex">
                        <span className="w-32 text-gray-500">Type</span>
                        <span className="text-gray-900">Residential</span>
                      </div>
                      <div className="flex">
                        <span className="w-32 text-gray-500">MLS#</span>
                        <span className="text-gray-900">IG25265702</span>
                      </div>
                      <div className="flex">
                        <span className="w-32 text-gray-500">Status</span>
                        <span className="text-gray-900 font-medium">Active</span>
                      </div>
                      <div className="flex">
                        <span className="w-32 text-gray-500">Auto Tracker</span>
                        <span className="text-gray-900">Active 4Days</span>
                      </div>
                      <div className="flex">
                        <span className="w-32 text-gray-500">Area</span>
                        <span className="text-gray-500">-</span>
                      </div>
                    </div>
                  </div>

                  <div className="border-t border-gray-200 pt-6">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wide">Property Details</h3>
                      <button className="flex items-center gap-1 text-gray-500 hover:text-gray-700 text-sm">
                        <Edit className="w-4 h-4" />
                        <span>Edit</span>
                      </button>
                    </div>
                    
                    <div className="space-y-4 text-sm">
                      <div className="flex">
                        <span className="w-32 text-gray-500 flex-shrink-0">Public Comments</span>
                        <p 
                          className="text-gray-900 leading-relaxed"
                          dangerouslySetInnerHTML={{ 
                            __html: highlightKeywords("Investor opportunity!! Although zoned for residential, there is great potential in this expansive property! Buyer to verify possible ADU (Accessory Dwelling Unit) potential with County of San Bernardino Planning Department. There is a 5-bedroom, 2-bath single story home, a detached workshop, 2 garages, 2-carports with power, separate garden potting shed and storage sheds located on this oversized even lot. Block walls surround the property with rolling electric gate at driveway. The concrete driveway was poured to accommodate up to 6 tons weight. Seller will not do any repairs or clean up existing debris.")
                          }}
                        />
                      </div>
                      <div className="flex">
                        <span className="w-32 text-gray-500 flex-shrink-0">Agent Comments</span>
                        <p 
                          className="text-gray-900 leading-relaxed"
                          dangerouslySetInnerHTML={{ 
                            __html: highlightKeywords("Text me to show. Gates are locked so only entry is front door. Seller will not clean or remove remaining personal property. Sold AS IS Seller will not do repairs or remove debris.")
                          }}
                        />
                      </div>
                      <div className="flex">
                        <span className="w-32 text-gray-500">APN</span>
                        <span className="text-gray-500">-</span>
                      </div>
                      <div className="flex">
                        <span className="w-32 text-gray-500">Unit Number</span>
                        <span className="text-gray-500">-</span>
                      </div>
                      <div className="flex">
                        <span className="w-32 text-gray-500">Total Floors or Levels</span>
                        <span className="text-gray-900 font-medium">One</span>
                      </div>
                      <div className="flex">
                        <span className="w-32 text-gray-500">Sewer</span>
                        <span className="text-gray-900">Septic Type Unknown</span>
                      </div>
                      <div className="flex">
                        <span className="w-32 text-gray-500">Property Condition</span>
                        <span className="text-gray-500">-</span>
                      </div>
                      <div className="flex">
                        <span className="w-32 text-gray-500">Zoning</span>
                        <span className="text-gray-500">-</span>
                      </div>
                      <div className="flex">
                        <span className="w-32 text-gray-500">Association Dues</span>
                        <span className="text-gray-500">-</span>
                      </div>
                      <div className="flex">
                        <span className="w-32 text-gray-500">Common Walls</span>
                        <span className="text-gray-500">-</span>
                      </div>
                      <div className="flex">
                        <span className="w-32 text-gray-500">Lock box type</span>
                        <span className="text-gray-500">-</span>
                      </div>
                      <div className="flex">
                        <span className="w-32 text-gray-500">Occupied</span>
                        <span className="text-gray-500">-</span>
                      </div>
                      <div className="flex">
                        <span className="w-32 text-gray-500">Showing</span>
                        <span className="text-gray-500">-</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="w-96 flex-shrink-0">
                  <div className="grid grid-cols-3 gap-2">
                    <div className="relative rounded-lg overflow-hidden aspect-[4/3]">
                      <div className="w-full h-full bg-gradient-to-br from-green-600 to-green-700 flex items-center justify-center">
                        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI0MDAiIGhlaWdodD0iMjAwIj48cmVjdCBmaWxsPSIjMjI4QjIyIiB3aWR0aD0iNDAwIiBoZWlnaHQ9IjIwMCIvPjwvc3ZnPg==')] bg-cover"></div>
                      </div>
                      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white px-2 py-1 rounded shadow text-xs font-medium text-center">
                        <div className="flex items-center gap-1">
                          <svg className="w-3 h-3 text-red-500" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" /></svg>
                          <span>10573 Larch Ave</span>
                        </div>
                        <div className="text-[10px] text-blue-500">Recently viewed</div>
                      </div>
                    </div>
                    <div className="rounded-lg overflow-hidden aspect-[4/3] bg-gray-200">
                      <div className="w-full h-full bg-gradient-to-br from-green-300 to-green-400 flex items-center justify-center text-gray-600 text-xs">
                        Photo 1
                      </div>
                    </div>
                    <div className="rounded-lg overflow-hidden aspect-[4/3] bg-gray-200">
                      <div className="w-full h-full bg-gradient-to-br from-gray-300 to-gray-400 flex items-center justify-center text-gray-500 text-xs">
                        Photo 2
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              </>
              )}

            {activeTab === 'comps' && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 flex-wrap">
                      <button className="px-3 py-1.5 text-xs font-medium bg-gray-100 text-gray-700 rounded-lg border border-gray-200 hover:bg-gray-200">
                        1551-2201 sqft
                      </button>
                      <button className="px-3 py-1.5 text-xs font-medium bg-gray-100 text-gray-700 rounded-lg border border-gray-200 hover:bg-gray-200">
                        Built 941-1955
                      </button>
                      <div className="flex items-center gap-1 px-3 py-1.5 text-xs font-medium bg-white text-gray-700 rounded-lg border border-gray-200">
                        <span>1 mile radius</span>
                        <ChevronDown className="w-3 h-3" />
                      </div>
                      <div className="flex items-center gap-1 px-3 py-1.5 text-xs font-medium bg-white text-gray-700 rounded-lg border border-gray-200">
                        <span>↕</span>
                        <span>List Price</span>
                        <ChevronDown className="w-3 h-3" />
                      </div>
                      <button className="flex items-center gap-1 px-3 py-1.5 text-xs font-medium bg-white text-gray-700 rounded-lg border border-gray-200 hover:bg-gray-50">
                        <Filter className="w-3 h-3" />
                        <span>More Filters</span>
                        <span className="bg-green-500 text-white text-[10px] rounded-full w-4 h-4 flex items-center justify-center">1</span>
                      </button>
                    </div>

                    <div className="flex items-center gap-3">
                      <div className="flex bg-gray-100 rounded-lg p-0.5">
                        <button 
                          onClick={() => setCompsMapView('map')}
                          className={cn(
                            "px-4 py-1.5 text-xs font-medium rounded-md transition",
                            compsMapView === 'map' ? "bg-blue-600 text-white" : "text-gray-600 hover:bg-gray-200"
                          )}
                        >
                          Map
                        </button>
                        <button 
                          onClick={() => setCompsMapView('matrix')}
                          className={cn(
                            "px-4 py-1.5 text-xs font-medium rounded-md transition",
                            compsMapView === 'matrix' ? "bg-blue-600 text-white" : "text-gray-600 hover:bg-gray-200"
                          )}
                        >
                          Matrix
                        </button>
                        <button 
                          onClick={() => setCompsMapView('list')}
                          className={cn(
                            "px-4 py-1.5 text-xs font-medium rounded-md transition",
                            compsMapView === 'list' ? "bg-blue-600 text-white" : "text-gray-600 hover:bg-gray-200"
                          )}
                        >
                          List
                        </button>
                      </div>
                      <span className="text-xs text-gray-500">3 of 3 comps</span>
                      <button className="px-4 py-1.5 bg-green-500 hover:bg-green-600 text-white text-xs font-bold rounded-lg transition">
                        ✓ Finalize
                      </button>
                    </div>
                  </div>

                  {compsMapView === 'map' && (
                  <div className="flex items-center gap-2 border-b border-gray-200 pb-2">
                    <button 
                      onClick={() => setCompsMapType('map')}
                      className={cn(
                        "flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg transition",
                        compsMapType === 'map' ? "bg-blue-50 text-blue-600 border border-blue-200" : "text-gray-600 hover:bg-gray-100"
                      )}
                    >
                      <Map className="w-3.5 h-3.5" />
                      Map
                    </button>
                    <button 
                      onClick={() => setCompsMapType('street')}
                      className={cn(
                        "flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg transition",
                        compsMapType === 'street' ? "bg-blue-50 text-blue-600 border border-blue-200" : "text-gray-600 hover:bg-gray-100"
                      )}
                    >
                      <Globe className="w-3.5 h-3.5" />
                      Street View
                    </button>
                    <button 
                      onClick={() => setCompsMapType('aerial')}
                      className={cn(
                        "flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg transition",
                        compsMapType === 'aerial' ? "bg-blue-50 text-blue-600 border border-blue-200" : "text-gray-600 hover:bg-gray-100"
                      )}
                    >
                      <LayoutGrid className="w-3.5 h-3.5" />
                      Aerial
                    </button>
                    <button 
                      onClick={() => setCompsMapType('draw')}
                      className={cn(
                        "flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg transition",
                        compsMapType === 'draw' ? "bg-blue-50 text-blue-600 border border-blue-200" : "text-gray-600 hover:bg-gray-100"
                      )}
                    >
                      <Pencil className="w-3.5 h-3.5" />
                      Draw Area
                    </button>
                  </div>
                  )}

                  {compsMapView === 'map' ? (
                    <div className="relative w-full h-[450px] bg-gray-200 rounded-xl overflow-hidden border border-gray-300">
                      <div className="absolute inset-0 bg-gradient-to-br from-blue-100 via-blue-50 to-green-50">
                        <div className="absolute inset-0 opacity-30" style={{
                          backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='400' height='400'%3E%3Crect fill='%23e8f4f8' width='400' height='400'/%3E%3Cpath d='M0 200 Q100 150 200 200 T400 200' stroke='%23a0c4d0' fill='none' stroke-width='2'/%3E%3Cpath d='M0 300 Q150 250 300 300 T400 280' stroke='%23b0d4e0' fill='none' stroke-width='1.5'/%3E%3C/svg%3E")`,
                          backgroundSize: 'cover'
                        }}></div>
                        
                        <div 
                          className="absolute top-1/4 left-1/4 transform -translate-x-1/2 cursor-pointer hover:scale-110 transition-transform"
                          onClick={() => handleCompClick(comps[0], 0)}
                          data-testid="comp-marker-1"
                        >
                          <div className="bg-green-600 text-white text-xs font-bold px-2 py-1 rounded-full shadow-lg hover:bg-green-700">$499K</div>
                        </div>
                        <div 
                          className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 cursor-pointer hover:scale-110 transition-transform"
                          onClick={() => handleCompClick(comps[1], 1)}
                          data-testid="comp-marker-2"
                        >
                          <div className="bg-blue-600 text-white text-xs font-bold px-2 py-1 rounded-full shadow-lg border-2 border-white hover:bg-blue-700">$650K</div>
                          <div className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-blue-600"></div>
                        </div>
                        <div 
                          className="absolute bottom-1/3 right-1/4 cursor-pointer hover:scale-110 transition-transform"
                          onClick={() => handleCompClick(comps[2], 2)}
                          data-testid="comp-marker-3"
                        >
                          <div className="bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-full shadow-lg hover:bg-red-600">$800K</div>
                        </div>
                        <div className="absolute top-2/3 left-1/3">
                          <div className="w-6 h-6 bg-gray-800 rounded-full flex items-center justify-center text-white text-[10px] font-bold shadow-lg">S</div>
                        </div>

                        <div className="absolute top-4 left-4 text-xs text-gray-600 font-medium">Bloomington</div>
                        <div className="absolute top-1/3 right-1/4 text-xs text-gray-500">Rialto</div>
                        <div className="absolute bottom-1/4 left-1/5 text-xs text-gray-500">Empire Center</div>
                        <div className="absolute bottom-1/4 right-1/3 text-xs text-gray-500">West Colton</div>
                      </div>

                      <div className="absolute bottom-4 left-4 text-[10px] text-gray-500">
                        Google
                      </div>
                      <div className="absolute bottom-4 right-4 flex flex-col gap-1">
                        <button className="w-8 h-8 bg-white rounded shadow flex items-center justify-center text-gray-600 hover:bg-gray-50">+</button>
                        <button className="w-8 h-8 bg-white rounded shadow flex items-center justify-center text-gray-600 hover:bg-gray-50">−</button>
                      </div>
                    </div>
                  ) : compsMapView === 'matrix' ? (
                    <div className="space-y-6">
                      {/* PIQ & Comparison Section */}
                      <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
                        <div className="px-4 py-3 border-b border-gray-100 flex items-center gap-2">
                          <Home className="w-4 h-4 text-gray-600" />
                          <span className="text-sm font-semibold text-gray-900">Property in Question (PIQ) & Comparison</span>
                        </div>
                        <div className="px-4 py-2 text-xs text-blue-600">407 4th • Single Family</div>
                        <table className="w-full text-xs">
                          <thead>
                            <tr className="bg-gray-50 border-b border-gray-200">
                              <th className="px-4 py-2 text-left font-medium text-gray-500 uppercase tracking-wider">Metric</th>
                              <th className="px-4 py-2 text-center font-medium text-gray-500 uppercase tracking-wider">PIQ</th>
                              <th className="px-4 py-2 text-center font-medium text-gray-500 uppercase tracking-wider">Average Comps</th>
                              <th className="px-4 py-2 text-right font-medium text-gray-500 uppercase tracking-wider">% Difference</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-gray-100">
                            <tr className="hover:bg-gray-50">
                              <td className="px-4 py-2.5 text-gray-700">Property Type</td>
                              <td className="px-4 py-2.5 text-center text-gray-900">Single Family</td>
                              <td className="px-4 py-2.5 text-center text-gray-600">Single Family</td>
                              <td className="px-4 py-2.5 text-right text-gray-500">N/A</td>
                            </tr>
                            <tr className="hover:bg-gray-50">
                              <td className="px-4 py-2.5 text-gray-700">Bedrooms</td>
                              <td className="px-4 py-2.5 text-center text-gray-900">3</td>
                              <td className="px-4 py-2.5 text-center text-gray-600">2.5</td>
                              <td className="px-4 py-2.5 text-right text-green-600 font-medium">+20.0%</td>
                            </tr>
                            <tr className="hover:bg-gray-50">
                              <td className="px-4 py-2.5 text-gray-700">Bathrooms</td>
                              <td className="px-4 py-2.5 text-center text-gray-900">1</td>
                              <td className="px-4 py-2.5 text-center text-gray-600">1.3</td>
                              <td className="px-4 py-2.5 text-right text-red-600 font-medium">-20.0%</td>
                            </tr>
                            <tr className="hover:bg-gray-50">
                              <td className="px-4 py-2.5 text-gray-700">Year Built</td>
                              <td className="px-4 py-2.5 text-center text-gray-900">1949</td>
                              <td className="px-4 py-2.5 text-center text-gray-600">1938</td>
                              <td className="px-4 py-2.5 text-right text-green-600 font-medium">+0.6%</td>
                            </tr>
                            <tr className="hover:bg-gray-50">
                              <td className="px-4 py-2.5 text-gray-700">Sqft</td>
                              <td className="px-4 py-2.5 text-center text-gray-900">1,130 sqft</td>
                              <td className="px-4 py-2.5 text-center text-gray-600">1,080 sqft</td>
                              <td className="px-4 py-2.5 text-right text-green-600 font-medium">+4.7%</td>
                            </tr>
                            <tr className="hover:bg-gray-50">
                              <td className="px-4 py-2.5 text-gray-700">Lot Size</td>
                              <td className="px-4 py-2.5 text-center text-gray-900">5,812 sqft</td>
                              <td className="px-4 py-2.5 text-center text-gray-600">6,807 sqft</td>
                              <td className="px-4 py-2.5 text-right text-red-600 font-medium">-14.6%</td>
                            </tr>
                          </tbody>
                        </table>
                      </div>

                      {/* Detailed Matrix Table */}
                      <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
                        <div className="px-4 py-3 border-b border-gray-100 flex items-center gap-2">
                          <LayoutGrid className="w-4 h-4 text-gray-600" />
                          <span className="text-sm font-semibold text-gray-900">Detailed Matrix Table</span>
                        </div>
                        <div className="overflow-x-auto">
                          <table className="w-full text-xs">
                            <thead>
                              <tr className="bg-gray-50 border-b border-gray-200">
                                <th className="px-3 py-2 text-left font-medium text-gray-500 uppercase tracking-wider">Status</th>
                                <th className="px-3 py-2 text-right font-medium text-gray-500 uppercase tracking-wider">Min $/SQFT</th>
                                <th className="px-3 py-2 text-right font-medium text-gray-500 uppercase tracking-wider">Max $/SQFT</th>
                                <th className="px-3 py-2 text-right font-medium text-gray-500 uppercase tracking-wider">Avg $/SQFT</th>
                                <th className="px-3 py-2 text-right font-medium text-gray-500 uppercase tracking-wider">Min Price</th>
                                <th className="px-3 py-2 text-right font-medium text-gray-500 uppercase tracking-wider">Max Price</th>
                                <th className="px-3 py-2 text-right font-medium text-gray-500 uppercase tracking-wider">Avg Price</th>
                                <th className="px-3 py-2 text-right font-medium text-gray-500 uppercase tracking-wider">Min DOM</th>
                                <th className="px-3 py-2 text-right font-medium text-gray-500 uppercase tracking-wider">Max DOM</th>
                                <th className="px-3 py-2 text-right font-medium text-gray-500 uppercase tracking-wider">Avg DOM</th>
                                <th className="px-3 py-2 text-right font-medium text-gray-500 uppercase tracking-wider">Confidence</th>
                              </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                              <tr className="hover:bg-gray-50">
                                <td className="px-3 py-2.5 text-gray-700 flex items-center gap-2">
                                  <span className="w-2 h-2 rounded-full bg-green-500"></span>
                                  Active (2)
                                </td>
                                <td className="px-3 py-2.5 text-right text-gray-900">$263.44</td>
                                <td className="px-3 py-2.5 text-right text-gray-900">$324.92</td>
                                <td className="px-3 py-2.5 text-right text-gray-900">$294.18</td>
                                <td className="px-3 py-2.5 text-right text-gray-900">$250,000</td>
                                <td className="px-3 py-2.5 text-right text-gray-900">$389,900</td>
                                <td className="px-3 py-2.5 text-right text-gray-900">$319,950</td>
                                <td className="px-3 py-2.5 text-right text-gray-600">2</td>
                                <td className="px-3 py-2.5 text-right text-gray-600">113</td>
                                <td className="px-3 py-2.5 text-right text-gray-600">57.5</td>
                                <td className="px-3 py-2.5 text-right text-gray-600">2</td>
                              </tr>
                              <tr className="hover:bg-gray-50">
                                <td className="px-3 py-2.5 text-gray-700 flex items-center gap-2">
                                  <span className="w-2 h-2 rounded-full bg-yellow-500"></span>
                                  Pending (0)
                                </td>
                                <td className="px-3 py-2.5 text-right text-gray-400">N/A</td>
                                <td className="px-3 py-2.5 text-right text-gray-400">N/A</td>
                                <td className="px-3 py-2.5 text-right text-gray-400">N/A</td>
                                <td className="px-3 py-2.5 text-right text-gray-400">N/A</td>
                                <td className="px-3 py-2.5 text-right text-gray-400">N/A</td>
                                <td className="px-3 py-2.5 text-right text-gray-400">N/A</td>
                                <td className="px-3 py-2.5 text-right text-gray-400">N/A</td>
                                <td className="px-3 py-2.5 text-right text-gray-400">N/A</td>
                                <td className="px-3 py-2.5 text-right text-gray-400">N/A</td>
                                <td className="px-3 py-2.5 text-right text-gray-400">0</td>
                              </tr>
                              <tr className="hover:bg-gray-50">
                                <td className="px-3 py-2.5 text-gray-700 flex items-center gap-2">
                                  <span className="w-2 h-2 rounded-full bg-blue-500"></span>
                                  Backup (0)
                                </td>
                                <td className="px-3 py-2.5 text-right text-gray-400">N/A</td>
                                <td className="px-3 py-2.5 text-right text-gray-400">N/A</td>
                                <td className="px-3 py-2.5 text-right text-gray-400">N/A</td>
                                <td className="px-3 py-2.5 text-right text-gray-400">N/A</td>
                                <td className="px-3 py-2.5 text-right text-gray-400">N/A</td>
                                <td className="px-3 py-2.5 text-right text-gray-400">N/A</td>
                                <td className="px-3 py-2.5 text-right text-gray-400">N/A</td>
                                <td className="px-3 py-2.5 text-right text-gray-400">N/A</td>
                                <td className="px-3 py-2.5 text-right text-gray-400">N/A</td>
                                <td className="px-3 py-2.5 text-right text-gray-400">0</td>
                              </tr>
                              <tr className="hover:bg-gray-50">
                                <td className="px-3 py-2.5 text-gray-700 flex items-center gap-2">
                                  <span className="w-2 h-2 rounded-full bg-red-500"></span>
                                  Closed (6)
                                </td>
                                <td className="px-3 py-2.5 text-right text-gray-900">$161.94</td>
                                <td className="px-3 py-2.5 text-right text-gray-900">$291.13</td>
                                <td className="px-3 py-2.5 text-right text-gray-900">$224.11</td>
                                <td className="px-3 py-2.5 text-right text-gray-900">$160,000</td>
                                <td className="px-3 py-2.5 text-right text-gray-900">$320,000</td>
                                <td className="px-3 py-2.5 text-right text-gray-900">$244,667</td>
                                <td className="px-3 py-2.5 text-right text-gray-600">3</td>
                                <td className="px-3 py-2.5 text-right text-gray-600">37</td>
                                <td className="px-3 py-2.5 text-right text-gray-600">14.67</td>
                                <td className="px-3 py-2.5 text-right text-gray-600">6</td>
                              </tr>
                              {/* Estimated ARV Line - positioned between $750K and $785K range */}
                              <tr className="bg-green-50 border-t-2 border-b-2 border-green-400">
                                <td colSpan={11} className="px-3 py-2">
                                  <div className="flex items-center gap-3">
                                    <div className="flex-1 h-0.5 bg-green-400"></div>
                                    <div className="flex flex-col items-center">
                                      <span className="text-lg font-bold text-green-600">$765,000</span>
                                      <span className="text-[10px] font-medium text-green-700 uppercase tracking-wider">Estimated ARV</span>
                                    </div>
                                    <div className="flex-1 h-0.5 bg-green-400"></div>
                                  </div>
                                </td>
                              </tr>
                              <tr className="bg-gray-50 font-medium">
                                <td className="px-3 py-2.5 text-gray-900">Average</td>
                                <td className="px-3 py-2.5 text-right text-gray-900">$212.69</td>
                                <td className="px-3 py-2.5 text-right text-gray-900">$308.02</td>
                                <td className="px-3 py-2.5 text-right text-green-600">$259.14</td>
                                <td className="px-3 py-2.5 text-right text-gray-900">$205,000</td>
                                <td className="px-3 py-2.5 text-right text-gray-900">$354,950</td>
                                <td className="px-3 py-2.5 text-right text-green-600">$282,308</td>
                                <td className="px-3 py-2.5 text-right text-gray-600">2.5</td>
                                <td className="px-3 py-2.5 text-right text-gray-600">75</td>
                                <td className="px-3 py-2.5 text-right text-gray-600">36.09</td>
                                <td className="px-3 py-2.5 text-right text-gray-600"></td>
                              </tr>
                            </tbody>
                          </table>
                        </div>
                      </div>

                      {/* Final E-Value Calculation */}
                      <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
                        <div className="px-4 py-3 border-b border-gray-100 flex items-center gap-2">
                          <Target className="w-4 h-4 text-gray-600" />
                          <span className="text-sm font-semibold text-gray-900">Final E-Value Calculation</span>
                        </div>
                        <div className="p-4 space-y-4">
                          <div className="bg-gray-50 rounded-lg p-4">
                            <div className="font-medium text-gray-900 mb-2">Square Footage Calculation:</div>
                            <div className="text-xs text-gray-600 mb-2">Multiply the property's size by price per AVG $/sqft:</div>
                            <div className="text-sm">
                              1,130 sqft × <span className="text-green-600 font-medium">$259.14</span> = <span className="font-semibold">$292,828</span>
                            </div>
                            <div className="text-[10px] text-gray-400 mt-2">Debug: Property ID 38799187, Building Size: 1130, Comps Avg Price: $282,308.34, Avg $/sqft: $259.14</div>
                          </div>

                          <div className="bg-gray-50 rounded-lg p-4">
                            <div className="font-medium text-gray-900 mb-2">Average Comparable Price:</div>
                            <div className="text-sm">
                              Comparable property price = <span className="text-green-600 font-semibold">$282,308</span>
                            </div>
                          </div>

                          <div className="bg-gray-50 rounded-lg p-4">
                            <div className="font-medium text-gray-900 mb-2">Average the two values:</div>
                            <div className="text-xs text-gray-600 mb-2">Add the square footage calculation and comparable property price, then divide by two:</div>
                            <div className="text-sm">
                              ($292,828 + $282,308) ÷ 2 = <span className="font-semibold">$287,568</span>
                            </div>
                          </div>

                          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                            <div className="text-sm text-gray-700">Final Estimated Value:</div>
                            <div className="text-2xl font-bold text-green-600">$287,568</div>
                          </div>
                        </div>
                      </div>

                      {/* iQ Matrix Intelligence */}
                      <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
                        <div className="px-4 py-3 border-b border-gray-100 flex items-center gap-2">
                          <Brain className="w-4 h-4 text-blue-600" />
                          <span className="text-sm font-semibold text-gray-900">iQ Matrix Intelligence</span>
                        </div>
                        <div className="p-4 space-y-4 text-xs">
                          <div>
                            <div className="font-semibold text-gray-900 mb-1">PROPERTY IN QUESTION VS COMPS</div>
                            <div className="text-gray-500 text-[10px] mb-1">Relevancy: LOW</div>
                            <div className="text-gray-600">The PIQ aligns structurally with the comp set. Layout and size fall within the dominant buyer pool, and higher-priced comps share the same functional profile. There is no buyer-pool mismatch that would require discounting or adjustment.</div>
                          </div>

                          <div>
                            <div className="font-semibold text-gray-900 mb-1">MATRIX TABLE — ACTIVES</div>
                            <div className="text-gray-500 text-[10px] mb-1">Relevancy: LOW</div>
                            <div className="text-gray-600">There are two active listings. Both are in inferior condition and have been sitting. Once the PIQ is improved, these properties will not compete for the same buyer. Their pricing does not cap value or limit upside.</div>
                          </div>

                          <div>
                            <div className="font-semibold text-gray-900 mb-1">MATRIX TABLE — PENDINGS / BACKUPS</div>
                            <div className="text-gray-500 text-[10px] mb-1">Relevancy: HIGH</div>
                            <div className="text-gray-600">There are two pendings, both went under contract quickly and appear to be in better condition than the closed sales. These pendings are the most relevant forward signal in the dataset. If contract pricing confirms near their list levels, they indicate buyers are paying above the standard baseline.</div>
                          </div>

                          <div>
                            <div className="font-semibold text-gray-900 mb-1">MATRIX TABLE — CLOSED SALES</div>
                            <div className="text-gray-500 text-[10px] mb-1">Relevancy: HIGH</div>
                            <div className="text-gray-600">There are six closed sales forming a reliable baseline around $259/sqft. All six represent standard condition properties. None of the closed sales reflect premium finishes or top-tier presentation. This confirms the baseline is real, but not the ceiling.</div>
                          </div>

                          <div>
                            <div className="font-semibold text-gray-900 mb-1">E-VALUE INTERPRETATION</div>
                            <div className="text-yellow-600 text-[10px] mb-1">Outcome: POSSIBLE PUSH</div>
                            <div className="text-gray-600">The E-Value of $287,568 is grounded in standard-condition closed sales. Given the lack of premium closed data and the presence of fast pendings in better condition, the baseline appears conservative rather than aggressive.</div>
                          </div>

                          <div>
                            <div className="font-semibold text-gray-900 mb-1">MARKET CEILING & PUSH LOGIC</div>
                            <div className="text-gray-500 text-[10px] mb-1">Relevancy: HIGH</div>
                            <div className="text-gray-600">The highest credible sold price defines the market ceiling. The pending properties appear to support movement toward that ceiling without breaking it. Using pending pricing (~$291/sqft) on the PIQ size implies a value near $308K, which remains inside the proven range. A safer execution strategy would be to target just below that level (high-$290s) unless pending contracts confirm stronger pricing.</div>
                          </div>

                          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
                            <div className="font-semibold text-gray-900 mb-2">WHAT MUST BE VERIFIED</div>
                            <ul className="text-gray-600 space-y-1 list-disc list-inside">
                              <li>Confirm pending contract prices vs list</li>
                              <li>Confirm concessions or credits</li>
                              <li>Confirm condition level of pendings relative to PIQ</li>
                              <li>Confirm no premium feature exists in pendings that PIQ cannot replicate</li>
                            </ul>
                            <div className="text-gray-600 mt-2 italic">If pendings validate cleanly, they become the strongest justification for leaning above the baseline.</div>
                          </div>

                          <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                            <div className="font-semibold text-gray-900 mb-1">CONCLUSION</div>
                            <div className="text-gray-700">Closed sales establish a standard baseline, but fast pendings in superior condition suggest the market may support a higher price within the existing ceiling if contract terms confirm.</div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
                      {selectedListIds.size > 0 && (
                        <div className="px-3 py-2 bg-gray-50 border-b border-gray-200">
                          <button
                            onClick={removeSelectedListComps}
                            className="px-4 py-1.5 bg-red-500 hover:bg-red-600 text-white text-xs font-bold rounded-lg flex items-center gap-2"
                            data-testid="button-remove-selected"
                          >
                            <span>Remove</span>
                            <span className="bg-white/20 px-1.5 py-0.5 rounded text-[10px]">{selectedListIds.size}</span>
                          </button>
                        </div>
                      )}
                      <div 
                        ref={tableWrapperRef}
                        className="overflow-x-auto relative"
                        onMouseMove={(e) => {
                          if (!isDraggingARV || !tableWrapperRef.current) return;
                          const wrapperRect = tableWrapperRef.current.getBoundingClientRect();
                          const relativeY = e.clientY - wrapperRect.top + tableWrapperRef.current.scrollTop;
                          setArvPixelY(relativeY);
                          
                          const rows = tableRef.current?.querySelectorAll('tr[data-comp-index]');
                          if (!rows || rows.length === 0) return;
                          
                          // Build array of row centers with their comp indices
                          const rowCenters: { idx: number; center: number }[] = [];
                          rows.forEach((row) => {
                            const rowRect = row.getBoundingClientRect();
                            const rowTop = rowRect.top - wrapperRect.top + tableWrapperRef.current!.scrollTop;
                            const rowCenter = rowTop + rowRect.height / 2;
                            const idx = parseInt(row.getAttribute('data-comp-index') || '0', 10);
                            rowCenters.push({ idx, center: rowCenter });
                          });
                          rowCenters.sort((a, b) => a.center - b.center);
                          
                          if (rowCenters.length === 0) return;
                          
                          // If above first row center, position is at first comp
                          if (relativeY <= rowCenters[0].center) {
                            setArvPosition(rowCenters[0].idx);
                            return;
                          }
                          // If below last row center, position is at last comp
                          if (relativeY >= rowCenters[rowCenters.length - 1].center) {
                            setArvPosition(rowCenters[rowCenters.length - 1].idx);
                            return;
                          }
                          
                          // Find which two row centers we're between and interpolate
                          for (let i = 0; i < rowCenters.length - 1; i++) {
                            const current = rowCenters[i];
                            const next = rowCenters[i + 1];
                            if (relativeY >= current.center && relativeY <= next.center) {
                              const fraction = (relativeY - current.center) / (next.center - current.center);
                              setArvPosition(current.idx + fraction);
                              return;
                            }
                          }
                        }}
                        onMouseUp={() => { setIsDraggingARV(false); setArvPixelY(null); }}
                        onMouseLeave={() => { setIsDraggingARV(false); setArvPixelY(null); }}
                      >
                        <table ref={tableRef} className="w-full text-xs">
                          <thead>
                            <tr className="bg-gray-50 border-b border-gray-200">
                              <th className="px-2 py-2 text-left font-medium text-gray-500 w-8">
                                <input 
                                  type="checkbox" 
                                  className="w-3.5 h-3.5 rounded border-gray-300"
                                  checked={comps.length > 0 && comps.every(c => selectedListIds.has(c.id))}
                                  onChange={() => {
                                    if (comps.every(c => selectedListIds.has(c.id))) {
                                      setSelectedListIds(new Set());
                                    } else {
                                      setSelectedListIds(new Set(comps.map(c => c.id)));
                                    }
                                  }}
                                  data-testid="checkbox-all"
                                />
                              </th>
                              <th className="px-2 py-2 text-left font-medium text-gray-500 w-8">#</th>
                              <th className="px-2 py-2 text-left font-medium text-gray-500 w-16">Photo</th>
                              <th className="px-3 py-2 text-left font-medium text-gray-500">Address</th>
                              <th className="px-3 py-2 text-left font-medium text-gray-500">Condition</th>
                              <th className="px-3 py-2 text-right font-medium text-gray-500">Sale Price</th>
                              <th className="px-2 py-2 text-center font-medium text-gray-500">Bed/Bath</th>
                              <th className="px-2 py-2 text-right font-medium text-gray-500">SQFT</th>
                              <th className="px-2 py-2 text-right font-medium text-gray-500">LOT</th>
                              <th className="px-2 py-2 text-center font-medium text-gray-500">Garage</th>
                              <th className="px-2 py-2 text-left font-medium text-gray-500">Pool</th>
                              <th className="px-2 py-2 text-right font-medium text-gray-500">Distance</th>
                            </tr>
                          </thead>
                          <tbody>
                            {/* Premium Bucket */}
                            {comps.filter(c => c.bucket === 'Premium').length > 0 && (
                              <>
                                <tr className="bg-purple-50">
                                  <td colSpan={12} className="px-3 py-2">
                                    <div className="flex items-center gap-2 group relative">
                                      <input 
                                        type="checkbox" 
                                        className="w-3.5 h-3.5 rounded border-gray-300 text-purple-600"
                                        checked={comps.filter(c => c.bucket === 'Premium').every(c => selectedListIds.has(c.id))}
                                        onChange={() => toggleBucketSelection('Premium')}
                                        data-testid="checkbox-premium-section"
                                      />
                                      <div className="w-1 h-4 bg-purple-600 rounded-full"></div>
                                      <span className="text-xs font-bold text-purple-800">PREMIUM</span>
                                      <span className="text-[10px] text-purple-600">({comps.filter(c => c.bucket === 'Premium').length})</span>
                                      <div className="absolute left-8 top-full mt-1 z-50 hidden group-hover:block w-72 bg-gray-900 text-white text-[10px] rounded-lg p-3 shadow-xl">
                                        <div className="font-bold mb-1">Premium Comps</div>
                                        <div>These properties have unchangeable premium features: ADU/guest houses (Bacino Court), oversized lots 8,700-12,600 sqft with premium pools, and high-end staging. Subject cannot match these features.</div>
                                      </div>
                                    </div>
                                  </td>
                                </tr>
                                {comps.filter(c => c.bucket === 'Premium').map((comp, idx) => {
                                  const globalIdx = allCompsFlat.findIndex(item => item.comp.id === comp.id);
                                  return (
                                  <React.Fragment key={comp.id}>
                                  <tr 
                                    className="hover:bg-purple-50/50 cursor-pointer transition border-l-2 border-purple-400"
                                    onClick={() => handleCompClick(comp, comps.findIndex(c => c.id === comp.id))}
                                    data-testid={`list-row-${comp.id}`}
                                    data-comp-index={globalIdx}
                                  >
                                    <td className="px-2 py-2">
                                      <input 
                                        type="checkbox" 
                                        className="w-3.5 h-3.5 rounded border-gray-300" 
                                        checked={selectedListIds.has(comp.id)}
                                        onChange={() => toggleListSelection(comp.id)}
                                        onClick={(e) => e.stopPropagation()} 
                                      />
                                    </td>
                                    <td className="px-2 py-2 text-gray-500">{idx + 1}</td>
                                    <td className="px-2 py-2">
                                      <div className="w-16 h-12 bg-gray-200 rounded overflow-hidden">
                                        <div className="w-full h-full bg-gradient-to-br from-gray-300 to-gray-400 flex items-center justify-center text-gray-500 text-[10px]">Photo</div>
                                      </div>
                                    </td>
                                    <td className="px-3 py-2"><div className="font-medium text-gray-900">{comp.address}</div></td>
                                    <td className="px-3 py-2">
                                      <div className="flex flex-col gap-1">
                                        <span className="text-[10px] font-semibold text-gray-900">{comp.condition}</span>
                                        <div className="flex flex-wrap gap-1">
                                          {comp.influences.map((inf, i) => (
                                            <span key={i} className={cn("text-[9px] font-medium cursor-help", inf.type === 'positive' ? "text-green-600" : "text-red-600")} title={inf.note}>{inf.category}</span>
                                          ))}
                                        </div>
                                      </div>
                                    </td>
                                    <td className="px-3 py-2 text-right font-medium text-gray-900">${comp.price.toLocaleString()}</td>
                                    <td className="px-2 py-2 text-center text-gray-600">{comp.bedBath}</td>
                                    <td className="px-2 py-2 text-right text-gray-600">{comp.size.toLocaleString()}</td>
                                    <td className="px-2 py-2 text-right text-gray-600">{comp.lotSize.toLocaleString()}</td>
                                    <td className="px-2 py-2 text-center text-gray-600">{comp.garage}</td>
                                    <td className="px-2 py-2 text-gray-600 max-w-[100px] truncate" title={comp.pool}>{comp.pool}</td>
                                    <td className="px-2 py-2 text-right text-gray-600">{comp.distance}</td>
                                  </tr>
                                  </React.Fragment>
                                  );
                                })}
                              </>
                            )}

                            {/* High Bucket */}
                            {comps.filter(c => c.bucket === 'High').length > 0 && (
                              <>
                                <tr className="bg-green-50">
                                  <td colSpan={12} className="px-3 py-2">
                                    <div className="flex items-center gap-2">
                                      <input 
                                        type="checkbox" 
                                        className="w-3.5 h-3.5 rounded border-gray-300 text-green-600"
                                        checked={comps.filter(c => c.bucket === 'High').every(c => selectedListIds.has(c.id))}
                                        onChange={() => toggleBucketSelection('High')}
                                        data-testid="checkbox-high-section"
                                      />
                                      <div className="w-1 h-4 bg-green-600 rounded-full"></div>
                                      <span className="text-xs font-bold text-green-800">HIGH</span>
                                      <span className="text-[10px] text-green-600">({comps.filter(c => c.bucket === 'High').length})</span>
                                    </div>
                                  </td>
                                </tr>
                                {comps.filter(c => c.bucket === 'High').map((comp, idx) => {
                                  const globalIdx = allCompsFlat.findIndex(item => item.comp.id === comp.id);
                                  return (
                                  <React.Fragment key={comp.id}>
                                    <tr 
                                      className="hover:bg-green-50/50 cursor-pointer transition border-l-2 border-green-400"
                                      onClick={() => handleCompClick(comp, comps.findIndex(c => c.id === comp.id))}
                                      data-testid={`list-row-${comp.id}`}
                                      data-comp-index={globalIdx}
                                    >
                                      <td className="px-2 py-2">
                                        <input 
                                          type="checkbox" 
                                          className="w-3.5 h-3.5 rounded border-gray-300" 
                                          checked={selectedListIds.has(comp.id)}
                                          onChange={() => toggleListSelection(comp.id)}
                                          onClick={(e) => e.stopPropagation()} 
                                        />
                                      </td>
                                      <td className="px-2 py-2 text-gray-500">{idx + 1}</td>
                                      <td className="px-2 py-2">
                                        <div className="w-16 h-12 bg-gray-200 rounded overflow-hidden">
                                          <div className="w-full h-full bg-gradient-to-br from-gray-300 to-gray-400 flex items-center justify-center text-gray-500 text-[10px]">Photo</div>
                                        </div>
                                      </td>
                                      <td className="px-3 py-2"><div className="font-medium text-gray-900">{comp.address}</div></td>
                                      <td className="px-3 py-2">
                                        <div className="flex flex-col gap-1">
                                          <span className="text-[10px] font-semibold text-gray-900">{comp.condition}</span>
                                          <div className="flex flex-wrap gap-1">
                                            {comp.influences.map((inf, i) => (
                                              <span key={i} className={cn("text-[9px] font-medium cursor-help", inf.type === 'positive' ? "text-green-600" : "text-red-600")} title={inf.note}>{inf.category}</span>
                                            ))}
                                          </div>
                                        </div>
                                      </td>
                                      <td className="px-3 py-2 text-right font-medium text-gray-900">${comp.price.toLocaleString()}</td>
                                      <td className="px-2 py-2 text-center text-gray-600">{comp.bedBath}</td>
                                      <td className="px-2 py-2 text-right text-gray-600">{comp.size.toLocaleString()}</td>
                                      <td className="px-2 py-2 text-right text-gray-600">{comp.lotSize.toLocaleString()}</td>
                                      <td className="px-2 py-2 text-center text-gray-600">{comp.garage}</td>
                                      <td className="px-2 py-2 text-gray-600 max-w-[100px] truncate" title={comp.pool}>{comp.pool}</td>
                                      <td className="px-2 py-2 text-right text-gray-600">{comp.distance}</td>
                                    </tr>
                                    {comp.isValueCeiling && (
                                      <tr>
                                        <td colSpan={12} className="px-0 py-0">
                                          <div className="relative group cursor-help">
                                            <div className="border-t-2 border-dashed border-red-500 my-1"></div>
                                            <div className="absolute left-1/2 -translate-x-1/2 -top-2 px-2 py-0.5 bg-red-500 text-white text-[9px] font-bold rounded">VALUE CEILING</div>
                                            <div className="absolute left-1/2 -translate-x-1/2 top-full mt-1 z-50 hidden group-hover:block w-80 bg-gray-900 text-white text-[10px] rounded-lg p-3 shadow-xl">
                                              <div className="font-bold mb-1">Value Ceiling Explanation</div>
                                              <div>Comps above have larger lots (8,700-12,600 sqft) or premium features that subject cannot replicate. Subject's max achievable value is set by comps below this line.</div>
                                            </div>
                                          </div>
                                        </td>
                                      </tr>
                                    )}
                                  </React.Fragment>
                                  );
                                })}
                              </>
                            )}

                            {/* Mid Bucket */}
                            {comps.filter(c => c.bucket === 'Mid').length > 0 && (
                              <>
                                <tr className="bg-yellow-50">
                                  <td colSpan={12} className="px-3 py-2">
                                    <div className="flex items-center gap-2">
                                      <input 
                                        type="checkbox" 
                                        className="w-3.5 h-3.5 rounded border-gray-300 text-yellow-600"
                                        checked={comps.filter(c => c.bucket === 'Mid').every(c => selectedListIds.has(c.id))}
                                        onChange={() => toggleBucketSelection('Mid')}
                                        data-testid="checkbox-mid-section"
                                      />
                                      <div className="w-1 h-4 bg-yellow-500 rounded-full"></div>
                                      <span className="text-xs font-bold text-yellow-800">MID</span>
                                      <span className="text-[10px] text-yellow-600">({comps.filter(c => c.bucket === 'Mid').length})</span>
                                    </div>
                                  </td>
                                </tr>
                                {comps.filter(c => c.bucket === 'Mid').map((comp, idx) => {
                                  const globalIdx = allCompsFlat.findIndex(item => item.comp.id === comp.id);
                                  return (
                                  <React.Fragment key={comp.id}>
                                    <tr 
                                      className="hover:bg-yellow-50/50 cursor-pointer transition border-l-2 border-yellow-400"
                                      onClick={() => handleCompClick(comp, comps.findIndex(c => c.id === comp.id))}
                                      data-testid={`list-row-${comp.id}`}
                                      data-comp-index={globalIdx}
                                    >
                                      <td className="px-2 py-2">
                                        <input 
                                          type="checkbox" 
                                          className="w-3.5 h-3.5 rounded border-gray-300" 
                                          checked={selectedListIds.has(comp.id)}
                                          onChange={() => toggleListSelection(comp.id)}
                                          onClick={(e) => e.stopPropagation()} 
                                        />
                                      </td>
                                      <td className="px-2 py-2 text-gray-500">{idx + 1}</td>
                                      <td className="px-2 py-2">
                                        <div className="w-16 h-12 bg-gray-200 rounded overflow-hidden">
                                          <div className="w-full h-full bg-gradient-to-br from-gray-300 to-gray-400 flex items-center justify-center text-gray-500 text-[10px]">Photo</div>
                                        </div>
                                      </td>
                                      <td className="px-3 py-2"><div className="font-medium text-gray-900">{comp.address}</div></td>
                                      <td className="px-3 py-2">
                                        <div className="flex flex-col gap-1">
                                          <span className="text-[10px] font-semibold text-gray-900">{comp.condition}</span>
                                          <div className="flex flex-wrap gap-1">
                                            {comp.influences.map((inf, i) => (
                                              <span key={i} className={cn("text-[9px] font-medium cursor-help", inf.type === 'positive' ? "text-green-600" : "text-red-600")} title={inf.note}>{inf.category}</span>
                                            ))}
                                          </div>
                                        </div>
                                      </td>
                                      <td className="px-3 py-2 text-right font-medium text-gray-900">${comp.price.toLocaleString()}</td>
                                      <td className="px-2 py-2 text-center text-gray-600">{comp.bedBath}</td>
                                      <td className="px-2 py-2 text-right text-gray-600">{comp.size.toLocaleString()}</td>
                                      <td className="px-2 py-2 text-right text-gray-600">{comp.lotSize.toLocaleString()}</td>
                                      <td className="px-2 py-2 text-center text-gray-600">{comp.garage}</td>
                                      <td className="px-2 py-2 text-gray-600 max-w-[100px] truncate" title={comp.pool}>{comp.pool}</td>
                                      <td className="px-2 py-2 text-right text-gray-600">{comp.distance}</td>
                                    </tr>
                                  </React.Fragment>
                                  );
                                })}
                              </>
                            )}

                            {/* Low Bucket */}
                            {comps.filter(c => c.bucket === 'Low').length > 0 && (
                              <>
                                <tr className="bg-red-50">
                                  <td colSpan={12} className="px-3 py-2">
                                    <div className="flex items-center gap-2">
                                      <input 
                                        type="checkbox" 
                                        className="w-3.5 h-3.5 rounded border-gray-300 text-red-600"
                                        checked={comps.filter(c => c.bucket === 'Low').every(c => selectedListIds.has(c.id))}
                                        onChange={() => toggleBucketSelection('Low')}
                                        data-testid="checkbox-low-section"
                                      />
                                      <div className="w-1 h-4 bg-red-500 rounded-full"></div>
                                      <span className="text-xs font-bold text-red-800">LOW</span>
                                      <span className="text-[10px] text-red-600">({comps.filter(c => c.bucket === 'Low').length})</span>
                                    </div>
                                  </td>
                                </tr>
                                {comps.filter(c => c.bucket === 'Low').map((comp, idx) => {
                                  const globalIdx = allCompsFlat.findIndex(item => item.comp.id === comp.id);
                                  return (
                                  <React.Fragment key={comp.id}>
                                    <tr 
                                      className="hover:bg-red-50/50 cursor-pointer transition border-l-2 border-red-400"
                                      onClick={() => handleCompClick(comp, comps.findIndex(c => c.id === comp.id))}
                                      data-testid={`list-row-${comp.id}`}
                                      data-comp-index={globalIdx}
                                    >
                                      <td className="px-2 py-2">
                                        <input 
                                          type="checkbox" 
                                          className="w-3.5 h-3.5 rounded border-gray-300" 
                                          checked={selectedListIds.has(comp.id)}
                                          onChange={() => toggleListSelection(comp.id)}
                                          onClick={(e) => e.stopPropagation()} 
                                        />
                                      </td>
                                      <td className="px-2 py-2 text-gray-500">{idx + 1}</td>
                                      <td className="px-2 py-2">
                                        <div className="w-16 h-12 bg-gray-200 rounded overflow-hidden">
                                          <div className="w-full h-full bg-gradient-to-br from-gray-300 to-gray-400 flex items-center justify-center text-gray-500 text-[10px]">Photo</div>
                                        </div>
                                      </td>
                                      <td className="px-3 py-2"><div className="font-medium text-gray-900">{comp.address}</div></td>
                                      <td className="px-3 py-2">
                                        <div className="flex flex-col gap-1">
                                          <span className="text-[10px] font-semibold text-gray-900">{comp.condition}</span>
                                          <div className="flex flex-wrap gap-1">
                                            {comp.influences.map((inf, i) => (
                                              <span key={i} className={cn("text-[9px] font-medium cursor-help", inf.type === 'positive' ? "text-green-600" : "text-red-600")} title={inf.note}>{inf.category}</span>
                                            ))}
                                          </div>
                                        </div>
                                      </td>
                                      <td className="px-3 py-2 text-right font-medium text-gray-900">${comp.price.toLocaleString()}</td>
                                      <td className="px-2 py-2 text-center text-gray-600">{comp.bedBath}</td>
                                      <td className="px-2 py-2 text-right text-gray-600">{comp.size.toLocaleString()}</td>
                                      <td className="px-2 py-2 text-right text-gray-600">{comp.lotSize.toLocaleString()}</td>
                                      <td className="px-2 py-2 text-center text-gray-600">{comp.garage}</td>
                                      <td className="px-2 py-2 text-gray-600 max-w-[100px] truncate" title={comp.pool}>{comp.pool}</td>
                                      <td className="px-2 py-2 text-right text-gray-600">{comp.distance}</td>
                                    </tr>
                                  </React.Fragment>
                                  );
                                })}
                              </>
                            )}
                          </tbody>
                        </table>
                        
                        {/* Proportional Price Scale - hyper focused $50K range with $1K precision */}
                        {isDraggingARV && compsMapView === 'list' && (() => {
                          const focusRange = 25000;
                          const maxPrice = estimatedARV + focusRange;
                          const minPrice = estimatedARV - focusRange;
                          const priceRange = maxPrice - minPrice;
                          
                          const nearbyComps = allCompsFlat.filter(item => {
                            return item.comp.price >= minPrice && item.comp.price <= maxPrice;
                          });
                          
                          const gridLines: { price: number; type: 'major' | 'minor' | 'micro' }[] = [];
                          const roundedMin = Math.floor(minPrice / 10000) * 10000;
                          const roundedMax = Math.ceil(maxPrice / 10000) * 10000;
                          for (let p = roundedMin; p <= roundedMax; p += 1000) {
                            if (p % 10000 === 0) {
                              gridLines.push({ price: p, type: 'major' });
                            } else if (p % 5000 === 0) {
                              gridLines.push({ price: p, type: 'minor' });
                            } else {
                              gridLines.push({ price: p, type: 'micro' });
                            }
                          }
                          
                          return (
                            <div className="absolute right-4 z-20 pointer-events-none" style={{ top: 10, bottom: 10 }}>
                              <div className="relative h-full w-48 bg-white/95 border border-gray-200 rounded-lg shadow-xl p-3">
                                <div className="text-[9px] font-bold text-gray-600 text-center mb-1 uppercase tracking-wide">Fine Tune ($50K Range)</div>
                                <div className="text-[8px] text-gray-400 text-center mb-2">${minPrice.toLocaleString()} - ${maxPrice.toLocaleString()}</div>
                                <div className="relative h-[calc(100%-28px)]">
                                  <div className="absolute left-0 top-0 bottom-0 border-l-2 border-gray-300 ml-3"></div>
                                  
                                  {gridLines.map((line) => {
                                    const pos = ((maxPrice - line.price) / priceRange) * 100;
                                    if (pos < 0 || pos > 100) return null;
                                    return (
                                      <div
                                        key={`grid-${line.price}`}
                                        className="absolute left-0 right-0 flex items-center"
                                        style={{ top: `${pos}%` }}
                                      >
                                        <div className={cn(
                                          "ml-2",
                                          line.type === 'major' ? "w-6 h-0.5 bg-gray-500" : 
                                          line.type === 'minor' ? "w-4 h-[1.5px] bg-gray-400" : 
                                          "w-2.5 h-[1px] bg-gray-300"
                                        )}></div>
                                        {line.type === 'major' && (
                                          <span className="ml-1 text-[10px] font-semibold text-gray-600">
                                            ${(line.price / 1000).toFixed(0)}K
                                          </span>
                                        )}
                                        {line.type === 'minor' && (
                                          <span className="ml-1 text-[9px] text-gray-500">
                                            ${(line.price / 1000).toFixed(0)}K
                                          </span>
                                        )}
                                      </div>
                                    );
                                  })}
                                  
                                  {(() => {
                                    const arvPos = ((maxPrice - estimatedARV) / priceRange) * 100;
                                    return (
                                      <div
                                        className="absolute left-0 right-0 flex items-center"
                                        style={{ top: `${Math.max(1, Math.min(99, arvPos))}%` }}
                                      >
                                        <div className={cn("w-full h-1.5 rounded", isAboveValueCeiling ? "bg-red-400" : "bg-green-400/70")}></div>
                                        <span className={cn("absolute right-0 text-[11px] font-bold px-2 py-0.5 rounded shadow-md", isAboveValueCeiling ? "text-red-600 bg-red-100" : "text-green-600 bg-green-100")}>
                                          ${estimatedARV.toLocaleString()}
                                        </span>
                                      </div>
                                    );
                                  })()}
                                </div>
                              </div>
                            </div>
                          );
                        })()}

                        {/* ARV Overlay */}
                        {compsMapView === 'list' && (
                          <div 
                            className="absolute left-0 right-0 pointer-events-none z-10"
                            style={{ top: getArvOverlayY() - 20 }}
                          >
                            <div className="flex items-center gap-2 px-2">
                              <div className={cn("flex-1 border-t-2", isAboveValueCeiling ? "border-red-500" : "border-green-300/60")}></div>
                              <div 
                                className={cn(
                                  "pointer-events-auto flex flex-col items-center px-3 py-1 rounded-lg border cursor-ns-resize select-none transition-all shadow-lg group relative",
                                  isAboveValueCeiling 
                                    ? "bg-red-50 border-red-300" 
                                    : "bg-green-50/60 border-green-200",
                                  isDraggingARV && "ring-2 ring-blue-400 scale-105"
                                )}
                                onMouseDown={(e) => { e.preventDefault(); setIsDraggingARV(true); }}
                                onDoubleClick={() => { setIsEditingARV(true); setArvInputValue(estimatedARV.toString()); }}
                                data-testid="arv-drag-handle"
                              >
                                {isEditingARV ? (
                                  <input
                                    type="text"
                                    className="w-24 text-center text-sm font-bold border rounded px-1 py-0.5"
                                    value={arvInputValue}
                                    onChange={(e) => setArvInputValue(e.target.value)}
                                    onBlur={() => handleARVManualUpdate(arvInputValue)}
                                    onKeyDown={(e) => { if (e.key === 'Enter') handleARVManualUpdate(arvInputValue); if (e.key === 'Escape') setIsEditingARV(false); }}
                                    autoFocus
                                    onClick={(e) => e.stopPropagation()}
                                    data-testid="arv-input"
                                  />
                                ) : (
                                  <span className={cn("text-sm font-bold", isAboveValueCeiling ? "text-red-600" : "text-green-500/80")}>
                                    ${estimatedARV.toLocaleString()}
                                  </span>
                                )}
                                <span className={cn("text-[9px] font-medium uppercase tracking-wider", isAboveValueCeiling ? "text-red-700" : "text-green-600/70")}>
                                  Estimated ARV
                                </span>
                                <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2 py-1 bg-gray-900 text-white text-[10px] rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none z-20">
                                  Drag to adjust • Double-click to edit
                                </div>
                              </div>
                              <div className={cn("flex-1 border-t-2", isAboveValueCeiling ? "border-red-500" : "border-green-300/60")}></div>
                            </div>
                            {isAboveValueCeiling && !warningDismissed && (
                              <div className="mt-2 mx-4 px-3 py-2 bg-red-100 border border-red-300 rounded-lg text-xs text-red-800 flex items-start gap-2 pointer-events-auto">
                                <span className="text-red-600 font-bold">⚠</span>
                                <span className="flex-1">The data does not support this value, please be sure to check your comps</span>
                                <button 
                                  onClick={() => setWarningDismissed(true)}
                                  className="text-red-500 hover:text-red-700 font-bold text-sm leading-none ml-2"
                                  data-testid="dismiss-warning"
                                >
                                  ×
                                </button>
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                  )}

                  {showCompsIQReport && (
                    <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm animate-in slide-in-from-top-4 fade-in duration-500">
                      <div className="flex items-center gap-3 mb-6">
                        <div className="relative">
                          <Lightbulb className="w-6 h-6 text-[#FF6600] animate-pulse" />
                          <div className="absolute inset-0 w-6 h-6 bg-[#FF6600] rounded-full opacity-30 animate-ping"></div>
                        </div>
                        <h2 className="text-xl font-bold text-[#FF6600]">iQ Comps Analysis</h2>
                      </div>

                      {isCompsIQLoading ? (
                        <div className="space-y-3 animate-pulse">
                          <div className="flex items-center gap-2 text-sm text-gray-500">
                            <div className="w-2 h-2 bg-[#FF6600] rounded-full animate-bounce"></div>
                            <span>Analyzing comparable properties...</span>
                          </div>
                          <div className="h-3 bg-gray-200 rounded w-3/4"></div>
                          <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                          <div className="h-3 bg-gray-200 rounded w-2/3"></div>
                        </div>
                      ) : (
                        <div className="space-y-4">
                          <div className="grid grid-cols-3 gap-4 mb-6">
                            <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                              <div className="text-xs text-gray-500 mb-1">Avg Comp Price</div>
                              <div className="text-lg font-bold text-gray-900">$633,333</div>
                            </div>
                            <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                              <div className="text-xs text-gray-500 mb-1">Price per Sq Ft</div>
                              <div className="text-lg font-bold text-gray-900">$324</div>
                            </div>
                            <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                              <div className="text-xs text-gray-500 mb-1">Subject vs Comps</div>
                              <div className="text-lg font-bold text-red-600">+54%</div>
                            </div>
                          </div>

                          <div className="space-y-2 text-sm">
                            <h3 className="font-bold text-gray-900">Key Insights:</h3>
                            <ul className="space-y-2 text-gray-700">
                              <li className="flex items-start gap-2">
                                <span className="text-[#FF6600]">•</span>
                                <span>Subject property is priced <span className="font-semibold text-red-600">54% above</span> comparable sales average.</span>
                              </li>
                              <li className="flex items-start gap-2">
                                <span className="text-[#FF6600]">•</span>
                                <span>Lot size (36,600 sqft) is significantly larger than comps avg (8,200 sqft) - potential ADU opportunity.</span>
                              </li>
                              <li className="flex items-start gap-2">
                                <span className="text-[#FF6600]">•</span>
                                <span>Recommend offer at <span className="font-semibold text-green-600">$650,000-$700,000</span> based on comp analysis.</span>
                              </li>
                            </ul>
                          </div>

                          <div className="border-t border-gray-200 pt-4 mt-4">
                            <div className="flex items-center gap-3 bg-gray-50 rounded-full px-4 py-3 border border-gray-200">
                              <Plus className="w-5 h-5 text-gray-400" />
                              <input 
                                type="text" 
                                placeholder="Ask about these comps..." 
                                className="flex-1 bg-transparent text-sm text-gray-700 placeholder-gray-400 outline-none"
                                data-testid="input-comps-ask"
                              />
                              <Mic className="w-5 h-5 text-gray-400 cursor-pointer hover:text-gray-600" />
                              <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center cursor-pointer hover:bg-blue-700">
                                <MessageSquare className="w-4 h-4 text-white" />
                              </div>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  )}

                  {compsMapView === 'map' && (
                  <>
                  {/* Variable Analysis - 3 Columns */}
                  <div className="mt-6 mb-4 grid grid-cols-3 gap-4">
                    {/* PROPERTY (Structure / Use) */}
                    <div className="bg-white border border-gray-200 rounded-lg p-3">
                      <div className="text-[10px] text-gray-500 uppercase tracking-wide mb-3 font-medium border-b border-gray-100 pb-2">Property</div>
                      <div className="space-y-2.5 text-xs">
                        <div>
                          <div className="font-medium text-gray-900">Garage: 3-car attached</div>
                          <div className="text-gray-500 mt-0.5">2 comps have 2-car — extra capacity adds appeal</div>
                        </div>
                        <div>
                          <div className="font-medium text-gray-900">Solar: Owned</div>
                          <div className="text-gray-500 mt-0.5">Owned solar adds value vs leased or none</div>
                        </div>
                      </div>
                    </div>

                    {/* LOT (Usability & Function) */}
                    <div className="bg-white border border-gray-200 rounded-lg p-3">
                      <div className="text-[10px] text-gray-500 uppercase tracking-wide mb-3 font-medium border-b border-gray-100 pb-2">Lot</div>
                      <div className="space-y-2.5 text-xs">
                        <div>
                          <div className="font-medium text-gray-900">Pool: In-ground heated</div>
                          <div className="text-gray-500 mt-0.5">1 comp has no pool — pool changes buyer pool</div>
                        </div>
                        <div>
                          <div className="font-medium text-gray-900">Lot Shape: Rectangular</div>
                          <div className="text-gray-500 mt-0.5">Standard usable lot, no constraints</div>
                        </div>
                      </div>
                    </div>

                    {/* LOCATION (External / Market) */}
                    <div className="bg-white border border-gray-200 rounded-lg p-3">
                      <div className="text-[10px] text-gray-500 uppercase tracking-wide mb-3 font-medium border-b border-gray-100 pb-2">Location</div>
                      <div className="space-y-2.5 text-xs">
                        <div>
                          <div className="font-medium text-gray-900">Golf Course: Front adjacency</div>
                          <div className="text-gray-500 mt-0.5">Premium positioning — 2 comps are interior</div>
                        </div>
                        <div>
                          <div className="font-medium text-gray-900">Tract: Terra Lago</div>
                          <div className="text-gray-500 mt-0.5">All comps same tract — strong anchor</div>
                        </div>
                        <div>
                          <div className="font-medium text-gray-900">HOA: Guard gated</div>
                          <div className="text-gray-500 mt-0.5">Community amenities included</div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Keep/Remove Two-Column Table */}
                  <div className="grid grid-cols-2 gap-6">
                    {/* KEEP Column */}
                    <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
                      <div className="bg-green-50 border-b border-green-200 px-4 py-3 flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <input
                            type="checkbox"
                            checked={selectedKeepIds.size === keepComps.length && keepComps.length > 0}
                            onChange={selectAllKeep}
                            className="w-4 h-4 rounded border-gray-300 text-green-600 focus:ring-green-500"
                            data-testid="checkbox-select-all-keep"
                          />
                          <span className="text-sm font-bold text-green-800">KEEP</span>
                          <span className="text-xs text-green-600">({keepComps.length} comps)</span>
                        </div>
                        <button
                          onClick={() => {
                            // Only keep selected - move all unchecked to remove
                            setComps(prev => prev.map(c => 
                              c.keep && !selectedKeepIds.has(c.id) ? { ...c, keep: false } : c
                            ));
                            setSelectedKeepIds(new Set());
                          }}
                          disabled={selectedKeepIds.size === 0}
                          className={cn(
                            "px-3 py-1.5 text-xs font-medium rounded-lg transition",
                            selectedKeepIds.size > 0
                              ? "bg-green-600 text-white hover:bg-green-700"
                              : "bg-gray-100 text-gray-400 cursor-not-allowed"
                          )}
                          data-testid="button-only-keep-selected"
                        >
                          Only Keep Selected
                        </button>
                      </div>
                      <div className="divide-y divide-gray-100">
                        {keepComps.map((comp, idx) => (
                          <div 
                            key={comp.id}
                            className="px-4 py-3 hover:bg-green-50/50 cursor-pointer transition"
                            onClick={() => handleCompClick(comp, comps.findIndex(c => c.id === comp.id))}
                            data-testid={`row-keep-comp-${comp.id}`}
                          >
                            <div className="flex items-start gap-3">
                              <input
                                type="checkbox"
                                checked={selectedKeepIds.has(comp.id)}
                                onChange={(e) => { e.stopPropagation(); toggleSelectKeep(comp.id); }}
                                onClick={(e) => e.stopPropagation()}
                                className="w-4 h-4 mt-1 rounded border-gray-300 text-green-600 focus:ring-green-500"
                                data-testid={`checkbox-keep-${comp.id}`}
                              />
                              <div className="flex-1">
                                <div className="flex items-center justify-between mb-1">
                                  <div className="flex items-center gap-2">
                                    <span className="text-sm font-bold text-gray-900">{comp.address}</span>
                                    <span className={cn(
                                      "px-1.5 py-0.5 text-[9px] font-medium rounded",
                                      idx === 0 ? "bg-green-100 text-green-700" : 
                                      idx === 1 ? "bg-green-50 text-green-600" : 
                                      "bg-yellow-50 text-yellow-700"
                                    )}>
                                      Confidence: {idx === 0 ? 'High' : idx === 1 ? 'High' : 'Moderate'}
                                    </span>
                                  </div>
                                  <div className="flex items-center gap-2">
                                    <span className="text-sm font-bold text-gray-900">${(comp.price / 1000).toFixed(0)}K</span>
                                    <span className={cn(
                                      "px-2 py-0.5 text-[10px] font-bold rounded",
                                      comp.listingStatus === 'Closed' ? "bg-red-100 text-red-700" : "bg-green-100 text-green-700"
                                    )}>
                                      {comp.listingStatus === 'Closed' ? 'SOLD' : comp.listingStatus.toUpperCase()}
                                    </span>
                                  </div>
                                </div>
                                <div className="text-[11px] text-gray-600 mb-2">
                                  Single Family / {comp.bedBath.split('/')[0]} Br / {comp.bedBath.split('/')[1]} Ba / {comp.garage} / {comp.yearBuilt} / {comp.size.toLocaleString()} ft² / {comp.lotSize.toLocaleString()} ft² / Pool: {comp.pool === 'None' ? 'None' : 'Yes'}
                                </div>
                                
                                <div className="space-y-1.5 text-xs">
                                  {comp.whyKeep.slice(0, 3).map((reason, i) => (
                                    <div key={i} className="flex items-start gap-1.5 text-gray-700">
                                      <span className="text-green-600 font-bold mt-0.5">✓</span>
                                      <span>{reason}</span>
                                    </div>
                                  ))}
                                  
                                  <div className="flex items-start gap-1.5 text-gray-700">
                                    <span className="text-green-600 font-bold mt-0.5">✓</span>
                                    <span><span className="font-medium">CONDITION:</span> {comp.conditions} — {comp.distance} from subject</span>
                                  </div>
                                  
                                  {comp.whyKeep.length > 0 && (
                                    <div className="flex items-start gap-1.5 pt-1 border-t border-green-100 mt-1">
                                      <span className="text-green-600 font-bold mt-0.5">✓</span>
                                      <span className="font-medium text-green-800">WHY KEPT: {comp.whyKeep[0]}</span>
                                    </div>
                                  )}
                                </div>
                              </div>
                            </div>
                          </div>
                        ))}
                        {keepComps.length === 0 && (
                          <div className="px-4 py-8 text-center text-sm text-gray-400">
                            No comps in keep list
                          </div>
                        )}
                      </div>
                    </div>

                    {/* REMOVE Column */}
                    <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
                      <div className="bg-red-50 border-b border-red-200 px-4 py-3 flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <input
                            type="checkbox"
                            checked={selectedRemoveIds.size === removeComps.length && removeComps.length > 0}
                            onChange={selectAllRemove}
                            className="w-4 h-4 rounded border-gray-300 text-red-600 focus:ring-red-500"
                            data-testid="checkbox-select-all-remove"
                          />
                          <span className="text-sm font-bold text-red-800">REMOVE</span>
                          <span className="text-xs text-red-600">({removeComps.length} comps)</span>
                        </div>
                        <button
                          onClick={() => {
                            // Only remove selected - move all unchecked back to keep
                            setComps(prev => prev.map(c => 
                              !c.keep && !selectedRemoveIds.has(c.id) ? { ...c, keep: true } : c
                            ));
                            setSelectedRemoveIds(new Set());
                          }}
                          disabled={selectedRemoveIds.size === 0}
                          className={cn(
                            "px-3 py-1.5 text-xs font-medium rounded-lg transition",
                            selectedRemoveIds.size > 0
                              ? "bg-red-600 text-white hover:bg-red-700"
                              : "bg-gray-100 text-gray-400 cursor-not-allowed"
                          )}
                          data-testid="button-only-remove-selected"
                        >
                          Only Remove Selected
                        </button>
                      </div>
                      
                      {removeComps.length > 0 && (
                        <div className="px-3 py-2 bg-red-50/50 border-b border-red-100">
                          <span className="text-[10px] font-medium text-red-700 uppercase tracking-wide">Lower Relevance</span>
                        </div>
                      )}
                      
                      <div className="divide-y divide-gray-100">
                        {removeComps.map((comp, idx) => (
                          <div 
                            key={comp.id}
                            className="px-4 py-3 hover:bg-red-50/30 cursor-pointer transition opacity-80"
                            onClick={() => handleCompClick(comp, comps.findIndex(c => c.id === comp.id))}
                            data-testid={`row-remove-comp-${comp.id}`}
                          >
                            <div className="flex items-start gap-3">
                              <input
                                type="checkbox"
                                checked={selectedRemoveIds.has(comp.id)}
                                onChange={(e) => { e.stopPropagation(); toggleSelectRemove(comp.id); }}
                                onClick={(e) => e.stopPropagation()}
                                className="w-4 h-4 mt-1 rounded border-gray-300 text-red-600 focus:ring-red-500"
                                data-testid={`checkbox-remove-${comp.id}`}
                              />
                              <div className="flex-1">
                                <div className="flex items-center justify-between mb-1">
                                  <div className="flex items-center gap-2">
                                    <span className="text-sm font-bold text-gray-700">{comp.address}</span>
                                    <span className="px-1.5 py-0.5 text-[9px] font-medium rounded bg-orange-50 text-orange-600">
                                      Confidence: Weak
                                    </span>
                                  </div>
                                  <div className="flex items-center gap-2">
                                    <span className="text-sm font-bold text-gray-700">${(comp.price / 1000).toFixed(0)}K</span>
                                    <span className={cn(
                                      "px-2 py-0.5 text-[10px] font-bold rounded",
                                      comp.listingStatus === 'Closed' ? "bg-red-100 text-red-700" : "bg-green-100 text-green-700"
                                    )}>
                                      {comp.listingStatus === 'Closed' ? 'SOLD' : comp.listingStatus.toUpperCase()}
                                    </span>
                                  </div>
                                </div>
                                <div className="text-[11px] text-gray-500 mb-2">
                                  Single Family / {comp.bedBath.split('/')[0]} Br / {comp.bedBath.split('/')[1]} Ba / {comp.garage} / {comp.yearBuilt} / {comp.size.toLocaleString()} ft² / {comp.lotSize.toLocaleString()} ft² / Pool: {comp.pool === 'None' ? 'None' : 'Yes'}
                                </div>
                                
                                <div className="space-y-1.5 text-xs">
                                  {comp.whyRemove.slice(0, 3).map((reason, i) => (
                                    <div key={i} className="flex items-start gap-1.5 text-gray-600">
                                      <span className="text-red-500 font-bold mt-0.5">✗</span>
                                      <span>{reason}</span>
                                    </div>
                                  ))}
                                  
                                  <div className="flex items-start gap-1.5 text-gray-600">
                                    <span className="text-red-500 font-bold mt-0.5">✗</span>
                                    <span><span className="font-medium">CONDITION:</span> {comp.conditions} — {comp.distance} from subject</span>
                                  </div>
                                  
                                  {comp.whyRemove.length > 0 && (
                                    <div className="flex items-start gap-1.5 pt-1 border-t border-red-100 mt-1">
                                      <span className="text-red-500 font-bold mt-0.5">✗</span>
                                      <span className="font-medium text-red-700">WHY REMOVED: {comp.whyRemove[0]}</span>
                                    </div>
                                  )}
                                </div>
                              </div>
                            </div>
                          </div>
                        ))}
                        {removeComps.length === 0 && (
                          <div className="px-4 py-8 text-center text-sm text-gray-400">
                            No comps in remove list
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                  </>
                  )}
                </div>
              )}

              {activeTab === 'investment' && (
                <div className="space-y-4">
                  {/* 3-COLUMN PROCESS FLOW LAYOUT */}
                  <div className="grid grid-cols-3 gap-4">
                    
                    {/* COLUMN 1: Property & Scope (The Asset) */}
                    <div className="bg-white rounded-xl border border-gray-200 p-5">
                      <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wide mb-4 pb-2 border-b border-gray-100">Property & Scope</h3>
                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-gray-600">List Price</span>
                          <div className="flex items-center gap-2">
                            <input 
                              type="text" 
                              defaultValue="$200,000" 
                              className="w-24 px-3 py-1.5 text-sm text-right border border-gray-200 rounded-md bg-white focus:outline-none focus:ring-1 focus:ring-blue-500"
                              data-testid="input-list-price"
                            />
                            <span className="text-xs text-gray-500 w-16 text-right">71.5% ARV</span>
                          </div>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-gray-600">Buy-Side Closing Costs</span>
                          <div className="flex items-center gap-2">
                            <input 
                              type="text" 
                              defaultValue="$1,300" 
                              className="w-24 px-3 py-1.5 text-sm text-right border border-gray-200 rounded-md bg-white focus:outline-none focus:ring-1 focus:ring-blue-500"
                              data-testid="input-buy-closing-costs"
                            />
                            <span className="w-16"></span>
                          </div>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-gray-600">Renovation Budget</span>
                          <div className="flex items-center gap-2">
                            <button 
                              className="p-1 border border-gray-300 rounded bg-gray-50 hover:bg-gray-100 transition"
                              data-testid="button-renovation-calculator"
                            >
                              <svg className="w-3.5 h-3.5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                              </svg>
                            </button>
                            <input 
                              type="text" 
                              defaultValue="$50,000" 
                              className="w-24 px-3 py-1.5 text-sm text-right border border-gray-200 rounded-md bg-white focus:outline-none focus:ring-1 focus:ring-blue-500"
                              data-testid="input-renovation-budget"
                            />
                            <span className="text-xs text-gray-500 w-16 text-right">17.9% ARV</span>
                          </div>
                        </div>
                        <div className="flex items-center justify-between pt-2 border-t border-gray-100">
                          <span className="text-sm font-medium text-gray-700 whitespace-nowrap">Total Acquisition Cost</span>
                          <div className="flex items-center gap-2 flex-shrink-0">
                            <span className="text-sm font-semibold text-gray-900 whitespace-nowrap">$251,300</span>
                            <span className="text-xs text-gray-500 whitespace-nowrap">89.8% ARV</span>
                          </div>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-gray-600">After Repair Value (ARV)</span>
                          <div className="flex items-center gap-2">
                            <input 
                              type="text" 
                              defaultValue="$279,900" 
                              className="w-24 px-3 py-1.5 text-sm text-right border border-gray-200 rounded-md bg-white focus:outline-none focus:ring-1 focus:ring-blue-500"
                              data-testid="input-arv"
                            />
                            <span className="w-16"></span>
                          </div>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-gray-600">Sell-Side Closing Costs</span>
                          <div className="flex items-center gap-2">
                            <div className="w-24 flex items-center justify-end gap-1">
                              <input 
                                type="text" 
                                defaultValue="5" 
                                className="w-12 px-2 py-1.5 text-sm text-center border border-gray-200 rounded-md bg-white focus:outline-none focus:ring-1 focus:ring-blue-500"
                                data-testid="input-sell-closing-percent"
                              />
                              <span className="text-xs text-gray-500">%</span>
                            </div>
                            <span className="text-xs text-gray-500 w-16 text-right">$13,995</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* COLUMN 2: Targets & Results (The Decision Engine) */}
                    <div className="bg-white rounded-xl border border-gray-200 p-5">
                      <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wide mb-4 pb-2 border-b border-gray-100">Targets & Results</h3>
                      
                      {/* Other Costs - moved to top */}
                      <div className="mb-4">
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-sm text-gray-600">Other Costs</span>
                          <button 
                            className="text-xs text-[#FF6600] hover:text-[#e65c00] font-medium"
                            onClick={addOtherCost}
                            data-testid="button-add-other-cost"
                          >
                            + Add
                          </button>
                        </div>
                        
                        {otherCosts.length > 0 && (
                          <div className="space-y-2">
                            {otherCosts.map((cost) => (
                              <div key={cost.id} className="flex items-center gap-2">
                                <div className="flex-1 relative">
                                  <input 
                                    type="text"
                                    list={`cost-types-${cost.id}`}
                                    value={cost.type}
                                    onChange={(e) => updateOtherCost(cost.id, 'type', e.target.value)}
                                    placeholder="Select or type cost..."
                                    className="w-full px-3 py-2 text-sm border border-gray-200 rounded-md bg-white text-gray-700 focus:outline-none focus:ring-1 focus:ring-blue-500"
                                    data-testid={`input-other-cost-type-${cost.id}`}
                                  />
                                  <datalist id={`cost-types-${cost.id}`}>
                                    <option value="Wholesale Fee" />
                                    <option value="Acquisition Cost" />
                                    <option value="Short Sale Fee" />
                                    <option value="3rd Party Fee" />
                                    <option value="Agent Fee" />
                                    <option value="Sellers Closing Cost" />
                                    <option value="Due Diligence" />
                                  </datalist>
                                </div>
                                <input 
                                  type="text" 
                                  value={cost.amount}
                                  onChange={(e) => updateOtherCost(cost.id, 'amount', e.target.value)}
                                  placeholder="$0"
                                  className="w-24 px-3 py-2 text-sm text-right border border-gray-200 rounded-md bg-white focus:outline-none"
                                  data-testid={`input-other-cost-${cost.id}`}
                                />
                                <button 
                                  className="text-red-500 hover:text-red-600"
                                  onClick={() => removeOtherCost(cost.id)}
                                  data-testid={`button-remove-cost-${cost.id}`}
                                >
                                  ✕
                                </button>
                              </div>
                            ))}
                            {totalOtherCosts > 0 && (
                              <div className="text-xs text-gray-500 text-right">−${totalOtherCosts.toLocaleString()} reduces offer</div>
                            )}
                          </div>
                        )}
                      </div>
                      
                      {/* Target Profit Input Section */}
                      <div className="space-y-3 mb-4 pt-3 border-t border-gray-200">
                        <div>
                          <span className="text-sm text-gray-600 block mb-2">Target Profit Goal</span>
                          <div className="flex items-center gap-2">
                            <div className="w-20 flex items-center border border-gray-300 rounded-md bg-white overflow-hidden">
                              <input 
                                type="text" 
                                defaultValue="12" 
                                className="w-full px-2 py-2 text-sm text-right bg-transparent text-gray-700 focus:outline-none"
                                data-testid="input-target-profit-percent"
                              />
                              <div className="border-l border-gray-200 px-2 py-2 bg-gray-50">
                                <span className="text-xs text-gray-500 font-medium">%</span>
                              </div>
                            </div>
                            <span className="text-gray-400 text-sm">or</span>
                            <div className="flex-1 flex items-center border border-gray-300 rounded-md bg-white overflow-hidden">
                              <input 
                                type="text" 
                                defaultValue="$35,000" 
                                className="flex-1 px-3 py-2 text-sm text-right bg-transparent font-semibold text-gray-900 focus:outline-none"
                                data-testid="input-target-profit-amount"
                              />
                              <div className="border-l border-gray-200 px-2 py-2 bg-gray-50">
                                <span className="text-xs text-gray-500 font-medium">$</span>
                              </div>
                            </div>
                          </div>
                        </div>
                        
                        {/* Adjustment Table */}
                        <div className="bg-gray-50 border border-gray-200 rounded-lg p-3">
                          <div className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-2">Adjustments</div>
                          <div className="space-y-2">
                            <div className="flex items-center justify-between">
                              <span className="text-xs text-gray-600">$ Off Asking</span>
                              <input 
                                type="text" 
                                defaultValue="$35,000" 
                                className="w-20 px-2 py-1 text-xs text-right border border-gray-200 rounded bg-white focus:outline-none focus:ring-1 focus:ring-blue-500"
                                data-testid="input-adjust-off-asking-amount"
                              />
                            </div>
                            <div className="flex items-center justify-between">
                              <span className="text-xs text-gray-600">% Off Asking</span>
                              <div className="flex items-center gap-1">
                                <input 
                                  type="text" 
                                  defaultValue="17.5" 
                                  className="w-14 px-2 py-1 text-xs text-center border border-gray-200 rounded bg-white focus:outline-none focus:ring-1 focus:ring-blue-500"
                                  data-testid="input-adjust-off-asking-percent"
                                />
                                <span className="text-xs text-gray-400">%</span>
                              </div>
                            </div>
                          </div>
                        </div>
                        
                        {/* Calculate Button */}
                        <button 
                          className="w-full px-4 py-2.5 bg-[#FF6600] hover:bg-[#e65c00] text-white font-bold rounded-lg transition shadow-sm uppercase tracking-wide text-sm"
                          data-testid="button-calculate"
                        >
                          Calculate
                        </button>
                      </div>
                      
                      {/* The Results */}
                      <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 mb-4">
                        <div className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-1">Offer Price</div>
                        <div className="text-2xl font-bold text-gray-900">
                          ${(165000 - totalOtherCosts).toLocaleString()}
                        </div>
                        <div className="text-sm text-gray-500 mt-1">
                          {((165000 - totalOtherCosts) / 279900 * 100).toFixed(1)}% of ARV
                        </div>
                        <div className="text-sm text-gray-500">
                          {(((200000 - (165000 - totalOtherCosts)) / 200000) * 100).toFixed(1)}% off asking ($200,000)
                        </div>
                        {totalOtherCosts > 0 && (
                          <div className="text-xs text-gray-400 mt-1">
                            (−${totalOtherCosts.toLocaleString()} other costs)
                          </div>
                        )}
                      </div>
                      
                      {/* Deal Metrics */}
                      <div className="space-y-2 pt-3 border-t border-gray-200">
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-gray-600">Total Acquisition Cost</span>
                          <div className="text-right">
                            <span className="text-sm font-medium text-gray-700">${(166300 - totalOtherCosts).toLocaleString()}</span>
                            <span className="text-xs text-gray-500 ml-2">{((166300 - totalOtherCosts) / 279900 * 100).toFixed(1)}% ARV</span>
                          </div>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-gray-600">Total Project Cost</span>
                          <div className="text-right">
                            <span className="text-sm font-medium text-gray-700">${(216300 - totalOtherCosts).toLocaleString()}</span>
                            <span className="text-xs text-gray-500 ml-2">{((216300 - totalOtherCosts) / 279900 * 100).toFixed(1)}% ARV</span>
                          </div>
                        </div>
                        {loanProgram !== 'Cash' && (
                          <div className="flex items-center justify-between pt-2 border-t border-gray-100 mt-2">
                            <span className="text-sm font-medium text-gray-700">Total Project Cost w/ Financing</span>
                            <div className="text-right">
                              <span className="text-sm font-medium text-gray-700">${(216300 - totalOtherCosts + 8871).toLocaleString()}</span>
                              <span className="text-xs text-gray-500 ml-2">{((216300 - totalOtherCosts + 8871) / 279900 * 100).toFixed(1)}% ARV</span>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* COLUMN 3: Financing & Hold (The Funding) */}
                    <div className="bg-white rounded-xl border border-gray-200 p-5">
                      <div className="flex items-center justify-between mb-4 pb-2 border-b border-gray-100">
                        <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wide">Financing & Hold</h3>
                        <select 
                          className="px-3 py-1.5 text-sm border border-gray-200 rounded-md bg-white text-gray-700 focus:outline-none focus:ring-1 focus:ring-gray-400"
                          data-testid="select-loan-program"
                          value={loanProgram}
                          onChange={(e) => setLoanProgram(e.target.value)}
                        >
                          <option value="Cash">Cash</option>
                          <option value="Kiavi 75% ARV">Kiavi 75% ARV</option>
                          <option value="Hard Money 70% ARV">Hard Money 70% ARV</option>
                          <option value="Hard Money 75% ARV">Hard Money 75% ARV</option>
                          <option value="Private Money">Private Money</option>
                          <option value="Conventional">Conventional</option>
                          <option value="Seller Financing">Seller Financing</option>
                        </select>
                      </div>
                      
                      {loanProgram === 'Cash' ? (
                        <div className="text-center py-8 text-gray-500">
                          <p className="text-sm">No financing costs for cash purchase</p>
                        </div>
                      ) : (
                        <div className="space-y-3">
                          <div className="flex items-center justify-between">
                            <span className="text-sm text-gray-600">Hold Time</span>
                            <div className="flex items-center gap-1">
                              <input 
                                type="text" 
                                defaultValue="4" 
                                className="w-14 px-3 py-1.5 text-sm text-right border border-gray-200 rounded-md bg-white focus:outline-none focus:ring-1 focus:ring-blue-500"
                                data-testid="input-hold-time"
                              />
                              <span className="text-xs text-gray-400">months</span>
                            </div>
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="text-sm text-gray-600">Total Loan Principal</span>
                            <input 
                              type="text" 
                              defaultValue="$209,925" 
                              className="w-28 px-3 py-1.5 text-sm text-right border border-gray-200 rounded-md bg-gray-100 text-gray-600 focus:outline-none"
                              readOnly
                              data-testid="input-loan-principal"
                            />
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="text-sm text-gray-600">Origination Points</span>
                            <input 
                              type="text" 
                              defaultValue="$1,574" 
                              className="w-28 px-3 py-1.5 text-sm text-right border border-gray-200 rounded-md bg-white focus:outline-none focus:ring-1 focus:ring-blue-500"
                              data-testid="input-origination-points"
                            />
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="text-sm text-gray-600">Lender Fees</span>
                            <input 
                              type="text" 
                              defaultValue="$999" 
                              className="w-28 px-3 py-1.5 text-sm text-right border border-gray-200 rounded-md bg-white focus:outline-none focus:ring-1 focus:ring-blue-500"
                              data-testid="input-lender-fees"
                            />
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="text-sm text-gray-600">Projected Interest Expense</span>
                            <input 
                              type="text" 
                              defaultValue="$6,298" 
                              className="w-28 px-3 py-1.5 text-sm text-right border border-gray-200 rounded-md bg-gray-100 text-gray-600 focus:outline-none"
                              readOnly
                              data-testid="input-interest-expense"
                            />
                          </div>
                          <div className="flex items-center justify-between pt-2 border-t border-gray-100 mt-2">
                            <span className="text-sm font-semibold text-gray-700">Total Financing Costs</span>
                            <input 
                              type="text" 
                              defaultValue="$8,871" 
                              className="w-28 px-3 py-1.5 text-sm text-right border border-gray-300 rounded-md bg-gray-100 font-semibold text-gray-700 focus:outline-none"
                              readOnly
                              data-testid="input-total-financing-costs"
                            />
                          </div>
                          <div className="flex items-center justify-between pt-2 mt-2">
                            <span className="text-sm font-semibold text-gray-700">Levered Profit</span>
                            <input 
                              type="text" 
                              defaultValue="$40,734" 
                              className="w-28 px-3 py-1.5 text-sm text-right border border-gray-300 rounded-md bg-gray-100 font-semibold text-gray-900 focus:outline-none"
                              readOnly
                              data-testid="input-levered-profit"
                            />
                          </div>
                        </div>
                      )}
                    </div>

                  </div>
                </div>
              )}

            </div>
          </div>

        </main>

        <div className="fixed bottom-6 right-6">
          <button className="w-12 h-12 bg-blue-600 hover:bg-blue-700 rounded-full shadow-lg flex items-center justify-center text-white">
            <MessageSquare className="w-6 h-6" />
          </button>
        </div>

        {/* Comp Detail Modal */}
        {selectedComp && (
          <div className="fixed inset-0 z-50 flex items-start justify-end">
            <div 
              className="absolute inset-0 bg-black/50" 
              onClick={() => setSelectedComp(null)}
            />
            <div className="relative bg-white shadow-2xl w-full max-w-xl h-full overflow-y-auto animate-in slide-in-from-right duration-300">
              <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between z-10">
                <div className="flex items-center gap-3">
                  <span className="text-lg font-bold text-gray-900">{selectedComp.address}</span>
                  <span className={cn(
                    "px-2 py-0.5 text-xs font-bold rounded",
                    selectedComp.listingStatus === 'Closed' ? "bg-red-100 text-red-700" : "bg-green-100 text-green-700"
                  )}>
                    {selectedComp.listingStatus}
                  </span>
                  <span className="text-sm text-gray-500">{selectedComp.closingDate}</span>
                </div>
                <button 
                  onClick={() => setSelectedComp(null)}
                  className="p-2 hover:bg-gray-100 rounded-full transition"
                  data-testid="button-close-comp-detail"
                >
                  <X className="w-5 h-5 text-gray-500" />
                </button>
              </div>

              <div className="px-6 py-4 border-b border-gray-200 flex justify-between">
                <button 
                  onClick={handlePrevComp}
                  disabled={selectedCompIndex === 0}
                  className={cn(
                    "px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium transition",
                    selectedCompIndex === 0 ? "opacity-50 cursor-not-allowed" : "hover:bg-gray-50"
                  )}
                  data-testid="button-prev-comp"
                >
                  Previous
                </button>
                <button 
                  onClick={handleNextComp}
                  disabled={selectedCompIndex === comps.length - 1}
                  className={cn(
                    "px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium transition",
                    selectedCompIndex === comps.length - 1 ? "opacity-50 cursor-not-allowed" : "hover:bg-gray-50"
                  )}
                  data-testid="button-next-comp"
                >
                  Next
                </button>
              </div>

              <div className="p-6">

                {/* WHY KEEPING / WHY REMOVING Section */}
                {selectedComp.keep ? (
                  <div className="mb-6 bg-green-50 border border-green-200 rounded-lg p-4">
                    <h3 className="text-sm font-bold text-green-800 mb-3 flex items-center gap-2">
                      <span className="text-green-600">✓</span> WHY KEEPING THIS COMP
                    </h3>
                    <div className="border-t border-green-200 pt-3">
                      <ul className="space-y-2">
                        {selectedComp.whyKeep.map((reason, idx) => (
                          <li key={idx} className="flex items-start gap-2 text-sm text-green-700">
                            <span className="text-green-600 mt-0.5">✓</span>
                            <span>{reason}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                ) : (
                  <div className="mb-6 bg-red-50 border border-red-200 rounded-lg p-4">
                    <h3 className="text-sm font-bold text-red-800 mb-3 flex items-center gap-2">
                      <span className="text-red-600">✗</span> WHY REMOVING THIS COMP
                    </h3>
                    <div className="border-t border-red-200 pt-3">
                      <ul className="space-y-2">
                        {selectedComp.whyRemove.map((reason, idx) => (
                          <li key={idx} className="flex items-start gap-2 text-sm text-red-700">
                            <span className="text-red-600 mt-0.5">✗</span>
                            <span>{reason}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                )}

                {/* Keep/Remove Action Buttons */}
                <div className="mb-6 flex gap-3">
                  <button
                    onClick={() => {
                      if (!selectedComp.keep) {
                        setComps(prev => prev.map(c => c.id === selectedComp.id ? { ...c, keep: true } : c));
                        setSelectedComp(prev => prev ? { ...prev, keep: true } : null);
                      }
                    }}
                    className={cn(
                      "flex-1 py-2.5 rounded-lg text-sm font-bold transition flex items-center justify-center gap-2",
                      selectedComp.keep 
                        ? "bg-green-600 text-white" 
                        : "bg-white border-2 border-green-600 text-green-600 hover:bg-green-50"
                    )}
                    data-testid="button-keep-comp"
                  >
                    <span>✓</span> Keep
                  </button>
                  <button
                    onClick={() => {
                      if (selectedComp.keep) {
                        setComps(prev => prev.map(c => c.id === selectedComp.id ? { ...c, keep: false } : c));
                        setSelectedComp(prev => prev ? { ...prev, keep: false } : null);
                      }
                    }}
                    className={cn(
                      "flex-1 py-2.5 rounded-lg text-sm font-bold transition flex items-center justify-center gap-2",
                      !selectedComp.keep 
                        ? "bg-red-600 text-white" 
                        : "bg-white border-2 border-red-600 text-red-600 hover:bg-red-50"
                    )}
                    data-testid="button-remove-comp"
                  >
                    <span>✗</span> Remove
                  </button>
                </div>

                {/* Property Details Grid */}
                <div className="grid grid-cols-2 gap-x-8 gap-y-3 mb-6 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-500">R_ID:</span>
                    <span className="font-medium text-gray-900">{selectedComp.id}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Price:</span>
                    <span className="font-medium text-gray-900">${selectedComp.price.toLocaleString()} / $515,000</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Price/Sqft:</span>
                    <span className="font-medium text-gray-900">${selectedComp.pricePerSqft.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Bed/Bath:</span>
                    <span className="font-medium text-gray-900">{selectedComp.bedBath}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Size:</span>
                    <span className="font-medium text-gray-900">{selectedComp.size.toLocaleString()} sqft</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Lot Size:</span>
                    <span className="font-medium text-gray-900">{selectedComp.lotSize.toLocaleString()} sqft</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Year Built:</span>
                    <span className="font-medium text-gray-900">{selectedComp.yearBuilt}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Garage:</span>
                    <span className="font-medium text-gray-900">{selectedComp.garage}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">DOM/CDOM:</span>
                    <span className="font-medium text-gray-900">{selectedComp.domCdom}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Pool:</span>
                    <span className="font-medium text-gray-900 text-right max-w-[150px] truncate" title={selectedComp.pool}>{selectedComp.pool}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Distance:</span>
                    <span className="font-medium text-gray-900">{selectedComp.distance}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Finance Type:</span>
                    <span className="font-medium text-gray-900">{selectedComp.financeType}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Closing Date:</span>
                    <span className="font-medium text-gray-900">{selectedComp.closingDate}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Last Update:</span>
                    <span className="font-medium text-gray-900">{new Date(selectedComp.lastUpdate).toLocaleDateString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Listing ID:</span>
                    <span className="font-medium text-gray-900">{selectedComp.listingId}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Listing Status:</span>
                    <span className="font-medium text-gray-900">{selectedComp.listingStatus}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Type:</span>
                    <span className="font-medium text-gray-900">{selectedComp.type}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Conditions:</span>
                    <span className="font-medium text-gray-900">{selectedComp.conditions}</span>
                  </div>
                </div>

                {/* Agent Section */}
                <div className="border border-gray-200 rounded-lg p-4 mb-6">
                  <h3 className="text-sm font-bold text-gray-700 mb-3">Agent</h3>
                  <div className="grid grid-cols-2 gap-3 text-sm">
                    <div className="flex items-center gap-2">
                      <span className="text-gray-500">Name:</span>
                      <span className="font-medium text-gray-900">{selectedComp.agent.name}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Mail className="w-4 h-4 text-gray-400" />
                      <a href={`mailto:${selectedComp.agent.email}`} className="text-blue-600 hover:underline">{selectedComp.agent.email}</a>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-gray-500">ID:</span>
                      <span className="font-medium text-gray-900">{selectedComp.agent.id}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Phone className="w-4 h-4 text-gray-400" />
                      <span className="font-medium text-gray-900">{selectedComp.agent.phone}</span>
                    </div>
                    <div className="flex items-center gap-2 col-span-2">
                      <Building2 className="w-4 h-4 text-gray-400" />
                      <span className="text-gray-500">Office:</span>
                      <span className="font-medium text-gray-900">{selectedComp.agent.office}</span>
                    </div>
                  </div>
                  <button className="mt-3 w-full py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition flex items-center justify-center gap-2">
                    <ExternalLink className="w-4 h-4" />
                    See more info
                  </button>
                </div>

                {/* Agent Remarks */}
                <div className="mb-6">
                  <h3 className="text-sm font-bold text-gray-700 mb-2">Agent Remarks:</h3>
                  <p className="text-sm text-gray-600 leading-relaxed whitespace-pre-wrap">{selectedComp.agentRemarks}</p>
                </div>

                {/* Public Remarks */}
                <div className="mb-6">
                  <h3 className="text-sm font-bold text-gray-700 mb-2">Public Remarks:</h3>
                  <p className="text-sm text-gray-600 leading-relaxed">{selectedComp.publicRemarks}</p>
                </div>

                {/* Conditions Dropdown */}
                <div className="mb-4">
                  <label className="text-sm font-bold text-gray-700 mb-2 block">Conditions:</label>
                  <select 
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    data-testid="select-comp-conditions"
                  >
                    <option>Select condition...</option>
                    <option>Standard</option>
                    <option>REO/Bank Owned</option>
                    <option>Short Sale</option>
                    <option>Probate</option>
                  </select>
                </div>

                {/* Status Dropdown */}
                <div className="mb-4">
                  <label className="text-sm font-bold text-gray-700 mb-2 block">Status:</label>
                  <select 
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    data-testid="select-comp-status"
                  >
                    <option>Select status...</option>
                    <option>Include</option>
                    <option>Exclude</option>
                    <option>Primary</option>
                  </select>
                </div>

                {/* Influences Section */}
                <div className="border-t border-gray-200 pt-4">
                  <h3 className="text-sm font-bold text-gray-700 mb-3">INFLUENCES</h3>
                  <div className="text-sm text-gray-500">No influences recorded</div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
      </>
  );
}

export default function PIQ() {
  return <PIQContent />;
}
