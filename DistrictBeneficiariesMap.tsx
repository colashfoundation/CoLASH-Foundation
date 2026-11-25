import React, { useEffect, useMemo, useState, useCallback, useRef } from 'react';
import {
  APIProvider,
  Map as GoogleMap,
  AdvancedMarker,
  Pin,
  InfoWindow,
  useAdvancedMarkerRef,
  useMap,
  useMapsLibrary,
  useApiLoadingStatus,
  APILoadingStatus,
} from '@vis.gl/react-google-maps';
import {
  MapPin,
  Users,
  Building2,
  Navigation,
  ExternalLink,
  RotateCcw,
  Phone,
  AlertCircle,
  Loader2,
  Compass,
} from 'lucide-react';
import { BangladeshBranch, Language, MapConfig, Project } from '../types';
import { INITIAL_MAP_CONFIG, INITIAL_PROJECTS } from '../data/mockData';
import { INITIAL_BANGLADESH_BRANCHES, BANGLADESH_DIVISIONS_DISTRICTS } from '../data/bangladeshBranches';
import { formatNumberForLang } from '../utils/liveStats';

interface DistrictBeneficiariesMapProps {
  mapConfig?: MapConfig;
  projects?: Project[];
  language: Language;
  className?: string;
}

interface DistrictDistributionNode {
  id: string;
  districtBn: string;
  districtEn: string;
  divisionId: string;
  divisionBn: string;
  divisionEn: string;
  branchNameBn: string;
  branchNameEn: string;
  addressQuery: string;
  displayAddressBn: string;
  displayAddressEn: string;
  landmarkBn?: string;
  landmarkEn?: string;
  coordinatorBn: string;
  coordinatorEn: string;
  phone?: string;
  status: BangladeshBranch['status'];
  volunteersCount: number;
  beneficiariesCount: number;
  matchedProjectsCount: number;
  matchedProjectTitlesBn: string[];
  matchedProjectTitlesEn: string[];
  directionsUrl?: string;
}

interface ResolvedPlaceLocation {
  lat: number;
  lng: number;
  placeId?: string;
  formattedAddress?: string;
  cachedAt: number;
}

const PLACES_CACHE_KEY = 'colash_district_places_cache_v1';
const CACHE_TTL_MS = 7 * 24 * 60 * 60 * 1000; // 7 days (well within 30-day ToS limit)

const EXTRA_PROJECT_DISTRICT_TEMPLATES: Array<{
  id: string;
  districtBn: string;
  districtEn: string;
  divisionId: string;
  divisionBn: string;
  divisionEn: string;
  addressQuery: string;
  matchTokens: string[];
}> = [
  {
    id: 'proj-dist-sunamganj',
    districtBn: 'সুনামগঞ্জ',
    districtEn: 'Sunamganj',
    divisionId: 'sylhet',
    divisionBn: 'সিলেট বিভাগ',
    divisionEn: 'Sylhet Division',
    addressQuery: 'Sunamganj, Sylhet Division, Bangladesh',
    matchTokens: ['sunamganj', 'সুনামগঞ্জ'],
  },
  {
    id: 'proj-dist-habiganj',
    districtBn: 'হবিগঞ্জ',
    districtEn: 'Habiganj',
    divisionId: 'sylhet',
    divisionBn: 'সিলেট বিভাগ',
    divisionEn: 'Sylhet Division',
    addressQuery: 'Habiganj, Sylhet Division, Bangladesh',
    matchTokens: ['habiganj', 'হবিগঞ্জ'],
  },
];

function readPlacesCache(): Record<string, ResolvedPlaceLocation> {
  try {
    const raw = localStorage.getItem(PLACES_CACHE_KEY);
    if (!raw) return {};
    const parsed = JSON.parse(raw) as Record<string, ResolvedPlaceLocation>;
    if (!parsed || typeof parsed !== 'object') return {};
    const now = Date.now();
    const valid: Record<string, ResolvedPlaceLocation> = {};
    for (const key of Object.keys(parsed)) {
      const entry = parsed[key];
      if (
        entry &&
        typeof entry.lat === 'number' &&
        typeof entry.lng === 'number' &&
        typeof entry.cachedAt === 'number' &&
        now - entry.cachedAt < CACHE_TTL_MS
      ) {
        valid[key] = entry;
      }
    }
    return valid;
  } catch {
    return {};
  }
}

function writePlacesCache(cache: Record<string, ResolvedPlaceLocation>): void {
  try {
    localStorage.setItem(PLACES_CACHE_KEY, JSON.stringify(cache));
  } catch {
    // Ignore localStorage quota failures gracefully
  }
}

function getDivisionIdFromName(divisionEn: string): string {
  const lower = divisionEn.toLowerCase();
  const matched = BANGLADESH_DIVISIONS_DISTRICTS.find(
    (d) =>
      d.nameEn.toLowerCase() === lower ||
      lower.includes(d.id.toLowerCase()) ||
      d.nameEn.toLowerCase().includes(lower.replace(' division', '').trim())
  );
  return matched ? matched.id : 'other';
}

function getDistrictTokens(districtEn: string, districtBn: string, upazilaEn?: string): string[] {
  const tokens = [districtEn.toLowerCase(), districtBn.toLowerCase()];
  if (districtEn.toLowerCase() === 'moulvibazar') {
    tokens.push('kamalganj', 'কমলগঞ্জ', 'sreemangal', 'শ্রীমঙ্গল', 'মৌলভীবাজার');
  }
  if (upazilaEn) {
    const firstWord = upazilaEn.split(/[\s(/]+/)[0]?.toLowerCase();
    if (firstWord && firstWord.length > 3) tokens.push(firstWord);
  }
  return tokens;
}

function getStatusMeta(status: BangladeshBranch['status'], language: Language) {
  switch (status) {
    case 'active_hq':
      return {
        label: language === 'bn' ? 'কেন্দ্রীয় কার্যালয়' : 'Central HQ',
        badgeClass:
          'bg-[#102B3F] text-[#D6F36A] border-[#102B3F] dark:bg-[#D6F36A] dark:text-[#102B3F]',
        pinBg: '#102B3F',
        pinBorder: '#D6F36A',
        pinGlyph: '#D6F36A',
        scale: 1.32,
      };
    case 'active_branch':
      return {
        label: language === 'bn' ? 'সক্রিয় শাখা' : 'Active Branch',
        badgeClass:
          'bg-emerald-50 text-emerald-800 border-emerald-200 dark:bg-emerald-950/50 dark:text-emerald-300 dark:border-emerald-800',
        pinBg: '#167D78',
        pinBorder: '#0f5c58',
        pinGlyph: '#FFFFFF',
        scale: 1.15,
      };
    case 'establishing':
      return {
        label: language === 'bn' ? 'গঠন প্রক্রিয়াধীন' : 'Establishing',
        badgeClass:
          'bg-amber-50 text-amber-800 border-amber-200 dark:bg-amber-950/50 dark:text-amber-300 dark:border-amber-800',
        pinBg: '#E6A15B',
        pinBorder: '#b87633',
        pinGlyph: '#102B3F',
        scale: 1.02,
      };
    default:
      return {
        label: language === 'bn' ? 'সম্প্রসারণ জোন' : 'Expansion Hub',
        badgeClass:
          'bg-stone-100 text-stone-700 border-stone-200 dark:bg-stone-800 dark:text-stone-300 dark:border-stone-700',
        pinBg: '#64748b',
        pinBorder: '#475569',
        pinGlyph: '#FFFFFF',
        scale: 0.92,
      };
  }
}

interface DistrictMarkerPinProps {
  node: DistrictDistributionNode;
  position: google.maps.LatLngLiteral;
  isSelected: boolean;
  isHovered: boolean;
  zIndex: number;
  language: Language;
  onSelect: (id: string, marker: google.maps.marker.AdvancedMarkerElement | null) => void;
  onRegisterMarker: (id: string, marker: google.maps.marker.AdvancedMarkerElement | null) => void;
}

const DistrictMarkerPin: React.FC<DistrictMarkerPinProps> = ({
  node,
  position,
  isSelected,
  isHovered,
  zIndex,
  language,
  onSelect,
  onRegisterMarker,
}) => {
  const [markerRef, marker] = useAdvancedMarkerRef();
  const meta = getStatusMeta(node.status, language);

  useEffect(() => {
    onRegisterMarker(node.id, marker);
  }, [node.id, marker, onRegisterMarker]);

  const pinScale = isSelected ? meta.scale + 0.18 : isHovered ? meta.scale + 0.1 : meta.scale;

  return (
    <AdvancedMarker
      ref={markerRef}
      position={position}
      zIndex={zIndex}
      title={`${language === 'bn' ? node.districtBn : node.districtEn} — ${formatNumberForLang(node.beneficiariesCount, language)} ${language === 'bn' ? 'উপকারভোগী' : 'beneficiaries'}`}
      onClick={() => onSelect(node.id, marker)}
    >
      <Pin
        background={isSelected ? '#D6F36A' : meta.pinBg}
        borderColor={isSelected ? '#102B3F' : meta.pinBorder}
        glyphColor={isSelected ? '#102B3F' : meta.pinGlyph}
        scale={pinScale}
      />
    </AdvancedMarker>
  );
};

interface MapCameraControllerProps {
  positions: Record<string, ResolvedPlaceLocation>;
  visibleNodes: DistrictDistributionNode[];
  selectedId: string | null;
  resetSignal: number;
}

const MapCameraController: React.FC<MapCameraControllerProps> = ({
  positions,
  visibleNodes,
  selectedId,
  resetSignal,
}) => {
  const map = useMap();
  const coreLib = useMapsLibrary('core');
  const prevVisibleCountRef = useRef<number>(0);

  const fitAllVisible = useCallback(() => {
    if (!map || !coreLib) return;
    const validCoords = visibleNodes
      .map((n) => positions[n.id])
      .filter((loc): loc is ResolvedPlaceLocation => Boolean(loc));

    if (validCoords.length === 0) return;

    if (validCoords.length === 1) {
      map.panTo({ lat: validCoords[0].lat, lng: validCoords[0].lng });
      map.setZoom(10);
      return;
    }

    const bounds = new coreLib.LatLngBounds();
    for (const loc of validCoords) {
      bounds.extend({ lat: loc.lat, lng: loc.lng });
    }
    map.fitBounds(bounds, { top: 48, right: 48, bottom: 48, left: 48 });
  }, [map, coreLib, visibleNodes, positions]);

  useEffect(() => {
    if (!map || !coreLib) return;
    const validCount = visibleNodes.filter((n) => Boolean(positions[n.id])).length;
    if (validCount > 0 && validCount !== prevVisibleCountRef.current) {
      prevVisibleCountRef.current = validCount;
      fitAllVisible();
    }
  }, [map, coreLib, visibleNodes, positions, fitAllVisible]);

  useEffect(() => {
    if (resetSignal > 0) {
      fitAllVisible();
    }
  }, [resetSignal, fitAllVisible]);

  useEffect(() => {
    if (!map || !selectedId) return;
    const loc = positions[selectedId];
    if (!loc) return;
    map.panTo({ lat: loc.lat, lng: loc.lng });
    const currentZoom = map.getZoom();
    if (typeof currentZoom === 'number' && currentZoom < 8) {
      map.setZoom(9);
    }
  }, [map, selectedId, positions]);

  return null;
};

interface DistrictBeneficiariesMapInnerProps {
  nodes: DistrictDistributionNode[];
  mapConfig: MapConfig;
  language: Language;
  className: string;
  hasApiKey: boolean;
}

const DistrictBeneficiariesMapInner: React.FC<DistrictBeneficiariesMapInnerProps> = ({
  nodes,
  mapConfig,
  language,
  className,
  hasApiKey,
}) => {
  const placesLib = useMapsLibrary('places');
  const apiStatus = useApiLoadingStatus();

  const [positions, setPositions] = useState<Record<string, ResolvedPlaceLocation>>(() => {
    const cached = readPlacesCache();
    const initial: Record<string, ResolvedPlaceLocation> = {};
    for (const node of nodes) {
      if (cached[node.addressQuery]) {
        initial[node.id] = cached[node.addressQuery];
      }
    }
    return initial;
  });

  const [isResolvingPlaces, setIsResolvingPlaces] = useState(false);
  const [selectedDivision, setSelectedDivision] = useState<string>('all');
  const [selectedStatus, setSelectedStatus] = useState<'all' | 'active' | 'expanding'>('all');
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [hoveredId, setHoveredId] = useState<string | null>(null);
  const [resetSignal, setResetSignal] = useState(0);
  const [markerInstances, setMarkerInstances] = useState<
    Record<string, google.maps.marker.AdvancedMarkerElement | null>
  >({});

  const registerMarker = useCallback(
    (id: string, marker: google.maps.marker.AdvancedMarkerElement | null) => {
      setMarkerInstances((prev) => {
        if (prev[id] === marker) return prev;
        return { ...prev, [id]: marker };
      });
    },
    []
  );

  // Dynamically resolve coordinates using Places API (New) Place.searchByText()
  useEffect(() => {
    if (!hasApiKey || !placesLib) return;
    let isCancelled = false;

    const resolveMissing = async () => {
      const cache = readPlacesCache();
      const missingNodes = nodes.filter(
        (node) => !positions[node.id] && !cache[node.addressQuery]
      );

      // Sync any cache hits first
      const cacheHits: Record<string, ResolvedPlaceLocation> = {};
      for (const node of nodes) {
        if (!positions[node.id] && cache[node.addressQuery]) {
          cacheHits[node.id] = cache[node.addressQuery];
        }
      }
      if (Object.keys(cacheHits).length > 0 && !isCancelled) {
        setPositions((prev) => ({ ...prev, ...cacheHits }));
      }

      if (missingNodes.length === 0) return;
      setIsResolvingPlaces(true);

      const updatedCache = { ...cache };
      for (const node of missingNodes) {
        if (isCancelled) break;
        try {
          const request: google.maps.places.SearchByTextRequest & {
            internalUsageAttributionIds?: string[];
          } = {
            textQuery: node.addressQuery,
            fields: ['displayName', 'location', 'formattedAddress'],
            maxResultCount: 1,
            language: language === 'bn' ? 'bn' : 'en',
            region: 'bd',
            internalUsageAttributionIds: ['gmp_mcp_codeassist_v1_aistudio'],
          };

          const { places } = await placesLib.Place.searchByText(request);
          const firstPlace = places?.[0];
          const loc = firstPlace?.location;
          if (loc && !isCancelled) {
            const resolved: ResolvedPlaceLocation = {
              lat: typeof loc.lat === 'function' ? loc.lat() : Number(loc.lat),
              lng: typeof loc.lng === 'function' ? loc.lng() : Number(loc.lng),
              placeId: firstPlace.id || undefined,
              formattedAddress: firstPlace.formattedAddress || undefined,
              cachedAt: Date.now(),
            };
            updatedCache[node.addressQuery] = resolved;
            setPositions((prev) => ({ ...prev, [node.id]: resolved }));
          }
        } catch (err) {
          const message = err instanceof Error ? err.message : String(err);
          const lower = message.toLowerCase();
          if (
            lower.includes('resource_exhausted') ||
            lower.includes('over_query_limit') ||
            lower.includes('quota') ||
            lower.includes('429')
          ) {
            window.dispatchEvent(new CustomEvent('gmp-quota-exceeded'));
            break;
          }
        }
      }

      writePlacesCache(updatedCache);
      if (!isCancelled) {
        setIsResolvingPlaces(false);
      }
    };

    void resolveMissing();
    return () => {
      isCancelled = true;
    };
  }, [hasApiKey, placesLib, nodes, language, positions]);

  const divisionOptions = useMemo(() => {
    const seen: Record<string, { id: string; bn: string; en: string }> = {};
    for (const node of nodes) {
      if (!seen[node.divisionId]) {
        seen[node.divisionId] = {
          id: node.divisionId,
          bn: node.divisionBn.replace(' বিভাগ', ''),
          en: node.divisionEn.replace(' Division', ''),
        };
      }
    }
    return Object.values(seen);
  }, [nodes]);

  const filteredNodes = useMemo(() => {
    return nodes
      .filter((node) => {
        const matchesDivision = selectedDivision === 'all' || node.divisionId === selectedDivision;
        const matchesStatus =
          selectedStatus === 'all' ||
          (selectedStatus === 'active' &&
            (node.status === 'active_hq' || node.status === 'active_branch')) ||
          (selectedStatus === 'expanding' &&
            (node.status === 'establishing' || node.status === 'upcoming'));
        return matchesDivision && matchesStatus;
      })
      .sort((a, b) => b.beneficiariesCount - a.beneficiariesCount);
  }, [nodes, selectedDivision, selectedStatus]);

  const totalFilteredBeneficiaries = useMemo(
    () => filteredNodes.reduce((sum, n) => sum + n.beneficiariesCount, 0),
    [filteredNodes]
  );

  const maxBeneficiaries = useMemo(
    () => Math.max(1, ...filteredNodes.map((n) => n.beneficiariesCount)),
    [filteredNodes]
  );

  const activeHubsCount = useMemo(
    () =>
      filteredNodes.filter(
        (n) => n.status === 'active_hq' || n.status === 'active_branch'
      ).length,
    [filteredNodes]
  );

  const initialCenter = useMemo<google.maps.LatLngLiteral | null>(() => {
    const hqPos = positions['br-hq-kamalganj'];
    if (hqPos) return { lat: hqPos.lat, lng: hqPos.lng };
    for (const node of nodes) {
      const pos = positions[node.id];
      if (pos) return { lat: pos.lat, lng: pos.lng };
    }
    return null;
  }, [positions, nodes]);

  const sortedMarkersForZIndex = useMemo(() => {
    return [...filteredNodes]
      .filter((n) => Boolean(positions[n.id]))
      .sort((a, b) => (positions[b.id]?.lat ?? 0) - (positions[a.id]?.lat ?? 0));
  }, [filteredNodes, positions]);

  const selectedNode = useMemo(
    () => filteredNodes.find((n) => n.id === selectedId) || null,
    [filteredNodes, selectedId]
  );

  const selectedMarkerInstance = selectedNode ? markerInstances[selectedNode.id] : null;
  const selectedPosition = selectedNode ? positions[selectedNode.id] : null;

  const isApiFailed =
    apiStatus === APILoadingStatus.FAILED || apiStatus === APILoadingStatus.AUTH_FAILURE;

  const handleSelectDistrict = useCallback((id: string) => {
    setSelectedId((prev) => (prev === id ? null : id));
  }, []);

  const handleResetView = useCallback(() => {
    setSelectedId(null);
    setSelectedDivision('all');
    setSelectedStatus('all');
    setResetSignal((s) => s + 1);
  }, []);

  const getGoogleMapsExternalUrl = (node: DistrictDistributionNode, pos?: ResolvedPlaceLocation) => {
    if (pos?.placeId) {
      return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
        node.addressQuery
      )}&query_place_id=${encodeURIComponent(pos.placeId)}`;
    }
    if (node.directionsUrl) return node.directionsUrl;
    return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
      node.addressQuery
    )}`;
  };

  return (
    <div
      className={`p-5 sm:p-7 rounded-2xl bg-white dark:bg-[#0c1a24] border border-stone-200/90 dark:border-stone-800 shadow-xs transition-colors ${className}`}
      aria-labelledby="district-beneficiaries-map-heading"
    >
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-4 pb-5 mb-5 border-b border-stone-200/80 dark:border-stone-800">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-[#167D78] dark:text-[#D6F36A] mb-1">
            <Compass className="w-4 h-4" />
            <span>
              {language === 'bn'
                ? 'জেলাভিত্তিক উপকারভোগী মানচিত্র'
                : 'District-Wise Reach & Branch Telemetry'}
            </span>
          </div>
          <h3
            id="district-beneficiaries-map-heading"
            className="text-lg sm:text-xl font-extrabold text-[#102B3F] dark:text-white"
          >
            {language === 'bn'
              ? 'বাংলাদেশের জেলাসমূহে কোলাশ উপকারভোগী ও শাখা বণ্টন'
              : 'CoLASH District Beneficiaries & Nationwide Branch Map'}
          </h3>
          <p className="text-xs text-stone-500 dark:text-stone-400 mt-0.5 max-w-2xl">
            {language === 'bn'
              ? `কেন্দ্রীয় কার্যালয় (${mapConfig.address}) ও আঞ্চলিক শাখাসমূহের মাধ্যমে সরাসরি সহায়তা প্রাপ্ত উপকারভোগীদের ভৌগোলিক চিত্র।`
              : `Visualizing CoLASH community beneficiaries reached across districts anchored from ${mapConfig.address}.`}
          </p>
        </div>

        {/* Summary KPI Chips */}
        <div className="flex flex-wrap items-center gap-2.5 text-xs">
          <div className="px-3.5 py-2 rounded-xl bg-stone-50 dark:bg-stone-900/70 border border-stone-200/80 dark:border-stone-800">
            <span className="text-stone-500 dark:text-stone-400">
              {language === 'bn' ? 'জেলা কভারেজ:' : 'Districts:'}{' '}
            </span>
            <span className="font-extrabold text-[#102B3F] dark:text-white tabular-nums">
              {formatNumberForLang(filteredNodes.length, language)}
            </span>
          </div>
          <div className="px-3.5 py-2 rounded-xl bg-teal-50/70 dark:bg-teal-950/40 border border-teal-200/80 dark:border-teal-800/60">
            <span className="text-stone-600 dark:text-stone-300">
              {language === 'bn' ? 'মোট উপকারভোগী:' : 'Beneficiaries:'}{' '}
            </span>
            <span className="font-extrabold text-[#167D78] dark:text-[#D6F36A] tabular-nums">
              {formatNumberForLang(totalFilteredBeneficiaries, language)}
            </span>
          </div>
          <div className="px-3.5 py-2 rounded-xl bg-stone-50 dark:bg-stone-900/70 border border-stone-200/80 dark:border-stone-800">
            <span className="text-stone-500 dark:text-stone-400">
              {language === 'bn' ? 'সক্রিয় কেন্দ্র:' : 'Active Hubs:'}{' '}
            </span>
            <span className="font-extrabold text-[#102B3F] dark:text-white tabular-nums">
              {formatNumberForLang(activeHubsCount, language)}
            </span>
          </div>
        </div>
      </div>

      {/* Filters Toolbar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 mb-5">
        <div className="flex flex-wrap items-center gap-1.5">
          <button
            type="button"
            onClick={() => {
              setSelectedDivision('all');
              setSelectedId(null);
            }}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors cursor-pointer ${
              selectedDivision === 'all'
                ? 'bg-[#102B3F] text-[#D6F36A]'
                : 'bg-stone-100 dark:bg-stone-900 text-stone-600 dark:text-stone-300 hover:bg-stone-200 dark:hover:bg-stone-800'
            }`}
          >
            {language === 'bn' ? 'সকল বিভাগ' : 'All Divisions'}
          </button>
          {divisionOptions.map((div) => (
            <button
              key={div.id}
              type="button"
              onClick={() => {
                setSelectedDivision(div.id);
                setSelectedId(null);
              }}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors cursor-pointer ${
                selectedDivision === div.id
                  ? 'bg-[#167D78] text-white'
                  : 'bg-stone-100 dark:bg-stone-900 text-stone-600 dark:text-stone-300 hover:bg-stone-200 dark:hover:bg-stone-800'
              }`}
            >
              {language === 'bn' ? div.bn : div.en}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-2 self-start md:self-auto">
          <div className="flex items-center gap-1 p-1 bg-stone-100 dark:bg-stone-900 rounded-xl border border-stone-200/70 dark:border-stone-800 text-xs font-bold">
            <button
              type="button"
              onClick={() => {
                setSelectedStatus('all');
                setSelectedId(null);
              }}
              className={`px-2.5 py-1 rounded-lg cursor-pointer transition-colors ${
                selectedStatus === 'all'
                  ? 'bg-white dark:bg-[#102B3F] text-[#102B3F] dark:text-white shadow-xs'
                  : 'text-stone-500 dark:text-stone-400'
              }`}
            >
              {language === 'bn' ? 'সকল' : 'All'}
            </button>
            <button
              type="button"
              onClick={() => {
                setSelectedStatus('active');
                setSelectedId(null);
              }}
              className={`px-2.5 py-1 rounded-lg cursor-pointer transition-colors ${
                selectedStatus === 'active'
                  ? 'bg-white dark:bg-[#102B3F] text-[#167D78] dark:text-[#D6F36A] shadow-xs'
                  : 'text-stone-500 dark:text-stone-400'
              }`}
            >
              {language === 'bn' ? 'সক্রিয়' : 'Active'}
            </button>
            <button
              type="button"
              onClick={() => {
                setSelectedStatus('expanding');
                setSelectedId(null);
              }}
              className={`px-2.5 py-1 rounded-lg cursor-pointer transition-colors ${
                selectedStatus === 'expanding'
                  ? 'bg-white dark:bg-[#102B3F] text-amber-700 dark:text-amber-300 shadow-xs'
                  : 'text-stone-500 dark:text-stone-400'
              }`}
            >
              {language === 'bn' ? 'সম্প্রসারণ' : 'Expanding'}
            </button>
          </div>

          <button
            type="button"
            onClick={handleResetView}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-stone-100 dark:bg-stone-900 hover:bg-stone-200 dark:hover:bg-stone-800 border border-stone-200/80 dark:border-stone-800 text-xs font-bold text-stone-700 dark:text-stone-200 transition-colors cursor-pointer"
            title={language === 'bn' ? 'মানচিত্র রিসেট করুন' : 'Reset map bounds'}
          >
            <RotateCcw className="w-3.5 h-3.5 text-[#167D78] dark:text-[#D6F36A]" />
            <span className="hidden sm:inline">{language === 'bn' ? 'ফিট ভিউ' : 'Fit All'}</span>
          </button>
        </div>
      </div>

      {/* Main Split View: Interactive Google Map + District Distribution Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-stretch">
        {/* Map Column */}
        <div className="lg:col-span-8 flex flex-col">
          <div className="relative w-full h-[430px] sm:h-[490px] rounded-2xl overflow-hidden border border-stone-200 dark:border-stone-800 bg-stone-100 dark:bg-stone-900">
            {!hasApiKey ? (
              <div className="w-full h-full flex flex-col items-center justify-center p-6 text-center gap-3">
                <AlertCircle className="w-8 h-8 text-amber-600" />
                <div className="font-bold text-sm text-[#102B3F] dark:text-white">
                  {language === 'bn'
                    ? 'Google Maps API Key পাওয়া যায়নি'
                    : 'Google Maps API Key Not Configured'}
                </div>
                <p className="text-xs text-stone-500 dark:text-stone-400 max-w-md">
                  {language === 'bn'
                    ? 'মানচিত্রটি সক্রিয় করতে VITE_GOOGLE_MAPS_API_KEY সেট করুন। ডানপাশের তালিকায় জেলাভিত্তিক উপকারভোগীর তথ্য দৃশ্যমান রয়েছে।'
                    : 'Configure VITE_GOOGLE_MAPS_API_KEY to enable the interactive map. District beneficiary figures remain accessible in the breakdown panel.'}
                </p>
              </div>
            ) : isApiFailed ? (
              <div className="w-full h-full flex flex-col items-center justify-center p-6 text-center gap-3">
                <AlertCircle className="w-8 h-8 text-amber-600" />
                <div className="font-bold text-sm text-[#102B3F] dark:text-white">
                  {language === 'bn'
                    ? 'মানচিত্র সাময়িকভাবে লোড করা যায়নি'
                    : 'Interactive Map Temporarily Unavailable'}
                </div>
                <p className="text-xs text-stone-500 dark:text-stone-400 max-w-md">
                  {language === 'bn'
                    ? 'Google Maps সংযোগ বা কোটা সীমার কারণে মানচিত্র প্রদর্শন সাময়িক স্থগিত রয়েছে। নিচের ও পাশের তালিকায় জেলাভিত্তিক পরিসংখ্যান দেখুন।'
                    : 'Unable to load Google Maps tiles right now. Please inspect the verified district beneficiary breakdown alongside.'}
                </p>
              </div>
            ) : !initialCenter ? (
              <div className="w-full h-full flex flex-col items-center justify-center p-6 text-center gap-3">
                <Loader2 className="w-7 h-7 animate-spin text-[#167D78]" />
                <div className="text-xs font-semibold text-stone-600 dark:text-stone-300">
                  {language === 'bn'
                    ? 'Google Maps-এর মাধ্যমে বাংলাদেশের জেলাসমূহের অবস্থান যাচাই করা হচ্ছে...'
                    : 'Resolving district locations via Google Maps Places...'}
                </div>
              </div>
            ) : (
              <GoogleMap
                mapId="DEMO_MAP_ID"
                defaultCenter={initialCenter}
                defaultZoom={7}
                gestureHandling="cooperative"
                mapTypeControl={false}
                streetViewControl={false}
                fullscreenControl={true}
                internalUsageAttributionIds={['gmp_mcp_codeassist_v1_aistudio']}
                className="w-full h-full"
              >
                <MapCameraController
                  positions={positions}
                  visibleNodes={filteredNodes}
                  selectedId={selectedId}
                  resetSignal={resetSignal}
                />

                {sortedMarkersForZIndex.map((node, index) => {
                  const pos = positions[node.id];
                  if (!pos) return null;
                  const zIndex =
                    selectedId === node.id ? 1000 : hoveredId === node.id ? 999 : index;

                  return (
                    <DistrictMarkerPin
                      key={node.id}
                      node={node}
                      position={{ lat: pos.lat, lng: pos.lng }}
                      isSelected={selectedId === node.id}
                      isHovered={hoveredId === node.id}
                      zIndex={zIndex}
                      language={language}
                      onSelect={(id) => setSelectedId(id)}
                      onRegisterMarker={registerMarker}
                    />
                  );
                })}

                {selectedNode && selectedMarkerInstance && (
                  <InfoWindow
                    anchor={selectedMarkerInstance}
                    maxWidth={310}
                    onCloseClick={() => setSelectedId(null)}
                  >
                    <div className="p-1 text-stone-900 space-y-2 max-w-[270px]">
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <div className="text-[11px] font-bold uppercase tracking-wider text-[#167D78]">
                            {language === 'bn'
                              ? selectedNode.divisionBn
                              : selectedNode.divisionEn}
                          </div>
                          <h4 className="font-extrabold text-sm text-[#102B3F] leading-snug">
                            {language === 'bn'
                              ? selectedNode.districtBn
                              : selectedNode.districtEn}
                          </h4>
                        </div>
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-stone-100 text-[#102B3F] border border-stone-200 shrink-0">
                          {getStatusMeta(selectedNode.status, language).label}
                        </span>
                      </div>

                      <div className="text-xs font-semibold text-stone-700">
                        {language === 'bn'
                          ? selectedNode.branchNameBn
                          : selectedNode.branchNameEn}
                      </div>

                      <div className="grid grid-cols-2 gap-2 p-2 rounded-lg bg-stone-50 border border-stone-200 text-xs">
                        <div>
                          <div className="text-[10px] text-stone-500">
                            {language === 'bn' ? 'উপকারভোগী' : 'Beneficiaries'}
                          </div>
                          <div className="font-extrabold text-[#167D78] tabular-nums">
                            {formatNumberForLang(selectedNode.beneficiariesCount, language)}
                            {language === 'bn' ? ' জন' : ''}
                          </div>
                        </div>
                        <div>
                          <div className="text-[10px] text-stone-500">
                            {language === 'bn' ? 'স্বেচ্ছাসেবক' : 'Volunteers'}
                          </div>
                          <div className="font-extrabold text-[#102B3F] tabular-nums">
                            {formatNumberForLang(selectedNode.volunteersCount, language)}
                            {language === 'bn' ? ' জন' : ''}
                          </div>
                        </div>
                      </div>

                      <div className="text-[11px] text-stone-600 leading-snug">
                        {language === 'bn'
                          ? selectedNode.displayAddressBn
                          : selectedNode.displayAddressEn}
                        {selectedNode.status === 'active_hq' &&
                          (language === 'bn'
                            ? selectedNode.landmarkBn
                            : selectedNode.landmarkEn) && (
                            <div className="mt-0.5 text-stone-500">
                              {language === 'bn'
                                ? selectedNode.landmarkBn
                                : selectedNode.landmarkEn}
                            </div>
                          )}
                      </div>

                      {selectedNode.matchedProjectsCount > 0 && (
                        <div className="text-[11px] text-stone-700 bg-teal-50/80 border border-teal-200/70 rounded-md px-2 py-1">
                          <span className="font-bold text-[#167D78]">
                            {language === 'bn'
                              ? `চলমান প্রকল্প (${formatNumberForLang(selectedNode.matchedProjectsCount, language)}): `
                              : `Active Projects (${selectedNode.matchedProjectsCount}): `}
                          </span>
                          <span>
                            {(language === 'bn'
                              ? selectedNode.matchedProjectTitlesBn
                              : selectedNode.matchedProjectTitlesEn
                            )
                              .slice(0, 2)
                              .join(' · ')}
                          </span>
                        </div>
                      )}

                      <div className="flex items-center justify-between gap-2 pt-1 border-t border-stone-200">
                        {selectedNode.phone ? (
                          <a
                            href={`tel:${selectedNode.phone}`}
                            className="inline-flex items-center gap-1 text-[11px] font-bold text-[#102B3F] hover:text-[#167D78]"
                          >
                            <Phone className="w-3 h-3" />
                            <span>{selectedNode.phone}</span>
                          </a>
                        ) : (
                          <span />
                        )}
                        <a
                          href={getGoogleMapsExternalUrl(
                            selectedNode,
                            selectedPosition || undefined
                          )}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1 text-[11px] font-bold text-[#167D78] hover:underline"
                        >
                          <span>{language === 'bn' ? 'গুগল ম্যাপে দেখুন' : 'Open Map'}</span>
                          <ExternalLink className="w-3 h-3" />
                        </a>
                      </div>
                    </div>
                  </InfoWindow>
                )}
              </GoogleMap>
            )}

            {/* Resolving progress chip */}
            {isResolvingPlaces && (
              <div className="absolute bottom-3 left-3 z-10 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/95 dark:bg-[#102B3F]/95 border border-stone-200 dark:border-stone-700 shadow-sm text-[11px] font-bold text-[#102B3F] dark:text-white">
                <Loader2 className="w-3.5 h-3.5 animate-spin text-[#167D78] dark:text-[#D6F36A]" />
                <span>
                  {language === 'bn' ? 'পিন অবস্থান হালনাগাদ হচ্ছে...' : 'Syncing markers...'}
                </span>
              </div>
            )}
          </div>

          {/* Map Legend Bar */}
          <div className="mt-3 flex flex-wrap items-center justify-between gap-3 px-1 text-[11px] text-stone-600 dark:text-stone-400">
            <div className="flex flex-wrap items-center gap-4">
              <span className="inline-flex items-center gap-1.5 font-semibold">
                <span className="w-2.5 h-2.5 rounded-full bg-[#102B3F] ring-2 ring-[#D6F36A]" />
                <span>{language === 'bn' ? 'কেন্দ্রীয় কার্যালয় (HQ)' : 'Central HQ'}</span>
              </span>
              <span className="inline-flex items-center gap-1.5 font-semibold">
                <span className="w-2.5 h-2.5 rounded-full bg-[#167D78]" />
                <span>{language === 'bn' ? 'সক্রিয় জেলা শাখা' : 'Active District Branch'}</span>
              </span>
              <span className="inline-flex items-center gap-1.5 font-semibold">
                <span className="w-2.5 h-2.5 rounded-full bg-[#E6A15B]" />
                <span>{language === 'bn' ? 'গঠন প্রক্রিয়াধীন' : 'Establishing'}</span>
              </span>
              <span className="inline-flex items-center gap-1.5 font-semibold">
                <span className="w-2.5 h-2.5 rounded-full bg-slate-500" />
                <span>{language === 'bn' ? 'সম্প্রসারণ জোন' : 'Expansion Hub'}</span>
              </span>
            </div>
            <span className="text-[11px] text-stone-500 dark:text-stone-400">
              {language === 'bn'
                ? 'যেকোনো পিন বা জেলায় ক্লিক করে বিস্তারিত দেখুন'
                : 'Click any marker or district card for details'}
            </span>
          </div>
        </div>

        {/* Right Column: Ranked District Beneficiaries Panel */}
        <div className="lg:col-span-4 flex flex-col bg-stone-50/80 dark:bg-stone-900/50 rounded-2xl border border-stone-200/80 dark:border-stone-800 p-4 h-[430px] sm:h-[490px]">
          <div className="flex items-center justify-between gap-2 pb-3 mb-3 border-b border-stone-200 dark:border-stone-800 shrink-0">
            <div className="flex items-center gap-2">
              <Users className="w-4 h-4 text-[#167D78] dark:text-[#D6F36A]" />
              <span className="text-xs font-extrabold uppercase tracking-wider text-[#102B3F] dark:text-white">
                {language === 'bn' ? 'জেলাভিত্তিক উপকারভোগী' : 'District Distribution'}
              </span>
            </div>
            <span className="text-[11px] font-mono font-bold text-stone-500 dark:text-stone-400 tabular-nums">
              {formatNumberForLang(filteredNodes.length, language)}{' '}
              {language === 'bn' ? 'টি জেলা' : 'Districts'}
            </span>
          </div>

          <div className="flex-1 overflow-y-auto space-y-2.5 pr-1">
            {filteredNodes.map((node) => {
              const isSelected = selectedId === node.id;
              const statusMeta = getStatusMeta(node.status, language);
              const barWidth = Math.max(
                8,
                Math.round((node.beneficiariesCount / maxBeneficiaries) * 100)
              );
              const sharePercent =
                totalFilteredBeneficiaries > 0
                  ? Math.round((node.beneficiariesCount / totalFilteredBeneficiaries) * 100)
                  : 0;

              return (
                <button
                  key={node.id}
                  type="button"
                  onClick={() => handleSelectDistrict(node.id)}
                  onMouseEnter={() => setHoveredId(node.id)}
                  onMouseLeave={() => setHoveredId(null)}
                  className={`w-full text-left p-3 rounded-xl border transition-all cursor-pointer ${
                    isSelected
                      ? 'bg-white dark:bg-[#102B3F] border-[#167D78] dark:border-[#D6F36A] shadow-sm'
                      : 'bg-white/80 dark:bg-[#0c1a24]/80 border-stone-200/80 dark:border-stone-800 hover:border-[#167D78]/60'
                  }`}
                >
                  <div className="flex items-start justify-between gap-2 mb-1.5">
                    <div className="min-w-0">
                      <div className="flex items-center gap-1.5">
                        <MapPin className="w-3.5 h-3.5 text-[#167D78] dark:text-[#D6F36A] shrink-0" />
                        <span className="font-extrabold text-sm text-[#102B3F] dark:text-white truncate">
                          {language === 'bn' ? node.districtBn : node.districtEn}
                        </span>
                      </div>
                      <div className="text-[11px] text-stone-500 dark:text-stone-400 truncate mt-0.5">
                        {language === 'bn' ? node.divisionBn : node.divisionEn}
                      </div>
                    </div>

                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded-md border shrink-0 ${statusMeta.badgeClass}`}
                    >
                      {statusMeta.label}
                    </span>
                  </div>

                  {/* Proportional Distribution Bar */}
                  <div className="w-full h-1.5 rounded-full bg-stone-200/80 dark:bg-stone-800 overflow-hidden my-2">
                    <div
                      className={`h-full rounded-full transition-all duration-300 ${
                        node.status === 'active_hq'
                          ? 'bg-[#102B3F] dark:bg-[#D6F36A]'
                          : node.status === 'active_branch'
                          ? 'bg-[#167D78]'
                          : 'bg-[#E6A15B]'
                      }`}
                      style={{ width: `${barWidth}%` }}
                    />
                  </div>

                  <div className="flex items-center justify-between text-[11px] tabular-nums">
                    <span className="font-extrabold text-[#167D78] dark:text-[#D6F36A]">
                      {formatNumberForLang(node.beneficiariesCount, language)}{' '}
                      {language === 'bn' ? 'জন উপকারভোগী' : 'beneficiaries'}
                    </span>
                    <span className="text-stone-500 dark:text-stone-400 font-semibold">
                      {formatNumberForLang(sharePercent, language)}% ·{' '}
                      {formatNumberForLang(node.volunteersCount, language)}{' '}
                      {language === 'bn' ? 'ভলান্টিয়ার' : 'vol.'}
                    </span>
                  </div>
                </button>
              );
            })}
          </div>

          {/* HQ Reference Footer inside Sidebar */}
          <div className="mt-3 pt-3 border-t border-stone-200 dark:border-stone-800 flex items-center justify-between gap-2 text-[11px] text-stone-500 dark:text-stone-400 shrink-0">
            <span className="inline-flex items-center gap-1.5 truncate">
              <Building2 className="w-3.5 h-3.5 text-[#167D78] dark:text-[#D6F36A] shrink-0" />
              <span className="truncate">{mapConfig.address}</span>
            </span>
            <a
              href={
                mapConfig.directionsUrl ||
                `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(
                  mapConfig.address
                )}`
              }
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 font-bold text-[#167D78] dark:text-[#D6F36A] hover:underline shrink-0"
            >
              <Navigation className="w-3 h-3" />
              <span>{language === 'bn' ? 'রুট' : 'Route'}</span>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export const DistrictBeneficiariesMap: React.FC<DistrictBeneficiariesMapProps> = ({
  mapConfig = INITIAL_MAP_CONFIG,
  projects = INITIAL_PROJECTS,
  language,
  className = '',
}) => {
  const apiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY || '';

  // Derive district nodes from mapConfig.branches (or INITIAL_BANGLADESH_BRANCHES) + mapConfig HQ + active projects
  const districtNodes = useMemo<DistrictDistributionNode[]>(() => {
    const baseBranches: BangladeshBranch[] =
      mapConfig.branches && mapConfig.branches.length > 0
        ? mapConfig.branches
        : INITIAL_BANGLADESH_BRANCHES;

    const hasValidCustomHqAddress =
      Boolean(mapConfig.address) &&
      !mapConfig.address.includes('[এখানে CoLASH Foundation-এর সম্পূর্ণ ঠিকানা দিন]');

    const nodes: DistrictDistributionNode[] = baseBranches.map((branch) => {
      const isHq = branch.status === 'active_hq';
      const addressQuery =
        isHq && hasValidCustomHqAddress
          ? mapConfig.address
          : branch.addressEn || `${branch.districtEn}, ${branch.divisionEn}, Bangladesh`;

      return {
        id: branch.id,
        districtBn: branch.districtBn,
        districtEn: branch.districtEn,
        divisionId: getDivisionIdFromName(branch.divisionEn),
        divisionBn: branch.divisionBn,
        divisionEn: branch.divisionEn,
        branchNameBn: branch.branchNameBn,
        branchNameEn: branch.branchNameEn,
        addressQuery,
        displayAddressBn: branch.addressBn,
        displayAddressEn: isHq && hasValidCustomHqAddress ? mapConfig.address : branch.addressEn,
        landmarkBn: isHq ? mapConfig.landmarkBn : branch.upazilaOrAreaBn,
        landmarkEn: isHq ? mapConfig.landmarkEn : branch.upazilaOrAreaEn,
        coordinatorBn: branch.coordinatorNameBn,
        coordinatorEn: branch.coordinatorNameEn,
        phone: (isHq && mapConfig.phone) || branch.coordinatorPhone,
        status: branch.status,
        volunteersCount: Number(branch.volunteersCount || 0),
        beneficiariesCount: 0,
        matchedProjectsCount: 0,
        matchedProjectTitlesBn: [],
        matchedProjectTitlesEn: [],
        directionsUrl:
          (isHq && mapConfig.directionsUrl) || branch.mapDirectionsUrl || undefined,
      };
    });

    // Ensure key project districts outside baseBranches (e.g., Sunamganj, Habiganj) are also represented
    for (const tmpl of EXTRA_PROJECT_DISTRICT_TEMPLATES) {
      const exists = nodes.some(
        (n) => n.districtEn.toLowerCase() === tmpl.districtEn.toLowerCase()
      );
      if (exists) continue;
      const hasProjectMatch = projects.some((p) => {
        const locText = `${p.locationEn} ${p.locationBn}`.toLowerCase();
        return tmpl.matchTokens.some((token) => locText.includes(token));
      });
      if (hasProjectMatch) {
        nodes.push({
          id: tmpl.id,
          districtBn: tmpl.districtBn,
          districtEn: tmpl.districtEn,
          divisionId: tmpl.divisionId,
          divisionBn: tmpl.divisionBn,
          divisionEn: tmpl.divisionEn,
          branchNameBn: `${tmpl.districtBn} প্রকল্প এলাকা ও ফিল্ড টিম`,
          branchNameEn: `${tmpl.districtEn} Project Outreach Zone`,
          addressQuery: tmpl.addressQuery,
          displayAddressBn: `${tmpl.districtBn}, ${tmpl.divisionBn}`,
          displayAddressEn: tmpl.addressQuery,
          coordinatorBn: 'সিলেট আঞ্চলিক ফিল্ড সমন্বয় টিম',
          coordinatorEn: 'Sylhet Regional Field Coordination Team',
          phone: mapConfig.phone || '01646-475348',
          status: 'active_branch',
          volunteersCount: 18,
          beneficiariesCount: 0,
          matchedProjectsCount: 0,
          matchedProjectTitlesBn: [],
          matchedProjectTitlesEn: [],
        });
      }
    }

    // Attribute project beneficiaries accurately across matched district nodes
    for (const proj of projects) {
      const count = Number(proj.beneficiariesCount) || 0;
      if (count <= 0) continue;

      const locText = `${proj.locationEn} ${proj.locationBn}`.toLowerCase();
      const matchedNodes = nodes.filter((node) => {
        const tokens = getDistrictTokens(node.districtEn, node.districtBn, node.landmarkEn);
        return tokens.some((tok) => locText.includes(tok));
      });

      if (matchedNodes.length > 0) {
        const share = Math.floor(count / matchedNodes.length);
        const remainder = count - share * matchedNodes.length;
        matchedNodes.forEach((node, idx) => {
          node.beneficiariesCount += share + (idx === 0 ? remainder : 0);
          node.matchedProjectsCount += 1;
          node.matchedProjectTitlesBn.push(proj.titleBn);
          node.matchedProjectTitlesEn.push(proj.titleEn);
        });
      } else {
        // Fallback to HQ if project location does not match a specific district token
        const hq = nodes.find((n) => n.status === 'active_hq') || nodes[0];
        if (hq) {
          hq.beneficiariesCount += count;
          hq.matchedProjectsCount += 1;
          hq.matchedProjectTitlesBn.push(proj.titleBn);
          hq.matchedProjectTitlesEn.push(proj.titleEn);
        }
      }
    }

    // Add branch outreach footprint for active/establishing branches without direct project-token matches
    for (const node of nodes) {
      if (node.beneficiariesCount === 0) {
        if (node.status === 'active_branch') {
          node.beneficiariesCount = Math.max(120, node.volunteersCount * 9);
        } else if (node.status === 'establishing') {
          node.beneficiariesCount = Math.max(65, node.volunteersCount * 6);
        } else {
          node.beneficiariesCount = 35;
        }
      }
    }

    return nodes;
  }, [mapConfig, projects]);

  const innerContent = (
    <DistrictBeneficiariesMapInner
      nodes={districtNodes}
      mapConfig={mapConfig}
      language={language}
      className={className}
      hasApiKey={Boolean(apiKey)}
    />
  );

  if (!apiKey) {
    return innerContent;
  }

  return (
    <APIProvider
      apiKey={apiKey}
      language={language === 'bn' ? 'bn' : 'en'}
      region="BD"
      libraries={['marker', 'places', 'core']}
    >
      {innerContent}
    </APIProvider>
  );
};
