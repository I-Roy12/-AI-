export function providerFit(provider, categoryId) {
  let score = provider.supported_categories.includes(categoryId) ? 0.7 : 0.1;
  if (provider.online_available) score += 0.2;
  score += 0.1;
  return Number(Math.min(score, 0.99).toFixed(2));
}

function toFiniteNumber(value) {
  const num = Number(value);
  if (!Number.isFinite(num)) return null;
  return num;
}

function hasLatLng(value) {
  if (!value || typeof value !== "object") return false;
  const lat = toFiniteNumber(value.lat);
  const lng = toFiniteNumber(value.lng);
  return lat !== null && lng !== null;
}

function haversineKm(from, to) {
  if (!hasLatLng(from) || !hasLatLng(to)) return null;
  const lat1 = (Number(from.lat) * Math.PI) / 180;
  const lng1 = (Number(from.lng) * Math.PI) / 180;
  const lat2 = (Number(to.lat) * Math.PI) / 180;
  const lng2 = (Number(to.lng) * Math.PI) / 180;
  const dLat = lat2 - lat1;
  const dLng = lng2 - lng1;
  const a = Math.sin(dLat / 2) ** 2 + Math.cos(lat1) * Math.cos(lat2) * Math.sin(dLng / 2) ** 2;
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const earthRadiusKm = 6371;
  return earthRadiusKm * c;
}

function distanceBonus(distanceKm) {
  if (!Number.isFinite(distanceKm)) return 0;
  if (distanceKm <= 1) return 0.35;
  if (distanceKm <= 3) return 0.25;
  if (distanceKm <= 7) return 0.15;
  if (distanceKm <= 12) return 0.08;
  return 0;
}

function recommendationReason({ category, distanceKm, online }) {
  const reasons = [];
  if (category?.recommended_departments?.length) {
    reasons.push(`${category.recommended_departments[0]}が適合候補です`);
  }
  if (Number.isFinite(distanceKm)) {
    reasons.push(distanceKm <= 3 ? "現在地から近い候補です" : `現在地から約${distanceKm.toFixed(1)}kmです`);
  }
  if (online) reasons.push("オンライン相談に対応しています");
  return reasons.join(" / ");
}

export function createProviderMatchingService({ symptomConfig, providers, fitProvider = providerFit }) {
  function classifyCategory(lastLog) {
    if (!lastLog) {
      return symptomConfig.categories[0];
    }

    const symptomText = (lastLog.symptoms || []).join(" ");
    const combined = `${symptomText} ${lastLog.note || ""}`;

    for (const category of symptomConfig.categories) {
      if (category.signals.some((signal) => combined.includes(signal))) {
        return category;
      }
    }

    return symptomConfig.categories[0];
  }

  function matchProviders(lastLog, { minFit = 0.5, limit = 3, userLocation = null } = {}) {
    const category = classifyCategory(lastLog);
    const matched = providers
      .map((provider) => ({
        ...provider,
        fit_score: fitProvider(provider, category.id)
      }))
      .filter((provider) => provider.fit_score >= minFit)
      .map((provider) => {
        const distanceKm = hasLatLng(userLocation) ? haversineKm(userLocation, provider.location || null) : null;
        const score = Math.min(0.99, provider.fit_score + distanceBonus(distanceKm));
        return {
          ...provider,
          distance_km: Number.isFinite(distanceKm) ? Number(distanceKm.toFixed(1)) : null,
          recommendation_score: Number(score.toFixed(2)),
          recommendation_reason: recommendationReason({
            category,
            distanceKm,
            online: Boolean(provider.online_available)
          })
        };
      })
      .sort((a, b) => {
        const primary = hasLatLng(userLocation) ? b.recommendation_score - a.recommendation_score : b.fit_score - a.fit_score;
        if (primary !== 0) return primary;
        const da = Number.isFinite(a.distance_km) ? a.distance_km : Number.MAX_SAFE_INTEGER;
        const db = Number.isFinite(b.distance_km) ? b.distance_km : Number.MAX_SAFE_INTEGER;
        return da - db;
      })
      .slice(0, limit);

    return {
      category,
      providers: matched
    };
  }

  return {
    classifyCategory,
    matchProviders
  };
}
