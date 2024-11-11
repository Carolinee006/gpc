// Elementos do DOM
const showAddObstacleFormBtn = document.getElementById('showAddObstacleFormBtn');
const addObstacleFormContainer = document.getElementById('addObstacleFormContainer');
const addObstacleForm = document.getElementById('addObstacleForm');

// Manipulação do formulário de adicionar obstáculo
if (showAddObstacleFormBtn && addObstacleFormContainer) {
    showAddObstacleFormBtn.addEventListener('click', function() {
        addObstacleFormContainer.style.display = addObstacleFormContainer.style.display === 'none' ? 'block' : 'none';
    });
}

if (addObstacleForm) {
    addObstacleForm.addEventListener('submit', function(event) {
        event.preventDefault();

        const obstacleAddress = document.getElementById('obstacleAddress').value;

        if (obstacleAddress) {
            fetch('/api/obstacles', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ endereco: obstacleAddress })
            })
            .then(response => response.json())
            .then(data => {
                alert(data.message);
                addObstacleFormContainer.style.display = 'none';
                geocodeAddress(obstacleAddress, function(obstacleLocation) {
                    if (obstacleLocation) {
                        addObstacleMarker(obstacleLocation);
                    }
                });
            })
            .catch(error => console.error('Erro ao adicionar obstáculo:', error));
        }
    });
}

// Buscar e adicionar obstáculos ao mapa
fetch('/api/obstacles')
    .then(response => response.json())
    .then(data => {
        data.forEach(obstacle => geocodeAddress(obstacle.endereco, function(location) {
            if (location) {
                addObstacleMarker(location);
            }
        }));
    })
    .catch(error => console.error('Erro ao buscar obstáculos:', error));

// Variáveis do Google Maps
let map;
let directionsService;
let directionsRenderer;
let obstacleMarkers = [];
let geocoder;

// Inicializar o mapa
function initMap() {
    map = new google.maps.Map(document.getElementById('map'), {
        center: { lat: -29.65, lng: -50.79 },
        zoom: 14
    });

    directionsService = new google.maps.DirectionsService();
    directionsRenderer = new google.maps.DirectionsRenderer({
        map: map,
        panel: document.getElementById('panel')
    });

    geocoder = new google.maps.Geocoder();

    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
            (position) => {
                const pos = {
                    lat: position.coords.latitude,
                    lng: position.coords.longitude,
                };
                map.setCenter(pos);
            },
            () => {
                handleLocationError(true, map.getCenter());
            }
        );
    } else {
        handleLocationError(false, map.getCenter());
    }

    function handleLocationError(browserHasGeolocation, pos) {
        console.log(
            browserHasGeolocation
                ? 'Erro: O serviço de Geolocalização falhou.'
                : 'Erro: Seu navegador não suporta geolocalização.'
        );
        map.setCenter(pos);
    }
}

// Adicionar marcador de obstáculo no mapa
function addObstacleMarker(obstacle) {
    const marker = new google.maps.Marker({
        position: obstacle,
        map: map,
        title: 'Obstáculo',
        icon: {
            url: "http://maps.google.com/mapfiles/ms/icons/red-dot.png"
        }
    });
    obstacleMarkers.push(marker);

    const circle = new google.maps.Circle({
        center: obstacle,
        radius: 1000, // Raio em metros
        fillColor: '#FF0000',
        fillOpacity: 0.2,
        strokeColor: '#FF0000',
        strokeOpacity: 0.5,
        strokeWeight: 1,
        map: map
    });
}

// Geocodificação de endereços
function geocodeAddress(address, callback) {
    geocoder.geocode({ address: address }, function(results, status) {
        if (status === 'OK' && results[0]) {
            callback(results[0].geometry.location);
        } else {
            callback(null);
        }
    });
}
let stepDisplay;
let marker;
let routeIndex = 0;

// Função para inicializar e simular a rota
function startRoute() {
    const directions = directionsRenderer.getDirections();
    if (directions) {
        const route = directions.routes[0].legs[0];
        animateRoute(route);
    }
}

function animateRoute(route) {
    const steps = route.steps;
    routeIndex = 0;

    marker = new google.maps.Marker({
        position: steps[routeIndex].start_location,
        map: map,
        icon: "https://maps.google.com/mapfiles/ms/icons/blue-dot.png"
    });

    moveMarker(steps);
}

function moveMarker(steps) {
    if (routeIndex < steps.length) {
        const nextStep = steps[routeIndex];
        marker.setPosition(nextStep.start_location);
        map.panTo(nextStep.start_location);
        setTimeout(() => {
            routeIndex++;
            moveMarker(steps);
        }, 1000); // Intervalo de atualização (ajuste para suavizar)
    }
}

document.getElementById('startRouteBtn').addEventListener('click', startRoute);


// Calcular rota evitando obstáculos
function calculateRoute() {
    if (!directionsService || !directionsRenderer) {
        console.error('Google Maps API not initialized properly.');
        alert('Erro ao carregar a API do Google Maps. Tente novamente.');
        return;
    }

    const origin = document.getElementById('origin').value;
    const destination = document.getElementById('destination').value;

    if (!origin || !destination) {
        alert('Por favor, insira tanto o ponto de origem quanto o ponto de destino.');
        return;
    }

    const waypoints = obstacleMarkers.map(marker => ({
        location: marker.getPosition(),
        stopover: false
    }));

    const request = {
        origin: origin,
        destination: destination,
        waypoints: waypoints,
        travelMode: 'DRIVING',
        avoidTolls: true,
        avoidFerries: true,
        provideRouteAlternatives: true
    };

    directionsService.route(request, (result, status) => {
        if (status === 'OK') {
            directionsRenderer.setDirections(result);
        } else {
            console.error('Error fetching directions', result);
            alert('Erro ao calcular rota. Tente novamente.');
        }
    });
}



window.initMap = initMap;
