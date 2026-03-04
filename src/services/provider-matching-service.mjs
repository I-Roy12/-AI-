export function providerFit(provider, categoryId) {
  let score = provider.supported_categories.includes(categoryId) ? 0.7 : 0.1;
  if (provider.online_available) score += 0.2;
  score += 0.1;
  return Number(Math.min(score, 0.99).toFixed(2));
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

  function matchProviders(lastLog, { minFit = 0.5, limit = 3 } = {}) {
    const category = classifyCategory(lastLog);
    const matched = providers
      .map((provider) => ({
        ...provider,
        fit_score: fitProvider(provider, category.id)
      }))
      .filter((provider) => provider.fit_score >= minFit)
      .sort((a, b) => b.fit_score - a.fit_score)
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
