const myForm = (function () {
    let map;
    let directionsService;
    let directionsRenderer;
    
    // Adiciona Callbacks no Formulário
    latromi.formManager.setOnFormCreatedCallback(onFormCreated);
    latromi.formManager.setOnEventFiringCallback(onEventFiring);
    latromi.formManager.setOnFieldValueChangedCallback(onFieldValueChanged);
    
    // Ocorre logo após o form ser inicializado
    function onFormCreated(ev) {
    
        const apiKey = ev.form.getVariableValue('apiKey');
        latromi.extensions.loadScripts(['https://maps.googleapis.com/maps/api/js?libraries=places&v=weekly&key=' + apiKey], initMap);
    }
    
    myForm.route();
    
    // Ocorre quando um evento é disparado no Form
    function onEventFiring(ev) { }
    
    // Ocorre quando o valor de um campo é alterado no Form
    function onFieldValueChanged(ev) { }
    
    // Função de callback para inicialização do mapa.
    // Essa função é chamada logo após a conclusão do carregamento das bibliotecas do Google Maps.
    function initMap() {
        // Initializa o mapa, passando o elemento "div" onde ele será renderizado
        map = new google.maps.Map(document.getElementById("map"));
    
        // Inicializa os serviços que fazem calculo e a apresentação das rotas
        directionsService = new google.maps.DirectionsService();
        directionsRenderer = new google.maps.DirectionsRenderer({
            draggable: true, // Essa propriedade habilita a criação de desvios na rota
            map
        });
    
        calculateRoute();
    
        // Adiciona callback no "directions_changed" para interceptar as mudanças na rota
        directionsRenderer.addListener("directions_changed", () => {
            const directions = directionsRenderer.getDirections();
            if (directions) {
                updateOuput(directions);
            }
        });
    }
    
    // Atualiza campos com "waypoints" (Desvios) e "path" (Rota)
    function updateOuput(directionResult) {
        const form = latromi.formManager.getFormInstance();
        form.setFieldValue('waypoints', formatCoordinates(getWaypointsCoordinates(directionResult)));
        form.setFieldValue('path', formatCoordinates(getPathCoordinates(directionResult)));
        form.setFieldValue('origin', getStartAddress(directionResult));
        form.setFieldValue('destination', getEndAddress(directionResult));
    }
    
    // Função que calcula a rota
    function calculateRoute() {
        if (!map) throw 'O mapa ainda não foi carregado.';
    
        const form = latromi.formManager.getFormInstance();
        const origin = form.getFieldValue('origin');            // Pega valor do TextBox "origin"
        const destination = form.getFieldValue('destination');  // Pega valor do TextBox "destination"
        const waypoints = parseStoredCoordinates(form.getFieldValue('waypoints')); // Pega valor do TextBox "waypoints"
    
        // Se origem e destino não foram informados, não faz nada
        if (!origin || !destination) return;
    
        const request = {
            origin: origin,
            destination: destination,
            waypoints: waypoints,
            travelMode: google.maps.TravelMode.DRIVING,
            avoidTolls: true,
        };
    
        directionsService
            .route(request)
            .then((result) => {
                directionsRenderer.setDirections(result);
            })
            .catch((e) => {
                alert("Could not display directions due to: " + e);
            });
    }
    
    // Transforma o valor fornecido no parâmetro "text" em um array de LatLng:
    //   Formato fornecido: 
    //      (lat,lng),(lat,lng)
    //
    //   Formato de resposta: 
    //      [
    //          {lat: number, lng: number}, 
    //          {lat: number, lng: number}
    //      ]
    function parseStoredCoordinates(text) {
        const result = [];
    
        if (text) {
            const reg = /[-+]?\d+(\.\d+)?,\s?[-+]?\d+(\.\d+)?\b/g;
            while ((match = reg.exec(text)) !== null) {
                const coordArray = match[0].split(',');
                result.push({
                    location: {
                        lat: parseFloat(coordArray[0]),
                        lng: parseFloat(coordArray[1])
                    }, stopover: false
                });
            }
        }
        return result;
    }
    
    // Formata o array de coordenadas fornecido no parâmetro "coordinates" para o formato (lat,lng),(lat,lng)
    function formatCoordinates(coordinates) {
        const arr = []
        if (coordinates) {
            for (let index = 0; index < coordinates.length; index++) {
                arr.push("(" + coordinates[index].lat() + "," + coordinates[index].lng() + ")");
            }
        }
        return arr.join(",");
    }
    
    // Retorna todas as coordenadas que compõe o trajeto (path) do resultado
    // do cálculo de rota fornecido no parâmetro "directionResult".
    function getPathCoordinates(directionResult) {
        const myroute = directionResult.routes[0];
        if (!myroute) return;
        return myroute.overview_path;
    }
    
    // Retorna as coordenadas dos waypoints (desvios) do trajeto  do resultado
    // do cálculo de rota fornecido no parâmetro "directionResult".
    function getWaypointsCoordinates(directionResult) {
        const myroute = directionResult.routes[0];
        if (!myroute) return;
    
        const coordinates = [];
    
        for (let legIndex = 0; legIndex < myroute.legs.length; legIndex++) {
            const leg = myroute.legs[legIndex];
            // Armazena waipoints
            for (let wpIndex = 0; wpIndex < leg.via_waypoint.length; wpIndex++) {
                coordinates.push(leg.via_waypoint[wpIndex].location);
            }
        }
        return coordinates;
    }
    
    // Retorna o endereço de origem do trajeto do resultado
    // do cálculo de rota fornecido no parâmetro "directionResult".
    function getEndAddress(directionResult, legIndex) {
        const myroute = directionResult.routes[0];
        if (!myroute) return;
    
        const myLeg = myroute.legs[legIndex || 0];
        if (!myLeg) return;
    
        return myLeg.end_address;
    }
    
    // Retorna o endereço de destino do trajeto do resultado
    // do cálculo de rota fornecido no parâmetro "directionResult".
    function getStartAddress(directionResult, legIndex) {
        const myroute = directionResult.routes[0];
        if (!myroute) return;
    
        const myLeg = myroute.legs[legIndex || 0];
        if (!myLeg) return;
    
        return myLeg.start_address;
    }
    
    // Todas as funções acima são "privadas", e não pode ser chamadas externamente.
    // A única função que pode ser chamada de externamente são as que compões o resultado a seguir:
    return {
        // Faz o calculo de rota uilizando os campos 
        // do formulário como critérios de pesquisa.
        route: calculateRoute
    }
    })();
    
    window.onload = initMap;