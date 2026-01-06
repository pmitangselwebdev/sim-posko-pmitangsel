"use client"

import { useEffect, useRef, useState } from 'react'

export default function Map() {
  const mapRef = useRef(null)
  const leafletMapRef = useRef(null)
  const [boundaryGeoJSON, setBoundaryGeoJSON] = useState(null)
  const [kecamatanGeoJSON, setKecamatanGeoJSON] = useState(null)
  const [kelurahanGeoJSON, setKelurahanGeoJSON] = useState(null)
  const [isMapReady, setIsMapReady] = useState(false)

  // Load GeoJSON data
  useEffect(() => {
    const loadGeoJSON = async () => {
      try {
        const [boundaryRes, kecamatanRes, kelurahanRes] = await Promise.all([
          fetch('/uploads/geojson/36.74_Kota_Tangerang_Selatan.geojson'),
          fetch('/uploads/geojson/36.74_kecamatan.geojson'),
          fetch('/uploads/geojson/36.74_kelurahan.geojson')
        ]);
        const boundary = await boundaryRes.json();
        const kecamatan = await kecamatanRes.json();
        const kelurahan = await kelurahanRes.json();
        setBoundaryGeoJSON(boundary);
        setKecamatanGeoJSON(kecamatan);
        setKelurahanGeoJSON(kelurahan);
      } catch (error) {
        console.error('Error loading GeoJSON:', error);
      }
    };
    loadGeoJSON();
  }, []);

  // Initialize map when GeoJSON is loaded
  useEffect(() => {
    if (!boundaryGeoJSON) return;

    // Dynamically import Leaflet to avoid SSR issues
    import('leaflet').then((L) => {
      // Fix for default markers in Next.js
      delete L.Icon.Default.prototype._getIconUrl;
      L.Icon.Default.mergeOptions({
        iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
        iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
        shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
      });

      if (leafletMapRef.current) return; // Prevent multiple initializations

      // Initialize map
      const map = L.map(mapRef.current, {
        center: [-6.3, 106.7],
        zoom: 12,
        zoomControl: true
      });

      leafletMapRef.current = map;

      // Add OpenStreetMap tiles
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
        maxZoom: 19
      }).addTo(map);

      // Add city boundary layer
      const boundaryLayer = L.geoJSON(boundaryGeoJSON, {
        style: {
          color: '#dc2626',
          weight: 4,
          opacity: 0.9,
          fillColor: 'rgba(255, 255, 255, 0.1)',
          fillOpacity: 0.1,
          dashArray: '10, 5'
        }
      }).addTo(map);

      // Modern solid colors for kecamatan
      const kecamatanSolidColors = [
        '#3b82f6', // Blue
        '#10b981', // Emerald
        '#f59e0b', // Amber
        '#ef4444', // Red
        '#8b5cf6', // Violet
        '#06b6d4', // Cyan
        '#84cc16', // Lime
      ];

      // Modern solid colors for kelurahan (lighter versions)
      const kelurahanSolidColors = [
        '#60a5fa', // Light Blue
        '#34d399', // Light Emerald
        '#fbbf24', // Light Amber
        '#f87171', // Light Red
        '#a78bfa', // Light Violet
        '#22d3ee', // Light Cyan
        '#a3e635', // Light Lime
      ];

      // Create kecamatan color mapping
      const kecamatanColorMap = {};
      kecamatanGeoJSON?.features.forEach((feature, index) => {
        const kecCode = feature.properties.kd_kecamatan || feature.properties.kd_dati2 || index;
        kecamatanColorMap[kecCode] = kecamatanSolidColors[index % kecamatanSolidColors.length];
      });

      // Add kelurahan (sub-district) layer first
      if (kelurahanGeoJSON) {
        L.geoJSON(kelurahanGeoJSON, {
          style: (feature, layer) => {
            const kecCode = feature.properties.kd_kecamatan || feature.properties.kd_dati2;
            const kecIndex = kecamatanGeoJSON?.features.findIndex(kec => {
              const kecKecCode = kec.properties.kd_kecamatan || kec.properties.kd_dati2;
              return kecKecCode === kecCode;
            }) || 0;
            const kelurahanColor = kelurahanSolidColors[kecIndex % kelurahanSolidColors.length];
            return {
              color: '#666666',
              weight: 2,
              opacity: 0.6,
              fillColor: kelurahanColor,
              fillOpacity: 0.8
            };
          },
          onEachFeature: (feature, layer) => {
            const kecCode = feature.properties.kd_kecamatan || feature.properties.kd_dati2;
            const kecIndex = kecamatanGeoJSON?.features.findIndex(kec => {
              const kecKecCode = kec.properties.kd_kecamatan || kec.properties.kd_dati2;
              return kecKecCode === kecCode;
            }) || 0;
            const originalColor = kelurahanSolidColors[kecIndex % kelurahanSolidColors.length];

            // Function to darken color
            const darkenColor = (color, factor = 0.3) => {
              // Convert hex to HSL and darken
              const hex = color.replace('#', '');
              const r = parseInt(hex.substr(0, 2), 16) / 255;
              const g = parseInt(hex.substr(2, 2), 16) / 255;
              const b = parseInt(hex.substr(4, 2), 16) / 255;

              const max = Math.max(r, g, b);
              const min = Math.min(r, g, b);
              let h, s, l = (max + min) / 2;

              if (max === min) {
                h = s = 0;
              } else {
                const d = max - min;
                s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
                switch (max) {
                  case r: h = (g - b) / d + (g < b ? 6 : 0); break;
                  case g: h = (b - r) / d + 2; break;
                  case b: h = (r - g) / d + 4; break;
                }
                h /= 6;
              }

              // Darken by reducing lightness
              l = Math.max(0, l - factor);

              const c = (1 - Math.abs(2 * l - 1)) * s;
              const x = c * (1 - Math.abs((h * 6) % 2 - 1));
              const m = l - c/2;
              let r2, g2, b2;
              if (0 <= h && h < 1/6) { r2 = c; g2 = x; b2 = 0; }
              else if (1/6 <= h && h < 2/6) { r2 = x; g2 = c; b2 = 0; }
              else if (2/6 <= h && h < 3/6) { r2 = 0; g2 = c; b2 = x; }
              else if (3/6 <= h && h < 4/6) { r2 = 0; g2 = x; b2 = c; }
              else if (4/6 <= h && h < 5/6) { r2 = x; g2 = 0; b2 = c; }
              else { r2 = c; g2 = 0; b2 = x; }
              return `rgb(${Math.round((r2 + m) * 255)}, ${Math.round((g2 + m) * 255)}, ${Math.round((b2 + m) * 255)})`;
            };

            const hoverColor = darkenColor(originalColor);

            layer.on('mouseover', function(e) {
              layer.setStyle({
                weight: 4,
                opacity: 1,
                fillColor: hoverColor,
                fillOpacity: 1
              });
              layer.bringToFront();
            });
            layer.on('mouseout', function(e) {
              layer.setStyle({
                weight: 2,
                opacity: 0.6,
                fillColor: originalColor,
                fillOpacity: 0.8
              });
            });

            // Add tooltip with simulated disaster data for each kelurahan
            const kelName = feature.properties.nm_kelurahan || feature.properties.name || 'Kelurahan';
            const simulatedData = {
              bencana: Math.floor(Math.random() * 3),
              rujukan: Math.floor(Math.random() * 5),
              kecelakaan: Math.floor(Math.random() * 4)
            };

            layer.bindTooltip(`
              <div style="text-align: center; font-weight: bold;">
                <div style="font-size: 12px; color: #16a34a;">${kelName}</div>
                <div style="font-size: 10px; margin-top: 3px;">
                  <div>🌪️ Bencana: ${simulatedData.bencana}</div>
                  <div>🏥 Rujukan: ${simulatedData.rujukan}</div>
                  <div>🚨 Kecelakaan: ${simulatedData.kecelakaan}</div>
                </div>
              </div>
            `, {
              permanent: false,
              direction: 'top',
              offset: [0, -5]
            });
          }
        }).addTo(map);
      }

      // Add kecamatan (district) layer on top to make borders visible
      if (kecamatanGeoJSON) {
        L.geoJSON(kecamatanGeoJSON, {
          style: (feature, layer) => {
            const index = kecamatanGeoJSON.features.indexOf(feature);
            return {
              color: '#666666',
              weight: 2,
              opacity: 0.8,
              fillColor: kecamatanSolidColors[index % kecamatanSolidColors.length],
              fillOpacity: 0.0  // No fill, just borders
            };
          },
          onEachFeature: (feature, layer) => {
            const index = kecamatanGeoJSON.features.indexOf(feature);
            const baseColor = kecamatanSolidColors[index % kecamatanSolidColors.length];

            // Function to darken color
            const darkenColor = (color, factor = 0.3) => {
              // Convert hex to HSL and darken
              const hex = color.replace('#', '');
              const r = parseInt(hex.substr(0, 2), 16) / 255;
              const g = parseInt(hex.substr(2, 2), 16) / 255;
              const b = parseInt(hex.substr(4, 2), 16) / 255;

              const max = Math.max(r, g, b);
              const min = Math.min(r, g, b);
              let h, s, l = (max + min) / 2;

              if (max === min) {
                h = s = 0;
              } else {
                const d = max - min;
                s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
                switch (max) {
                  case r: h = (g - b) / d + (g < b ? 6 : 0); break;
                  case g: h = (b - r) / d + 2; break;
                  case b: h = (r - g) / d + 4; break;
                }
                h /= 6;
              }

              // Darken by reducing lightness
              l = Math.max(0, l - factor);

              const c = (1 - Math.abs(2 * l - 1)) * s;
              const x = c * (1 - Math.abs((h * 6) % 2 - 1));
              const m = l - c/2;
              let r2, g2, b2;
              if (0 <= h && h < 1/6) { r2 = c; g2 = x; b2 = 0; }
              else if (1/6 <= h && h < 2/6) { r2 = x; g2 = c; b2 = 0; }
              else if (2/6 <= h && h < 3/6) { r2 = 0; g2 = c; b2 = x; }
              else if (3/6 <= h && h < 4/6) { r2 = 0; g2 = x; b2 = c; }
              else if (4/6 <= h && h < 5/6) { r2 = x; g2 = 0; b2 = c; }
              else { r2 = c; g2 = 0; b2 = x; }
              return `rgb(${Math.round((r2 + m) * 255)}, ${Math.round((g2 + m) * 255)}, ${Math.round((b2 + m) * 255)})`;
            };

            const hoverColor = darkenColor(baseColor);

            layer.on('mouseover', function(e) {
              layer.setStyle({
                weight: 4,
                opacity: 1,
                fillColor: hoverColor,
                fillOpacity: 0.5
              });
              layer.bringToFront();
            });
            layer.on('mouseout', function(e) {
              layer.setStyle({
                weight: 2,
                opacity: 0.8,
                fillOpacity: 0.0
              });
            });
          }
        }).addTo(map);
      }

      // Fit map to boundary bounds
      const bounds = boundaryLayer.getBounds();
      map.fitBounds(bounds, { padding: [30, 30] });

      // Restrict map panning to stay within reasonable bounds around Tangsel
      map.setMaxBounds(bounds.pad(0.2));

      // Add kecamatan labels
      if (kecamatanGeoJSON) {
        const kecamatanLabels = [];
        L.geoJSON(kecamatanGeoJSON, {
          onEachFeature: (feature, layer) => {
            const center = layer.getBounds().getCenter();
            const kecName = feature.properties.nm_kecamatan || feature.properties.name || 'Kec';
            const labelMarker = L.marker([center.lat, center.lng], {
              icon: L.divIcon({
                html: `<div style="background: rgba(37, 99, 235, 0.8); color: white; padding: 2px 4px; border-radius: 3px; font-size: 10px; font-weight: bold; transition: all 0.2s ease;">${kecName}</div>`,
                className: 'kecamatan-label',
                iconSize: [80, 20],
                iconAnchor: [40, 10]
              }),
              interactive: true
            }).addTo(map);

            // Simulate accumulated disaster data for kecamatan
            const kecIndex = kecamatanGeoJSON.features.indexOf(feature);
            const simulatedKecData = {
              bencana: Math.floor(Math.random() * 5) + 1,
              rujukan: Math.floor(Math.random() * 10) + 2,
              kecelakaan: Math.floor(Math.random() * 8) + 1
            };

            const tooltipContent = `
              <div style="text-align: center; font-weight: bold;">
                <div style="font-size: 14px; color: #2563eb;">${kecName}</div>
                <div style="font-size: 12px; margin-top: 5px;">
                  <div>🌪️ Bencana: ${simulatedKecData.bencana}</div>
                  <div>🏥 Rujukan: ${simulatedKecData.rujukan}</div>
                  <div>🚨 Kecelakaan: ${simulatedKecData.kecelakaan}</div>
                </div>
              </div>
            `;

            // Create a single tooltip instance
            const tooltip = L.tooltip({
              permanent: false,
              direction: 'top',
              offset: [0, -10]
            }).setContent(tooltipContent);

            labelMarker.bindTooltip(tooltip);

            // Track states
            let isTooltipPinned = false;
            let isLabelClicked = false;

            // Show tooltip on hover (if not pinned)
            labelMarker.on('mouseover', function(e) {
              if (!isTooltipPinned) {
                labelMarker.openTooltip();
              }
              // Change label color on hover (if not clicked)
              if (!isLabelClicked) {
                const icon = e.target.getIcon();
                icon.options.html = `<div style="background: rgba(239, 68, 68, 0.9); color: white; padding: 3px 6px; border-radius: 4px; font-size: 12px; font-weight: bold; transition: all 0.2s ease;">${kecName}</div>`;
                icon.options.iconSize = [100, 25];
                icon.options.iconAnchor = [50, 12];
                e.target.setIcon(icon);
              }
            });

            // Hide tooltip on mouseout (if not pinned) and reset color (if not clicked)
            labelMarker.on('mouseout', function(e) {
              if (!isTooltipPinned) {
                labelMarker.closeTooltip();
              }
              // Reset label color on mouseout (if not clicked)
              if (!isLabelClicked) {
                const icon = e.target.getIcon();
                icon.options.html = `<div style="background: rgba(37, 99, 235, 0.8); color: white; padding: 2px 4px; border-radius: 3px; font-size: 10px; font-weight: bold; transition: all 0.2s ease;">${kecName}</div>`;
                icon.options.iconSize = [80, 20];
                icon.options.iconAnchor = [40, 10];
                e.target.setIcon(icon);
              }
            });

            // Toggle states on click
            labelMarker.on('click', function(e) {
              e.originalEvent.stopPropagation(); // Prevent map click
              isTooltipPinned = !isTooltipPinned;
              isLabelClicked = !isLabelClicked;

              if (isTooltipPinned) {
                // Pin the tooltip and keep red color
                tooltip.setPermanent(true);
                labelMarker.openTooltip();
                const icon = e.target.getIcon();
                icon.options.html = `<div style="background: rgba(239, 68, 68, 0.9); color: white; padding: 3px 6px; border-radius: 4px; font-size: 12px; font-weight: bold; transition: all 0.2s ease;">${kecName}</div>`;
                icon.options.iconSize = [100, 25];
                icon.options.iconAnchor = [50, 12];
                e.target.setIcon(icon);
              } else {
                // Unpin the tooltip and reset to blue
                tooltip.setPermanent(false);
                labelMarker.closeTooltip();
                const icon = e.target.getIcon();
                icon.options.html = `<div style="background: rgba(37, 99, 235, 0.8); color: white; padding: 2px 4px; border-radius: 3px; font-size: 10px; font-weight: bold; transition: all 0.2s ease;">${kecName}</div>`;
                icon.options.iconSize = [80, 20];
                icon.options.iconAnchor = [40, 10];
                e.target.setIcon(icon);
              }
            });

            kecamatanLabels.push(labelMarker);
          }
        });
      }

      // Add kelurahan labels
      if (kelurahanGeoJSON) {
        L.geoJSON(kelurahanGeoJSON, {
          onEachFeature: (feature, layer) => {
            const center = layer.getBounds().getCenter();
            L.marker([center.lat, center.lng], {
              icon: L.divIcon({
                html: `<div style="background: rgba(22, 163, 74, 0.7); color: white; padding: 1px 3px; border-radius: 2px; font-size: 8px; font-weight: bold;">${feature.properties.nm_kelurahan || feature.properties.name || 'Kel'}</div>`,
                className: 'kelurahan-label',
                iconSize: [60, 15],
                iconAnchor: [30, 7]
              }),
              interactive: false
            }).addTo(map);
          }
        });
      }

      // Add markers for key locations
      const markers = [
        {
          position: [-6.3, 106.7],
          popup: `
            <div class="text-center">
              <h3 class="font-bold text-red-600">🏛️ PMI Kota Tangerang Selatan</h3>
              <p class="text-sm">Kantor Pusat PMI</p>
              <p class="text-xs text-gray-600">Jl. Raya Serpong No. 1</p>
            </div>
          `
        },
        {
          position: [-6.25, 106.68],
          popup: `
            <div class="text-center">
              <h4 class="font-semibold text-blue-600">🏥 RS PMI Tangerang Selatan</h4>
              <p class="text-xs">Pusat Kesehatan</p>
            </div>
          `
        },
        {
          position: [-6.35, 106.72],
          popup: `
            <div class="text-center">
              <h4 class="font-semibold text-green-600">🚑 Posko Ambulans</h4>
              <p class="text-xs">Unit Darurat</p>
            </div>
          `
        }
      ];

      markers.forEach(marker => {
        L.marker(marker.position)
          .addTo(map)
          .bindPopup(marker.popup);
      });

      // Function to add realtime markers (for future use)
      window.addRealtimeMarker = (lat, lng, options = {}) => {
        const marker = L.marker([lat, lng], options).addTo(map);
        if (options.popup) {
          marker.bindPopup(options.popup);
        }
        return marker;
      };

      // Function to remove markers
      window.removeRealtimeMarker = (marker) => {
        map.removeLayer(marker);
      };

      // Function to update marker position
      window.updateRealtimeMarker = (marker, lat, lng) => {
        marker.setLatLng([lat, lng]);
      };

      // Expose map instance globally for connection between pages
      window.sharedMap = map;
      setIsMapReady(true);

      return () => {
        map.remove();
        leafletMapRef.current = null;
        window.sharedMap = null;
        setIsMapReady(false);
      };
    });

    return () => {
      if (leafletMapRef.current) {
        leafletMapRef.current.remove();
        leafletMapRef.current = null;
      }
    };
  }, [boundaryGeoJSON, kecamatanGeoJSON, kelurahanGeoJSON]);

  // Sync map state between pages
  useEffect(() => {
    if (!isMapReady || !window.sharedMap) return;

    const map = window.sharedMap;

    // Listen for map state changes and broadcast them
    const handleMapMove = () => {
      const center = map.getCenter();
      const zoom = map.getZoom();
      localStorage.setItem('sharedMapCenter', JSON.stringify([center.lat, center.lng]));
      localStorage.setItem('sharedMapZoom', zoom.toString());
    };

    const handleMapZoom = () => {
      const zoom = map.getZoom();
      localStorage.setItem('sharedMapZoom', zoom.toString());
    };

    // Add event listeners
    map.on('moveend', handleMapMove);
    map.on('zoomend', handleMapZoom);

    // Sync from localStorage on load
    const savedCenter = localStorage.getItem('sharedMapCenter');
    const savedZoom = localStorage.getItem('sharedMapZoom');

    if (savedCenter && savedZoom) {
      try {
        const center = JSON.parse(savedCenter);
        const zoom = parseInt(savedZoom);
        map.setView(center, zoom);
      } catch (error) {
        console.error('Error syncing map state:', error);
      }
    }

    // Listen for storage changes from other tabs/windows
    const handleStorageChange = (e) => {
      if (e.key === 'sharedMapCenter' || e.key === 'sharedMapZoom') {
        const newCenter = localStorage.getItem('sharedMapCenter');
        const newZoom = localStorage.getItem('sharedMapZoom');

        // Use window.sharedMap instead of the local map variable
        if (newCenter && newZoom && window.sharedMap && typeof window.sharedMap.setView === 'function') {
          try {
            const center = JSON.parse(newCenter);
            const zoom = parseInt(newZoom);
            window.sharedMap.setView(center, zoom, { animate: false });
          } catch (error) {
            console.error('Error syncing map state from storage:', error);
          }
        }
      }
    };

    window.addEventListener('storage', handleStorageChange);

    return () => {
      map.off('moveend', handleMapMove);
      map.off('zoomend', handleMapZoom);
      window.removeEventListener('storage', handleStorageChange);
    };
  }, [isMapReady]);

  return (
    <div
      ref={mapRef}
      style={{ height: '100%', width: '100%', zIndex: 1 }}
      className="z-10"
    />
  )
}
