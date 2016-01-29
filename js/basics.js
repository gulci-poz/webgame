// gulci's aside
// undone w atom ma osobny stos dla każdego pliku
// firefox i chrome obsługują mp3 i ogg
// reload dla web serwera atom idzie na wszystkie przeglądarki, nie tylko na chrome, który uruchamia się automatycznie przy odpaleniu serwera

(function () {

// obiekt zdarzenia jest przekazywany do funkcji jako pierwszy parametr
// onload używamy w html i przypisujemy wtedy wykonanie funkcji

document.addEventListener("DOMContentLoaded", bodyLoaded, false);

// ewentualnie
//window.addEventListener("load", bodyLoaded, false);

function bodyLoaded() {

    // rozmiary canvas muszą być zdefniowane w html w tagu canvas, w css ustawiamy rozmiar boksa; jeśli nie ustalimy rozmiaru w html, a zrobimy to w css, to dostaniemy rozciągnięty obraz

    var canvas = document.getElementById("gameCanvas");
    var context = canvas.getContext("2d");

    // współrzędne od top left corner - x w prawo, y w dół

    context.fillRect(200, 10, 100, 100);
    context.fillRect(50, 70, 90, 30);

    context.strokeRect(110, 10, 50, 50);
    context.strokeRect(30, 10, 50, 50);

    // przeźroczysty prostokąt
    context.clearRect(210, 20, 30, 20);
    context.clearRect(260, 20, 30, 20);

    // opcjonalnie używamy closePath() - nie musimy zamykać ścieżek
    // po wyrysowaniu ścieżki (otwartej lub zamkniętej) musimy ją obrysować - stroke() lub wypełnić - fill()
    // fill() automatycznie zamyka ścieżkę

    context.beginPath();
    context.moveTo(10, 120);
    context.lineTo(10, 180);
    context.lineTo(110, 150);
    context.fill();

    context.beginPath();
    context.moveTo(140, 160);
    context.lineTo(140, 220);
    context.lineTo(40, 190);
    context.closePath();
    context.stroke();

    context.beginPath();
    context.moveTo(160, 160);
    context.lineTo(170, 220);
    context.lineTo(240, 210);
    context.lineTo(260, 170);
    context.lineTo(190, 140);
    context.closePath();
    context.stroke();

    // zaczynamy od godziny trzeciej
    // dla anticlockwise rysujemy dopełnienie zadanego kąta w anticlockwise

    context.beginPath();
    context.arc(100, 300, 40, 0, Math.PI * 0.5, false);
    context.stroke();

    context.beginPath();
    context.arc(100, 300, 45, 0, Math.PI * 0.5, true);
    context.stroke();

    context.beginPath();
    context.arc(100, 300, 30, 0, Math.PI * 2, false);
    context.fill();

    context.beginPath();
    context.arc(200, 300, 25, 0, Math.PI * 1.5, false);
    context.stroke();

    context.beginPath();
    context.arc(200, 300, 20, 0, Math.PI * 1.5, true);
    context.stroke();

    // w font można używać właściwości CSS

    context.font = "16pt 'DejaVu Sans Mono'";
    context.fillText("test", 330, 40);
    context.font = "20pt 'DejaVu Sans Mono'";
    context.fillText("test", 330, 80);
    context.font = "24pt 'DejaVu Sans Mono'";
    context.strokeText("test", 330, 120);

    // fillStyle() i strokeStyle() aplikują dla wszystkich operacji fill: fillRect(), fillText(), fill()
    // można podawać wartości kolorów zgodne z CSS: rgb(), rgba(), stała

    context.fillStyle = "red";
    context.fillRect(310, 160, 100, 50);

    context.strokeStyle = "green";
    context.strokeRect(310, 240, 100, 50);

    context.fillStyle = "rgb(255, 0, 0)";
    context.fillRect(420, 160, 100, 50);

    // domyślnie rysujemy w blend mode normal

    context.fillStyle = "rgba(0, 255, 0, 0.6)";
    context.fillRect(450, 180, 100, 50);

    // przez HTML
    // ukrywamy element z img za pomocą visibility: hidden w CSS
    // alternatywnie, możemy użyć display: none wtedy nie rezerwujemy miejsca na stronie na blok img
    //<img src="img/spaceship.png" id="spaceship">
    //var image = document.getElementById("spaceship");

    // przez JS (można opakować w loader), musi być funkcja onload()

    var imageLoader = {
        loaded: true,
        loadedImages: 0,
        totalImages: 0,
        load: function(url) {
            var self = this;
            this.totalImages++;
            this.loaded = false;
            var image = new Image();
            document.body.appendChild(image);
            image.id = "spaceship";

            image.onload = function () {
                self.loadedImages++;
                if(self.loadedImages == self.totalImages) {
                    self.loaded = true;
                }

                plotImage();
            }

            image.src = url;

            return image;
        }

    };

    var image = imageLoader.load("img/spaceship.png");

    // ten kod musimy uruchomić w onload() ponieważ ładujemy obraz w JS
    // dla przejrzystości kod opakowuję w funkcję

    function plotImage() {

        context.drawImage(image, 0, 350);

        // skalowanie do podanych wymiarów 100 i 25
        context.drawImage(image, 0, 400, 100, 25);

        // możliwość wykrojenia ze sprite'a
        // 0, 0 - sourceX, sourceY - początek w źródle
        // 60, 50 - sourceWidth, sourceHeight - rozmiar wykrojenia (clip)
        // 0, 420 - x, y - umiejscowienie na canvas
        // 60, 50 - rozmiar po wyskalowaniu (tutaj taki sam, bez skalowania)
        context.drawImage(image, 0, 0, 60, 50, 0, 420, 60, 50);

        // translate() - przesuwanie canvas i jego origin do wskazanego punktu
        // rotate() - obracanie canvas clockwise wokół obecnego origin

        context.translate(250, 370);
        context.rotate(Math.PI * 0.25);
        // dla skali podajemy krotność wymiarów
        //context.scale(1.5, 1.5);

        // -30, -25 - żeby można było obracać obrazek względem jego środka
        context.drawImage(image, 0, 0, 60, 50, -30, -25, 60, 50);

        // robimy restore canvas do początkowego położenia i obrotu
        context.rotate(-Math.PI * 0.25);
        context.translate(-250, -370);

        context.translate(310, 370);
        context.rotate(Math.PI * 0.5);
        context.drawImage(image, 0, 0, 60, 50, -30, -25, 60, 50);
        context.rotate(-Math.PI * 0.5);
        context.translate(-310, -370);

        // zapisujemy stan na stos

        context.save();
        context.translate(370, 370);
        context.rotate(Math.PI * 0.75);
        context.drawImage(image, 0, 0, 60, 50, -30, -25, 60, 50);
        context.restore();

        context.save();
        context.translate(430, 370);
        context.rotate(Math.PI);
        context.drawImage(image, 0, 0, 60, 50, -30, -25, 60, 50);
        context.restore();

    }

    // możemy zagnieździć audio w html lub za pomocą JS
    // audio w html
    /*
    <audio src="audio/music.mp3" controls="controls" preload autoplay loop>
        Your browser does not support audio tag.
    </audio>

    <audio controls="controls">
        <source src="audio/music.mp3" type="audio/mpeg" />
        <source src="audio/music.ogg" type="audio/ogg" />
        Your browser does not support audio tag.
    </audio>
    */

    // audio w JS
    var audio = document.createElement("audio");
    document.body.appendChild(audio);
    var mp3Support, oggSupport;

    // obiekt audio ma metodę canPlayType() która zwraca "", "maybe" lub "probably"; wykonujemy jeśli przeglądarka obsługuje audio, inaczej - else
    if (audio.canPlayType) {
        // inequality ma większy priorytet, wykonuje się left-to-right
        // zmienna przechowuje boolean
        mp3Support = "" != audio.canPlayType("audio/mpeg");
        oggSupport = "" != audio.canPlayType('audio/ogg; codecs="vorbis"');
    } else {
        mp3Support = false;
        oggSupport = false;
    }

    // ? - if, : - else
    // jeśli oggSupport jest true to rozszerzenie jest ogg, jeśli nie, to sprawdzamy czy mp3Support jest true, a jeśli to też jest false, to przypisujemy undefined
    // ten conditional jest right-to-left, a więc to sprawdzenie będzie wykonywanie odwrotnie
    var soundFileExtn = oggSupport?".ogg":mp3Support?".mp3":undefined;

    // kiedy plik jest gotowy do odegrania obiekt audio uruchamia zdarzenie canplaythrough
    if (soundFileExtn) {
        // mamy już element audio dodany do DOM
        //var audio = new Audio();

        audio.addEventListener("canplaythrough", function () {
            // domyślnie jest zapewne auto preload, bo ładuje nam się audio
            // nie ma controls, autoplay i loop

            // uruchamiamy play() więc nie ma sensu ustawiać autoplay
            audio.play();
        });
        audio.src = "audio/music" + soundFileExtn;
        // do ustawiania atrybutów element audio musi być dodany do DOM (np. do body) za pomocą appendChild()
        audio.controls = true;
        // lub za pomocą setAttribute()
        //audio.setAttribute("controls", "controls");
    }

    // preload jest ignorowane jeśli autoplay jest ustawione
    // sposób ładowania (buforowania) audio w czasie ładowania strony: auto, none, metadata

}

}());
