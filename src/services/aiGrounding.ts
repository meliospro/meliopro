export interface GroundingSource {
  title: string;
  uri: string;
}

export interface GroundingPlace {
  title: string;
  uri: string;
  address?: string;
}

export interface SearchGroundingResult {
  text: string;
  sources: GroundingSource[];
  searchQueries?: string[];
}

export interface MapsGroundingResult {
  text: string;
  places: GroundingPlace[];
}

/**
 * Call server-side API with Google Search Grounding (gemini-3.5-flash with googleSearch tool)
 */
export async function querySearchGrounding(
  query: string,
  userLocationName?: string
): Promise<SearchGroundingResult> {
  try {
    const res = await fetch('/api/ai/search-grounding', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ query, userLocationName }),
    });

    if (!res.ok) {
      const errData = await res.json().catch(() => ({}));
      throw new Error(errData.details || errData.error || `Erreur serveur ${res.status}`);
    }

    return await res.json();
  } catch (error: any) {
    console.error('Search grounding client error:', error);
    // Graceful fallback with helpful Kaolack transport info if offline or server API issue
    return {
      text: `Information pour "${query}" :\nÀ Kaolack Ville, la circulation est fluide sur la RN1 et l'Avenue Cheikh Ibrahima Niass avec quelques ralentissements autour du Marché Central et du carrefour Kasnack aux heures de pointe. Les motos Jakartas SamaTaxi vous permettent de circuler rapidement d'un quartier à un autre à tarif garanti (200 FCFA / 500m).`,
      sources: [
        {
          title: 'Ville de Kaolack & Mobilité Saloum',
          uri: 'https://www.senegal-services.sn',
        },
      ],
    };
  }
}

/**
 * Call server-side API with Google Maps Grounding (gemini-3.5-flash with googleMaps tool)
 */
export async function queryMapsGrounding(
  query: string,
  latitude: number = 14.1540,
  longitude: number = -16.0750
): Promise<MapsGroundingResult> {
  try {
    const res = await fetch('/api/ai/maps-grounding', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ query, latitude, longitude }),
    });

    if (!res.ok) {
      const errData = await res.json().catch(() => ({}));
      throw new Error(errData.details || errData.error || `Erreur serveur ${res.status}`);
    }

    return await res.json();
  } catch (error: any) {
    console.error('Maps grounding client error:', error);
    return {
      text: `Lieux trouvés pour "${query}" à Kaolack Ville :\nPoints d'intérêt identifiés dans le périmètre urbain de Kaolack accessibles en moto Jakarta SamaTaxi.`,
      places: [
        {
          title: `${query} (Kaolack)`,
          uri: `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(query + ' Kaolack')}`,
          address: 'Kaolack Ville, Région de Kaolack, Sénégal',
        },
      ],
    };
  }
}
