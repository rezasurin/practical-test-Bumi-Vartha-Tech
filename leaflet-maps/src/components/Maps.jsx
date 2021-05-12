import React, {useRef, useState, useEffect} from 'react'
import mapboxgl from 'mapbox-gl'
import 'leaflet/dist/leaflet.css';
import './Style.css'

import icon from '../assets/icons/location.png';

mapboxgl.accessToken = process.env.REACT_APP_MAPBOX_KEY
// mapbox://styles/rezasurin/ckokisfi60uls17pc67pc9cv2
// mapbox://styles/rezasurin/ckokisfi60uls17pc67pc9cv2

let geojson = {
  type: 'FeatureCollection',
  features: [{
    type: 'Feature',
    geometry: {
      type: 'Point',
      coordinates: [107.5994, -6.9351]
    },
    properties: {
      title: 'Mapbox',
      description: 'Bandung'
    }
  },
  {
    type: 'Feature',
    geometry: {
      type: 'Point',
      coordinates: [-122.414, 37.776]
    },
    properties: {
      title: 'Mapbox',
      description: 'San Francisco, California'
    }
  }]
};

export default function Map ({ accessToken }) {
  const mapContainerRef = useRef(null)
  const [lng, setLng] = useState(107.5994)
  const [lat, setLat] = useState(-6.9351)
  const [zoom, setZoom] = useState(8)

  useEffect(() => {
    const map = new mapboxgl.Map({
      container: mapContainerRef.current,
      style: 'mapbox://styles/rezasurin/ckokisfi60uls17pc67pc9cv2',
      center: [lng, lat],
      zoom: zoom
    })
      // adding control for the map
      map.addControl(new mapboxgl.NavigationControl(), 'top-right');
      
      // longitude and latitude state change dynamically
      map.on('move', () => {
        setLng(map.getCenter().lng.toFixed(4));
        setLat(map.getCenter().lat.toFixed(4));
        setZoom(map.getZoom().toFixed(2));
      });

      // map will doing something when on loads
      map.on('load', () => {
        // loading an image (custom marker icon)
        map.loadImage(
          icon, (err, image) => {
            if (err) throw err;
            // set the marker icon
            map.addImage('marking', image)
            // set the source data
            map.addSource('marked', {
              type: 'geojson',
              data: {
                type: 'FeatureCollection',
                features: [],
              },
            });
            // set the map layer
            map.addLayer({
              id: 'marked',
              source: 'marked',
              type: 'symbol',
              layout: {
                
                'icon-image': 'marking', 
                'icon-padding': 0,
                'icon-allow-overlap': true,
                'icon-size': 0.12
              },
            });
            // adding events for the icons
            map.on('click', 'marked', (e) => {
              var el = document.createElement('div');
              el.className = 'marker';

              let coordinate = e.features[0].geometry.coordinates.slice()
              let description = e.features[0].properties.description
              
              while (Math.abs(e.lngLat.lng - coordinate[0]) > 180) {
                coordinate[0] += e.lngLat.lng > coordinate[0] ? 360 : -360;
              }
              // show pop up when markers clicked
              new mapboxgl.Popup({offset: 25})
              .setLngLat(coordinate)
              .setHTML(
                '<h3>' + description + '</h3><p>' + coordinate + '</p>'
              )
              .addTo(map);
            })

            map.on('mouseenter', 'marked', function () {
              map.getCanvas().style.cursor = 'pointer';
            });
              
            map.on('mouseleave', 'marked', function () {
              map.getCanvas().style.cursor = '';
            });

          }
        )
      })
      // iterate the geojson when user stop moving the map
      map.on('moveend', () => {
        geojson.features.forEach((area) => {
          map.getSource('marked').setData(area);
          
        })
      });
    // Clean up and release all internal resources associated with this map.
    return () => map.remove();
  }, [])


  return (
    <div ref={mapContainerRef} className='map-container'>
      <div className='sidebarStyle'>
        <div>
          Longitude: {lng} | Latitude: {lat} | Zoom: {zoom}
        </div>
      </div>
    </div>
  )
}