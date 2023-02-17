//json avec les données de la base de données
let data = {
    "type": "FeatureCollection",
    "features": [
        {
            "type": "Feature",
            "properties": {
                "id": 1,
                "name": "test",
                "description": "test",
                "image": "test",
                "latitude": 48.856614,
                "longitude": 2.3522219
            },
            "geometry": {
                "type": "Point",
                "coordinates": [
                    2.3522219,
                    48.856614
                ]
            }
        },
    ],
    "crs": {
        "type": "name",
        "properties": {
            "name": "urn:ogc:def:crs:OGC:1.3:CRS84"
        }
    }
};